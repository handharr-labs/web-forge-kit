"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"

/**
 * Lucky-draw scratch card gamification — a gold cover the guest scratches off
 * (pointer / touch) to reveal a hidden reward. Self-contained: renders `prize`
 * underneath a `<canvas>` cover; once ~`revealAt` of it is cleared the rest
 * wipes and `onReveal` fires (once). Controlled-optional — no handler needed to
 * demo. Freezes gracefully; nothing animates under reduced-motion.
 */
export function ScratchCard({
  prize,
  coverLabel = "Gosok di sini ✨",
  revealAt = 0.5,
  onReveal,
  height = 180,
  className,
}: {
  prize: React.ReactNode
  coverLabel?: string
  /** Fraction (0–1) that must be cleared before it auto-reveals. */
  revealAt?: number
  onReveal?: () => void
  height?: number
  className?: string
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const drawing = React.useRef(false)
  const revealedRef = React.useRef(false)
  const [revealed, setRevealed] = React.useState(false)

  const doReveal = React.useCallback(() => {
    if (revealedRef.current) return
    revealedRef.current = true
    setRevealed(true)
    onReveal?.()
  }, [onReveal])

  React.useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const w = wrap.clientWidth
    const h = height
    canvas.width = Math.max(1, Math.round(w * dpr))
    canvas.height = Math.max(1, Math.round(h * dpr))
    ctx.scale(dpr, dpr)

    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, "#cdb26a")
    g.addColorStop(0.5, "#e7d9a8")
    g.addColorStop(1, "#c2a75d")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = "rgba(78,60,18,0.72)"
    ctx.font = "600 15px Jost, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(coverLabel, w / 2, h / 2)
    ctx.globalCompositeOperation = "destination-out"
  }, [height, coverLabel])

  function scratch(e: React.PointerEvent) {
    if (revealedRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.beginPath()
    ctx.arc(x, y, 22, 0, Math.PI * 2)
    ctx.fill()
  }

  function measure() {
    const canvas = canvasRef.current
    if (!canvas || revealedRef.current) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const { width, height: hh } = canvas
    if (width === 0 || hh === 0) return
    const data = ctx.getImageData(0, 0, width, hh).data
    let clear = 0
    let samples = 0
    // Sample every 4th pixel's alpha channel for speed.
    for (let i = 3; i < data.length; i += 16) {
      samples++
      if (data[i] === 0) clear++
    }
    if (samples > 0 && clear / samples >= revealAt) doReveal()
  }

  return (
    <Reveal
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--gold)]/50 shadow-[var(--shadow-md)]",
        className
      )}
    >
      <div ref={wrapRef} className="relative" style={{ height }}>
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--primary-soft)] p-6 text-center">
          {prize}
        </div>
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 h-full w-full touch-none transition-opacity duration-500",
            revealed ? "pointer-events-none opacity-0" : "cursor-pointer opacity-100"
          )}
          onPointerDown={(e) => {
            drawing.current = true
            ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
            scratch(e)
          }}
          onPointerMove={(e) => {
            if (drawing.current) scratch(e)
          }}
          onPointerUp={() => {
            drawing.current = false
            measure()
          }}
          onPointerLeave={() => {
            if (drawing.current) {
              drawing.current = false
              measure()
            }
          }}
        />
      </div>
    </Reveal>
  )
}
