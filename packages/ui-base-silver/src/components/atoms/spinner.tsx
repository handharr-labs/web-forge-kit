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

// viewBox 50×50, circle r=20, circumference ≈ 125.66
// dasharray "94 32" → ~75% arc + gap completing one full revolution
function Spinner({ size = "default", page = false, className }: SpinnerProps) {
  const arc = (
    <svg
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      viewBox="0 0 50 50"
      className={cn("animate-spin", sizeMap[size], className)}
    >
      <circle
        cx="25" cy="25" r="20"
        fill="none"
        strokeWidth="4"
        className="stroke-[var(--border)]"
      />
      <circle
        cx="25" cy="25" r="20"
        fill="none"
        strokeWidth="4"
        strokeDasharray="94 32"
        strokeLinecap="round"
        transform="rotate(-90 25 25)"
        className="stroke-[var(--primary)]"
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
