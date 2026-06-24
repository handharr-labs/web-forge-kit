# CLAUDE.md

Handharr Labs · Web Forge Kit — shared packages for Next.js apps

## Architecture

- **Glossary (All Terms):** `docs/principles/forge-kit/glossary.md`
- **Design Principles (What & Why):** `docs/principles/forge-kit/design-principles.md`
- **Conventions (What, How, When):** `docs/principles/forge-kit/conventions.md`
- **Directory Structure (What & Where):** `docs/principles/forge-kit/directory-structure.md`
- **Tiered Design System (Tiers, Brand Packages, Rules):** `docs/principles/forge-kit/tiered-design-system.md`
- **Web Architecture (Layer Reference + Code Conventions):** `docs/principles/web-architecture/`

## Principles

Clean Architecture · DRY · SOLID — apply to all new code.

**Layer dependency rule:** Presentation → Domain ← Data. Domain depends on nothing.

## Packages

| Package | Scope | Purpose |
|---|---|---|
| `@handharr-labs/core` | Platform-agnostic | UseCase, Result, FetchPolicy, EventBus, Logger, DomainError |
| `@handharr-labs/web-client` | Frontend | ApiClient, CacheClient, FileDownloader, WebSocketClient |
| `@handharr-labs/web-server` | Backend | DB adapters, middleware, server utilities |
| `@handharr-labs/ui-base-bronze` | Frontend | Tier 1 design system — functional, minimal, no animation |
| `@handharr-labs/ui-base-silver` | Frontend | Tier 2 design system — polished, production-ready |
| `@handharr-labs/ui-base-gold` | Frontend | Tier 3 design system — premium, animated interactions |
| `@handharr-labs/ui-tier-runtime` | Frontend | Brand-free runtime tier-switching engine — swaps Bronze/Silver/Gold at runtime (demo-class) |
| `@handharr-labs/ui-{name}` | Frontend | Client brand layer — extends exactly one base tier |
| `@handharr-labs/ui-{name}-showcase` | Frontend | Pre-deal multi-tier demo — playground only, never production |

## Key Rules

- Domain never imports from Data, Infrastructure, or External.
- `core` has zero runtime dependencies — pure TypeScript only.
- `web-client` and `web-server` depend on `core`, not on each other.
- `ui-base-*` packages are standalone — no shared base layer between them.
- `ui-{name}` extends exactly one `ui-base-*` tier — never more than one.
- `ui-{name}-showcase` is a demo tool — never a dependency of a production app.
- No domain or feature-specific logic in any package — features live in downstream apps.
