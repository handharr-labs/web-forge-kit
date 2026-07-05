"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { Button } from "../atoms/button"
import { EmptyState } from "../atoms/empty-state"
import { SubmissionFeed } from "./submission-feed"

export type GuestMessage = {
  name: string
  message: string
  createdAt?: string | Date
  /** When provided, shows a Hadir / Tidak Hadir attendance badge. */
  attending?: boolean
}

/** Compact Indonesian relative time, e.g. "baru saja", "5 menit lalu". */
function relTime(v?: string | Date): string | null {
  if (!v) return null
  const d = v instanceof Date ? v : new Date(v)
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (!Number.isFinite(s) || s < 0) return null
  if (s < 60) return "baru saja"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} menit lalu`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} jam lalu`
  const days = Math.floor(h / 24)
  if (days < 30) return `${days} hari lalu`
  return d.toLocaleDateString()
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

  React.useEffect(() => setName(defaultName), [defaultName])

  return (
    <SubmissionFeed<GuestMessage>
      items={messages}
      maxHeight={maxHeight}
      gap="0.75rem"
      className={className}
      empty={<EmptyState icon="🤍">Jadilah yang pertama mengirim ucapan.</EmptyState>}
      form={({ submit, submitting }) => (
        <Reveal
          as="form"
          onSubmit={async (e: React.FormEvent) => {
            e.preventDefault()
            if (!name.trim() || !message.trim()) return
            const entry: GuestMessage = {
              name: name.trim(),
              message: message.trim(),
              createdAt: new Date(),
            }
            await submit(entry, () => onSubmit?.(entry))
            setMessage("")
          }}
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
      )}
      renderItem={(m, i) => {
        const when = relTime(m.createdAt)
        return (
          <div
            key={i}
            className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-[var(--font-display)] text-lg text-[var(--foreground)]">{m.name}</p>
              {m.attending != null && (
                <span
                  className={cn(
                    "shrink-0 rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.12em]",
                    m.attending
                      ? "bg-[var(--primary-soft)] text-[var(--primary-deep)]"
                      : "bg-[var(--surface-2)] text-[var(--muted-foreground)]"
                  )}
                >
                  {m.attending ? "Hadir" : "Tidak Hadir"}
                </span>
              )}
            </div>
            <p className="typo-body mt-1 text-sm">{m.message}</p>
            {when && <p className="typo-caption mt-2 !text-[0.7rem]">{when}</p>}
          </div>
        )
      }}
    />
  )
}
