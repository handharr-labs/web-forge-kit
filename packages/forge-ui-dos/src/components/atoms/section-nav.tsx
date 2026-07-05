"use client"

import * as React from "react"
import { cn } from "../../utils/cn"

export type SectionNavItem = { id: string; label: string }

/**
 * Section-navigation dot rail (à la viding.co). A vertical column of dots pinned
 * to the viewport edge; the dot for the section nearest the viewport centre is
 * highlighted (via `IntersectionObserver`), and tapping a dot smooth-scrolls to
 * that section. Each `item.id` must match the `id` of a rendered section
 * element. The `<Invitation>` renderer derives these items from its section
 * list automatically.
 */
export function SectionNav({
  items,
  side = "right",
  position = "fixed",
  rootRef,
  className,
}: {
  items: SectionNavItem[]
  side?: "right" | "left"
  /** `fixed` (viewport, for real pages) or `absolute` (scoped container demo). */
  position?: "fixed" | "absolute"
  /** Scroll container to observe. Defaults to the viewport (window scroll). */
  rootRef?: React.RefObject<HTMLElement | null>
  className?: string
}) {
  const [active, setActive] = React.useState(items[0]?.id)

  React.useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        const top = visible.reduce((a, b) =>
          b.intersectionRatio > a.intersectionRatio ? b : a
        )
        setActive((top.target as HTMLElement).id)
      },
      {
        root: rootRef?.current ?? null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    )
    for (const it of items) {
      const el = document.getElementById(it.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items, rootRef])

  if (items.length === 0) return null

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <nav
      aria-label="Section navigation"
      className={cn(
        "z-40 flex flex-col items-center gap-3",
        position,
        "top-1/2 -translate-y-1/2",
        side === "right" ? "right-3" : "left-3",
        className
      )}
    >
      {items.map((it) => {
        const on = active === it.id
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => jump(it.id)}
            aria-label={it.label}
            aria-current={on ? "true" : undefined}
            className="group relative flex h-3 items-center"
          >
            <span
              className={cn(
                "block rounded-full border border-[var(--gold-deep)]/50 transition-all duration-300",
                on ? "h-2.5 w-2.5 bg-[var(--gold-deep)]" : "h-1.5 w-1.5 bg-transparent"
              )}
            />
            <span
              className={cn(
                "pointer-events-none absolute whitespace-nowrap rounded-[var(--radius-pill)] bg-[var(--surface)]/95 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.15em] text-[var(--foreground-soft)] opacity-0 shadow-[var(--shadow-sm)] backdrop-blur transition-opacity group-hover:opacity-100",
                side === "right" ? "right-5" : "left-5"
              )}
            >
              {it.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
