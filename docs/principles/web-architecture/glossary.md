# Feature Glossary

> Author: Puras Handharmahua · 2026-06-24
> Related: [design-principles.md](design-principles.md) · [directory-structure.md](directory-structure.md) · [conventions.md](conventions.md) · [forge-kit/glossary.md](../forge-kit/glossary.md)

## What This Doc Covers

An alphabetical index of every term used in this folder's feature-development docs — the layer roles, the Next.js wiring patterns, and the code conventions a downstream app follows. Each entry is a one-line definition with a pointer to the source doc.

This glossary is scoped to **building features**. For kit primitives themselves (`ApiClient`, `DomainError`, `Result`, `CacheClient`, `EventBus`, …) see the kit's [glossary](../forge-kit/glossary.md); entries below that lean on a kit primitive link to it.

Source labels: **[Design]** → [design-principles.md](design-principles.md) · **[Where]** → [directory-structure.md](directory-structure.md) · **[Conv]** → [conventions.md](conventions.md).

---

## Index

| Term | Source | Definition |
|---|---|---|
| Application layer | [Where](directory-structure.md#layer-map) | The wiring layer (`src/app`) — composition roots, layouts, pages, server actions; the only layer allowed to import every other. |
| Barrel | [Conv](conventions.md#import--barrel-rules) | A module's `index.ts` public API. Cross-boundary imports go through it; kit symbols are imported from the package root, never a deep path. |
| Caching (FetchPolicy) | [Design](design-principles.md#caching-with-fetchpolicy) | Repository cache-vs-network decision driven by `FetchPolicy` from `core` and a `CacheClient` from `web-client`. |
| Component | [Design](design-principles.md#component) | Reusable UI smaller than a page; stateless by default — receives a ViewModel via props, emits callbacks, makes no UseCase calls. |
| Composition Root | [Design](design-principles.md#dependency-injection) | The single place the dependency graph is constructed and wired — `app/di.ts` (client) and `app/di.server.ts` (server). |
| createDIProvider | [Design](design-principles.md#dependency-injection) | `web-client` factory that returns a typed React-context DI provider + `useDI` hook for the client tree. |
| createServerContainer | [Design](design-principles.md#dependency-injection) | App-defined **per-request** factory that builds the graph for Server Components / Actions, where React context can't reach. |
| Cross-cutting utilities | [Design](design-principles.md#cross-cutting-utilities-from-core) | `core` interfaces injected at the composition root — `Logger`, `Formatter`, `Validator`, `EventBus`, `createEnv`, pagination, crypto. |
| DataSource | [Design](design-principles.md#datasource) | Interface for raw data access; returns DTOs (never Models), calls the kit `ApiClient`, lets `ApiError` propagate. Lives in `data/datasources/`. |
| Dependency rule | [Design](design-principles.md#feature-design-principles) | Presentation → Domain ← Data; Domain imports nothing outward. Enforced by the [layer→import map](directory-structure.md#layer--package-import-map). |
| Domain error | [Design](design-principles.md#domain-error) | An expected business failure returned inside `Result` — a `DomainError` subclass from `core`, or a feature-defined subclass. See [forge-kit](../forge-kit/glossary.md). |
| Domain Service | [Design](design-principles.md#domain-service) | Pure logic spanning multiple models or reused across ≥2 UseCases; no I/O, no async, no framework. Lives in `domain/services/`. |
| DTO | [Design](design-principles.md#dto) | Zod-validated mirror of the raw API/DB shape; all fields nullable; no domain logic. Lives in `data/dtos/`. |
| Feature module | [Where](directory-structure.md#feature-module-structure) | One folder per feature under `src/features/`, split into `domain/`, `data/`, `presentation/`, `infrastructure/`. |
| Gateway | [Where](directory-structure.md#layer-map) | Infrastructure adapter wrapping a third-party SDK behind a Domain interface; lives in `{feature}/infrastructure/`. |
| Helper utility | [Conv](conventions.md#helper-utilities) | Stateless pure function scoped to one type domain; generic ones come from `core`, app-specific ones live in `src/shared/utils/`. |
| Layer → package import map | [Where](directory-structure.md#layer--package-import-map) | The table fixing which `@handharr-labs/*` each layer may import — the concrete enforcement of "features only". |
| Magic constant | [Conv](conventions.md#magic-constants) | A domain-meaningful literal; never inlined — promoted to a named constant (shared in `src/shared/constants/`, or `const` local to the file). |
| Manual constructor injection | [Design](design-principles.md#dependency-injection) | Dependencies passed via the constructor and wired at the composition root — no DI container, decorators, or `reflect-metadata`. |
| mapApiError | [Design](design-principles.md#the-transport--domain-error-boundary) | The transport→domain error boundary — maps a thrown `ApiError` to a `DomainError`; ships from `web-client`, called in every repository `catch`. |
| Mapper | [Design](design-principles.md#mapper) | Pure function converting a DTO to a domain Model; no I/O, no business logic. Lives in `data/mappers/`. |
| Model | [Design](design-principles.md#model) | A pure, immutable domain type using business vocabulary — no framework imports, no serialization, no business logic. Lives in `domain/models/`. |
| Null-safety helpers | [Conv](conventions.md#null-safety) | `orZero` / `orEmptyString` / `orEmptyArray` / `orEmptyObject` / `orFalse` / `orElse` from `core` — used instead of raw `??` / `\|\|` / `?.` at call sites. |
| Page | [Design](design-principles.md#page) | A route-bound full-view component that observes hook state and dispatches mutations; Server Component by default. |
| Params | [Where](directory-structure.md#feature-module-structure) | Typed UseCase input objects in `domain/params/` — UseCases accept a Params struct, never raw objects. |
| Repository (interface) | [Design](design-principles.md#repository-interface) | A Domain contract for data access returning `Result<T, DomainError>`; implemented in Data. Lives in `domain/interfaces/`. |
| Repository implementation | [Design](design-principles.md#repository-implementation) | Data-layer class bridging DataSource + Mapper → Domain; maps thrown `ApiError` via `mapApiError`. Lives in `data/repositories/`. |
| Server Action | [Design](design-principles.md#server-actions) | A Next.js server-side mutation entry point; calls a UseCase via the server container and returns a `ServerActionResult`. Never throws to the client. |
| ServerActionResult | [Design](design-principles.md#server-actions) | The serialization-friendly `{ data?, error? }` projection of `Result<T, DomainError>` returned across the server→client boundary. |
| StateHolder | [Design](design-principles.md#viewmodel-hook-useviewmodel) | The single source of truth for a screen's UI state — implemented as the ViewModel hook. |
| toServerActionResult | [Design](design-principles.md#server-actions) | `web-server` helper converting `Result<T, DomainError>` → `ServerActionResult` at the action edge. |
| TokenService | [Design](design-principles.md#http-client-composition) | App-supplied contract `AuthenticatedApiClient` uses to inject the access token and refresh it on 401. |
| TypeScript strictness | [Conv](conventions.md#typescript-strictness) | No `any`, no unsafe casts; `unknown` at trust boundaries narrowed immediately with a Zod schema under `strict: true`. |
| UseCase | [Design](design-principles.md#usecase) | One stateless business operation (`execute`); depends only on repository interfaces — never an impl, never the network. Lives in `domain/use-cases/`. |
| Validation error | [Design](design-principles.md#validation-errors) | `ValidationError` from `core` carrying a field map; `ZodValidator.parse` throws it, surfaced per-field in forms. |
| ViewModel | [Design](design-principles.md#viewmodel-hook-useviewmodel) | A flat, display-ready type passed to components; mapped from Domain models in the hook — components never receive raw Models. Lives in `presentation/types/`. |
| ViewModel hook (useViewModel) | [Design](design-principles.md#viewmodel-hook-useviewmodel) | A `use{Name}` hook bridging domain ↔ React — calls UseCases, owns loading/error/data state, maps Models to ViewModels. Lives in `presentation/hooks/`. |

---

## Changelog

See git history for this file.
