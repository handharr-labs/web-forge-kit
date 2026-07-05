"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
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
  const actionItemClass = "flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm transition-all duration-200 text-[var(--sidebar-foreground)]/70 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
  const [collapsed, setCollapsed] = React.useState<Record<number, boolean>>({})

  function toggleGroup(index: number) {
    setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }))
  }

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
          "flex flex-col w-56 border-r border-[var(--sidebar-border)] bg-[var(--sidebar)]",
          "fixed inset-y-0 left-0 z-40 md:static md:inset-auto md:z-auto md:self-stretch",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
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
          {groups.map((group, gi) => {
            const isCollapsed = collapsed[gi] ?? false

            return (
              <div key={gi} data-slot="sidebar-group" className="mb-4 last:mb-0">
                {group.label && group.collapsible ? (
                  <button
                    type="button"
                    onClick={() => toggleGroup(gi)}
                    className="mb-1 flex w-full cursor-pointer items-center justify-between px-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-ring)]"
                  >
                    <span className="typo-section-label text-[var(--sidebar-foreground)]/60">
                      {group.label}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-3.5 text-[var(--sidebar-foreground)]/40 transition-transform duration-200",
                        isCollapsed ? "" : "rotate-180"
                      )}
                    />
                  </button>
                ) : group.label ? (
                  <p className="typo-section-label mb-1 px-2 text-[var(--sidebar-foreground)]/60">
                    {group.label}
                  </p>
                ) : null}

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
                  )}
                >
                  <ul className="overflow-hidden">
                    {group.items.map((item, ii) => (
                      <li key={ii}>
                        <a
                          href={item.href}
                          aria-current={item.active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm transition-all duration-200",
                            item.active
                              ? "bg-gradient-to-r from-[var(--primary-gradient-from)]/15 to-transparent font-medium text-[var(--sidebar-primary)]"
                              : "text-[var(--sidebar-foreground)]/70 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
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
              </div>
            )
          })}
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
                  "flex items-center gap-2 px-4 py-3 transition-colors hover:bg-[var(--sidebar-accent)]",
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
