"use client"

import * as React from "react"
import {
  MekarRoot,
  Button,
  Reveal,
  Section as MekarSection,
  Sprig,
  OrnamentDivider,
  CornerFlourish,
  BotanicalBackdrop,
  Monogram,
  MusicToggle,
  LanguageToggle,
  InvitationColumn,
  CoverScreen,
  Countdown,
  CoupleProfile,
  LoveStory,
  EventDetails,
  GiftEnvelope,
  Wishlist,
  Gallery,
  Guestbook,
  QuoteVerse,
  LiveStream,
  ClosingSection,
  RsvpForm,
  TeamPoll,
  TriviaQuiz,
  SongRequestWall,
  BingoCard,
} from "./index"

/* ----------------------------------------------------------------------------
   Catalog chrome — a component gallery, NOT an assembled invitation. Each
   component is shown in isolation with a label, mirroring the other DS catalogs.
   -------------------------------------------------------------------------- */

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="typo-eyebrow">{title}</h2>
      {children}
    </section>
  )
}

function Frame({
  label,
  children,
  className = "",
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 ${className}`}
      >
        {children}
      </div>
      <p className="typo-caption">{label}</p>
    </div>
  )
}

const COLOR_TOKENS = [
  { name: "--background", label: "Canvas" },
  { name: "--surface", label: "Surface" },
  { name: "--foreground", label: "Ink" },
  { name: "--primary", label: "Sage" },
  { name: "--primary-deep", label: "Sage Deep" },
  { name: "--rose", label: "Dusty Rose" },
  { name: "--gold", label: "Muted Gold" },
  { name: "--muted-foreground", label: "Muted" },
  { name: "--border", label: "Border" },
]

const TYPO = [
  { cls: "typo-script", label: "Script — Pinyon", sample: "Vania & Arbi" },
  { cls: "typo-display", label: "Display — Cormorant", sample: "Our Love Story" },
  { cls: "typo-title", label: "Title — Cormorant 600", sample: "Mempelai" },
  { cls: "typo-lead", label: "Lead", sample: "An unhurried, elegant lead line." },
  { cls: "typo-body", label: "Body — Jost 300", sample: "Body copy set in Jost for calm, airy reading." },
  { cls: "typo-eyebrow", label: "Eyebrow", sample: "The Wedding Of" },
  { cls: "typo-caption", label: "Caption", sample: "Small supporting caption text." },
]

export function MekarCatalog() {
  const [night, setNight] = React.useState(false)
  const target = React.useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 96)
    return d
  }, [])

  return (
    <MekarRoot night={night} className="min-h-screen">
      <div className="mx-auto max-w-4xl px-5 py-8">
        {/* Breadcrumb + theme toggle */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="typo-caption hover:text-[var(--foreground)]">← Catalog</a>
            <span className="typo-caption">/</span>
            <span className="typo-caption text-[var(--foreground)]">forge-ui-dos</span>
          </div>
          <div className="flex items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--border)] p-1">
            <Button variant={night ? "ghost" : "solid"} size="sm" onClick={() => setNight(false)}>Day</Button>
            <Button variant={night ? "solid" : "ghost"} size="sm" onClick={() => setNight(true)}>Night</Button>
          </div>
        </div>

        <div className="mb-10">
          <h1 className="typo-title text-[var(--foreground)]">forge-ui-dos — Mekar</h1>
          <p className="typo-body mt-1">
            Standalone romantic-elegant design system for digital wedding invitations.
            Sage · rose · gold, botanical ornaments, soft ambient motion.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {/* Tokens — Colors */}
          <Group title="Tokens — Colors">
            <div className="flex flex-wrap gap-3">
              {COLOR_TOKENS.map((t) => (
                <div key={t.name} className="flex flex-col gap-1">
                  <div
                    className="h-12 w-20 rounded-[var(--radius)] border border-[var(--border)]"
                    style={{ background: `var(${t.name})` }}
                  />
                  <p className="typo-caption">{t.label}</p>
                </div>
              ))}
            </div>
          </Group>

          {/* Tokens — Typography */}
          <Group title="Tokens — Typography">
            <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
              {TYPO.map((t) => (
                <div key={t.cls} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-dashed border-[var(--border)] pb-3 last:border-0 last:pb-0">
                  <span className={t.cls}>{t.sample}</span>
                  <span className="typo-caption">{t.label}</span>
                </div>
              ))}
            </div>
          </Group>

          {/* Atoms — Button */}
          <Group title="Atoms — Button">
            <div className="flex flex-wrap gap-3">
              <Frame label="solid (primary CTA)"><Button variant="solid">Hadir</Button></Frame>
              <Frame label="outline"><Button variant="outline">Detail</Button></Frame>
              <Frame label="foil (Open Invitation)"><Button variant="foil">Open</Button></Frame>
              <Frame label="ghost"><Button variant="ghost">Ghost</Button></Frame>
              <Frame label="size sm"><Button size="sm">Small</Button></Frame>
              <Frame label="size lg"><Button size="lg">Large</Button></Frame>
              <Frame label="disabled"><Button disabled>Disabled</Button></Frame>
            </div>
          </Group>

          {/* Atoms — Ornaments */}
          <Group title="Atoms — Botanical Ornaments">
            <div className="flex flex-wrap gap-3">
              <Frame label="Sprig"><Sprig className="h-8 w-28" /></Frame>
              <Frame label="Sprig (flip)"><Sprig flip className="h-8 w-28" /></Frame>
              <Frame label="CornerFlourish"><CornerFlourish className="h-16 w-16" /></Frame>
              <Frame label="OrnamentDivider" className="min-w-[16rem]"><OrnamentDivider /></Frame>
              <Frame label="BotanicalBackdrop (ambient)" className="min-w-[16rem]">
                <div className="relative h-40 overflow-hidden rounded-[var(--radius)] bg-[var(--surface-2)]">
                  <BotanicalBackdrop />
                </div>
              </Frame>
            </div>
          </Group>

          {/* Atoms — Reveal & Section scaffold */}
          <Group title="Atoms — Motion & Layout">
            <Frame label="Reveal — fades up when scrolled into view">
              <Reveal>
                <p className="typo-lead">This block animates in on scroll.</p>
              </Reveal>
            </Frame>
            <Frame label="Section — centered header scaffold (eyebrow · title · divider · rhythm)" className="!p-0 overflow-hidden">
              <MekarSection eyebrow="Section Eyebrow" title="Section Title">
                <p className="typo-body text-center">Section body content sits below the header.</p>
              </MekarSection>
            </Frame>
          </Group>

          {/* Chrome atoms */}
          <Group title="Atoms — Chrome (monogram · music · language)">
            <div className="flex flex-wrap items-center gap-3">
              <Frame label="Monogram (foil initials)"><Monogram left="Vania" right="Arbi" /></Frame>
              <Frame label="MusicToggle (inline, playing)"><MusicToggle src="" floating={false} defaultPlaying /></Frame>
              <Frame label="LanguageToggle (ID/EN)"><LanguageToggle /></Frame>
            </div>
          </Group>

          {/* Layout */}
          <Group title="Layout — Invitation column & page shells">
            <Frame
              label="InvitationColumn (framed) — the phone-width body shared by SingleInvitation & SplitInvitation"
              className="!p-0 overflow-hidden bg-[var(--surface-2)]"
            >
              <div className="max-h-[420px] overflow-hidden py-6">
                <InvitationColumn framed width="22rem">
                  <div className="px-6 py-8 text-center">
                    <p className="typo-eyebrow">The Wedding Of</p>
                    <p className="typo-script !text-5xl">Vania &amp; Arbi</p>
                    <OrnamentDivider className="my-4" />
                    <p className="typo-body text-sm">
                      Single-scroll or fixed-aside split — same column, two page layouts.
                    </p>
                  </div>
                </InvitationColumn>
              </div>
            </Frame>
          </Group>

          {/* Organisms */}
          <Group title="Organisms — CoverScreen">
            <Frame label="Full-screen opener with personalized greeting (clipped preview)" className="!p-0 overflow-hidden">
              <div className="relative h-[560px] overflow-hidden">
                <CoverScreen
                  brideName="Vania"
                  groomName="Arbi"
                  dateLabel="Sabtu · 12 Desember 2026"
                  guestName="Keluarga Handharmahua"
                  onOpen={() => {}}
                />
              </div>
            </Frame>
          </Group>

          <Group title="Organisms — Countdown">
            <Frame label="Live countdown to nearest session">
              <Countdown target={target} />
            </Frame>
          </Group>

          <Group title="Organisms — CoupleProfile">
            <Frame label="Both partners with framed photos + ampersand flourish">
              <CoupleProfile
                bride={{ name: "Vania", fullName: "Vania Ayu Lestari", parentage: "Putri dari Bpk. Hendra & Ibu Sari", instagram: "vania" }}
                groom={{ name: "Arbi", fullName: "Arbi Ramadhan", parentage: "Putra dari Bpk. Rudi & Ibu Wati", instagram: "arbi" }}
              />
            </Frame>
          </Group>

          <Group title="Organisms — LoveStory">
            <Frame label="Scroll-revealed timeline with gold spine">
              <LoveStory
                milestones={[
                  { period: "2019", title: "First Meet", body: "Dipertemukan di sebuah acara kampus." },
                  { period: "2022", title: "The Journey", body: "Menjalani hubungan jarak jauh penuh kesabaran." },
                  { period: "2026", title: "Forever", body: "Memutuskan melangkah ke jenjang pernikahan." },
                ]}
              />
            </Frame>
          </Group>

          <Group title="Organisms — GiftEnvelope">
            <Frame label="Account cards with copy-to-clipboard">
              <GiftEnvelope
                accounts={[
                  { provider: "BCA", number: "1234 5678 90", holder: "Vania Ayu Lestari" },
                  { provider: "GoPay", number: "0812 3456 7890", holder: "Arbi Ramadhan" },
                ]}
              />
            </Frame>
          </Group>

          <Group title="Organisms — RsvpForm">
            <Frame label="Attendance form with segmented control + confirmation state">
              <RsvpForm defaultName="Keluarga Handharmahua" onSubmit={() => {}} />
            </Frame>
          </Group>

          <Group title="Organisms — EventDetails">
            <Frame label="Ceremony sessions with map + add-to-calendar actions">
              <EventDetails
                sessions={[
                  {
                    title: "Akad Nikah",
                    dateLabel: "Sabtu, 12 Desember 2026",
                    timeLabel: "08.00 – 10.00 WIB",
                    venueName: "Masjid Agung",
                    address: "Jl. Merdeka No. 1, Bandung",
                    mapsUrl: "https://maps.google.com",
                    calendar: {
                      title: "Akad Nikah Vania & Arbi",
                      start: "2026-12-12T08:00:00",
                      end: "2026-12-12T10:00:00",
                      location: "Masjid Agung, Bandung",
                    },
                  },
                  {
                    title: "Resepsi",
                    dateLabel: "Sabtu, 12 Desember 2026",
                    timeLabel: "11.00 – 14.00 WIB",
                    venueName: "Balai Sartika",
                    address: "Jl. Merdeka No. 2, Bandung",
                    mapsUrl: "https://maps.google.com",
                  },
                ]}
              />
            </Frame>
          </Group>

          <Group title="Organisms — Gallery">
            <Frame label="Thumbnail grid → full-screen lightbox with position indicator">
              <Gallery
                images={Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/mekar${i}/400/400`)}
              />
            </Frame>
          </Group>

          <Group title="Organisms — Wishlist">
            <Frame label="Claimable gift items (unclaimed + already-claimed)">
              <Wishlist
                items={[
                  { id: "1", name: "Coffee Machine", description: "Espresso maker untuk pagi berdua.", price: "± Rp 2.500.000", shopUrl: "https://example.com" },
                  { id: "2", name: "Air Purifier", description: "Udara bersih di rumah baru.", price: "± Rp 1.200.000", claimedBy: "Keluarga Sari" },
                ]}
                onClaim={() => {}}
              />
            </Frame>
          </Group>

          <Group title="Organisms — Guestbook (Doa & Ucapan)">
            <Frame label="Submit form over a scrolling feed of wishes">
              <Guestbook
                messages={[
                  { name: "Rani", message: "Selamat menempuh hidup baru! 🤍" },
                  { name: "Dimas", message: "Bahagia selalu untuk kalian berdua." },
                ]}
                onSubmit={() => {}}
              />
            </Frame>
          </Group>

          <Group title="Organisms — QuoteVerse">
            <Frame label="Decorative verse block framed by botanical dividers">
              <QuoteVerse source="QS. Ar-Rum: 21">
                &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan
                untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram
                kepadanya…&rdquo;
              </QuoteVerse>
            </Frame>
          </Group>

          <Group title="Organisms — LiveStream">
            <Frame label="Prominent live-streaming CTA with pulsing live dot">
              <LiveStream
                url="https://youtube.com"
                platform="YouTube Live"
                note="Bagi yang berhalangan hadir, saksikan momen kami secara langsung."
              />
            </Frame>
          </Group>

          <Group title="Organisms — ClosingSection">
            <Frame label="Thank-you, monogram, names, hashtag">
              <ClosingSection
                brideName="Vania"
                groomName="Arbi"
                hashtag="#VaniaArbi2026"
                message="Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu berkenan hadir memberikan doa restu."
              />
            </Frame>
          </Group>

          <Group title="Organisms — TeamPoll (gamification)">
            <Frame label="Team Bride vs Team Groom — vote reveals live standings">
              <TeamPoll
                eyebrow="After reading our story, it's time to choose your side!"
                title="Which team are you?"
                description="Team Groom — quietly noticing from afar, secretly crushing long before making a move? Or Team Bride — blissfully unbothered, but once pursued with intention, ready to say yes to forever?"
                options={[
                  { id: "bride", label: "Team Bride", tagline: "Unbothered, Then Married", icon: "🌸", accent: "rose" },
                  { id: "groom", label: "Team Groom", tagline: "Quietly Crushing First", icon: "🌿", accent: "sage" },
                ]}
                results={{ bride: 82, groom: 55 }}
                footnote="Results may or may not become a lifelong debate."
                onVote={() => {}}
              />
            </Frame>
          </Group>

          <Group title="Organisms — TriviaQuiz (gamification)">
            <Frame label="Multiple-choice quiz with inline right/wrong + final score">
              <TriviaQuiz
                questions={[
                  { question: "Di mana kami pertama bertemu?", options: ["Kampus", "Kantor", "Kafe", "Online"], answerIndex: 0 },
                  { question: "Siapa yang menembak duluan?", options: ["Arbi", "Vania"], answerIndex: 0 },
                ]}
                onComplete={() => {}}
              />
            </Frame>
          </Group>

          <Group title="Organisms — SongRequestWall (gamification)">
            <Frame label="Reception playlist requests over a scrolling list">
              <SongRequestWall
                requests={[
                  { title: "Perfect", artist: "Ed Sheeran", from: "Rani" },
                  { title: "Akhir Cerita Cinta", artist: "Glenn Fredly" },
                ]}
                onSubmit={() => {}}
              />
            </Frame>
          </Group>

          <Group title="Organisms — BingoCard (gamification)">
            <Frame label="5×5 reception bingo — tap moments, detects a completed line">
              <BingoCard
                cells={[
                  "Pengantin menangis", "Ada yang telat", "Lagu dangdut", "Foto kabur", "Anak kecil lari",
                  "MC salah nama", "Selfie booth", "Buket dilempar", "Makanan habis", "Tamu joget",
                  "Pidato panjang", "Tiba-tiba hujan", "Free space", "Cincin susah", "Tepuk tangan",
                  "Doa haru", "Kue dipotong", "Tos sampanye", "Video call", "Sepatu copot",
                  "Konfeti", "Ketawa lepas", "Baju kembaran", "Salaman lama", "Momen haru",
                ]}
                onBingo={() => {}}
              />
            </Frame>
          </Group>
        </div>
      </div>
    </MekarRoot>
  )
}

export default MekarCatalog
