"use client"

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
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)
  const isFloating = isFocused || hasValue

  const handleFocusCapture = () => setIsFocused(true)
  const handleBlurCapture = (e: React.FocusEvent) => {
    setIsFocused(false)
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    if ("value" in target) setHasValue(Boolean(target.value))
  }
  const handleChangeCapture = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    if ("value" in target) setHasValue(Boolean(target.value))
  }

  return (
    <div data-slot="field" className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <div
          className="relative"
          onFocusCapture={handleFocusCapture}
          onBlurCapture={handleBlurCapture}
          onChangeCapture={handleChangeCapture}
        >
          {React.isValidElement(children)
            ? React.cloneElement(children as React.ReactElement<{ className?: string }>, {
                className: cn(
                  "pt-5",
                  (children as React.ReactElement<{ className?: string }>).props.className
                ),
              })
            : children}
          <Label
            htmlFor={htmlFor}
            required={required}
            className={cn(
              "pointer-events-none absolute left-3 select-none transition-all duration-150",
              isFloating
                ? "top-1.5 text-[0.625rem] font-semibold text-[var(--ring)]"
                : "top-1/2 -translate-y-1/2 text-sm font-normal text-[var(--muted-foreground)]"
            )}
          >
            {label}
          </Label>
        </div>
      ) : (
        children
      )}
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
