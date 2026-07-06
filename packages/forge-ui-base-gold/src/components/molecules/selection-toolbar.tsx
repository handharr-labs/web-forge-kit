"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "../../utils/cn"

interface SelectionToolbarProps {
  /** Number of selected rows. The toolbar renders nothing when 0. */
  count: number
  /** Bulk-action controls (typically Buttons), right-aligned. */
  children?: React.ReactNode
  onClear?: () => void
  /** Noun for the count label — "3 sites selected". Pluralized with a trailing "s". */
  itemNoun?: string
  clearLabel?: string
  className?: string
}

/**
 * Bulk-action bar that appears when table rows are selected: a selected-count
 * label, a clear affordance, and a slot for bulk actions. Used by `DataTable`
 * (auto-mounted on selection) or standalone above any list.
 */
function SelectionToolbar({
  count,
  children,
  onClear,
  itemNoun = "item",
  clearLabel = "Clear selection",
  className,
}: SelectionToolbarProps) {
  if (count <= 0) return null

  const noun = count === 1 ? itemNoun : `${itemNoun}s`

  return (
    <div
      data-slot="selection-toolbar"
      role="toolbar"
      aria-label="Bulk actions"
      className={cn(
        "flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/60 px-3 py-2 shadow-[var(--shadow-sm)] animate-in fade-in-0 slide-in-from-top-1 duration-150",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {onClear && (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={onClear}
            className="flex size-6 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <X className="size-4" />
          </button>
        )}
        <span className="typo-label whitespace-nowrap">
          {count} {noun} selected
        </span>
      </div>
      {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
    </div>
  )
}

export { SelectionToolbar }
export type { SelectionToolbarProps }
