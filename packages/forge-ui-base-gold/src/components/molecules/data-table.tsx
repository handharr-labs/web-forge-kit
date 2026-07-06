"use client"

import * as React from "react"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"

import { cn } from "../../utils/cn"
import { Checkbox } from "../atoms/checkbox"
import { Skeleton } from "../atoms/skeleton"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "../atoms/table"
import { EmptyState } from "./empty-state"
import { Pagination, type PaginationProps } from "./pagination"
import { SelectionToolbar } from "./selection-toolbar"

type SortDirection = "asc" | "desc"

interface SortState {
  key: string
  direction: SortDirection
}

interface DataTableColumn<T> {
  /** Stable column id; also the sort key emitted in `SortState`. */
  key: string
  header: React.ReactNode
  /** Renders the cell for a row. */
  cell: (row: T) => React.ReactNode
  sortable?: boolean
  /**
   * Comparable value for client-side sorting (uncontrolled sort only). Required
   * for a `sortable` column to actually reorder locally; omit when sorting
   * server-side via `onSortChange`.
   */
  sortAccessor?: (row: T) => string | number
  align?: "left" | "right" | "center"
  className?: string
  headerClassName?: string
  width?: string | number
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  /** Stable id per row — keys selection and React lists. */
  rowId: (row: T) => string

  /** Selection column + select-all header. */
  selectable?: boolean
  /** Controlled selection; omit to let the table manage it. */
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void

  /** Controlled sort; provide `onSortChange` for server-side sorting. */
  sort?: SortState | null
  onSortChange?: (sort: SortState | null) => void

  loading?: boolean
  skeletonRows?: number
  /** Custom empty content; defaults to an `EmptyState`. */
  empty?: React.ReactNode
  emptyTitle?: React.ReactNode

  /** Sticky header — sticks within a bounded scroll region (see `maxHeight`). */
  stickyHeader?: boolean
  /** Bound the table's height so it scrolls internally (enables a useful sticky header). */
  maxHeight?: string | number

  /** Rendered above the table (e.g. a `FilterBar`). */
  toolbar?: React.ReactNode
  /** Bulk-action controls, shown in a `SelectionToolbar` when rows are selected. */
  bulkActions?: React.ReactNode
  selectionNoun?: string

  onRowClick?: (row: T) => void
  pagination?: PaginationProps
  className?: string
}

const ALIGN = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const

