# Feature Design Principles

> Author: Puras Handharmahua · 2026-06-24
> Related: [directory-structure.md](directory-structure.md) · [conventions.md](conventions.md) · [glossary.md](glossary.md) · [forge-kit/design-principles.md](../forge-kit/design-principles.md)

The **what & why** of feature architecture: a layer-by-layer Clean Architecture reference for Next.js 15 (App Router) apps built on the `@handharr-labs/*` packages. Every code sample uses the **actual** APIs shipped by `core`, `web-client`, and `web-server` — no `neverthrow`, no `tsyringe`, no `axios`. For the **what & where** (folder layout, file naming, which package each layer imports) see [directory-structure.md](directory-structure.md).

The downstream app writes **features only**. Networking, storage, error primitives, DI plumbing, and result/error types all come from the kit.

```
UI  →  Presentation  →  Domain  ←  Data
                          ↑
                    Application (composition root — wires everything)
```

---

## Stack at a glance

| Concern | Provided by | Symbol |
|---|---|---|
| Result type | `@handharr-labs/core` | `Result<T, E>`, `ok`, `err` |
| Domain errors | `@handharr-labs/core` | `DomainError` + subclasses |
| Validation | `@handharr-labs/core` | `Validator`, `ZodValidator` |
| HTTP | `@handharr-labs/web-client` | `ApiClient`, `FetchApiClient`, `AuthenticatedApiClient` |
| Transport error | `@handharr-labs/web-client` | `ApiError`, `ApiErrorCode` |
| Cache | `@handharr-labs/web-client` | `CacheClient` + backends |
| DI (client) | `@handharr-labs/web-client` | `createDIProvider` |
| Server actions / DB | `@handharr-labs/web-server` | `ServerActionResult`, `DatabaseClient` |
| Dependency injection | — | manual constructor injection at a composition root |

The app installs **zero** of `neverthrow` / `tsyringe` / `axios`. Use `zod` (validation), `@tanstack/react-query` (server-state in hooks), and optionally `zustand` (client-only UI state).

---

# Domain

The innermost layer. Imports nothing but TypeScript and `@handharr-labs/core` primitives. No framework, no HTTP client, no DTO, no React.

## Creation order

```
Model → Repository interface → UseCase(s) → Domain Service (only if needed)
```

Never create a UseCase before the repository interface it depends on.

```
domain/
  models/{feature}.ts                 ← Pure TS type, immutable
  interfaces/{feature}.repository.ts   ← Repository contract
  params/{feature}.params.ts           ← UseCase input types
  use-cases/{verb}-{feature}.use-case.ts
  services/{feature}-{noun}.service.ts ← Only when logic spans entities / is reused
```

## Model

A **Model** is a pure data structure representing a business concept. Field names use domain vocabulary, never the API shape.

**Invariants:** no framework imports · no business logic · no serialization (`toJson`/Zod) · all properties `readonly`.

```typescript
// domain/models/employee.ts
export interface Employee {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly joinDate?: Date;
  readonly departmentId?: string;
}
```

## Domain error

Domain operations return `Result<T, DomainError>` — they never throw transport errors and never leak HTTP status codes upward. `DomainError` and its subclasses ship from `core`.

```typescript
// from @handharr-labs/core
class DomainError extends Error { readonly code: string; /* ... */ }

NotFoundError      // code: "NOT_FOUND"
ValidationError    // code: "VALIDATION_ERROR"  — carries fields?: Record<string, string[]>
ConflictError      // code: "CONFLICT"
UnauthorizedError  // code: "UNAUTHORIZED"
ForbiddenError     // code: "FORBIDDEN"
UnexpectedError    // code: "UNEXPECTED_ERROR" — carries the original cause
```

A feature defines its own error by extending `DomainError`:

```typescript
// domain/errors/leave.errors.ts
import { DomainError } from "@handharr-labs/core";

export class InsufficientLeaveBalanceError extends DomainError {
  constructor(remaining: number, requested: number) {
    super("INSUFFICIENT_LEAVE_BALANCE", `Requested ${requested} days, only ${remaining} available`);
    this.name = "InsufficientLeaveBalanceError";
  }
}
```

