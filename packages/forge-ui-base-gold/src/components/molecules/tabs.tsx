"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "../../utils/cn"

const Tabs = TabsPrimitive.Root

function TabsList({ className, children, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "relative flex items-center gap-1 border-b border-[var(--border)]",
        className
      )}
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        className="absolute bottom-0 left-0 h-0.5 w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] rounded-full bg-[var(--primary)] transition-all duration-300 ease-out"
      />
    </TabsPrimitive.List>
  )
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      className={cn(
        "-mb-px cursor-default px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] outline-none transition-colors hover:text-[var(--foreground)] focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-[var(--ring)] data-selected:text-[var(--foreground)]",
        className
      )}
      {...props}
    />
  )
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-panel"
      className={cn("pt-4 outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-[var(--ring)]", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTab, TabsPanel }
