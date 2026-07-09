"use client"

import * as React from "react"
import { DosRoot } from "../providers/dos-root"
import { ToastProvider } from "../providers/toast"
import { Section } from "../components/atoms/section"
import { BotanicalBackdrop } from "../components/atoms/ornament"
import { MusicToggle } from "../components/atoms/music-toggle"
import { LanguageToggle } from "../components/atoms/language-toggle"
import type { LanguageOption } from "../components/atoms/language-toggle"
import { SectionNav } from "../components/atoms/section-nav"
import type { SectionNavItem } from "../components/atoms/section-nav"
import { useInvitationOpen } from "../hooks/use-invitation-open"
import type { DosPalette, DosTypeset } from "../tokens/themes"
import {
  SingleInvitation,
  SplitInvitation,
} from "../components/layout/invitation-layout"

import { CoverScreen } from "../components/organisms/cover-screen"
import { WelcomeNote } from "../components/organisms/welcome-note"
import { Countdown } from "../components/organisms/countdown"
import { CoupleProfile } from "../components/organisms/couple-profile"
import { LoveStory } from "../components/organisms/love-story"
import { EventDetails } from "../components/organisms/event-details"
import { GiftEnvelope } from "../components/organisms/gift-envelope"
import { RsvpForm } from "../components/organisms/rsvp-form"
import { Guestbook } from "../components/organisms/guestbook"
import { Gallery } from "../components/organisms/gallery"
import { Wishlist } from "../components/organisms/wishlist"
import { QuoteVerse } from "../components/organisms/quote-verse"
import { LiveStream } from "../components/organisms/live-stream"
import { ClosingSection } from "../components/organisms/closing"
import { TeamPoll } from "../components/organisms/team-poll"
import { TriviaQuiz } from "../components/organisms/trivia-quiz"
import { SongRequestWall } from "../components/organisms/song-request"
import { BingoCard } from "../components/organisms/bingo-card"
import { ScratchCard } from "../components/organisms/scratch-card"
import { GuessDetail } from "../components/organisms/guess-detail"
import { PhotoChallengeWall } from "../components/organisms/photo-challenge"
import { BestDressedVote } from "../components/organisms/best-dressed"
import { QRCheckIn } from "../components/organisms/qr-check-in"
import { SECTION_CATALOG } from "./section-catalog"
import { DosLanguageProvider } from "../providers/language"
import {
  resolveSectionProps,
  resolveLocalized,
  DEFAULT_LANG,
} from "../utils/localized"

/* ----------------------------------------------------------------------------
   The "menu": every orderable section type mapped to its props. Deriving props
   from the components themselves keeps this in lock-step with the organisms —
   no separate prop types to maintain.
   -------------------------------------------------------------------------- */

export type SectionPropsMap = {
  cover: React.ComponentProps<typeof CoverScreen>
  welcome: React.ComponentProps<typeof WelcomeNote>
  couple: React.ComponentProps<typeof CoupleProfile>
  loveStory: React.ComponentProps<typeof LoveStory>
  event: React.ComponentProps<typeof EventDetails>
  countdown: React.ComponentProps<typeof Countdown>
  rsvp: React.ComponentProps<typeof RsvpForm>
  guestbook: React.ComponentProps<typeof Guestbook>
  gallery: React.ComponentProps<typeof Gallery>
  gift: React.ComponentProps<typeof GiftEnvelope>
  wishlist: React.ComponentProps<typeof Wishlist>
  quote: React.ComponentProps<typeof QuoteVerse>
  liveStream: React.ComponentProps<typeof LiveStream>
  closing: React.ComponentProps<typeof ClosingSection>
  teamPoll: React.ComponentProps<typeof TeamPoll>
  triviaQuiz: React.ComponentProps<typeof TriviaQuiz>
  songRequest: React.ComponentProps<typeof SongRequestWall>
  bingo: React.ComponentProps<typeof BingoCard>
  scratchCard: React.ComponentProps<typeof ScratchCard>
  guessDetail: React.ComponentProps<typeof GuessDetail>
  photoChallenge: React.ComponentProps<typeof PhotoChallengeWall>
  bestDressed: React.ComponentProps<typeof BestDressedVote>
  qrCheckIn: React.ComponentProps<typeof QRCheckIn>
}

export type SectionType = keyof SectionPropsMap

