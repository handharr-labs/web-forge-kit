"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "../../utils/cn"

interface ProgressProps {
  /** Current value; `null` renders an indeterminate bar. */
  value: number | null
  min?: number
  max?: number
  label?: React.ReactNode
  /** Show the percentage at the end of the label row. */
  showValue?: boolean
  format?: Intl.NumberFormatOptions
  className?: string
}

/** Determinate/indeterminate progress bar — e.g. RSVP completion. */
function Progress({
  value,
  min = 0,
  max = 100,
  label,
  showValue = false,
  format,
  className,
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      value={value}
      min={min}
      max={max}
      format={format}
      data-slot="progress"
      className={cn("flex w-full flex-col gap-1.5", className)}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <ProgressPrimitive.Label className="text-sm font-medium">{label}</ProgressPrimitive.Label>}
          {showValue && (
            <ProgressPrimitive.Value className="text-sm text-[var(--muted-foreground)] tabular-nums" />
          )}
        </div>
      )}
      <ProgressPrimitive.Track className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <ProgressPrimitive.Indicator className="h-full rounded-full bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] transition-all duration-500 ease-out data-[indeterminate]:w-2/5 data-[indeterminate]:animate-pulse" />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
export type { ProgressProps }
