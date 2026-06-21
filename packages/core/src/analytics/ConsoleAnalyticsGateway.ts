import type { AnalyticsEvent, AnalyticsGateway } from "./AnalyticsGateway";

export class ConsoleAnalyticsGateway implements AnalyticsGateway {
  track(event: AnalyticsEvent): void {
    console.log("[Analytics] track:", event.name, event.properties ?? {});
  }

  identify(userId: string, traits?: Record<string, unknown>): void {
    console.log("[Analytics] identify:", userId, traits ?? {});
  }

  reset(): void {
    console.log("[Analytics] reset");
  }
}