/** Header shell the renderer wraps around a section (ignored for full-bleed). */
export type SectionHeading = {
  eyebrow?: string
  title?: string
  tone?: "canvas" | "surface"
  divider?: boolean
}

/** One entry on the order slip: a section type + its props, optionally toggled. */
export type SectionConfig = {
  [K in SectionType]: {
    type: K
    props: SectionPropsMap[K]
    /** Default true. Set false to keep it on the slip but not render it. */
    enabled?: boolean
    /** Centered header shell; ignored for full-bleed sections. */
    heading?: SectionHeading
    /** Stable anchor id for section-nav / deep links. Defaults to `dos-<type>-<i>`. */
    id?: string
    /** Label in the section-nav rail. Defaults to the heading title, then a per-type name. */
    navLabel?: string
    /** Set false to drop this section from the nav rail. Default true. */
    nav?: boolean
  }
}[SectionType]

type RegistryEntry = {
  component: React.ComponentType<any>
  /** Renders raw (no `Section` header shell) — full-bleed or self-headed. */
  bare?: boolean
}

/**
 * The registry — the DS's "menu". `bare` sections manage their own full-bleed
 * layout / header (cover, closing, team poll); the rest are wrapped in the
 * shared `Section` header scaffold by the renderer.
 */
export const SECTION_REGISTRY: Record<SectionType, RegistryEntry> = {
  cover: { component: CoverScreen, bare: true },
  welcome: { component: WelcomeNote },
  couple: { component: CoupleProfile },
  loveStory: { component: LoveStory },
  event: { component: EventDetails },
  countdown: { component: Countdown },
  rsvp: { component: RsvpForm },
  guestbook: { component: Guestbook },
  gallery: { component: Gallery },
  gift: { component: GiftEnvelope },
  wishlist: { component: Wishlist },
  quote: { component: QuoteVerse },
  liveStream: { component: LiveStream },
  closing: { component: ClosingSection, bare: true },
  teamPoll: { component: TeamPoll, bare: true },
  triviaQuiz: { component: TriviaQuiz },
  songRequest: { component: SongRequestWall },
  bingo: { component: BingoCard },
  scratchCard: { component: ScratchCard },
  guessDetail: { component: GuessDetail },
  photoChallenge: { component: PhotoChallengeWall },
  bestDressed: { component: BestDressedVote },
  qrCheckIn: { component: QRCheckIn },
}

/* ----------------------------------------------------------------------------
   The order slip: layout (cup size) + theme (variant + sugar) + ordered
   sections (the drink + toppings).
   -------------------------------------------------------------------------- */

export type InvitationLayout =
  | { type: "single"; framed?: boolean; width?: string }
  | {
      type: "split"
      /** Decorative fixed-aside image (portrait / hero). Falls back to botanicals. */
      asideImageUrl?: string
      asideSide?: "left" | "right"
      width?: string
    }

export type InvitationTheme = {
  /** Evening "night garden" palette. */
  night?: boolean
  /** Named color palette (sage · rose · terracotta · dusk · crimson). */
  palette?: DosPalette
  /** Named typography set (classic · modern · romantic · editorial). */
  typeface?: DosTypeset
  /** Per-brand hue knobs — retint without touching code. */
  hue?: { sage?: number; rose?: number; gold?: number }
}

/** Persistent overlay chrome that sits above the scrolling body. */
export type InvitationChrome = {
  /** Background-music control. `autoplay` (default true) starts it on cover Open. */
  music?: { src?: string; autoplay?: boolean }
  /** Language switch. `true` uses the ID/EN default; pass options to customise. */
  language?: LanguageOption[] | boolean
  /** Section-nav dot rail, derived from the section list. */
  nav?: boolean
  navSide?: "left" | "right"
}

export type InvitationConfig = {
  /** Page shell. Defaults to a single centered column. */
  layout?: InvitationLayout
  theme?: InvitationTheme
  /** Persistent floating chrome (music · language · section nav). */
  chrome?: InvitationChrome
  /** Ordered list of section blocks — the body of the invitation. */
  sections: SectionConfig[]
}

/** Default decorative panel for the split layout's fixed aside. */
function InvitationAside({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className="relative h-full w-full bg-[var(--surface-2)]">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <BotanicalBackdrop />
      )}
    </div>
  )
}

/**
 * The "barista" — reads an {@link InvitationConfig} and assembles the whole page
 * from the registered sections. Scopes everything under `DosRoot`, applies the
 * chosen layout shell, and wraps non-full-bleed sections in the `Section`
 * header scaffold. Data-only configs (no `on*` handlers) still render a fully
 * working, optimistic preview — the app layers persistence on top.
 */
