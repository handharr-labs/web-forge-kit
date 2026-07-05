import { isApiError } from "./ApiError";
import type { ApiClient, RequestOptions } from "./ApiClient";
import type { TokenService } from "./TokenService";

type ParamValue = string | number | boolean;

/**
 * Decorator over ApiClient that:
 * 1. Injects Authorization header on every request.
 * 2. On 401 — refreshes the token once and retries.
 * 3. Deduplicates concurrent refresh calls — N simultaneous 401s trigger
 *    exactly one refresh; all N requests then retry with the new token.
 * 4. If refresh fails — calls tokenService.onRefreshFailed() and re-throws.
 */
export class AuthenticatedApiClient implements ApiClient {
  private refreshPromise: Promise<string> | null = null;

  constructor(
    private readonly inner: ApiClient,
    private readonly tokenService: TokenService
  ) {}

  async get<T>(
    path: string,
    params?: Record<string, ParamValue | ParamValue[]>,
    opts?: RequestOptions
  ): Promise<T> {
    return this.withRetry(
      (authedOpts) => this.inner.get<T>(path, params, authedOpts),
      opts
    );
  }

  async post<TBody, TResponse>(path: string, body: TBody, opts?: RequestOptions): Promise<TResponse> {
    return this.withRetry(
      (authedOpts) => this.inner.post<TBody, TResponse>(path, body, authedOpts),
      opts
    );
  }

  async put<TBody, TResponse>(path: string, body: TBody, opts?: RequestOptions): Promise<TResponse> {
    return this.withRetry(
      (authedOpts) => this.inner.put<TBody, TResponse>(path, body, authedOpts),
      opts
    );
  }

  async patch<TBody, TResponse>(path: string, body: TBody, opts?: RequestOptions): Promise<TResponse> {
    return this.withRetry(
      (authedOpts) => this.inner.patch<TBody, TResponse>(path, body, authedOpts),
      opts
    );
  }

  async delete<T>(path: string, opts?: RequestOptions): Promise<T> {
    return this.withRetry(
      (authedOpts) => this.inner.delete<T>(path, authedOpts),
      opts
    );
  }

  private async withRetry<T>(
    call: (opts: RequestOptions) => Promise<T>,
    opts?: RequestOptions
  ): Promise<T> {
    const token = await this.tokenService.getAccessToken();

    try {
      return await call(this.injectToken(opts, token));
    } catch (error) {
      if (!isApiError(error) || error.code !== "UNAUTHORIZED") throw error;
      if (opts?.signal?.aborted) throw error;

      try {
        const newToken = await this.getOrStartRefresh();
        return await call(this.injectToken(opts, newToken));
      } catch (refreshError) {
        this.tokenService.onRefreshFailed();
        throw refreshError;
      }
    }
  }

  private getOrStartRefresh(): Promise<string> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.tokenService
        .refresh()
        .finally(() => { this.refreshPromise = null; });
    }
    return this.refreshPromise;
  }

  private injectToken(opts: RequestOptions | undefined, token: string): RequestOptions {
    return {
      ...opts,
      headers: { ...opts?.headers, Authorization: `Bearer ${token}` },
    };
  }
}
