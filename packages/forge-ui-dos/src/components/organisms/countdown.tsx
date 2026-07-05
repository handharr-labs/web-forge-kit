"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"

type CountdownProps = {
  /** Target date/time (ISO string or Date). */
  target: string | Date
  /** Unit labels — override for locale (default Indonesian). */
  labels?: { days: string; hours: string; minutes: string; seconds: string }
  className?: string
  /** Rendered when the target has passed. */
  endedLabel?: React.ReactNode
}

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now())
  const s = Math.floor(ms / 1000)
  return {
    total: ms,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

/** Live countdown to the nearest event session. Four foil-edged cells. */
export function Countdown({
  target,
  labels = { days: "Hari", hours: "Jam", minutes: "Menit", seconds: "Detik" },
  endedLabel = "The day has arrived",
  className,
}: CountdownProps) {
  const targetDate = React.useMemo(
    () => (target instanceof Date ? target : new Date(target)),
    [target]
  )
  // Start null so the server and the client's first (hydration) render agree on
  // a static placeholder; the real, time-dependent value is computed only after
  // mount. Otherwise `Date.now()` differs across the SSR/hydration boundary.
  const [time, setTime] = React.useState<ReturnType<typeof diff> | null>(null)

  React.useEffect(() => {
    setTime(diff(targetDate))
    const id = setInterval(() => setTime(diff(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (time && time.total <= 0) {
    return (
      <p className={cn("typo-display text-center text-[var(--primary-deep)]", className)}>
        {endedLabel}
      </p>
    )
  }

  const cells = [
    { value: time?.days, label: labels.days },
    { value: time?.hours, label: labels.hours },
    { value: time?.minutes, label: labels.minutes },
    { value: time?.seconds, label: labels.seconds },
  ]

  return (
    <Reveal className={cn("flex items-stretch justify-center gap-3 sm:gap-4", className)}>
      {cells.map((c) => (
        <div
          key={c.label}
          className="flex min-w-[4.5rem] flex-1 flex-col items-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-2 py-4 shadow-[var(--shadow-sm)]"
        >
          <span className="font-[var(--font-display)] text-3xl font-600 tabular-nums text-[var(--foreground)] sm:text-4xl">
            {c.value == null ? "00" : String(c.value).padStart(2, "0")}
          </span>
          <span className="typo-eyebrow mt-2 !text-[0.6rem] !tracking-[0.2em]">{c.label}</span>
        </div>
      ))}
    </Reveal>
  )
}
