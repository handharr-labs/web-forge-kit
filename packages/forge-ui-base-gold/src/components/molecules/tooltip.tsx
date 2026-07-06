"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "../../utils/cn"

/**
 * Shares a single hover delay across every tooltip beneath it, so once one is
 * visible adjacent ones open instantly (dense toolbars feel snappy). Mount once
 * near the app root.
 */
function TooltipProvider({
  delay = 400,
  closeDelay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider delay={delay} closeDelay={closeDelay} {...props} />
}

interface TooltipProps
  extends Pick<TooltipPrimitive.Root.Props, "open" | "defaultOpen" | "onOpenChange"> {
  /** The tip text/content. Omit to render the trigger with no tooltip. */
  content?: React.ReactNode
  /** The element the tooltip describes (an icon button, etc.). */
  children: React.ReactNode
  side?: TooltipPrimitive.Positioner.Props["side"]
  sideOffset?: TooltipPrimitive.Positioner.Props["sideOffset"]
  align?: TooltipPrimitive.Positioner.Props["align"]
  className?: string
}

/**
 * Composed convenience tooltip: wrap any focusable element to describe it.
 * `<Tooltip content="Delete"><Button size="icon">…</Button></Tooltip>`.
 */
function Tooltip({
  content,
  children,
  side = "top",
  sideOffset = 6,
  align = "center",
  open,
  defaultOpen,
  onOpenChange,
  className,
}: TooltipProps) {
  if (content == null) return <>{children}</>

  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <TooltipPrimitive.Trigger
        data-slot="tooltip-trigger"
        render={children as React.ReactElement}
      />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset} align={align} className="isolate z-50">
          <TooltipPrimitive.Popup
            data-slot="tooltip-content"
            className={cn(
              "z-50 max-w-64 origin-\(--transform-origin\) rounded-md bg-[var(--popover)] px-2 py-1 text-xs text-[var(--popover-foreground)] shadow-md ring-1 ring-[var(--foreground)]/10 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
              className
            )}
          >
            {content}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

export { Tooltip, TooltipProvider }
export type { TooltipProps }
