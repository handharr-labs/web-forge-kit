# Conventions

What the rules are, how to implement them, and when each pattern applies.

---

## Naming Conventions

| Suffix | Layer | Example |
|---|---|---|
| `UseCase` | Domain | `SearchTracksUseCase` |
| `Service` | Domain | `PlayerService`, `CartService` |
| `Repository` | Data | `TrackRepository` |
| `DataSource` | Data | `TrackRemoteDataSource` |
| `ApiRequest` | Data | `TrackSearchApiRequest` |
| `Mapper` | Data | `TrackMapper` |
| `Gateway` | Infrastructure | `StripePaymentGateway` |
| `ViewModel` | Presentation type | `TrackViewModel` |
| `use{Name}` | Presentation hook | `useTrackListViewModel` |

Use `*ApiRequest` for HTTP payload objects — never `*Request` (collides with Domain Request types).

---

## UseCase vs Domain Service

| | UseCase | Domain Service |
|---|---|---|
| Triggered by | User action or page load | Another component or service |
| State | Stateless | Can be stateful |
| Lifetime | Per call | Injected; lives as needed |
| Imports | Nothing external | Nothing external |

---

## Layer Rules

- Domain never imports from Data, Infrastructure, or External.
- Hooks call UseCases — never Repositories or DataSources directly.
- Components receive ViewModel types — never raw Domain models as props.
- All dependencies injected via constructor. No `new` inside UseCases or Repositories.
- DI composition root lives in the nearest `layout.tsx` or a dedicated Provider component.
- Default to Server Component. Add `"use client"` only at the interactive leaf.
- No default concrete args in Repository constructors — hides dependencies and makes testing harder.

---

## ViewModel Mapping

Never pass Domain models as component props directly. The hook maps Domain → ViewModel so the component has no knowledge of business types.

```ts
// Domain model — business shape
interface Track { id: string; durationMs: number; artistName: string }

// ViewModel type — display shape
interface TrackViewModel { id: string; duration: string; subtitle: string }

// Mapper in hook
const vm: TrackViewModel = {
  id: track.id,
  duration: formatDuration(track.durationMs),   // "3:45"
  subtitle: track.artistName,
}
```

---

## Data Flow

**DTO → Mapper → Domain Model flow:**

```
RemoteDataSource fetches JSON
  → unwraps ApiResponse<DTO> envelope → DTO[]
  → compactMap(dtos, Mapper.toDomain) → Model[] (nulls dropped)
  → Repository returns Model[] to UseCase
  → UseCase returns Result<Model[], DomainError> to hook
  → hook maps Model[] → ViewModel[]
```

### Read flow — Client Component

```
Component mounts → useViewModel hook initializes → isLoading = true

// Phase 1 — cache (instant)
const cached = cache.get<Track[]>(key)
if (cached) setState(cached.map(toViewModel))

// Phase 2 — network
const result = await useCase.execute(createQueryRequest(query, FetchPolicies.fresh))
if (!result.ok) return setError(result.error.message)
cache.set(key, result.value, 5 * 60 * 1000)     // 5 min TTL
setState(result.value.map(toViewModel))

→ finally: isLoading = false
```

### Read flow — Server Component

```ts
export default async function TracksPage() {
  const result = await searchTracksUseCase.execute(
    createQueryRequest({ term: "jazz" }, FetchPolicies.fresh)
  );
  if (!result.ok) throw result.error; // caught by error.tsx boundary
  return <TrackList tracks={result.value.map(toViewModel)} />;
}
```

### Mutation flow — Server Action

```
Component calls Server Action on form submit
  → Server Action parses FormData → builds Request
  → UseCase.execute(request) → Result<Model, DomainError>
  → if !result.ok → return { error: result.error.message }
  → revalidatePath() triggers re-render
  → EventBus.emit("entity:created", { id: result.value.id })
```

Idempotency keys on mutations — generate a client-side UUID before building the Request. Generate at the call site (Server Action or hook), never inside the Repository.