function DataTable<T>({
  columns,
  data,
  rowId,
  selectable = false,
  selectedIds,
  onSelectionChange,
  sort,
  onSortChange,
  loading = false,
  skeletonRows = 5,
  empty,
  emptyTitle = "No results",
  stickyHeader = true,
  maxHeight,
  toolbar,
  bulkActions,
  selectionNoun = "item",
  onRowClick,
  pagination,
  className,
}: DataTableProps<T>) {
  // Controlled-optional selection.
  const [internalSel, setInternalSel] = React.useState<string[]>([])
  const selection = selectedIds ?? internalSel
  const setSelection = React.useCallback(
    (ids: string[]) => {
      if (onSelectionChange) onSelectionChange(ids)
      else setInternalSel(ids)
    },
    [onSelectionChange]
  )

  // Controlled-optional sort.
  const [internalSort, setInternalSort] = React.useState<SortState | null>(null)
  const isSortControlled = onSortChange !== undefined
  const activeSort = isSortControlled ? sort ?? null : internalSort

  const setSort = React.useCallback(
    (next: SortState | null) => {
      if (isSortControlled) onSortChange?.(next)
      else setInternalSort(next)
    },
    [isSortControlled, onSortChange]
  )

  function toggleSort(col: DataTableColumn<T>) {
    if (!col.sortable) return
    if (activeSort?.key !== col.key) return setSort({ key: col.key, direction: "asc" })
    if (activeSort.direction === "asc") return setSort({ key: col.key, direction: "desc" })
    setSort(null) // asc → desc → none
  }

  // Client-side sort only when uncontrolled and the active column has an accessor.
  const rows = React.useMemo(() => {
    if (isSortControlled || !activeSort) return data
    const col = columns.find((c) => c.key === activeSort.key)
    if (!col?.sortAccessor) return data
    const accessor = col.sortAccessor
    const dir = activeSort.direction === "asc" ? 1 : -1
    return [...data].sort((a, b) => {
      const av = accessor(a)
      const bv = accessor(b)
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
  }, [data, columns, activeSort, isSortControlled])

  const allIds = rows.map(rowId)
  const selectedSet = React.useMemo(() => new Set(selection), [selection])
  const selectedOnPage = allIds.filter((id) => selectedSet.has(id)).length
  const allSelected = allIds.length > 0 && selectedOnPage === allIds.length
  const someSelected = selectedOnPage > 0 && !allSelected

  function toggleAll() {
    if (allSelected) {
      // Deselect the current view's ids, preserving any off-view selection.
      const pageSet = new Set(allIds)
      setSelection(selection.filter((id) => !pageSet.has(id)))
    } else {
      setSelection(Array.from(new Set([...selection, ...allIds])))
    }
  }

  function toggleRow(id: string) {
    if (selectedSet.has(id)) setSelection(selection.filter((s) => s !== id))
    else setSelection([...selection, id])
  }

  const colSpan = columns.length + (selectable ? 1 : 0)
  const showEmpty = !loading && rows.length === 0

  const scrollStyle: React.CSSProperties | undefined = maxHeight
    ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight, overflowY: "auto" }
    : undefined

  return (
    <div data-slot="data-table" className={cn("flex flex-col gap-3", className)}>
      {toolbar}
      {selectable && (
        <SelectionToolbar
          count={selection.length}
          itemNoun={selectionNoun}
          onClear={() => setSelection([])}
        >
          {bulkActions}
        </SelectionToolbar>
      )}

      <div
        className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]"
        style={scrollStyle}
      >
        <Table>
          <TableHeader
            className={cn(stickyHeader && "sticky top-0 z-10 bg-[var(--card)]")}
          >
            <TableRow className="hover:bg-transparent">
              {selectable && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={toggleAll}
                    aria-label={allSelected ? "Deselect all" : "Select all"}
                    disabled={loading || allIds.length === 0}
                  />
                </TableHead>
              )}
              {columns.map((col) => {
                const isActive = activeSort?.key === col.key
                return (
                  <TableHead
                    key={col.key}
                    className={cn(col.align && ALIGN[col.align], col.headerClassName)}
                    style={col.width ? { width: col.width } : undefined}
                    aria-sort={
                      isActive ? (activeSort!.direction === "asc" ? "ascending" : "descending") : undefined
                    }
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col)}
                        className={cn(
                          "-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 uppercase tracking-wider transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                          col.align === "right" && "flex-row-reverse",
                          isActive && "text-[var(--foreground)]"
                        )}
                      >
                        {col.header}
                        {isActive ? (
                          activeSort!.direction === "asc" ? (
                            <ChevronUp className="size-3.5" />
                          ) : (
                            <ChevronDown className="size-3.5" />
                          )
                        ) : (
                          <ChevronsUpDown className="size-3.5 opacity-40" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: skeletonRows }, (_, i) => (
                <TableRow key={`sk-${i}`} className="hover:bg-transparent">
                  {selectable && (
                    <TableCell className="w-10">
                      <Skeleton className="size-4" />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key} className={cn(col.align && ALIGN[col.align])}>
                      <Skeleton className="h-4 w-full max-w-[8rem]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : showEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={colSpan} className="p-0">
                  {empty ?? (
                    <div className="border-0 [&_[data-slot=empty-state]]:border-0 [&_[data-slot=empty-state]]:shadow-none [&_[data-slot=empty-state]]:bg-transparent">
                      <EmptyState title={emptyTitle} />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const id = rowId(row)
                const isSelected = selectedSet.has(id)
                return (
                  <TableRow
                    key={id}
                    data-state={isSelected ? "selected" : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(onRowClick && "cursor-pointer")}
                  >
                    {selectable && (
                      <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleRow(id)}
                          aria-label="Select row"
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn(col.align && ALIGN[col.align], col.className)}
                      >
                        {col.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && <Pagination {...pagination} />}
    </div>
  )
}

export { DataTable }
export type { DataTableProps, DataTableColumn, SortState, SortDirection }
