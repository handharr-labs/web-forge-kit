"use client"

import * as React from "react"
import { SearchBar } from "./search-bar"
import { FilterSelect, type FilterOption } from "./filter-select"

interface FilterBarSearch {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
}

interface FilterBarFilter {
  value: string
  onChange: (value: string) => void
  allLabel: string
  options: FilterOption[]
}

interface FilterBarProps {
  search: FilterBarSearch
  filters: FilterBarFilter[]
  /** When provided, a Reset link appears once any control is non-empty. */
  onReset?: () => void
  /** Trailing slot pushed to the far right, e.g. a primary action. */
  trailing?: React.ReactNode
  className?: string
}

/**
 * Search + filter-select row for listing pages. The Reset link only shows when
 * `onReset` is given and at least one control holds a value.
 */
function FilterBar({ search, filters, onReset, trailing, className }: FilterBarProps) {
  const hasFilters = search.value !== "" || filters.some((f) => f.value !== "")

  return (
    <div
      data-slot="filter-bar"
      className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}
    >
      <SearchBar
        value={search.value}
        onChange={search.onChange}
        placeholder={search.placeholder}
        className={search.className ?? "w-full sm:w-72"}
      />
      {filters.map((f, i) => (
        <FilterSelect
          key={i}
          value={f.value}
          onChange={f.onChange}
          allLabel={f.allLabel}
          options={f.options}
        />
      ))}
      {onReset && hasFilters && (
        <button
          type="button"
          className="typo-label text-[var(--primary)] hover:underline"
          onClick={onReset}
        >
          Reset
        </button>
      )}
      {trailing && <div className="ml-auto">{trailing}</div>}
    </div>
  )
}

export { FilterBar }
export type { FilterBarProps, FilterBarSearch, FilterBarFilter }
