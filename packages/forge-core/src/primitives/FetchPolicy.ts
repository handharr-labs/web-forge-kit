export interface FetchPolicy {
  /** If true, bypass cache and always fetch from network. */
  readonly force: boolean;
  /** If true, return stale cache data when network is unavailable. */
  readonly allowStale: boolean;
}

const fresh: FetchPolicy = { force: true, allowStale: false };
const cached: FetchPolicy = { force: false, allowStale: true };
const strict: FetchPolicy = { force: false, allowStale: false };

export const FetchPolicies = { fresh, cached, strict } as const;
