import * as React from "react"

import { Button } from "../atoms/button"
import { cn } from "../../utils/cn"

interface CtaConfig {
  label: string
  onClick?: () => void
}

interface HeroSectionProps {
  headline: string
  subline?: string
  primaryCta?: CtaConfig
  secondaryCta?: CtaConfig
  media?: React.ReactNode
  className?: string
}

function HeroSection({
  headline,
  subline,
  primaryCta,
  secondaryCta,
  media,
  className,
}: HeroSectionProps) {
  return (
    <section
      data-slot="hero-section"
      className={cn(
        "flex flex-col-reverse gap-8 py-12 sm:flex-row sm:items-center sm:py-16",
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-5">
        <h1 className="typo-hero">{headline}</h1>
        {subline && (
          <p className="typo-body text-[var(--muted-foreground)] max-w-lg">{subline}</p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-wrap gap-3">
            {primaryCta && (
              <Button size="lg" onClick={primaryCta.onClick}>
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button variant="outline" size="lg" onClick={secondaryCta.onClick}>
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}
      </div>
      {media && <div className="flex-1">{media}</div>}
    </section>
  )
}

export { HeroSection }
export type { HeroSectionProps }
