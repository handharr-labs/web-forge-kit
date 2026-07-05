"use client"

import * as React from "react"
import { cn } from "../../utils/cn"

/**
 * Loading placeholder — a soft pulsing block. Size it with a width/height class.
 * The pulse freezes under `prefers-reduced-motion` (token layer).
 */
export function Skeleton({
  className,
  rounded = "var(--radius)",
}: {
  className?: string
  /** Border radius token/value. Default `--radius`. */
  rounded?: string
}) {
  return (
    <div
      className={cn("animate-pulse bg-[var(--surface-2)]", className)}
      style={{ borderRadius: rounded }}
      aria-hidden
    />
  )
}
