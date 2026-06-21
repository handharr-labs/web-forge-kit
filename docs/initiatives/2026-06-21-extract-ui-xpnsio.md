# Extract `ui-xpnsio` design system package

**Date:** 2026-06-21
**Status:** Planned

## Context

`xpnsio` is a Next.js expense-tracking app with a design system spread across `src/components/ui/`, `src/shared/presentation/`, `src/lib/utils.ts`, and `src/app/globals.css`. The components range from low-level primitives (Button, Card, Select) to app-level organisms (BottomNav, DeleteConfirmDialog, ShareLinkRow) and shared utilities (formatCurrency, formatRelativeDate, usePullToRefresh).

This is the first `ui-{name}` package in `web-forge-kit`, establishing the pattern for future app-specific design systems. The goal is **batteries-included**: downstream apps install the package and get everything they need — components, tokens, utilities, providers, and constants.

**Decisions locked in:**
- Package name: `@handharr-labs/ui-xpnsio`.
- Standalone — no shared base layer, no dependency on `core` or `web-client`.
- Source extracted from `xpnsio` repo, not forked or symlinked.
- Tailwind v4 + PostCSS, Base UI primitives, CVA for variants.
- **All dependencies are direct** (batteries-included) — except `react` / `react-dom` as peer.

## Source inventory (from xpnsio)

### UI primitives (`src/components/ui/`)

| Component | File | Primitives | Notes |
|---|---|---|---|
| Button | `button.tsx` | `@base-ui/react/button` + CVA | 6 variants (default, outline, secondary, ghost, destructive, link), 7 sizes |
| Card | `card.tsx` | Pure React | 7 compound subcomponents (Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter), `size` prop |
| Select | `select.tsx` | `@base-ui/react/select` | 10 subcomponents, portal-based dropdown, `sm`/`default` sizes |

### Shared atoms (`src/shared/presentation/common/atoms/`)

| Component | Notes |
|---|---|
| CategoryColorDot | Renders a colored circle by `color` + `size` prop. Pure UI. |
| CurrencyInput | Formatted currency input field. Imports `getLocale` from `formatCurrency`. |

### Shared molecules (`src/shared/presentation/common/molecules/`)

| Component | Notes |
|---|---|
| MonthNavigator | Prev/next month arrows with label. Pure callback props. |

### Shared organisms (`src/shared/presentation/common/organisms/`)

| Component | Notes |
|---|---|
| BottomNav | Fixed bottom navigation bar. 5 items with icons. Imports `ROUTES`, `useRouter`, `usePathname`. |
| DeleteConfirmDialog | Modal confirmation dialog. Uses Button. Pure callback props. |
| ManageParticipantCard | Participant card with proof status + approve/reject. Imports `formatCurrency`, `ProofActionsRow`. |
| PaymentAccountItem | Bank account display with copy-to-clipboard. |
| PaymentAccountList | Composes PaymentAccountItem list. |
| ProofActionsRow | Approve/reject button pair. Uses Button. |
| ProofImageModal | Image lightbox modal with close button. |
| PublicParticipantCard | Read-only participant card with status badge. Imports `formatCurrency`. |
| ShareLinkRow | URL display with copy + open-link actions. |

### Providers (`src/shared/presentation/providers/`)

| Provider | Notes |
|---|---|
| ThemeProvider | Thin wrapper around `next-themes`. Default dark, class-based. |

### Utilities (`src/shared/presentation/utils/`)

| Utility | Exports | Notes |
|---|---|---|
| `formatCurrency.ts` | `getLocale`, `formatCurrency`, `formatCompactCurrency` | Intl.NumberFormat-based. Supports IDR, USD, SGD, MYR, EUR. |
| `formatRelativeDate.ts` | `formatRelativeDate`, `formatFullDate` | "Today", "Yesterday", or locale-formatted date. |
| `formatWeekRange.ts` | `formatWeekRange` | "21 Jun – 27 Jun" style week range. |
| `utils.ts` (lib) | `cn` | `clsx` + `tailwind-merge` class merger. |

### Hooks (`src/shared/presentation/hooks/`)

| Hook | Notes |
|---|---|
| `usePullToRefresh` | Touch-based pull-to-refresh with damping. Returns `containerRef`, `pullDistance`, `isRefreshing`. |

### Constants (`src/shared/presentation/constants/`)

| Constant | Notes |
|---|---|
| `CURRENCY_OPTIONS` | Dropdown options for IDR, USD, SGD, MYR, EUR. |

### Navigation (`src/shared/presentation/navigation/`)

| Export | Notes |
|---|---|
| `ROUTES` | All app route paths as constants/functions. |

### Types (`src/shared/presentation/common/`)

| Type | Notes |
|---|---|
| `QueryState<T>` | Discriminated union: `idle` / `loading` / `success` / `error`. |

### Design tokens (`src/app/globals.css`)

