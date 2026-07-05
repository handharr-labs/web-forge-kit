"use client"

import * as React from "react"
import { cn } from "../../utils/cn"

/**
 * Couple initials mark — joined initials in the script face inside a foil-edged
 * ring. Used on the cover and closing sections. Pass the two names (initials are
 * derived) or an explicit `initials` string.
 */
export function Monogram({
  left,
  right,
  initials,
  size = 88,
  className,
}: {
  left?: string
  right?: string
  initials?: string
  size?: number
  className?: string
}) {
  const text =
    initials ??
    `${(left?.[0] ?? "").toUpperCase()}${(right?.[0] ?? "").toUpperCase()}`

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-[var(--gold)]/60 bg-[var(--surface)] shadow-[var(--shadow-sm)]",
        className
      )}
      style={{ width: size, height: size }}
    >
      <span
        data-mekar-foil=""
        className="font-[var(--font-script)] leading-none"
        style={{ fontSize: size * 0.5 }}
      >
        {text}
      </span>
    </span>
  )
}
