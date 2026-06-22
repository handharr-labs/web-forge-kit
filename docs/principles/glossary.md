# Glossary

> Author: Puras Handharmahua · 2026-06-22
> Related: [design-principles.md](design-principles.md) · [conventions.md](conventions.md) · [directory-structure.md](directory-structure.md) · [tiered-design-system.md](tiered-design-system.md)

## What This Doc Covers

A single, alphabetical index of every term coined — or given a project-specific meaning — in this repo's principles and package docs. Each entry is a one-line definition with a pointer to the source doc for more detail. Start here if you encounter an unfamiliar term; follow the link to the source doc for full context.

---

## Index

| Term | Source | Definition |
|---|---|---|
| ApiClient | [web-client](directory-structure.md#handharr-labsweb-client) | Wrapper around `fetch` for HTTP; base client for all API calls. Extended by `AuthenticatedApiClient`. |
| Application | [Architecture](design-principles.md) | Outermost wiring layer — instantiates the full DI graph in `layout.tsx` or a Provider; connects all other layers. |
| Atoms | [Design System](tiered-design-system.md#component-scope) | Smallest design system components: Button, Badge, Avatar, Input, Textarea, Label, Select, Checkbox, Switch, RadioGroup, Spinner, Skeleton. |
| AuthenticatedApiClient | [web-client](directory-structure.md#handharr-labsweb-client) | `ApiClient` decorator that injects auth tokens and retries once on `401 Unauthorized`. |
| Brand Package | [Design System](tiered-design-system.md#brand-packages---ui-name) | A `ui-{name}` package that extends exactly one tier; adds brand tokens and domain organism compositions. |
| Brand Tokens | [Design System](tiered-design-system.md#token-architecture) | CSS custom properties scoped under `.brand-{name}` that override a subset of the tier's neutral token palette. |
| Bronze | [Design System](tiered-design-system.md#the-model) | Tier 1 — functional, static layout, no animation; suited to internal tools and MVPs. |
| CacheClient | [web-client](directory-structure.md#handharr-labsweb-client) | Storage abstraction with TTL-aware `get/set/remove`; backend is chosen per context (InMemory, LocalStorage, SessionStorage). |
| Client Component | [Architecture](design-principles.md#server-vs-client--decision-rule) | React component with `"use client"` — owns interactivity, local state, and browser-API access. |
| Component API Contract | [Design System](tiered-design-system.md#component-api-contract) | The guarantee that every tier exposes the same component names and props — upgrading tiers requires no app-code changes. |
| Composition Root | [Conventions](conventions.md#dependency-injection) | The single place (usually `layout.tsx` or a Provider) where all dependencies are instantiated and wired together. |
| core | [Packages](directory-structure.md#handharr-labscore) | Platform-agnostic architecture primitives package (`@handharr-labs/core`) — pure TypeScript, zero runtime dependencies. |
| Data | [Architecture](design-principles.md) | Layer that implements repository interfaces, maps DTOs to Domain models, and communicates with remote/local data sources. |
| DataSource | [Conventions](conventions.md#naming-conventions) | Fetches or writes raw data from a remote API or local store; lives in `data/datasources/`. |
| Domain | [Architecture](design-principles.md) | Core business layer — UseCases, models, interfaces, and services; depends on nothing else in the app. |
| Domain Service | [Conventions](conventions.md#usecase-vs-domain-service) | Stateful, long-lived Domain object shared across UseCases or screens; injected via constructor. |
| DomainError | [core](directory-structure.md#handharr-labscore) | Typed error hierarchy for expected failures (validation, not-found); returned in `Result`, not thrown. |
| DTO | [Conventions](conventions.md#data-flow) | Plain TypeScript type mirroring an API or DB schema — lives in `data/dtos/`, converted to Domain models by a Mapper. |
| EventBus | [core](directory-structure.md#handharr-labscore) | In-process pub/sub bus for decoupled cross-feature communication — emit after mutation, listen in `useEffect`. |
| External | [Architecture](design-principles.md) | Outermost dependency ring — SDKs and browser APIs; imported only through Gateway, DataSource, or Service wrappers. |
| FetchPolicy | [core](directory-structure.md#handharr-labscore) | Enum controlling cache-vs-network strategy for a UseCase call (e.g. `fresh`, `cacheFirst`). |
| Field | [Design System](tiered-design-system.md#component-scope) | Molecule that wraps an input atom (Input, Textarea, Select, etc.) with a label; layout and label behavior differ per tier. |
| FileDownloader | [web-client](directory-structure.md#handharr-labsweb-client) | Triggers browser file downloads via `fromUrl`, `fromBlob`, or `fromText`. |
| FileReaderClient | [web-client](directory-structure.md#handharr-labsweb-client) | Reads local `File` objects (`readAsDataUrl`, `readAsText`, `readAsArrayBuffer`); manages object URL lifecycle. |
| FileValidator | [web-client](directory-structure.md#handharr-labsweb-client) | Validates a `File` against preset constraints (IMAGE, DOCUMENT, CSV) before upload. |
| Floating Label | [Design System](tiered-design-system.md#component-api-contract) | Gold-tier Field pattern — label starts centered inside the input and animates up and shrinks on focus or when a value is present. |
| Gateway | [Conventions](conventions.md#naming-conventions) | Infrastructure adapter wrapping a third-party SDK behind a Domain interface (e.g. `StripePaymentGateway`). |
| Gold | [Design System](tiered-design-system.md#the-model) | Tier 3 — animated interactions, Material-style motion, floating labels, full dark mode; suited to consumer-facing products. |
| Idempotency Key | [Conventions](conventions.md#mutation-flow--server-action) | Client-generated UUID added to a mutation request so that re-submissions do not create duplicate records. |
| InMemoryCacheClient | [web-client](directory-structure.md#handharr-labsweb-client) | `CacheClient` backend stored in process memory — used for SSR and tests; does not survive reload. |
| Infrastructure | [Architecture](design-principles.md) | Implements Domain interface contracts for third-party SDKs; wired by Application, never imported by Domain or Data. |
| Layer Dependency Rule | [Architecture](design-principles.md#core-philosophy) | Structural constraint: Presentation → Domain ← Data; Domain depends on nothing. |
| LocalStorageCacheClient | [web-client](directory-structure.md#handharr-labsweb-client) | `CacheClient` backend backed by `localStorage` — survives reload; used for preferences and recent searches. |
| Logger | [core](directory-structure.md#handharr-labscore) | Injected logging interface with `debug/info/warn/error` levels; `child(context)` creates scoped loggers. |
| Mapper | [Conventions](conventions.md#naming-conventions) | Pure function that converts a DTO to a Domain model; lives in `data/mappers/`. |
| Molecules | [Design System](tiered-design-system.md#component-scope) | Mid-level design system components built from atoms: Field, SearchBar, Card. |
| Organisms | [Design System](tiered-design-system.md#component-scope) | Full-section design system components: NavBar, HeroSection, Footer, EventGrid. |
| Presentation | [Architecture](design-principles.md) | React layer — pages, components, and hooks that render UI and bind domain state to ViewModels via UseCase calls. |
| ReconnectingWebSocketClient | [web-client](directory-structure.md#handharr-labsweb-client) | `WebSocketClient` decorator that reconnects on unclean close with exponential backoff (1 s → 16 s, max 5 attempts). |
| Repository | [Conventions](conventions.md#naming-conventions) | Data-layer class implementing a Domain repository interface — orchestrates DataSource and CacheClient. |
| Result | [core](directory-structure.md#handharr-labscore) | Discriminated union `{ ok: true, value: T } \| { ok: false, error: E }` — makes error paths explicit in UseCase return types. |
| Server Action | [Conventions](conventions.md#mutation-flow--server-action) | Next.js server-side mutation function — parses FormData, calls a UseCase, returns a result, revalidates paths. |
| Server Component | [Architecture](design-principles.md#server-vs-client--decision-rule) | Next.js default component that renders on the server, carries no JS bundle cost, and can `await` data directly. |
| SessionStorageCacheClient | [web-client](directory-structure.md#handharr-labsweb-client) | `CacheClient` backend backed by `sessionStorage` — cleared on tab close; used for wizard state and draft forms. |
| Showcase Package | [Design System](tiered-design-system.md#showcase-packages---ui-name-showcase) | A `ui-{name}-showcase` package used as a pre-deal sales tool; depends on all three tiers; discarded once a tier is chosen. |
| Silver | [Design System](tiered-design-system.md#the-model) | Tier 2 — polished spacing and visual hierarchy, subtle focus states, no motion; suited to production SaaS. |
| Skeleton | [Design System](tiered-design-system.md#component-scope) | Gold-only atom that renders placeholder shapes for per-component loading states. |
| Spinner | [Design System](tiered-design-system.md#component-scope) | Loading indicator atom present in all three tiers; visually distinct per tier; primary loading pattern in Bronze and Silver. |
| Tier | [Design System](tiered-design-system.md#the-model) | A named quality level (Bronze / Silver / Gold) that determines the visual sophistication and interaction patterns of a base design system package. |
| Tier Tokens | [Design System](tiered-design-system.md#token-architecture) | CSS custom properties defined under `:root` in a tier package — neutral fallback palette that brand tokens override. |
| Tier-Invariant | [Design System](tiered-design-system.md#tier-invariant-components) | Descriptor for a component whose visual output is identical across all three tiers by design. |
| ui-base-bronze | [Packages](directory-structure.md#design-system-tiers) | Tier 1 standalone design system package (`@handharr-labs/ui-base-bronze`); no shared base with silver or gold. |
| ui-base-gold | [Packages](directory-structure.md#design-system-tiers) | Tier 3 standalone design system package (`@handharr-labs/ui-base-gold`); no shared base with bronze or silver. |
| ui-base-silver | [Packages](directory-structure.md#design-system-tiers) | Tier 2 standalone design system package (`@handharr-labs/ui-base-silver`); no shared base with bronze or gold. |
| ui-{name} | [Packages](directory-structure.md#handharr-labsui-name) | Client brand package — extends exactly one tier; adds brand tokens and domain organisms. Never re-implements atoms or molecules. |
| ui-{name}-showcase | [Packages](directory-structure.md#handharr-labsui-name-showcase) | Pre-deal demo package — depends on all three tiers for playground demos; never a production dependency. |
| UseCase | [Conventions](conventions.md#naming-conventions) | Stateless Domain orchestrator — one per user action or page load; returns `Result<T, DomainError>`. |
| useViewModel | [Conventions](conventions.md#naming-conventions) | Custom hook naming convention (`use{Name}`) — calls a UseCase and maps Domain models to ViewModel types for a component. |
| ViewModel | [Conventions](conventions.md#viewmodel-mapping) | Flat, display-ready TypeScript type passed as component props; mapped from Domain models in the hook — never a raw Domain model. |
| web-client | [Packages](directory-structure.md#handharr-labsweb-client) | Frontend-specific primitives package (`@handharr-labs/web-client`) — HTTP, storage, file, and WebSocket abstractions; depends on `core`. |
| web-server | [Packages](directory-structure.md#handharr-labsweb-server) | Backend-specific primitives package (`@handharr-labs/web-server`) — DB adapters and server action utilities; depends on `core`. |
| WebSocketClient | [web-client](directory-structure.md#handharr-labsweb-client) | Wrapper around the native WebSocket API — `BrowserWebSocketClient` for direct use, `ReconnectingWebSocketClient` for auto-reconnect. |

---

## Changelog

See git history for this file.
