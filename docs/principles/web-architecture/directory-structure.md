# Feature Directory Structure

> Author: Puras Handharmahua · 2026-06-24
> Related: [design-principles.md](design-principles.md) · [conventions.md](conventions.md) · [glossary.md](glossary.md) · [forge-kit/directory-structure.md](../forge-kit/directory-structure.md)

The **what & where** of a downstream app: folder layout, file naming, and — most importantly — **which `@handharr-labs/*` package each layer is allowed to import**. For the *why* behind each layer, see [design-principles.md](design-principles.md). For the kit's own package layout, see [forge-kit/directory-structure.md](../forge-kit/directory-structure.md).

---

## App skeleton

A downstream app holds **features and wiring** — nothing the kit already provides.

```
my-next-app/
  src/
    app/            Next.js App Router — layouts, pages, route handlers, server actions, DI roots
    features/       One folder per domain feature (see below)
    shared/         Cross-feature app code — constants, app-specific utils, route table
```

`shared/` is for things genuinely shared across features but *not* generic enough for the kit (e.g. `Routes`, app constants). Generic primitives never live here — they come from `@handharr-labs/*`.

---

## Feature module structure

One folder per feature, split by Clean Architecture layer. The dependency rule — **Presentation → Domain ← Data** — is enforced by what each layer is allowed to import (next section).

```
src/features/{feature}/
  domain/
    models/{feature}.ts                       Pure TS type, immutable
    interfaces/{feature}.repository.ts         Repository contract (+ Gateway interfaces)
    params/{feature}.params.ts                 UseCase input types
    use-cases/{verb}-{feature}.use-case.ts     Stateless orchestrators
    services/{feature}-{noun}.service.ts       Pure logic spanning models (optional)
    errors/{feature}.errors.ts                 Feature-specific DomainError subclasses (optional)
  data/
    dtos/{feature}.dto.ts                      Zod schema + inferred type (API/DB shape)
    mappers/{feature}.mapper.ts                DTO → Model (pure function)
    datasources/{feature}-remote.datasource.ts        interface
    datasources/{feature}-remote.datasource.impl.ts   implementation (calls ApiClient)
    repositories/{feature}.repository.impl.ts  Repository implementation
  presentation/
    hooks/use-{feature}.ts                     ViewModel hook — domain ↔ React bridge
    components/{Name}.tsx                       React components (Server + Client)
    types/{feature}.vm.ts                       ViewModel types (flat, display-ready)
  infrastructure/
    {provider}.gateway.ts                       Third-party SDK adapters (optional)
```

---

## File naming conventions

| Layer | File pattern | Example |
|---|---|---|
| Model | `models/{feature}.ts` | `employee.ts` |
| Repository interface | `interfaces/{feature}.repository.ts` | `employee.repository.ts` |
| Params | `params/{feature}.params.ts` | `employee.params.ts` |
| UseCase | `use-cases/{verb}-{feature}.use-case.ts` | `get-employee.use-case.ts` |
| Domain Service | `services/{feature}-{noun}.service.ts` | `leave-balance.service.ts` |
| Domain error | `errors/{feature}.errors.ts` | `leave.errors.ts` |
| DTO | `dtos/{feature}.dto.ts` | `employee.dto.ts` |
| Mapper | `mappers/{feature}.mapper.ts` | `employee.mapper.ts` |
| DataSource (interface) | `datasources/{feature}-remote.datasource.ts` | `employee-remote.datasource.ts` |
| DataSource (impl) | `datasources/{feature}-remote.datasource.impl.ts` | `employee-remote.datasource.impl.ts` |
| Repository (impl) | `repositories/{feature}.repository.impl.ts` | `employee.repository.impl.ts` |
| ViewModel hook | `hooks/use-{feature}.ts` | `use-employee.ts` |
| Component | `components/{Name}.tsx` (PascalCase) | `EmployeeCard.tsx` |
| ViewModel type | `types/{feature}.vm.ts` | `employee.vm.ts` |
| Page | `app/{route}/page.tsx` | `app/employees/[id]/page.tsx` |
| Server Action | `app/{route}/actions.ts` | `app/employees/[id]/actions.ts` |
| DI root (client) | `app/di.ts` | `app/di.ts` |
| DI root (server) | `app/di.server.ts` | `app/di.server.ts` |

---

## Layer → package import map

The core rule of "features only": each layer may import **only** the packages in its row. This is what keeps the dependency rule intact and stops the app from re-implementing kit primitives.

| Layer | May import from kit | May import (external) | Must **not** import |
|---|---|---|---|
| **Domain** | `@handharr-labs/core` only | — | `web-client`, `web-server`, `react`, `next`, `zod`, any DTO |
| **Data** | `@handharr-labs/core`, `@handharr-labs/web-client` (`ApiClient`, `ApiError`, `mapApiError`, `CacheClient`, `ApiResponse`), `@handharr-labs/web-server` (server DataSources only — `DatabaseClient`) | `zod` | `react`, `next`, another feature's `data/` |
| **Presentation** | `@handharr-labs/core` (`getOrThrow`, `Formatter`), `@handharr-labs/web-client` (`createDIProvider`, `QueryProvider`), `@handharr-labs/ui-*` | `react`, `@tanstack/react-query`, `zustand` | `web-server`, any `data/` impl, any DTO/`ApiError` |
| **Application** (`src/app`) | any kit package — this is the only layer that wires the full graph | `react`, `next` | — |
| **Infrastructure** | the third-party SDK + the Domain interface it implements | the SDK | — |

Two consequences worth stating outright:

- **Domain importing `@handharr-labs/core` only** is the load-bearing rule. If a Domain file needs `ApiClient` or `zod`, the logic is in the wrong layer.
- **Presentation never sees `ApiError` or DTOs.** Errors reaching a hook are already `DomainError` (mapped in Data via `mapApiError`); data reaching a component is already a ViewModel.

---

## Layer map

```
Layer              What                          Where
──────────────────────────────────────────────────────────────────────
Presentation       Page / Component / Hook        src/features/{f}/presentation/
Domain             UseCase / Service / Interface  src/features/{f}/domain/
Data               Repository / DataSource / DTO  src/features/{f}/data/
Application         Layout / DI / Provider / Action src/app/
Infrastructure     Gateway                        src/features/{f}/infrastructure/
External           SDKs / browser APIs            node_modules / built-in
Shared packages    core / web-client / ui-*       node_modules/@handharr-labs/
```

---

## Dependency flow

```
Presentation → Domain ← Data
                 ↑
            Application (wires everything at the composition root)
                 ↑
          Infrastructure (conforms to Domain interfaces)
                 ↑
             External (SDKs, browser APIs)
```

The composition root (`app/di.ts` client, `app/di.server.ts` server) is the single place that depends on every layer at once — see [design-principles.md](design-principles.md#dependency-injection).
