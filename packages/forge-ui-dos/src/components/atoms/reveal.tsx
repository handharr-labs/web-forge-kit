"use client"

import * as React from "react"
import { cn } from "../../utils/cn"

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Delay before the reveal animation starts once in view (ms). */
  delay?: number
  /** Re-run the reveal every time it enters the viewport. Default: once. */
  repeat?: boolean
  /** Fraction of the element visible before revealing. Default 0.18. */
  threshold?: number
  as?: React.ElementType
}

/**
 * Scroll-triggered reveal. Elements start hidden (see globals.css
 * `[data-mekar-reveal]`) and animate up + fade in when they enter the
 * viewport. Honors prefers-reduced-motion via the token layer.
 */
export function Reveal({
  delay = 0,
  repeat = false,
  threshold = 0.18,
  className,
  style,
  as: Tag = "div",
  children,
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [revealed, setRevealed] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          if (!repeat) observer.disconnect()
        } else if (repeat) {
          setRevealed(false)
        }
      },
      { threshold }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [repeat, threshold])

  return (
    <Tag
      ref={ref}
      data-mekar-reveal
      data-revealed={revealed ? "true" : "false"}
      className={cn(className)}
      style={{ animationDelay: delay ? `${delay}ms` : undefined, ...style }}
      {...props}
    >
      {children}
    </Tag>
  )
}
