"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { Button } from "../atoms/button"

export type RsvpValue = {
  name: string
  attendance: "attending" | "not-attending"
  guests: number
  message?: string
}

const fieldClass =
  "w-full rounded-[var(--radius)] border border-[var(--input)] bg-[var(--surface)] px-4 py-3 font-[var(--font-body)] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"

const labelClass = "typo-eyebrow mb-2 block !tracking-[0.2em] text-[var(--foreground-soft)]"

/**
 * RSVP form. Controlled-optional: pass `defaultName` from the guest link to
 * pre-fill. Calls `onSubmit` with the collected value; the host persists it.
 * Shows an inline confirmation state on success.
 */
export function RsvpForm({
  defaultName = "",
  onSubmit,
  className,
}: {
  defaultName?: string
  onSubmit?: (value: RsvpValue) => Promise<void> | void
  className?: string
}) {
  const [name, setName] = React.useState(defaultName)
  const [attendance, setAttendance] = React.useState<RsvpValue["attendance"]>("attending")
  const [guests, setGuests] = React.useState(1)
  const [message, setMessage] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [done, setDone] = React.useState(false)

  React.useEffect(() => setName(defaultName), [defaultName])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await onSubmit?.({ name: name.trim(), attendance, guests, message: message.trim() || undefined })
      setDone(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <Reveal
        className={cn(
          "rounded-[var(--radius-lg)] border border-[var(--primary)]/30 bg-[var(--primary-soft)] p-8 text-center",
          className
        )}
      >
        <p className="typo-display text-2xl text-[var(--primary-deep)]">Terima kasih 🤍</p>
        <p className="typo-body mt-2 text-sm">
          Your response has been recorded. You can revisit this link to update it.
        </p>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => setDone(false)}>
          Edit response
        </Button>
      </Reveal>
    )
  }

  return (
    <Reveal
      as="form"
      onSubmit={handleSubmit}
      className={cn(
        "space-y-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)] sm:p-8",
        className
      )}
    >
      <div>
        <label className={labelClass} htmlFor="mekar-rsvp-name">Nama</label>
        <input
          id="mekar-rsvp-name"
          className={fieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama lengkap"
          required
        />
      </div>

      <div>
        <span className={labelClass}>Kehadiran</span>
        <div className="grid grid-cols-2 gap-3">
          {([
            ["attending", "Hadir"],
            ["not-attending", "Berhalangan"],
          ] as const).map(([value, label]) => {
            const active = attendance === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setAttendance(value)}
                aria-pressed={active}
                className={cn(
                  "rounded-[var(--radius)] border px-4 py-3 text-sm uppercase tracking-[0.15em] transition-all",
                  active
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-sm)]"
                    : "border-[var(--input)] bg-[var(--surface)] text-[var(--foreground-soft)] hover:border-[var(--primary)]"
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {attendance === "attending" && (
        <div>
          <label className={labelClass} htmlFor="mekar-rsvp-guests">Jumlah Tamu</label>
          <input
            id="mekar-rsvp-guests"
            type="number"
            min={1}
            max={10}
            className={fieldClass}
            value={guests}
            onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="mekar-rsvp-message">Ucapan &amp; Doa</label>
        <textarea
          id="mekar-rsvp-message"
          className={cn(fieldClass, "min-h-28 resize-y")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan untuk mempelai…"
        />
      </div>

      <Button type="submit" variant="solid" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Sending…" : "Kirim RSVP"}
      </Button>
    </Reveal>
  )
}
