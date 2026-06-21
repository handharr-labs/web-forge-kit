import type { LogContext, Logger } from "./Logger";

export class ConsoleLogger implements Logger {
  constructor(private readonly baseContext: LogContext = {}) {}

  debug(message: string, context?: LogContext): void {
    console.debug(this.format("DEBUG", message), this.merge(context));
  }

  info(message: string, context?: LogContext): void {
    console.info(this.format("INFO", message), this.merge(context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.format("WARN", message), this.merge(context));
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    console.error(this.format("ERROR", message), this.merge(context));
    if (error) console.error(error);
  }

  child(context: LogContext): Logger {
    return new ConsoleLogger({ ...this.baseContext, ...context });
  }

  private format(level: string, message: string): string {
    return `[${level}] ${message}`;
  }

  private merge(context?: LogContext): LogContext {
    return { ...this.baseContext, ...context };
  }
}
