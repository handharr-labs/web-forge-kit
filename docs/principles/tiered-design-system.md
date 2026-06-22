# Tiered Design System

How the base tier model works, what the rules are, and how to create or extend a design system from it.

---

## The Model

Three client-agnostic base tier packages ship the same full component set with identical APIs. The tier determines **visual sophistication and interaction quality** — not component scope.

| Tier | Package | Design language |
|---|---|---|
| Bronze | `@handharr-labs/ui-base-bronze` | Functional — static layout, no animation, zero interaction overhead |
| Silver | `@handharr-labs/ui-base-silver` | Polished — intentional spacing, visual hierarchy, subtle focus states |
| Gold | `@handharr-labs/ui-base-gold` | Premium — animated interactions, Material-style patterns, full dark mode |

A downstream app imports exactly one tier (via a brand package). A client can upgrade from Bronze → Silver → Gold **without changing any app code** — the component API is identical across all three.

---

## Component API Contract

Every tier ships the same component set and exposes the same props. The tier only changes the visual and interaction implementation.

**Example — `TextField` across tiers:**

| Tier | Layout | Behavior |
|---|---|---|
| Bronze | Label left, field right | Static — no animation |
| Silver | Label stacked above field | Static — refined spacing |
| Gold | Floating label inside field | Animated — label shrinks and lifts on focus |

**Rules:**
- Same component names, same props, same import paths across all three tiers.
- A component that behaves differently per tier does so internally — the caller never changes.
- No tier-specific props exposed at the API boundary.

---

## Component Scope

All tiers ship the full component set:

| Layer | Components |
|---|---|
| Atoms | Button, Badge, Avatar, Input, Textarea, Label, Select, Checkbox, Switch, RadioGroup, Spinner, Skeleton (Gold only) |
| Molecules | Field, SearchBar, Card |
| Organisms | NavBar, HeroSection, Footer, EventGrid |

Skeleton is the exception — it exists only in Gold, where per-component loading patterns are part of the tier promise. Bronze and Silver use Spinner for loading states.

---

## Token Architecture

Each tier defines a neutral token palette in `tokens/`. Tokens are CSS custom properties under `:root` — never scoped to a class.

Brand packages override a subset of these tokens scoped under `.brand-{name}`. The tier's `:root` values act as the fallback for any token the brand does not override.

```css
/* tier package — :root defaults */
:root {
  --primary: oklch(0.50 0.22 265);
  --primary-foreground: oklch(0.98 0 0);
}

/* brand package — scoped override */
.brand-cikal {
  --primary: oklch(0.72 0.18 68);          /* amber */
  --primary-foreground: oklch(0.15 0 0);   /* dark text on light primary */
}
```

**Rules:**
- Tier tokens live under `:root` — never under a class.
- Brand tokens live under `.brand-{name}` — never under `:root`.
- Brand tokens only override what changes — they never duplicate the full tier palette.

---

## Brand Packages — `ui-{name}`

A client brand package is a thin layer on top of exactly one tier. It adds brand tokens and domain-specific organism compositions.

```
ui-cikal
  └─ extends ui-base-gold (whichever tier CIKAL subscribes to)
```

**What a brand package contains:**
- `tokens/` — CSS custom properties scoped under `.brand-{name}`
- `components/` — domain organisms only (NavBar, HeroSection, EventCard, etc.)

**What a brand package never contains:**
- Re-implementations of atoms or molecules — those come from the tier
- Business logic or feature-specific data fetching
- Imports from more than one tier

**Rules:**
- A brand package depends on exactly one tier. Never mix tiers.
- Brand components are purely presentational — no business logic, no UseCase calls.
- Brand organisms compose atoms and molecules from the tier package — they do not rewrite them.
- The `.brand-{name}` wrapper is the caller's responsibility; the brand package only defines the tokens.

---

## Showcase Packages — `ui-{name}-showcase`

A showcase package is a pre-deal sales tool. It imports all three tiers and lets a playground page demonstrate what a client's brand looks like at each tier level.

```
ui-cikal-showcase
  └─ depends on ui-base-bronze + ui-base-silver + ui-base-gold (all three)
```

**Rules:**
- A showcase package is never a dependency of a production app.
- It is never renamed or graduated into a brand package. When a deal is signed and a tier is chosen, a fresh `ui-{name}` package is created from scratch.
- `private: true` in `package.json` — never published to the registry.

**Lifecycle:**
```
ui-{name}-showcase   ← pre-deal: playground demo across all three tiers
        ↓ deal signed, tier chosen
ui-{name}            ← post-deal: fresh package, extends exactly one tier
```

---

## Tier-Invariant Components

Some organisms look and behave the same regardless of tier (e.g. NavBar layout, EventCard structure). These are **tier-invariant** — the implementation is shared or duplicated with no visual change across tiers.

In playground pages, tier-invariant sections carry a "Same across all tiers" chip so reviewers are not confused about why switching tiers produces no visible change.

Tier-invariant does not mean the component is identical in code — each tier package ships its own copy. It means the visual result is the same, by design.

---

## Creating a New Design System

When a new client is onboarded or a new web app needs a design system:

1. **Choose a tier** — Bronze (internal tools, MVPs), Silver (production SaaS), Gold (consumer-facing, premium UX).
2. **Create `ui-{name}`** — depends on exactly one tier package.
3. **Define brand tokens** — add CSS custom properties under `.brand-{name}` in `tokens/`.
4. **Compose domain organisms** — build presentational organisms in `components/` using atoms and molecules from the tier. Do not re-implement atoms or molecules.
5. **Wrap the app in `.brand-{name}`** — typically at the root layout; the tier's neutral tokens serve as fallback.

If the tier is undecided at project start:
1. **Create `ui-{name}-showcase`** instead — depends on all three tiers.
2. **Build a playground page** with a tier switcher — components render from the active tier under `.brand-{name}`.
3. **When the tier is signed off** — create a fresh `ui-{name}` on the chosen tier and discard the showcase.

---

## Key Rules

- All three tier packages are client-agnostic — no brand colors, no client-specific logic.
- Component API is identical across tiers — same names, same props.
- Tier packages are standalone — they share no common base package between them.
- Brand packages extend exactly one tier — never more than one.
- Brand tokens are scoped under `.brand-{name}`, never under `:root`.
- Brand components never re-implement atoms or molecules from the tier.
- Showcase packages are never production dependencies.
- No domain or business logic at any tier level — design system boundary rule applies.
