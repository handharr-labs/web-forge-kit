"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { buttonVariants } from "../atoms/button"

/**
 * Live-streaming call-to-action — a labelled link (YouTube / Zoom / IG Live)
 * that the host makes prominent near the event date. The pulsing dot signals a
 * live broadcast.
 */
export function LiveStream({
  url,
  platform = "Live Streaming",
  label = "Tonton Live",
  note,
  className,
}: {
  url: string
  platform?: React.ReactNode
  label?: string
  note?: React.ReactNode
  className?: string
}) {
  return (
    <Reveal
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--gold)]/40 bg-[var(--gold-soft)] p-8 text-center shadow-[var(--shadow-sm)]",
        className
      )}
    >
      <p className="typo-eyebrow text-[var(--gold-deep)]">{platform}</p>
      {note && <p className="typo-body mx-auto mt-3 max-w-md text-sm">{note}</p>}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={cn(buttonVariants({ variant: "solid", size: "lg" }), "mt-5")}
      >
        <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--primary-foreground)]" />
        {label}
      </a>
    </Reveal>
  )
}
