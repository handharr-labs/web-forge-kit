import * as React from "react"
import { EventCard, type EventCardProps } from "../molecules/event-card"
import { Skeleton } from "../atoms/skeleton"
import { cn } from "../../utils/cn"

interface EventGridProps {
  items: EventCardProps[]
  loading?: boolean
  emptyMessage?: string
  className?: string
}

function EventGrid({ items, loading = false, emptyMessage = "No items yet.", className }: EventGridProps) {
  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 overflow-hidden rounded-xl border border-[var(--border)] p-4 shadow-[var(--shadow-sm)]">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-24 ml-auto" />
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] py-16 text-center",
        className
      )}>
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
