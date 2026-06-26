"use client"

import * as React from "react"
import { Button } from "../atoms/button"
import { cn } from "../../utils/cn"

interface CtaAction {
  label: string
  onClick: () => void
}

interface CtaBandProps {
  title: string
  description: string
  primary: CtaAction
  secondary?: CtaAction
  className?: string
}

/** Centered call-to-action band on a gradient surface, with primary + optional secondary buttons. */
function CtaBand({ title, description, primary, secondary, className }: CtaBandProps) {
  return (
    <section
      data-slot="cta-band"
      className={cn(
        "flex flex-col items-center gap-5 rounded-2xl bg-gradient-to-br from-[var(--muted)] to-[var(--secondary)] px-6 py-14 text-center shadow-[var(--shadow-md)] ring-1 ring-[var(--border)]",
        className
      )}
    >
      <div className="flex max-w-xl flex-col gap-2">
        <h2 className="typo-section-title font-bold">{title}</h2>
        <p className="text-[var(--muted-foreground)]">{description}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={primary.onClick}>
          {primary.label}
        </Button>
        {secondary && (
          <Button variant="outline" size="lg" onClick={secondary.onClick}>
            {secondary.label}
          </Button>
        )}
      </div>
    </section>
  )
}

export { CtaBand }
export type { CtaBandProps, CtaAction }
