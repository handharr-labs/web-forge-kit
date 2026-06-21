// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventMap = Record<string, any>;
type Handler<T> = (payload: T) => void;

export interface EventBus<TEventMap extends EventMap> {
  /** Subscribe. Returns an unsubscribe function — call it in useEffect cleanup. */
  on<K extends keyof TEventMap>(event: K, handler: Handler<TEventMap[K]>): () => void;
  /** Subscribe once — auto-unsubscribes after first emit. */
  once<K extends keyof TEventMap>(event: K, handler: Handler<TEventMap[K]>): () => void;
  /** Unsubscribe. */
  off<K extends keyof TEventMap>(event: K, handler: Handler<TEventMap[K]>): void;
  /** Publish. */
  emit<K extends keyof TEventMap>(event: K, payload: TEventMap[K]): void;
}

export class InMemoryEventBus<TEventMap extends EventMap> implements EventBus<TEventMap> {
  private handlers = new Map<keyof TEventMap, Set<Handler<unknown>>>();

  on<K extends keyof TEventMap>(event: K, handler: Handler<TEventMap[K]>): () => void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler as Handler<unknown>);
    return () => this.off(event, handler);
  }

  once<K extends keyof TEventMap>(event: K, handler: Handler<TEventMap[K]>): () => void {
    const wrapper: Handler<TEventMap[K]> = (payload) => {
      handler(payload);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  off<K extends keyof TEventMap>(event: K, handler: Handler<TEventMap[K]>): void {
    this.handlers.get(event)?.delete(handler as Handler<unknown>);
  }

  emit<K extends keyof TEventMap>(event: K, payload: TEventMap[K]): void {
    this.handlers.get(event)?.forEach((h) => h(payload));
  }
}