## Result

`Result<T, E>` is a discriminated union from `core` — error paths are explicit in the type. There is **no `.isOk()` / `.isErr()` method**; you narrow on the `ok` field.

```typescript
import { ok, err, type Result } from "@handharr-labs/core";

// Narrowing
if (result.ok) {
  use(result.value);
} else {
  handle(result.error);
}

// Combinators (all from core)
mapResult(result, fn);       // map the success value
flatMapResult(result, fn);   // chain a Result-returning fn
mapError(result, fn);        // map the error
getOrElse(result, fallback); // extract or default
getOrThrow(result);          // extract or throw the error
tryCatchAsync(() => fn());   // Promise<T> → Promise<Result<T, Error>>
```

> Convention: return `Result` for **expected** failures (not found, validation, conflict). Throw only for genuinely unexpected programmer errors.

## Repository interface

A contract for data access — *what*, not *how*. Lives in Domain; implemented in Data.

**Invariants:** returns Domain models wrapped in `Result<T, DomainError>` — never DTOs · parameters are domain objects · method names follow intent (`get*`, `create*`, `update*`, `delete*`).

```typescript
// domain/interfaces/employee.repository.ts
import type { Result, DomainError } from "@handharr-labs/core";
import type { Employee } from "../models/employee";
import type { GetEmployeesParams, UpdateEmployeeParams } from "../params/employee.params";

export interface EmployeeRepository {
  getEmployee(id: string): Promise<Result<Employee, DomainError>>;
  getEmployees(params?: GetEmployeesParams): Promise<Result<Employee[], DomainError>>;
  updateEmployee(params: UpdateEmployeeParams): Promise<Result<Employee, DomainError>>;
  deleteEmployee(id: string): Promise<Result<void, DomainError>>;
}
```

```typescript
// domain/params/employee.params.ts
export interface GetEmployeesParams {
  page?: number;
  pageSize?: number;
  departmentId?: string;
}

export interface UpdateEmployeeParams {
  id: string;
  name: string;
  email: string;
  departmentId?: string;
}
```

## UseCase

One business operation: one class, one public method (`execute`). Stateless. Depends only on repository interfaces — never implementations, never the network.

**Mandatory call flow:** `Presentation → UseCase → Repository`. A Presentation layer calling a Repository directly is a violation.

Dependencies are passed via the **constructor** — no decorators, no container lookups inside the class.

```typescript
// domain/use-cases/get-employee.use-case.ts
import type { Result, DomainError } from "@handharr-labs/core";
import type { Employee } from "../models/employee";
import type { EmployeeRepository } from "../interfaces/employee.repository";

export class GetEmployeeUseCase {
  constructor(private readonly repository: EmployeeRepository) {}

  execute(id: string): Promise<Result<Employee, DomainError>> {
    return this.repository.getEmployee(id);
  }
}
```

```typescript
// domain/use-cases/submit-leave-request.use-case.ts
import { ok, err, type Result, type DomainError } from "@handharr-labs/core";
import type { LeaveRepository } from "../interfaces/leave.repository";
import { LeaveBalanceCalculator } from "../services/leave-balance.service";
import { InsufficientLeaveBalanceError } from "../errors/leave.errors";
import type { SubmitLeaveParams } from "../params/leave.params";

export class SubmitLeaveRequestUseCase {
  constructor(
    private readonly repository: LeaveRepository,
    private readonly calculator: LeaveBalanceCalculator,
  ) {}

  async execute(params: SubmitLeaveParams): Promise<Result<void, DomainError>> {
    const entitlement = await this.repository.getEntitlement(params.employeeId);
    if (!entitlement.ok) return entitlement;

    if (!this.calculator.isSufficient(entitlement.value, params.days)) {
      const remaining = this.calculator.remainingDays(entitlement.value);
      return err(new InsufficientLeaveBalanceError(remaining, params.days));
    }

    return this.repository.submit(params);
  }
}
```

## Domain Service

Pure business logic that spans multiple models or is reused across ≥2 UseCases.

**Invariants:** no I/O, no async, no framework. Same input → same output. Returns structured data, never formatted strings.

