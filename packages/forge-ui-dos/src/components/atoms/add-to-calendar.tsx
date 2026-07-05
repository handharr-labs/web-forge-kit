"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Button, type ButtonProps } from "./button"
import {
  googleCalendarUrl,
  icsDataUri,
  type CalendarEvent,
} from "../../utils/calendar"

/**
 * Add-to-Calendar button — a first-class wrapper over `utils/calendar`. Taps
 * open a small menu with Google Calendar and a downloadable `.ics`
 * (Apple / Outlook), so a session's "Save the Date" works everywhere.
 */
export function AddToCalendar({
  event,
  label = "Add to Calendar",
  variant = "outline",
  size = "sm",
  className,
}: {
  event: CalendarEvent
  label?: React.ReactNode
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  const itemClass =
    "block rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--surface-2)]"

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
      </Button>
      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-30 mt-2 min-w-[13rem] -translate-x-1/2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-1 text-left shadow-[var(--shadow-lg)]"
        >
          <a
            role="menuitem"
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            Google Calendar
          </a>
          <a
            role="menuitem"
            href={icsDataUri(event)}
            download={`${event.title}.ics`}
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            Apple / Outlook (.ics)
          </a>
        </div>
      )}
    </div>
  )
}
