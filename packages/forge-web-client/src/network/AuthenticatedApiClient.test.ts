import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthenticatedApiClient } from "./AuthenticatedApiClient";
import { ApiError } from "./ApiError";
import type { ApiClient, RequestOptions } from "./ApiClient";
import type { TokenService } from "./TokenService";

function makeTokenService(overrides: Partial<TokenService> = {}): TokenService {
  return {
    getAccessToken: vi.fn().mockResolvedValue("token-1"),
    refresh: vi.fn().mockResolvedValue("token-2"),
    onRefreshFailed: vi.fn(),
    ...overrides,
  };
}

describe("AuthenticatedApiClient", () => {
  let inner: { get: ReturnType<typeof vi.fn> } & ApiClient;

  beforeEach(() => {
    inner = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    } as unknown as typeof inner;
  });

  it("injects the access token as a Bearer header", async () => {
    inner.get.mockResolvedValue({ ok: true });
    const client = new AuthenticatedApiClient(inner, makeTokenService());

    await client.get("/me");

    const opts = inner.get.mock.calls[0]![2] as RequestOptions;
    expect(opts.headers?.Authorization).toBe("Bearer token-1");
  });

  it("refreshes once on 401 then retries with the new token", async () => {
    inner.get
      .mockRejectedValueOnce(ApiError.unauthorized())
      .mockResolvedValueOnce({ ok: true });
    const tokens = makeTokenService();
    const client = new AuthenticatedApiClient(inner, tokens);

    const result = await client.get("/me");

    expect(result).toEqual({ ok: true });
    expect(tokens.refresh).toHaveBeenCalledOnce();
    const retryOpts = inner.get.mock.calls[1]![2] as RequestOptions;
    expect(retryOpts.headers?.Authorization).toBe("Bearer token-2");
  });

  it("deduplicates refresh across concurrent 401s — one refresh, all retried", async () => {
    inner.get.mockImplementation((_path, _params, opts?: RequestOptions) => {
      const auth = opts?.headers?.Authorization;
      return auth === "Bearer token-2"
        ? Promise.resolve({ ok: true })
        : Promise.reject(ApiError.unauthorized());
    });
    const tokens = makeTokenService();
    const client = new AuthenticatedApiClient(inner, tokens);

    const results = await Promise.all([
      client.get("/a"),
      client.get("/b"),
      client.get("/c"),
    ]);

    expect(results).toEqual([{ ok: true }, { ok: true }, { ok: true }]);
    expect(tokens.refresh).toHaveBeenCalledOnce();
  });

  it("calls onRefreshFailed and rethrows when refresh fails", async () => {
    inner.get.mockRejectedValue(ApiError.unauthorized());
    const refreshError = new Error("refresh dead");
    const tokens = makeTokenService({ refresh: vi.fn().mockRejectedValue(refreshError) });
    const client = new AuthenticatedApiClient(inner, tokens);

    await expect(client.get("/me")).rejects.toBe(refreshError);
    expect(tokens.onRefreshFailed).toHaveBeenCalledOnce();
  });

  it("does not retry on a non-401 error", async () => {
    inner.get.mockRejectedValue(ApiError.serverError(500));
    const tokens = makeTokenService();
    const client = new AuthenticatedApiClient(inner, tokens);

    await expect(client.get("/me")).rejects.toMatchObject({ code: "SERVER_ERROR" });
    expect(tokens.refresh).not.toHaveBeenCalled();
  });
});
