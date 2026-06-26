# Scaffold CIKAL prototype — tier-switchable web app

**Date:** 2026-06-25
**Status:** In progress — Workstream A done (published), Workstream C scaffold done

**Goal:** Stand up a pre-deal prototype web app (UI + routing only, no domain/data) that can switch its design system between **Bronze / Silver / Gold** at runtime, to demo to a potential client.

---

## Decisions (locked)

| Decision | Choice | Implication |
|---|---|---|
| Tier switching | **Live runtime toggle** | All three tiers bundled in the deployed app; demo-class, throwaway after the deal |
| App location | **Separate repo** | Everything the app imports must be published to GitHub Packages |
| Scope | UI + routing only | No Domain/Data layers, no UseCase calls, no fetching |

---

## Why not the two "obvious" options

- **Don't publish `ui-cikal-showcase`.** It is `private: true`, "never published," "never a production dependency," "never graduated into a brand package" (`tiered-design-system.md`). It also carries CIKAL brand tokens + a sales catalog — wrong to bake into an app's dependency graph.
- **Don't "split into 3."** `ui-base-bronze` / `silver` / `gold` are already three standalone packages with an identical component API. Nothing to split.

The runtime-switch engine you want **already exists** inside the showcase (`tier/tier-context.tsx`: `TierProvider` + `useTierComponents()`). It is generic — only the brand tokens and catalog are CIKAL-specific. The plan extracts that engine so any prototype can reuse it without dragging CIKAL branding.

**Architectural note:** Per the docs, runtime tier switching is *showcase/demo* behavior, never production. The production model is: app imports exactly one tier; upgrading = swap the dependency + rebuild, no app-code change. So this prototype is **throwaway by design** — once the client picks a tier, build the real app on that single tier via a `ui-cikal` brand package and discard the runtime switcher.

---

## Workstream A — Monorepo prerequisites (this repo)

> **Progress (2026-06-25):** A1 ✅ · A2 ✅ · A3 ✅ — Workstream A complete.
> `ui-tier-runtime@0.1.0` published to GitHub Packages; base tiers already live at `0.6.0`.
> Repo tagged `v0.8.0`. Type-check + all 48 tests green; playground compiles.
> **Registry-verified, ready for the separate repo (Workstream C):**
> `ui-tier-runtime@0.1.0`, `ui-base-bronze@0.6.0`, `ui-base-silver@0.6.0`, `ui-base-gold@0.6.0`.

### A1. Create `@handharr-labs/ui-tier-runtime`
Brand-free package holding the generic runtime-switch engine.

- Extract from `ui-cikal-showcase/src/tier/`: `TierProvider`, `useTier`, `useTierComponents`, `TierSwitcher`, the `Tier` type.
- `dependencies`: `@handharr-labs/ui-base-bronze`, `-silver`, `-gold`.
- `peerDependencies`: `react`, `react-dom`.
- `publishConfig.registry`: `https://npm.pkg.github.com`.
- Mirror the existing tier packages: `main`/`types` → `./src/index.ts`, ship raw TS (`files: ["src"]`).
- **Not** `private`.

### A2. Refactor `ui-cikal-showcase` to consume `ui-tier-runtime`
- Replace its local `tier/` machinery with re-exports from `ui-tier-runtime` (keeps DRY).
- Showcase keeps only: catalog (`CikalCatalog`, `CikalShowcase`) + brand tokens (`tokens/globals.css`).
- Showcase stays `private: true` — unpublished.
- Run `npm run type-check` + `vitest run`; verify `playground` still renders all three tiers.

### A3. Publish to GitHub Packages
- Publish: `ui-base-bronze`, `ui-base-silver`, `ui-base-gold`, **`ui-tier-runtime`**.
- Do **not** publish: `ui-cikal-showcase`.
- Use the `/release` or `/publish` skill; bump versions per package as prompted.

---

## Workstream B — Brand tokens

Pre-deal, no tier is committed, so a proper `ui-cikal` brand package (which must extend exactly one tier) is premature. The `.brand-cikal` tokens are tier-agnostic CSS (~30 lines: overrides `--hue`, `--primary-l`, `--secondary`, `--accent`, ...).

- **Copy `.brand-cikal` globals.css directly into the prototype repo** for now.
- Post-deal: graduate into a real `@handharr-labs/ui-cikal` brand package on the chosen single tier.

---

## Workstream C — Separate prototype repo

### C1. Bootstrap
- New Next.js app (App Router).
- `.npmrc`: `@handharr-labs:registry=https://npm.pkg.github.com` + GitHub PAT auth (`read:packages`).
- Install: `@handharr-labs/ui-base-{bronze,silver,gold}` + `@handharr-labs/ui-tier-runtime`.

