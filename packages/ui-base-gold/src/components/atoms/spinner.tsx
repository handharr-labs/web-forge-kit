import * as React from "react"
import { cn } from "../../utils/cn"

interface SpinnerProps {
  size?: "sm" | "default" | "lg"
  page?: boolean
  className?: string
}

const sizeMap: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm:      "h-4 w-4",
  default: "h-6 w-6",
  lg:      "h-10 w-10",
}

// Gold tier's primary loading pattern is Skeleton (per-component).
// Spinner is for full-page / navigation loading contexts.
// Two simultaneous CSS animations (rotate + arc breathe) produce the
// Material Design indeterminate style — arc length pulses as the ring spins.
// Keyframes are defined in tokens/globals.css.
function Spinner({ size = "default", page = false, className }: SpinnerProps) {
  const arc = (
    <svg
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      viewBox="0 0 50 50"
      className={cn(sizeMap[size], className)}
      style={{ animation: "gold-spinner-rotate 1.4s linear infinite" }}
    >
      <circle
        cx="25" cy="25" r="20"
        fill="none"
        strokeWidth="4.5"
        strokeLinecap="round"
        className="stroke-[var(--primary)]"
        style={{ animation: "gold-spinner-arc 1.4s ease-in-out infinite" }}
      />
    </svg>
  )

  if (page) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80">
        {arc}
      </div>
    )
  }

  return arc
}

export { Spinner }
export type { SpinnerProps }
