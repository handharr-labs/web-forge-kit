"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { CornerFlourish } from "../atoms/ornament"

export type PartnerProfile = {
  name: string
  fullName?: string
  /** e.g. "Putri dari Bpk. … & Ibu …" */
  parentage?: string
  bio?: string
  photoUrl?: string
  instagram?: string
}

/** One partner card — framed photo, name in display serif, parentage + bio. */
export function ProfileCard({
  partner,
  delay = 0,
  className,
}: {
  partner: PartnerProfile
  delay?: number
  className?: string
}) {
  return (
    <Reveal
      delay={delay}
      className={cn(
        "relative mx-auto flex max-w-xs flex-col items-center text-center",
        className
      )}
    >
      <div className="relative mb-6">
        <CornerFlourish className="absolute -left-6 -top-6 h-14 w-14 opacity-60" />
        <CornerFlourish
          className="absolute -bottom-6 -right-6 h-14 w-14 opacity-60"
          style={{ transform: "rotate(180deg)" }}
        />
        <div className="h-44 w-44 overflow-hidden rounded-full border border-[var(--gold)]/50 p-1.5 shadow-[var(--shadow-md)]">
          {partner.photoUrl ? (
            <img
              src={partner.photoUrl}
              alt={partner.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--primary-soft)] font-[var(--font-script)] text-5xl text-[var(--primary-deep)]">
              {partner.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <h3 className="typo-display text-3xl text-[var(--foreground)]">{partner.name}</h3>
      {partner.fullName && (
        <p className="typo-body mt-1 !text-[0.95rem] font-normal">{partner.fullName}</p>
      )}
      {partner.parentage && <p className="typo-caption mt-3">{partner.parentage}</p>}
      {partner.bio && <p className="typo-body mt-4 text-sm">{partner.bio}</p>}
      {partner.instagram && (
        <a
          href={`https://instagram.com/${partner.instagram.replace(/^@/, "")}`}
          target="_blank"
          rel="noreferrer"
          className="typo-caption mt-4 inline-flex items-center gap-1 text-[var(--primary-deep)] underline-offset-4 hover:underline"
        >
          @{partner.instagram.replace(/^@/, "")}
        </a>
      )}
    </Reveal>
  )
}

/** Both partners with an ampersand flourish between them. */
export function CoupleProfile({
  bride,
  groom,
  className,
}: {
  bride: PartnerProfile
  groom: PartnerProfile
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center gap-14", className)}>
      <ProfileCard partner={bride} />
      <span className="typo-script text-5xl text-[var(--gold-deep)]">&amp;</span>
      <ProfileCard partner={groom} delay={120} />
    </div>
  )
}
