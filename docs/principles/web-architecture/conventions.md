# Web Code Conventions

> Author: Puras Handharmahua · 2026-06-24
> Related: [design-principles.md](design-principles.md) · [directory-structure.md](directory-structure.md) · [glossary.md](glossary.md) · [forge-kit/conventions.md](../forge-kit/conventions.md)

Low-level code conventions for downstream apps built on the `@handharr-labs/*` packages. These are the rules that keep features consistent across apps. Every helper referenced here ships from `@handharr-labs/core` — the app imports, it does not re-implement.

> The repo-level [forge-kit/conventions.md](../forge-kit/conventions.md) covers naming, data flow, and the ViewModel mapping rules. This file covers the in-the-small rules: null safety, helpers, constants, strictness, and barrels.

---

## Null Safety

**Rule:** Never use raw null-fallback operators (`??`, `||`, `?.` chains) at a call site in domain, data, or presentation code. Delegate to a named helper from `core`.

**Why:** Raw operators scatter fallback semantics into punctuation — intent (`orZero`, `orEmptyString`) disappears. Named functions make the fallback explicit, searchable, and uniform.

**Invariant:** Raw null operators are allowed only *inside* helper implementations — never in feature code.

`core` ships these (import from `@handharr-labs/core`):

| Category | Helper | Fallback |
|---|---|---|
| Nullable number | `orZero(v)` | `0` |
| Nullable string | `orEmptyString(v)` | `""` |
| Nullable array | `orEmptyArray(v)` | `[]` |
| Nullable object | `orEmptyObject(v)` | `{}` |
| Nullable bool | `orFalse(v)` | `false` |
| Any type + explicit default | `orElse(v, fallback)` | caller-supplied |
| Assert present (trust boundary) | `orThrow(v, message)` | throws |

> Note: there is **no `orTrue`** — for a true-default boolean use `orElse(v, true)`.

Related guards and transforms, also from `core`: `isPresent`, `isNil`, `mapMaybe`, `flatMapMaybe`, `firstPresent`, `compact`, `compactMap`.

```typescript
import { orZero, orEmptyString, orFalse, orEmptyArray } from "@handharr-labs/core";

// ✅ mapper — intent is explicit
const employee: Employee = {
  id: orEmptyString(dto.employee_id),
  name: orEmptyString(dto.full_name),
  isActive: orFalse(dto.is_active),
  tags: orEmptyArray(dto.tags),
  visits: orZero(dto.visit_count),
};

// ❌ raw fallback at the call site
const name = dto.full_name ?? "";
```

`compactMap` replaces the common "map then filter nulls" pattern:

```typescript
import { compactMap } from "@handharr-labs/core";

const ids = compactMap(rows, (r) => r.employee_id); // string[] — nulls dropped
```

---

## Helper Utilities

**Helper utilities** are stateless pure functions scoped to a single type domain.

**Invariants:**
- No business logic, no side effects — pure transformations only.
- No API, storage, analytics, or framework imports inside a helper file.
- Grouped by the type they operate on — never a catch-all `utils.ts`.

