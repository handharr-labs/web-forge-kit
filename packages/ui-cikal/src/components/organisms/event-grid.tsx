import * as React from "react"

import { EventCard, type EventCardProps } from "../molecules/event-card"
import { cn } from "../../utils/cn"

interface EventGridProps {
  events: EventCardProps[]
  className?: string
}

function EventGrid({ events, className }: EventGridProps) {
  if (events.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] py-16 text-center",
          className
        )}
      >
        <p className="typo-section-title text-[var(--muted-foreground)]">No events yet</p>
        <p className="typo-body text-[var(--muted-foreground)] mt-1">
          Check back soon for upcoming competitions.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {events.map((event, i) => (
        <EventCard key={`${event.title}-${i}`} {...event} />
      ))}
    </div>
  )
}

export { EventGrid }
export type { EventGridProps }
