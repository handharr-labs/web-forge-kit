"use client"

import * as React from "react"
import { Reveal } from "../atoms/reveal"
import { Button } from "../atoms/button"
import { EmptyState } from "../atoms/empty-state"
import { SubmissionFeed } from "./submission-feed"

export type ChallengePhoto = {
  url: string
  from?: string
  caption?: string
}

/**
 * Photo-challenge wall gamification — guests upload selfies/photos into a shared
 * live gallery, optionally tagged to a prompt. Controlled-optional and
 * optimistic: on selecting a file it's shown immediately (via an object URL)
 * and handed to `onUpload`; the host uploads + persists and feeds the durable
 * list back through `photos`.
 */
export function PhotoChallengeWall({
  prompts,
  photos = [],
  onUpload,
  defaultFrom = "",
  uploadLabel = "Upload foto",
  className,
}: {
  /** Challenge ideas shown as chips, e.g. "Selfie with the couple". */
  prompts?: string[]
  photos?: ChallengePhoto[]
  onUpload?: (file: File, meta: { from?: string }) => Promise<void> | void
  defaultFrom?: string
  uploadLabel?: string
  className?: string
}) {
  const [from, setFrom] = React.useState(defaultFrom)
  const inputRef = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => setFrom(defaultFrom), [defaultFrom])

  return (
    <SubmissionFeed<ChallengePhoto>
      items={photos}
      layout="grid"
      className={className}
      empty={
        <EmptyState icon="📸" className="col-span-full">
          Jadilah yang pertama berbagi momen.
        </EmptyState>
      }
      form={({ submit, submitting }) => (
        <>
          {prompts && prompts.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {prompts.map((p, i) => (
                <span
                  key={i}
                  className="typo-caption rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--surface)] px-3 py-1"
                >
                  {p}
                </span>
              ))}
            </div>
          )}

          <Reveal className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Nama (opsional)"
              aria-label="Nama"
              className="w-full max-w-xs rounded-[var(--radius)] border border-[var(--input)] bg-[var(--surface)] px-4 py-2.5 text-center font-[var(--font-body)] text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            />
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0]
                e.target.value = ""
                if (!file) return
                const meta = { from: from.trim() || undefined }
                const entry: ChallengePhoto = { url: URL.createObjectURL(file), from: meta.from }
                await submit(entry, () => onUpload?.(file, meta))
              }}
            />
            <Button
              variant="solid"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={submitting}
            >
              {submitting ? "Uploading…" : uploadLabel}
            </Button>
          </Reveal>
        </>
      )}
      renderItem={(p, i) => (
        <figure
          key={i}
          className="relative aspect-square overflow-hidden rounded-[var(--radius)] border border-[var(--border)]"
        >
          <img
            src={p.url}
            alt={p.caption ?? ""}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          {p.from && (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1 text-[0.65rem] text-white">
              {p.from}
            </figcaption>
          )}
        </figure>
      )}
    />
  )
}
