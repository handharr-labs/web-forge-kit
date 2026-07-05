"use client"

import * as React from "react"
import { cn } from "../../utils/cn"

export type LanguageOption = { code: string; label: string }

const DEFAULT_LANGS: LanguageOption[] = [
  { code: "id", label: "ID" },
  { code: "en", label: "EN" },
]

/**
 * Language switch — a small segmented pill (ID/EN by default). Controlled-
 * optional: pass `value` + `onChange`, or let it hold its own selection. The
 * host is responsible for actually swapping copy.
 */
export function LanguageToggle({
  value,
  defaultValue,
  onChange,
  options = DEFAULT_LANGS,
  className,
}: {
  value?: string
  defaultValue?: string
  onChange?: (code: string) => void
  options?: LanguageOption[]
  className?: string
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? options[0]?.code)
  const current = value ?? internal

  function pick(code: string) {
    if (value === undefined) setInternal(code)
    onChange?.(code)
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--surface)]/90 p-1 backdrop-blur",
        className
      )}
    >
      {options.map((o) => {
        const active = current === o.code
        return (
          <button
            key={o.code}
            type="button"
            onClick={() => pick(o.code)}
            aria-pressed={active}
            className={cn(
              "rounded-[var(--radius-pill)] px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] transition-colors",
              active
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--foreground-soft)] hover:text-[var(--foreground)]"
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
