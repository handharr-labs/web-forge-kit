import * as React from "react"

import { cn } from "../../utils/cn"

interface LabelProps extends React.ComponentProps<"label"> {
  required?: boolean
}

function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "typo-label text-[var(--foreground)] cursor-default select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden className="ml-0.5 text-[var(--destructive)]">*</span>
      )}
    </label>
  )
}

export { Label }
export type { LabelProps }
