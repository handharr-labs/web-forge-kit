"use client"

import * as React from "react"
import { cn } from "../../utils/cn"

/**
 * Persistent background-music control. Controlled-optional: pass `playing` +
 * `onToggle` to drive it externally (e.g. start it from the cover "Open
 * Invitation" gesture, which satisfies the browser autoplay policy), or let it
 * manage its own state. Renders a looping `<audio>` plus a floating round
 * toggle that sways while playing.
 */
export function MusicToggle({
  src,
  playing,
  defaultPlaying = false,
  onToggle,
  floating = true,
  className,
}: {
  /** Audio file URL. When omitted, the control renders without an `<audio>`
   *  element (handy for static previews / the catalog). */
  src?: string
  playing?: boolean
  defaultPlaying?: boolean
  onToggle?: (next: boolean) => void
  /** Pin to the viewport bottom-right. Set false to place inline. */
  floating?: boolean
  className?: string
}) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [internal, setInternal] = React.useState(defaultPlaying)
  const on = playing ?? internal

  React.useEffect(() => {
    const a = audioRef.current
    if (!a) return
    if (on) a.play().catch(() => {}) // blocked until a user gesture — no-op
    else a.pause()
  }, [on])

  function toggle() {
    const next = !on
    if (playing === undefined) setInternal(next)
    onToggle?.(next)
  }

  return (
    <>
      {src && <audio ref={audioRef} src={src} loop preload="auto" />}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Mute music" : "Play music"}
        className={cn(
          "z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/90 text-[var(--primary-deep)] shadow-[var(--shadow-md)] backdrop-blur transition-colors hover:text-[var(--foreground)]",
          floating && "fixed bottom-5 right-5",
          className
        )}
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          aria-hidden
          data-mekar-sway={on ? "" : undefined}
        >
          <path
            d="M9 18V6l10-2v10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6.5" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="16.5" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.6" />
          {!on && (
            <line
              x1="3"
              y1="3"
              x2="21"
              y2="21"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>
    </>
  )
}
