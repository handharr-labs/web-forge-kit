# Tiered Design System: Bronze, Silver, Gold

**Date:** 2026-06-22
**Status:** Complete — `ui-base-gold@0.2.1` published 2026-06-22

## Context

`forgekit` currently ships one flat design system package per client (`ui-xpnsio`, `ui-cikal`). Each package bundles all components together with a single visual style — there is no way to offer a client a different level of UI polish without duplicating the entire package.

A tiered model introduces three generic, client-agnostic design system packages (`ui-base-bronze`, `ui-base-silver`, `ui-base-gold`) that differ in **visual sophistication and UX polish**, not in component scope. All three tiers ship the same components — atoms, molecules, and organisms. What changes is how those components look and behave.

Client-specific packages (`ui-cikal`, `ui-xpnsio`) become thin brand layers that apply tokens (colors, fonts) on top of whichever tier the client subscribes to. This creates a natural pricing axis: the tier determines the price of the engagement.

---

## The Core Idea: Same Components, Different Polish

All three tiers expose the same component API with the same props. The tier only changes the visual design language and interaction patterns.

**TextField example across tiers:**

| Tier | Layout | Behavior |
|---|---|---|
| Bronze | Label left, field right | Static — functional, minimal, no animation |
| Silver | Label on top, field below | Static — clean spacing, strong visual hierarchy |
| Gold | Floating label inside field | Animated — label shrinks and lifts on focus (Material-style) |

A client who upgrades from Bronze → Silver → Gold does not need to change their app code. The component API stays identical.

---

## The Three Tiers

### Tier 1 — Bronze: `@handharr-labs/ui-base-bronze`

**Design language:** Functional. Basic layout conventions. No animation. Works out of the box with minimal visual opinion.

**What distinguishes it:**
- Components use simple, conventional layouts (label + field stacked or inline)
- Neutral colors, standard border/shadow treatment
- No transitions or interaction animations
- Clean and readable — not bare, but not styled

**Suitable for:** Internal tools, admin panels, MVPs where functionality matters more than visual impression.

---

### Tier 2 — Silver: `@handharr-labs/ui-base-silver`

**Design language:** Polished. Intentional layout, strong visual hierarchy, refined spacing and typography.

**What distinguishes it from Bronze:**
- Components use considered layout patterns (e.g. label stacked above field with clear visual weight)
- Better spacing rhythm, typographic scale applied consistently
- Subtle hover/focus states — no motion, but clear visual feedback
- Looks production-ready out of the box

**Suitable for:** Client-facing products, marketing sites, SaaS apps that need to look professional without heavy UX engineering.

---

### Tier 3 — Gold: `@handharr-labs/ui-base-gold`

**Design language:** Premium. Animated interactions, advanced UX patterns, high perceived quality.

**What distinguishes it from Silver:**
- Rich interaction patterns — floating labels, animated focus rings, micro-transitions
- Material Design-inspired motion (label shrinks on focus, fields animate in/out)
- Higher-fidelity component states (loading skeletons, progress indicators, etc.)
- Dark mode handled at full depth — not just color swaps

**Suitable for:** Consumer-facing products, client showcases, anywhere UX quality directly affects perception of the product's value.

---

## Component Scope (All Tiers)

Every tier ships the full component set:

| Layer | Examples |
|---|---|
| Atoms | Button, Badge, Avatar, Input, Textarea, Label, Select, Checkbox, Switch, RadioGroup |
| Molecules | Field, SearchBar, Card |
| Organisms | NavBar, HeroSection, Footer, EventGrid |

The **API is identical across tiers** — same component names, same props. Only the visual and interaction implementation differs.

---

## Client Brand Packages

Once a deal is signed, a client brand package is a thin layer on top of exactly one tier:

- Brand token overrides (primary color, foreground, secondary, accent) scoped under `.brand-{name}`
- Domain-specific component compositions (purely presentational, no business logic)

```
ui-cikal (post-deal, extends one tier)
  └─ ui-base-gold (or whichever tier CIKAL subscribes to)

ui-{future-client}
  └─ ui-base-bronze / ui-base-silver / ui-base-gold (whichever tier they subscribed to)
```

