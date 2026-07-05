"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"

export type GalleryImage = { src: string; alt?: string }

const navBtn =
  "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--surface)]/85 text-2xl leading-none text-[var(--foreground)] shadow-[var(--shadow-md)] backdrop-blur transition-colors hover:bg-[var(--surface)]"

/**
 * Photo gallery — a responsive thumbnail grid that opens a full-screen lightbox
 * with a position indicator ("3 / 20") and prev/next (buttons, swipe, or arrow
 * keys). Accepts image objects or bare URL strings.
 */
export function Gallery({
  images,
  columns = 3,
  className,
}: {
  images: (GalleryImage | string)[]
  columns?: 2 | 3
  className?: string
}) {
  const items = React.useMemo(
    () => images.map((im) => (typeof im === "string" ? { src: im } : im)),
    [images]
  )
  const [open, setOpen] = React.useState<number | null>(null)
  const touchX = React.useRef<number | null>(null)

  const go = React.useCallback(
    (dir: number) =>
      setOpen((cur) => (cur == null ? cur : (cur + dir + items.length) % items.length)),
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

  return (
    <>
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

      {open != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] p-4"
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
        >
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
