"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
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
  /** Custom right-side action content. Overrides the default avatar/login button when provided. */
  actions?: React.ReactNode
  onMenuClick?: () => void
  className?: string
}

function NavBar({ logo, brandName, showBrandName, links = [], user, onLogin, actions, onMenuClick, className }: NavBarProps) {
  const shouldShowBrandName = showBrandName ?? !logo
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const showHamburger = links.length > 0 || !!onMenuClick

  function handleHamburger() {
    if (onMenuClick) {
      onMenuClick()
    } else {
      setMobileOpen((v) => !v)
    }
  }

  return (
    <nav
      data-slot="nav-bar"
      className={cn(
        "flex flex-col border-b border-[var(--border)] bg-[var(--background)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3">
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
          {actions ?? (
            user ? (
              <Avatar {...user} />
            ) : (
              onLogin && (
                <Button size="sm" onClick={onLogin}>Login</Button>
              )
            )
          )}
          {showHamburger && (
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={handleHamburger}
              className="flex size-9 items-center justify-center rounded-[var(--radius)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] sm:hidden"
            >
              {mobileOpen && !onMenuClick ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          )}
        </div>
      </div>

      {!onMenuClick && links.length > 0 && mobileOpen && (
        <div data-slot="nav-mobile-menu" className="border-t border-[var(--border)] px-3 pb-3 sm:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="block w-full rounded-[var(--radius)] px-3 py-2 typo-label text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

export { NavBar }
export type { NavBarProps }
