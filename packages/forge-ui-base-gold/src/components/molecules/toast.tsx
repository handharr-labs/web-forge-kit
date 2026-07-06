"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

import { cn } from "../../utils/cn"

/** Enqueue transient confirmations — `useToast().add({ title, type })`. */
const useToast = ToastPrimitive.useToastManager

const TYPE_ICON: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="size-4 text-[var(--success,#16a34a)]" />,
  error: <AlertCircle className="size-4 text-[var(--destructive)]" />,
  info: <Info className="size-4 text-[var(--primary)]" />,
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport className="fixed right-4 bottom-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 outline-none">
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            toast={toast}
            // Neutralize Base UI's absolute-positioned stacking pile (!-important
            // beats its inline styles); we lay toasts out in a simple column.
            className={cn(
              "![position:relative] ![transform:none] w-full",
              "flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--popover)] p-3 text-[var(--popover-foreground)] shadow-[var(--shadow-lg)] ring-1 ring-[var(--foreground)]/5",
              "transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
            )}
          >
            {toast.type && TYPE_ICON[toast.type] && (
              <span className="mt-0.5 shrink-0">{TYPE_ICON[toast.type]}</span>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              {toast.title && (
                <ToastPrimitive.Title className="typo-label text-sm font-semibold" />
              )}
              {toast.description && (
                <ToastPrimitive.Description className="text-sm text-[var(--muted-foreground)]" />
              )}
            </div>
            <ToastPrimitive.Close
              aria-label="Dismiss"
              className="-mt-0.5 -mr-0.5 shrink-0 rounded-md p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <X className="size-3.5" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  )
}

interface ToastProviderProps {
  children: React.ReactNode
  /** Default auto-dismiss (ms). `0` disables auto-dismiss. */
  timeout?: number
  /** Max simultaneously visible; older ones collapse. */
  limit?: number
}

/**
 * Mount once near the app root. Provides the toast manager to `useToast()` and
 * renders the fixed viewport that displays enqueued toasts.
 */
function ToastProvider({ children, timeout = 5000, limit = 4 }: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider timeout={timeout} limit={limit}>
      {children}
      <ToastList />
    </ToastPrimitive.Provider>
  )
}

export { ToastProvider, useToast }
export type { ToastProviderProps }
