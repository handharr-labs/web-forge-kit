import type { ApiClient, RequestOptions } from "./ApiClient";

type ParamValue = string | number | boolean;

export interface RequestContext {
  readonly method: string;
  readonly path: string;
  readonly params?: Record<string, ParamValue | ParamValue[]>;
  readonly body?: unknown;
  readonly options?: RequestOptions;
  readonly startedAt: number;
}

export interface HttpInterceptor {
  onRequest?(ctx: RequestContext): RequestContext | Promise<RequestContext>;
  onResponse?<T>(response: T, ctx: RequestContext): T | Promise<T>;
  onError?(error: unknown, ctx: RequestContext): never;
}

/**
 * Decorator over ApiClient that runs a chain of HttpInterceptors.
 * Interceptors run in order on request, reverse order on response.
 *
 * Common uses: request logging, response timing, error reporting.
 */
export class InterceptingApiClient implements ApiClient {
  constructor(
    private readonly inner: ApiClient,
    private readonly interceptors: HttpInterceptor[]
  ) {}

  async get<T>(
    path: string,
    params?: Record<string, ParamValue | ParamValue[]>,
    opts?: RequestOptions
  ): Promise<T> {
    return this.intercept("GET", path, undefined, opts, (o) =>
      this.inner.get<T>(path, params, o), { params }
    );
  }

  async post<TBody, TResponse>(path: string, body: TBody, opts?: RequestOptions): Promise<TResponse> {
    return this.intercept("POST", path, body, opts, (o) =>
      this.inner.post<TBody, TResponse>(path, body, o)
    );
  }

  async put<TBody, TResponse>(path: string, body: TBody, opts?: RequestOptions): Promise<TResponse> {
    return this.intercept("PUT", path, body, opts, (o) =>
      this.inner.put<TBody, TResponse>(path, body, o)
    );
  }

  async patch<TBody, TResponse>(path: string, body: TBody, opts?: RequestOptions): Promise<TResponse> {
    return this.intercept("PATCH", path, body, opts, (o) =>
      this.inner.patch<TBody, TResponse>(path, body, o)
    );
  }

  async delete<T>(path: string, opts?: RequestOptions): Promise<T> {
    return this.intercept("DELETE", path, undefined, opts, (o) =>
      this.inner.delete<T>(path, o)
    );
  }

  private async intercept<T>(
    method: string,
    path: string,
    body: unknown,
    opts: RequestOptions | undefined,
    call: (opts: RequestOptions | undefined) => Promise<T>,
    extra: Partial<RequestContext> = {}
  ): Promise<T> {
    let ctx: RequestContext = {
      method, path, body, options: opts, startedAt: Date.now(), ...extra,
    };

    for (const i of this.interceptors) {
      if (i.onRequest) ctx = await i.onRequest(ctx);
    }

    let response: T;
    try {
      response = await call(ctx.options);
    } catch (error) {
      for (const i of [...this.interceptors].reverse()) {
        if (i.onError) i.onError(error, ctx);
      }
      throw error;
    }

    for (const i of [...this.interceptors].reverse()) {
      if (i.onResponse) response = await i.onResponse(response, ctx);
    }

    return response;
  }
}

// --- Built-in interceptors ---

export class LoggingInterceptor implements HttpInterceptor {
  constructor(private readonly logger: { info(msg: string, ctx?: object): void }) {}

  onRequest(ctx: RequestContext): RequestContext {
    this.logger.info(`→ ${ctx.method} ${ctx.path}`);
    return ctx;
  }

  onResponse<T>(response: T, ctx: RequestContext): T {
    const ms = Date.now() - ctx.startedAt;
    this.logger.info(`← ${ctx.method} ${ctx.path} ${ms}ms`);
    return response;
  }

  onError(error: unknown, ctx: RequestContext): never {
    const ms = Date.now() - ctx.startedAt;
    this.logger.info(`✗ ${ctx.method} ${ctx.path} ${ms}ms`);
    throw error;
  }
}
