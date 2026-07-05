"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { Button } from "../atoms/button"

export type TriviaQuestion = {
  question: string
  options: string[]
  /** Index into `options` of the correct answer. */
  answerIndex: number
}

const cardCls =
  "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-md)] sm:p-8"

function defaultScoreMessage(score: number, total: number): string {
  const ratio = total > 0 ? score / total : 0
  if (ratio === 1) return "Soulmate certified 💍"
  if (ratio >= 0.5) return "You know them well 🤍"
  return "Time to get to know them better 🌱"
}

/**
 * Couple trivia / quiz gamification — steps through multiple-choice questions,
 * marks each answer right/wrong inline, and shows a final score. Controlled-
 * optional: `onComplete` reports the score so the host can persist a
 * leaderboard entry.
 */
export function TriviaQuiz({
  questions,
  title = "How well do you know us?",
  onComplete,
  scoreMessage = defaultScoreMessage,
  className,
}: {
  questions: TriviaQuestion[]
  title?: React.ReactNode
  onComplete?: (score: number, total: number) => void
  scoreMessage?: (score: number, total: number) => React.ReactNode
  className?: string
}) {
  const [step, setStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<(number | null)[]>(() =>
    questions.map(() => null)
  )
  const [done, setDone] = React.useState(false)

  const q = questions[step]
  const picked = answers[step]
  const score = answers.reduce<number>(
    (n, a, i) => n + (a != null && a === questions[i].answerIndex ? 1 : 0),
    0
  )
  const last = step + 1 >= questions.length

  function choose(i: number) {
    if (picked != null) return
    setAnswers((prev) => prev.map((a, idx) => (idx === step ? i : a)))
  }
  function next() {
    if (last) {
      setDone(true)
      onComplete?.(score, questions.length)
    } else {
      setStep((s) => s + 1)
    }
  }

  if (done) {
    return (
      <Reveal className={cn(cardCls, className)}>
        <p className="typo-eyebrow text-[var(--rose-deep)]">Your Score</p>
        <p className="typo-script text-[var(--primary-deep)]">
          {score}
          <span className="text-[var(--muted-foreground)]">/{questions.length}</span>
        </p>
        <p className="typo-body mt-2 text-sm">{scoreMessage(score, questions.length)}</p>
      </Reveal>
    )
  }

  return (
    <Reveal className={cn(cardCls, className)}>
      {title && <p className="typo-eyebrow mb-2 text-[var(--rose-deep)]">{title}</p>}
      <p className="typo-caption">
        {step + 1} / {questions.length}
      </p>
      <h3 className="typo-display mt-3 text-2xl text-[var(--foreground)]">{q.question}</h3>

      <div className="mt-6 grid gap-3 text-left">
        {q.options.map((opt, i) => {
          const isPicked = picked === i
          const isAnswer = i === q.answerIndex
          const revealCorrect = picked != null && isAnswer
          const revealWrong = isPicked && !isAnswer
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={picked != null}
              aria-pressed={isPicked}
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

      {picked != null && (
        <Button variant="solid" size="sm" className="mt-6 w-full" onClick={next}>
          {last ? "See Score" : "Next"}
        </Button>
      )}
    </Reveal>
  )
}
