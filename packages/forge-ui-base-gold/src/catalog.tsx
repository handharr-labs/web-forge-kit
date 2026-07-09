"use client"

import * as React from "react"
import {
  Inbox, Moon, Sun, MoreHorizontal, Pencil, Copy, Trash2, Info, Settings,
  Home, LayoutDashboard, Users, CalendarDays,
} from "lucide-react"
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
  ConfirmDialog,
  CtaBand,
  DetailRow,
  EmptyState,
  FileDropzone,
  FilterSelect,
  InfoCard,
  Modal,
  NativeSelect,
  Notice,
  PageHeader,
  Pagination,
  SectionIntro,
  SummaryRow,
  FilterBar,
  PreviewModal,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Tooltip,
  TooltipProvider,
  Breadcrumbs,
  DashboardShell,
  DataTable,
  SelectionToolbar,
  SortableList,
  Tabs, TabsList, TabsTab, TabsPanel,
  Accordion, AccordionItem, AccordionTrigger, AccordionPanel,
  SegmentedControl,
  Slider,
  SwatchPicker,
  Drawer,
  FormSection,
  FormFooter,
  ToastProvider,
  useToast,
  CopyButton,
  CopyField,
  Progress,
  Meter,
  PreviewFrame,
} from "./index"
import type { EventCardProps, DataTableColumn, SortState } from "./index"

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
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6">
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
  { title: "Standup", description: "Finance department summary", meta: "Due Jan 15", badge: "Info", badgeVariant: "info", onAction: () => {}, actionLabel: "View" },
  { title: "Quarterly Business Review & Planning Offsite", description: "Q2 planning retreat", meta: "Mar 20–22", badge: "Upcoming", badgeVariant: "success", onAction: () => {}, actionLabel: "RSVP" },
  { title: "Security Audit", description: "Infrastructure review", meta: "Completed", badge: "Done", badgeVariant: "muted" },
]

interface SiteRow {
  id: string
  couple: string
  slug: string
  date: string
  rsvps: number
  status: "Published" | "Draft"
}

const SITE_ROWS: SiteRow[] = [
  { id: "1", couple: "Inka & Riyadi", slug: "inka-riyadi", date: "2026-08-14", rsvps: 142, status: "Published" },
  { id: "2", couple: "Dewa & Vania", slug: "dewa-vania", date: "2026-09-02", rsvps: 38, status: "Published" },
  { id: "3", couple: "Aisyah & Luthfi", slug: "aisyah-luthfi", date: "2026-10-19", rsvps: 0, status: "Draft" },
  { id: "4", couple: "Rangga & Cinta", slug: "rangga-cinta", date: "2026-07-27", rsvps: 91, status: "Draft" },
]

const SITE_COLUMNS: DataTableColumn<SiteRow>[] = [
  { key: "couple", header: "Couple", sortable: true, sortAccessor: (r) => r.couple, cell: (r) => <span className="font-medium">{r.couple}</span> },
  { key: "slug", header: "Slug", cell: (r) => <span className="text-[var(--muted-foreground)]">/{r.slug}</span> },
  { key: "date", header: "Date", sortable: true, sortAccessor: (r) => r.date, cell: (r) => r.date },
  { key: "rsvps", header: "RSVPs", sortable: true, sortAccessor: (r) => r.rsvps, align: "right", cell: (r) => r.rsvps },
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

function ToastDemo() {
  const toast = useToast()
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast.add({ title: "Saved", description: "Changes published to the site.", type: "success" })}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.add({ title: "Copy failed", description: "Clipboard unavailable.", type: "error" })}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.add({ title: "Draft autosaved", type: "info" })}>
        Info
      </Button>
    </div>
  )
}

