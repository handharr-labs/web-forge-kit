"use client"

import { useState } from "react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ColorDot,
  MonthNavigator,
  StatusCard,
  ActionCard,
  type ActionCardVM,
  type StatusVariant,
} from "./index"

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

// ── Color tokens ─────────────────────────────────────────────────────────────

const COLOR_TOKENS = [
  { label: "background", var: "--background" },
  { label: "foreground", var: "--foreground" },
  { label: "primary", var: "--primary" },
  { label: "secondary", var: "--secondary" },
  { label: "muted", var: "--muted" },
  { label: "accent", var: "--accent" },
  { label: "destructive", var: "--destructive" },
  { label: "border", var: "--border" },
  { label: "card", var: "--card" },
  { label: "chart-1", var: "--chart-1" },
  { label: "chart-2", var: "--chart-2" },
  { label: "chart-3", var: "--chart-3" },
  { label: "chart-4", var: "--chart-4" },
  { label: "chart-5", var: "--chart-5" },
];

const TYPO_CLASSES = [
  { label: "typo-hero", cls: "typo-hero" },
  { label: "typo-page-title", cls: "typo-page-title" },
  { label: "typo-section-title", cls: "typo-section-title" },
  { label: "typo-card-title", cls: "typo-card-title" },
  { label: "typo-body", cls: "typo-body" },
  { label: "typo-label", cls: "typo-label" },
  { label: "typo-section-label", cls: "typo-section-label" },
  { label: "typo-caption", cls: "typo-caption" },
  { label: "typo-badge", cls: "typo-badge" },
];

const BUTTON_VARIANTS: Array<{
  label: string;
  variant: "default" | "outline" | "destructive" | "ghost" | "link" | "secondary";
}> = [
  { label: "default", variant: "default" },
  { label: "secondary", variant: "secondary" },
  { label: "outline", variant: "outline" },
  { label: "ghost", variant: "ghost" },
  { label: "destructive", variant: "destructive" },
  { label: "link", variant: "link" },
];

const STATUS_VARIANTS: StatusVariant[] = ["default", "success", "warning", "danger"];

const MOCK_ACTION_CARD: ActionCardVM = {
  id: "1",
  name: "Monthly Budget",
  formattedBudget: "Rp 5,000,000",
  categoryCountLabel: "8 categories",
};

// ── Catalog ───────────────────────────────────────────────────────────────────

export function XpnsioCatalog() {
  const [month, setMonth] = useState("June 2026");

  return (
    <div className="tier-xpnsio">
    <main className="min-h-screen p-10 max-w-4xl mx-auto">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <a
            href="/"
            className="typo-caption text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-3 block"
          >
            ← Catalog
          </a>
          <h1 className="typo-hero">ui-xpnsio</h1>
          <p className="typo-body text-[var(--muted-foreground)] mt-1">v1.1.0</p>
        </div>
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

      {/* Atoms — ColorDot */}
      <Section title="Atoms — ColorDot">
        <div className="grid grid-cols-4 gap-4 max-w-sm">
          <PreviewCard label="sm (default)">
            <ColorDot color="#3b82f6" />
          </PreviewCard>
          <PreviewCard label="md">
            <ColorDot color="#3b82f6" size="md" />
          </PreviewCard>
          <PreviewCard label="green">
            <ColorDot color="#22c55e" size="md" />
          </PreviewCard>
          <PreviewCard label="red">
            <ColorDot color="#ef4444" size="md" />
          </PreviewCard>
        </div>
      </Section>

      {/* Molecules — MonthNavigator */}
      <Section title="Molecules — MonthNavigator">
        <div className="max-w-xs">
          <PreviewCard label="MonthNavigator">
            <MonthNavigator
              label={month}
              onPrev={() => setMonth((m) => m === "June 2026" ? "May 2026" : "June 2026")}
              onNext={() => setMonth((m) => m === "June 2026" ? "July 2026" : "June 2026")}
            />
          </PreviewCard>
        </div>
      </Section>

      {/* Organisms — StatusCard */}
      <Section title="Organisms — StatusCard">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STATUS_VARIANTS.map((variant) => (
            <PreviewCard key={variant} label={`variant: ${variant}`}>
              <div className="w-full">
                <StatusCard
                  name="Groceries"
                  formattedAmount="Rp 450,000"
                  variant={variant}
                  statusLabel={variant.charAt(0).toUpperCase() + variant.slice(1)}
                  email="user@example.com"
                />
              </div>
            </PreviewCard>
          ))}
        </div>
        <div className="mt-4 max-w-sm">
          <PreviewCard label="with approve / reject">
            <div className="w-full">
              <StatusCard
                name="Team Lunch"
                formattedAmount="Rp 800,000"
                variant="warning"
                statusLabel="Pending"
                onApprove={() => {}}
                onReject={() => {}}
              />
            </div>
          </PreviewCard>
        </div>
      </Section>

      {/* Organisms — ActionCard */}
      <Section title="Organisms — ActionCard">
        <div className="max-w-sm">
          <PreviewCard label="ActionCard">
            <div className="w-full">
              <ActionCard
                setting={MOCK_ACTION_CARD}
                isApplying={false}
                onApply={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          </PreviewCard>
        </div>
      </Section>
    </main>
    </div>
  );
}
