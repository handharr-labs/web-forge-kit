"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { Button } from "../atoms/button"

export type SongRequest = {
  title: string
  artist?: string
  /** Who requested it. */
  from?: string
}

const fieldClass =
  "w-full rounded-[var(--radius)] border border-[var(--input)] bg-[var(--surface)] px-4 py-3 font-[var(--font-body)] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"

/**
 * Song-request wall gamification — guests submit a track for the reception
 * playlist; the aggregated list feeds the DJ. Controlled-optional: pass
 * `requests` + `onSubmit`; new entries are optimistically prepended.
 */
export function SongRequestWall({
  requests = [],
  onSubmit,
  defaultFrom = "",
  maxHeight = "22rem",
  className,
}: {
  requests?: SongRequest[]
  onSubmit?: (r: SongRequest) => Promise<void> | void
  defaultFrom?: string
  maxHeight?: string
  className?: string
}) {
  const [title, setTitle] = React.useState("")
  const [artist, setArtist] = React.useState("")
  const [from, setFrom] = React.useState(defaultFrom)
  const [submitting, setSubmitting] = React.useState(false)
  const [local, setLocal] = React.useState<SongRequest[]>([])

  React.useEffect(() => setFrom(defaultFrom), [defaultFrom])

  const list = [...local, ...requests]

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const entry: SongRequest = {
      title: title.trim(),
      artist: artist.trim() || undefined,
      from: from.trim() || undefined,
    }
    setSubmitting(true)
    try {
      await onSubmit?.(entry)
      setLocal((l) => [entry, ...l])
      setTitle("")
      setArtist("")
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul lagu"
          aria-label="Judul lagu"
          required
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className={fieldClass}
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artis (opsional)"
            aria-label="Artis"
          />
          <input
            className={fieldClass}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Dari (opsional)"
            aria-label="Dari"
          />
        </div>
        <Button type="submit" variant="solid" size="sm" className="w-full" disabled={submitting}>
          {submitting ? "Sending…" : "Request Lagu"}
        </Button>
      </Reveal>

      <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight }}>
        {list.length === 0 && (
          <p className="typo-caption py-6 text-center">Belum ada request — mulai playlist-nya!</p>
        )}
        {list.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
          >
            <span className="text-[var(--primary)]" aria-hidden>
              ♪
            </span>
            <div className="min-w-0">
              <p className="truncate font-[var(--font-display)] text-base text-[var(--foreground)]">
                {r.title}
                {r.artist && (
                  <span className="text-[var(--muted-foreground)]"> — {r.artist}</span>
                )}
              </p>
              {r.from && <p className="typo-caption">dari {r.from}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
