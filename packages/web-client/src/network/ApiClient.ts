import { ApiError } from "./ApiError";

type ParamValue = string | number | boolean;

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Next.js fetch extensions — revalidation, cache strategy */
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: RequestCache;
}

export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  /** Request timeout in milliseconds. Defaults to 30000. */
  timeoutMs?: number;
}

export interface ApiClient {
  get<T>(path: string, params?: Record<string, ParamValue | ParamValue[]>, opts?: RequestOptions): Promise<T>;
  post<TBody, TResponse>(path: string, body: TBody, opts?: RequestOptions): Promise<TResponse>;
  put<TBody, TResponse>(path: string, body: TBody, opts?: RequestOptions): Promise<TResponse>;
  patch<TBody, TResponse>(path: string, body: TBody, opts?: RequestOptions): Promise<TResponse>;
  delete<T>(path: string, opts?: RequestOptions): Promise<T>;
}

const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH"]);
const DEFAULT_TIMEOUT_MS = 30_000;

export class FetchApiClient implements ApiClient {
  constructor(private readonly config: ApiClientConfig) {}

  async get<T>(
    path: string,
    params?: Record<string, ParamValue | ParamValue[]>,
    opts?: RequestOptions
  ): Promise<T> {
    return this.request<T>(path, { method: "GET" }, opts, params);
  }

  async post<TBody, TResponse>(path: string, body: TBody, opts?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>(path, { method: "POST", body: JSON.stringify(body) }, opts);
  }

  async put<TBody, TResponse>(path: string, body: TBody, opts?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>(path, { method: "PUT", body: JSON.stringify(body) }, opts);
  }

  async patch<TBody, TResponse>(path: string, body: TBody, opts?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>(path, { method: "PATCH", body: JSON.stringify(body) }, opts);
  }

  async delete<T>(path: string, opts?: RequestOptions): Promise<T> {
    return this.request<T>(path, { method: "DELETE" }, opts);
  }

  private buildUrl(path: string, params?: Record<string, ParamValue | ParamValue[]>): URL {
    try {
      const url = new URL(path, this.config.baseUrl);
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          const values = Array.isArray(value) ? value : [value];
          for (const v of values) {
            url.searchParams.append(key, String(v));
          }
        }
      }
      return url;
    } catch {
      throw ApiError.invalidUrl();
    }
  }

  private async request<T>(
    path: string,
    init: RequestInit,
    opts?: RequestOptions,
    params?: Record<string, ParamValue | ParamValue[]>
  ): Promise<T> {
    const url = this.buildUrl(path, params);
    const method = (init.method ?? "GET").toUpperCase();
    const hasBody = METHODS_WITH_BODY.has(method);

    const headers: Record<string, string> = {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...this.config.defaultHeaders,
      ...opts?.headers,
    };

    const timeoutMs = this.config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

    // Merge caller signal with timeout signal
    const signal = opts?.signal
      ? anySignal([opts.signal, timeoutController.signal])
      : timeoutController.signal;

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        ...init,
        headers,
        signal,
        ...(opts?.next ? { next: opts.next } : {}),
        ...(opts?.cache ? { cache: opts.cache } : {}),
      });
    } catch (cause) {
      if (isAbortError(cause)) {
        if (timeoutController.signal.aborted && opts?.signal?.aborted !== true) {
          throw ApiError.timeout();
        }
        throw ApiError.aborted();
      }
      throw ApiError.networkError(cause);
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      switch (response.status) {
        case 401: throw ApiError.unauthorized();
        case 403: throw ApiError.forbidden();
        case 404: throw ApiError.notFound();
        case 409: throw ApiError.conflict();
        case 422: throw ApiError.unprocessable();
        case 429: throw ApiError.rateLimited();
        default:  throw ApiError.serverError(response.status);
      }
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return undefined as T;
    }

    try {
      return (await response.json()) as T;
    } catch (cause) {
      throw ApiError.decodingFailed(cause);
    }
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

/** Aborts as soon as any one of the provided signals aborts. */
function anySignal(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      break;
    }
    signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
  }
  return controller.signal;
}
