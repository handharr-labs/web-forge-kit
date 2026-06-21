import type { LogContext, Logger } from "./Logger";

export class NoOpLogger implements Logger {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  debug(_message: string, _context?: LogContext): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(_message: string, _context?: LogContext): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(_message: string, _context?: LogContext): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(_message: string, _error?: unknown, _context?: LogContext): void {}
  child(_context: LogContext): Logger { return this; }
}