| Scenario | Decision |
|---|---|
| 1–3 line condition | Keep inline in the UseCase |
| Complex multi-step rule | Extract to a service |
| Reused across ≥2 UseCases | Extract to a service |
| Needs isolated unit tests | Extract to a service |

```typescript
// domain/services/leave-balance.service.ts
import type { LeaveEntitlement } from "../models/leave-entitlement";

export class LeaveBalanceCalculator {
  remainingDays(entitlement: LeaveEntitlement): number {
    const pending = entitlement.pendingRequests.reduce((sum, r) => sum + r.days, 0);
    const remaining = entitlement.annualDays - entitlement.usedDays - pending;
    return remaining < 0 ? 0 : remaining;
  }

  isSufficient(entitlement: LeaveEntitlement, requestedDays: number): boolean {
    return this.remainingDays(entitlement) >= requestedDays;
  }
}
```

---

# Data

Implements the Domain repository interfaces. The only layer that knows DTOs, HTTP, and `ApiError`. Maps both directions — DTO → Model and `ApiError` → `DomainError`.

## Creation order

```
DTO (Zod schema) → Mapper → DataSource interface → DataSource impl → Repository impl
```

```
data/
  dtos/{feature}.dto.ts                       ← Zod schema + inferred type
  mappers/{feature}.mapper.ts                  ← DTO → Model (pure function)
  datasources/{feature}-remote.datasource.ts   ← interface
  datasources/{feature}-remote.datasource.impl.ts
  repositories/{feature}.repository.impl.ts
```

> The `ApiError → DomainError` mapping is **not** an app file — it ships from `web-client` as `mapApiError`. Import it; don't re-implement it.

## DTO

Mirrors the raw API/DB shape exactly. **All fields nullable** — API data is untrusted. Validated with a Zod schema; never carries domain logic.

```typescript
// data/dtos/employee.dto.ts
import { z } from "zod";

export const employeeDtoSchema = z.object({
  employee_id: z.string().nullable().optional(),
  full_name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  join_date: z.string().nullable().optional(),
  department_id: z.string().nullable().optional(),
});

export type EmployeeDto = z.infer<typeof employeeDtoSchema>;

export const updateEmployeePayloadSchema = z.object({
  full_name: z.string(),
  email: z.string().email(),
  department_id: z.string().optional(),
});
export type UpdateEmployeePayloadDto = z.infer<typeof updateEmployeePayloadSchema>;
```

## Mapper

Pure transformation DTO → Model. No I/O, no business logic. Handle missing fields defensively with the `core` null-safety helpers; convert date strings to `Date` here, not in the model.

```typescript
// data/mappers/employee.mapper.ts
import { orEmptyString } from "@handharr-labs/core";
import type { EmployeeDto } from "../dtos/employee.dto";
import type { Employee } from "@domain/models/employee";

export function mapEmployeeDtoToEntity(dto: EmployeeDto): Employee {
  return {
    id: orEmptyString(dto.employee_id),
    name: orEmptyString(dto.full_name),
    email: orEmptyString(dto.email),
    joinDate: dto.join_date ? new Date(dto.join_date) : undefined,
    departmentId: dto.department_id ?? undefined,
  };
}
```

## DataSource

Interface for raw data access. Returns DTOs/primitives — never Models. Calls the kit's `ApiClient` and validates the response envelope with the DTO schema. Lets `ApiError` propagate — the repository maps it.

```typescript
// data/datasources/employee-remote.datasource.ts
import type { EmployeeDto, UpdateEmployeePayloadDto } from "../dtos/employee.dto";

export interface EmployeeRemoteDataSource {
  getEmployee(id: string): Promise<EmployeeDto>;
  getEmployees(params?: { page?: number; pageSize?: number; departmentId?: string }): Promise<EmployeeDto[]>;
  updateEmployee(id: string, payload: UpdateEmployeePayloadDto): Promise<EmployeeDto>;
  deleteEmployee(id: string): Promise<void>;
}
```

