"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { Button } from "../atoms/button"

const cardCls =
  "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-md)] sm:p-8"

/**
 * Guess-the-detail gamification — guests guess something about the day (guest
 * count, cake flavour, weather) before it's revealed. Two modes: pass `options`
 * for multiple choice (marks right/wrong when `answerIndex` is set), or omit
 * them for a free-text guess with a "Reveal answer" button. Controlled-optional:
 * `onGuess` reports the guess for the host to persist / gate a prize.
 */
export function GuessDetail({
  eyebrow = "Guess the detail",
  title,
  question,
  options,
  answer,
  answerIndex,
  hint,
  revealLabel = "Reveal answer",
  placeholder = "Your guess…",
  onGuess,
  className,
}: {
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  question: React.ReactNode
  /** When provided, renders multiple choice instead of a text input. */
  options?: string[]
  /** The correct answer, revealed after guessing. */
  answer: React.ReactNode
  /** Index of the correct option — enables right/wrong marking. */
  answerIndex?: number
  hint?: React.ReactNode
  revealLabel?: string
  placeholder?: string
  onGuess?: (guess: string | number) => Promise<void> | void
  className?: string
}) {
  const [picked, setPicked] = React.useState<number | null>(null)
  const [text, setText] = React.useState("")
  const [revealed, setRevealed] = React.useState(false)

  const hasChoices = Boolean(options && options.length > 0)

  async function choose(i: number) {
    if (picked != null) return
    setPicked(i)
    setRevealed(true)
    await onGuess?.(i)
  }
  async function revealText(e: React.FormEvent) {
    e.preventDefault()
    if (revealed) return
    setRevealed(true)
    await onGuess?.(text.trim())
  }

  return (
    <Reveal className={cn(cardCls, className)}>
      {eyebrow && <p className="typo-eyebrow text-[var(--rose-deep)]">{eyebrow}</p>}
      {title && (
        <h3 className="typo-display mt-1 text-2xl text-[var(--foreground)]">{title}</h3>
      )}
      <p className="typo-lead mt-3 italic">{question}</p>
      {hint && !revealed && <p className="typo-caption mt-2">{hint}</p>}

      {hasChoices ? (
        <div className="mt-6 grid gap-3 text-left">
          {options!.map((opt, i) => {
            const isPicked = picked === i
            const isAnswer = answerIndex === i
            const revealCorrect = revealed && isAnswer
            const revealWrong = isPicked && !isAnswer
            return (
              <button
                key={i}
                type="button"
                onClick={() => choose(i)}
                disabled={picked != null}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius)] border px-4 py-3 text-sm transition-all disabled:cursor-default",
                  revealCorrect &&
                    "border-[var(--success)] bg-[var(--primary-soft)] text-[var(--primary-deep)]",
                  revealWrong &&
                    "border-[var(--danger)] bg-[var(--rose-soft)] text-[var(--rose-deep)]",
                  picked == null &&
                    "border-[var(--input)] bg-[var(--surface)] text-[var(--foreground-soft)] hover:border-[var(--primary)]",
                  picked != null && !revealCorrect && !revealWrong && "border-[var(--input)] opacity-60"
                )}
              >
                <span className="font-[var(--font-display)] text-base font-600 text-[var(--muted-foreground)]">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
                {revealCorrect && <span className="ml-auto">✓</span>}
                {revealWrong && <span className="ml-auto">✕</span>}
              </button>
            )
          })}
        </div>
      ) : (
        <form onSubmit={revealText} className="mt-6 space-y-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            aria-label="Your guess"
            disabled={revealed}
            className="w-full rounded-[var(--radius)] border border-[var(--input)] bg-[var(--surface)] px-4 py-3 text-center font-[var(--font-body)] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-60"
          />
          {!revealed && (
            <Button type="submit" variant="solid" size="sm" className="w-full">
              {revealLabel}
            </Button>
          )}
        </form>
      )}

      {revealed && (
        <div className="mt-6">
          <p className="typo-caption text-[var(--muted-foreground)]">The answer</p>
          <p className="typo-display mt-1 text-xl italic text-[var(--primary-deep)]">{answer}</p>
        </div>
      )}
    </Reveal>
  )
}
