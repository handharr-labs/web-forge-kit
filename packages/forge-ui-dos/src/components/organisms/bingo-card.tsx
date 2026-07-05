"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"

/**
 * Wedding-bingo gamification — a square grid of "moments likely to happen"
 * (e.g. "someone cries", "best man forgets the ring") the guest taps off live
 * during the reception. Detects completed rows / columns / diagonals and fires
 * `onBingo` once a line is achieved. With `free`, the centre cell starts marked.
 */
export function BingoCard({
  cells,
  size = 5,
  free = true,
  onBingo,
  className,
}: {
  cells: string[]
  size?: number
  /** Mark the centre square as a free space. */
  free?: boolean
  /** Called the first time any line completes. */
  onBingo?: () => void
  className?: string
}) {
  const centre = Math.floor((size * size) / 2)
  const [marked, setMarked] = React.useState<Set<number>>(
    () => new Set(free && size % 2 === 1 ? [centre] : [])
  )
  const firedRef = React.useRef(false)

  const grid = cells.slice(0, size * size)

  const hasLine = React.useMemo(() => {
    const has = (i: number) => marked.has(i)
    // rows + columns
    for (let r = 0; r < size; r++) {
      let row = true
      let col = true
      for (let c = 0; c < size; c++) {
        if (!has(r * size + c)) row = false
        if (!has(c * size + r)) col = false
      }
      if (row || col) return true
    }
    // diagonals
    let d1 = true
    let d2 = true
    for (let i = 0; i < size; i++) {
      if (!has(i * size + i)) d1 = false
      if (!has(i * size + (size - 1 - i))) d2 = false
    }
    return d1 || d2
  }, [marked, size])

  React.useEffect(() => {
    if (hasLine && !firedRef.current) {
      firedRef.current = true
      onBingo?.()
    }
  }, [hasLine, onBingo])

  function toggle(i: number) {
    if (free && size % 2 === 1 && i === centre) return
    setMarked((prev) => {
      const nextSet = new Set(prev)
      if (nextSet.has(i)) nextSet.delete(i)
      else nextSet.add(i)
      return nextSet
    })
  }

  return (
    <Reveal className={cn("mx-auto w-full max-w-md", className)}>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {grid.map((label, i) => {
          const isFree = free && size % 2 === 1 && i === centre
          const on = marked.has(i)
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={on}
              className={cn(
                "flex aspect-square items-center justify-center rounded-[var(--radius-sm)] border p-1.5 text-center text-[0.6rem] leading-tight transition-colors sm:text-xs",
                on
                  ? "border-[var(--primary-deep)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-soft)] hover:border-[var(--primary)]",
                isFree && "font-[var(--font-display)] italic"
              )}
            >
              {isFree ? "★" : label}
            </button>
          )
        })}
      </div>
      {hasLine && (
        <p className="typo-display mt-4 text-center text-2xl italic text-[var(--primary-deep)]">
          Bingo! 🎉
        </p>
      )}
    </Reveal>
  )
}
