"use client"

import * as React from "react"
import { Input } from "../atoms/input"
import { Textarea } from "../atoms/textarea"
import { Select } from "../atoms/select"

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
  const isSelectChild = React.isValidElement(children) && children.type === Select

  // Floating label applies to Input, Textarea, and Select (controlled dropdown).
  const supportsFloating =
    React.isValidElement(children) &&
    (children.type === Input || children.type === Textarea || isSelectChild)

  // Select: track open state via onOpenChange; value derived from props.
  const [isSelectOpen, setIsSelectOpen] = React.useState(false)
  const selectPropValue = isSelectChild
    ? (children as React.ReactElement<{ value?: string }>).props.value
    : undefined
  const selectIsFloating = isSelectOpen || Boolean(selectPropValue)

  // A real placeholder is visible content, so the label must float out of its
  // way even while empty/unfocused — an empty input with a placeholder still
  // matches `:placeholder-shown`, which would otherwise keep the label centered
  // on top of the placeholder text. (The injected " " placeholder doesn't count.)
  const childPlaceholder = React.isValidElement(children)
    ? (children.props as { placeholder?: string }).placeholder
    : undefined
  const hasRealPlaceholder =
    typeof childPlaceholder === "string" && childPlaceholder.trim().length > 0

  return (
    <div data-slot="field" className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        supportsFloating ? (
          // ── Floating label (Input / Textarea / Select) ────────────────────
          <div
            className="relative"
            {...(isSelectChild ? { "data-floating-select": "", "data-select-floating": selectIsFloating ? "true" : "false" } : {})}
          >
            {isSelectChild
              ? // Select: inject onOpenChange to track open state
                React.cloneElement(
                  children as React.ReactElement<{ onOpenChange?: (open: boolean) => void }>,
                  {
                    onOpenChange: (open: boolean) => {
                      setIsSelectOpen(open)
                      ;(children as React.ReactElement<{ onOpenChange?: (open: boolean) => void }>)
                        .props.onOpenChange?.(open)
                    },
                  }
                )
              : // Input / Textarea: add `peer` + `pt-5`; CSS drives floating via :placeholder-shown
                React.cloneElement(
                  children as React.ReactElement<{ className?: string; placeholder?: string }>,
                  {
                    className: cn(
                      // Top padding sets the floated-label→value gap. Input gets a
                      // taller box (h-14) for balance; Textarea keeps its min-height
                      // but needs extra top padding so the floated label clears its
                      // first line of text (pt-5 was too tight).
                      "peer",
                      (children as React.ReactElement).type === Input && "h-14 pt-5",
                      (children as React.ReactElement).type === Textarea && "pt-7",
                      (children as React.ReactElement<{ className?: string }>).props.className
                    ),
                    // Ensure a placeholder exists so :placeholder-shown pseudo-class works.
                    // A space is invisible but keeps the mechanism active.
                    placeholder:
                      (children as React.ReactElement<{ placeholder?: string }>).props.placeholder
                      ?? " ",
                  }
                )
            }
            {/* Plain <label> avoids typo-label whose scoped selector beats Tailwind utilities */}
            <label
              htmlFor={htmlFor}
              className={cn(
                "pointer-events-none absolute left-3 select-none cursor-default transition-all duration-150",
                isSelectChild
                  ? // Select: JS-controlled positioning
                    selectIsFloating
                      ? "top-1.5 font-semibold text-[var(--ring)]"
                      : "top-1/2 -translate-y-1/2 font-normal text-[var(--muted-foreground)]"
                  : hasRealPlaceholder
                    ? // A visible placeholder keeps the label permanently floated,
                      // matching the has-value look (empty still matches
                      // :placeholder-shown, so the peer rules can't float it).
                      "top-2.5 translate-y-0 font-semibold text-[0.625rem] text-[var(--ring)]"
                    : // Input / Textarea: CSS peer-driven via :placeholder-shown + :focus
                      cn(
                        // Default: label centered (acts as placeholder)
                        "top-1/2 -translate-y-1/2 font-normal text-[var(--muted-foreground)] text-sm",
                        // Floated via focus
                        "peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:font-semibold peer-focus:text-[0.625rem] peer-focus:text-[var(--ring)]",
                        // Floated when input has value (placeholder not visible)
                        "peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-[0.625rem] peer-[:not(:placeholder-shown)]:text-[var(--ring)]",
                      )
              )}
              style={isSelectChild
                ? { fontSize: selectIsFloating ? "0.625rem" : "0.875rem" }
                : undefined
              }
            >
              {label}
              {required && (
                <span aria-hidden className="ml-0.5 text-[var(--destructive)]">*</span>
              )}
            </label>
          </div>
        ) : (
          // ── Mini label (RadioGroup, Checkbox, etc.) ───────────────────────
          // Visually matches the permanently-floated state so all Gold labels align.
          <>
            <label
              htmlFor={htmlFor}
              className="cursor-default select-none font-semibold text-[var(--muted-foreground)]"
              style={{ fontSize: "0.625rem" }}
            >
              {label}
              {required && (
                <span aria-hidden className="ml-0.5 text-[var(--destructive)]">*</span>
              )}
            </label>
            {children}
          </>
        )
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
