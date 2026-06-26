"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../utils/cn"

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const

interface ModalProps {
  /** When provided and false, renders nothing. Omit to let the parent control mounting. */
  open?: boolean
  title?: React.ReactNode
  onClose: () => void
  children: React.ReactNode
  /** Right-aligned footer actions (typically buttons). */
  footer?: React.ReactNode
  size?: keyof typeof SIZES
  role?: "dialog" | "alertdialog"
  /** Show the header close affordance. Defaults to true for dialogs, false for alertdialogs. */
  showClose?: boolean
  closeLabel?: string
  className?: string
}

/**
 * Overlay dialog shell: a blurred scrim with a centered, elevated panel that
 * fades and scales in. Closes on scrim click and Escape.
 */
function Modal({
  open = true,
  title,
  onClose,
  children,
  footer,
  size = "md",
  role = "dialog",
  showClose,
  closeLabel = "Close",
  className,
}: ModalProps) {
  React.useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const withClose = showClose ?? role === "dialog"

  return (
    <div
      data-slot="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <div
        role={role}
        aria-modal="true"
        data-slot="modal"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "flex max-h-[90vh] w-full flex-col overflow-y-auto rounded-2xl bg-[var(--background)] p-5 shadow-[var(--shadow-lg)] ring-1 ring-[var(--border)] animate-in fade-in-0 zoom-in-95 duration-200",
          SIZES[size],
          className
        )}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="typo-card-title font-bold">{title}</span>
            {withClose && (
              <button
                type="button"
                aria-label={closeLabel}
                className="-mr-1 rounded-lg p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                onClick={onClose}
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        )}
        {children}
        {footer && <div className="mt-5 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}

export { Modal }
export type { ModalProps }