```typescript
// data/datasources/employee-remote.datasource.impl.ts
import type { ApiClient, ApiResponse, ApiListResponse } from "@handharr-labs/web-client";
import { unwrapData, unwrapList } from "@handharr-labs/web-client";
import { employeeDtoSchema, type EmployeeDto, type UpdateEmployeePayloadDto } from "../dtos/employee.dto";
import type { EmployeeRemoteDataSource } from "./employee-remote.datasource";

const EMPLOYEES = "/api/v1/employees";

export class EmployeeRemoteDataSourceImpl implements EmployeeRemoteDataSource {
  constructor(private readonly api: ApiClient) {}

  async getEmployee(id: string): Promise<EmployeeDto> {
    const res = await this.api.get<ApiResponse<unknown>>(`${EMPLOYEES}/${id}`);
    return employeeDtoSchema.parse(unwrapData(res));
  }

  async getEmployees(params?: { page?: number; pageSize?: number; departmentId?: string }): Promise<EmployeeDto[]> {
    const res = await this.api.get<ApiListResponse<unknown>>(EMPLOYEES, params);
    return employeeDtoSchema.array().parse(unwrapList(res));
  }

  async updateEmployee(id: string, payload: UpdateEmployeePayloadDto): Promise<EmployeeDto> {
    const res = await this.api.put<UpdateEmployeePayloadDto, ApiResponse<unknown>>(`${EMPLOYEES}/${id}`, payload);
    return employeeDtoSchema.parse(unwrapData(res));
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.api.delete<void>(`${EMPLOYEES}/${id}`);
  }
}
```

`ApiClient` (from `web-client`) throws a typed `ApiError` on any non-2xx response, timeout, abort, network failure, or decode error:

```typescript
type ApiErrorCode =
  | "INVALID_URL" | "NOT_FOUND" | "UNAUTHORIZED" | "FORBIDDEN" | "CONFLICT"
  | "UNPROCESSABLE" | "RATE_LIMITED" | "TIMEOUT" | "ABORTED"
  | "SERVER_ERROR" | "NETWORK_ERROR" | "DECODING_FAILED" | "UNKNOWN";
```

## The transport → domain error boundary

This is the seam that keeps HTTP out of the Domain. `ApiError.code` maps almost 1:1 onto the `DomainError` subclasses, so the kit ships the mapping as **`mapApiError`** from `web-client` — you do not write it. Call it in every repository `catch`:

```typescript
import { mapApiError } from "@handharr-labs/web-client";

mapApiError(e);                          // unknown → DomainError
mapApiError(e, { resource: "Employee" }); // tunes the NotFoundError message
```

Behaviour:

| Input | Result |
|---|---|
| An existing `DomainError` | passed through unchanged |
| `ApiError` `NOT_FOUND` / `UNAUTHORIZED` / `FORBIDDEN` / `CONFLICT` / `UNPROCESSABLE` | the matching `DomainError` subclass |
| `ApiError` transport codes (`TIMEOUT`, `NETWORK_ERROR`, `RATE_LIMITED`, `SERVER_ERROR`, …) | `UnexpectedError`, with the original `ApiError` kept as `.cause` |
| Anything else | `UnexpectedError` |

> If a feature needs a richer mapping (e.g. a domain-specific error for a 409 on a specific endpoint), catch that case first and fall back to `mapApiError` for the rest — never re-implement the whole switch.

## Repository implementation

Bridges DataSource + Mapper → Domain. Wraps every DataSource call: success → `ok(map(...))`, thrown `ApiError` → `err(mapApiError(...))`. A DTO never crosses into the Domain — the mapper is the boundary.

