"use client"

import * as React from "react"

import { cn } from "../../utils/cn"

interface FormSectionProps {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Right-aligned header control (e.g. an add button or enable switch). */
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/**
 * Groups related fields within a long form: a titled header (optional
 * description + action) over a vertical stack of fields. Renders as a
 * `fieldset` for grouping semantics.
 */
function FormSection({ title, description, action, children, className }: FormSectionProps) {
  return (
    <fieldset data-slot="form-section" className={cn("flex flex-col gap-4", className)}>
      {(title || description || action) && (
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            {title && <legend className="typo-card-title font-semibold">{title}</legend>}
            {description && <p className="text-sm text-[var(--muted-foreground)]">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="flex flex-col gap-4">{children}</div>
    </fieldset>
  )
}

export { FormSection }
export type { FormSectionProps }
