"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  EventCard,
  EventGrid,
  Field,
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
  Switch,
  Textarea,
  type BadgeVariant,
  type EventCardProps,
} from "@handharr-labs/ui-cikal";

// ── Helpers ──────────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      <h2 className="typo-section-label text-[var(--muted-foreground)] mb-5 pb-3 border-b border-[var(--border)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function PreviewCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-[var(--border)] p-5 flex items-center justify-center min-h-[80px]">
        {children}
      </div>
      <p className="typo-caption text-center">{label}</p>
    </div>
  );
}

// ── Token data ────────────────────────────────────────────────────────────────

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
];

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
];

const BUTTON_VARIANTS: Array<{
  label: string;
  variant: "default" | "outline" | "secondary" | "ghost" | "danger" | "link";
}> = [
  { label: "default",   variant: "default" },
  { label: "secondary", variant: "secondary" },
  { label: "outline",   variant: "outline" },
  { label: "ghost",     variant: "ghost" },
  { label: "danger",    variant: "danger" },
  { label: "link",      variant: "link" },
];

const BADGE_VARIANTS: BadgeVariant[] = [
  "neutral",
  "upcoming",
  "ongoing",
  "closed",
  "cancelled",
];

const BADGE_LABELS: Record<BadgeVariant, string> = {
  neutral:   "Neutral",
  upcoming:  "Upcoming",
  ongoing:   "Ongoing",
  closed:    "Closed",
  cancelled: "Cancelled",
};

// ── Mock data ─────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Events",      href: "#" },
  { label: "Competitions", href: "#" },
  { label: "Results",     href: "#" },
];

