"use client"

import * as React from "react"
import { useTierComponents, useTier } from "./tier/tier-context"
import { TierSwitcher } from "./tier/tier-switcher"
import { cn } from "./utils/cn"
import type { EventCardProps } from "@handharr-labs/ui-base-bronze"

// ── Brand assets ──────────────────────────────────────────────────────────────

function CikalLogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="6" fill="var(--primary)" />
      <path d="M9 19L14 9l5 10" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="11" y1="15" x2="17" y2="15" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Section({
  title,
  tierInvariant = false,
  children,
}: {
  title: string
  tierInvariant?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="mb-14">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[var(--border)]">
        <h2 className="typo-section-label text-[var(--muted-foreground)]">{title}</h2>
        {tierInvariant && (
          <span className="typo-badge rounded-full border border-[var(--border)] bg-[var(--muted)] px-2 py-0.5 text-[var(--muted-foreground)]">
            Same across all tiers
          </span>
        )}
      </div>
      {children}
    </section>
  )
}

function PreviewCard({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "rounded-xl border border-[var(--border)] p-5 flex items-center justify-center min-h-[80px]",
          className
        )}
      >
        {children}
      </div>
      <p className="typo-caption text-center">{label}</p>
    </div>
  )
}

// ── Token data ─────────────────────────────────────────────────────────────────

const COLOR_TOKENS = [
  { label: "background",  var: "--background" },
  { label: "foreground",  var: "--foreground" },
  { label: "primary",     var: "--primary" },
  { label: "secondary",   var: "--secondary" },
  { label: "muted",       var: "--muted" },
  { label: "accent",      var: "--accent" },
  { label: "destructive", var: "--destructive" },
  { label: "border",      var: "--border" },
  { label: "card",        var: "--card" },
  { label: "chart-1",     var: "--chart-1" },
  { label: "chart-2",     var: "--chart-2" },
  { label: "chart-3",     var: "--chart-3" },
  { label: "chart-4",     var: "--chart-4" },
  { label: "chart-5",     var: "--chart-5" },
]

const TYPO_CLASSES = [
  { label: "typo-hero",          cls: "typo-hero" },
  { label: "typo-page-title",    cls: "typo-page-title" },
  { label: "typo-section-title", cls: "typo-section-title" },
  { label: "typo-card-title",    cls: "typo-card-title" },
  { label: "typo-body",          cls: "typo-body" },
  { label: "typo-label",         cls: "typo-label" },
  { label: "typo-section-label", cls: "typo-section-label" },
  { label: "typo-caption",       cls: "typo-caption" },
  { label: "typo-badge",         cls: "typo-badge" },
]

const BUTTON_VARIANTS: Array<{
  label: string
  variant: "default" | "outline" | "secondary" | "ghost" | "danger" | "link"
}> = [
  { label: "default",   variant: "default" },
  { label: "secondary", variant: "secondary" },
  { label: "outline",   variant: "outline" },
  { label: "ghost",     variant: "ghost" },
  { label: "danger",    variant: "danger" },
  { label: "link",      variant: "link" },
]

// ── Mock data ─────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Events",       href: "#" },
  { label: "Competitions", href: "#" },
  { label: "Results",      href: "#" },
]

const FOOTER_LINKS = [
  { label: "Privacy",  href: "#" },
  { label: "About",    href: "#" },
  { label: "Contact",  href: "#" },
]

const TABLE_ROWS = [
  { name: "Rina Setiawan", role: "Captain", status: "Active",  score: "92" },
  { name: "Budi Hartono",  role: "Student", status: "Active",  score: "88" },
  { name: "Sari Dewi",     role: "Student", status: "Pending", score: "74" },
]

const STAT_CARDS = [
  { label: "Registered Participants", value: "1,248", delta: "+18% vs last month",  deltaDirection: "up"      as const },
  { label: "Active Competitions",     value: "12",    delta: "−2 vs last quarter",  deltaDirection: "down"    as const },
  { label: "Pass Rate",               value: "87%",   delta: "Stable",              deltaDirection: "neutral" as const },
]

