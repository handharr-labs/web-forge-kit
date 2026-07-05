"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Button } from "../atoms/button"
import { BotanicalBackdrop, OrnamentDivider } from "../atoms/ornament"

type CoverScreenProps = {
  /** e.g. "Arbi" & "Vania" — rendered together in the script face. */
  brideName: string
  groomName: string
  /** Formatted event date line, e.g. "Sabtu, 12 Desember 2026". */
  dateLabel: string
  /** Small eyebrow above the names. Default: "The Wedding Of". */
  eyebrow?: string
  /** Personalized greeting name from the guest link; shows "Kepada Yth." block. */
  guestName?: string
  /** Optional cover photo URL behind the scrim. */
  imageUrl?: string
  /** Called when the guest taps "Open Invitation" (also unlocks audio). */
  onOpen?: () => void
  openLabel?: string
  className?: string
}

/**
 * Full-viewport opening screen. The single most important "premium moment":
 * personalized greeting, couple names in script, and the gold-foil
 * Open Invitation gesture that reveals the rest of the site.
 */
export function CoverScreen({
  brideName,
  groomName,
  dateLabel,
  eyebrow = "The Wedding Of",
  guestName,
  imageUrl,
  onOpen,
  openLabel = "Open Invitation",
  className,
}: CoverScreenProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center",
        className
      )}
    >
      {imageUrl && (
        <div className="absolute inset-0" aria-hidden>
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[var(--background)]/75 backdrop-blur-[1px]" />
        </div>
      )}
      <BotanicalBackdrop />

      <div
        className="relative flex flex-col items-center"
        style={{ animation: "mekar-fade-in var(--dur-slow) var(--ease-soft) both" }}
      >
        <p className="typo-eyebrow mb-6">{eyebrow}</p>

        <h1 className="typo-script">{brideName}</h1>
        <span className="typo-display my-1 text-[var(--gold-deep)]">&amp;</span>
        <h1 className="typo-script">{groomName}</h1>

        <OrnamentDivider className="my-7" />
        <p className="typo-lead">{dateLabel}</p>

        {guestName && (
          <div
            className="mt-12 flex flex-col items-center"
            style={{ animation: "mekar-reveal-up var(--dur-reveal) var(--ease-soft) 400ms both" }}
          >
            <p className="typo-caption">Kepada Yth.</p>
            <p className="typo-display mt-1 text-2xl text-[var(--foreground)]">{guestName}</p>
          </div>
        )}

        <Button
          variant="foil"
          size="lg"
          onClick={onOpen}
          className="mt-10"
          style={{ animation: "mekar-pulse-ring 2.6s var(--ease-inout) infinite" }}
        >
          {openLabel}
        </Button>
      </div>
    </div>
  )
}
