"use client"

import * as React from "react"
import { cn } from "../../utils/cn"

export type SubmissionFeedApi<T> = {
  /**
   * Records an entry: runs the optional async `task` (the host write) while
   * `submitting` is true, then prepends `entry` to the visible feed. Rejections
   * propagate so the caller can skip clearing its form.
   */
  submit: (entry: T, task?: () => Promise<void> | void) => Promise<void>
  submitting: boolean
}

/**
 * Shared submit-over-scrolling-feed primitive behind Guestbook / SongRequestWall
 * / PhotoChallengeWall. Owns the optimistic list (local entries prepended over
 * the durable `items`), the `submitting` flag, and the scrolling / grid
 * container with its `aria-live` region and empty state. Callers supply their
 * own form (via the `form` render-prop, which receives `submit` + `submitting`)
 * and item markup (`renderItem`).
 */
export function SubmissionFeed<T>({
  items = [],
  form,
  renderItem,
  empty,
  layout = "list",
  gap = "0.75rem",
  maxHeight = "24rem",
  className,
}: {
  items?: T[]
  /** The submit form; receives `{ submit, submitting }`. */
  form?: (api: SubmissionFeedApi<T>) => React.ReactNode
  renderItem: (item: T, index: number) => React.ReactNode
  empty?: React.ReactNode
  /** Vertical scrolling list, or a responsive image grid. */
  layout?: "list" | "grid"
  /** Row gap for the list layout. */
  gap?: string
  /** Scroll cap for the list layout. */
  maxHeight?: string
  className?: string
}) {
  const [local, setLocal] = React.useState<T[]>([])
  const [submitting, setSubmitting] = React.useState(false)

  const submit = React.useCallback<SubmissionFeedApi<T>["submit"]>(
    async (entry, task) => {
      setSubmitting(true)
      try {
        await task?.()
        setLocal((l) => [entry, ...l])
      } finally {
        setSubmitting(false)
      }
    },
    []
  )

  const feed = [...local, ...items]
  const body = feed.length === 0 ? empty : feed.map(renderItem)

  return (
    <div className={cn("space-y-6", className)}>
      {form?.({ submit, submitting })}
      {layout === "grid" ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-live="polite">
          {body}
        </div>
      ) : (
        <div
          className="flex flex-col overflow-y-auto pr-1"
          style={{ maxHeight, gap }}
          aria-live="polite"
        >
          {body}
        </div>
      )}
    </div>
  )
}
