"use client"

import * as React from "react"
import * as Bronze from "@handharr-labs/forge-ui-base-bronze"
import * as Silver from "@handharr-labs/forge-ui-base-silver"
import * as Gold from "@handharr-labs/forge-ui-base-gold"

const TIERS = {
  bronze: Bronze,
  silver: Silver,
  gold: Gold,
} as const

export type Tier = keyof typeof TIERS

interface TierContextValue {
  tier: Tier
  setTier: (tier: Tier) => void
}

const TierContext = React.createContext<TierContextValue>({
  tier: "silver",
  setTier: () => {},
})

export function TierProvider({
  children,
  defaultTier = "silver",
}: {
  children: React.ReactNode
  defaultTier?: Tier
}) {
  const [tier, setTier] = React.useState<Tier>(defaultTier)
  return (
    <TierContext.Provider value={{ tier, setTier }}>
      {children}
    </TierContext.Provider>
  )
}

export function useTier() {
  return React.useContext(TierContext)
}

// Returns the active tier's component namespace typed as Gold (the superset).
// Safe because all tier packages export an identical component API —
// Gold merely adds Skeleton + ThemeProvider, which the shared catalog never uses.
export function useTierComponents(): typeof Gold {
  const { tier } = useTier()
  return TIERS[tier] as unknown as typeof Gold
}
