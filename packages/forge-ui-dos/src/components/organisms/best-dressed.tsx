"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { PhotoFrame } from "../atoms/photo-frame"

export type Nominee = {
  /** Stable id reported to `onVote` and keyed into `results`. */
  id: string
  name: string
  photoUrl?: string
  /** Optional caption, e.g. "Table 4". */
  note?: string
}

/**
 * Best-dressed voting gamification — guests tap a nominee to cast a vote, then
 * see live ranked standings. Controlled-optional and optimistic, mirroring
 * {@link TeamPoll}: pass `results` for the standings and `onVote` to persist;
 * the just-cast vote is folded in immediately.
 */
export function BestDressedVote({
  eyebrow,
  title = "Best Dressed",
  description,
  nominees,
  results,
  votedId = null,
  onVote,
  confirmationText = "Your vote has been recorded!",
  footnote,
  className,
}: {
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  nominees: Nominee[]
  results?: Record<string, number>
  votedId?: string | null
  onVote?: (id: string) => Promise<void> | void
  confirmationText?: React.ReactNode
  footnote?: React.ReactNode
  className?: string
}) {
  const [localVote, setLocalVote] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState<string | null>(null)
  React.useEffect(() => setLocalVote(null), [votedId])

  const chosen = localVote ?? votedId
  const hasVoted = chosen != null

  async function vote(id: string) {
    if (hasVoted || pending) return
    setPending(id)
    try {
      await onVote?.(id)
      setLocalVote(id)
    } finally {
      setPending(null)
    }
  }

  const display = React.useMemo(() => {
    if (!results) return null
    const merged: Record<string, number> = { ...results }
    if (localVote) merged[localVote] = (merged[localVote] ?? 0) + 1
    const total = Object.values(merged).reduce((s, n) => s + n, 0)
    return { merged, total }
  }, [results, localVote])

  return (
    <Reveal
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)] sm:p-8",
        className
      )}
    >
      {eyebrow && (
        <p className="typo-eyebrow mb-4 text-center !tracking-[0.28em] text-[var(--rose-deep)]">
          {eyebrow}
        </p>
      )}
      {title && <h3 className="typo-display text-center italic">{title}</h3>}
      {description && (
        <p className="typo-body mx-auto mt-4 max-w-prose text-center italic">{description}</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {nominees.map((n) => {
          const selected = chosen === n.id
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => vote(n.id)}
              disabled={hasVoted || pending != null}
              aria-pressed={selected}
              className={cn(
                "flex flex-col items-center gap-2 rounded-[var(--radius)] border p-3 text-center transition-all disabled:cursor-default",
                selected
                  ? "border-[var(--gold-deep)] bg-[var(--gold-soft)]"
                  : "border-[var(--input)] bg-[var(--surface)] hover:border-[var(--primary)]"
              )}
            >
              <PhotoFrame
                shape="circle"
                src={n.photoUrl}
                alt={n.name}
                fallback={n.name.charAt(0)}
                bordered={false}
                className="w-16"
              />
              <span className="font-[var(--font-display)] text-sm text-[var(--foreground)]">
                {n.name}
              </span>
              {n.note && <span className="typo-caption !text-[0.7rem]">{n.note}</span>}
            </button>
          )
        })}
      </div>

      {hasVoted && display && (
        <div className="mt-8 space-y-3">
          {[...nominees]
            .sort((a, b) => (display.merged[b.id] ?? 0) - (display.merged[a.id] ?? 0))
            .map((n, idx) => {
              const count = display.merged[n.id] ?? 0
              const pct = display.total > 0 ? Math.round((count / display.total) * 100) : 0
              return (
                <div key={n.id}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="font-[var(--font-display)] text-sm text-[var(--foreground)]">
                      {idx === 0 && <span aria-hidden>👑 </span>}
                      {n.name}
                    </span>
                    <span className="typo-caption tabular-nums">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-[var(--radius-pill)] bg-[var(--surface-2)]">
                    <div
                      className="h-full rounded-[var(--radius-pill)] bg-[var(--gold-deep)] transition-[width] duration-700 ease-[var(--ease-soft)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
        </div>
      )}

      {hasVoted && (
        <p className="typo-caption mt-6 text-center italic text-[var(--primary-deep)]">
          {confirmationText}
        </p>
      )}
      {footnote && (
        <p className="typo-caption mt-2 text-center italic opacity-80">{footnote}</p>
      )}
    </Reveal>
  )
}
