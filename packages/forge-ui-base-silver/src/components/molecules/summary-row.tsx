import * as React from "react"
import { Card, CardContent } from "../atoms/card"

interface SummaryRowProps {
  title: React.ReactNode
  /** Optional secondary line under the title. */
  meta?: React.ReactNode
  /** Optional status slot, e.g. a Badge. */
  status?: React.ReactNode
  /** Optional trailing action, e.g. a Button. */
  action?: React.ReactNode
  className?: string
}

/**
 * A card-shaped list row: a primary title, an optional meta line, an optional
 * status slot, and an optional trailing action. Purely presentational — the
 * caller supplies already-formatted content and any badges or buttons.
 */
function SummaryRow({ title, meta, status, action, className }: SummaryRowProps) {
  return (
    <Card data-slot="summary-row" className={className}>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex flex-col items-start gap-2">
          <span className="font-medium">{title}</span>
          {meta && (
            <span className="typo-label text-[var(--muted-foreground)]">{meta}</span>
          )}
          {status}
        </div>
        {action}
      </CardContent>
    </Card>
  )
}

export { SummaryRow }
export type { SummaryRowProps }
