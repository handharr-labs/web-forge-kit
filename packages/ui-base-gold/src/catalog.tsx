"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import {
  Avatar,
  Badge,
  Button,
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Checkbox,
  EventCard,
  EventGrid,
  Field,
  Footer,
  HeroSection,
  Input,
  Label,
  NavBar,
  Radio,
  RadioGroup,
  SearchBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Spinner,
  Switch,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption,
  StatCard,
  Sidebar,
  Textarea,
} from "./index"
import type { EventCardProps } from "./index"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="typo-section-label text-[var(--muted-foreground)]">{title}</h2>
      {children}
    </section>
  )
}

function PreviewCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-4">
        {children}
      </div>
      <p className="typo-caption">{label}</p>
    </div>
  )
}

const COLOR_TOKENS = [
  { name: "--background", label: "Background" },
  { name: "--foreground", label: "Foreground" },
  { name: "--primary", label: "Primary" },
  { name: "--primary-foreground", label: "Primary FG" },
  { name: "--secondary", label: "Secondary" },
  { name: "--muted", label: "Muted" },
  { name: "--muted-foreground", label: "Muted FG" },
  { name: "--border", label: "Border" },
  { name: "--destructive", label: "Destructive" },
]

const TYPO_CLASSES = [
  { cls: "typo-hero", label: "Hero — 1.875→2.5rem / 700" },
  { cls: "typo-page-title", label: "Page Title — 1.25rem / 700" },
  { cls: "typo-section-title", label: "Section Title — 1.125rem / 600" },
  { cls: "typo-card-title", label: "Card Title — 1rem / 600" },
  { cls: "typo-body", label: "Body — 0.875rem / 400" },
  { cls: "typo-label", label: "Label — 0.875rem / 500" },
  { cls: "typo-section-label", label: "Section Label — 0.75rem / 600 CAPS" },
  { cls: "typo-caption", label: "Caption — 0.75rem / 400" },
  { cls: "typo-badge", label: "Badge — 0.75rem / 500" },
]

const MOCK_ITEMS: EventCardProps[] = [
  { title: "Annual Report", description: "Finance department summary", meta: "Due Jan 15", badge: "Info", badgeVariant: "info", onAction: () => {}, actionLabel: "View" },
  { title: "Team Offsite", description: "Q2 planning retreat", meta: "Mar 20–22", badge: "Upcoming", badgeVariant: "success", onAction: () => {}, actionLabel: "RSVP" },
  { title: "Security Audit", description: "Infrastructure review", meta: "Completed", badge: "Done", badgeVariant: "muted" },
]

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
]

