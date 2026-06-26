import * as React from "react"

interface SectionIntroProps {
  /** Small uppercase kicker above the title. */
  eyebrow: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
}

/**
 * Eyebrow + title + lead paragraph block for the top of a marketing or content
 * section. The public-page counterpart to {@link PageHeader} (which carries an
 * action slot for app/admin surfaces).
 */
function SectionIntro({ eyebrow, title, description, className }: SectionIntroProps) {
  return (
    <section
      data-slot="section-intro"
      className={`flex max-w-2xl flex-col gap-4 ${className ?? ""}`}
    >
      <span className="typo-label text-[var(--primary)]">{eyebrow}</span>
      <h1 className="typo-section-title font-bold">{title}</h1>
      {description && (
        <p className="typo-body text-[var(--muted-foreground)]">{description}</p>
      )}
    </section>
  )
}

export { SectionIntro }
export type { SectionIntroProps }
