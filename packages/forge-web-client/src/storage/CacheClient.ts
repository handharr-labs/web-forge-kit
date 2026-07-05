export interface CacheEntry<T> {
  readonly value: T;
  readonly expiresAt: number | null; // ms epoch, null = no expiry
}

export interface CacheClient {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttlMs?: number): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
}

// --- In-memory (default — SSR safe, lost on reload) ---

export class InMemoryCacheClient implements CacheClient {
  private store = new Map<string, CacheEntry<unknown>>();

  constructor(private readonly namespace?: string) {}

  get<T>(key: string): T | null {
    const entry = this.store.get(this.ns(key));
    if (!entry) return null;
    if (this.isExpired(entry)) {
      this.store.delete(this.ns(key));
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    this.store.set(this.ns(key), {
      value,
      expiresAt: ttlMs != null ? Date.now() + ttlMs : null,
    });
  }

  remove(key: string): void {
    this.store.delete(this.ns(key));
  }

  clear(): void {
    if (!this.namespace) {
      this.store.clear();
      return;
    }
    for (const key of this.store.keys()) {
      if (key.startsWith(this.namespace + ":")) this.store.delete(key);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  private ns(key: string): string {
    return this.namespace ? `${this.namespace}:${key}` : key;
  }

  private isExpired(entry: CacheEntry<unknown>): boolean {
    return entry.expiresAt !== null && Date.now() > entry.expiresAt;
  }
}

// --- localStorage (client-side only, survives reload) ---

export class LocalStorageCacheClient implements CacheClient {
  constructor(private readonly namespace: string) {}

  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(this.ns(key));
    if (!raw) return null;
    try {
      const entry: CacheEntry<T> = JSON.parse(raw);
      if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
        localStorage.removeItem(this.ns(key));
        return null;
      }
      return entry.value;
    } catch {
      localStorage.removeItem(this.ns(key));
      return null;
    }
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    if (typeof window === "undefined") return;
    const entry: CacheEntry<T> = {
      value,
      expiresAt: ttlMs != null ? Date.now() + ttlMs : null,
    };
    try {
      localStorage.setItem(this.ns(key), JSON.stringify(entry));
    } catch {
      // Storage quota exceeded — fail silently, cache is best-effort
    }
  }

  remove(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.ns(key));
  }

  clear(): void {
    if (typeof window === "undefined") return;
    const prefix = this.namespace + ":";
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k?.startsWith(prefix)) localStorage.removeItem(k);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  private ns(key: string): string {
    return `${this.namespace}:${key}`;
  }
}

// --- sessionStorage (client-side only, cleared on tab close) ---

export class SessionStorageCacheClient implements CacheClient {
  constructor(private readonly namespace: string) {}

  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(this.ns(key));
    if (!raw) return null;
    try {
      const entry: CacheEntry<T> = JSON.parse(raw);
      if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
        sessionStorage.removeItem(this.ns(key));
        return null;
      }
      return entry.value;
    } catch {
      sessionStorage.removeItem(this.ns(key));
      return null;
    }
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    if (typeof window === "undefined") return;
    const entry: CacheEntry<T> = {
      value,
      expiresAt: ttlMs != null ? Date.now() + ttlMs : null,
    };
    try {
      sessionStorage.setItem(this.ns(key), JSON.stringify(entry));
    } catch {
      // Storage quota exceeded — fail silently
    }
  }

  remove(key: string): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(this.ns(key));
  }

  clear(): void {
    if (typeof window === "undefined") return;
    const prefix = this.namespace + ":";
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const k = sessionStorage.key(i);
      if (k?.startsWith(prefix)) sessionStorage.removeItem(k);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  private ns(key: string): string {
    return `${this.namespace}:${key}`;
  }
}
