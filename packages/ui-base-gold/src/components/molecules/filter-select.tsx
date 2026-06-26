"use client"

import * as React from "react"
import { NativeSelect } from "../atoms/native-select"

interface FilterOption {
  value: string
  label: string
}

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  allLabel: string
  options: FilterOption[]
  className?: string
}

/** A native select pre-seeded with an "all" option, for list filtering. */
function FilterSelect({ value, onChange, allLabel, options, className }: FilterSelectProps) {
  return (
    <NativeSelect
      data-slot="filter-select"
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{allLabel}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </NativeSelect>
  )
}

export { FilterSelect }
export type { FilterSelectProps, FilterOption }