const SIDEBAR_GROUPS = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "#", active: true },
      { label: "Events",    href: "#" },
      { label: "Results",   href: "#" },
    ],
  },
  {
    label: "Settings",
    collapsible: true,
    items: [
      { label: "Account",       href: "#" },
      { label: "Notifications", href: "#" },
    ],
  },
]

const MOCK_ITEMS: EventCardProps[] = [
  {
    title: "Cikal Math Olympiad 2026",
    description: "Open to all Cikal students",
    meta: "Jul 15–16, 2026",
    badge: "Upcoming",
    badgeVariant: "info",
    onAction: () => {},
    actionLabel: "Register",
  },
  {
    title: "Inter-School Debate Championship",
    description: "Grades 7–12 welcome",
    meta: "Jun 28–30, 2026",
    badge: "Ongoing",
    badgeVariant: "success",
    onAction: () => {},
    actionLabel: "View",
  },
  {
    title: "National Science Fair Qualifier",
    description: "Hosted by Cikal Surabaya",
    meta: "May 10–11, 2026",
    badge: "Closed",
    badgeVariant: "muted",
  },
]

// ── Showcase ──────────────────────────────────────────────────────────────────

export function CikalShowcase() {
  const { tier } = useTier()
  const T = useTierComponents()
  const isGold = tier === "gold"

  // Gold floating-label fields require placeholder=" " so the label floats correctly
  const fp = isGold ? " " : undefined

  const [search, setSearch] = React.useState("")
  const [radioSize, setRadioSize] = React.useState("m")
  const [regData, setRegData] = React.useState({
    name: "",
    school: "",
    email: "",
    competition: "",
    tshirt: "m",
    agreeRules: false,
    emailUpdates: true,
  })

  return (
    <div className="brand-cikal bg-[var(--background)] text-[var(--foreground)]">
      <main className="min-h-screen p-10 max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-10">
          <a
            href="/"
            className="typo-caption text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-4 block"
          >
            ← Catalog
          </a>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="typo-hero">ui-cikal-showcase</h1>
              <p className="typo-body text-[var(--muted-foreground)] mt-1">
                CIKAL brand · multi-tier demo
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <TierSwitcher />
              <p className="typo-caption text-[var(--muted-foreground)]">
                Toggle to preview CIKAL at each tier level
              </p>
            </div>
          </div>
        </header>

        {/* Tokens — Colors */}
        <Section title="Tokens — Colors" tierInvariant>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {COLOR_TOKENS.map(({ label, var: cssVar }) => (
              <div key={cssVar} className="flex flex-col gap-2">
                <div
                  className="h-10 rounded-lg ring-1 ring-[var(--border)]"
                  style={{ backgroundColor: `var(${cssVar})` }}
                />
                <p className="typo-caption">{label}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Tokens — Typography */}
        <Section title="Tokens — Typography" tierInvariant>
          <div className="space-y-3">
            {TYPO_CLASSES.map(({ label, cls }) => (
              <div key={cls} className="flex items-baseline gap-4">
                <span className="typo-caption text-[var(--muted-foreground)] w-36 shrink-0">
                  {label}
                </span>
                <span className={cls}>The quick brown fox</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Atoms — Button (tier-variant: Gold has gradient styling) */}
        <Section title="Atoms — Button">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {BUTTON_VARIANTS.map(({ label, variant }) => (
              <PreviewCard key={variant} label={variant}>
                <T.Button variant={variant}>
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </T.Button>
              </PreviewCard>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <PreviewCard label="size: sm"><T.Button size="sm">Small</T.Button></PreviewCard>
            <PreviewCard label="size: default"><T.Button>Default</T.Button></PreviewCard>
            <PreviewCard label="size: lg"><T.Button size="lg">Large</T.Button></PreviewCard>
          </div>
        </Section>

        {/* Atoms — Badge */}
        <Section title="Atoms — Badge" tierInvariant>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {(["neutral", "info", "success", "muted", "danger"] as const).map((v) => (
              <PreviewCard key={v} label={v}>
                <T.Badge variant={v}>{v}</T.Badge>
              </PreviewCard>
            ))}
          </div>
        </Section>

        {/* Atoms — Card */}
        <Section title="Atoms — Card" tierInvariant>
          <div className="max-w-sm">
            <T.Card>
              <T.CardHeader>
                <T.CardTitle>Competition Registration</T.CardTitle>
                <T.CardDescription>
                  Open to Cikal students and alumni.
                </T.CardDescription>
              </T.CardHeader>
              <T.CardContent>
                <p className="typo-body text-[var(--muted-foreground)]">
                  Select a competition and complete the form to register your place.
                </p>
              </T.CardContent>
              <T.CardFooter>
                <T.Button size="sm" className="ml-auto">Register</T.Button>
              </T.CardFooter>
            </T.Card>
          </div>
        </Section>

        {/* Atoms — Avatar */}
        <Section title="Atoms — Avatar" tierInvariant>
          <div className="grid grid-cols-3 gap-4 max-w-xs">
            <PreviewCard label="sm"><T.Avatar name="Budi Santoso" size="sm" /></PreviewCard>
            <PreviewCard label="default"><T.Avatar name="Budi Santoso" size="default" /></PreviewCard>
            <PreviewCard label="lg"><T.Avatar name="Budi Santoso" size="lg" /></PreviewCard>
          </div>
        </Section>

        {/* Atoms — Form Controls */}
        <Section title="Atoms — Form Controls" tierInvariant>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <PreviewCard label="Input (text)">
              <T.Input placeholder="Enter full name" className="w-full" />
            </PreviewCard>
            <PreviewCard label="Input (email)">
              <T.Input type="email" placeholder="you@example.com" className="w-full" />
            </PreviewCard>
            <PreviewCard label="Input (disabled)">
              <T.Input placeholder="Not editable" disabled className="w-full" />
            </PreviewCard>
            <PreviewCard label="Textarea">
              <T.Textarea placeholder="Tell us about yourself..." className="w-full" />
            </PreviewCard>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <PreviewCard label="Checkbox (off)"><T.Checkbox /></PreviewCard>
            <PreviewCard label="Checkbox (on)"><T.Checkbox defaultChecked /></PreviewCard>
            <PreviewCard label="Switch (off)"><T.Switch /></PreviewCard>
            <PreviewCard label="Switch (on)"><T.Switch defaultChecked /></PreviewCard>
          </div>
          <div className="max-w-xs">
            <PreviewCard label="RadioGroup">
              <T.RadioGroup
                value={radioSize}
                onValueChange={(v) => setRadioSize(v as string)}
                className="flex flex-row gap-5"
              >
                {["S", "M", "L", "XL"].map((size) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer typo-label">
                    <T.Radio value={size.toLowerCase()} />
                    {size}
                  </label>
                ))}
              </T.RadioGroup>
            </PreviewCard>
          </div>
        </Section>

        {/* Atoms — Spinner (Bronze + Silver: primary loading pattern; Gold: available for nav/page-level use) */}
        <Section title="Atoms — Spinner">
          <div className="grid grid-cols-3 gap-4 max-w-xs mb-4">
            <PreviewCard label="size: sm"><T.Spinner size="sm" /></PreviewCard>
            <PreviewCard label="size: default"><T.Spinner size="default" /></PreviewCard>
            <PreviewCard label="size: lg"><T.Spinner size="lg" /></PreviewCard>
          </div>
          <p className="typo-caption text-[var(--muted-foreground)]">
            {isGold
              ? "Gold uses Skeleton for component-level loading; Spinner is available for page/navigation contexts."
              : tier === "silver"
                ? "Silver: SVG arc with rounded linecap — clean track + colored arc."
                : "Bronze: CSS border-trick spinner — simple, zero-dependency circular loader."}
          </p>
        </Section>

        {/* Atoms — Skeleton (Gold only) */}
        {isGold && T.Skeleton && (
          <Section title="Atoms — Skeleton">
            <div className="flex flex-wrap gap-6">
              <PreviewCard label="text lines">
                <div className="flex flex-col gap-2 w-48">
                  <T.Skeleton className="h-4 w-full" />
                  <T.Skeleton className="h-4 w-3/4" />
                  <T.Skeleton className="h-4 w-1/2" />
                </div>
              </PreviewCard>
              <PreviewCard label="avatar placeholder">
                <T.Skeleton className="h-10 w-10 rounded-full" />
              </PreviewCard>
              <PreviewCard label="card placeholder">
                <div className="flex flex-col gap-3 w-48">
                  <T.Skeleton className="h-24 w-full rounded-xl" />
                  <T.Skeleton className="h-4 w-full" />
                  <T.Skeleton className="h-4 w-2/3" />
                </div>
              </PreviewCard>
            </div>
          </Section>
        )}

        {/* Atoms — Table */}
        <Section title="Atoms — Table">
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <T.Table>
              <T.TableHeader>
                <T.TableRow>
                  <T.TableHead>Name</T.TableHead>
                  <T.TableHead>Role</T.TableHead>
                  <T.TableHead>Status</T.TableHead>
                  <T.TableHead>Score</T.TableHead>
                </T.TableRow>
              </T.TableHeader>
              <T.TableBody>
                {TABLE_ROWS.map((row) => (
                  <T.TableRow key={row.name}>
                    <T.TableCell className="font-medium">{row.name}</T.TableCell>
                    <T.TableCell>{row.role}</T.TableCell>
                    <T.TableCell>{row.status}</T.TableCell>
                    <T.TableCell>{row.score}</T.TableCell>
                  </T.TableRow>
                ))}
              </T.TableBody>
              <T.TableCaption>Registered participants — demonstration data</T.TableCaption>
            </T.Table>
          </div>
        </Section>

        {/* Molecules — SearchBar */}
        <Section title="Molecules — SearchBar" tierInvariant>
          <div className="max-w-sm">
            <T.SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search events..."
            />
            {search && (
              <p className="typo-caption mt-2">Query: &quot;{search}&quot;</p>
            )}
          </div>
        </Section>

        {/* Molecules — Field (tier-variant: Bronze inline, Silver stacked, Gold floating) */}
        <Section title="Molecules — Field">
          {isGold && (
            <p className="typo-caption text-[var(--muted-foreground)] mb-4">
              Click into each field — the label floats up on focus and when filled.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
            <T.Field
              label="Full name"
              htmlFor="demo-name"
              required
              description={isGold ? undefined : "As it appears on your student card."}
            >
              <T.Input id="demo-name" placeholder={fp} />
            </T.Field>
            <T.Field
              label="Email"
              htmlFor="demo-email"
              error="Enter a valid email address."
            >
              <T.Input id="demo-email" type="email" defaultValue="wrong@" aria-invalid placeholder={fp} />
            </T.Field>
            <T.Field
              label="Notes"
              htmlFor="demo-notes"
              description={isGold ? undefined : "Optional — max 200 characters."}
            >
              <T.Textarea id="demo-notes" placeholder={fp} />
            </T.Field>
          </div>
        </Section>

        {/* Molecules — EventCard */}
        <Section title="Molecules — EventCard" tierInvariant>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MOCK_ITEMS.map((item) => (
              <T.EventCard key={item.title} {...item} />
            ))}
          </div>
        </Section>

        {/* Molecules — StatCard */}
        <Section title="Molecules — StatCard">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STAT_CARDS.map((card) => (
              <T.StatCard
                key={card.label}
                label={card.label}
                value={card.value}
                delta={card.delta}
                deltaDirection={card.deltaDirection}
              />
            ))}
          </div>
        </Section>

        {/* Organisms — EventGrid */}
        <Section title="Organisms — EventGrid" tierInvariant>
          <T.EventGrid items={MOCK_ITEMS} className="mb-8" />
          <p className="typo-section-label text-[var(--muted-foreground)] mb-3">Loading state</p>
          <T.EventGrid items={[]} loading={true} className="mb-8" />
          <p className="typo-section-label text-[var(--muted-foreground)] mb-3">Empty state</p>
          <T.EventGrid items={[]} />
        </Section>

        {/* Organisms — HeroSection */}
        <Section title="Organisms — HeroSection" tierInvariant>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <T.HeroSection
              headline="Discover & Join School Competitions"
              subline="CIKAL hosts inter-school olympiads, debates, and science fairs open to all students."
              primaryCta={{ label: "Browse Events", onClick: () => {} }}
              secondaryCta={{ label: "Learn More", onClick: () => {} }}
              media={
                <div className="rounded-xl bg-[var(--secondary)] h-48 flex items-center justify-center">
                  <span className="typo-section-label text-[var(--secondary-foreground)]">
                    Illustration slot
                  </span>
                </div>
              }
            />
          </div>
        </Section>

        {/* Organisms — NavBar */}
        <Section title="Organisms — NavBar" tierInvariant>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <p className="typo-section-label text-[var(--muted-foreground)] px-4 pt-3 pb-1">Logo only</p>
            <T.NavBar logo={<CikalLogoMark />} links={NAV_LINKS} onLogin={() => {}} />
          </div>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden mt-4">
            <p className="typo-section-label text-[var(--muted-foreground)] px-4 pt-3 pb-1">Logo + name</p>
            <T.NavBar logo={<CikalLogoMark />} brandName="CIKAL" showBrandName links={NAV_LINKS} onLogin={() => {}} />
          </div>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden mt-4">
            <p className="typo-section-label text-[var(--muted-foreground)] px-4 pt-3 pb-1">Logged in</p>
            <T.NavBar logo={<CikalLogoMark />} links={NAV_LINKS} user={{ name: "Budi Santoso", size: "sm" }} />
          </div>
        </Section>

        {/* Organisms — Footer */}
        <Section title="Organisms — Footer" tierInvariant>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <p className="typo-section-label text-[var(--muted-foreground)] px-4 pt-3 pb-1">Logo only</p>
            <T.Footer logo={<CikalLogoMark />} links={FOOTER_LINKS} copyright="© 2026 Cikal — Sekolah Cikal" />
          </div>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden mt-4">
            <p className="typo-section-label text-[var(--muted-foreground)] px-4 pt-3 pb-1">Logo + name</p>
            <T.Footer logo={<CikalLogoMark />} brandName="CIKAL" showBrandName links={FOOTER_LINKS} copyright="© 2026 Cikal — Sekolah Cikal" />
          </div>
        </Section>

        {/* Organisms — Sidebar */}
        <Section title="Organisms — Sidebar">
          <div className="overflow-hidden rounded-xl border border-[var(--border)] flex h-56">
            <T.Sidebar
              logo={<CikalLogoMark />}
              brandName="CIKAL"
              showBrandName
              groups={SIDEBAR_GROUPS}
              user={{ name: "Budi Santoso" }}
            />
            <div className="flex-1 p-6 bg-[var(--background)]">
              <p className="typo-body text-[var(--muted-foreground)]">App content area</p>
            </div>
          </div>
          <p className="typo-caption text-[var(--muted-foreground)] mt-1">
            {tier === "bronze"
              ? "Bronze: static navigation, collapsible prop has no effect."
              : tier === "silver"
                ? "Silver: native <details> collapse — try the Settings group."
                : "Gold: animated collapse with ChevronDown rotation."}
          </p>
        </Section>

        {/* Composed — Registration Form */}
        <Section title="Composed — Registration Form">
          <div className="max-w-lg">
            <T.Card>
              <T.CardHeader>
                <T.CardTitle>Register for a competition</T.CardTitle>
                <T.CardDescription>
                  Open to Cikal students and alumni. Fields marked * are required.
                </T.CardDescription>
              </T.CardHeader>
              <T.CardContent>
                <form
                  className="flex flex-col gap-5"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <T.Field label="Full name" htmlFor="reg-name" required>
                    <T.Input
                      id="reg-name"
                      value={regData.name}
                      onChange={(e) => setRegData((d) => ({ ...d, name: e.target.value }))}
                      placeholder={fp ?? "As it appears on your student card"}
                    />
                  </T.Field>

                  <T.Field label="School" htmlFor="reg-school" required>
                    <T.Input
                      id="reg-school"
                      value={regData.school}
                      onChange={(e) => setRegData((d) => ({ ...d, school: e.target.value }))}
                      placeholder={fp ?? "e.g. Sekolah Cikal Surabaya"}
                    />
                  </T.Field>

                  <T.Field
                    label="Email"
                    htmlFor="reg-email"
                    required
                    description={isGold ? undefined : "We'll send your confirmation here."}
                  >
                    <T.Input
                      id="reg-email"
                      type="email"
                      value={regData.email}
                      onChange={(e) => setRegData((d) => ({ ...d, email: e.target.value }))}
                      placeholder={fp ?? "you@example.com"}
                    />
                  </T.Field>

                  <T.Field
                    label="Competition"
                    required
                    description={isGold ? undefined : "You can enter one competition per registration."}
                  >
                    <T.Select
                      value={regData.competition}
                      onValueChange={(v) => setRegData((d) => ({ ...d, competition: v ?? "" }))}
                      items={[
                        { value: "math", label: "Math Olympiad 2026" },
                        { value: "debate", label: "Inter-School Debate Championship" },
                        { value: "science", label: "National Science Fair Qualifier" },
                      ]}
                    >
                      <T.SelectTrigger className="w-full">
                        <T.SelectValue placeholder="Choose a competition" />
                      </T.SelectTrigger>
                      <T.SelectContent>
                        <T.SelectItem value="math">Math Olympiad 2026</T.SelectItem>
                        <T.SelectItem value="debate">Inter-School Debate Championship</T.SelectItem>
                        <T.SelectItem value="science">National Science Fair Qualifier</T.SelectItem>
                      </T.SelectContent>
                    </T.Select>
                  </T.Field>

                  <T.Field label="T-shirt size">
                    <T.RadioGroup
                      value={regData.tshirt}
                      onValueChange={(v) => setRegData((d) => ({ ...d, tshirt: v as string }))}
                      className="flex flex-row gap-5"
                    >
                      {["S", "M", "L", "XL"].map((size) => (
                        <label key={size} className="flex items-center gap-2 cursor-pointer typo-label">
                          <T.Radio value={size.toLowerCase()} />
                          {size}
                        </label>
                      ))}
                    </T.RadioGroup>
                  </T.Field>

                  <div className="flex items-start gap-3">
                    <T.Checkbox
                      id="reg-rules"
                      checked={regData.agreeRules}
                      onCheckedChange={(v) => setRegData((d) => ({ ...d, agreeRules: !!v }))}
                      className="mt-0.5"
                    />
                    <T.Label htmlFor="reg-rules" className="cursor-pointer font-normal leading-snug">
                      I agree to the{" "}
                      <span className="underline underline-offset-2">
                        competition rules and code of conduct
                      </span>
                    </T.Label>
                  </div>

                  <div className="flex items-center justify-between">
                    <T.Label htmlFor="reg-updates" className="cursor-pointer font-normal">
                      Email me event updates
                    </T.Label>
                    <T.Switch
                      id="reg-updates"
                      checked={regData.emailUpdates}
                      onCheckedChange={(v) => setRegData((d) => ({ ...d, emailUpdates: !!v }))}
                    />
                  </div>

                  <T.Button type="submit" size="lg" className="w-full mt-1">
                    Register
                  </T.Button>
                </form>
              </T.CardContent>
            </T.Card>
          </div>
        </Section>

      </main>
    </div>
  )
}
