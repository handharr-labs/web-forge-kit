"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"

export type StoryMilestone = {
  /** e.g. "2019" or "Maret 2022". */
  period: string
  title: string
  body: string
  photoUrl?: string
}

/**
 * Vertical "Road to Us" timeline. A gold spine runs down the center with
 * alternating milestone cards that each reveal on scroll.
 */
export function LoveStory({
  milestones,
  className,
}: {
  milestones: StoryMilestone[]
  className?: string
}) {
  return (
    <div className={cn("relative mx-auto max-w-xl", className)}>
      {/* Center spine */}
      <span
        aria-hidden
        className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-[var(--gold)] to-transparent sm:left-1/2"
      />
      <ol className="space-y-12">
        {milestones.map((m, i) => {
          const left = i % 2 === 0
          return (
            <li key={i} className="relative">
              {/* Node */}
              <span
                aria-hidden
                className="absolute left-4 top-2 z-10 -translate-x-1/2 sm:left-1/2"
              >
                <span className="block h-3 w-3 rounded-full bg-[var(--gold)] ring-4 ring-[var(--background)]" />
              </span>

              <Reveal
                className={cn(
                  "ml-10 sm:ml-0 sm:w-1/2",
                  left ? "sm:pr-10 sm:text-right" : "sm:ml-auto sm:pl-10"
                )}
              >
                <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
                  {m.photoUrl && (
                    <img
                      src={m.photoUrl}
                      alt={m.title}
                      className="mb-4 h-40 w-full rounded-[var(--radius)] object-cover"
                    />
                  )}
                  <p className="typo-eyebrow !tracking-[0.25em] text-[var(--rose-deep)]">
                    {m.period}
                  </p>
                  <h3 className="typo-display mt-2 text-2xl text-[var(--foreground)]">
                    {m.title}
                  </h3>
                  <p className="typo-body mt-2 text-sm">{m.body}</p>
                </div>
              </Reveal>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
