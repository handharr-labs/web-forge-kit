"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { Button } from "../atoms/button"

export type GuestMessage = {
  name: string
  message: string
  createdAt?: string | Date
}

const fieldClass =
  "w-full rounded-[var(--radius)] border border-[var(--input)] bg-[var(--surface)] px-4 py-3 font-[var(--font-body)] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"

/**
 * Guestbook — "Doa & Ucapan". A submit form over a scrolling feed of wishes.
 * Controlled-optional: pass `messages` (the persisted feed) and `onSubmit`; a
 * newly sent message is optimistically prepended so it appears immediately.
 */
export function Guestbook({
  messages = [],
  onSubmit,
  defaultName = "",
  maxHeight = "26rem",
  className,
}: {
  messages?: GuestMessage[]
  onSubmit?: (m: GuestMessage) => Promise<void> | void
  defaultName?: string
  /** Scroll cap for the feed. */
  maxHeight?: string
  className?: string
}) {
  const [name, setName] = React.useState(defaultName)
  const [message, setMessage] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [local, setLocal] = React.useState<GuestMessage[]>([])

  React.useEffect(() => setName(defaultName), [defaultName])

  const feed = [...local, ...messages]

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    const entry: GuestMessage = {
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date(),
    }
    setSubmitting(true)
    try {
      await onSubmit?.(entry)
      setLocal((l) => [entry, ...l])
      setMessage("")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Reveal
        as="form"
        onSubmit={submit}
        className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]"
      >
        <input
          className={fieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama"
          aria-label="Nama"
          required
        />
        <textarea
          className={cn(fieldClass, "min-h-24 resize-y")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Kirim doa &amp; ucapan…"
          aria-label="Ucapan"
          required
        />
        <Button type="submit" variant="solid" size="sm" className="w-full" disabled={submitting}>
          {submitting ? "Sending…" : "Kirim Ucapan"}
        </Button>
      </Reveal>

      <div className="space-y-3 overflow-y-auto pr-1" style={{ maxHeight }}>
        {feed.length === 0 && (
          <p className="typo-caption py-6 text-center">Jadilah yang pertama mengirim ucapan.</p>
        )}
        {feed.map((m, i) => (
          <div
            key={i}
            className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="font-[var(--font-display)] text-lg text-[var(--foreground)]">{m.name}</p>
            <p className="typo-body mt-1 text-sm">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
