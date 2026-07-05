// --- Offset-based pagination ---

export interface PageMeta {
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
}

export interface Paginated<T> {
  readonly items: T[];
  readonly meta: PageMeta;
}

export function buildPageMeta(page: number, pageSize: number, total: number): PageMeta {
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

// --- Cursor-based pagination ---

export interface CursorMeta {
  readonly nextCursor: string | null;
  readonly hasNext: boolean;
}

export interface CursorPaginated<T> {
  readonly items: T[];
  readonly meta: CursorMeta;
}

// --- Pagination request params ---

export interface PageParams {
  readonly page: number;
  readonly pageSize: number;
}

export interface CursorParams {
  readonly cursor: string | null;
  readonly limit: number;
}

export const DEFAULT_PAGE_PARAMS: PageParams = { page: 1, pageSize: 20 };
export const DEFAULT_CURSOR_PARAMS: CursorParams = { cursor: null, limit: 20 };
