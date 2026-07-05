"use client"

import * as React from "react"
import { cn } from "../../utils/cn"

/* ----------------------------------------------------------------------------
   Botanical ornaments. Pure inline SVG (no asset requests), currentColor-driven
   so they inherit whatever text color the context sets — default sage/gold.
   -------------------------------------------------------------------------- */

type SvgProps = React.SVGProps<SVGSVGElement>

/** A single leafy sprig. Mirror with `flip` for symmetric pairs. */
export function Sprig({ className, flip, ...props }: SvgProps & { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      aria-hidden
      className={cn("text-[var(--primary)]", className)}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      {...props}
    >
      <path d="M8 52 C40 44 78 34 112 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {[18, 34, 50, 66, 82, 98].map((x, i) => {
        const y = 50 - i * 6.6
        return (
          <g key={x} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
            <path d={`M${x} ${y} q -10 -9 -19 -6`} />
            <path d={`M${x} ${y} q 10 -9 19 -6`} />
          </g>
        )
      })}
      <circle cx="112" cy="8" r="3.2" fill="currentColor" />
    </svg>
  )
}

/** Centered horizontal divider: two sprigs flanking a gold diamond. */
export function OrnamentDivider({
  className,
  foil = true,
}: {
  className?: string
  foil?: boolean
}) {
  return (
    <div className={cn("flex items-center justify-center gap-3 py-2", className)}>
      <Sprig flip className="h-7 w-24 opacity-70" />
      <span
        data-dos-foil={foil ? "" : undefined}
        className={cn(
          "text-xl leading-none",
          foil ? "" : "text-[var(--gold-deep)]"
        )}
      >
        ✦
      </span>
      <Sprig className="h-7 w-24 opacity-70" />
    </div>
  )
}

/** A corner flourish for framing hero cards. Position with utility classes. */
export function CornerFlourish({ className, ...props }: SvgProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
      className={cn("text-[var(--gold)]", className)}
      {...props}
    >
      <path
        d="M96 4 C60 6 30 22 18 54 C13 68 10 82 10 96"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {[
        [30, 40], [22, 58], [17, 78],
      ].map(([x, y], i) => (
        <g key={i} stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
          <path d={`M${x} ${y} q -13 2 -18 13`} />
          <path d={`M${x} ${y} q -2 13 -13 18`} />
        </g>
      ))}
      <circle cx="96" cy="4" r="2.6" fill="currentColor" />
    </svg>
  )
}

/**
 * Ambient floating botanicals for hero backdrops. Renders drifting sprigs
 * pinned to the corners; motion comes from the token layer (`data-dos-*`),
 * so it auto-disables under prefers-reduced-motion.
 */
export function BotanicalBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <CornerFlourish data-dos-sway className="absolute -left-2 -top-2 h-40 w-40 opacity-40" />
      <CornerFlourish
        data-dos-sway
        className="absolute -right-2 -top-2 h-40 w-40 opacity-40"
        style={{ transform: "scaleX(-1)", animationDelay: "1.2s" }}
      />
      <Sprig data-dos-float className="absolute bottom-8 left-6 h-16 w-32 opacity-30" />
      <Sprig
        flip
        data-dos-float
        className="absolute bottom-10 right-6 h-16 w-32 opacity-30"
        style={{ animationDelay: "2.4s" }}
      />
    </div>
  )
}
