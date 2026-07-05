"use client"

import * as React from "react"
import { cn } from "../../utils/cn"

/**
 * Consistent empty-feed placeholder — an optional icon over a quiet caption.
 * Used when a guestbook / gallery / feed has nothing yet.
 */
export function EmptyState({
  icon,
  children,
  className,
}: {
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center gap-2 py-8 text-center", className)}>
      {icon != null && (
        <span className="text-2xl opacity-60" aria-hidden>
          {icon}
        </span>
      )}
      <p className="typo-caption">{children}</p>
    </div>
  )
}