### C2. Wire the design system
- Root layout: load each tier's `tokens/globals.css` + the copied `.brand-cikal` css.
- Wrap children: `<div className="brand-cikal"><TierProvider defaultTier="silver">…</TierProvider></div>`.
- Pages render components via `useTierComponents()`.
- Place `<TierSwitcher>` in a dev/demo toolbar.

### C3. Build prototype screens
- Routing + page compositions only.
- Use atoms/molecules/organisms from the active tier namespace. No business logic.

---

## Known gotchas (must handle)

1. **`transpilePackages`** — the tier packages ship raw `.ts`/`.tsx` (not compiled JS). The Next app **must** list all four packages in `next.config.js` `transpilePackages` and include them in Tailwind `content` globs, or they won't compile in a separate repo.
2. **`:root` token collision** — all three tiers define their palette under `:root`; loading all three CSS files merges them (cascade, last wins). The component-namespace swap drives most of the visual difference, but **verify token conflicts against the running `playground`/showcase**, which already bundles all three — it's the reference implementation.

---

## Sequencing

1. A1 → A2 → A3 (monorepo work; blocks everything in the separate repo)
2. B (copy brand tokens) — can run in parallel with A
3. C1 → C2 → C3 (after A3 publishes)

**Post-deal handoff:** create `ui-cikal` on the chosen tier → rebuild app on one tier → discard runtime switcher + showcase.

---

## Workstream C — Progress (2026-06-25): scaffold ✅

Repo scaffolded at `../cikal-prototype` (sibling of forgekit). **PRD-driven** — Sekolah Cikal Amri Setu competition portal, UI + routing only, static mock content (`src/lib/data.ts`), no domain/data layer.

- **Wiring (C1/C2):** Next 16 + React 19 + Tailwind v4. `transpilePackages` + `@source` into `node_modules` for the 4 published packages. Tier tokens are scoped to `.tier-{name}` (not `:root`) → **no token collision**, the gotcha is moot. `AppFrame` applies `tier-${tier} brand-cikal` + floating `TierSwitcher`. Brand tokens copied to `src/styles/brand-cikal.css`.
- **Screens (C3):** built — `/` (PUB-01), `/competitions` (PUB-02), `/about` (PUB-03), `/contact` (PUB-04), `/login` (PUB-05), `/register` (PUB-06, visual). Stubs — `/admin` (ADM-01), `/dashboard` (USR-01).
- **Verified:** `npm install` from GitHub Packages OK · `tsc --noEmit` clean · `next build` green (10/10 static routes) · compiled CSS contains `brand-cikal` + all `.tier-*` + package `typo-*` utilities.

**Not yet built:** form validation/submission, auth, backoffice management (participants/sports/events/reconciliation), checkout, history, charts. Nav uses tier `NavBar` anchors (full reload) rather than `next/link`.

**Run:** `export NODE_AUTH_TOKEN=ghp_… && npm run dev` in `../cikal-prototype`.

---

## Component promotion (2026-06-26): generic prototype molecules → base tiers

Audited the prototype's custom components in `../cikal-prototype/src/components`. Four were generic and domain-free; promoted into **all three** `ui-base-*` tiers as tier-invariant molecules (they defer visual polish to the atoms they wrap — `Card`/`Modal`/`SearchBar`/`FilterSelect` — exactly like the existing byte-identical `PageHeader`):

| Component | What it is |
|---|---|
| `SectionIntro` | Eyebrow + title + lead paragraph — public-page counterpart to `PageHeader` |
| `SummaryRow` | Presentational card list-row: title + meta + status slot + action slot |
| `FilterBar` | Search + filter-select row with conditional Reset; composes `SearchBar` + `FilterSelect` |
| `PreviewModal` | `Modal` wrapping a dashed placeholder tile (stand-in media) |

Rewritten to import sibling tier components directly (not `useTierComponents()`, which would invert the dependency — the runtime depends on the tiers). Exported from each tier `index.ts`. `tsc --noEmit -p` clean on bronze/silver/gold; repo `type-check` + playground green.

**Left in the prototype (correctly business/brand-coupled, not DS primitives):**
- `status-badges`, `competition-form-modal` — bound to domain types in `@/lib/data` (`EventStatus`, `CompetitionEvent`, …).
- `site-chrome` / `app-chrome` / `admin-chrome` / `app-frame` — app shells with hardcoded CIKAL nav, brand strings, `brand-cikal` scope, and the demo `TierSwitcher`. The shell *mechanics* are generic but the content is app composition; they belong in the app.

**Next:** consume the promoted molecules from the tier namespace in the prototype (replace the local copies), then bump + republish the base tiers.
