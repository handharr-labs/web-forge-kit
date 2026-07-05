"use client"

import * as React from "react"
import { cn } from "../../utils/cn"

/**
 * Wedding hashtag mark (e.g. `#VaniaArbi2026`). Rendered in the script face as a
 * small branded flourish near the cover or closing. Pass the tag via `tag` or as
 * children; a leading `#` is added if missing.
 */
export function HashtagBanner({
  tag,
  children,
  className,
}: {
  tag?: string
  children?: React.ReactNode
  className?: string
}) {
  const raw = children ?? tag
  const text =
    typeof raw === "string" && !raw.startsWith("#") ? `#${raw}` : raw
  return (
    <p
      className={cn(
        "typo-script text-2xl text-[var(--primary-deep)]",
        className
      )}
    >
      {text}
    </p>
  )
}
