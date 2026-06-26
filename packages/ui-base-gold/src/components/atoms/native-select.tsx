import * as React from "react"
import { cn } from "../../utils/cn"

/**
 * Styled native `<select>`. A lightweight, robust alternative to the base-ui
 * {@link Select} for simple filters and form pickers. Pass `<option>` children.
 */
function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        "h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-colors focus-visible:border-[var(--ring)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { NativeSelect }