```typescript
// data/repositories/employee.repository.impl.ts
import { ok, err, type Result, type DomainError } from "@handharr-labs/core";
import { mapApiError } from "@handharr-labs/web-client";
import type { EmployeeRepository } from "@domain/interfaces/employee.repository";
import type { GetEmployeesParams, UpdateEmployeeParams } from "@domain/params/employee.params";
import type { Employee } from "@domain/models/employee";
import type { EmployeeRemoteDataSource } from "../datasources/employee-remote.datasource";
import { mapEmployeeDtoToEntity } from "../mappers/employee.mapper";

export class EmployeeRepositoryImpl implements EmployeeRepository {
  constructor(private readonly remote: EmployeeRemoteDataSource) {}

  async getEmployee(id: string): Promise<Result<Employee, DomainError>> {
    try {
      return ok(mapEmployeeDtoToEntity(await this.remote.getEmployee(id)));
    } catch (e) {
      return err(mapApiError(e, { resource: "Employee" }));
    }
  }

  async getEmployees(params?: GetEmployeesParams): Promise<Result<Employee[], DomainError>> {
    try {
      const dtos = await this.remote.getEmployees(params);
      return ok(dtos.map(mapEmployeeDtoToEntity));
    } catch (e) {
      return err(mapApiError(e, { resource: "Employee" }));
    }
  }

  async updateEmployee(params: UpdateEmployeeParams): Promise<Result<Employee, DomainError>> {
    try {
      const dto = await this.remote.updateEmployee(params.id, {
        full_name: params.name,
        email: params.email,
        department_id: params.departmentId,
      });
      return ok(mapEmployeeDtoToEntity(dto));
    } catch (e) {
      return err(mapApiError(e, { resource: "Employee" }));
    }
  }

  async deleteEmployee(id: string): Promise<Result<void, DomainError>> {
    try {
      await this.remote.deleteEmployee(id);
      return ok(undefined);
    } catch (e) {
      return err(mapApiError(e, { resource: "Employee" }));
    }
  }
}
```

## Caching with FetchPolicy

When a repository reads through a cache, drive the cache-vs-network decision with `FetchPolicy` from `core` and a `CacheClient` from `web-client`.

```typescript
import { FetchPolicies, type FetchPolicy } from "@handharr-labs/core";
import type { CacheClient } from "@handharr-labs/web-client";

// FetchPolicies.fresh   → force network, no stale
// FetchPolicies.cached  → cache first, allow stale
// FetchPolicies.strict  → cache first, no stale fallback

async function getEmployee(id: string, policy: FetchPolicy = FetchPolicies.cached) {
  const key = `employee:${id}`;
  if (!policy.force) {
    const hit = this.cache.get<Employee>(key);
    if (hit) return ok(hit);
  }
  // ...fetch, then this.cache.set(key, value, TTL_MS)
}
```

---

# Presentation

React. Knows Domain models (through UseCases) but never DTOs, `ApiError`, or the network.

## ViewModel hook (`useViewModel`)

The **StateHolder** for a screen is a custom hook (`use{Name}`). It calls UseCases, owns loading/error/data state, and maps Domain models to flat, display-ready **ViewModel** types. Server state is implemented with TanStack Query (`QueryProvider` ships from `web-client`).

**Invariants:** no JSX/component imports · depends on UseCase instances only (resolved from DI, never instantiated) · exposes immutable state · maps Domain → ViewModel — components never receive raw Domain models.

```typescript
// presentation/hooks/use-employee.ts
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrThrow } from "@handharr-labs/core";
import { useDI } from "@/app/di";              // app's typed createDIProvider hook
import type { UpdateEmployeeParams } from "@domain/params/employee.params";

const employeeKey = (id: string) => ["employee", id] as const;

export function useEmployee(id: string) {
  const { getEmployeeUseCase } = useDI();
  return useQuery({
    queryKey: employeeKey(id),
    queryFn: () => getEmployeeUseCase.execute(id).then(getOrThrow), // throws DomainError → Query error state
  });
}

export function useUpdateEmployee() {
  const { updateEmployeeUseCase } = useDI();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: UpdateEmployeeParams) => updateEmployeeUseCase.execute(params).then(getOrThrow),
    onSuccess: (data) => qc.invalidateQueries({ queryKey: employeeKey(data.id) }),
  });
}
```

> `getOrThrow` adapts the kit's `Result` to TanStack Query's throw-based error channel — the thrown value is a `DomainError`, so `query.error` is always a `DomainError`.

For **client-only UI state** (multi-step wizards, modals, selections), use Zustand. Never register a Zustand store in the DI container — the store file owns its own module-level singleton.

## Component

