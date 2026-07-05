export interface TokenService {
  /** Returns the current access token, refreshing silently if near expiry. */
  getAccessToken(): Promise<string>;
  /** Forces a token refresh. Called by AuthenticatedApiClient on 401. */
  refresh(): Promise<string>;
  /** Called when refresh fails — e.g. redirect to login. */
  onRefreshFailed(): void;
}
