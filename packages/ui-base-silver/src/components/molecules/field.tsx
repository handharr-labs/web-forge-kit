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

function Field({
  label,
  htmlFor,
  description,
  error,
  required,
  children,
  className,
}: FieldProps) {
  return (
    <div
      data-slot="field"
      className={cn("flex flex-col gap-1.5", className)}
    >
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error ? (
        <p className="typo-caption text-[var(--destructive)]">{error}</p>
      ) : description ? (
        <p className="typo-caption text-[var(--muted-foreground)]">{description}</p>
      ) : null}
    </div>
  )
}

export { Field }
export type { FieldProps }
