"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { CornerFlourish } from "./ornament"

export type PhotoFrameShape = "circle" | "oval" | "arch" | "rounded"

/** Per-shape clip + default aspect ratio. */
const SHAPE: Record<PhotoFrameShape, { clip: string; aspect: string }> = {
  circle: { clip: "rounded-full", aspect: "aspect-square" },
  oval: { clip: "rounded-[50%]", aspect: "aspect-[4/5]" },
  arch: { clip: "rounded-t-full", aspect: "aspect-[3/4]" },
  rounded: { clip: "rounded-[var(--radius-lg)]", aspect: "aspect-[3/4]" },
}

/**
 * Decorative photo frame — the recurring portrait motif across the invitation
 * (oval on byaisyahluthfi, arch on viding, circle on the profile cards). One
 * atom so cover / profile / gallery / closing share the same gold-ring framing
 * instead of re-inlining it. Size it with a width class on `className`
 * (`w-44`, `max-w-xs`…); the shape sets the aspect ratio, override with your own
 * `aspect-*`.
 */
export function PhotoFrame({
  src,
  alt = "",
  shape = "circle",
  bordered = true,
  flourish = false,
  fallback,
  className,
  imgClassName,
}: {
  src?: string
  alt?: string
  shape?: PhotoFrameShape
  /** Gold ring + inner padding + shadow — the Mekar frame. Default true. */
  bordered?: boolean
  /** Botanical corner flourishes (best on circle / oval). */
  flourish?: boolean
  /** Shown when there's no `src` — e.g. a script initial. */
  fallback?: React.ReactNode
  className?: string
  imgClassName?: string
}) {
  const s = SHAPE[shape]
  return (
    <div className={cn("relative", className)}>
      {flourish && (
        <>
          <CornerFlourish className="absolute -left-6 -top-6 h-14 w-14 opacity-60" />
          <CornerFlourish
            className="absolute -bottom-6 -right-6 h-14 w-14 opacity-60"
            style={{ transform: "rotate(180deg)" }}
          />
        </>
      )}
      <div
        className={cn(
          "w-full overflow-hidden",
          s.aspect,
          s.clip,
          bordered &&
            "border border-[var(--gold)]/50 p-1.5 shadow-[var(--shadow-md)]"
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className={cn("h-full w-full object-cover", s.clip, imgClassName)}
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center bg-[var(--primary-soft)] font-[var(--font-script)] text-5xl text-[var(--primary-deep)]",
              s.clip
            )}
          >
            {fallback}
          </div>
        )}
      </div>
    </div>
  )
}
