"use client"

import * as React from "react"
import { ToggleGroup } from "@base-ui/react/toggle-group"
import { Toggle } from "@base-ui/react/toggle"

import { cn } from "../../utils/cn"

interface SegmentedOption {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

interface SegmentedControlProps {
  options: SegmentedOption[]
  /** Controlled value; omit (with `defaultValue`) to self-manage. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  size?: "sm" | "default"
  className?: string
  "aria-label"?: string
}

/**
 * Single-select segmented enum picker (day/night, layout single·split). Wraps
 * Base UI `ToggleGroup` to expose a single-string value; the segment can't be
 * toggled off to empty (a selection is always kept).
 */
function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  size = "default",
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps) {
  return (
    <ToggleGroup
      aria-label={ariaLabel}
      value={value !== undefined ? [value] : undefined}
      defaultValue={defaultValue !== undefined ? [defaultValue] : undefined}
      onValueChange={(groupValue) => {
        const next = groupValue[0]
        if (next != null) onValueChange?.(String(next)) // ignore deselect-to-empty
      }}
      disabled={disabled}
      data-slot="segmented-control"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-0.5",
        className
      )}
    >
      {options.map((opt) => (
        <Toggle
          key={opt.value}
          value={opt.value}
          disabled={opt.disabled}
          data-slot="segmented-item"
          className={cn(
            "inline-flex items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap text-[var(--muted-foreground)] outline-none transition-all duration-200 select-none hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 data-pressed:bg-[var(--background)] data-pressed:text-[var(--foreground)] data-pressed:shadow-[var(--shadow-sm)] [&_svg]:size-4 [&_svg]:shrink-0",
            size === "sm" ? "h-6 px-2 text-xs" : "h-7 px-2.5 text-sm"
          )}
        >
          {opt.icon}
          {opt.label}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}

export { SegmentedControl }
export type { SegmentedControlProps, SegmentedOption }