export function GoldCatalog() {
  const [dark, setDark] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [checked, setChecked] = React.useState(false)
  const [switched, setSwitched] = React.useState(false)
  const [radio, setRadio] = React.useState("a")
  const [filter, setFilter] = React.useState("")
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [page, setPage] = React.useState(1)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [role, setRole] = React.useState("")
  const [dtSelected, setDtSelected] = React.useState<string[]>([])
  const [dtSort, setDtSort] = React.useState<SortState | null>({ key: "date", direction: "asc" })
  const [dtLoading, setDtLoading] = React.useState(false)
  const [sections, setSections] = React.useState([
    { id: "cover", label: "Cover", enabled: true },
    { id: "couple", label: "Couple", enabled: true },
    { id: "event", label: "Event details", enabled: true },
    { id: "gallery", label: "Gallery", enabled: false },
    { id: "gift", label: "Gift", enabled: true },
  ])
  const [layout, setLayout] = React.useState("split")
  const [hue, setHue] = React.useState(140)
  const [palette, setPalette] = React.useState("sage")
  const [drawerOpen, setDrawerOpen] = React.useState(false)

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

          {/* Promoted from prototype — Atoms */}
          <Section title="Atoms — DetailRow">
            <PreviewCard label="label / value rows">
              <div className="flex w-full max-w-sm flex-col gap-2">
                <DetailRow label="Competition" value="Futsal U-12" />
                <DetailRow label="Fee" value="Rp150.000" />
                <DetailRow label="Closing date" value="15 Jan 2026" />
              </div>
            </PreviewCard>
          </Section>

          <Section title="Atoms — NativeSelect">
            <PreviewCard label="native select — lightweight alternative to Select">
              <NativeSelect defaultValue="">
                <option value="" disabled>Choose a sport…</option>
                <option value="futsal">Futsal</option>
                <option value="basket">Basketball</option>
                <option value="renang">Swimming</option>
              </NativeSelect>
            </PreviewCard>
          </Section>

          <Section title="Atoms — Notice">
            <PreviewCard label="inline banner">
              <Notice>Registration closes in 3 days. Complete payment to secure your slot.</Notice>
            </PreviewCard>
          </Section>

          {/* Promoted from prototype — Molecules */}
          <Section title="Molecules — PageHeader">
            <PreviewCard label="eyebrow + title + description + action">
              <PageHeader
                eyebrow="Backoffice"
                title="Competitions"
                description="Manage every competition number for the event."
                action={<Button size="sm">Add competition</Button>}
              />
            </PreviewCard>
          </Section>

          <Section title="Molecules — InfoCard">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoCard eyebrow="Step 1" eyebrowTone="primary" title="Create an account" description="Register with your email to get started." />
              <InfoCard eyebrow="Step 2" title="Enroll in a competition" description="Pick a number that matches your age group." />
            </div>
          </Section>

          <Section title="Molecules — CtaBand">
            <PreviewCard label="primary + secondary">
              <CtaBand
                title="Ready to compete?"
                description="Create an account and enroll in minutes."
                primary={{ label: "Get started", onClick: () => {} }}
                secondary={{ label: "Learn more", onClick: () => {} }}
              />
            </PreviewCard>
          </Section>

          <Section title="Molecules — EmptyState">
            <PreviewCard label="icon + title + description + action">
              <EmptyState
                icon={<Inbox className="size-6" />}
                title="No registrations yet"
                description="Once participants enroll, they'll show up here."
                action={<Button size="sm" variant="outline">Refresh</Button>}
              />
            </PreviewCard>
          </Section>

          <Section title="Molecules — FilterSelect">
            <PreviewCard label="all-seeded filter">
              <FilterSelect
                value={filter}
                onChange={setFilter}
                allLabel="All sports"
                options={[
                  { value: "futsal", label: "Futsal" },
                  { value: "basket", label: "Basketball" },
                  { value: "renang", label: "Swimming" },
                ]}
              />
            </PreviewCard>
          </Section>

          <Section title="Molecules — FileDropzone">
            <PreviewCard label="visual file picker">
              <div className="max-w-sm">
                <FileDropzone
                  label="Upload payment proof"
                  hint="PNG or JPG, up to 5MB"
                  accept="image/*"
                  fileName={fileName}
                  onFileChange={setFileName}
                />
              </div>
            </PreviewCard>
          </Section>

          <Section title="Molecules — Pagination">
            <PreviewCard label="numbered pager">
              <Pagination page={page} pageCount={5} onPageChange={setPage} />
            </PreviewCard>
          </Section>

          <Section title="Molecules — Modal & ConfirmDialog">
            <div className="flex flex-wrap gap-3">
              <PreviewCard label="modal (dialog)">
                <Button onClick={() => setModalOpen(true)}>Open modal</Button>
              </PreviewCard>
              <PreviewCard label="confirm (alertdialog)">
                <Button variant="danger" onClick={() => setConfirmOpen(true)}>Delete…</Button>
              </PreviewCard>
            </div>
            <Modal
              open={modalOpen}
              title="Edit competition"
              onClose={() => setModalOpen(false)}
              footer={
                <>
                  <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button onClick={() => setModalOpen(false)}>Save changes</Button>
                </>
              }
            >
              <p className="text-sm text-[var(--muted-foreground)]">
                A reusable overlay shell — scrim click and Escape both close it.
              </p>
            </Modal>
            <ConfirmDialog
              open={confirmOpen}
              title="Delete competition?"
              message="This action cannot be undone."
              confirmLabel="Delete"
              onConfirm={() => setConfirmOpen(false)}
              onClose={() => setConfirmOpen(false)}
            />
          </Section>

          <Section title="Molecules — SectionIntro">
            <PreviewCard label="eyebrow + title + lead — public-page header">
              <SectionIntro
                eyebrow="About the program"
                title="Compete, learn, represent your school"
                description="Open inter-school competitions across sports and academics, hosted every term."
              />
            </PreviewCard>
          </Section>

          <Section title="Molecules — SummaryRow">
            <div className="flex w-full max-w-xl flex-col gap-3">
              <SummaryRow
                title="Futsal Putra U-12"
                meta="Closes 15 Jan 2026 · Rp150.000"
                status={<Badge variant="success">Active</Badge>}
                action={<Button size="sm" variant="outline">View</Button>}
              />
              <SummaryRow
                title="Renang 50m Gaya Bebas"
                meta="Closes 20 Jan 2026 · Rp100.000"
                status={<Badge variant="muted">Closed</Badge>}
              />
            </div>
          </Section>

          <Section title="Molecules — FilterBar">
            <FilterBar
              search={{ value: search, onChange: setSearch, placeholder: "Search competitions..." }}
              filters={[
                {
                  value: filter,
                  onChange: setFilter,
                  allLabel: "All sports",
                  options: [
                    { value: "futsal", label: "Futsal" },
                    { value: "basket", label: "Basketball" },
                    { value: "renang", label: "Swimming" },
                  ],
                },
              ]}
              onReset={() => { setSearch(""); setFilter("") }}
              trailing={<Button size="sm">Add</Button>}
            />
          </Section>

          <Section title="Molecules — PreviewModal">
            <PreviewCard label="modal wrapping a placeholder media tile">
              <Button onClick={() => setPreviewOpen(true)}>Open preview</Button>
            </PreviewCard>
            {previewOpen && (
              <PreviewModal
                title="Payment proof"
                caption="Image preview unavailable in prototype"
                onClose={() => setPreviewOpen(false)}
              >
                <span className="typo-caption text-[var(--muted-foreground)]">proof-152.jpg</span>
              </PreviewModal>
            )}
          </Section>

          {/* ── Batch 5 — Metrics & preview ── */}

          <Section title="Molecules — Progress + Meter">
            <div className="flex max-w-md flex-col gap-5">
              <PreviewCard label="Progress — RSVP completion (determinate)">
                <Progress label="RSVP responses" showValue value={68} />
              </PreviewCard>
              <PreviewCard label="Progress — indeterminate">
                <Progress label="Publishing…" value={null} />
              </PreviewCard>
              <PreviewCard label="Meter — attending vs. capacity">
                <Meter
                  label="Attending"
                  showValue
                  value={142}
                  max={200}
                  renderValue={(v, max) => `${v} / ${max}`}
                />
              </PreviewCard>
            </div>
          </Section>

          <Section title="Organisms — PreviewFrame (iframe-isolated)">
            <PreviewCard label="device-width toggle · styles synced into an isolated iframe (app injects <Invitation config/>)">
              <PreviewFrame title="Invitation preview" dark={dark} defaultDevice="mobile" height={480}>
                {/* Placeholder stand-in for the injected <Invitation/>. */}
                <div className="flex min-h-full flex-col items-center justify-center gap-3 bg-[var(--card)] p-8 text-center text-[var(--foreground)]">
                  <div className="typo-page-title">Inka &amp; Riyadi</div>
                  <p className="typo-body text-[var(--muted-foreground)]">14 August 2026</p>
                  <Badge variant="success">Preview renders inside an isolated iframe</Badge>
                </div>
              </PreviewFrame>
            </PreviewCard>
          </Section>

          {/* ── Batch 4 — Feedback & links ── */}

          <Section title="Molecules — Toast + useToast">
            <PreviewCard label="transient save / publish / copy confirmation (auto-dismiss)">
              <ToastProvider>
                <ToastDemo />
              </ToastProvider>
            </PreviewCard>
          </Section>

          <Section title="Molecules — CopyButton + CopyField">
            <div className="flex flex-col gap-4">
              <PreviewCard label="CopyButton — icon + labelled">
                <div className="flex items-center gap-2">
                  <CopyButton value="https://invitatio.app/inka-riyadi?g=adi-santoso" aria-label="Copy link" />
                  <CopyButton value="https://invitatio.app/inka-riyadi?g=adi-santoso">Copy link</CopyButton>
                </div>
              </PreviewCard>
              <PreviewCard label="CopyField — personalized guest link">
                <CopyField label="Guest link" value="https://invitatio.app/inka-riyadi?g=adi-santoso" />
              </PreviewCard>
            </div>
          </Section>

          {/* ── Batch 3 — Config editor / builder ── */}

          <Section title="Molecules — SortableList (the config sections control)">
            <PreviewCard label="drag the handle, or focus it and press ↑/↓ · per-row enable switch">
              <SortableList
                items={sections}
                itemId={(s) => s.id}
                onReorder={setSections}
                handleLabel={(s) => `Reorder ${s.label}`}
                renderItem={(s) => <span className="text-sm font-medium">{s.label}</span>}
                renderEnable={(s) => (
                  <Switch
                    checked={s.enabled}
                    onCheckedChange={(v) =>
                      setSections((prev) => prev.map((p) => (p.id === s.id ? { ...p, enabled: v } : p)))
                    }
                    aria-label={`Enable ${s.label}`}
                  />
                )}
              />
            </PreviewCard>
          </Section>

          <Section title="Molecules — Tabs">
            <PreviewCard label="editor organization — animated indicator">
              <Tabs defaultValue="content">
                <TabsList>
                  <TabsTab value="content">Content</TabsTab>
                  <TabsTab value="theme">Theme</TabsTab>
                  <TabsTab value="chrome">Chrome</TabsTab>
                </TabsList>
                <TabsPanel value="content"><p className="text-sm text-[var(--muted-foreground)]">Section content fields…</p></TabsPanel>
                <TabsPanel value="theme"><p className="text-sm text-[var(--muted-foreground)]">Palette, typeface, day/night…</p></TabsPanel>
                <TabsPanel value="chrome"><p className="text-sm text-[var(--muted-foreground)]">Music, language, nav…</p></TabsPanel>
              </Tabs>
            </PreviewCard>
          </Section>

          <Section title="Molecules — Accordion">
            <PreviewCard label="collapsible per-section prop groups">
              <Accordion defaultValue={["0"]}>
                <AccordionItem value="0">
                  <AccordionTrigger>Cover</AccordionTrigger>
                  <AccordionPanel>Bride/groom names, date label, background image.</AccordionPanel>
                </AccordionItem>
                <AccordionItem value="1">
                  <AccordionTrigger>Event details</AccordionTrigger>
                  <AccordionPanel>Sessions, venue, maps link, add-to-calendar.</AccordionPanel>
                </AccordionItem>
              </Accordion>
            </PreviewCard>
          </Section>

          <Section title="Molecules — SegmentedControl">
            <PreviewCard label="single-select enum picker (layout single·split)">
              <SegmentedControl
                aria-label="Layout"
                value={layout}
                onValueChange={setLayout}
                options={[
                  { value: "single", label: "Single" },
                  { value: "split", label: "Split" },
                ]}
              />
            </PreviewCard>
          </Section>

          <Section title="Molecules — Slider">
            <PreviewCard label="scalar dial — app feeds fine --*-hue">
              <div className="w-64">
                <Slider label="Hue" showValue value={hue} onValueChange={setHue} min={0} max={360} formatValue={(v) => `${v}°`} />
              </div>
            </PreviewCard>
          </Section>

          <Section title="Molecules — SwatchPicker">
            <PreviewCard label="generic swatch grid (app feeds DOS_PALETTES)">
              <SwatchPicker
                aria-label="Palette"
                value={palette}
                onValueChange={setPalette}
                options={[
                  { value: "sage", label: "Sage", colors: ["#8a9a7b", "#d8c3a5", "#c9a227"] },
                  { value: "rose", label: "Rose", colors: ["#c98a9a", "#e8c3c9", "#c9a227"] },
                  { value: "terracotta", label: "Terracotta", colors: ["#c9744f", "#e0b088", "#9c5a34"] },
                  { value: "dusk", label: "Dusk", colors: ["#5a6a8a", "#9aa5c3", "#c9a227"] },
                  { value: "crimson", label: "Crimson", colors: ["#9a2a3a", "#c98a9a", "#c9a227"] },
                ]}
              />
            </PreviewCard>
          </Section>

          <Section title="Molecules — Drawer">
            <PreviewCard label="slide-over edit surface (Escape / scrim to close)">
              <Button onClick={() => setDrawerOpen(true)}>Edit section…</Button>
            </PreviewCard>
            <Drawer
              open={drawerOpen}
              title="Edit — Cover"
              onClose={() => setDrawerOpen(false)}
              footer={
                <>
                  <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                  <Button onClick={() => setDrawerOpen(false)}>Save</Button>
                </>
              }
            >
              <FormSection title="Cover" description="Shown first, before the guest opens the invitation.">
                <Field label="Bride name" htmlFor="dw-bride-g"><Input id="dw-bride-g" defaultValue="Inka" placeholder=" " /></Field>
                <Field label="Groom name" htmlFor="dw-groom-g"><Input id="dw-groom-g" defaultValue="Riyadi" placeholder=" " /></Field>
                <Field label="Date label" htmlFor="dw-date-g"><Input id="dw-date-g" defaultValue="14 August 2026" placeholder=" " /></Field>
              </FormSection>
            </Drawer>
          </Section>

          <Section title="Molecules — FormSection + FormFooter">
            <PreviewCard label="grouped fields over a save/cancel action bar">
              <div className="flex flex-col gap-5">
                <FormSection title="Couple" description="Displayed on the profile block.">
                  <Field label="Bride" htmlFor="fs-bride-g"><Input id="fs-bride-g" defaultValue="Inka" placeholder=" " /></Field>
                  <Field label="Groom" htmlFor="fs-groom-g"><Input id="fs-groom-g" defaultValue="Riyadi" placeholder=" " /></Field>
                </FormSection>
                <FormFooter info="Unsaved changes">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save changes</Button>
                </FormFooter>
              </div>
            </PreviewCard>
          </Section>

          {/* ── Batch 2 — Data management ── */}

          <Section title="Molecules — DataTable">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => { setDtLoading(true); setTimeout(() => setDtLoading(false), 1200) }}>
                  Simulate loading
                </Button>
                <span className="typo-caption text-[var(--muted-foreground)]">
                  sortable headers · select-all (tri-state) · bulk actions · loading skeleton
                </span>
              </div>
              <DataTable
                data={SITE_ROWS}
                columns={SITE_COLUMNS}
                rowId={(r) => r.id}
                selectable
                selectedIds={dtSelected}
                onSelectionChange={setDtSelected}
                sort={dtSort}
                onSortChange={setDtSort}
                loading={dtLoading}
                selectionNoun="site"
                stickyHeader={false}
                bulkActions={
                  <>
                    <Button size="sm" variant="outline">Publish</Button>
                    <Button size="sm" variant="danger">Delete</Button>
                  </>
                }
              />
            </div>
          </Section>

          <Section title="Molecules — SelectionToolbar (standalone)">
            <SelectionToolbar count={3} itemNoun="guest" onClear={() => {}}>
              <Button size="sm" variant="outline">Export</Button>
              <Button size="sm" variant="danger">Remove</Button>
            </SelectionToolbar>
          </Section>

          {/* ── Batch 1 — App shell & navigation ── */}

          <Section title="Molecules — DropdownMenu">
            <PreviewCard label="row / user actions — keyboard + a11y via Base UI menu">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline" size="icon" aria-label="Row actions">
                      <MoreHorizontal />
                    </Button>
                  }
                />
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem><Pencil />Edit</DropdownMenuItem>
                  <DropdownMenuItem><Copy />Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="danger"><Trash2 />Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </PreviewCard>
          </Section>

          <Section title="Molecules — Tooltip">
            <TooltipProvider>
              <PreviewCard label="icon-button affordances in dense toolbars">
                <div className="flex items-center gap-2">
                  <Tooltip content="Settings">
                    <Button variant="ghost" size="icon" aria-label="Settings"><Settings /></Button>
                  </Tooltip>
                  <Tooltip content="More info" side="right">
                    <Button variant="ghost" size="icon" aria-label="Info"><Info /></Button>
                  </Tooltip>
                </div>
              </PreviewCard>
            </TooltipProvider>
          </Section>

          <Section title="Molecules — Breadcrumbs">
            <PreviewCard label="path trail for nested admin pages">
              <Breadcrumbs
                items={[
                  { label: "Dashboard", href: "#", icon: <Home /> },
                  { label: "Sites", href: "#" },
                  { label: "Inka & Riyadi" },
                ]}
              />
            </PreviewCard>
          </Section>

          <Section title="Organisms — DashboardShell">
            <PreviewCard label="sidebar + sticky topbar + scrollable content (mobile: hamburger opens drawer)">
              <div className="h-[440px] overflow-hidden rounded-[var(--radius)] border border-[var(--border)]">
                <DashboardShell
                  className="h-full"
                  maxWidth="full"
                  sidebar={
                    <Sidebar
                      brandName="Invitatio"
                      logo={<LogoMark />}
                      groups={[
                        { items: [
                          { label: "Overview", href: "#", icon: <LayoutDashboard />, active: true },
                          { label: "Sites", href: "#", icon: <CalendarDays /> },
                          { label: "Guests", href: "#", icon: <Users /> },
                        ] },
                      ]}
                      user={{ name: "Admin" }}
                    />
                  }
                  topbar={
                    <Breadcrumbs items={[{ label: "Dashboard", href: "#" }, { label: "Overview" }]} />
                  }
                  topbarActions={
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="outline" size="icon" aria-label="Menu"><MoreHorizontal /></Button>}
                      />
                      <DropdownMenuContent>
                        <DropdownMenuItem><Pencil />New site</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }
                >
                  <div className="flex flex-col gap-3">
                    <h3 className="typo-section-title">Overview</h3>
                    <p className="typo-body text-[var(--muted-foreground)]">
                      Content column scrolls under the sticky top bar; the sidebar collapses to a
                      hamburger drawer below the <code>md</code> breakpoint.
                    </p>
                  </div>
                </DashboardShell>
              </div>
            </PreviewCard>
          </Section>

        </div>
      </div>
    </div>
  )
}
