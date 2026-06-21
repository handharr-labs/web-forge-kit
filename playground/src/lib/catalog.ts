export interface DesignSystem {
  slug: string;
  name: string;
  description: string;
  version: string;
}

export const designSystems: DesignSystem[] = [
  {
    slug: "cikal",
    name: "ui-cikal",
    description: "Design system for CIKAL school competitions (beta) — components, tokens, and utilities.",
    version: "0.1.0-beta",
  },
  {
    slug: "xpnsio",
    name: "ui-xpnsio",
    description: "Design system for the Xpnsio expense tracking app — components, tokens, and utilities.",
    version: "1.1.0",
  },
  {
    slug: "bronze",
    name: "ui-base-bronze",
    description: "Tier 1 — Functional, minimal, no animation. Inline field layout. For MVPs and internal tools.",
    version: "0.1.0-beta",
  },
  {
    slug: "silver",
    name: "ui-base-silver",
    description: "Tier 2 — Polished, production-ready, stacked field layout. For client-facing SaaS apps.",
    version: "0.1.0-beta",
  },
  {
    slug: "gold",
    name: "ui-base-gold",
    description: "Tier 3 — Premium, animated interactions, floating label, dark mode. For consumer products.",
    version: "0.1.0-beta",
  },
];
