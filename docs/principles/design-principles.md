# Design Principles

Why this architecture exists and the reasoning behind each decision.

---

## Core Philosophy

**Clean Architecture + React Hooks + Next.js App Router**

Layer dependency rule: **Presentation → Domain ← Data.** Infrastructure conforms to Domain interfaces. Domain depends on nothing. External is the outermost ring — only wrapper layers (Gateway, DataSource, Service) import from it; nothing in Domain or Presentation touches External directly.

The Data layer knows Domain models (via Mapper). The Presentation layer knows Domain models (via UseCase). Infrastructure implements Domain interfaces but is never imported by Domain, Data, or Presentation — only wired by Application. External depends on nothing inside the app; it is the dependency.

**Multi-app variant — Shared packages.** Networking and storage primitives that every app needs live in shared packages (`@handharr-labs/core`, `@handharr-labs/web-client`). These hold no domain knowledge and import no feature-specific types. Each feature's Data layer imports them; Domain never does.

**Design system tiers.** UI components live in tier packages (`ui-base-bronze`, `ui-base-silver`, `ui-base-gold`). All tiers expose the same component API — same names, same props. The tier determines visual sophistication and interaction quality, not component scope. Client brand packages (`ui-{name}`) extend exactly one tier with brand tokens and domain organisms. Pre-deal showcase packages (`ui-{name}-showcase`) depend on all three tiers for playground demos and are never imported by production apps.

---

## Why These Choices

### Clean Architecture over "feature folders with colocated logic"

Colocated logic (API call + business rule + component in one file) works until the feature grows. Once two screens share a business rule, it gets duplicated or extracted ad hoc. Clean Architecture enforces the dependency rule upfront: each layer is independently testable and replaceable. Cost: more files. Benefit: every layer can be tested without the others.

### Custom Hook (useViewModel) over direct server state in components

Putting `fetch` calls directly in components collapses Presentation and Data into one layer. A custom hook decouples the component (how to render) from the view model (what state to expose). The hook owns loading state, error state, and UseCase calls. The component owns layout and event binding only.

### UseCase over putting business logic in hooks

If business logic lives in a hook, it's only reusable from React. A UseCase is plain TypeScript — reusable from a Server Action, an API Route Handler, a cron job, or a test. The hook is the bridge from React land into domain land; it should contain no business decisions.

### Manual constructor injection over a DI container

A DI container (InversifyJS, tsyringe) adds a decorator/reflect-metadata build step and produces invisible dependency graphs. Manual constructor injection is explicit at the composition root, traceable with IDE "find usages", and has zero build overhead. The trade-off is verbosity at the composition root — acceptable until the graph is genuinely large.

### Repository over calling `fetch` directly in UseCases

If a UseCase calls `fetch` directly, it is coupled to the network. Swapping to a mock in tests requires patching the global `fetch`. A Repository protocol means the UseCase is tested against a mock implementation — the actual network call never runs in unit tests.

### Server Components vs Client Components — intentional split

Server Components render on the server, have no JavaScript bundle cost, and can `await` data directly. Client Components own interactivity and local state. The rule: push data fetching to the server (Server Component or Server Action), push interactivity to the client (Client Component). Avoid `"use client"` at the page level — it opts the entire subtree into the client bundle.

### Result<T, E> over throwing in UseCases

Throwing forces every caller to wrap in try/catch, spreading error handling across the codebase. `Result` makes the error path explicit in the type — callers cannot ignore it. Hooks and Server Actions check `result.ok` before accessing `result.value`. UseCases may use either; prefer `Result` for expected failures (validation, not found) and throw only for unexpected errors.

### EventBus over direct feature imports

Features should not import each other. When Feature A needs to react to something Feature B did (e.g. auth logout clears music cache), importing Feature B from Feature A creates coupling. The EventBus decouples them: Feature B emits, Feature A listens. Neither knows the other exists.

---

## Server vs Client — Decision Rule

| Concern | Server Component | Client Component |
|---|---|---|
| Initial data fetch | Yes — await directly | No — adds client bundle |
| User interaction | No | Yes |
| Local state | No | Yes |
| Browser APIs (FileReader, WebSocket) | No | Yes |
| EventBus listeners | No | Yes — useEffect |
| SEO-critical content | Yes | Avoid |

**Default to Server Component.** Add `"use client"` only at the interactive leaf.

---

## Testing Philosophy

**Rule: mock the layer below, assert on the layer you just built.**

| Layer | What to mock | What to assert |
|---|---|---|
| Hook | MockUseCase | State after action (loading, result, error) |
| UseCase | MockRepository | Result value, DomainError type, business rules |
| Repository | MockRemoteDataSource + InMemoryCacheClient | FetchPolicy logic, Mapper output, TTL |
| DataSource | MockApiClient | Request shape, response decoding, ApiError mapping |
| Gateway | MockGatewayInterface | Interface method called, correct input forwarded |

No mocking of concrete types. Every dependency is injected via an interface.