export function Invitation({
  config,
  className,
}: {
  config: InvitationConfig
  className?: string
}) {
  const { layout = { type: "single" }, theme = {}, chrome, sections } = config

  const { open, musicPlaying, setMusicPlaying } = useInvitationOpen({
    autoplayMusic: chrome?.music?.autoplay,
  })

  // Active language for bilingual copy. Seeded from the first configured option
  // (falls back to the default); the LanguageToggle drives it, the resolver
  // swaps `localizable` fields per section.
  const langOptions = Array.isArray(chrome?.language) ? chrome.language : undefined
  const [lang, setLang] = React.useState(
    () => langOptions?.[0]?.code ?? DEFAULT_LANG
  )

  const hueStyle: React.CSSProperties = {}
  if (theme.hue?.sage != null)
    (hueStyle as Record<string, string | number>)["--sage-hue"] = theme.hue.sage
  if (theme.hue?.rose != null)
    (hueStyle as Record<string, string | number>)["--rose-hue"] = theme.hue.rose
  if (theme.hue?.gold != null)
    (hueStyle as Record<string, string | number>)["--gold-hue"] = theme.hue.gold

  const visible = sections.filter((s) => s.enabled !== false)
  const idOf = (s: SectionConfig, i: number) => s.id ?? `dos-${s.type}-${i}`

  const body = visible.map((s, i) => {
    const id = idOf(s, i)
    const entry = SECTION_REGISTRY[s.type]
    const Component = entry.component

    // Resolve per-language copy for the active language before rendering, so
    // organisms stay language-agnostic (they receive plain resolved strings).
    let props = resolveSectionProps(
      s.props,
      SECTION_CATALOG[s.type].fields,
      lang
    ) as Record<string, unknown>

    // The cover's Open gesture is the audio-unlock moment.
    if (s.type === "cover" && chrome?.music) {
      const original = props.onOpen as (() => void) | undefined
      props = {
        ...props,
        onOpen: () => {
          original?.()
          open()
        },
      }
    }

    const node = <Component {...props} />
    if (entry.bare) {
      return (
        <div key={i} id={id}>
          {node}
        </div>
      )
    }
    const h = s.heading ?? {}
    return (
      <Section
        key={i}
        id={id}
        eyebrow={resolveLocalized(h.eyebrow, lang)}
        title={resolveLocalized(h.title, lang)}
        tone={h.tone}
        divider={h.divider}
      >
        {node}
      </Section>
    )
  })

  const navItems: SectionNavItem[] = chrome?.nav
    ? visible
        .map((s, i) => ({ s, i }))
        .filter(({ s }) => s.nav !== false)
        .map(({ s, i }) => ({
          id: idOf(s, i),
          label:
            resolveLocalized(s.navLabel ?? s.heading?.title, lang) ??
            SECTION_CATALOG[s.type].navLabel,
        }))
    : []

  const shell =
    layout.type === "split" ? (
      <SplitInvitation
        asideSide={layout.asideSide}
        width={layout.width}
        aside={<InvitationAside imageUrl={layout.asideImageUrl} />}
      >
        {body}
      </SplitInvitation>
    ) : (
      <SingleInvitation framed={layout.framed} width={layout.width}>
        {body}
      </SingleInvitation>
    )

  const hasTopBar = Boolean(chrome?.language || chrome?.music)

  return (
    <DosRoot
      night={theme.night}
      palette={theme.palette}
      typeface={theme.typeface}
      style={hueStyle}
      className={className}
    >
      <DosLanguageProvider value={lang} onChange={setLang}>
        <ToastProvider>
          {shell}

          {hasTopBar && (
            <div className="fixed right-4 top-4 z-40 flex items-center gap-2">
              {chrome?.language && (
                <LanguageToggle
                  value={lang}
                  onChange={setLang}
                  options={langOptions}
                />
              )}
              {chrome?.music && (
                <MusicToggle
                  src={chrome.music.src}
                  floating={false}
                  playing={musicPlaying}
                  onToggle={setMusicPlaying}
                />
              )}
            </div>
          )}

          {navItems.length > 0 && (
            <SectionNav items={navItems} side={chrome?.navSide} />
          )}
        </ToastProvider>
      </DosLanguageProvider>
    </DosRoot>
  )
}
