"use client"

import * as React from "react"
import { Button } from "../atoms/button"

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  previousLabel?: string
  nextLabel?: string
}

/** Numbered pagination with previous/next. Renders nothing for a single page. */
function Pagination({
  page,
  pageCount,
  onPageChange,
  previousLabel = "Previous",
  nextLabel = "Next",
}: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <div
      data-slot="pagination"
      className="flex flex-wrap items-center justify-center gap-1 pt-2"
    >
      <Button size="sm" variant="ghost" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        {previousLabel}
      </Button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <Button
          key={n}
          size="sm"
          variant={n === page ? "default" : "ghost"}
          onClick={() => onPageChange(n)}
        >
          {n}
        </Button>
      ))}
      <Button
        size="sm"
        variant="ghost"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        {nextLabel}
      </Button>
    </div>
  )
}

export { Pagination }
export type { PaginationProps }