**Where:** generic, reusable helpers already live in `@handharr-labs/core` — reach for those first. App-specific helpers (that don't belong in the kit) live in `src/shared/utils/{type}.ts`, grouped by type. Promote a helper to `core` only when it is domain-agnostic and reused across apps.

| Concern | Source |
|---|---|
| Null safety (`orZero`, `orEmptyString`, …) | `@handharr-labs/core` |
| Maybe transforms (`mapMaybe`, `compactMap`, …) | `@handharr-labs/core` |
| Result transforms (`mapResult`, `getOrElse`, …) | `@handharr-labs/core` |
| Formatting (`number`, `currency`, `date`, `relativeTime`) | `@handharr-labs/core` → `IntlFormatter` |
| Crypto / IDs (`generateId`, `generateIdempotencyKey`) | `@handharr-labs/core` |
| App-specific (e.g. business string rules) | `src/shared/utils/{type}.ts` |

**Dates and formatting go through `IntlFormatter`** (from `core`) — never inline `Intl.*` or format strings at call sites. Inject a `Formatter` instance from the composition root so locale is consistent and tests can pin it.

---

## Magic Constants

**Rule:** Never hard-code a domain-meaningful string or number inline. Promote it to a named constant.

**Why:** a bare `30_000`, `"id-ID"`, or `"/api/v1/employees"` carries no intent and no single point of change.

**Invariant:**
- Cross-feature constants live in `src/shared/constants/{domain}.constants.ts`, re-exported via a barrel.
- Single-file constants are declared `const` at the top of that file — never duplicated inline elsewhere in it.
- Trivial sentinels (`0`/`1`/`-1` indices, `true`/`false`, empty-string guards) are exempt — naming them is noise.
- Endpoint paths, TTLs, and timeouts are **never** inline — they are constants.

```typescript
// src/shared/constants/network.constants.ts
export const NetworkConstants = {
  defaultTimeoutMs: 30_000,
  defaultLocale: "id-ID",
  employeesEndpoint: "/api/v1/employees",
  employeeCacheTtlMs: 5 * 60_000,
} as const;
```

```typescript
// local to one component
const CARD_ANIMATION_MS = 250;
const MAX_TAG_DISPLAY = 3;
```

**Critical:** if the same literal appears in two files, it has outgrown "local" — promote it to `src/shared/constants/`.

---

## TypeScript Strictness

**Rule:** Never use `any`. The type system is the first enforcer of the layer contracts — bypassing it with `any` removes the boundary.

**Invariants:**
- `strict: true` — no exceptions.
- `any` is banned. Use `unknown` at trust boundaries (API responses, `JSON.parse`) and narrow immediately with a Zod schema (`ZodValidator`).
- `as Type` casting is banned outside test fixtures — if you need a cast, the types are wrong.
- `@ts-ignore` / `@ts-expect-error` requires a comment stating the exact reason.

```typescript
// ❌ never
const data: any = await response.json();
const employee = data as EmployeeDto;

// ✅ parse at the trust boundary — ApiClient returns unknown-shaped data, the DTO schema narrows it
import { employeeDtoSchema } from "../dtos/employee.dto";
const dto = employeeDtoSchema.parse(unwrapData(res));
```

Recommended `tsconfig.json` flags for downstream apps:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## Import & Barrel Rules

Barrel files (`index.ts`) are a module's public API. Cross-boundary imports go through the barrel — never through a deep internal path.

**Invariants:**
- Import kit symbols from the **package root** only — `@handharr-labs/core`, `@handharr-labs/web-client`, `@handharr-labs/web-server`. Never reach into `dist/` or `src/` internals. (The one sanctioned subpath is `@handharr-labs/web-server/db/drizzle`.)
- Cross-feature imports use the feature barrel: `import { Employee } from "@features/employee"`.
- Intra-feature imports use relative paths.
- Circular barrel imports are banned — if two features import each other, extract the shared type to `src/shared/`.

```typescript
// ✅ kit — package root
import { ok, err, type Result, DomainError } from "@handharr-labs/core";
import { FetchApiClient, type ApiClient } from "@handharr-labs/web-client";

// ✅ cross-feature — feature barrel
import type { Employee } from "@features/employee";

// ❌ deep path into another feature
import type { Employee } from "@features/employee/domain/models/employee";
```

---

## Result & Error Conventions

These reinforce [design-principles.md](design-principles.md) at the call site:

- Domain/Data return `Result<T, DomainError>` for **expected** failures. Throw only for genuinely unexpected programmer errors.
- Narrow with the `ok` field — there is **no `.isOk()` / `.isErr()`**. `if (result.ok) { result.value } else { result.error }`.
- Use `core` combinators instead of manual unwrapping: `mapResult`, `flatMapResult`, `mapError`, `getOrElse`, `getOrThrow`, `tryCatchAsync`.
- Transport errors (`ApiError`) never escape the Data layer — the repository maps them to `DomainError` via `mapApiError` (shipped from `web-client`; never re-implemented per app).
- A `DomainError` never reaches the browser as a thrown raw error across a Server Action boundary — convert with `handleServerActionError` to a `ServerActionResult`.

```typescript
// ✅ adapt Result to a throw-based boundary (TanStack Query, Server Component)
queryFn: () => useCase.execute(id).then(getOrThrow),

// ✅ explicit handling inline
const result = await useCase.execute(id);
if (!result.ok) return showError(result.error);
render(result.value);
```
