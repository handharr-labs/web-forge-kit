"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "../../utils/cn"

interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

function SearchBar({
  value,
  onChange,
  placeholder = "Search events...",
  className,
}: SearchBarProps) {
  return (
    <div
      data-slot="search-bar"
      className={cn(
        "flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 transition-colors focus-within:border-[var(--ring)] focus-within:ring-3 focus-within:ring-[var(--ring)]/20",
        className
      )}
    >
      <Search className="size-4 shrink-0 text-[var(--muted-foreground)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
      />
    </div>
  )
}

export { SearchBar }
export type { SearchBarProps }
