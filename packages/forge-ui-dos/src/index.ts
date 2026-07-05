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
export { googleCalendarUrl, icsDataUri } from "./utils/calendar"
export type { CalendarEvent } from "./utils/calendar"

// Root / scope provider
export { MekarRoot } from "./providers/mekar-root"

// Layout
export {
  InvitationColumn,
  SingleInvitation,
  SplitInvitation,
} from "./components/layout/invitation-layout"

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
export { Monogram } from "./components/atoms/monogram"
export { MusicToggle } from "./components/atoms/music-toggle"
export { LanguageToggle } from "./components/atoms/language-toggle"
export type { LanguageOption } from "./components/atoms/language-toggle"

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
export { EventDetails, EventCard } from "./components/organisms/event-details"
export type { EventSession } from "./components/organisms/event-details"
export { Guestbook } from "./components/organisms/guestbook"
export type { GuestMessage } from "./components/organisms/guestbook"
export { Gallery } from "./components/organisms/gallery"
export type { GalleryImage } from "./components/organisms/gallery"
export { Wishlist, WishlistCard } from "./components/organisms/wishlist"
export type { WishlistItem } from "./components/organisms/wishlist"
export { QuoteVerse } from "./components/organisms/quote-verse"
export { LiveStream } from "./components/organisms/live-stream"
export { ClosingSection } from "./components/organisms/closing"

// Organisms — gamification
export { TeamPoll } from "./components/organisms/team-poll"
export type { PollOption, PollResults } from "./components/organisms/team-poll"
export { TriviaQuiz } from "./components/organisms/trivia-quiz"
export type { TriviaQuestion } from "./components/organisms/trivia-quiz"
export { SongRequestWall } from "./components/organisms/song-request"
export type { SongRequest } from "./components/organisms/song-request"
export { BingoCard } from "./components/organisms/bingo-card"
