"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { Monogram } from "../atoms/monogram"
import { OrnamentDivider } from "../atoms/ornament"

/**
 * Closing section — thank-you message, couple monogram, names, and hashtag. The
 * quiet last beat of the invitation.
 */
export function ClosingSection({
  message,
  brideName,
  groomName,
  hashtag,
  initials,
  title = "Thank You",
  className,
}: {
  message?: React.ReactNode
  brideName?: string
  groomName?: string
  hashtag?: string
  /** Override the derived monogram initials. */
  initials?: string
  title?: React.ReactNode
  className?: string
}) {
  const bothNames = [brideName, groomName].filter(Boolean).join(" & ")
  return (
    <Reveal className={cn("flex flex-col items-center text-center", className)}>
      <p className="typo-script text-[var(--primary-deep)]">{title}</p>
      {message && <p className="typo-body mx-auto mt-4 max-w-md text-sm">{message}</p>}
      <OrnamentDivider className="my-8" />
      <Monogram left={brideName} right={groomName} initials={initials} />
      {bothNames && (
        <p className="typo-display mt-5 text-2xl text-[var(--foreground)]">{bothNames}</p>
      )}
      {hashtag && <p className="typo-eyebrow mt-3">{hashtag}</p>}
    </Reveal>
  )
}