---

## Dependency Injection

Dependencies flow inward. Each layer receives its dependencies via constructor.

```ts
// Application (layout or provider) — builds the full graph
const logger     = new ConsoleLogger({ service: "music" });
const analytics  = new ConsoleAnalyticsGateway();
const eventBus   = new InMemoryEventBus<AppEventMap>();
const apiClient  = new FetchApiClient({ baseUrl: process.env.API_URL! });
const authClient = new AuthenticatedApiClient(apiClient, tokenService);
const cache      = new LocalStorageCacheClient("music");
const remote     = new TrackRemoteDataSource(authClient);
const repo       = new TrackRepository(remote, cache, logger);
const useCase    = new SearchTracksUseCase(repo);

<SearchUseCaseContext.Provider value={useCase}>
  {children}
</SearchUseCaseContext.Provider>
```

---

## External SDK Wrapping

**No wrapper needed: React only.** React (hooks, context, JSX) is the UI primitive — wrapping it is impractical. **Always wrap everything else.** "First-party" is not the criterion — "bounded scope" is.

| External SDK / API | No-wrap? | Wrapper | Lives in |
|---|---|---|---|
| React (hooks, context, JSX) | Yes | — | (used directly) |
| next/image | Yes | — | (used directly) |
| Stripe.js | | StripePaymentGateway | Infrastructure |
| Firebase Auth + Analytics | | FirebaseGateway | Infrastructure |
| PostHog | | PostHogAnalyticsGateway | Infrastructure |
| Web Push API | | PushNotificationGateway | Infrastructure |
| fetch (HTTP) | | ApiClient | @handharr-labs/web-client |
| native WebSocket | | WebSocketClient | @handharr-labs/web-client |
| localStorage / sessionStorage | | CacheClient | @handharr-labs/web-client |
| FileReader / URL.createObjectURL | | FileReaderClient | @handharr-labs/web-client |
| `<a download>` / URL.createObjectURL | | FileDownloader | @handharr-labs/web-client |
| cookies() / headers() | | SessionDataSource | Data |

---

## Networking

```
ApiClient / AuthenticatedApiClient
  └─ always use AuthenticatedApiClient for authenticated endpoints
  └─ pass RequestOptions.signal from AbortController for cancellable requests
  └─ pass RequestOptions.next for Server Component fetch caching

ApiResponse envelope — unwrap in RemoteDataSource, never in Repository or UseCase

HTTP status code semantics — map in RemoteDataSource, never in the hook:
  └─ 401 Unauthorized  → ApiError.unauthorized() → AuthenticatedApiClient retries once
  └─ 403 Forbidden     → show access denied
  └─ 404 Not Found     → remove from cache, show empty state
  └─ 409 Conflict      → ConflictError — specific domain UX, NOT a generic retry
  └─ 422 Unprocessable → ValidationError with field errors
  └─ 429 Rate Limited  → show backoff UI
  └─ 5xx Server Error  → transient; show retry UI
  └─ TIMEOUT           → transient; show retry UI (distinct from ABORTED)

409 and 5xx must never share a code path.
422 field errors must be mapped to ValidationError.fields, not a generic message.
```

---

## Storage

```
CacheClient — use for all Repository caching
  └─ always namespace by feature: new LocalStorageCacheClient("music")
  └─ always set TTL on set() — never cache indefinitely
  └─ TTL choice:
       Session data (search results, feed)   → 5 min
       Semi-stable data (user profile)       → 30 min
       Stable reference data (categories)    → 24 hr

Backend selection:
  └─ InMemoryCacheClient      → SSR, tests, data that must not survive reload
  └─ LocalStorageCacheClient  → user preferences, recent searches — survives reload
  └─ SessionStorageCacheClient → wizard state, draft forms — cleared on tab close
```

---

## Logging

