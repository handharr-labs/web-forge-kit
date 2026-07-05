// Add-to-calendar link builders. No dependencies — pure string construction so
// the DS stays free of feature logic; the host wires these into event cards.

export type CalendarEvent = {
  title: string
  /** Event start (Date or ISO/parseable string). */
  start: Date | string
  /** Event end. Defaults to start + 2h when omitted. */
  end?: Date | string
  /** Longer description shown in the calendar entry. */
  details?: string
  /** Venue / address line. */
  location?: string
}

function toDate(v: Date | string): Date {
  return v instanceof Date ? v : new Date(v)
}

/** UTC basic format required by Google Calendar + iCalendar: YYYYMMDDTHHMMSSZ. */
function fmt(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

function resolveRange(e: CalendarEvent): { start: Date; end: Date } {
  const start = toDate(e.start)
  const end = e.end ? toDate(e.end) : new Date(start.getTime() + 2 * 3600 * 1000)
  return { start, end }
}

/** Google Calendar "add event" URL. Open in a new tab. */
export function googleCalendarUrl(e: CalendarEvent): string {
  const { start, end } = resolveRange(e)
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${fmt(start)}/${fmt(end)}`,
  })
  if (e.details) params.set("details", e.details)
  if (e.location) params.set("location", e.location)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** A `data:text/calendar` URI for a downloadable .ics (Apple/Outlook). */
export function icsDataUri(e: CalendarEvent): string {
  const { start, end } = resolveRange(e)
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//mekar//wedding//EN",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${e.title}`,
    e.location ? `LOCATION:${e.location}` : "",
    e.details ? `DESCRIPTION:${e.details}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean)
  return `data:text/calendar;charset=utf8,${encodeURIComponent(lines.join("\r\n"))}`
}
