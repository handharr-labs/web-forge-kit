# Directory Structure

What goes where — package layout, feature structure, and dependency graph.

---

## Package Map

This repo (`web-kit`) contains shared packages. Downstream apps import what they need.

```
@handharr-labs/web-kit (this repo)
  packages/
    core/                     # Platform-agnostic architecture primitives
    web-client/               # Frontend: ApiClient, FetchPolicy, CacheClient, file utils
    web-server/               # Backend: DB adapters, middleware, server utilities
    ui-{name}/                # Self-contained design systems per app/brand
```

### Package dependency graph

```
ui-{name}       → (standalone, no internal deps)
web-client      → core
web-server      → core
```

### Downstream app installs

```json
{
  "@handharr-labs/core": "^1.0.0",
  "@handharr-labs/web-client": "^1.0.0",
  "@handharr-labs/ui-aurora": "^1.0.0"
}
```

Fullstack app adds `@handharr-labs/web-server`. Frontend-only app skips it.

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

Backend-specific primitives — server middleware, DB adapters, server utilities.

```
packages/web-server/src/
  (to be defined as backend patterns emerge)
```

---

## @handharr-labs/ui-{name}

Each design system is fully self-contained — not layered on a shared base. Different apps can have entirely different component primitives.

```
packages/ui-aurora/src/
  components/     Button, Input, Modal, Card, etc.
  tokens/         Colors, spacing, typography, breakpoints
  layouts/        Page shells, grid systems
```

---

## Downstream App Structure

Each app repo focuses on features. Shared primitives come from `@handharr-labs/*`.

```
my-next-app/
  src/
    app/                    Next.js App Router — layouts, pages, route handlers, server actions
    features/               Feature modules — one folder per domain feature
      {feature}/
        domain/
          interfaces/       Repository + Gateway interfaces
          models/           Pure TypeScript types
          params/           UseCase input types + Request typealiases
          use-cases/        Stateless orchestrators
          services/         Stateful long-lived domain logic
        data/
          dtos/             API/DB schema mirrors
          datasources/      Remote + Local datasource classes
          mappers/          DTO → Domain mappers (pure functions)
          repositories/     Repository implementations
        presentation/
          components/       React components (Server and Client)
          hooks/            useViewModel hooks — domain ↔ React bridge
          types/            ViewModel types (display-ready, flat)
        infrastructure/     Gateway implementations (third-party SDKs)
```

---

## Layer Map

```
Layer              What                          Where (in downstream app)
──────────────────────────────────────────────────────────────────────────
Presentation       Page / Component / Hook        src/features/{f}/presentation/
Domain             UseCase / Service / Interface  src/features/{f}/domain/
Data               Repository / DataSource / DTO  src/features/{f}/data/
Application        Layout / DI / Provider         src/app/
Infrastructure     Gateway                        src/features/{f}/infrastructure/
External           SDKs / browser APIs            node_modules / built-in
Shared packages    Core / WebClient / UI          node_modules/@handharr-labs/
```

---

## Dependency Flow

```
Presentation → Domain ← Data
                 ↑
            Application (wires everything)
                 ↑
          Infrastructure (conforms to Domain interfaces)
                 ↑
             External (SDKs, browser APIs)

@handharr-labs/core ← @handharr-labs/web-client
                    ← @handharr-labs/web-server

@handharr-labs/ui-{name} (standalone)
```
