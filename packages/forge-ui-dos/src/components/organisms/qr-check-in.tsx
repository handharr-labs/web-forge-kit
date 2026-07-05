"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { Button } from "../atoms/button"

/**
 * QR check-in gamification — the guest's personal QR to present at the venue
 * entrance, plus a check-in status. The DS presents; the host generates the
 * actual QR (from the guest's token/URL) and passes it as `qrSrc` — a dashed
 * placeholder shows until then. Controlled-optional: pass `checkedIn`, or let
 * the optional "I've arrived" button flip local state via `onCheckIn`.
 */
export function QRCheckIn({
  eyebrow = "Check-in",
  title,
  guestName,
  code,
  qrSrc,
  checkedIn = false,
  onCheckIn,
  instructions = "Tunjukkan QR ini di pintu masuk.",
  checkInLabel = "Saya sudah tiba",
  checkedInLabel = "Checked in",
  className,
}: {
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  guestName?: React.ReactNode
  /** Human-readable code shown under the QR. */
  code?: React.ReactNode
  /** Host-generated QR image (data URI or URL). */
  qrSrc?: string
  checkedIn?: boolean
  onCheckIn?: () => Promise<void> | void
  instructions?: React.ReactNode
  checkInLabel?: string
  checkedInLabel?: React.ReactNode
  className?: string
}) {
  const [localDone, setLocalDone] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const done = localDone || checkedIn

  async function check() {
    if (done || pending) return
    setPending(true)
    try {
      await onCheckIn?.()
      setLocalDone(true)
    } finally {
      setPending(false)
    }
  }

  return (
    <Reveal
      className={cn(
        "mx-auto max-w-sm rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-md)]",
        className
      )}
    >
      {eyebrow && <p className="typo-eyebrow text-[var(--rose-deep)]">{eyebrow}</p>}
      {title && (
        <h3 className="typo-display mt-1 text-2xl text-[var(--foreground)]">{title}</h3>
      )}
      {guestName && <p className="typo-lead mt-2">{guestName}</p>}

      <div className="mx-auto mt-6 flex aspect-square w-48 items-center justify-center overflow-hidden rounded-[var(--radius)] border border-[var(--gold)]/50 bg-white p-2 shadow-[var(--shadow-sm)]">
        {qrSrc ? (
          <img src={qrSrc} alt="Check-in QR code" className="h-full w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[color:#8a8577]">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" aria-hidden>
              <path
                d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h3v3h-3v-3zm3 3h3v3h-3v-3zm0-3h3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="typo-caption !text-[0.65rem]">QR code</span>
          </div>
        )}
      </div>

      {code && <p className="typo-caption mt-3 tracking-[0.2em]">{code}</p>}

      {done ? (
        <p className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--primary-soft)] px-4 py-2 text-sm font-medium text-[var(--primary-deep)]">
          <span aria-hidden>✓</span> {checkedInLabel}
        </p>
      ) : (
        <>
          {instructions && <p className="typo-body mt-4 text-sm">{instructions}</p>}
          {onCheckIn && (
            <Button variant="solid" size="sm" className="mt-5" onClick={check} disabled={pending}>
              {pending ? "…" : checkInLabel}
            </Button>
          )}
        </>
      )}
    </Reveal>
  )
}
