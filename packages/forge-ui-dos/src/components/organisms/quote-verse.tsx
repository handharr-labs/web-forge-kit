"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { OrnamentDivider } from "../atoms/ornament"

/**
 * Decorative verse / quote block — a religious verse or a favourite line, framed
 * by botanical dividers. `source` is the attribution (e.g. "QS. Ar-Rum: 21").
 */
export function QuoteVerse({
  children,
  source,
  className,
}: {
  children: React.ReactNode
  source?: React.ReactNode
  className?: string
}) {
  return (
    <Reveal className={cn("mx-auto max-w-xl text-center", className)}>
      <OrnamentDivider className="mb-8" />
      <p className="typo-lead italic">{children}</p>
      {source && (
        <p className="typo-eyebrow mt-6 !tracking-[0.25em] text-[var(--rose-deep)]">{source}</p>
      )}
      <OrnamentDivider className="mt-8" />
    </Reveal>
  )
}
