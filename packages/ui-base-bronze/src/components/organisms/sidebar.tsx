"use client"

import * as React from "react"
import { Avatar, type AvatarProps } from "../atoms/avatar"
import { Button } from "../atoms/button"
import { cn } from "../../utils/cn"

interface SidebarItem {
  label: string
  href: string
  icon?: React.ReactNode
  active?: boolean
}

interface SidebarGroup {
  label?: string
  items: SidebarItem[]
  collapsible?: boolean
}

interface SidebarProps {
  logo?: React.ReactNode
  brandName?: string
  showBrandName?: boolean
  groups?: SidebarGroup[]
  user?: AvatarProps
  onLogin?: () => void
  className?: string
}

function Sidebar({ logo, brandName, showBrandName, groups = [], user, onLogin, className }: SidebarProps) {
  const shouldShowBrandName = showBrandName ?? !logo

  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "flex h-full w-56 flex-col border-r border-[var(--border)] bg-[var(--background)]",
        className
      )}
    >
      {(logo || (shouldShowBrandName && brandName)) && (
        <div data-slot="sidebar-brand" className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
          {logo}
          {shouldShowBrandName && brandName && (
            <span className="typo-card-title font-bold">{brandName}</span>
          )}
        </div>
      )}

      <nav
        data-slot="sidebar-nav"
        className="flex-1 overflow-y-auto p-2 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]"
      >
        {groups.map((group, gi) => (
          <div key={gi} data-slot="sidebar-group" className="mb-4 last:mb-0">
            {group.label && (
              <p className="typo-section-label mb-1 px-2 text-[var(--muted-foreground)]">
                {group.label}
              </p>
            )}
            <ul>
              {group.items.map((item, ii) => (
                <li key={ii}>
                  <a
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-[var(--radius)] px-2 py-1.5 text-sm",
                      item.active
                        ? "bg-[var(--muted)] font-medium text-[var(--primary)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {item.icon && (
                      <span className="shrink-0 [&_svg]:size-4">{item.icon}</span>
                    )}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {user ? (
        <div data-slot="sidebar-user" className="flex items-center gap-2 border-t border-[var(--border)] px-4 py-3">
          <Avatar {...user} size="sm" />
          {user.name && (
            <span className="typo-label truncate">{user.name}</span>
          )}
        </div>
      ) : onLogin ? (
        <div data-slot="sidebar-user" className="border-t border-[var(--border)] px-4 py-3">
          <Button size="sm" onClick={onLogin} className="w-full">Login</Button>
        </div>
      ) : null}
    </aside>
  )
}

export { Sidebar }
export type { SidebarProps, SidebarGroup, SidebarItem }
