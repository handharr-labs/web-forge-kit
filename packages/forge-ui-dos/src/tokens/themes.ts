// Enumerations for the forge-ui-dos color palettes and typography sets. The actual
// token values live in tokens/globals.css as `.ds-dos[data-palette]` /
// `[data-type]` blocks; these constants let apps build theme switchers and know
// which Google Fonts a typeset needs to load.

export const DOS_PALETTES = [
  { id: "sage", label: "Sage" },
  { id: "rose", label: "Rose" },
  { id: "terracotta", label: "Terracotta" },
  { id: "dusk", label: "Dusk" },
  { id: "crimson", label: "Crimson" },
] as const

export type DosPalette = (typeof DOS_PALETTES)[number]["id"]

export const DOS_TYPESETS = [
  { id: "classic", label: "Classic", fonts: ["Cormorant Garamond", "Pinyon Script", "Jost"] },
  { id: "modern", label: "Modern", fonts: ["Playfair Display", "Great Vibes", "Montserrat"] },
  { id: "romantic", label: "Romantic", fonts: ["EB Garamond", "Tangerine", "Lato"] },
  { id: "editorial", label: "Editorial", fonts: ["Fraunces", "Sacramento", "Inter"] },
] as const

export type DosTypeset = (typeof DOS_TYPESETS)[number]["id"]
