import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "../atoms/card"

interface InfoCardProps {
  title: React.ReactNode
  description?: React.ReactNode
  eyebrow?: React.ReactNode
  eyebrowTone?: "primary" | "muted"
}

/** A simple informational card: optional eyebrow + title + description. */
function InfoCard({ title, description, eyebrow, eyebrowTone = "muted" }: InfoCardProps) {
  const eyebrowColor =
    eyebrowTone === "primary" ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"

  return (
    <Card data-slot="info-card">
      <CardHeader>
        {eyebrow && <span className={`typo-label ${eyebrowColor}`}>{eyebrow}</span>}
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
    </Card>
  )
}

export { InfoCard }
export type { InfoCardProps }
