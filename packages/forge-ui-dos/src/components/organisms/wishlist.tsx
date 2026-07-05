"use client"

import * as React from "react"
import { cn } from "../../utils/cn"
import { Reveal } from "../atoms/reveal"
import { Button, buttonVariants } from "../atoms/button"
import { useToast } from "../../providers/toast"

export type WishlistItem = {
  id: string
  name: string
  description?: string
  /** Free-form price label, e.g. "± Rp 1.500.000". */
  price?: string
  imageUrl?: string
  /** External shopping link. */
  shopUrl?: string
  /** Claimant name if already taken. */
  claimedBy?: string
}

/**
 * One wishlist item with a claim flow: an unclaimed item shows "Saya ambil ini"
 * → a name input → confirmation. Once claimed it dims and shows the claimant so
 * guests avoid duplicate gifts. `onClaim` lets the host persist the claim.
 */
export function WishlistCard({
  item,
  onClaim,
  className,
}: {
  item: WishlistItem
  onClaim?: (id: string, name: string) => Promise<void> | void
  className?: string
}) {
  const [claimedBy, setClaimedBy] = React.useState(item.claimedBy)
  const [asking, setAsking] = React.useState(false)
  const [name, setName] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const claimed = Boolean(claimedBy)
  const { toast } = useToast()

  async function claim() {
    if (!name.trim()) return
    setBusy(true)
    try {
      await onClaim?.(item.id, name.trim())
      setClaimedBy(name.trim())
      setAsking(false)
      toast(`Terima kasih! "${item.name}" tercatat 🤍`, { tone: "success" })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className={cn(
        "flex gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] transition-opacity",
        claimed && "opacity-70",
        className
      )}
    >
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-20 w-20 shrink-0 rounded-[var(--radius)] object-cover"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="font-[var(--font-display)] text-lg text-[var(--foreground)]">{item.name}</p>
          {claimed && (
            <span className="typo-caption shrink-0 rounded-[var(--radius-pill)] bg-[var(--primary-soft)] px-2 py-0.5 text-[var(--primary-deep)]">
              Diambil
            </span>
          )}
        </div>
        {item.description && <p className="typo-body mt-0.5 text-sm">{item.description}</p>}
        {item.price && <p className="typo-caption mt-1">{item.price}</p>}

        {claimed ? (
          <p className="typo-caption mt-2 italic">oleh {claimedBy}</p>
        ) : asking ? (
          <div className="mt-3 flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama"
              aria-label="Nama"
              className="min-w-0 flex-1 rounded-[var(--radius-sm)] border border-[var(--input)] bg-[var(--surface)] px-3 py-1.5 text-sm outline-none focus:border-[var(--primary)]"
            />
            <Button size="sm" variant="solid" onClick={claim} disabled={busy}>
              {busy ? "…" : "OK"}
            </Button>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setAsking(true)}>
              Saya ambil ini
            </Button>
            {item.shopUrl && (
              <a
                href={item.shopUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Lihat
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/** Gift wishlist — stacked claimable items. */
export function Wishlist({
  items,
  onClaim,
  note,
  className,
}: {
  items: WishlistItem[]
  onClaim?: (id: string, name: string) => Promise<void> | void
  note?: React.ReactNode
  className?: string
}) {
  return (
    <Reveal className={cn("space-y-3", className)}>
      {note && <p className="typo-body mb-6 text-center text-sm">{note}</p>}
      {items.map((it) => (
        <WishlistCard key={it.id} item={it} onClaim={onClaim} />
      ))}
    </Reveal>
  )
}
