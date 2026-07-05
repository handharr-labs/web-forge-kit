import * as React from "react"
import { Card, CardContent } from "../atoms/card"

interface EmptyStateProps {
  title: React.ReactNode
  description?: React.ReactNode
  /** Optional leading icon, rendered in a gradient disc above the title. */
  icon?: React.ReactNode
  /** Optional action, e.g. a Button, rendered below the copy. */
  action?: React.ReactNode
}

/** Centered empty-state inside a card: optional icon, title, optional description and action. */
function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Card data-slot="empty-state">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        {icon && (
          <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] text-[var(--primary-foreground)] shadow-[var(--shadow-sm)]">
            {icon}
          </div>
        )}
        <p className="typo-card-title font-semibold">{title}</p>
        {description && (
          <p className="max-w-sm text-[var(--muted-foreground)]">{description}</p>
        )}
        {action}
      </CardContent>
    </Card>
  )
}

export { EmptyState }
export type { EmptyStateProps }
