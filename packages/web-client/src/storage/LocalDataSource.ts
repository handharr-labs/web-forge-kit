export interface LocalDataSource<TKey, TValue> {
  get(key: TKey): TValue | null;
  save(key: TKey, value: TValue): void;
  remove(key: TKey): void;
  clear(): void;
}

export class InMemoryDataSource<TKey, TValue> implements LocalDataSource<TKey, TValue> {
  private store = new Map<TKey, TValue>();

  get(key: TKey): TValue | null {
    return this.store.get(key) ?? null;
  }

  save(key: TKey, value: TValue): void {
    this.store.set(key, value);
  }

  remove(key: TKey): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
