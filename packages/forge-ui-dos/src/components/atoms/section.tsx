"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "./reveal"
import { OrnamentDivider } from "./ornament"

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Small uppercase eyebrow above the title. */
  eyebrow?: React.ReactNode
  /** Section heading (rendered in the display serif). */
  title?: React.ReactNode
  /** Show the botanical divider under the header. Default true when titled. */
  divider?: boolean
  /** Sunken surface tint to alternate section backgrounds. */
  tone?: "canvas" | "surface"
}

/**
 * Vertical rhythm + centered header scaffold shared by every content section
 * (love story, event, RSVP, gallery…). Keeps the "unhurried" cadence
 * consistent via `--section-gap`.
 */
export function Section({
  eyebrow,
  title,
  divider,
  tone = "canvas",
  className,
  children,
  ...props
}: SectionProps) {
  const showDivider = divider ?? Boolean(title)
  return (
    <section
      className={cn(
        "w-full px-6",
        tone === "surface" && "bg-[var(--surface-2)]",
        className
      )}
      style={{ paddingBlock: "var(--section-gap)" }}
      {...props}
    >
      <div className="mx-auto w-full max-w-2xl">
        {(eyebrow || title) && (
          <Reveal className="mb-10 text-center">
            {eyebrow && <p className="typo-eyebrow mb-4">{eyebrow}</p>}
            {title && <h2 className="typo-title text-[var(--foreground)]">{title}</h2>}
            {showDivider && <OrnamentDivider className="mt-6" />}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
