"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { buttonVariants } from "../atoms/button"
import { AddToCalendar } from "../atoms/add-to-calendar"
import { OrnamentDivider } from "../atoms/ornament"
import { type CalendarEvent } from "../../utils/calendar"

export type EventSession = {
  /** e.g. "Akad Nikah", "Resepsi". */
  title: string
  /** Date line, e.g. "Sabtu, 12 Desember 2026". */
  dateLabel: string
  /** Time line, e.g. "08.00 – 10.00 WIB". */
  timeLabel?: string
  venueName: string
  address?: string
  /** Google Maps link (shows a "Buka Peta" button). */
  mapsUrl?: string
  /** Populate to show an "Add to Calendar" button. */
  calendar?: CalendarEvent
  mapsLabel?: string
  calendarLabel?: string
}

/** One ceremony session — date, time, venue, and map / calendar actions. */
export function EventCard({
  session,
  className,
}: {
  session: EventSession
  className?: string
}) {
  return (
    <Reveal
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-md)] sm:p-8",
        className
      )}
    >
      <h3 className="typo-display text-2xl text-[var(--foreground)]">{session.title}</h3>
      <OrnamentDivider className="my-4" />
      <p className="typo-lead">{session.dateLabel}</p>
      {session.timeLabel && <p className="typo-body mt-1 text-sm">{session.timeLabel}</p>}
      <p className="typo-title mt-5 !text-xl">{session.venueName}</p>
      {session.address && <p className="typo-caption mx-auto mt-2 max-w-xs">{session.address}</p>}

      {(session.mapsUrl || session.calendar) && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {session.mapsUrl && (
            <a
              href={session.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {session.mapsLabel ?? "Buka Peta"}
            </a>
          )}
          {session.calendar && (
            <AddToCalendar
              event={session.calendar}
              variant="ghost"
              size="sm"
              label={session.calendarLabel ?? "+ Kalender"}
            />
          )}
        </div>
      )}
    </Reveal>
  )
}

/** Stacked ceremony sessions (Akad, Resepsi, …). */
export function EventDetails({
  sessions,
  className,
}: {
  sessions: EventSession[]
  className?: string
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {sessions.map((s, i) => (
        <EventCard key={`${s.title}-${i}`} session={s} />
      ))}
    </div>
  )
}
