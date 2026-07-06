"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "../../utils/cn"

interface SliderProps {
  /** Controlled value; omit (with `defaultValue`) to self-manage. */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: React.ReactNode
  /** Show the current value at the end of the label row. */
  showValue?: boolean
  formatValue?: (value: number) => string
  disabled?: boolean
  className?: string
  "aria-label"?: string
}

/** Scalar dial (e.g. a fine `--*-hue` degree knob). Single thumb. */
function Slider({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  formatValue,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => onValueChange?.(Array.isArray(v) ? v[0] : v)}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      data-slot="slider"
      className={cn("flex w-full flex-col gap-2", className)}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <SliderPrimitive.Label className="text-sm font-medium">{label}</SliderPrimitive.Label>}
          {showValue && (
            <SliderPrimitive.Value className="text-sm text-[var(--muted-foreground)] tabular-nums">
              {formatValue ? (_formatted, values) => formatValue(values[0]) : undefined}
            </SliderPrimitive.Value>
          )}
        </div>
      )}
      <SliderPrimitive.Control
        aria-label={ariaLabel}
        className="flex h-5 w-full items-center py-2 select-none"
      >
        <SliderPrimitive.Track className="h-1.5 w-full rounded-full bg-[var(--muted)] select-none">
          <SliderPrimitive.Indicator className="rounded-full bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] select-none" />
          <SliderPrimitive.Thumb className="size-4 rounded-full border-2 border-[var(--primary)] bg-[var(--background)] shadow-[var(--shadow-sm)] outline-none transition-transform focus-visible:ring-3 focus-visible:ring-[var(--ring)]/40 data-dragging:scale-110 disabled:opacity-50" />
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
export type { SliderProps }
