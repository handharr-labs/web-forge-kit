# Tiered Design System: Bronze, Silver, Gold

**Date:** 2026-06-22
**Status:** Draft

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
- How do we handle component variants that only make sense in Gold (e.g. a floating label field) — do Bronze and Silver expose the same variant prop but render it as a no-op?
- Versioning: should Bronze, Silver, Gold be versioned in lockstep, or independently?

---

## Steps

1. [ ] **Finalize component design per tier** — document the exact visual/interaction spec for each component at each tier.
2. [ ] **Scaffold `ui-base-bronze`** — full component set at Bronze design language, publish `0.1.0-beta`.
3. [ ] **Scaffold `ui-base-silver`** — full component set at Silver design language, publish `0.1.0-beta`.
4. [ ] **Scaffold `ui-base-gold`** — full component set at Gold design language, publish `0.1.0-beta`.
5. [ ] **Rename `ui-cikal` → `ui-cikal-showcase`** — update package name, keep brand tokens and organisms as-is.
6. [ ] **Playground tier switcher** — add `TierProvider` context + switcher UI at `/ds/cikal`; components render from the active tier package under `.brand-cikal`.
7. [ ] **Annotate tier-invariant organisms** — add "Same across all tiers" label in the playground for components without a per-tier implementation.
8. [ ] **Playground tier catalogs** — add `/ds/bronze`, `/ds/silver`, `/ds/gold` pages.
9. [ ] **Update CLAUDE.md packages table** — add Bronze, Silver, Gold, and `ui-cikal-showcase` rows.

## Out of Scope

- Migrating `ui-xpnsio` to the tiered model — it stays as-is. Only new client packages adopt the tier structure.
- Building `ui-cikal` (post-deal) — blocked until CIKAL signs and chooses a tier.
