interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}
