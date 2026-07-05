"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"

/**
 * A single side of the poll. `accent` tints the option card and its result bar;
 * `icon` is any node (an emoji, ornament, or <Sprig/>) shown before the label.
 */
export type PollOption = {
  /** Stable identifier reported to `onVote` and keyed into `results`. */
  id: string
  /** e.g. "Team Bride". */
  label: string
  /** Optional second line, e.g. "Unbothered, Then Married". */
  tagline?: string
  /** Optional leading node — emoji string or React node. */
  icon?: React.ReactNode
  /** Colour family for the card fill + result bar. Defaults to "sage". */
  accent?: "rose" | "sage" | "gold"
}

/** Vote tallies keyed by option id — used to render the live standings bars. */
export type PollResults = Record<string, number>

type AccentStyle = {
  /** Selected/filled option card. */
  fill: string
  /** Unselected option card, hover cue only. */
  idle: string
  /** Result-bar filled track. */
  bar: string
  /** Result-row label colour. */
  text: string
}

const ACCENTS: Record<NonNullable<PollOption["accent"]>, AccentStyle> = {
  rose: {
    fill: "border-[var(--rose-deep)] bg-[var(--rose-deep)] text-[var(--primary-foreground)] shadow-[var(--shadow-sm)]",
    idle: "border-[var(--input)] bg-[var(--surface)] text-[var(--foreground-soft)] hover:border-[var(--rose)]",
    bar: "bg-[var(--rose-deep)]",
    text: "text-[var(--rose-deep)]",
  },
  sage: {
    fill: "border-[var(--primary-deep)] bg-[var(--primary-deep)] text-[var(--primary-foreground)] shadow-[var(--shadow-sm)]",
    idle: "border-[var(--input)] bg-[var(--surface)] text-[var(--foreground-soft)] hover:border-[var(--primary)]",
    bar: "bg-[var(--primary-deep)]",
    text: "text-[var(--primary-deep)]",
  },
  gold: {
    fill: "border-[var(--gold-deep)] bg-[var(--gold-deep)] text-[var(--primary-foreground)] shadow-[var(--shadow-sm)]",
    idle: "border-[var(--input)] bg-[var(--surface)] text-[var(--foreground-soft)] hover:border-[var(--gold)]",
    bar: "bg-[var(--gold-deep)]",
    text: "text-[var(--gold-deep)]",
  },
}

function accentOf(o: PollOption): AccentStyle {
  return ACCENTS[o.accent ?? "sage"]
}

/** One "choose your side" card. */
function OptionCard({
  option,
  selected,
  disabled,
  onSelect,
}: {
  option: PollOption
  selected: boolean
  disabled?: boolean
  onSelect: () => void
}) {
  const a = accentOf(option)
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-[var(--radius)] border px-4 py-3 text-center transition-all duration-300",
        "disabled:cursor-default",
        selected ? a.fill : a.idle
      )}
    >
      <span className="flex items-center gap-1.5 font-[var(--font-display)] text-base font-600 italic">
        {option.icon != null && <span className="not-italic">{option.icon}</span>}
        {option.label}
      </span>
      {option.tagline && (
        <span className="font-[var(--font-display)] text-xs italic opacity-80">
          {option.tagline}
        </span>
      )}
    </button>
  )
}

/** One standings row — label + percentage over a filled progress track. */
function ResultBar({ option, pct }: { option: PollOption; pct: number }) {
  const a = accentOf(option)
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className={cn("flex items-center gap-1.5 font-[var(--font-display)] text-lg italic", a.text)}>
          {option.icon != null && <span className="not-italic text-base">{option.icon}</span>}
          {option.label}
        </span>
        <span className={cn("font-[var(--font-body)] text-sm tabular-nums", a.text)}>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-[var(--radius-pill)] bg-[var(--surface-2)]">
        <div
          className={cn("h-full rounded-[var(--radius-pill)] transition-[width] duration-700 ease-[var(--ease-soft)]", a.bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Interactive "Which team are you?" poll — the wedding-invitation gamification
 * block (Team Bride vs Team Groom, but works for any N options).
 *
 * Controlled-optional, mirroring {@link RsvpForm}: it manages its own voted
 * state and calls `onVote`; the host persists the tally. Pass `votedId` to
 * restore a returning guest's choice, and `results` for the live standings.
 * When `results` is supplied, the just-cast vote is reflected optimistically so
 * the bars react immediately even before the host round-trips a fresh count.
 */
export function TeamPoll({
  eyebrow,
  title,
  description,
  options,
  results,
  votedId = null,
  onVote,
  standingsLabel = "Current Standings",
  votesLabel = (n) => `${n.toLocaleString()} votes cast`,
  footnote,
  confirmationText = "Your vote has been recorded!",
  className,
}: {
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  options: PollOption[]
  results?: PollResults
  votedId?: string | null
  onVote?: (optionId: string) => Promise<void> | void
  standingsLabel?: React.ReactNode
  votesLabel?: (total: number) => React.ReactNode
  footnote?: React.ReactNode
  confirmationText?: React.ReactNode
  className?: string
}) {
  // Local vote wins over the incoming prop once the guest picks a side.
  const [localVote, setLocalVote] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState<string | null>(null)
  React.useEffect(() => setLocalVote(null), [votedId])

  const chosen = localVote ?? votedId
  const hasVoted = chosen != null

  async function vote(optionId: string) {
    if (hasVoted || pending) return
    setPending(optionId)
    try {
      await onVote?.(optionId)
      setLocalVote(optionId)
    } finally {
      setPending(null)
    }
  }

  // Optimistically fold this session's vote into the standings so the bars move
  // right away; a host-supplied `votedId` is assumed already counted upstream.
  const display = React.useMemo(() => {
    if (!results) return null
    const merged: PollResults = { ...results }
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

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <OptionCard
            key={o.id}
            option={o}
            selected={chosen === o.id}
            disabled={hasVoted || pending != null}
            onSelect={() => vote(o.id)}
          />
        ))}
      </div>

      {hasVoted && display && (
        <div className="mt-8">
          <p className="typo-caption mb-4 text-center">
            {standingsLabel} <span aria-hidden> · </span> {votesLabel(display.total)}
          </p>
          <div className="space-y-4">
            {options.map((o) => {
              const count = display.merged[o.id] ?? 0
              const pct = display.total > 0 ? Math.round((count / display.total) * 100) : 0
              return <ResultBar key={o.id} option={o} pct={pct} />
            })}
          </div>
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
