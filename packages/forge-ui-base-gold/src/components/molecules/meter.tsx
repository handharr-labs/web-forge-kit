"use client"

import * as React from "react"
import { Meter as MeterPrimitive } from "@base-ui/react/meter"

import { cn } from "../../utils/cn"

interface MeterProps {
  /** Current measurement (e.g. attending count). */
  value: number
  min?: number
  max?: number
  label?: React.ReactNode
  /** Show a value readout in the label row. */
  showValue?: boolean
  /** Custom readout — defaults to the formatted percentage. */
  renderValue?: (value: number, max: number) => React.ReactNode
  className?: string
}

/**
 * Static gauge for a measured value within a range — e.g. attending vs.
 * capacity. Unlike `Progress`, a meter represents a fixed quantity, not task
 * completion.
 */
function Meter({
  value,
  min = 0,
  max = 100,
  label,
  showValue = false,
  renderValue,
  className,
}: MeterProps) {
  return (
    <MeterPrimitive.Root
      value={value}
      min={min}
      max={max}
      data-slot="meter"
      className={cn("flex w-full flex-col gap-1.5", className)}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <MeterPrimitive.Label className="text-sm font-medium">{label}</MeterPrimitive.Label>}
          {showValue &&
            (renderValue ? (
              <span className="text-sm text-[var(--muted-foreground)] tabular-nums">{renderValue(value, max)}</span>
            ) : (
              <MeterPrimitive.Value className="text-sm text-[var(--muted-foreground)] tabular-nums" />
            ))}
        </div>
      )}
      <MeterPrimitive.Track className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <MeterPrimitive.Indicator className="h-full rounded-full bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] transition-all duration-500 ease-out" />
      </MeterPrimitive.Track>
    </MeterPrimitive.Root>
  )
}

export { Meter }
export type { MeterProps }
