import * as React from "react"

import { EventCard, type EventCardProps } from "../molecules/event-card"
import { cn } from "../../utils/cn"

interface EventGridProps {
  items: EventCardProps[]
  emptyMessage?: string
  className?: string
}

function EventGrid({ items, emptyMessage = "No items yet.", className }: EventGridProps) {
  if (items.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] py-16 text-center",
          className
        )}
      >
        <p className="typo-section-title text-[var(--muted-foreground)]">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item, i) => (
        <EventCard key={`${item.title}-${i}`} {...item} />
      ))}
    </div>
  )
}

export { EventGrid }
export type { EventGridProps }
