# Scaffold `ui-cikal` design system package

**Date:** 2026-06-22
**Status:** In Progress

## Context

CIKAL is one of Jakarta's largest school foundations. They are a potential client who wants an **Information System web app for School Competitions** — a platform where admins create and manage events/competitions, and users (athletes, students) browse and register for them.

The engagement is still in active talks. The client wants to see a **prototype** before committing, so the immediate goal is a design system that is:

- **Beta / pre-stable** — may undergo major changes based on client feedback.
- **Brand-aligned** — visually inspired by CIKAL's identity (reference: cikal.co.id).
- **Prototype-ready** — enough tokens + components to render realistic screens.

This initiative scaffolds `@handharr-labs/ui-cikal` as a new `ui-{name}` package in the monorepo, following the same structure and rules established by `ui-xpnsio`.

## User roles

| Role | Description |
|---|---|
| Admin | Event/competition creator — only the client's staff. |
| User | Participant — athletes, students browsing and registering for events. |

## Design direction

CIKAL's brand is **amber-led, high-energy, and community-driven** — derived directly from cikal.co.id.

**Token palette (OKLCH, scoped under `.brand-cikal`):**
- **Primary:** amber/golden yellow `oklch(0.77 0.16 68)` — nav bar, footer, CTA buttons
- **Foreground:** navy blue `oklch(0.22 0.07 258)` — all headings and body text
- **Secondary:** purple/lavender `oklch(0.65 0.08 295)` — section backgrounds, accents
- **Accent:** orange `oklch(0.63 0.17 44)` — decorative highlights
- **Destructive:** red `oklch(0.58 0.22 27)` — errors and danger states
- **Background:** white; **Muted:** light gray

Tokens are scoped under `.brand-cikal` (not `:root`) so the package coexists with `ui-xpnsio` in the same playground without token collision.

**Type scale:** 9-class `typo-*` convention, also scoped under `.brand-cikal`.

**Radius:** `0.5rem` — clean and approachable.

**Light mode only** — dark mode deferred until post-prototype client feedback.

## Package contents (`@handharr-labs/ui-cikal@0.1.0-beta`)

### Tokens
- Color palette (OKLCH, light mode, scoped under `.brand-cikal`)
- Radius scale
- Typography scale (`typo-*` utility classes)

### Utilities
- `cn()` — `clsx` + `tailwind-merge`

### Providers
- `ThemeProvider` — `next-themes` wrapper (`defaultTheme="light"`)

### Components — Atoms
| Component | Notes |
|---|---|
| `Button` | Base UI + CVA. 6 variants (default/secondary/outline/ghost/danger/link), 3 sizes. |
| `Badge` | Status pill. 5 variants: upcoming / ongoing / closed / cancelled / neutral. |
| `Card` | Compound: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction`. |
| `Avatar` | Image with initials fallback. 3 sizes (sm/default/lg). |
| `Input` | Native `<input>`, any `type` (text/email/date/number…). Error state via `aria-invalid`. |
| `Textarea` | Native `<textarea>`, same token treatment, `resize-y`. |
| `Label` | `typo-label` styled. `required` prop renders a red `*`. |
| `Select` | Base UI Select. Full compound: trigger, content, item, group, separator, scroll buttons. |
| `Checkbox` | Base UI Checkbox.Root + Indicator. Amber when checked. |
| `Switch` | Base UI Switch.Root + Thumb. Translating white thumb, amber track when on. |
| `RadioGroup` + `Radio` | Base UI primitives. Amber indicator dot, `relative`/`absolute` positioning for correct centering. |

### Components — Molecules
| Component | Notes |
|---|---|
| `EventCard` | Competition tile: title, category, date range, status badge, optional CTA. |
| `SearchBar` | Input + Search icon. |
| `Field` | Presentational wrapper: `Label` + control slot + `description` / `error` footer. |

### Components — Organisms
| Component | Notes |
|---|---|
| `EventGrid` | Responsive grid of `EventCard`s with empty state. |
| `HeroSection` | Headline, subline, CTA buttons, optional media slot. |
| `NavBar` | Logo, nav links, user avatar or login button. |

## Steps

1. ✅ **Write initiative doc** — this file.
2. ✅ **Scaffold package** — `packages/ui-cikal/`, `package.json` at `0.1.0-beta`, `tsconfig.json`.
3. ✅ **Tokens** — `tokens/globals.css` with CIKAL palette (amber primary, navy foreground, purple secondary) scoped under `.brand-cikal`.
4. ✅ **Utilities + Providers** — `cn()`, `ThemeProvider`.
5. ✅ **Atoms (display)** — `Button`, `Badge`, `Card`, `Avatar`.
6. ✅ **Molecules (display)** — `EventCard`, `SearchBar`.
7. ✅ **Organisms** — `EventGrid`, `HeroSection`, `NavBar`.
8. ✅ **Playground page** — design catalog at `/ds/cikal` showcasing all components.
9. ✅ **Atoms (form)** — `Input`, `Textarea`, `Label`, `Select`, `Checkbox`, `Switch`, `RadioGroup` + `Radio`.
10. ✅ **Molecules (form)** — `Field` wrapper.
11. ✅ **Playground form showcase** — Atoms — Form Controls, Molecules — Field, Composed — Registration Form.
12. **Publish** — `npm publish --tag beta` `0.1.0-beta` to GitHub Packages.

## Verification

- `npm install` resolves with no errors.
- `npm run type-check --workspaces` passes in `packages/ui-cikal` and `playground/`.
- Playground `/ds/cikal` renders all components on a white background without errors.
- `npm publish --dry-run --tag beta -w packages/ui-cikal` shows correct name, version, and all 21 `src/` files included.

## Out of scope

- Dark mode tokens (deferred until post-prototype client feedback).
- Custom date-picker / calendar component — native `<input type="date">` used for the prototype.
- Form-level validation and submit logic — app-specific, lives in the downstream app.
- Registration/auth flow components — app-specific, lives in the downstream app.
- Any domain or business logic — design system boundary rule applies.
- `web-server` / backend utilities for CIKAL.
