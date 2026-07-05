export type WebSocketState = "connecting" | "open" | "closing" | "closed";

export interface WebSocketClient {
  connect(url: string, protocols?: string[]): void;
  disconnect(): void;
  send<T>(data: T): void;
  onOpen(handler: () => void): () => void;
  onMessage<T>(handler: (data: T) => void): () => void;
  onError(handler: (event: Event) => void): () => void;
  onClose(handler: (event: CloseEvent) => void): () => void;
  readonly state: WebSocketState;
}

export class BrowserWebSocketClient implements WebSocketClient {
  private socket: WebSocket | null = null;
  private openHandlers = new Set<() => void>();
  private messageHandlers = new Set<(data: unknown) => void>();
  private errorHandlers = new Set<(event: Event) => void>();
  private closeHandlers = new Set<(event: CloseEvent) => void>();

  get state(): WebSocketState {
    switch (this.socket?.readyState) {
      case WebSocket.CONNECTING: return "connecting";
      case WebSocket.OPEN:       return "open";
      case WebSocket.CLOSING:    return "closing";
      default:                   return "closed";
    }
  }

  connect(url: string, protocols?: string[]): void {
    if (this.socket && this.state !== "closed") this.disconnect();

    this.socket = protocols ? new WebSocket(url, protocols) : new WebSocket(url);

    this.socket.onopen    = () => this.openHandlers.forEach((h) => h());
    this.socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data as string);
        this.messageHandlers.forEach((h) => h(data));
      } catch {
        this.messageHandlers.forEach((h) => h(e.data));
      }
    };
    this.socket.onerror = (e) => this.errorHandlers.forEach((h) => h(e));
    this.socket.onclose = (e) => this.closeHandlers.forEach((h) => h(e));
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
  }

  send<T>(data: T): void {
    if (this.state !== "open") throw new Error("WebSocket is not open");
    this.socket!.send(JSON.stringify(data));
  }

  onOpen(handler: () => void): () => void {
    this.openHandlers.add(handler);
    return () => this.openHandlers.delete(handler);
  }

  onMessage<T>(handler: (data: T) => void): () => void {
    const h = handler as (data: unknown) => void;
    this.messageHandlers.add(h);
    return () => this.messageHandlers.delete(h);
  }

  onError(handler: (event: Event) => void): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  onClose(handler: (event: CloseEvent) => void): () => void {
    this.closeHandlers.add(handler);
    return () => this.closeHandlers.delete(handler);
  }
}

// --- Reconnecting decorator with exponential backoff ---

export interface ReconnectConfig {
  maxAttempts?: number;   // default 5
  baseDelayMs?: number;   // default 1000
  maxDelayMs?: number;    // default 30000
}

export class ReconnectingWebSocketClient implements WebSocketClient {
  private attempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private currentUrl = "";
  private currentProtocols?: string[];

  constructor(
    private readonly inner: BrowserWebSocketClient,
    private readonly config: ReconnectConfig = {}
  ) {}

  get state(): WebSocketState { return this.inner.state; }

  connect(url: string, protocols?: string[]): void {
    this.currentUrl = url;
    this.currentProtocols = protocols;
    this.attempts = 0;
    this.inner.connect(url, protocols);
    this.inner.onClose((e) => {
      if (e.wasClean) return;
      this.scheduleReconnect();
    });
  }

  disconnect(): void {
    this.cancelReconnect();
    this.inner.disconnect();
  }

  send<T>(data: T): void { this.inner.send(data); }
  onOpen(h: () => void): () => void { return this.inner.onOpen(h); }
  onMessage<T>(h: (data: T) => void): () => void { return this.inner.onMessage(h); }
  onError(h: (e: Event) => void): () => void { return this.inner.onError(h); }
  onClose(h: (e: CloseEvent) => void): () => void { return this.inner.onClose(h); }

  private scheduleReconnect(): void {
    const max = this.config.maxAttempts ?? 5;
    if (this.attempts >= max) return;

    const base = this.config.baseDelayMs ?? 1000;
    const cap  = this.config.maxDelayMs ?? 30_000;
    const delay = Math.min(base * 2 ** this.attempts, cap);
    this.attempts++;

    this.reconnectTimer = setTimeout(() => {
      this.inner.connect(this.currentUrl, this.currentProtocols);
    }, delay);
  }

  private cancelReconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.attempts = 0;
  }
}
