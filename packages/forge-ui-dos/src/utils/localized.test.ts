import { describe, it, expect } from "vitest"
import {
  loc,
  resolveLocalized,
  resolveSectionProps,
  DEFAULT_LANG,
} from "./localized"
import { SECTION_CATALOG } from "../composition/section-catalog"

describe("resolveLocalized", () => {
  it("passes a bare value through untouched", () => {
    expect(resolveLocalized("Halo", "en")).toBe("Halo")
    expect(resolveLocalized(undefined, "en")).toBeUndefined()
  })

  it("picks the active language", () => {
    expect(resolveLocalized({ id: "Halo", en: "Hi" }, "en")).toBe("Hi")
    expect(resolveLocalized({ id: "Halo", en: "Hi" }, "id")).toBe("Halo")
  })

  it("falls back to the default language, then any defined variant", () => {
    expect(resolveLocalized({ id: "Halo" }, "en")).toBe("Halo") // no `en` → default
    expect(resolveLocalized({ fr: "Salut" }, "en")).toBe("Salut") // neither → first defined
  })

  it("loc() authors a map that resolves back", () => {
    const v = loc({ id: "Halo", en: "Hi" })
    expect(resolveLocalized(v, "en")).toBe("Hi")
    expect(resolveLocalized(v, "id")).toBe("Halo")
  })
})

describe("resolveSectionProps", () => {
  it("resolves a nested localizable path (couple parentage) and leaves names alone", () => {
    const props = {
      bride: { name: "Vania", parentage: loc({ id: "Putri dari …", en: "Daughter of …" }) },
      groom: { name: "Arbi", parentage: "Putra dari …" },
    }
    const out = resolveSectionProps(props, SECTION_CATALOG.couple.fields, "en") as typeof props
    expect(out.bride.parentage).toBe("Daughter of …")
    expect(out.groom.parentage).toBe("Putra dari …") // bare string untouched
    expect(out.bride.name).toBe("Vania") // name is not localizable
  })

  it("does not mutate the input", () => {
    const props = { bride: { name: "V", parentage: loc({ id: "A", en: "B" }) }, groom: { name: "A" } }
    const before = JSON.stringify(props)
    resolveSectionProps(props, SECTION_CATALOG.couple.fields, "en")
    expect(JSON.stringify(props)).toBe(before)
  })

  it("resolves inside an object list (event sessions)", () => {
    const props = {
      sessions: [
        { title: loc({ id: "Akad Nikah", en: "Ceremony" }), dateLabel: "12 Jul", venueName: "Hall A" },
      ],
    }
    const out = resolveSectionProps(props, SECTION_CATALOG.event.fields, "en") as typeof props
    expect(out.sessions[0].title).toBe("Ceremony")
    expect(out.sessions[0].venueName).toBe("Hall A") // not localizable
  })

  it("resolves a scalar list (bingo cells)", () => {
    const props = { cells: [loc({ id: "Menangis", en: "Crying" }), "Free space"] }
    const out = resolveSectionProps(props, SECTION_CATALOG.bingo.fields, "en") as { cells: string[] }
    expect(out.cells).toEqual(["Crying", "Free space"])
  })

  it("resolves a nested list (trivia question options)", () => {
    const props = {
      questions: [
        {
          question: loc({ id: "Di mana?", en: "Where?" }),
          options: [loc({ id: "Kampus", en: "Campus" }), "Cafe"],
          answerIndex: 0,
        },
      ],
    }
    const out = resolveSectionProps(props, SECTION_CATALOG.triviaQuiz.fields, "en") as typeof props
    expect(out.questions[0].question).toBe("Where?")
    expect(out.questions[0].options).toEqual(["Campus", "Cafe"])
    expect(out.questions[0].answerIndex).toBe(0) // number preserved
  })

  it("preserves Date and function props (no structuredClone)", () => {
    const target = new Date("2026-07-12T00:00:00Z")
    const outCountdown = resolveSectionProps({ target }, SECTION_CATALOG.countdown.fields, "en") as {
      target: Date
    }
    expect(outCountdown.target).toBe(target) // same reference, still a Date

    const onSubmit = () => {}
    const outRsvp = resolveSectionProps({ onSubmit }, SECTION_CATALOG.rsvp.fields, "en") as {
      onSubmit: () => void
    }
    expect(outRsvp.onSubmit).toBe(onSubmit)
  })

  it("uses the default-language fallback when the active language is missing", () => {
    const props = { cells: [loc({ id: "Menangis" })] } // only `id`
    const out = resolveSectionProps(props, SECTION_CATALOG.bingo.fields, "en") as { cells: string[] }
    expect(out.cells[0]).toBe("Menangis")
    expect(DEFAULT_LANG).toBe("id")
  })
})
