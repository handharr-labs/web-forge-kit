"use client"

import * as React from "react"
import { Avatar, type AvatarProps } from "../atoms/avatar"
import { Button } from "../atoms/button"
import { cn } from "../../utils/cn"

interface NavLink { label: string; href: string }

interface NavBarProps {
  logo?: React.ReactNode
  brandName?: string
  showBrandName?: boolean
  links?: NavLink[]
  user?: AvatarProps
  onLogin?: () => void
  className?: string
}

function NavBar({ logo, brandName, showBrandName, links = [], user, onLogin, className }: NavBarProps) {
  const shouldShowBrandName = showBrandName ?? !logo

  return (
    <nav
      data-slot="nav-bar"
      className={cn(
        "flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--background)] px-5 py-3",
        className
      )}
    >
      <div className="flex items-center gap-6">
        {(logo || (shouldShowBrandName && brandName)) && (
          <div data-slot="nav-brand" className="flex items-center gap-2">
            {logo}
            {shouldShowBrandName && brandName && (
              <span className="typo-card-title font-bold">{brandName}</span>
            )}
          </div>
        )}
        {links.length > 0 && (
          <ul className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="typo-label rounded-[var(--radius)] px-3 py-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-center gap-2">
        {user ? (
          <Avatar {...user} />
        ) : (
          onLogin && (
            <Button size="sm" onClick={onLogin}>Login</Button>
          )
        )}
      </div>
    </nav>
  )
}

export { NavBar }
export type { NavBarProps }
