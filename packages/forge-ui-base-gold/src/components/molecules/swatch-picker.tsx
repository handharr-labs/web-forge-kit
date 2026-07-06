"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "../../utils/cn"

interface SwatchOption {
  value: string
  label?: React.ReactNode
  /** One color, or several rendered as segments (preview a multi-hue palette). */
  colors: string | string[]
}

interface SwatchPickerProps {
  options: SwatchOption[]
  /** Controlled value; omit (with `defaultValue`) to self-manage. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  size?: "sm" | "default"
  disabled?: boolean
  className?: string
  "aria-label"?: string
}

/**
 * Generic color/option swatch grid — the app feeds it options (e.g. from
 * `DOS_PALETTES`). Gold stays palette-agnostic. Radiogroup semantics; a single
 * selection. Multi-color options render as side-by-side segments.
 */
function SwatchPicker({
  options,
  value,
  defaultValue,
  onValueChange,
  size = "default",
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: SwatchPickerProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const selected = value !== undefined ? value : internal

  function select(next: string) {
    if (disabled) return
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  const dim = size === "sm" ? "size-7" : "size-9"

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      data-slot="swatch-picker"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((opt) => {
        const isSelected = selected === opt.value
        const colors = Array.isArray(opt.colors) ? opt.colors : [opt.colors]
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={typeof opt.label === "string" ? opt.label : opt.value}
            title={typeof opt.label === "string" ? opt.label : opt.value}
            disabled={disabled}
            onClick={() => select(opt.value)}
            data-slot="swatch"
            className={cn(
              "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-offset-2 ring-offset-[var(--background)] outline-none transition-all duration-200",
              dim,
              isSelected
                ? "ring-2 ring-[var(--primary)]"
                : "ring-1 ring-[var(--border)] hover:ring-[var(--foreground)]/30",
              "focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <span className="absolute inset-0 flex">
              {colors.map((c, i) => (
                <span key={i} className="h-full flex-1" style={{ background: c }} />
              ))}
            </span>
            {isSelected && (
              <Check className="relative size-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export { SwatchPicker }
export type { SwatchPickerProps, SwatchOption }
