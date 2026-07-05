"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { Skeleton } from "../atoms/skeleton"

export type GalleryImage = { src: string; alt?: string }

const navBtn =
  "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--surface)]/85 text-2xl leading-none text-[var(--foreground)] shadow-[var(--shadow-md)] backdrop-blur transition-colors hover:bg-[var(--surface)]"

/**
 * Photo gallery — a responsive thumbnail grid (`variant="grid"`) or a framed
 * carousel with a thumbnail strip (`variant="carousel"`), both opening a
 * full-screen lightbox with a position indicator ("3 / 20") and prev/next
 * (buttons, swipe, or arrow keys). Accepts image objects or bare URL strings.
 */
export function Gallery({
  images,
  columns = 3,
  variant = "grid",
  loading = false,
  skeletonCount,
  className,
}: {
  images: (GalleryImage | string)[]
  columns?: 2 | 3
  variant?: "grid" | "carousel"
  /** Show placeholder skeletons instead of images (host still fetching). */
  loading?: boolean
  /** How many skeleton tiles to show when `loading`. Defaults to columns × 2. */
  skeletonCount?: number
  className?: string
}) {
  const items = React.useMemo(
    () => images.map((im) => (typeof im === "string" ? { src: im } : im)),
    [images]
  )
  const [open, setOpen] = React.useState<number | null>(null)
  const [active, setActive] = React.useState(0)
  const touchX = React.useRef<number | null>(null)
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const lastFocused = React.useRef<HTMLElement | null>(null)

  // Lightbox focus management: remember the trigger, focus the dialog on open,
  // and restore focus when it closes.
  React.useEffect(() => {
    if (open == null) return
    lastFocused.current = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    return () => lastFocused.current?.focus?.()
  }, [open])

  const go = React.useCallback(
    (dir: number) =>
      setOpen((cur) => (cur == null ? cur : (cur + dir + items.length) % items.length)),
    [items.length]
  )

  const step = React.useCallback(
    (dir: number) => setActive((a) => (a + dir + items.length) % items.length),
    [items.length]
  )

  React.useEffect(() => {
    if (open == null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null)
      else if (e.key === "ArrowRight") go(1)
      else if (e.key === "ArrowLeft") go(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, go])

  const grid = (
    <Reveal
      className={cn(
        "grid gap-2",
        columns === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3",
        className
      )}
    >
      {items.map((im, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setOpen(i)}
          className="group relative aspect-square overflow-hidden rounded-[var(--radius)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          <img
            src={im.src}
            alt={im.alt ?? ""}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>
      ))}
    </Reveal>
  )

  const current = items[active] ?? items[0]
  const carousel = (
    <Reveal className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setOpen(active)}
          aria-label="Open photo"
          className="block w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--gold)]/40 p-1.5 shadow-[var(--shadow-md)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          <img
            src={current?.src}
            alt={current?.alt ?? ""}
            className="aspect-[4/3] w-full rounded-[var(--radius)] object-cover"
          />
        </button>
        {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => step(-1)}
              className={cn(navBtn, "left-3")}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => step(1)}
              className={cn(navBtn, "right-3")}
            >
              ›
            </button>
          </>
        )}
      </div>
      {items.length > 1 && (
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
          {items.map((im, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={cn(
                "h-14 w-14 shrink-0 overflow-hidden rounded-[var(--radius)] border-2 transition-colors",
                i === active
                  ? "border-[var(--gold-deep)]"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img src={im.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </Reveal>
  )

  if (loading) {
    const n = skeletonCount ?? columns * 2
    return (
      <div
        className={cn(
          "grid gap-2",
          columns === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3",
          className
        )}
        aria-busy="true"
      >
        {Array.from({ length: n }, (_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    )
  }

  return (
    <>
      {variant === "carousel" ? carousel : grid}

      {open != null && (
        <div
          ref={dialogRef}
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] p-4 outline-none"
          onClick={() => setOpen(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
          onTouchEnd={(e) => {
            if (touchX.current == null) return
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
            touchX.current = null
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(null)
            }}
            className={cn(navBtn, "right-4 top-4 h-9 w-9 translate-y-0 text-xl")}
          >
            ✕
          </button>
          {items.length > 1 && (
            <button
              type="button"
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation()
                go(-1)
              }}
              className={cn(navBtn, "left-4")}
            >
              ‹
            </button>
          )}
          <img
            src={items[open].src}
            alt={items[open].alt ?? ""}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] rounded-[var(--radius)] object-contain shadow-[var(--shadow-lg)]"
          />
          {items.length > 1 && (
            <button
              type="button"
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation()
                go(1)
              }}
              className={cn(navBtn, "right-4")}
            >
              ›
            </button>
          )}
          <span className="typo-caption absolute bottom-6 left-1/2 -translate-x-1/2 rounded-[var(--radius-pill)] bg-[var(--surface)]/85 px-3 py-1 backdrop-blur">
            {open + 1} / {items.length}
          </span>
        </div>
      )}
    </>
  )
}
