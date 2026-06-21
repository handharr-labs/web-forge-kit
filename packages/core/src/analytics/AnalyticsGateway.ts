export interface AnalyticsEvent {
  readonly name: string;
  readonly properties?: Record<string, unknown>;
}

export interface AnalyticsGateway {
  track(event: AnalyticsEvent): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  reset(): void;
}
