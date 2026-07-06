"use client"

import * as React from "react"

import { cn } from "../../utils/cn"

interface FormFooterProps {
  /** Right-aligned actions (typically Save/Cancel buttons). */
  children: React.ReactNode
  /** Left-aligned content — a dirty-state hint, error summary, etc. */
  info?: React.ReactNode
  /** Stick to the bottom of the scroll container (long editor forms). */
  sticky?: boolean
  className?: string
}

/**
 * Action bar for a form — Save/Cancel on the right, optional status on the
 * left. `sticky` pins it to the bottom of a scrolling editor.
 */
function FormFooter({ children, info, sticky = false, className }: FormFooterProps) {
  return (
    <div
      data-slot="form-footer"
      className={cn(
        "flex items-center justify-between gap-4 border-t border-[var(--border)] bg-[var(--background)] py-3",
        sticky && "sticky bottom-0 z-10 -mx-4 px-4 backdrop-blur-sm sm:-mx-6 sm:px-6",
        className
      )}
    >
      <div className="min-w-0 text-sm text-[var(--muted-foreground)]">{info}</div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  )
}

export { FormFooter }
export type { FormFooterProps }
