// @handharr-labs/forge-ui-dos
// Standalone romantic-elegant design system for digital wedding invitations.
// Non-tiered. No dependency on any other design system.
//
// Setup: import the token stylesheet once, then wrap your tree in <DosRoot>.
//   import "@handharr-labs/forge-ui-dos/tokens/globals.css"
// Load the three font families (Cormorant Garamond, Pinyon Script, Jost) in the
// host app (next/font or <link>) — the tokens only declare the families.

// Utils
export { cn } from "./utils/cn"
export { googleCalendarUrl, icsDataUri } from "./utils/calendar"
export type { CalendarEvent } from "./utils/calendar"

// Root / scope provider
export { DosRoot } from "./providers/dos-root"
export { ToastProvider, useToast } from "./providers/toast"

// Theme catalog — palettes & typography sets
export { DOS_PALETTES, DOS_TYPESETS } from "./tokens/themes"
export type { DosPalette, DosTypeset } from "./tokens/themes"

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
export { Skeleton } from "./components/atoms/skeleton"
export { EmptyState } from "./components/atoms/empty-state"
export { PhotoFrame } from "./components/atoms/photo-frame"
export type { PhotoFrameShape } from "./components/atoms/photo-frame"
export { MusicToggle } from "./components/atoms/music-toggle"
export { LanguageToggle } from "./components/atoms/language-toggle"
export type { LanguageOption } from "./components/atoms/language-toggle"
export { SectionNav } from "./components/atoms/section-nav"
export type { SectionNavItem } from "./components/atoms/section-nav"
export { ScrollCue } from "./components/atoms/scroll-cue"
export { HashtagBanner } from "./components/atoms/hashtag-banner"
export { AddToCalendar } from "./components/atoms/add-to-calendar"

// Hooks
export { useInvitationOpen } from "./hooks/use-invitation-open"

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
export { SubmissionFeed } from "./components/organisms/submission-feed"
export type { SubmissionFeedApi } from "./components/organisms/submission-feed"
export { Gallery } from "./components/organisms/gallery"
export type { GalleryImage } from "./components/organisms/gallery"
export { Wishlist, WishlistCard } from "./components/organisms/wishlist"
export type { WishlistItem } from "./components/organisms/wishlist"
export { QuoteVerse } from "./components/organisms/quote-verse"
export { WelcomeNote } from "./components/organisms/welcome-note"
export { LiveStream } from "./components/organisms/live-stream"
export { ClosingSection } from "./components/organisms/closing"

// Composition — config-driven page assembly ("the order slip")
export { Invitation, SECTION_REGISTRY } from "./composition/invitation"
export type {
  InvitationConfig,
  InvitationLayout,
  InvitationTheme,
  InvitationChrome,
  SectionConfig,
  SectionType,
  SectionHeading,
} from "./composition/invitation"
export { sampleInvitationConfig } from "./composition/sample"
export { PRESETS } from "./composition/presets"
export type { InvitationPreset } from "./composition/presets"

// Organisms — gamification
export { TeamPoll } from "./components/organisms/team-poll"
export type { PollOption, PollResults } from "./components/organisms/team-poll"
export { TriviaQuiz } from "./components/organisms/trivia-quiz"
export type { TriviaQuestion } from "./components/organisms/trivia-quiz"
export { SongRequestWall } from "./components/organisms/song-request"
export type { SongRequest } from "./components/organisms/song-request"
export { BingoCard } from "./components/organisms/bingo-card"
export { ScratchCard } from "./components/organisms/scratch-card"
export { GuessDetail } from "./components/organisms/guess-detail"
export { PhotoChallengeWall } from "./components/organisms/photo-challenge"
export type { ChallengePhoto } from "./components/organisms/photo-challenge"
export { BestDressedVote } from "./components/organisms/best-dressed"
export type { Nominee } from "./components/organisms/best-dressed"
export { QRCheckIn } from "./components/organisms/qr-check-in"
