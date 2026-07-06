"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"

import { cn } from "../../utils/cn"

interface SortableListProps<T> {
  items: T[]
  /** Stable id per item — keys the list and drag tracking. */
  itemId: (item: T) => string
  /** Row content (right of the drag handle, left of the enable slot). */
  renderItem: (item: T, meta: { dragging: boolean; index: number }) => React.ReactNode
  /**
   * Controlled-optional: provide to control order + persist reorders. Omit and
   * the list manages its own order (great for previews).
   */
  onReorder?: (items: T[]) => void
  /** Per-row trailing control, e.g. an enable `Switch`. */
  renderEnable?: (item: T) => React.ReactNode
  /** Accessible label for a row's drag handle. */
  handleLabel?: (item: T) => string
  disabled?: boolean
  className?: string
  itemClassName?: string
}

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = arr.slice()
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

/**
 * Reorderable list with a drag handle and full keyboard support — the ordered
 * `sections` control for the invitation config builder. Drag a handle to
 * reorder (live), or focus a handle and press ↑/↓ to move an item. Generic and
 * controlled-optional: pass `onReorder` to persist, omit to self-manage.
 */
function SortableList<T>({
  items,
  itemId,
  renderItem,
  onReorder,
  renderEnable,
  handleLabel,
  disabled = false,
  className,
  itemClassName,
}: SortableListProps<T>) {
  // Controlled-optional order state.
  const [internal, setInternal] = React.useState(items)
  const list = onReorder ? items : internal

  const commit = React.useCallback(
    (next: T[]) => {
      if (onReorder) onReorder(next)
      else setInternal(next)
    },
    [onReorder]
  )

  const [dragId, setDragId] = React.useState<string | null>(null)
  const indexOf = (id: string) => list.findIndex((it) => itemId(it) === id)

  function onDragStart(e: React.DragEvent, id: string) {
    if (disabled) return
    setDragId(id)
    e.dataTransfer.effectAllowed = "move"
    // Firefox needs data set for drag to initiate.
    e.dataTransfer.setData("text/plain", id)
  }

  function onDragOverItem(e: React.DragEvent, overId: string) {
    if (disabled || dragId == null || dragId === overId) return
    e.preventDefault() // allow drop
    const from = indexOf(dragId)
    const to = indexOf(overId)
    if (from === -1 || to === -1 || from === to) return
    commit(move(list, from, to))
  }

  function onKeyReorder(e: React.KeyboardEvent, id: string) {
    if (disabled) return
    const from = indexOf(id)
    if (from === -1) return
    let to = from
    if (e.key === "ArrowUp") to = from - 1
    else if (e.key === "ArrowDown") to = from + 1
    else return
    if (to < 0 || to >= list.length) return
    e.preventDefault()
    commit(move(list, from, to))
    // Keep focus on the moved item's handle after re-render.
    const handle = e.currentTarget as HTMLElement
    requestAnimationFrame(() => handle.focus())
  }

  return (
    <ul data-slot="sortable-list" className={cn("flex flex-col gap-2", className)}>
      {list.map((item, index) => {
        const id = itemId(item)
        const dragging = dragId === id
        return (
          <li
            key={id}
            data-slot="sortable-item"
            data-dragging={dragging || undefined}
            draggable={!disabled}
            onDragStart={(e) => onDragStart(e, id)}
            onDragOver={(e) => onDragOverItem(e, id)}
            onDragEnd={() => setDragId(null)}
            onDrop={(e) => { e.preventDefault(); setDragId(null) }}
            className={cn(
              "flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-2 transition-shadow",
              dragging && "opacity-60 shadow-[var(--shadow-md)] ring-1 ring-[var(--ring)]",
              itemClassName
            )}
          >
            <button
              type="button"
              aria-label={handleLabel?.(item) ?? "Drag to reorder (or use arrow keys)"}
              disabled={disabled}
              onKeyDown={(e) => onKeyReorder(e, id)}
              className={cn(
                "flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              <GripVertical className="size-4" />
            </button>

            <div className="min-w-0 flex-1">{renderItem(item, { dragging, index })}</div>

            {renderEnable && <div className="shrink-0">{renderEnable(item)}</div>}
          </li>
        )
      })}
    </ul>
  )
}

export { SortableList }
export type { SortableListProps }
