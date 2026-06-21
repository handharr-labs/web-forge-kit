import type { AnalyticsEvent, AnalyticsGateway } from "./AnalyticsGateway";

export class NoOpAnalyticsGateway implements AnalyticsGateway {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  track(_event: AnalyticsEvent): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  identify(_userId: string, _traits?: Record<string, unknown>): void {}
  reset(): void {}
}
