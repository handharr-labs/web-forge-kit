"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "../../utils/cn"

interface BreadcrumbItem {
  label: React.ReactNode
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  /** Separator between crumbs. Defaults to a chevron. */
  separator?: React.ReactNode
  className?: string
}

/**
 * Path trail for nested admin pages. The final item is rendered as the current
 * page (no link, `aria-current="page"`); earlier items link when given `href`.
 */
function Breadcrumbs({ items, separator, className }: BreadcrumbsProps) {
  const sep = separator ?? <ChevronRight className="size-3.5 text-[var(--muted-foreground)]/50" />

  return (
    <nav data-slot="breadcrumbs" aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          const content = (
            <span className="flex items-center gap-1.5">
              {item.icon && <span className="shrink-0 [&_svg]:size-4">{item.icon}</span>}
              {item.label}
            </span>
          )

          return (
            <li key={i} className="flex items-center gap-1.5">
              {isLast || !item.href ? (
                <span
                  data-slot="breadcrumb-page"
                  aria-current={isLast ? "page" : undefined}
                  className={cn(isLast ? "font-medium text-[var(--foreground)]" : "text-[var(--muted-foreground)]")}
                >
                  {content}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="rounded-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  {content}
                </a>
              )}
              {!isLast && (
                <span aria-hidden="true" className="flex items-center">
                  {sep}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export { Breadcrumbs }
export type { BreadcrumbsProps, BreadcrumbItem }
