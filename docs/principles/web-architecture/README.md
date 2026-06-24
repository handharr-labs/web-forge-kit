# Web Architecture

> Author: Puras Handharmahua · 2026-06-24

**Audience:** developers building downstream Next.js 15 apps on the `@handharr-labs/*` packages. This is the guide you follow when writing features. For how the kit itself is structured and extended, see the repo principles in [`../forge-kit/`](../forge-kit/).

These docs describe the **actual** stack shipped by `core`, `web-client`, and `web-server` — manual constructor injection, `Result<T, DomainError>`, `fetch`-based `ApiClient`, and `ApiError`. They supersede the legacy `personal-workdocs/web/` notes, which described a different stack (`neverthrow` / `tsyringe` / `axios`).

## The one rule

> **Build features on the kit — never reinvent its primitives.**
>
> Networking, result/error types, validation, caching, storage, DI plumbing, logging, formatting, and pagination all ship from `@handharr-labs/core`, `@handharr-labs/web-client`, and `@handharr-labs/web-server`. A downstream app writes **features only** (Domain · Data · Presentation). If you find yourself hand-rolling an HTTP client, a `Result`, an error type, or a cache, stop — import it from the kit. If the kit is missing something genuinely shared, add it to the kit (see [`../forge-kit/`](../forge-kit/)), don't fork it into the app.

| Doc | Covers |
|---|---|
| [design-principles.md](design-principles.md) | Layer-by-layer reference — Domain, Data, Presentation, DI, Server Actions, error handling, testing. *What & why.* |
| [directory-structure.md](directory-structure.md) | Folder layout, file naming, and which `@handharr-labs/*` package each layer may import. *What & where.* |
| [conventions.md](conventions.md) | In-the-small code rules — null safety, helpers, magic constants, TS strictness, barrels, Result/error usage. *What, how, when.* |
| [glossary.md](glossary.md) | Every term used in these docs — layer roles, wiring patterns, conventions — one line each. |

## Related — repo principles (`docs/principles/forge-kit/`)

| Doc | Scope |
|---|---|
| [design-principles.md](../forge-kit/design-principles.md) | Why the kit architecture exists — the reasoning behind each choice. |
| [directory-structure.md](../forge-kit/directory-structure.md) | Kit package map and dependency graph. |
| [glossary.md](../forge-kit/glossary.md) | Every coined term, one line each. |
| [tiered-design-system.md](../forge-kit/tiered-design-system.md) | UI tier model (Bronze / Silver / Gold) and brand packages. |
