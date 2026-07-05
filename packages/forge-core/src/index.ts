// Env
export type { EnvField } from "./env/Env";
export { createEnv } from "./env/Env";

// Analytics
export type { AnalyticsEvent, AnalyticsGateway } from "./analytics/AnalyticsGateway";
export { ConsoleAnalyticsGateway } from "./analytics/ConsoleAnalyticsGateway";
export { NoOpAnalyticsGateway } from "./analytics/NoOpAnalyticsGateway";

// Primitives
export type { FetchPolicy } from "./primitives/FetchPolicy";
export { FetchPolicies } from "./primitives/FetchPolicy";
export type { Request } from "./primitives/Request";
export { createRequest, createQueryRequest, createPathRequest } from "./primitives/Request";
export type {
  Paginated,
  CursorPaginated,
  PageMeta,
  CursorMeta,
  PageParams,
  CursorParams,
} from "./primitives/Pagination";
export { buildPageMeta, DEFAULT_PAGE_PARAMS, DEFAULT_CURSOR_PARAMS } from "./primitives/Pagination";
export {
  DomainError,
  isDomainError,
  NotFoundError,
  ValidationError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  UnexpectedError,
} from "./primitives/DomainError";
export { humanizeError } from "./primitives/error-messages";

// Auth
export type {
  AuthProviderId,
  AuthUser,
  Session,
  AuthGateway,
  RevocableSessions,
  ProviderTokenAccess,
  OAuthProfile,
  AuthProvisioner,
} from "./auth/AuthPort";

// Logger
export type { Logger, LogLevel, LogContext } from "./logger/Logger";
export { ConsoleLogger } from "./logger/ConsoleLogger";
export { NoOpLogger } from "./logger/NoOpLogger";

// Events
export type { EventBus } from "./events/EventBus";
export { InMemoryEventBus } from "./events/EventBus";

// Validation
export type { ValidationFieldError, ValidationResult, Validator } from "./validation/Validator";
export { ZodValidator } from "./validation/Validator";

// I18n
export type { NumberFormatOptions, CurrencyFormatOptions, DateFormatOptions, Formatter } from "./i18n/Formatter";
export { IntlFormatter } from "./i18n/Formatter";

// Utils
export type { Maybe } from "./utils/Maybe";
export {
  isPresent,
  isNil,
  mapMaybe,
  flatMapMaybe,
  orElse,
  orEmptyString,
  orEmptyArray,
  orEmptyObject,
  orZero,
  orFalse,
  orThrow,
  firstPresent,
  compact,
  compactMap,
} from "./utils/Maybe";
export type { Result } from "./utils/Result";
export {
  ok,
  err,
  mapResult,
  flatMapResult,
  mapError,
  getOrElse,
  getOrThrow,
  fromMaybe,
  toMaybe,
  tryCatchAsync,
} from "./utils/Result";
export type { Serializer } from "./utils/Serializer";
export { JsonSerializer, defaultSerializer } from "./utils/Serializer";
export {
  generateId,
  generateIdempotencyKey,
  sha256,
  randomBytes,
  safeCompare,
} from "./utils/Crypto";

// Formatting
export { getLocale, formatCurrency, formatCompactCurrency } from "./utils/format-currency";
export { getOrdinalSuffix } from "./utils/format-ordinal";
export { formatRelativeDate, formatFullDate } from "./utils/format-relative-date";
export { formatWeekRange } from "./utils/format-week-range";
export { formatLocalDate, todayLocal } from "./utils/date";

// Query State
export type { QueryState } from "./utils/query-state";
