/** Standard single-item API envelope. */
export interface ApiResponse<T> {
  readonly data: T;
  readonly message?: string;
  readonly meta?: Record<string, unknown>;
}

/** Standard list API envelope with offset-based pagination. */
export interface ApiListResponse<T> {
  readonly data: T[];
  readonly meta: ApiPageMeta;
}

/** Standard list API envelope with cursor-based pagination. */
export interface ApiCursorResponse<T> {
  readonly data: T[];
  readonly meta: ApiCursorMeta;
}

export interface ApiPageMeta {
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
}

export interface ApiCursorMeta {
  readonly nextCursor: string | null;
  readonly hasNext: boolean;
}

/** Standard error envelope returned by the API on 4xx/5xx. */
export interface ApiErrorResponse {
  readonly message: string;
  readonly code?: string;
  /** Field-level validation errors — key is the field name. */
  readonly errors?: Record<string, string[]>;
}

// --- Unwrap helpers used in RemoteDataSources ---

export function unwrapData<T>(response: ApiResponse<T>): T {
  return response.data;
}

export function unwrapList<T>(response: ApiListResponse<T>): T[] {
  return response.data;
}