const FOOTER_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Support", href: "#" },
]

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="6" fill="var(--primary)" />
      <path d="M9 19L14 9l5 10" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="11" y1="15" x2="17" y2="15" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function GoldCatalog() {
  const [dark, setDark] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [checked, setChecked] = React.useState(false)
  const [switched, setSwitched] = React.useState(false)
  const [radio, setRadio] = React.useState("a")
  const [role, setRole] = React.useState("")

  return (
    <div className={`tier-gold bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300${dark ? " dark" : ""}`}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="typo-caption text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              ← Catalog
            </a>
            <span className="typo-caption text-[var(--muted-foreground)]">/</span>
            <span className="typo-caption">ui-base-gold</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="size-4 text-[var(--muted-foreground)]" />
            <Switch id="theme-toggle" checked={dark} onCheckedChange={setDark} />
            <Moon className="size-4 text-[var(--muted-foreground)]" />
          </div>
        </div>

        <div className="mb-10">
          <h1 className="typo-page-title">Gold Tier — Premium</h1>
          <p className="typo-body text-[var(--muted-foreground)] mt-1">
            Premium, animated interactions, floating label, dark mode. For consumer products.
          </p>
        </div>

        <div className="flex flex-col gap-12">

          {/* Tokens — Colors */}
          <Section title="Tokens — Colors">
            <div className="flex flex-wrap gap-3">
              {COLOR_TOKENS.map((t) => (
                <div key={t.name} className="flex flex-col gap-1">
                  <div
                    className="h-10 w-20 rounded-[var(--radius)] border border-[var(--border)]"
                    style={{ background: `var(${t.name})` }}
                  />
                  <p className="typo-caption">{t.label}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Tokens — Typography */}
          <Section title="Tokens — Typography">
            <div className="flex flex-col gap-3 p-4 border border-[var(--border)] rounded-[var(--radius)]">
              {TYPO_CLASSES.map((t) => (
                <div key={t.cls} className="flex items-baseline gap-3">
                  <span className={t.cls}>The quick brown fox</span>
                  <span className="typo-caption text-[var(--muted-foreground)]">{t.label}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Atoms */}
          <Section title="Atoms — Button">
            <div className="flex flex-wrap gap-3">
              <PreviewCard label="default (gradient)"><Button>Default</Button></PreviewCard>
              <PreviewCard label="outline"><Button variant="outline">Outline</Button></PreviewCard>
              <PreviewCard label="secondary"><Button variant="secondary">Secondary</Button></PreviewCard>
              <PreviewCard label="ghost"><Button variant="ghost">Ghost</Button></PreviewCard>
              <PreviewCard label="danger"><Button variant="danger">Danger</Button></PreviewCard>
              <PreviewCard label="link"><Button variant="link">Link</Button></PreviewCard>
              <PreviewCard label="sm"><Button size="sm">Small</Button></PreviewCard>
              <PreviewCard label="lg"><Button size="lg">Large</Button></PreviewCard>
              <PreviewCard label="disabled"><Button disabled>Disabled</Button></PreviewCard>
            </div>
          </Section>

          <Section title="Atoms — Badge">
            <div className="flex flex-wrap gap-3">
              {(["neutral", "info", "success", "muted", "danger"] as const).map((v) => (
                <PreviewCard key={v} label={v}><Badge variant={v}>{v}</Badge></PreviewCard>
              ))}
            </div>
          </Section>

          <Section title="Atoms — Avatar">
            <div className="flex flex-wrap gap-3">
              <PreviewCard label="initials"><Avatar name="John Doe" /></PreviewCard>
              <PreviewCard label="sm"><Avatar name="AB" size="sm" /></PreviewCard>
              <PreviewCard label="lg"><Avatar name="CD" size="lg" /></PreviewCard>
            </div>
          </Section>

          <Section title="Atoms — Spinner">
            <div className="flex flex-wrap gap-3">
              <PreviewCard label="sm"><Spinner size="sm" /></PreviewCard>
              <PreviewCard label="default"><Spinner size="default" /></PreviewCard>
              <PreviewCard label="lg"><Spinner size="lg" /></PreviewCard>
            </div>
          </Section>

          <Section title="Atoms — Skeleton">
            <div className="flex flex-wrap gap-6">
              <PreviewCard label="text lines">
                <div className="flex flex-col gap-2 w-48">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </PreviewCard>
              <PreviewCard label="avatar placeholder">
                <Skeleton className="h-10 w-10 rounded-full" />
              </PreviewCard>
              <PreviewCard label="card placeholder">
                <div className="flex flex-col gap-3 w-48">
                  <Skeleton className="h-24 w-full rounded-[var(--radius)]" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </PreviewCard>
            </div>
          </Section>

          <Section title="Atoms — Card">
            <PreviewCard label="card composition">
              <Card className="max-w-xs">
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Supporting description text</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="typo-body">Card body content goes here.</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" className="ml-auto">Action</Button>
                </CardFooter>
              </Card>
            </PreviewCard>
          </Section>

          <Section title="Atoms — Form Controls">
            <div className="flex flex-wrap gap-6">
              <PreviewCard label="Input">
                <Input placeholder="Type something..." className="max-w-xs" />
              </PreviewCard>
              <PreviewCard label="Textarea">
                <Textarea placeholder="Multi-line input..." className="max-w-xs" />
              </PreviewCard>
              <PreviewCard label="Checkbox">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="cb-gold"
                    checked={checked}
                    onCheckedChange={(v) => setChecked(Boolean(v))}
                  />
                  <Label htmlFor="cb-gold">Accept terms</Label>
                </div>
              </PreviewCard>
              <PreviewCard label="Switch (larger)">
                <div className="flex items-center gap-2">
                  <Switch
                    id="sw-gold"
                    checked={switched}
                    onCheckedChange={setSwitched}
                  />
                  <Label htmlFor="sw-gold">Notifications</Label>
                </div>
              </PreviewCard>
              <PreviewCard label="RadioGroup">
                <RadioGroup value={radio} onValueChange={(v) => setRadio(v as string)} className="gap-2">
                  {["Option A", "Option B", "Option C"].map((opt, i) => (
                    <div key={opt} className="flex items-center gap-2">
                      <Radio id={`r-g-${i}`} value={["a","b","c"][i]} />
                      <Label htmlFor={`r-g-${i}`}>{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </PreviewCard>
              <PreviewCard label="Select">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Choose..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Option 1</SelectItem>
                    <SelectItem value="2">Option 2</SelectItem>
                    <SelectItem value="3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </PreviewCard>
            </div>
          </Section>

          {/* Atoms — Table */}
          <Section title="Atoms — Table">
            <PreviewCard label="row hover — transition-all duration-150">
              <div className="w-full overflow-x-auto rounded-xl border border-[var(--border)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ["Rina Setiawan", "Captain", "Active",  "92"],
                      ["Budi Hartono",  "Student", "Active",  "88"],
                      ["Sari Dewi",     "Student", "Pending", "74"],
                    ].map(([name, role, status, score]) => (
                      <TableRow key={name}>
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell>{role}</TableCell>
                        <TableCell>{status}</TableCell>
                        <TableCell>{score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>Registered participants</TableCaption>
                </Table>
              </div>
            </PreviewCard>
          </Section>

          {/* Molecules */}
          <Section title="Molecules — SearchBar">
            <PreviewCard label="search bar">
              <SearchBar value={search} onChange={setSearch} placeholder="Search items..." className="max-w-sm" />
            </PreviewCard>
          </Section>

          <Section title="Molecules — Field (Floating Label)">
            <div className="max-w-md p-4 border border-[var(--border)] rounded-[var(--radius)] flex flex-col gap-6">
              <p className="typo-caption text-[var(--muted-foreground)]">
                Click into each field — the label floats up on focus and when filled.
              </p>
              <Field label="Name" htmlFor="f-name-g">
                <Input id="f-name-g" placeholder=" " />
              </Field>
              <Field label="Email" htmlFor="f-email-g" description="We'll never share your email">
                <Input id="f-email-g" type="email" placeholder=" " />
              </Field>
              <Field label="Notes" htmlFor="f-notes-g" error="This field is required">
                <Textarea id="f-notes-g" placeholder=" " />
              </Field>
            </div>
          </Section>

          {/* Molecules — StatCard */}
          <Section title="Molecules — StatCard">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PreviewCard label="up delta — gradient icon container">
                <StatCard
                  label="Participants"
                  value="1,248"
                  delta="+18% vs last month"
                  deltaDirection="up"
                  icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2l6 12H2z"/></svg>}
                />
              </PreviewCard>
              <PreviewCard label="down delta">
                <StatCard label="Competitions" value="12" delta="−2 vs last quarter" deltaDirection="down" />
              </PreviewCard>
              <PreviewCard label="neutral delta">
                <StatCard label="Pass Rate" value="87%" delta="Stable" deltaDirection="neutral" />
              </PreviewCard>
            </div>
          </Section>

          <Section title="Molecules — EventCard">
            <div className="flex flex-wrap gap-4">
              {MOCK_ITEMS.map((item) => (
                <div key={item.title} className="w-64">
                  <EventCard {...item} />
                </div>
              ))}
            </div>
          </Section>

          {/* Organisms */}
          <Section title="Organisms — NavBar">
            <PreviewCard label="logo only (backdrop-blur on scroll)">
              <NavBar logo={<LogoMark />} links={NAV_LINKS} onLogin={() => {}} />
            </PreviewCard>
            <PreviewCard label="logo + name (showBrandName)">
              <NavBar logo={<LogoMark />} brandName="Brand" showBrandName links={NAV_LINKS} onLogin={() => {}} />
            </PreviewCard>
            <PreviewCard label="name only">
              <NavBar brandName="Brand" links={NAV_LINKS} onLogin={() => {}} />
            </PreviewCard>
            <PreviewCard label="logo only — logged in">
              <NavBar logo={<LogoMark />} links={NAV_LINKS} user={{ name: "Jane Doe", size: "sm" }} />
            </PreviewCard>
          </Section>

          <Section title="Organisms — HeroSection">
            <PreviewCard label="hero">
              <HeroSection
                headline="Elevate your product with Gold"
                subline="Premium animated interactions and floating labels for consumer-grade experiences."
                primaryCta={{ label: "Get Started" }}
                secondaryCta={{ label: "Learn More" }}
              />
            </PreviewCard>
          </Section>

          <Section title="Organisms — EventGrid">
            <PreviewCard label="with items">
              <EventGrid items={MOCK_ITEMS} />
            </PreviewCard>
            <PreviewCard label="loading state">
              <EventGrid items={[]} loading={true} />
            </PreviewCard>
            <PreviewCard label="empty state">
              <EventGrid items={[]} emptyMessage="No items found." />
            </PreviewCard>
          </Section>

          <Section title="Organisms — Footer">
            <PreviewCard label="logo only">
              <Footer logo={<LogoMark />} links={FOOTER_LINKS} copyright="© 2026 Handharr Labs" />
            </PreviewCard>
            <PreviewCard label="logo + name">
              <Footer logo={<LogoMark />} brandName="Brand" showBrandName links={FOOTER_LINKS} copyright="© 2026 Handharr Labs" />
            </PreviewCard>
            <PreviewCard label="name only">
              <Footer brandName="Brand" links={FOOTER_LINKS} copyright="© 2026 Handharr Labs" />
            </PreviewCard>
          </Section>

          <Section title="Organisms — Sidebar">
            <PreviewCard label="animated collapse — ChevronDown rotates">
              <div className="flex h-52 w-full overflow-hidden rounded-xl border border-[var(--border)]">
                <Sidebar
                  logo={<LogoMark />}
                  brandName="App"
                  showBrandName
                  groups={[
                    { label: "Main",     items: [{ label: "Dashboard", href: "#", active: true }, { label: "Events", href: "#" }, { label: "Results", href: "#" }] },
                    { label: "Settings", collapsible: true, items: [{ label: "Account", href: "#" }, { label: "Notifications", href: "#" }] },
                  ]}
                  user={{ name: "John Doe" }}
                />
                <div className="flex-1 bg-[var(--card)] p-4">
                  <p className="typo-caption text-[var(--muted-foreground)]">Content area</p>
                </div>
              </div>
            </PreviewCard>
          </Section>

          {/* Composed */}
          <Section title="Composed — Registration Form">
            <div className="max-w-md border border-[var(--border)] rounded-[var(--radius)] p-6">
              <h3 className="typo-card-title mb-4">Create Account</h3>
              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <Field label="Full Name" htmlFor="cf-name-g">
                  <Input id="cf-name-g" placeholder=" " />
                </Field>
                <Field label="Email" htmlFor="cf-email-g">
                  <Input id="cf-email-g" type="email" placeholder=" " />
                </Field>
                <Field label="Role" htmlFor="cf-role-g">
                  <Select value={role} onValueChange={(v) => { if (v !== null) setRole(v) }}>
                    <SelectTrigger id="cf-role-g" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox id="cf-tos-g" />
                  <Label htmlFor="cf-tos-g">I agree to the Terms of Service</Label>
                </div>
                <Button type="submit" className="mt-2">Create Account</Button>
              </form>
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}