Reusable UI smaller than a page. Stateless by default — props in, callbacks out. No UseCase calls. Receives ViewModels, not Domain models.

```typescript
// presentation/components/EmployeeCard.tsx
import type { EmployeeVM } from "../types/employee.vm";

interface Props {
  employee: EmployeeVM;
  onEdit?: (id: string) => void;
}

export function EmployeeCard({ employee, onEdit }: Props) {
  return (
    <div className="card">
      <h3>{employee.name}</h3>
      <p>{employee.email}</p>
      {onEdit && <button onClick={() => onEdit(employee.id)}>Edit</button>}
    </div>
  );
}
```

## Page

A full-view component bound to a route. Observes hook state and dispatches mutations — no business logic. **Server Component by default**; add `"use client"` only at the interactive leaf.

```typescript
// app/employees/[id]/page.tsx  (Server Component)
import { createServerContainer } from "@/app/di.server";
import { getOrThrow } from "@handharr-labs/core";
import { EmployeeDetailClient } from "./_components/EmployeeDetailClient";

export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const { getEmployeeUseCase } = createServerContainer();
  const employee = getOrThrow(await getEmployeeUseCase.execute(params.id)); // DomainError → error.tsx boundary
  return <EmployeeDetailClient initialData={employee} employeeId={params.id} />;
}
```

```typescript
// app/employees/[id]/_components/EmployeeDetailClient.tsx
"use client";
import { useEmployee, useUpdateEmployee } from "@features/employee/presentation/hooks/use-employee";
import type { Employee } from "@domain/models/employee";

export function EmployeeDetailClient({ initialData, employeeId }: { initialData: Employee; employeeId: string }) {
  const { data: employee = initialData, isLoading, error } = useEmployee(employeeId);
  const { mutate: update } = useUpdateEmployee();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView error={error} />;   // error is a DomainError

  return <EmployeeCard employee={toEmployeeVM(employee)} onEdit={() => update({ id: employee.id, name: employee.name, email: employee.email })} />;
}
```

---

# Dependency Injection

**Manual constructor injection wired at a composition root.** No decorators, no `reflect-metadata`, no global mutable container. The dependency graph is explicit and traceable with "find usages".

## Why not a container

A DI container adds a build step and hides the graph. Manual wiring is explicit, zero-overhead, and RSC-safe. The cost — verbosity at the composition root — is acceptable until the graph is genuinely large.

## Client composition root — `createDIProvider`

`web-client` ships a typed React-context factory. Build the graph once in a factory; the provider memoizes it for the client tree.

```typescript
// app/di.ts
"use client";
import { createDIProvider, FetchApiClient, AuthenticatedApiClient } from "@handharr-labs/web-client";
import { EmployeeRemoteDataSourceImpl } from "@features/employee/data/datasources/employee-remote.datasource.impl";
import { EmployeeRepositoryImpl } from "@features/employee/data/repositories/employee.repository.impl";
import { GetEmployeeUseCase } from "@features/employee/domain/use-cases/get-employee.use-case";
import { UpdateEmployeeUseCase } from "@features/employee/domain/use-cases/update-employee.use-case";
import { browserTokenService } from "./auth";
import { env } from "./env";

function buildContainer() {
  // 1. Infrastructure
  const api = new AuthenticatedApiClient(
    new FetchApiClient({ baseUrl: env.API_URL, timeoutMs: 30_000 }),
    browserTokenService,
  );
  // 2. DataSources  3. Repositories  4. UseCases
  const employeeRemote = new EmployeeRemoteDataSourceImpl(api);
  const employeeRepo = new EmployeeRepositoryImpl(employeeRemote);
  return {
    getEmployeeUseCase: new GetEmployeeUseCase(employeeRepo),
    updateEmployeeUseCase: new UpdateEmployeeUseCase(employeeRepo),
  };
}

export type Container = ReturnType<typeof buildContainer>;
export const { DIProvider, useDI } = createDIProvider<Container>(buildContainer);
```

```typescript
// app/layout.tsx
import { DIProvider } from "./di";
import { QueryProvider } from "@handharr-labs/web-client";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html><body>
      <QueryProvider>
        <DIProvider>{children}</DIProvider>
      </QueryProvider>
    </body></html>
  );
}
```

