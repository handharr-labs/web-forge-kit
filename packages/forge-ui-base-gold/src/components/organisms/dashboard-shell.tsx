"use client"

import * as React from "react"
import { Menu } from "lucide-react"

import { cn } from "../../utils/cn"

/** Props the shell injects into the passed sidebar element to drive mobile collapse. */
interface ShellSidebarProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface DashboardShellProps {
  /** A `<Sidebar />` element; the shell injects `open`/`onOpenChange` to drive mobile collapse. */
  sidebar: React.ReactElement<ShellSidebarProps>
  /** Left side of the top bar — breadcrumbs, page title, etc. */
  topbar?: React.ReactNode
  /** Right side of the top bar — actions, user menu, etc. */
  topbarActions?: React.ReactNode
  children: React.ReactNode
  /** Constrain and center the content column (dashboards usually want this). */
  maxWidth?: "full" | "screen-xl" | "screen-2xl"
  className?: string
  contentClassName?: string
}

const MAX_WIDTH = {
  full: "",
  "screen-xl": "mx-auto w-full max-w-screen-xl",
  "screen-2xl": "mx-auto w-full max-w-screen-2xl",
} as const

/**
 * App frame for admin pages: a persistent sidebar beside a sticky top bar over a
 * single scrollable content column. On mobile the sidebar collapses to an
 * overlay drawer toggled by the top-bar hamburger (the passed `<Sidebar />`
 * already renders as an off-canvas drawer below `md`).
 */
function DashboardShell({
  sidebar,
  topbar,
  topbarActions,
  children,
  maxWidth = "screen-2xl",
  className,
  contentClassName,
}: DashboardShellProps) {
  const [open, setOpen] = React.useState(false)

  const sidebarEl = React.cloneElement(sidebar, { open, onOpenChange: setOpen })

  return (
    <div
      data-slot="dashboard-shell"
      className={cn("flex min-h-svh w-full bg-[var(--background)] text-[var(--foreground)]", className)}
    >
      {sidebarEl}

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          data-slot="dashboard-topbar"
          className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--border)] bg-[var(--background)]/80 px-4 py-2.5 backdrop-blur-sm"
        >
          <button
            type="button"
            aria-label="Open sidebar"
            onClick={() => setOpen(true)}
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] md:hidden"
          >
            <Menu className="size-5" />
          </button>

          <div className="flex min-w-0 flex-1 items-center">{topbar}</div>
          {topbarActions && <div className="flex shrink-0 items-center gap-2">{topbarActions}</div>}
        </header>

        <main
          data-slot="dashboard-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6"
        >
          <div className={cn(MAX_WIDTH[maxWidth], contentClassName)}>{children}</div>
        </main>
      </div>
    </div>
  )
}

export { DashboardShell }
export type { DashboardShellProps }
