import * as React from "react"
import { cn } from "../../utils/cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus-visible:border-[var(--ring)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 aria-invalid:border-[var(--destructive)] aria-invalid:ring-3 aria-invalid:ring-[var(--destructive)]/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
