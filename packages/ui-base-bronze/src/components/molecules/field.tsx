import * as React from "react"
import { Label } from "../atoms/label"
import { cn } from "../../utils/cn"

interface FieldProps {
  label?: string
  htmlFor?: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

function Field({ label, htmlFor, description, error, required, children, className }: FieldProps) {
  return (
    <div data-slot="field" className={cn("flex items-start gap-4", className)}>
      {label && (
        <Label
          htmlFor={htmlFor}
          required={required}
          className="w-24 shrink-0 pt-2 text-right"
        >
          {label}
        </Label>
      )}
      <div className="flex flex-1 flex-col gap-1">
        {children}
        {error ? (
          <p className="typo-caption text-[var(--destructive)]">{error}</p>
        ) : description ? (
          <p className="typo-caption text-[var(--muted-foreground)]">{description}</p>
        ) : null}
      </div>
    </div>
  )
}

export { Field }
export type { FieldProps }
