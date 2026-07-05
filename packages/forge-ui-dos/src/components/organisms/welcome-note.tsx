"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { OrnamentDivider } from "../atoms/ornament"

/**
 * Welcome / preface card — the short personal greeting that follows the cover
 * ("This little website was personally made by…"). A framed note with an
 * optional eyebrow, title, script signature, and a CTA slot (children).
 */
export function WelcomeNote({
  eyebrow,
  title,
  message,
  signature,
  children,
  className,
}: {
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  message: React.ReactNode
  /** Script-face sign-off, e.g. the couple's names. */
  signature?: React.ReactNode
  /** CTA slot rendered under the message (e.g. a Button). */
  children?: React.ReactNode
  className?: string
}) {
  return (
    <Reveal
      className={cn(
        "mx-auto max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-md)]",
        className
      )}
    >
      {eyebrow && <p className="typo-eyebrow mb-4">{eyebrow}</p>}
      {title && (
        <h3 className="typo-display text-2xl text-[var(--foreground)]">{title}</h3>
      )}
      <OrnamentDivider className="my-5" />
      <p className="typo-body text-sm">{message}</p>
      {signature && (
        <p className="typo-script mt-5 text-2xl text-[var(--primary-deep)]">
          {signature}
        </p>
      )}
      {children && <div className="mt-6 flex justify-center">{children}</div>}
    </Reveal>
  )
}
