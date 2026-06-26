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

// Bottom-pinned account action (e.g. Logout) — not a navigation destination,
// so it lives beside the user identity rather than in the nav groups.
interface SidebarAction {
  label: string
  onClick?: () => void
  href?: string
  icon?: React.ReactNode
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
  actions?: SidebarAction[]
  onLogin?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

function Sidebar({ logo, brandName, showBrandName, groups = [], user, actions = [], onLogin, open = false, onOpenChange, className }: SidebarProps) {
  const shouldShowBrandName = showBrandName ?? !logo
  const actionItemClass = "flex w-full items-center gap-2 rounded-[var(--radius)] px-2 py-1.5 text-left text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"

  React.useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onOpenChange?.(false) }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => onOpenChange?.(false)}
          aria-hidden="true"
        />
      )}
      <aside
        data-slot="sidebar"
        className={cn(
          "flex-col w-56 border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] fixed inset-y-0 left-0 z-40 md:static md:inset-auto md:z-auto md:self-stretch",
          open ? "flex" : "hidden md:flex",
          className
        )}
      >
        {(logo || (shouldShowBrandName && brandName)) && (
          <div data-slot="sidebar-brand" className="flex items-center gap-2 border-b border-[var(--sidebar-border)] px-4 py-3">
            {logo}
            {shouldShowBrandName && brandName && (
              <span className="typo-card-title font-bold">{brandName}</span>
            )}
          </div>
        )}

        <nav
          data-slot="sidebar-nav"
          className="flex-1 overflow-y-auto p-2 [scrollbar-color:var(--sidebar-border)_transparent] [scrollbar-width:thin]"
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

        {(user || onLogin || actions.length > 0) && (
          <div data-slot="sidebar-footer" className="border-t border-[var(--sidebar-border)]">
            {actions.length > 0 && (
              <ul data-slot="sidebar-actions" className="p-2">
                {actions.map((action, ai) => (
                  <li key={ai}>
                    {action.href ? (
                      <a href={action.href} onClick={action.onClick} className={actionItemClass}>
                        {action.icon && <span className="shrink-0 [&_svg]:size-4">{action.icon}</span>}
                        {action.label}
                      </a>
                    ) : (
                      <button type="button" onClick={action.onClick} className={actionItemClass}>
                        {action.icon && <span className="shrink-0 [&_svg]:size-4">{action.icon}</span>}
                        {action.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {user && (
              <div
                data-slot="sidebar-user"
                className={cn(
                  "flex items-center gap-2 px-4 py-3",
                  actions.length > 0 && "border-t border-[var(--sidebar-border)]"
                )}
              >
                <Avatar {...user} size="sm" />
                {user.name && (
                  <span className="typo-label truncate">{user.name}</span>
                )}
              </div>
            )}

            {!user && onLogin && (
              <div data-slot="sidebar-login" className="px-4 py-3">
                <Button size="sm" onClick={onLogin} className="w-full">Login</Button>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  )
}

export { Sidebar }
export type { SidebarProps, SidebarGroup, SidebarItem, SidebarAction }
