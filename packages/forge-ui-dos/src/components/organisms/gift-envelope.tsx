"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { Button } from "../atoms/button"

export type GiftAccount = {
  /** e.g. "BCA", "GoPay", "Bank Mandiri". */
  provider: string
  /** Account / phone number to copy. */
  number: string
  /** Account holder name. */
  holder: string
  /** Optional QR image (e-wallet). */
  qrUrl?: string
}

/** One account card with a copy-to-clipboard number — the signature interaction. */
export function GiftCard({ account }: { account: GiftAccount }) {
  const [copied, setCopied] = React.useState(false)

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(account.number.replace(/\s+/g, ""))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — no-op */
    }
  }, [account.number])

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between">
        <span className="font-[var(--font-display)] text-xl font-600 text-[var(--foreground)]">
          {account.provider}
        </span>
        {account.qrUrl && (
          <img src={account.qrUrl} alt="QR" className="h-12 w-12 rounded-md object-cover" />
        )}
      </div>

      <p className="mt-5 font-[var(--font-body)] text-2xl tracking-[0.15em] tabular-nums text-[var(--foreground)]">
        {account.number}
      </p>
      <p className="typo-caption mt-1">a.n. {account.holder}</p>

      <Button
        variant={copied ? "solid" : "outline"}
        size="sm"
        onClick={copy}
        className="mt-5 w-full"
      >
        {copied ? "Copied ✓" : "Copy Number"}
      </Button>
    </div>
  )
}

/** Digital gift envelope — stacked account cards with a warm intro. */
export function GiftEnvelope({
  accounts,
  note,
  className,
}: {
  accounts: GiftAccount[]
  note?: React.ReactNode
  className?: string
}) {
  return (
    <Reveal className={cn("space-y-4", className)}>
      {note && <p className="typo-body mb-8 text-center text-sm">{note}</p>}
      {accounts.map((a, i) => (
        <GiftCard key={`${a.provider}-${i}`} account={a} />
      ))}
    </Reveal>
  )
}