The tier a client is on determines the price of the engagement.

---

## CIKAL Pre-Deal: `ui-cikal-showcase`

The engagement with CIKAL is not yet signed. Before a tier is committed to, `ui-cikal` is renamed to **`@handharr-labs/ui-cikal-showcase`** — a multi-tier demo package used to show the client what their design system looks like at each tier level.

**Purpose:** Sales tool and prototype — never imported by a production app.

**How it works:**
- Holds CIKAL brand tokens (`.brand-cikal` CSS variables)
- Playground at `/ds/cikal` gets a tier switcher at the top (`Bronze | Silver | Gold`)
- Components render from the selected tier package, wrapped in `.brand-cikal` for brand colors
- Organisms (`NavBar`, `HeroSection`, `EventCard`, `EventGrid`) that don't have a per-tier implementation render as-is, with a note in the playground: *"Same across all tiers"*

**Lifecycle:**
```
ui-cikal-showcase   ← pre-deal: multi-tier playground demo
        ↓ deal signed, tier chosen
ui-cikal            ← post-deal: extends exactly one tier, production-ready
```

`ui-cikal-showcase` is never renamed or graduated — `ui-cikal` is a fresh package built cleanly on the chosen tier.

---

## Pricing Implication

| Tier | Design language | Price signal |
|---|---|---|
| Bronze | Functional, minimal | Entry |
| Silver | Polished, production-ready | Standard |
| Gold | Premium, animated | Premium |

A client package (`ui-{name}`) is always priced at the tier it's built on top of.

---

## Key Rules

- All three tier packages are generic and client-agnostic — no brand colors, no client-specific logic.
- Component API is identical across tiers — same props, same component names.
- Client brand packages only override tokens and add domain-specific compositions. They never re-implement components.
- No domain or business logic at any tier — design system boundary rule applies.
- Brand token scoping: client tokens live under `.brand-{name}`, never under `:root`.

---

## Open Questions

- Should all 3 tier packages use the same neutral color palette, with only the interaction/layout differing? Or does Gold also get a richer default color story?
- ~~How do we handle component variants that only make sense in Gold (e.g. a floating label field)?~~ **Resolved:** `Field` detects the child type at runtime. `Input`/`Textarea` get the animated floating label driven by CSS `:placeholder-shown` peer variants. `Select` gets a JS-driven floating label (open/value state via `onOpenChange`). `RadioGroup`, `Checkbox`, and other compound children get a permanent **mini label** (`0.625rem`, `font-semibold`, muted) — same visual as the floated state, no animation needed.
- Versioning: should Bronze, Silver, Gold be versioned in lockstep, or independently?

---

## Steps

1. [x] **Finalize component design per tier** — documented inline via tier differentiation table (Bronze: inline field/no motion; Silver: stacked/polished; Gold: floating label/animated/dark mode).
2. [x] **Scaffold `ui-base-bronze`** — full component set at Bronze design language, version `0.1.0-beta`. Packages published to GitHub Packages registry.
3. [x] **Scaffold `ui-base-silver`** — full component set at Silver design language, version `0.1.0-beta`.
4. [x] **Scaffold `ui-base-gold`** — full component set at Gold design language, version `0.1.0-beta`. Includes Skeleton atom, floating label Field, gradient Button, dark mode tokens, `EventGrid` loading state.
5. [x] **Rename `ui-cikal` → `ui-cikal-showcase`** — `packages/ui-cikal` moved to `packages/ui-cikal-showcase`; bespoke components removed; package marked `private`; deps point to tier packages.
6. [x] **Playground tier switcher** — `TierProvider` + `useTierComponents` in the showcase package; `TierSwitcher` segmented control at top of `/ds/cikal`; components render from active tier under `.brand-cikal`.
7. [x] **Annotate tier-invariant organisms** — `tierInvariant` prop on `Section` renders "Same across all tiers" chip on Colors, Typography, Badge, Card, Avatar, Form Controls, SearchBar, EventCard, EventGrid, NavBar, HeroSection, Footer. Field and Button are tier-variant (no chip).
8. [x] **Playground tier catalogs** — added `/ds/bronze`, `/ds/silver`, `/ds/gold` pages; each shows Color Tokens, Typography, all Atoms, all Molecules (with tier-specific Field layout), all Organisms, and a Composed Form.
9. [x] **Update CLAUDE.md packages table** — Bronze, Silver, Gold rows already present from earlier doc update.

