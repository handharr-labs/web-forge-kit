import * as React from "react"
import { cn } from "../../utils/cn"

interface SpinnerProps {
  size?: "sm" | "default" | "lg"
  page?: boolean
  className?: string
}

const sizeMap: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm:      "h-4 w-4 border-2",
  default: "h-6 w-6 border-2",
  lg:      "h-10 w-10 border-[3px]",
}

function Spinner({ size = "default", page = false, className }: SpinnerProps) {
  const circle = (
    <div
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      className={cn(
        "rounded-full animate-spin border-[var(--muted)] border-t-[var(--primary)]",
        sizeMap[size],
        className
      )}
    />
  )

  if (page) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80">
        {circle}
      </div>
    )
  }

  return circle
}

export { Spinner }
export type { SpinnerProps }
