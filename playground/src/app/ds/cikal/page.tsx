"use client"

import "@handharr-labs/ui-cikal-showcase/tokens/globals.css"
import "@handharr-labs/forge-ui-base-bronze/tokens/globals.css"
import "@handharr-labs/forge-ui-base-silver/tokens/globals.css"
import "@handharr-labs/forge-ui-base-gold/tokens/globals.css"
import { TierProvider, CikalShowcase } from "@handharr-labs/ui-cikal-showcase"

export default function CikalPage() {
  return (
    <TierProvider defaultTier="silver">
      <CikalShowcase />
    </TierProvider>
  )
}
