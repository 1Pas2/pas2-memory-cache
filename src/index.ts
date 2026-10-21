export class MemoryCache<K, V> {
  private readonly entries = new Map<K, { value: V; expires: number }>();
  constructor(
    readonly maxEntries = 100,
    private readonly clock: () => number = Date.now,
  ) {
    if (!Number.isSafeInteger(maxEntries) || maxEntries < 1)
      throw new RangeError("Invalid capacity");
  }
  set(key: K, value: V, ttlMs: number): void {
    if (!Number.isFinite(ttlMs) || ttlMs < 0)
      throw new RangeError("Invalid TTL");
    this.prune();
    this.entries.delete(key);
    if (this.entries.size >= this.maxEntries)
      this.entries.delete(this.entries.keys().next().value!);
    this.entries.set(key, { value, expires: this.clock() + ttlMs });
  }
  get(key: K): V | undefined {
    const item = this.entries.get(key);
    if (!item) return undefined;
    if (item.expires <= this.clock()) {
      this.entries.delete(key);
      return undefined;
    }
    return item.value;
  }
  has(key: K): boolean {
    const item = this.entries.get(key);
    if (!item) return false;
    if (item.expires <= this.clock()) {
      this.entries.delete(key);
      return false;
    }
    return true;
  }
  delete(key: K): boolean {
    return this.entries.delete(key);
  }
  clear(): void {
    this.entries.clear();
  }
  prune(): number {
    let n = 0;
    const now = this.clock();
    for (const [key, item] of this.entries)
      if (item.expires <= now) {
        this.entries.delete(key);
        n++;
      }
    return n;
  }
  get size(): number {
    this.prune();
    return this.entries.size;
  }
}
