"use client"

import * as React from "react"
import { useTier, type Tier } from "./tier-context"
import { cn } from "../utils/cn"

const TIER_OPTIONS: { value: Tier; label: string }[] = [
  { value: "bronze", label: "Bronze" },
  { value: "silver", label: "Silver" },
  { value: "gold",   label: "Gold" },
]

export function TierSwitcher({ className }: { className?: string }) {
  const { tier, setTier } = useTier()
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--muted)] p-1",
        className
      )}
      role="group"
      aria-label="Select tier"
    >
      {TIER_OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTier(value)}
          aria-pressed={tier === value}
          className={cn(
            "rounded-full px-4 py-1 typo-label transition-colors",
            tier === value
              ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
