// @handharr-labs/forge-ui-dos
// Standalone romantic-elegant design system for digital wedding invitations.
// Non-tiered. No dependency on any other design system.
//
// Setup: import the token stylesheet once, then wrap your tree in <MekarRoot>.
//   import "@handharr-labs/forge-ui-dos/tokens/globals.css"
// Load the three font families (Cormorant Garamond, Pinyon Script, Jost) in the
// host app (next/font or <link>) — the tokens only declare the families.

// Utils
export { cn } from "./utils/cn"

// Root / scope provider
export { MekarRoot } from "./providers/mekar-root"

// Atoms
export { Button, buttonVariants } from "./components/atoms/button"
export type { ButtonProps } from "./components/atoms/button"
export { Reveal } from "./components/atoms/reveal"
export { Section } from "./components/atoms/section"
export {
  Sprig,
  OrnamentDivider,
  CornerFlourish,
  BotanicalBackdrop,
} from "./components/atoms/ornament"

// Organisms
export { CoverScreen } from "./components/organisms/cover-screen"
export { Countdown } from "./components/organisms/countdown"
export { CoupleProfile, ProfileCard } from "./components/organisms/couple-profile"
export type { PartnerProfile } from "./components/organisms/couple-profile"
export { LoveStory } from "./components/organisms/love-story"
export type { StoryMilestone } from "./components/organisms/love-story"
export { GiftEnvelope, GiftCard } from "./components/organisms/gift-envelope"
export type { GiftAccount } from "./components/organisms/gift-envelope"
export { RsvpForm } from "./components/organisms/rsvp-form"
export type { RsvpValue } from "./components/organisms/rsvp-form"