const MOCK_EVENTS: EventCardProps[] = [
  {
    title: "Cikal Math Olympiad 2026",
    category: "Mathematics",
    dateRange: "Jul 15 – Jul 16, 2026",
    status: "upcoming",
    onAction: () => {},
    actionLabel: "Register",
  },
  {
    title: "Inter-School Debate Championship",
    category: "Debate",
    dateRange: "Jun 28 – Jun 30, 2026",
    status: "ongoing",
    onAction: () => {},
    actionLabel: "View",
  },
  {
    title: "National Science Fair Qualifier",
    category: "Science",
    dateRange: "May 10 – May 11, 2026",
    status: "closed",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CikalPage() {
  const [search, setSearch] = useState("");
  const [radioSize, setRadioSize] = useState("m");
  const [regData, setRegData] = useState({
    name: "",
    school: "",
    email: "",
    competition: "",
    tshirt: "m",
    agreeRules: false,
    emailUpdates: true,
  });

  return (
    <div className="brand-cikal bg-[var(--background)] text-[var(--foreground)]">
      <main className="min-h-screen p-10 max-w-4xl mx-auto">
        <header className="mb-10 flex items-start justify-between gap-4">
          <div>
            <Link
              href="/"
              className="typo-caption text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-3 block"
            >
              ← Catalog
            </Link>
            <h1 className="typo-hero">ui-cikal</h1>
            <p className="typo-body text-[var(--muted-foreground)] mt-1">
              v0.1.0-beta
            </p>
          </div>
          <Badge variant="upcoming">Beta</Badge>
        </header>

        {/* Tokens — Colors */}
        <Section title="Tokens — Colors">
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
        <Section title="Tokens — Typography">
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

        {/* Atoms — Button */}
        <Section title="Atoms — Button">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {BUTTON_VARIANTS.map(({ label, variant }) => (
              <PreviewCard key={variant} label={variant}>
                <Button variant={variant}>
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </Button>
              </PreviewCard>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <PreviewCard label="size: sm">
              <Button size="sm">Small</Button>
            </PreviewCard>
            <PreviewCard label="size: default">
              <Button>Default</Button>
            </PreviewCard>
            <PreviewCard label="size: lg">
              <Button size="lg">Large</Button>
            </PreviewCard>
          </div>
        </Section>

        {/* Atoms — Badge */}
        <Section title="Atoms — Badge">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {BADGE_VARIANTS.map((variant) => (
              <PreviewCard key={variant} label={variant}>
                <Badge variant={variant}>{BADGE_LABELS[variant]}</Badge>
              </PreviewCard>
            ))}
          </div>
        </Section>

        {/* Atoms — Card */}
        <Section title="Atoms — Card">
          <div className="max-w-sm">
            <PreviewCard label="Card">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Card title</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="typo-body text-[var(--muted-foreground)]">
                    Card content goes here.
                  </p>
                </CardContent>
              </Card>
            </PreviewCard>
          </div>
        </Section>

        {/* Atoms — Avatar */}
        <Section title="Atoms — Avatar">
          <div className="grid grid-cols-3 gap-4 max-w-xs">
            <PreviewCard label="sm">
              <Avatar name="Budi Santoso" size="sm" />
            </PreviewCard>
            <PreviewCard label="default">
              <Avatar name="Budi Santoso" size="default" />
            </PreviewCard>
            <PreviewCard label="lg">
              <Avatar name="Budi Santoso" size="lg" />
            </PreviewCard>
          </div>
        </Section>

        {/* Molecules — EventCard */}
        <Section title="Molecules — EventCard">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MOCK_EVENTS.map((event) => (
              <EventCard key={event.title} {...event} />
            ))}
          </div>
        </Section>

        {/* Molecules — SearchBar */}
        <Section title="Molecules — SearchBar">
          <div className="max-w-sm">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search events..."
            />
            {search && (
              <p className="typo-caption mt-2">Query: &quot;{search}&quot;</p>
            )}
          </div>
        </Section>

        {/* Organisms — EventGrid */}
        <Section title="Organisms — EventGrid">
          <EventGrid events={MOCK_EVENTS} className="mb-8" />
          <p className="typo-section-label text-[var(--muted-foreground)] mb-3">
            Empty state
          </p>
          <EventGrid events={[]} />
        </Section>

        {/* Organisms — HeroSection */}
        <Section title="Organisms — HeroSection">
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <HeroSection
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
        <Section title="Organisms — NavBar">
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <p className="typo-section-label text-[var(--muted-foreground)] px-4 pt-3 pb-1">
              Guest
            </p>
            <NavBar
              logo={
                <span className="typo-card-title text-[var(--primary)] font-bold">
                  CIKAL
                </span>
              }
              links={NAV_LINKS}
              onLogin={() => {}}
            />
          </div>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden mt-4">
            <p className="typo-section-label text-[var(--muted-foreground)] px-4 pt-3 pb-1">
              Logged in
            </p>
            <NavBar
              logo={
                <span className="typo-card-title text-[var(--primary)] font-bold">
                  CIKAL
                </span>
              }
              links={NAV_LINKS}
              user={{ name: "Budi Santoso", size: "sm" }}
            />
          </div>
        </Section>

        {/* Atoms — Form Controls */}
        <Section title="Atoms — Form Controls">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <PreviewCard label="Input (text)">
              <Input placeholder="Enter full name" className="w-full" />
            </PreviewCard>
            <PreviewCard label="Input (email)">
              <Input type="email" placeholder="you@example.com" className="w-full" />
            </PreviewCard>
            <PreviewCard label="Input (date)">
              <Input type="date" className="w-full" />
            </PreviewCard>
            <PreviewCard label="Input (disabled)">
              <Input placeholder="Not editable" disabled className="w-full" />
            </PreviewCard>
            <PreviewCard label="Input (error)">
              <Input
                placeholder="Invalid value"
                aria-invalid
                defaultValue="wrong@"
                className="w-full"
              />
            </PreviewCard>
            <PreviewCard label="Textarea">
              <Textarea placeholder="Tell us about yourself..." className="w-full" />
            </PreviewCard>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <PreviewCard label="Checkbox (off)">
              <Checkbox />
            </PreviewCard>
            <PreviewCard label="Checkbox (on)">
              <Checkbox defaultChecked />
            </PreviewCard>
            <PreviewCard label="Switch (off)">
              <Switch />
            </PreviewCard>
            <PreviewCard label="Switch (on)">
              <Switch defaultChecked />
            </PreviewCard>
          </div>
          <div className="max-w-xs">
            <PreviewCard label="RadioGroup">
              <RadioGroup
                value={radioSize}
                onValueChange={(v) => setRadioSize(v as string)}
                className="flex flex-row gap-5"
              >
                {["S", "M", "L", "XL"].map((size) => (
                  <label
                    key={size}
                    className="flex items-center gap-2 cursor-pointer typo-label"
                  >
                    <Radio value={size.toLowerCase()} />
                    {size}
                  </label>
                ))}
              </RadioGroup>
            </PreviewCard>
          </div>
        </Section>

        {/* Molecules — Field */}
        <Section title="Molecules — Field">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
            <Field
              label="Full name"
              htmlFor="demo-name"
              required
              description="As it appears on your student card."
            >
              <Input id="demo-name" placeholder="Budi Santoso" />
            </Field>
            <Field
              label="Email"
              htmlFor="demo-email"
              error="Enter a valid email address."
            >
              <Input
                id="demo-email"
                type="email"
                defaultValue="wrong@"
                aria-invalid
              />
            </Field>
            <Field
              label="Notes"
              htmlFor="demo-notes"
              description="Optional — max 200 characters."
            >
              <Textarea id="demo-notes" placeholder="Anything we should know..." />
            </Field>
          </div>
        </Section>

        {/* Composed — Registration Form */}
        <Section title="Composed — Registration Form">
          <div className="max-w-lg">
            <Card>
              <CardHeader>
                <CardTitle>Register for a competition</CardTitle>
                <CardDescription>
                  Open to Cikal students and alumni. Fields marked * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="flex flex-col gap-5"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Field label="Full name" htmlFor="reg-name" required>
                    <Input
                      id="reg-name"
                      value={regData.name}
                      onChange={(e) =>
                        setRegData((d) => ({ ...d, name: e.target.value }))
                      }
                      placeholder="As it appears on your student card"
                    />
                  </Field>

                  <Field label="School" htmlFor="reg-school" required>
                    <Input
                      id="reg-school"
                      value={regData.school}
                      onChange={(e) =>
                        setRegData((d) => ({ ...d, school: e.target.value }))
                      }
                      placeholder="e.g. Sekolah Cikal Surabaya"
                    />
                  </Field>

                  <Field
                    label="Email"
                    htmlFor="reg-email"
                    required
                    description="We'll send your confirmation here."
                  >
                    <Input
                      id="reg-email"
                      type="email"
                      value={regData.email}
                      onChange={(e) =>
                        setRegData((d) => ({ ...d, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                    />
                  </Field>

                  <Field
                    label="Competition"
                    required
                    description="You can enter one competition per registration."
                  >
                    <Select
                      value={regData.competition}
                      onValueChange={(v) =>
                        setRegData((d) => ({ ...d, competition: v ?? "" }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a competition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Math Olympiad 2026</SelectItem>
                        <SelectItem value="debate">
                          Inter-School Debate Championship
                        </SelectItem>
                        <SelectItem value="science">
                          National Science Fair Qualifier
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="T-shirt size">
                    <RadioGroup
                      value={regData.tshirt}
                      onValueChange={(v) =>
                        setRegData((d) => ({ ...d, tshirt: v as string }))
                      }
                      className="flex flex-row gap-5"
                    >
                      {["S", "M", "L", "XL"].map((size) => (
                        <label
                          key={size}
                          className="flex items-center gap-2 cursor-pointer typo-label"
                        >
                          <Radio value={size.toLowerCase()} />
                          {size}
                        </label>
                      ))}
                    </RadioGroup>
                  </Field>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="reg-rules"
                      checked={regData.agreeRules}
                      onCheckedChange={(v) =>
                        setRegData((d) => ({ ...d, agreeRules: !!v }))
                      }
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="reg-rules"
                      className="cursor-pointer font-normal leading-snug"
                    >
                      I agree to the{" "}
                      <span className="underline underline-offset-2">
                        competition rules and code of conduct
                      </span>
                    </Label>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="reg-updates" className="cursor-pointer font-normal">
                      Email me event updates
                    </Label>
                    <Switch
                      id="reg-updates"
                      checked={regData.emailUpdates}
                      onCheckedChange={(v) =>
                        setRegData((d) => ({ ...d, emailUpdates: !!v }))
                      }
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full mt-1">
                    Register
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </Section>
      </main>
    </div>
  );
}
