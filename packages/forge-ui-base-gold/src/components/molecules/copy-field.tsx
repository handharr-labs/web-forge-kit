"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"

import { cn } from "../../utils/cn"
import { Button } from "../atoms/button"
import { Input } from "../atoms/input"

type ButtonVariant = React.ComponentProps<typeof Button>["variant"]
type ButtonSize = React.ComponentProps<typeof Button>["size"]

async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through */
  }
  return false
}

interface CopyButtonProps {
  /** The text copied to the clipboard. */
  value: string
  /** Button label; omit for an icon-only button. */
  children?: React.ReactNode
  copiedLabel?: string
  variant?: ButtonVariant
  size?: ButtonSize
  onCopy?: (ok: boolean) => void
  className?: string
  "aria-label"?: string
}

/** Copy-to-clipboard button with a transient copied state (icon swaps to a check). */
function CopyButton({
  value,
  children,
  copiedLabel = "Copied",
  variant = "outline",
  size,
  onCopy,
  className,
  "aria-label": ariaLabel = "Copy",
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  async function handleCopy() {
    const ok = await writeClipboard(value)
    onCopy?.(ok)
    if (!ok) return
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size ?? (children ? "default" : "icon")}
      onClick={handleCopy}
      aria-label={children ? undefined : ariaLabel}
      data-slot="copy-button"
      className={className}
    >
      {copied ? <Check className="text-[var(--success,#16a34a)]" /> : <Copy />}
      {children ? <span>{copied ? copiedLabel : children}</span> : null}
    </Button>
  )
}

interface CopyFieldProps {
  /** The value shown (read-only) and copied — e.g. a personalized guest link. */
  value: string
  label?: string
  copiedLabel?: string
  className?: string
}

/**
 * Read-only value with a trailing copy affordance — bulk guest-link display.
 * The input selects-all on focus for manual copy too.
 */
function CopyField({ value, label, copiedLabel, className }: CopyFieldProps) {
  return (
    <div data-slot="copy-field" className={cn("flex flex-col gap-1.5", className)}>
      {label && <span className="typo-label text-sm">{label}</span>}
      <div className="flex items-center gap-2">
        <Input
          readOnly
          value={value}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 font-mono text-xs"
        />
        <CopyButton value={value} copiedLabel={copiedLabel} aria-label={label ? `Copy ${label}` : "Copy"} />
      </div>
    </div>
  )
}

export { CopyButton, CopyField }
export type { CopyButtonProps, CopyFieldProps }
