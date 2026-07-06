"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "../../utils/cn"

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-xl",
} as const

interface DrawerProps {
  /** When provided and false, the drawer slides out and unmounts. */
  open?: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  /** Right-aligned footer actions (typically buttons). */
  footer?: React.ReactNode
  side?: "right" | "left"
  size?: keyof typeof SIZES
  showClose?: boolean
  closeLabel?: string
  className?: string
}

/**
 * Slide-over edit surface: a blurred scrim with a full-height panel anchored to
 * a side. Preferred over `Modal` for longer forms (e.g. per-section config
 * editing). Closes on scrim click and Escape.
 */
function Drawer({
  open = true,
  onClose,
  title,
  children,
  footer,
  side = "right",
  size = "md",
  showClose = true,
  closeLabel = "Close",
  className,
}: DrawerProps) {
  // Mount immediately, then flip to the on-screen transform next frame so the
  // transition runs (matches the Sidebar's off-canvas technique).
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setShown(false)
      return
    }
    const id = requestAnimationFrame(() => setShown(true))
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      cancelAnimationFrame(id)
      document.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const offscreen = side === "right" ? "translate-x-full" : "-translate-x-full"

  return (
    <div
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm transition-opacity duration-300",
        side === "left" ? "justify-start" : "justify-end",
        shown ? "opacity-100" : "opacity-0"
      )}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        data-slot="drawer"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "flex h-full w-full flex-col bg-[var(--background)] shadow-[var(--shadow-lg)] ring-1 ring-[var(--border)] transition-transform duration-300 ease-out",
          SIZES[size],
          shown ? "translate-x-0" : offscreen,
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
            <span className="typo-card-title font-bold">{title}</span>
            {showClose && (
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
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-[var(--border)] px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  )
}

export { Drawer }
export type { DrawerProps }
