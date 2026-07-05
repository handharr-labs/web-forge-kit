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
| `@handharr-labs/forge-core` | Platform-agnostic | UseCase, Result, FetchPolicy, EventBus, Logger, DomainError |
| `@handharr-labs/forge-web-client` | Frontend | ApiClient, CacheClient, FileDownloader, WebSocketClient |
| `@handharr-labs/forge-web-server` | Backend | DB adapters, middleware, server utilities |
| `@handharr-labs/forge-auth` | Frontend + Backend | Auth port adapters (NextAuth + Supabase) behind `defineAuth`; `/server` + `/client` + `/middleware` entrypoints |
| `@handharr-labs/forge-ui-base-bronze` | Frontend | Tier 1 design system — functional, minimal, no animation |
| `@handharr-labs/forge-ui-base-silver` | Frontend | Tier 2 design system — polished, production-ready |
| `@handharr-labs/forge-ui-base-gold` | Frontend | Tier 3 design system — premium, animated interactions |
| `@handharr-labs/ui-tier-runtime` | Frontend | Brand-free runtime tier-switching engine — swaps Bronze/Silver/Gold at runtime (demo-class) |
| `@handharr-labs/forge-ui-{n}` (`-uno`, `-dos`, …) | Frontend | **Standalone** design system — self-contained, no tiering, no cross-DS deps. Numbered by creation order: `forge-ui-uno` (xpnsio DS), `forge-ui-dos` (Mekar / wedding) |
| `@handharr-labs/ui-{name}-showcase` | Frontend | Pre-deal multi-tier demo — playground only, never production |

## Key Rules

- Domain never imports from Data, Infrastructure, or External.
- `forge-core` has zero runtime dependencies — pure TypeScript only.
- `forge-web-client` and `forge-web-server` depend on `forge-core`, not on each other.
- `forge-auth` spans client + server via entrypoints (`server-only` guard + `exports` map), not via package split; its `AuthGateway` contract stays in `forge-core`, and every vendor dep is an optional peer dep.
- `forge-ui-base-*` packages are standalone — no shared base layer between them.
- **Naming:** shippable kit packages take the `forge-` prefix. Standalone design systems are named by ordinal in creation order — `forge-ui-uno`, `forge-ui-dos`, `forge-ui-tres`… — and never depend on another DS or tier. Demo-class packages (`ui-tier-runtime`, `ui-{name}-showcase`) stay **unprefixed** to mark them non-shippable.
- `ui-{name}-showcase` is a demo tool — never a dependency of a production app.
- No domain or feature-specific logic in any package — features live in downstream apps.
