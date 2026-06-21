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
];