| Category | Tokens |
|---|---|
| Colors (OKLCH) | `--primary`, `--secondary`, `--accent`, `--muted`, `--destructive`, `--card`, `--popover`, `--input`, `--border`, `--ring` (each with `-foreground`) |
| Sidebar | 8 tokens (`--sidebar-background`, `--sidebar-foreground`, `--sidebar-primary`, etc.) |
| Charts | `--chart-1` through `--chart-5` |
| Radius | `--radius` base (0.625rem) + 7 calculated levels (sm → 4xl) |
| Fonts | `--font-sans` (Nunito), `--font-mono` (Geist Mono) |
| Themes | Light (:root) + Dark (.dark), default dark |

## Dependencies

All direct (batteries-included) — downstream app just installs `@handharr-labs/ui-xpnsio`.

| Package | Version | Purpose |
|---|---|---|
| `react`, `react-dom` | ≥18 | **Peer** — app provides single instance |
| `@base-ui/react` | ^1.2.0 | Headless UI primitives (Button, Select) |
| `class-variance-authority` | 0.7.1 | Component variants |
| `clsx` | 2.1.1 | Class name utility |
| `tailwind-merge` | 3.5.0 | Tailwind class conflict resolution |
| `tw-animate-css` | 1.4.0 | Animation utilities |
| `lucide-react` | 0.577.0 | Icons (Select, BottomNav, ShareLinkRow, etc.) |
| `tailwindcss` | 4.2.1 | CSS framework |
| `@tailwindcss/postcss` | 4.2.1 | PostCSS plugin |
| `next-themes` | 0.4.6 | Theme provider |
| `next` | ≥14 | **Peer** — `useRouter`, `usePathname` used by BottomNav |

## Target structure

```
packages/ui-xpnsio/
  package.json              # @handharr-labs/ui-xpnsio (standalone, no internal deps)
  tsconfig.json
  src/
    index.ts                # Barrel export
    tokens/
      globals.css           # OKLCH palette, radius, fonts, base layer
    utils/
      cn.ts                 # clsx + tailwind-merge
      format-currency.ts    # getLocale, formatCurrency, formatCompactCurrency
      format-relative-date.ts
      format-week-range.ts
    types/
      query-state.ts        # QueryState<T>
    constants/
      currency-options.ts
      routes.ts             # ROUTES object
    hooks/
      use-pull-to-refresh.ts
    providers/
      theme-provider.tsx
    components/
      atoms/
        button.tsx
        card.tsx
        select.tsx
        category-color-dot.tsx
        currency-input.tsx
      molecules/
        month-navigator.tsx
      organisms/
        bottom-nav.tsx
        delete-confirm-dialog.tsx
        manage-participant-card.tsx
        payment-account-item.tsx
        payment-account-list.tsx
        proof-actions-row.tsx
        proof-image-modal.tsx
        public-participant-card.tsx
        share-link-row.tsx
```

## Not extracting

- **Feature Views** (LoginView, DashboardView, TransactionsView, etc.) — these compose components with domain hooks, use cases, and data fetching. They belong in the app.
- **Feature organisms** (BudgetSettingCard, CategoryFormDialog, CategoryGroupSection, TransactionFilterPanel, etc.) — tightly coupled to domain models and feature-specific state.
- **getCategoryIcon** — maps domain category types to icons, belongs in feature code.
- **QueryClientProvider** — infrastructure wiring, not design system.
- **useAppRouter** — app-specific navigation hook.
- **Server actions** (`actions/categories.ts`) — data layer, not UI.
- **Font loading** (Next.js `next/font`) — stays in app's `layout.tsx`.

## Steps

1. **Write initiative doc** — this file.
2. **Scaffold `packages/ui-xpnsio/`** — `package.json`, `tsconfig.json`, directory structure.
3. **Extract tokens** — Pull CSS variables and base layer from xpnsio's `globals.css` into `tokens/globals.css`.
4. **Copy utilities** — `cn`, `formatCurrency`, `formatRelativeDate`, `formatWeekRange`.
5. **Copy types + constants** — `QueryState`, `CURRENCY_OPTIONS`, `ROUTES`.
6. **Copy hooks** — `usePullToRefresh`.
7. **Copy providers** — `ThemeProvider`.
8. **Copy components** — All atoms, molecules, organisms listed above.
9. **Rewrite imports** — Update all internal `@/` imports to relative paths within the package.
10. **Create barrel** — `src/index.ts` exporting everything.
11. **Wire dependencies** — All deps as direct, `react`/`react-dom`/`next` as peer.
12. **Verify** — `npm install`, `npm run type-check`.
13. **Update xpnsio** — Replace local imports with `@handharr-labs/ui-xpnsio` (separate PR in xpnsio repo).

## Verification

- `npm install` resolves with `ui-xpnsio` in the workspace graph.
- `npm run type-check` passes for `ui-xpnsio`.
- Components render correctly when imported in `playground/`.

## Out of scope

Migrating xpnsio to consume this package, adding new components, Storybook, and the tsup/dist build pipeline.
