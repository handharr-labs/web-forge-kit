# CLAUDE.md

Handharr Labs · Web Kit — shared packages for Next.js apps

## Architecture

- **Design Principles (What & Why):** `docs/principles/design-principles.md`
- **Conventions (What, How, When):** `docs/principles/conventions.md`
- **Directory Structure (What & Where):** `docs/principles/directory-structure.md`

## Principles

Clean Architecture · DRY · SOLID — apply to all new code.

**Layer dependency rule:** Presentation → Domain ← Data. Domain depends on nothing.

## Packages

| Package | Scope | Purpose |
|---|---|---|
| `@handharr-labs/core` | Platform-agnostic | UseCase, Result, FetchPolicy, EventBus, Logger, DomainError |
| `@handharr-labs/web-client` | Frontend | ApiClient, CacheClient, FileDownloader, WebSocketClient |
| `@handharr-labs/web-server` | Backend | DB adapters, middleware, server utilities |
| `@handharr-labs/ui-{name}` | Frontend | Self-contained design system per app/brand |

## Key Rules

- Domain never imports from Data, Infrastructure, or External.
- `core` has zero runtime dependencies — pure TypeScript only.
- `web-client` and `web-server` depend on `core`, not on each other.
- `ui-{name}` packages are standalone — no shared base layer.
- No domain or feature-specific logic in any package — features live in downstream apps.
