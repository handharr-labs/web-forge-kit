"use client"

import * as React from "react"
import { cn } from "../utils/cn"
import type { DosPalette, DosTypeset } from "../tokens/themes"

type DosRootProps = {
  /** Evening "night garden" palette instead of the daytime cream. */
  night?: boolean
  /** Color palette. Defaults to "sage" (the base tokens). */
  palette?: DosPalette
  /** Typography set. Defaults to "classic". Host must load the set's fonts. */
  typeface?: DosTypeset
  className?: string
  children: React.ReactNode
  /** Element to render as the scope root. Defaults to a <div>. */
  as?: React.ElementType
  /** Inline style passthrough — e.g. per-brand hue knobs (`--sage-hue`…). */
  style?: React.CSSProperties
}

/**
 * Scope root for the forge-ui-dos design system. Every forge-ui-dos component must render
 * inside this so the `.ds-dos` token layer is in effect. Nothing in the
 * system reads tokens from :root — they live here and here only.
 */
export function DosRoot({
  night = false,
  palette,
  typeface,
  className,
  children,
  as: Tag = "div",
  style,
}: DosRootProps) {
  return (
    <Tag
      className={cn("ds-dos", night && "night", className)}
      data-palette={palette && palette !== "sage" ? palette : undefined}
      data-type={typeface && typeface !== "classic" ? typeface : undefined}
      style={style}
    >
      {children}
    </Tag>
  )
}
