import * as React from "react"
import { cn } from "../../utils/cn"

interface DetailRowProps {
  label: React.ReactNode
  value: React.ReactNode
  className?: string
  valueClassName?: string
}

/** A label (muted, left) / value (medium, right) row — for summaries & detail lists. */
function DetailRow({ label, value, className, valueClassName }: DetailRowProps) {
  return (
    <div
      data-slot="detail-row"
      className={cn("flex items-center justify-between gap-4 text-sm", className)}
    >
      <span className="text-[var(--muted-foreground)]">{label}</span>
      <span className={cn("font-medium text-[var(--foreground)]", valueClassName)}>{value}</span>
    </div>
  )
}

export { DetailRow }
export type { DetailRowProps }