## Server composition root — per-request factory

React context does not cross into Server Components, Server Actions, or Route Handlers. For server code, call a plain factory **per request** — never a module-level singleton holding request state.

```typescript
// app/di.server.ts
import "server-only";
import { FetchApiClient } from "@handharr-labs/web-client";
import { EmployeeRemoteDataSourceImpl } from "@features/employee/data/datasources/employee-remote.datasource.impl";
import { EmployeeRepositoryImpl } from "@features/employee/data/repositories/employee.repository.impl";
import { GetEmployeeUseCase } from "@features/employee/domain/use-cases/get-employee.use-case";
import { serverTokenFromCookies } from "./auth.server";
import { env } from "./env";

export function createServerContainer() {
  const api = new FetchApiClient({
    baseUrl: env.API_URL,
    defaultHeaders: { Authorization: `Bearer ${serverTokenFromCookies()}` },
  });
  const repo = new EmployeeRepositoryImpl(new EmployeeRemoteDataSourceImpl(api));
  return { getEmployeeUseCase: new GetEmployeeUseCase(repo) };
}
```

## Registration order

The wiring order mirrors the dependency graph — innermost dependency first:

```
Infrastructure (ApiClient, TokenService, CacheClient)
  → DataSources
  → Repositories
  → UseCases
```

## HTTP client composition

`web-client` ships composable `ApiClient` decorators — layer them in this order (innermost first):

```typescript
new InterceptingApiClient(            // logging / timing  (outermost)
  new AuthenticatedApiClient(         // token inject + 401 refresh-and-retry
    new FetchApiClient({ baseUrl }),  // raw fetch         (innermost)
    tokenService,
  ),
  [new LoggingInterceptor(logger)],
);
```

`TokenService` is the app-supplied contract `AuthenticatedApiClient` depends on:

```typescript
interface TokenService {
  getAccessToken(): Promise<string>;
  refresh(): Promise<string>;       // deduplicated — N concurrent 401s trigger one refresh
  onRefreshFailed(): void;          // e.g. redirect to login
}
```

---

# Server Actions

Server Actions are the server-side mutation entry point. They parse input, call a UseCase via the server container, and return a `ServerActionResult<T>` from `web-server`. They never throw to the client.

```typescript
type ServerActionResult<T> = { data?: T; error?: string };
function toServerActionResult<T>(result: Result<T, DomainError>): ServerActionResult<T>; // Result → action shape
function handleServerActionError(error: unknown): string; // for a thrown error: DomainError → message, else generic
```

```typescript
// app/employees/[id]/actions.ts
"use server";
import { toServerActionResult, type ServerActionResult } from "@handharr-labs/web-server";
import { createServerContainer } from "@/app/di.server";
import type { Employee } from "@domain/models/employee";

export async function updateEmployeeAction(formData: FormData): Promise<ServerActionResult<Employee>> {
  const { updateEmployeeUseCase } = createServerContainer();
  const result = await updateEmployeeUseCase.execute({
    id: String(formData.get("id")),
    name: String(formData.get("name")),
    email: String(formData.get("email")),
  });
  return toServerActionResult(result);
}
```

> `ServerActionResult<T>` is a serialization-friendly projection of `Result<T, DomainError>` (errors become strings to cross the server→client boundary). `toServerActionResult` does the conversion at the action edge — keep `Result` everywhere inside. Use `handleServerActionError` only when you're catching a *thrown* error rather than converting a `Result`.

## Database access

`web-server` provides the DB seam — a generic `DatabaseClient<TDb>` and a Drizzle/Postgres factory (subpath `@handharr-labs/web-server/db/drizzle`). A server-side DataSource depends on `DatabaseClient`, never on the driver.

```typescript
import { createDrizzlePostgresClient } from "@handharr-labs/web-server/db/drizzle";

export const { db } = createDrizzlePostgresClient({
  connectionString: env.DATABASE_URL,
  prepare: false, // required for the Supabase transaction pooler
});
```

---

# Error Handling

