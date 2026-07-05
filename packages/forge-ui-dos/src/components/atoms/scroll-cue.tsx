"use client"

import * as React from "react"
import { cn } from "../../utils/cn"

/**
 * "Scroll to continue" hint — a small caption over a gently bobbing chevron,
 * placed at the bottom of the cover / a long section. The bob auto-freezes under
 * `prefers-reduced-motion` (token layer).
 */
export function ScrollCue({
  label = "Scroll",
  className,
}: {
  label?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 text-[var(--muted-foreground)]",
        className
      )}
    >
      {label && <span className="typo-eyebrow !text-[0.6rem]">{label}</span>}
      <svg
        data-dos-bob
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        aria-hidden
      >
        <path
          d="M6 9l6 6 6-6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
