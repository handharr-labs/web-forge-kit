import * as React from "react"
import { Info } from "lucide-react"
import { cn } from "../../utils/cn"

interface NoticeProps {
  children: React.ReactNode
  className?: string
}

/** Compact single-line inline banner for reminders / status messages. */
function Notice({ children, className }: NoticeProps) {
  return (
    <div
      data-slot="notice"
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--muted)] px-4 py-2.5 text-sm text-[var(--foreground)]",
        className
      )}
    >
      <Info className="size-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden="true" />
      {children}
    </div>
  )
}

export { Notice }
export type { NoticeProps }