## Post-Launch Refinements (2026-06-22)

Issues found during playground review and fixed in follow-up:

### Gold Field — floating label not shrinking
`Label` atom carries the `typo-label` CSS class, scoped as `.tier-gold .typo-label` / `.brand-cikal .typo-label` (specificity 0,2,0). In Tailwind v4 all utilities live in `@layer utilities`, so unlayered CSS wins over any Tailwind utility — including `!important` variants from inside the layer. Fix: replaced the `Label` component in the floating position with a raw `<label>` element and `style={{ fontSize: isFloating ? "0.625rem" : "0.875rem" }}`. Inline styles are always authoritative regardless of CSS layers or specificity. CSS `transition-all` still animates the change.

### Gold Field — Select floating label (v0.2.1)
Extended `supportsFloating` to include `Select`. Three changes:

1. **`SelectTrigger` height:** when inside a `[data-floating-select]` wrapper, the trigger grows to `3.5rem` with `pt-5 pb-2 items-end` via Tailwind v4 ancestor-selector utilities (`[[data-floating-select]_&]:!h-[3.5rem]` etc.). This gives the label room to float above the selected value.
2. **Open-state tracking:** `Field` injects `onOpenChange` into the Select clone. `isFocused` is driven entirely by `onOpenChange(open)` — DOM focus/blur events are disabled for Select because Base UI returns focus to the trigger on close, which would re-raise `onFocusCapture` and lock the label up.
3. **Value-state tracking:** `hasValue` for Select is derived directly from `children.props.value` (the controlled prop), so any programmatic update is reflected immediately.

`RadioGroup`, `Checkbox`, and other compound children fall back to a permanent **mini label** (`0.625rem`, `font-semibold`, muted) — same visual as the floated state.

### Gold Field — CSS peer-driven floating label for Input/Textarea (v0.2.1)
Replaced the JS event-listener approach (`onChangeCapture` / `stateHasValue`) with CSS-only peer variants. The input receives a `peer` class (via `cloneElement`); the label uses:
- `peer-focus:` — floats when the input is focused
- `peer-[:not(:placeholder-shown)]:` — floats whenever the input has a value, regardless of focus state, React version, or whether the input is controlled vs uncontrolled

`Field` also ensures a `placeholder=" "` (space) default via `cloneElement` so `:placeholder-shown` works even when the caller doesn't set one. This eliminates the whole class of bugs where the label would fail to stay floated after blur for controlled inputs, pre-filled values, or autofill.

### `ui-cikal-showcase` improvements
- **Back button:** `← Catalog` link added to the showcase header (`<a href="/">`) so users can return to the playground home.
- **Skeleton section (Gold only):** when the tier switcher is on Gold, an "Atoms — Skeleton" section appears with text-line, avatar, and card placeholder previews — mirroring the Gold catalog page.
- **EventGrid loading state (Gold only):** the EventGrid section gains a "Loading state" row on Gold, showing the skeleton-grid the Gold `EventGrid` ships with.
- **Floating label placeholder fix:** Field-wrapped inputs in the showcase use `placeholder=" "` (single space) on Gold so the placeholder text doesn't overlap with the label in its unfloated center position.
- **Controlled Select in Registration Form:** the Role field is now a controlled `<Select value={role} onValueChange={setRole}>` so `Field` can derive `hasValue` from props and correctly float/unfloat the label.

### Release — `ui-base-gold@0.2.1` (2026-06-22)
- Published to `https://npm.pkg.github.com`
- Includes all post-launch refinements: floating label for Select, CSS peer-driven floating label for Input/Textarea
- `ui-cikal-showcase@0.2.1` tagged (private, not published)

---

## Out of Scope

- Migrating `ui-xpnsio` to the tiered model — it stays as-is. Only new client packages adopt the tier structure.
- Building `ui-cikal` (post-deal) — blocked until CIKAL signs and chooses a tier.
