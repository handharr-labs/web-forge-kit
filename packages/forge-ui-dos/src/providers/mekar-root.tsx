"use client"

import * as React from "react"
import { cn } from "../utils/cn"

type MekarRootProps = {
  /** Evening "night garden" palette instead of the daytime cream. */
  night?: boolean
  className?: string
  children: React.ReactNode
  /** Element to render as the scope root. Defaults to a <div>. */
  as?: React.ElementType
}

/**
 * Scope root for the Mekar design system. Every Mekar component must render
 * inside this so the `.ds-mekar` token layer is in effect. Nothing in the
 * system reads tokens from :root — they live here and here only.
 */
export function MekarRoot({
  night = false,
  className,
  children,
  as: Tag = "div",
}: MekarRootProps) {
  return (
    <Tag className={cn("ds-mekar", night && "night", className)}>{children}</Tag>
  )
}
