# Extract `ui-xpnsio` design system package

**Date:** 2026-06-21
**Status:** Done — v1.1.0 published

## Context

`xpnsio` is a Next.js expense-tracking app. We extracted its design system into `@handharr-labs/ui-xpnsio` — a standalone package of pure presentational components, design tokens, typography scale, and styling utilities.

The extraction went through multiple refinement passes:
1. Initial broad extraction (everything reusable)
2. Scope refinement — moved business logic out, made components prop-driven
3. Renamed all components to generic UI terms
4. Merged similar components (participant cards → StatusCard)
5. Added typography scale

## Design system boundary

**Rule: if it has business logic, domain types, or app-specific config baked in — it's not design system material.**

A design system owns **visual identity**: components, tokens, typography, styling utilities, and theme providers. Components are configurable through props, never hardcoded to a specific app's domain.

## Package contents (`@handharr-labs/ui-xpnsio@1.1.0`)

### Tokens (`tokens/globals.css`)
- Color palette (OKLCH, light + dark)
- Radius scale (7 levels)
- Typography scale (9 utility classes)
- iOS input zoom fix
- Select component CSS workarounds

### Typography scale
| Class | Role | Size |
|---|---|---|
| `typo-page-title` | Page headings | 1.25rem → 1.5rem (md) |
| `typo-section-title` | Section headings | 1.125rem |
| `typo-card-title` | Card headings | 1rem |
| `typo-hero` | Large numbers/stats | 1.5rem → 1.875rem (md) |
| `typo-body` | Default body text | 0.875rem |
| `typo-label` | Form/inline labels | 0.875rem, medium |
| `typo-section-label` | Uppercase group headers | 0.75rem, uppercase |
| `typo-caption` | Secondary text | 0.75rem, muted |
| `typo-badge` | Badge/pill text | 0.75rem, medium |

### Utilities
- `cn()` — `clsx` + `tailwind-merge`

### Providers
- `ThemeProvider` — `next-themes` wrapper

### Components — Atoms (5)
| Component | Notes |
|---|---|
| `Button` | Base UI + CVA. 6 variants, 7 sizes. |
| `Card` | 7 compound subcomponents. |
| `Select` | Base UI. 10 subcomponents. |
| `ColorDot` | Colored circle by `color` + `size`. |
| `CurrencyInput` | Accepts `formatDisplay` callback + `currencyLabel`. |

### Components — Molecules (1)
| Component | Notes |
|---|---|
| `MonthNavigator` | Prev/next arrows with label. |

### Components — Organisms (13)
| Component | Notes |
|---|---|
| `BottomNav` | Accepts `items[]`, `currentPath`, `onNavigate`. |
| `DeleteConfirmDialog` | Modal with confirm/cancel. |
| `StatusCard` | Merged from ManageParticipantCard + PublicParticipantCard + ProofActionsRow. Accepts `variant`, `badge`, `statusLabel`, `actionButton`, `onApprove`/`onReject`. |
| `CopyRow` | Display with copy-to-clipboard. |
| `CopyRowList` | Wraps CopyRow items. |
| `ImageModal` | Lightbox modal. |
| `ShareLink` | URL with copy + open link. |
| `StatOverviewCard` | Metric overview with progress bar + status badge. |
| `ProgressCardGrid` | Grouped grid of progress cards (daily/weekly/monthly). |
| `ListPreviewSection` | Item list with "View all" link. |
| `GroupedListSection` | Date-grouped list with load more. |
| `FilterPanel` | Date range + category + type filters. |
| `ActionCard` | Card with title, badge, and action buttons. |
| `ItemGroupSection` | Grouped items with edit/delete actions. |
| `FormDialog` | Form dialog with color picker + icon picker. |

## What lives outside `ui-xpnsio`

### In `@handharr-labs/core`
| Export | Why |
|---|---|
| `formatCurrency`, `formatCompactCurrency`, `getLocale` | Business formatting — pure TS |
| `formatRelativeDate`, `formatFullDate` | Business formatting — pure TS |
| `formatWeekRange` | Business formatting — pure TS |
| `QueryState<T>` | App state type — pure TS |

### In `@handharr-labs/web-client`
| Export | Why |
|---|---|
| `usePullToRefresh` | Browser touch API — not visual design |

### In xpnsio app (app-specific)
| What | Why |
|---|---|
| `ROUTES` | App navigation paths |
| `CURRENCY_OPTIONS` | Business domain data |
| `AppBottomNav` | Thin wrapper wiring BottomNav to app routes + `useRouter` |
| `getCategoryIcon` | Maps domain category types to icons |
| Font loading (`next/font`) | Next.js build-time feature |
| `globals.css` | `@import "tailwindcss"`, `@theme inline`, `@layer base`, `@source` — Tailwind build wiring |

## App integration checklist

To use `@handharr-labs/ui-xpnsio` in a Next.js app:

1. Install: `npm install @handharr-labs/ui-xpnsio`
2. Add to `next.config.ts`: `transpilePackages: ["@handharr-labs/ui-xpnsio"]`
3. Create `globals.css` with:
   - `@import "tailwindcss"`
   - `@import "@handharr-labs/ui-xpnsio/tokens/globals.css"`
   - `@source` pointing to both app source and `node_modules/@handharr-labs/*/src/**/*.{tsx,ts}`
   - `@theme inline` block mapping CSS variables to Tailwind colors
   - `@layer base` block for default styles
4. Use `--webpack` flag for dev (`next dev --webpack`) — Turbopack has issues with `transpilePackages`

## Lessons learned

1. **Tokens CSS split**: `@theme inline`, `@layer base`, `@custom-variant dark` must live in the app's `globals.css` alongside `@import "tailwindcss"` — Tailwind's `@apply` directives don't resolve across `@import` boundaries.
2. **Package exports raw CSS variables only**: `:root`/`.dark` token values + workarounds. The app wires them into Tailwind.
3. **`transpilePackages`** is required in `next.config.ts` for Next.js to process TypeScript from the package.
4. **`file:` links don't work with Turbopack** — always test via published registry versions.
5. **Components must be prop-driven**: any component that imports business logic is not a true design system component.
6. **`@source` must include package paths**: the webpack PostCSS build won't scan `node_modules` unless explicitly told via `@source "../../node_modules/@handharr-labs/*/src/**/*.{tsx,ts}"`.
7. **Name components generically**: `BudgetOverviewCard` → `StatOverviewCard`, `TransactionListSection` → `GroupedListSection`. Business terms don't belong in a design system.
8. **Merge similar components**: `ManageParticipantCard` + `PublicParticipantCard` + `ProofActionsRow` → single `StatusCard` with variant/slot props.
9. **Typography belongs in the design system**: codify the type scale as CSS utility classes (`typo-*`) rather than repeating Tailwind class combinations.
