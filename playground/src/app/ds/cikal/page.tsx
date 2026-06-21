"use client"

import { TierProvider, CikalShowcase } from "@handharr-labs/ui-cikal-showcase"

export default function CikalPage() {
  return (
    <TierProvider defaultTier="silver">
      <CikalShowcase />
    </TierProvider>
  )
}