```
Logger — inject at DI root; pass via constructor
  └─ child(context) — create scoped loggers per feature/module

Level guide:
  └─ debug — internal state, only useful during development
  └─ info  — notable events (user actions, state transitions)
  └─ warn  — recoverable issues (cache miss, retry attempt)
  └─ error — failures that affect the user; always include the error object

Use NoOpLogger in tests. ConsoleLogger in dev. Real logger via Gateway in prod.
```

---

## Events

```
EventBus — cross-feature communication without coupling
  └─ define AppEventMap once in src/app/events.ts
  └─ emit after a mutation completes — not before
  └─ listen in useEffect with cleanup: return eventBus.on("auth:logout", handler)
  └─ once() for one-shot reactions

Rule: never import Feature B from Feature A.
      Feature B emits → Feature A listens → neither knows the other exists.
```

---

## WebSocket

```
WebSocketClient — peer to ApiClient for real-time
  └─ use BrowserWebSocketClient for direct control
  └─ wrap with ReconnectingWebSocketClient for auto-reconnect
  └─ always unsubscribe handlers in useEffect cleanup
  └─ send() throws if state !== "open" — check state before calling

ReconnectingWebSocketClient backoff:
  └─ attempt 1: 1s · attempt 2: 2s · attempt 3: 4s · attempt 4: 8s · attempt 5: 16s
  └─ maxAttempts default 5 — after that, surface a reconnect button
  └─ only reconnects on unclean close — never on intentional disconnect
```

---

## File Handling

```
FileDownloader — output (trigger browser download)
  └─ fromUrl / fromBlob / fromText

FileReaderClient — input (read local File objects)
  └─ readAsDataUrl / readAsText / readAsArrayBuffer
  └─ createObjectUrl / revokeObjectUrl — always revoke after use

FileValidator — validate before upload, not after
  └─ use preset constraints: IMAGE_CONSTRAINTS · DOCUMENT_CONSTRAINTS · CSV_CONSTRAINTS

File upload — feature-specific, lives in feature Infrastructure
```

---

## Concurrency and Async

```
async/await throughout — no callbacks or .then chains
tryCatchAsync(fn) — wrap any async fn into Result<T, Error>
Promise.all — parallel independent fetches; sequential for dependent
AbortController — cancel on unmount or re-trigger
try/finally — isLoading = false guaranteed on any exit path
```

---

## Routing and Navigation

```
Next.js App Router
  └─ layout.tsx — shared shell, DI composition root per subtree
  └─ page.tsx   — Server Component by default; async data loading
  └─ loading.tsx, error.tsx — Suspense and error boundaries per segment

Navigation
  └─ <Link href="..."> — client-side navigation
  └─ useRouter() — programmatic navigation in Client Components
  └─ redirect() — server-side redirect in Server Components / Server Actions
  └─ never hard-code paths — define route constants in app/routes.ts
```

---

## Adapting to a Feature

When given a new feature, map it onto this architecture:

1. **Identify the domain** — what are the entities?
2. **Name the Repositories** — one per domain entity or aggregate
3. **Name the UseCases** — one per user action or page load; return `Result<T, DomainError>`
4. **Identify Domain Services** — anything stateful, long-lived, or shared across screens
5. **Apply FetchPolicy** — does this screen need fresh data? Can it show stale?
6. **Pick CacheClient backend** — InMemory (SSR/tests), LocalStorage (persists), SessionStorage (tab-scoped)
7. **Identify external SDKs** — React → no wrapper. Single-layer → DataSource or Service. Multi-layer → Gateway.
8. **Identify EventBus events** — what does this feature emit? What does it listen to?
9. **File handling** — validate before upload, preview with FileReaderClient, download with FileDownloader
10. **Real-time?** — use WebSocketClient; wrap in ReconnectingWebSocketClient if needed
11. **Server or Client?** — default Server Component; push `"use client"` to the smallest interactive leaf
12. **Draw the data flow** — Component → Hook → UseCase → Repository → DataSource
