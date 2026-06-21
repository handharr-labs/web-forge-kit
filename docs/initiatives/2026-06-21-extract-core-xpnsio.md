# Extract core modules from `xpnsio` into forgekit packages

**Date:** 2026-06-21
**Status:** Done

## Context

`xpnsio` is a Next.js expense-tracking app that bundles its own core infrastructure: logger, DI container, error handling, null safety utils, DB client, auth, safe-action wrappers, and a query client provider. These are not domain-specific — they're reusable plumbing.

After the `ui-xpnsio` extraction, the goal is: **xpnsio becomes a features-only app** — routes, feature modules (data/domain/presentation), Drizzle schema, and app-specific config. Core infrastructure lives in forgekit packages.

This extraction must produce **generic, multi-app APIs** — not xpnsio wrappers with the name filed off. Every export must make sense for a second app (e.g. a music streaming app, a trip planner) that has never heard of xpnsio.

## Extraction boundary

**Rule: if it's app-infrastructure and not tied to a specific xpnsio feature — it moves to a forgekit package.**

**Counter-rule: if extracting it would force the package to know about a specific app's domain, auth provider, ORM choice, or route structure — it stays in the app.**

### Stays in xpnsio (app-specific)

| File | Why it stays |
|---|---|
| `src/features/**` | Feature modules — the app's reason to exist |
| `src/app/**` | Next.js routes and layouts |
| `src/lib/schema.ts` | Drizzle table definitions — domain-specific |
| `drizzle.config.ts` | References app schema path |
| `middleware.ts` | Supabase auth + app route guards — coupled to app's auth provider and route layout |
| `src/shared/di/container.client.ts` | Imports feature classes to build the DI graph |
| `src/shared/di/container.server.ts` | Same — server-side feature wiring |
| `src/shared/presentation/constants/` | Domain data (currency options) |
| `src/shared/presentation/navigation/` | App routes + router wrapper |
| `src/shared/presentation/actions/` | Feature-specific server actions |
| `src/shared/presentation/common/organisms/` | App-specific component wrappers |

---

## Inventory: what moves where

### A. Already in forgekit — xpnsio duplicates to delete

These exist in both codebases. xpnsio's copies get deleted; features switch to `@handharr-labs/core` imports.

