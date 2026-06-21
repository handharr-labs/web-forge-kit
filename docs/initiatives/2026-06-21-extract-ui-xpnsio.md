# Extract `ui-xpnsio` design system package

**Date:** 2026-06-21
**Status:** In Progress — refactoring scope

## Context

`xpnsio` is a Next.js expense-tracking app. We extracted its design system into `@handharr-labs/ui-xpnsio` — components, tokens, utilities, and constants. The initial extraction was broad: we pulled everything reusable. After integrating and testing, we identified that some of what we extracted is **business logic or app config**, not design system material.

This doc now reflects the refined scope after the first integration pass.

## Design system boundary

**Rule: if it has business logic, domain types, or app-specific config baked in — it's not design system material.**

A design system owns **visual identity**: components, tokens, styling utilities, and theme providers. Components must be configurable through props, never hardcoded to a specific app's domain.

## What stays in `ui-xpnsio`

### Tokens
- `tokens/globals.css` — raw CSS variables (`:root`, `.dark`), iOS input fix, Select workarounds

### Utilities
- `cn()` — `clsx` + `tailwind-merge`

### Providers
- `ThemeProvider` — `next-themes` wrapper

### Components — Atoms
| Component | Notes |
|---|---|
| Button | Base UI + CVA. 6 variants, 7 sizes. Pure UI. |
| Card | 7 compound subcomponents. Pure UI. |
| Select | Base UI. 10 subcomponents. Pure UI. |
| CategoryColorDot | Colored circle by `color` + `size`. Pure UI. |
| CurrencyInput | **Refactor needed** — decouple `getLocale` dependency. Accept a `formatValue` callback prop instead of importing `formatCurrency` internally. |

### Components — Molecules
| Component | Notes |
|---|---|
| MonthNavigator | Prev/next arrows with label. Pure callback props. |

### Components — Organisms (refactor to be generic)

| Component | Current problem | Refactored API |
|---|---|---|
| BottomNav | Hardcoded routes + icons | Accept `items: { icon, label, path, fab? }[]` + `currentPath` as props. Remove internal `useRouter`/`usePathname` — let the app pass an `onNavigate` callback. |
| DeleteConfirmDialog | Already generic | No changes needed. |
| ManageParticipantCard | Imports `formatCurrency`, hardcodes `'IDR'`, has hardcoded status labels | Accept `formattedAmount: string`, status labels as props. Remove internal `formatCurrency` import. |
| PublicParticipantCard | Imports `formatCurrency`, hardcodes `'IDR'`, has hardcoded status text | Accept `formattedAmount: string`, status text as props. Remove internal `formatCurrency` import. |
| PaymentAccountItem | Already generic | No changes needed. |
| PaymentAccountList | Already generic | No changes needed. |
| ProofActionsRow | Already generic | No changes needed. |
| ProofImageModal | Already generic | No changes needed. |
| ShareLinkRow | Already generic | No changes needed. |

## What moves OUT of `ui-xpnsio`

### → Back to xpnsio app (app-specific)
| What | Why |
|---|---|
| `constants/routes.ts` | App navigation paths — not design. |
| `constants/currency-options.ts` | Business domain data — not design. |

### → `@handharr-labs/core` (platform-agnostic business logic)
| What | Why |
|---|---|
| `utils/format-currency.ts` | Business formatting (Intl.NumberFormat). Pure TS, no UI dependency. |
| `utils/format-relative-date.ts` | Business formatting. Pure TS. |
| `utils/format-week-range.ts` | Business formatting. Pure TS. |
| `types/query-state.ts` | App state type. Pure TS. |

### → `@handharr-labs/web-client` (frontend utility)
| What | Why |
|---|---|
| `hooks/use-pull-to-refresh.ts` | Touch UX utility — browser API, not visual design. |

## Refactoring steps

### Phase 1: Move non-UI code out

1. Move `formatCurrency`, `formatRelativeDate`, `formatWeekRange`, `QueryState` → `@handharr-labs/core`.
2. Move `usePullToRefresh` → `@handharr-labs/web-client`.
3. Move `ROUTES`, `CURRENCY_OPTIONS` → back to xpnsio app.
4. Update all imports in xpnsio.
5. Remove moved files from `ui-xpnsio`, update barrel.

### Phase 2: Make organisms generic

6. **BottomNav** — accept `items` array + `onNavigate` callback + `currentPath` prop. Remove `useRouter`, `usePathname`, `ROUTES` imports.
7. **ManageParticipantCard** — accept `formattedAmount: string` instead of `amount: number`. Accept status label overrides as optional props.
8. **PublicParticipantCard** — same as ManageParticipantCard.
9. **CurrencyInput** — accept `formatValue: (value: number) => string` callback instead of importing `getLocale`.

### Phase 3: Clean up

10. Remove `tailwindcss`, `@tailwindcss/postcss` from `ui-xpnsio` dependencies (app owns the build).
11. Remove `next` from peer dependencies if BottomNav no longer uses `useRouter`/`usePathname`.
12. Update initiative doc status to Done.

## Verification

- `npm run type-check` passes in all workspaces.
- xpnsio `npm run dev` renders correctly.
- No business logic or app-specific config remains in `ui-xpnsio`.
- All organisms are configurable through props.

## Lessons learned (from initial integration)

1. **Tokens CSS split**: `@theme inline`, `@layer base`, `@custom-variant dark` must live in the app's `globals.css` alongside `@import "tailwindcss"` — Tailwind's `@apply` directives don't resolve across `@import` boundaries.
2. **Package exports raw CSS variables only**: `:root`/`.dark` token values + CSS workarounds. The app wires them into Tailwind.
3. **`transpilePackages`** is required in `next.config.ts` for Next.js to process TypeScript from the package.
4. **`file:` links don't work with Turbopack** — always test via published registry versions.
5. **Components must be prop-driven**: any component that imports business logic (formatCurrency, ROUTES) is not a true design system component.