Errors are mapped at each boundary as they travel outward:

```
DataSource           throws ApiError (transport)
  ↓ caught by
Repository impl       mapApiError() → err(DomainError)          Result.err
  ↓ returned to
UseCase               propagates Result.err unchanged
  ↓ received by
Hook (useViewModel)   getOrThrow → TanStack Query error state   (error is a DomainError)
  ↓ observed by
Component             renders inline error  OR  throws to error.tsx
```

| Error surface | Handler |
|---|---|
| Blocking / full-page | `getOrThrow(result)` in a Server Component → `error.tsx` boundary |
| Non-blocking / inline | check `result.ok` (or `query.error`) → inline message / toast |
| Server Action | `handleServerActionError` → `{ error: string }` |

## Validation errors

`ValidationError` (from `core`) carries `fields?: Record<string, string[]>`. The kit's `ZodValidator.parse` throws a `ValidationError` with the field map already populated; surface it per-field in the form.

```typescript
import { ValidationError } from "@handharr-labs/core";

onError: (error) => {
  if (error instanceof ValidationError && error.fields) {
    Object.entries(error.fields).forEach(([field, messages]) =>
      form.setError(field, { message: messages[0] }),
    );
  } else {
    toast.error(error.message);
  }
}
```

---

# Testing

**Rule: mock the layer below, assert on the layer you just built.** No mocking of concrete types — every dependency is injected via an interface.

| Layer | What to mock | What to assert |
|---|---|---|
| Hook | UseCase instance | State after action (loading, data, error) |
| UseCase | Repository interface | `Result` value, `DomainError` type, business rules |
| Repository impl | DataSource + `CacheClient` | Mapper output, `FetchPolicy` logic, `ApiError → DomainError` |
| DataSource | `ApiClient` | Request shape, response decoding, thrown `ApiError` |

```typescript
// repository test — the transport→domain boundary
import { ApiError } from "@handharr-labs/web-client";

it("maps NOT_FOUND ApiError to NotFoundError", async () => {
  const remote = { getEmployee: vi.fn().mockRejectedValue(ApiError.notFound()), /* ... */ };
  const repo = new EmployeeRepositoryImpl(remote);

  const result = await repo.getEmployee("1");

  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.error.code).toBe("NOT_FOUND");
});
```

```typescript
// usecase test — mock the repository, assert the Result
it("returns entity when repository succeeds", async () => {
  const repo = { getEmployee: vi.fn().mockResolvedValue(ok(tEmployee)) /* ... */ };
  const useCase = new GetEmployeeUseCase(repo as EmployeeRepository);

  const result = await useCase.execute("1");

  expect(result.ok).toBe(true);
  expect(repo.getEmployee).toHaveBeenCalledWith("1");
});
```

```
         ┌──────────────────┐
         │   E2E (few)      │  critical journeys — Playwright
         ├──────────────────┤
         │ Integration      │  repository ↔ datasource wiring
         ├──────────────────┤
         │ Unit (many)      │  use cases, mappers, domain services
         └──────────────────┘
```

---

# Cross-cutting utilities (from `core`)

| Utility | Symbol | Note |
|---|---|---|
| Logging | `Logger`, `ConsoleLogger`, `NoOpLogger` | `child(context)` for scoped loggers; inject, never `console.log` at call sites |
| Formatting | `Formatter`, `IntlFormatter` | locale-aware `number`/`currency`/`date`/`relativeTime` via native `Intl` |
| Validation | `Validator`, `ZodValidator` | `validate` never throws; `parse` throws `ValidationError` |
| Events | `EventBus`, `InMemoryEventBus` | cross-feature pub/sub; `on` returns an unsubscribe for `useEffect` cleanup |
| Env | `createEnv` | typed env vars validated at module load — missing required vars fail fast |
| Pagination | `Paginated`, `PageMeta`, `buildPageMeta`, cursor variants | Domain-side pagination types |
| Crypto/IDs | `generateId`, `generateIdempotencyKey`, `sha256`, `safeCompare` | idempotency keys for mutations |

These are interfaces with default implementations — inject the implementation at the composition root, swap for `NoOp*` in tests.
