import type { InvitationConfig, SectionConfig, SectionType } from "./invitation"
import { sampleInvitationConfig } from "./sample"

/**
 * Named starter recipes — "sell recipes, not assembly". A wizard/app clones one
 * of these full configs and tweaks it, instead of building an order slip from an
 * empty list. All three reuse the sample section data so the shapes stay valid.
 *
 * - `classic` — elegant, no games; section-nav chrome.
 * - `playful` — classic + the Team poll gamification.
 * - `minimal` — core only (cover · couple · event · RSVP · closing).
 */
export type InvitationPreset = "classic" | "playful" | "minimal"

const sections = sampleInvitationConfig.sections

function pick(types: SectionType[]): SectionConfig[] {
  return types
    .map((t) => sections.find((s) => s.type === t))
    .filter((s): s is SectionConfig => s != null)
}

export const PRESETS: Record<InvitationPreset, InvitationConfig> = {
  classic: {
    layout: { type: "single" },
    chrome: { nav: true },
    sections: sections.filter((s) => s.type !== "teamPoll"),
  },
  playful: {
    layout: { type: "single" },
    chrome: { nav: true },
    sections,
  },
  minimal: {
    layout: { type: "single" },
    sections: pick(["cover", "couple", "event", "rsvp", "closing"]),
  },
}
