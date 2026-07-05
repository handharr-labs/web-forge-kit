"use client"

import * as React from "react"
import { cn } from "../utils/cn"

type ToastTone = "default" | "success"
type ToastItem = { id: number; message: React.ReactNode; tone: ToastTone }
type ToastApi = { toast: (message: React.ReactNode, opts?: { tone?: ToastTone }) => void }

const ToastCtx = React.createContext<ToastApi>({ toast: () => {} })

/**
 * Transient confirmation toasts — copy-to-clipboard, claim, vote success. Wrap a
 * subtree (or the whole invitation — the `<Invitation>` renderer does this
 * automatically) and call `useToast().toast("…")`. Outside a provider `toast`
 * is a safe no-op, so components that use it still render standalone.
 */
export function ToastProvider({
  children,
  duration = 2400,
}: {
  children: React.ReactNode
  duration?: number
}) {
  const [items, setItems] = React.useState<ToastItem[]>([])

  const toast = React.useCallback<ToastApi["toast"]>(
    (message, opts) => {
      const id = Date.now() + Math.random()
      setItems((l) => [...l, { id, message, tone: opts?.tone ?? "default" }])
      setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), duration)
    },
    [duration]
  )

  const api = React.useMemo(() => ({ toast }), [toast])

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex flex-col items-center gap-2 px-4"
        role="status"
        aria-live="polite"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto max-w-[90vw] rounded-[var(--radius-pill)] border px-4 py-2 text-sm shadow-[var(--shadow-lg)] backdrop-blur",
              t.tone === "success"
                ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary-deep)]"
                : "border-[var(--border)] bg-[var(--surface)]/95 text-[var(--foreground)]"
            )}
            style={{ animation: "dos-reveal-up var(--dur-reveal) var(--ease-soft) both" }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast(): ToastApi {
  return React.useContext(ToastCtx)
}
