import { FetchPolicies, type FetchPolicy } from "./FetchPolicy";

export interface Request<TQuery, TPath = void> {
  readonly query: TQuery;
  readonly path: TPath;
  readonly policy: FetchPolicy;
}

export function createRequest<TQuery, TPath = void>(
  query: TQuery,
  path: TPath,
  policy: FetchPolicy = FetchPolicies.fresh
): Request<TQuery, TPath> {
  return { query, path, policy };
}

export function createQueryRequest<TQuery>(
  query: TQuery,
  policy: FetchPolicy = FetchPolicies.fresh
): Request<TQuery, void> {
  return { query, path: undefined as void, policy };
}

export function createPathRequest<TPath>(
  path: TPath,
  policy: FetchPolicy = FetchPolicies.fresh
): Request<void, TPath> {
  return { query: undefined as void, path, policy };
}
