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
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
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
  { cls: "typo-hero", label: "Hero — 1.5→2rem / 700" },
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
  { title: "Standup", description: "Finance department summary", meta: "Due Jan 15", badge: "Info", badgeVariant: "info", onAction: () => {}, actionLabel: "View" },
  { title: "Quarterly Business Review & Planning Offsite", description: "Q2 planning retreat", meta: "Mar 20–22", badge: "Upcoming", badgeVariant: "success", onAction: () => {}, actionLabel: "RSVP" },
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

export function SilverCatalog() {
  const [dark, setDark] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [checked, setChecked] = React.useState(false)
  const [switched, setSwitched] = React.useState(false)
  const [radio, setRadio] = React.useState("a")

  return (
    <div className={`tier-silver bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200${dark ? " dark" : ""}`}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="typo-caption text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              ← Catalog
            </a>
            <span className="typo-caption text-[var(--muted-foreground)]">/</span>
            <span className="typo-caption">ui-base-silver</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="size-4 text-[var(--muted-foreground)]" />
            <Switch id="theme-toggle" checked={dark} onCheckedChange={setDark} />
            <Moon className="size-4 text-[var(--muted-foreground)]" />
          </div>
        </div>

        <div className="mb-10">
          <h1 className="typo-page-title">Silver Tier — Polished</h1>
          <p className="typo-body text-[var(--muted-foreground)] mt-1">
            Polished, production-ready, stacked field layout. For client-facing SaaS apps.
          </p>
        </div>

        <div className="flex flex-col gap-12">

          {/* Tokens — Colors */}
          <Section title="Tokens — Colors">
            <div className="flex flex-wrap gap-3">
              {COLOR_TOKENS.map((t) => (
                <div key={t.name} className="flex flex-col gap-1">
                  <div
                    className="h-10 w-20 rounded-xl border border-[var(--border)]"
                    style={{ background: `var(${t.name})` }}
                  />
                  <p className="typo-caption">{t.label}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Tokens — Typography */}
          <Section title="Tokens — Typography">
            <div className="flex flex-col gap-3 p-4 border border-[var(--border)] rounded-xl">
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
              <PreviewCard label="default"><Button>Default</Button></PreviewCard>
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
                    id="cb-silver"
                    checked={checked}
                    onCheckedChange={(v) => setChecked(Boolean(v))}
                  />
                  <Label htmlFor="cb-silver">Accept terms</Label>
                </div>
              </PreviewCard>
              <PreviewCard label="Switch">
                <div className="flex items-center gap-2">
                  <Switch
                    id="sw-silver"
                    checked={switched}
                    onCheckedChange={setSwitched}
                  />
                  <Label htmlFor="sw-silver">Notifications</Label>
                </div>
              </PreviewCard>
              <PreviewCard label="RadioGroup">
                <RadioGroup value={radio} onValueChange={(v) => setRadio(v as string)} className="gap-2">
                  {["Option A", "Option B", "Option C"].map((opt, i) => (
                    <div key={opt} className="flex items-center gap-2">
                      <Radio id={`r-s-${i}`} value={["a","b","c"][i]} />
                      <Label htmlFor={`r-s-${i}`}>{opt}</Label>
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
            <PreviewCard label="row hover + uppercase headers">
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

          <Section title="Molecules — Field (Stacked Layout)">
            <div className="max-w-md p-4 border border-[var(--border)] rounded-xl flex flex-col gap-4">
              <Field label="Name" htmlFor="f-name-s">
                <Input id="f-name-s" placeholder="Enter your name" />
              </Field>
              <Field label="Email" htmlFor="f-email-s" description="We'll never share your email">
                <Input id="f-email-s" type="email" placeholder="you@example.com" />
              </Field>
              <Field label="Notes" htmlFor="f-notes-s" error="This field is required">
                <Textarea id="f-notes-s" placeholder="Additional notes..." />
              </Field>
            </div>
          </Section>

          {/* Molecules — StatCard */}
          <Section title="Molecules — StatCard">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PreviewCard label="up delta — TrendingUp icon">
                <StatCard label="Participants" value="1,248" delta="+18% vs last month" deltaDirection="up" />
              </PreviewCard>
              <PreviewCard label="down delta — TrendingDown icon">
                <StatCard label="Competitions" value="12" delta="−2 vs last quarter" deltaDirection="down" />
              </PreviewCard>
              <PreviewCard label="neutral delta">
                <StatCard label="Pass Rate" value="87%" delta="Stable" deltaDirection="neutral" />
              </PreviewCard>
            </div>
          </Section>

          <Section title="Molecules — EventCard">
            <div className="flex flex-col gap-2">
              <p className="typo-caption text-[var(--muted-foreground)]">Natural height — flex wrap</p>
              <div className="flex flex-wrap gap-4">
                {MOCK_ITEMS.map((item) => (
                  <div key={item.title} className="w-64">
                    <EventCard {...item} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="typo-caption text-[var(--muted-foreground)]">Equal height — grid, items stretch</p>
              <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-3">
                {MOCK_ITEMS.map((item) => (
                  <EventCard key={item.title} {...item} className="h-full" />
                ))}
              </div>
            </div>
          </Section>

          {/* Organisms */}
          <Section title="Organisms — NavBar">
            <PreviewCard label="logo only">
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
            <PreviewCard label="custom actions slot (overrides login)">
              <NavBar
                logo={<LogoMark />}
                links={NAV_LINKS}
                actions={
                  <>
                    <Button size="sm" variant="ghost">Sign in</Button>
                    <Button size="sm">Sign up</Button>
                  </>
                }
              />
            </PreviewCard>
          </Section>

          <Section title="Organisms — HeroSection">
            <PreviewCard label="hero">
              <HeroSection
                headline="Ship confidently with Silver"
                subline="Polished, production-ready components for client-facing SaaS apps."
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
            <PreviewCard label="native <details> collapse — try Settings">
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
            <div className="max-w-md border border-[var(--border)] rounded-xl p-6">
              <h3 className="typo-card-title mb-4">Create Account</h3>
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <Field label="Full Name" htmlFor="cf-name-s">
                  <Input id="cf-name-s" placeholder="Jane Doe" />
                </Field>
                <Field label="Email" htmlFor="cf-email-s">
                  <Input id="cf-email-s" type="email" placeholder="jane@example.com" />
                </Field>
                <Field label="Role" htmlFor="cf-role-s">
                  <Select>
                    <SelectTrigger id="cf-role-s" className="w-full">
                      <SelectValue placeholder="Select role..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox id="cf-tos-s" />
                  <Label htmlFor="cf-tos-s">I agree to the Terms of Service</Label>
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