| xpnsio file | forgekit equivalent | Migration notes |
|---|---|---|
| `shared/core/logger/Logger.ts` (interface + `ConsoleLogger`) | `core/logger/Logger.ts` + `ConsoleLogger.ts` | forgekit's Logger has `child(context)` — superset. Drop xpnsio's `[Xpnsio]` prefix pattern; apps pass context at DI root via `ConsoleLogger({ service: "xpnsio" })` |
| `shared/domain/errors/DomainError.ts` | `core/primitives/DomainError.ts` | **Breaking change in xpnsio.** xpnsio uses `new DomainError('notFound', { resource, id })` — forgekit uses subclasses: `new NotFoundError(resource)`. See [Error migration](#error-migration) below |
| `shared/domain/entities/PaginatedResult.ts` | `core/primitives/Pagination.ts` | `PaginatedResult<T>` → `Paginated<T>`. forgekit's `Paginated` includes `meta: PageMeta` with `hasNext`/`hasPrev` — richer than xpnsio's flat fields |
| `shared/core/utils/nullSafety.ts` | `core/utils/Maybe.ts` | All utils exist: `orZero`, `orEmptyArray`, `compact`. xpnsio's `orEmpty` → forgekit's `orEmptyString`. xpnsio's `orDefault` → forgekit's `orElse`. xpnsio's `firstNonNull` has no equivalent — see Phase 2 |
| `shared/presentation/common/QueryState.ts` | `core/utils/query-state.ts` | Identical discriminated union — drop-in replacement |

### B. New additions to `@handharr-labs/core`

| What | Target | Generic API design |
|---|---|---|
| `getOrdinalSuffix(n)` | `core/utils/format-ordinal.ts` | Pure function. No locale dependency — English ordinals only. If multi-locale needed later, it goes through `Formatter` interface |
| `humanizeError(code)` | `core/primitives/error-messages.ts` | See [Error humanization](#error-humanization-design) |
| `firstNonNull(...values)` | `core/utils/Maybe.ts` | Add to existing `Maybe` module as `firstPresent`. Matches naming convention (`isPresent`, `isNil`) |
| `NetworkError` | `core/primitives/DomainError.ts` | New subclass. See [Error migration](#error-migration) |

### C. New additions to `@handharr-labs/web-client`

| What | Target | Generic API design |
|---|---|---|
| DI provider | `web-client/di/` | See [DI provider design](#di-provider-design) |
| Query client provider | `web-client/query/` | See [Query provider design](#query-provider-design) |

### D. New package: `@handharr-labs/web-server`

| What | Target | Generic API design |
|---|---|---|
| Drizzle client factory | `web-server/db/` | See [DB client design](#db-client-design) |
| Supabase server auth | `web-server/auth/` | See [Auth design](#auth-client-design) |
| Safe-action wrappers | `web-server/actions/` | See [Safe-action design](#safe-action-design) |
| DB error mapper | `web-server/db/` | See [Error mapper design](#error-mapper-design) |

### E. NOT moving — assessed and rejected

| xpnsio file | Why it stays |
|---|---|
| `lib/supabase-browser.ts` | 3-line `createBrowserClient(url, key)` call. Extracting it forces `web-client` to depend on `@supabase/ssr` — a specific auth vendor. Not worth the coupling. Apps call `createBrowserClient` directly |
| `lib/auth.ts` (`createSupabaseServerClient`) | Same reasoning — Supabase-specific. See [Auth design](#auth-client-design) for what we extract instead |
| `lib/safe-action.ts` | `next-safe-action` is a specific library choice. See [Safe-action design](#safe-action-design) for what we extract instead |

---

## Generic API designs

### Error migration

xpnsio's flat `DomainErrorCode` union → forgekit's subclass pattern:

| xpnsio `DomainErrorCode` | forgekit class | Notes |
|---|---|---|
| `'notFound'` | `NotFoundError` | Exists |
| `'validationFailed'` | `ValidationError` | Exists |
| `'unauthorized'` | `UnauthorizedError` | Exists |
| `'networkUnavailable'` | `NetworkError` | **New** — add to core |
| `'serverError'` | `UnexpectedError` | Exists |
| `'unknown'` | `UnexpectedError` | Exists |

**New `NetworkError` class:**

```typescript
// core/primitives/DomainError.ts — add alongside existing subclasses
export class NetworkError extends DomainError {
  constructor(message = "Network unavailable") {
    super("NETWORK_ERROR", message);
    this.name = "NetworkError";
  }
}
```

Follows the existing pattern: `code` is SCREAMING_SNAKE, `message` is human-readable, constructor has sensible default.

**Migration in xpnsio features (24 import sites):**

Before:
```typescript
import { DomainError } from '@/shared/domain/errors/DomainError';
throw new DomainError('notFound', { resource: 'Category', id });
```

After:
```typescript
import { NotFoundError } from '@handharr-labs/core';
throw new NotFoundError('Category');
```

Catch sites change from `error.code === 'notFound'` to `error instanceof NotFoundError`.

### Error humanization design

xpnsio's `humanizeError` maps `DomainErrorCode` → user-facing string. The generic version maps `DomainError.code` → string, with an extensible registry:

```typescript
// core/primitives/error-messages.ts

const DEFAULT_MESSAGES: Record<string, string> = {
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "You do not have permission to perform this action.",
  CONFLICT: "This action conflicts with the current state.",
  NETWORK_ERROR: "No internet connection. Please check your network.",
  UNEXPECTED_ERROR: "Something went wrong. Please try again.",
};

export function humanizeError(
  error: DomainError,
  overrides?: Record<string, string>
): string {
  const messages = overrides ? { ...DEFAULT_MESSAGES, ...overrides } : DEFAULT_MESSAGES;
  return messages[error.code] ?? DEFAULT_MESSAGES.UNEXPECTED_ERROR;
}
```

**Why `overrides` param:** apps define feature-specific error codes (e.g. `BUDGET_EXCEEDED`). They pass a custom map without forking the function. Core maps the common codes; the app maps its own.

**Why accept `DomainError` not `string`:** type safety — callers can't pass arbitrary strings. The function reads `.code` internally.

### DI provider design

xpnsio's `DIContext.tsx` hardcodes `ClientContainer`. The generic version is a factory that returns a typed provider + hook pair:

```typescript
// web-client/di/DIProvider.ts
'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';

export interface DIProviderProps {
  children: ReactNode;
}

export function createDIProvider<TContainer>(factory: () => TContainer) {
  const Context = createContext<TContainer | null>(null);

  function DIProvider({ children }: DIProviderProps) {
    const container = useMemo(factory, []);
    return <Context.Provider value={container}>{children}</Context.Provider>;
  }

  function useDI(): TContainer {
    const container = useContext(Context);
    if (!container) throw new Error('useDI must be used within its DIProvider');
    return container;
  }

  return { DIProvider, useDI } as const;
}
```

**Why factory function, not context-per-field:**
- Each app defines its own container shape — the factory captures the type
- `useMemo(factory, [])` — container is created once per React tree, no prop drilling
- Returns `{ DIProvider, useDI }` — the app names them if it needs multiple providers (client + feature-scoped)

**xpnsio usage:**
```typescript
// src/shared/di/DIContext.tsx
import { createDIProvider } from '@handharr-labs/web-client';
import { createClientContainer, type ClientContainer } from './container.client';

export const { DIProvider, useDI } = createDIProvider<ClientContainer>(createClientContainer);
```

**Second app usage (different container shape):**
```typescript
import { createDIProvider } from '@handharr-labs/web-client';

interface MusicContainer {
  playerService: PlayerService;
  searchTracksUseCase: SearchTracksUseCase;
}

export const { DIProvider, useDI } = createDIProvider<MusicContainer>(() => ({
  get playerService() { return new PlayerServiceImpl(); },
  get searchTracksUseCase() { return new SearchTracksUseCaseImpl(trackRepo); },
}));
```

### Query provider design

xpnsio wraps TanStack Query's `QueryClientProvider` with sensible defaults. The generic version accepts optional overrides:

```typescript
// web-client/query/QueryProvider.ts
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export interface QueryProviderConfig {
  staleTime?: number;
  queryRetry?: number | false;
  mutationRetry?: number | false;
}

const DEFAULTS: Required<QueryProviderConfig> = {
  staleTime: 60_000,
  queryRetry: 1,
  mutationRetry: 0,
};

export function QueryProvider({
  children,
  config,
}: {
  children: ReactNode;
  config?: QueryProviderConfig;
}) {
  const merged = { ...DEFAULTS, ...config };
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: merged.staleTime, retry: merged.queryRetry },
          mutations: { retry: merged.mutationRetry },
        },
      })
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

**Why a component, not a factory:** unlike DI (which returns typed hooks), this is a straightforward provider. A component with optional `config` prop is the simplest API. Apps that need full control instantiate `QueryClient` directly — this is the convenience path.

**Peer dependency:** `@tanstack/react-query` is a peer dep of `web-client`, not bundled.

### DB client design

**Decision: extract the pattern, not the Drizzle dependency.**

xpnsio uses Drizzle + `postgres`. Another app might use Drizzle + `better-sqlite3`, or Prisma entirely. The package shouldn't lock in an ORM.

What we extract:

```typescript
// web-server/db/DatabaseClient.ts
import 'server-only';

export interface DatabaseClientConfig {
  connectionString: string;
  options?: Record<string, unknown>;
}

export interface DatabaseClient<TDb> {
  readonly db: TDb;
}
```

And a Drizzle-specific factory (separate entrypoint so apps that don't use Drizzle don't import it):

```typescript
// web-server/db/drizzle.ts
import 'server-only';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { DatabaseClient, DatabaseClientConfig } from './DatabaseClient';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export interface DrizzlePostgresConfig extends DatabaseClientConfig {
  prepare?: boolean;
}

export function createDrizzlePostgresClient(
  config: DrizzlePostgresConfig
): DatabaseClient<PostgresJsDatabase> {
  const client = postgres(config.connectionString, {
    prepare: config.prepare ?? false,
    ...config.options,
  });
  return { db: drizzle(client) };
}
```

**xpnsio usage:**
```typescript
// src/lib/db.ts
import 'server-only';
import { createDrizzlePostgresClient } from '@handharr-labs/web-server/db/drizzle';

export const { db } = createDrizzlePostgresClient({
  connectionString: process.env.DATABASE_URL!,
  prepare: false,
});
```

**Why separate entrypoints:** `web-server/db/drizzle` is opt-in. An app using Prisma imports nothing from this path. The base `DatabaseClient` interface is ORM-agnostic.

**Peer deps:** `drizzle-orm` and `postgres` are peer deps — the app controls versions.

### Auth client design

**Decision: do NOT extract Supabase client factories.**

`createSupabaseServerClient` and `createSupabaseBrowserClient` are 5-10 line functions that call `@supabase/ssr` directly. Extracting them into `web-server` would:
- Force the package to depend on `@supabase/ssr`
- Only serve apps using Supabase auth
- Save ~5 lines per app

Not worth the coupling. Apps that use Supabase call `createServerClient` / `createBrowserClient` directly. If we ever build a second Supabase app, we revisit.

**What we extract instead** — an auth-agnostic server action auth pattern. See [Safe-action design](#safe-action-design).

### Safe-action design

**Decision: do NOT extract `next-safe-action` wrappers.**

`next-safe-action` is a specific library. Wrapping it in `web-server` would:
- Force the package to depend on `next-safe-action`
- Only serve apps using that library
- Add indirection for ~15 lines of code

**What we extract instead** — a generic `ServerActionError` handler and an auth context type:

```typescript
// web-server/actions/ServerActionError.ts
import 'server-only';
import { DomainError, isDomainError } from '@handharr-labs/core';

export interface ServerActionResult<T> {
  data?: T;
  error?: string;
}

export function handleServerActionError(error: unknown): string {
  if (isDomainError(error)) return error.message;
  return 'An unexpected error occurred.';
}
```

This gives apps a consistent error-handling pattern without coupling to `next-safe-action`. Apps wire it into whatever action library they choose:

```typescript
// xpnsio: src/lib/safe-action.ts
import { createSafeActionClient } from 'next-safe-action';
import { handleServerActionError } from '@handharr-labs/web-server';

export const actionClient = createSafeActionClient({
  handleServerError: handleServerActionError,
});
```

### Error mapper design

```typescript
// web-server/db/DbErrorMapper.ts
import 'server-only';
import { DomainError, UnexpectedError, isDomainError } from '@handharr-labs/core';

export interface DbErrorMapper {
  toDomain(error: unknown): DomainError;
}

export class DefaultDbErrorMapper implements DbErrorMapper {
  toDomain(error: unknown): DomainError {
    if (isDomainError(error)) return error;
    return new UnexpectedError(error);
  }
}
```

**Why interface + default impl:** apps extend it to map ORM-specific errors. A Drizzle app maps constraint violation errors; a Prisma app maps `PrismaClientKnownRequestError`. The default just passes through `DomainError` and wraps unknowns.

**xpnsio usage:**
```typescript
// src/shared/data/mappers/XpnsioDbErrorMapper.ts
import { DefaultDbErrorMapper } from '@handharr-labs/web-server';
import { ConflictError } from '@handharr-labs/core';

export class XpnsioDbErrorMapper extends DefaultDbErrorMapper {
  toDomain(error: unknown): DomainError {
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return new ConflictError('A record with this value already exists');
    }
    return super.toDomain(error);
  }
}
```

---

## Phased execution

### Phase 1: Consume existing forgekit exports (no new forgekit code)

Work happens in **xpnsio repo only**.

1. Add `NetworkError` to `core/primitives/DomainError.ts` (only forgekit change)
2. Replace `shared/domain/errors/DomainError.ts` → forgekit subclasses (24 import sites)
3. Replace `shared/domain/errors/errorMessages.ts` → inline for now (1 usage)
4. Replace `shared/core/logger/Logger.ts` → `@handharr-labs/core` Logger + ConsoleLogger
5. Replace `shared/domain/entities/PaginatedResult.ts` → `Paginated<T>` from core
6. Replace `shared/core/utils/nullSafety.ts` → `Maybe` utils from core
7. Replace `shared/presentation/common/QueryState.ts` → core
8. Delete all replaced files
9. Verify: `npm run build` passes, all features work

### Phase 2: Add new exports to `core` (minor)

Work happens in **forgekit repo**.

1. Add `getOrdinalSuffix` to `core/utils/format-ordinal.ts`
2. Add `firstPresent` to `core/utils/Maybe.ts`
3. Add `humanizeError` to `core/primitives/error-messages.ts`
4. Export all from `core/index.ts`
5. Publish `@handharr-labs/core` patch
6. Update xpnsio to consume (1 formatOrdinal import, replace inline humanizeError)

### Phase 3: Add DI + Query providers to `web-client`

Work happens in **forgekit repo**.

1. Add `createDIProvider` to `web-client/di/DIProvider.tsx`
2. Add `QueryProvider` to `web-client/query/QueryProvider.tsx`
3. Add `@tanstack/react-query` as peer dep
4. Export from `web-client/index.ts`
5. Publish `@handharr-labs/web-client` patch
6. Update xpnsio:
   - `DIContext.tsx` → 3-line file using `createDIProvider`
   - `QueryClientProvider.tsx` → delete, import `QueryProvider` directly in layout

### Phase 4: Create `web-server` package

Work happens in **forgekit repo**.

1. Scaffold `packages/web-server`:
   - `server-only` as peer dep
   - `@handharr-labs/core` as dep
   - `drizzle-orm` + `postgres` as peer deps (optional — only needed if using drizzle entrypoint)
2. Implement:
   - `db/DatabaseClient.ts` — interface
   - `db/drizzle.ts` — `createDrizzlePostgresClient` factory
   - `db/DbErrorMapper.ts` — interface + `DefaultDbErrorMapper`
   - `actions/ServerActionError.ts` — `handleServerActionError` utility
3. Export from `web-server/index.ts` (base exports) + `web-server/db/drizzle` (Drizzle-specific entrypoint)
4. Publish `@handharr-labs/web-server` 0.1.0
5. Update xpnsio:
   - `lib/db.ts` → `createDrizzlePostgresClient(...)` one-liner
   - `lib/safe-action.ts` → use `handleServerActionError`
   - `shared/data/mappers/DbErrorMapper.ts` → extend `DefaultDbErrorMapper`

---

## End state

### xpnsio `src/shared/` after extraction

```
shared/
  di/
    container.client.ts     ← app-specific DI wiring (unchanged)
    container.server.ts     ← app-specific server DI wiring (unchanged)
    DIContext.tsx            ← 3 lines: createDIProvider<ClientContainer>(createClientContainer)
  presentation/
    constants/              ← domain data (currency options)
    navigation/             ← app routes + useAppRouter
    actions/                ← feature server actions
    common/organisms/       ← AppBottomNav wrapper
```

### xpnsio `src/lib/` after extraction

```
lib/
  schema.ts                 ← Drizzle tables (unchanged)
  db.ts                     ← createDrizzlePostgresClient(...) one-liner
  auth.ts                   ← Supabase client factories (unchanged — not extracted)
  safe-action.ts            ← next-safe-action + handleServerActionError
  supabase-browser.ts       ← unchanged — not extracted
```

### forgekit package surfaces

```
@handharr-labs/core (additions only)
  + NetworkError
  + getOrdinalSuffix(n)
  + firstPresent(...values)
  + humanizeError(error, overrides?)

@handharr-labs/web-client (additions only)
  + createDIProvider<T>(factory)  →  { DIProvider, useDI }
  + QueryProvider                 →  component with optional config

@handharr-labs/web-server (new package)
  + DatabaseClient<TDb>           →  interface
  + createDrizzlePostgresClient   →  factory (separate entrypoint)
  + DbErrorMapper                 →  interface
  + DefaultDbErrorMapper          →  base implementation
  + handleServerActionError       →  error → string utility
  + ServerActionResult<T>         →  type
```

---

## Design decisions log

| Decision | Chosen | Rejected | Why |
|---|---|---|---|
| Supabase client factories | Stay in app | Extract to `web-server` | 5 lines saved, but forces auth vendor dependency on the package. Not generic |
| `next-safe-action` wrappers | Stay in app | Extract to `web-server` | Same — library-specific. Extract the error handler pattern instead |
| DI provider | Factory returning `{ DIProvider, useDI }` | Single global context | Multiple apps need different container types; factory captures the generic |
| Drizzle client | Separate entrypoint (`web-server/db/drizzle`) | Single `web-server` export | Apps not using Drizzle shouldn't import it. Keeps peer deps optional |
| Error pattern | Subclass per error type | Flat code union | Subclasses give `instanceof` checks, richer constructors, and align with existing forgekit pattern |
| `humanizeError` input | `DomainError` object | `string` code | Type safety — prevents passing arbitrary strings. Reads `.code` internally |
| `QueryProvider` | Component with config prop | Factory like DI | No app-specific types to capture — a component with optional config is simpler |

## Lessons carried from ui-xpnsio

1. **Factories accept params, not `process.env`** — package code never reads environment variables
2. **Generic names** — `DatabaseClient`, not `XpnsioDatabaseClient`
3. **Peer deps for optional integrations** — Drizzle, TanStack Query, `server-only` are peer deps
4. **Don't extract for one app** — Supabase and next-safe-action wrappers aren't worth extracting until a second app needs them
5. **Test with a second mental model** — for every API, ask "would a music streaming app use this unchanged?"
