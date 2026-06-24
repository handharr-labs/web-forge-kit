# Directory Structure

What goes where — package layout, feature structure, and dependency graph.

---

## Package Map

This repo (`web-forge-kit`) contains shared packages. Downstream apps import what they need.

```
@handharr-labs/web-forge-kit (this repo)
  packages/
    core/                     # Platform-agnostic architecture primitives
    web-client/               # Frontend: ApiClient, FetchPolicy, CacheClient, file utils
    web-server/               # Backend: DB adapters, middleware, server utilities
    ui-base-bronze/                # Tier 1 design system — functional, minimal
    ui-base-silver/                # Tier 2 design system — polished, production-ready
    ui-base-gold/                  # Tier 3 design system — premium, animated
    ui-{name}/                # Client brand layer — extends exactly one tier
    ui-{name}-showcase/       # Pre-deal multi-tier demo — never used in production
```

### Package dependency graph

```
ui-base-bronze           → (no internal deps)
ui-base-silver           → (no internal deps)
ui-base-gold             → (no internal deps)
ui-{name}           → ui-base-bronze | ui-base-silver | ui-base-gold (exactly one)
ui-{name}-showcase  → ui-base-bronze + ui-base-silver + ui-base-gold (all three, demo only)
web-client          → core
web-server          → core
```

### Downstream app installs

```json
{
  "@handharr-labs/core": "^1.0.0",
  "@handharr-labs/web-client": "^1.0.0",
  "@handharr-labs/ui-cikal": "^1.0.0"
}
```

Fullstack app adds `@handharr-labs/web-server`. Frontend-only app skips it. The `ui-{name}-showcase` package is never a downstream dependency — playground only.

---

## @handharr-labs/core

Platform-agnostic primitives — pure TypeScript, zero runtime dependencies.

```
packages/core/src/
  primitives/     FetchPolicy, Request, Pagination, DomainError
  utils/          Maybe, Result, JsonSerializer, Crypto
  validation/     Validator interface, ZodValidator adapter
  events/         EventBus interface, InMemoryEventBus
  logger/         Logger interface, ConsoleLogger, NoOpLogger
  analytics/      AnalyticsGateway interface, ConsoleAnalyticsGateway, NoOpAnalyticsGateway
  env/            createEnv — typed environment config
  i18n/           Formatter interface, IntlFormatter
```

---

## @handharr-labs/web-client

Frontend-specific primitives — browser APIs, HTTP, storage.

```
packages/web-client/src/
  network/        ApiClient, AuthenticatedApiClient, HttpInterceptor, WebSocketClient
  storage/        CacheClient, LocalStorageCacheClient, SessionStorageCacheClient, InMemoryCacheClient, LocalDataSource
  file/           FileDownloader, FileReaderClient, FileValidator
```

---

## @handharr-labs/web-server

Backend-specific primitives — DB adapters, server action utilities.

```
packages/web-server/src/
  db/             DatabaseClient interface, createDrizzlePostgresClient (subpath: db/drizzle)
  actions/        handleServerActionError, toServerActionResult, ServerActionResult
```

---

## Design System Tiers

The design system uses a three-tier model. All tiers ship the same full component set (atoms → molecules → organisms) with the same component API. The tier determines visual sophistication and interaction quality, not scope.

| Tier | Package | Design language |
|---|---|---|
| Bronze | `@handharr-labs/ui-base-bronze` | Functional — basic layout, no animation |
| Silver | `@handharr-labs/ui-base-silver` | Polished — clean hierarchy, refined spacing |
| Gold | `@handharr-labs/ui-base-gold` | Premium — animated interactions, Material-style patterns |

```
packages/ui-base-bronze/src/
  components/     Full component set at Bronze design language
  tokens/         Neutral token palette (CSS custom properties)
  utils/          cn()

packages/ui-base-silver/src/
  components/     Full component set at Silver design language
  tokens/         Neutral token palette (CSS custom properties)
  utils/          cn(), ThemeProvider

packages/ui-base-gold/src/
  components/     Full component set at Gold design language
  tokens/         Neutral token palette (CSS custom properties)
  utils/          cn(), ThemeProvider
```

## @handharr-labs/ui-{name}

A client brand package extends exactly one tier. It adds brand token overrides and domain-specific organism compositions — it never re-implements atoms or molecules.

```
packages/ui-cikal/src/
  tokens/         Brand token overrides scoped under .brand-cikal
  components/     Domain organisms only (NavBar, HeroSection, EventCard, etc.)
```

## @handharr-labs/ui-{name}-showcase

A pre-deal demo package. Used in the playground to show a client what their design system looks like across all three tiers. Never imported by a production app.

Once a deal is signed and a tier is chosen, a fresh `ui-{name}` package is created — the showcase is never renamed or graduated into production.

```
packages/ui-cikal-showcase/src/
  tokens/         Brand token overrides scoped under .brand-cikal
  components/     Domain organisms (same as post-deal, but not yet tier-committed)
```

---

## Downstream App Structure

This file documents the **kit packages**. The downstream app's own layout — feature folder structure, file naming, and which package each layer may import — lives in the feature guide:

→ **[web-architecture/directory-structure.md](../web-architecture/directory-structure.md)**

The package dependency graph the app builds on is the [Package dependency graph](#package-dependency-graph) above.
