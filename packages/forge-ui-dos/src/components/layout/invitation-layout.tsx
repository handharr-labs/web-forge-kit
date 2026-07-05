"use client"

import * as React from "react"
import { cn } from "../../utils/cn"

/**
 * The narrow, phone-width invitation body that both layouts scroll. Constrains
 * width, centers, and optionally frames it like a card. Put your <Section>s or
 * content blocks inside. This is the single reusable "page body" — the layout
 * wrappers below only decide how it sits on the screen.
 */
export function InvitationColumn({
  children,
  framed = false,
  width = "30rem",
  className,
}: {
  children: React.ReactNode
  /** Draw side borders + shadow so it reads as a standalone card. */
  framed?: boolean
  /** Max content width of the column. */
  width?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        framed &&
          "border-x border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow-lg)]",
        className
      )}
      style={{ maxWidth: width }}
    >
      {children}
    </div>
  )
}

/**
 * Single-scroll layout: one centered column that scrolls with the page — the
 * classic full-width invitation.
 */
export function SingleInvitation({
  children,
  width,
  framed,
  className,
}: {
  children: React.ReactNode
  width?: string
  framed?: boolean
  className?: string
}) {
  return (
    <div className={cn("min-h-[100svh] w-full", className)}>
      <InvitationColumn framed={framed} width={width}>
        {children}
      </InvitationColumn>
    </div>
  )
}

/**
 * Split layout (à la byaisyahluthfi.com): a decorative panel stays fixed on one
 * side while the invitation column scrolls beside it. Collapses to a single
 * scrolling column on mobile, where the `aside` is hidden. A single page scroll
 * drives both — the aside is `position: sticky`, not a nested scroll container.
 */
export function SplitInvitation({
  aside,
  children,
  asideSide = "left",
  width = "30rem",
  className,
}: {
  /** Fixed decorative content (portrait, hero, botanical panel…). */
  aside: React.ReactNode
  /** The scrolling invitation body. */
  children: React.ReactNode
  asideSide?: "left" | "right"
  width?: string
  className?: string
}) {
  const asideEl = (
    <aside
      key="aside"
      className="sticky top-0 hidden h-[100svh] flex-1 overflow-hidden lg:block"
    >
      {aside}
    </aside>
  )
  const columnEl = (
    <div
      key="column"
      style={{ width }}
      className="min-h-[100svh] max-w-full shrink-0 bg-[var(--background)] lg:border-x lg:border-[var(--border)] lg:shadow-[var(--shadow-lg)]"
    >
      {children}
    </div>
  )
  return (
    <div
      className={cn(
        "relative flex min-h-[100svh] w-full items-start justify-center",
        className
      )}
    >
      {asideSide === "left" ? [asideEl, columnEl] : [columnEl, asideEl]}
    </div>
  )
}
