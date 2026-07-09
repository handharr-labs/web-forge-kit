import type { SectionType, SectionPropsMap } from "./invitation"

/* ----------------------------------------------------------------------------
   The catalog: metadata *about* the menu. `SECTION_REGISTRY` maps a type to its
   component (how to render); this maps a type to how to *present and seed* it in
   a builder — which category it belongs to, its human copy, and valid starter
   props to drop in on add. Kept exhaustive over `SectionType` so adding an
   organism forces its classification here.

   NOTE: cardinality ("can this type be added more than once") intentionally
   does NOT live here. It's a business rule about how a given product wants
   operators composing things, not a fact about the organism — a consumer
   should own and configure it itself (invitatio does, as DB-backed admin
   settings; see personal-workdocs/invitatio-docs/initiatives/
   2026-07-09-section-cardinality-ownership.md).
   -------------------------------------------------------------------------- */

/** Picker groups, in the order an invitation naturally reads top to bottom. */
export type SectionCategory =
  | "cover"
  | "opening"
  | "couple"
  | "event"
  | "guests"
  | "games"
  | "closing"

/** Ordered category metadata — drives picker group order + headings. */
export const SECTION_CATEGORIES: { id: SectionCategory; label: string }[] = [
  { id: "cover", label: "Cover" },
  { id: "opening", label: "Opening" },
  { id: "couple", label: "The couple" },
  { id: "event", label: "Event" },
  { id: "guests", label: "Guests" },
  { id: "games", label: "Games" },
  { id: "closing", label: "Closing" },
]

/* ----------------------------------------------------------------------------
   Form schema. `defaults()` yields valid starter props; `fields` describes how a
   builder should let an operator *edit* them — so a consumer can render one
   generic form instead of hand-writing a form per section. Both live on the same
   catalog entry and are typechecked against the same `SectionPropsMap[K]`, so
   they can't drift. `fields` is optional: a section without it falls back to a
   raw-props editor in the consumer (the migration escape hatch).
   -------------------------------------------------------------------------- */

/** The control a field maps to. Kept small and presentational — the consumer
 *  owns the actual widgets (a `select` needs `options`, a `list` needs `of`). */
export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "image"
  | "url"
  | "list"

/** One editable field, addressed by a dot-path into the section's props. */
export type FieldDescriptor = {
  /** Dot-path into props, e.g. `"bride.name"`. For `list`, the array path. */
  path: string
  label: string
  kind: FieldKind
  /** Optional cluster heading (e.g. "Bride" / "Groom") for grouped rendering. */
  group?: string
  help?: string
  placeholder?: string
  required?: boolean
  /**
   * Marks guest-facing copy that reads differently per language — the bilingual
   * model (Part C) renders an ID/EN input pair for it. Left off for language-
   * neutral data: proper nouns (names, handles), URLs, images, emoji, numbers,
   * enums, and factual values (addresses, bank details, prices).
   */
  localizable?: boolean
  /** `select` options. */
  options?: { value: string; label: string }[]
  /**
   * `list` item sub-fields (paths are relative to the item). For a list of
   * scalars (e.g. `string[]`), use a single descriptor with `path: ""` to
   * address the item value itself.
   */
  of?: FieldDescriptor[]
  /** Singular noun for a `list`'s add control, e.g. "Milestone". */
  itemLabel?: string
}

export type SectionMeta<K extends SectionType = SectionType> = {
  category: SectionCategory
  /** Full picker label — "Trivia Quiz". */
  label: string
  /** Short nav-rail label — "Quiz". The single source for nav-rail fallbacks. */
  navLabel: string
  /** One line for the picker card. */
  description: string
  /**
   * Valid, handler-free starter props seeded on add — the data-only shape that
   * already renders a working optimistic preview under `<Invitation>`. Generic
   * placeholder content an operator then edits. A factory (not a shared
   * constant) so adding two of the same section never aliases props.
   */
  defaults: () => SectionPropsMap[K]
  /**
   * Ordered edit schema for the section's props. Optional during rollout — when
   * absent, a builder should fall back to a raw editor. When present, it must
   * cover every operator-editable prop (handlers / personalized fields excluded).
   */
  fields?: FieldDescriptor[]
}

/**
 * Exhaustive over `SectionType` — the compiler rejects a new `SECTION_REGISTRY`
 * entry that isn't classified here. That guarantee is the whole point.
 */
export const SECTION_CATALOG: { [K in SectionType]: SectionMeta<K> } = {
  cover: {
    category: "cover",
    label: "Cover",
    navLabel: "Home",
    description: "Full-screen opener with the couple's names and an Open gesture.",
    defaults: () => ({
      brideName: "Mempelai Wanita",
      groomName: "Mempelai Pria",
      dateLabel: "Tanggal Acara",
    }),
    fields: [
      { path: "eyebrow", label: "Eyebrow", kind: "text", localizable: true, placeholder: "The Wedding Of" },
      { path: "brideName", label: "Bride name", kind: "text", required: true },
      { path: "groomName", label: "Groom name", kind: "text", required: true },
      {
        path: "dateLabel",
        label: "Date label",
        kind: "text",
        required: true,
        localizable: true,
        help: 'Shown under the names, e.g. "Sabtu, 12 Juli 2026".',
      },
      { path: "imageUrl", label: "Background image", kind: "image" },
      { path: "openLabel", label: "Open button label", kind: "text", localizable: true, placeholder: "Buka Undangan" },
    ],
  },
  welcome: {
    category: "opening",
    label: "Welcome Note",
    navLabel: "Welcome",
    description: "A short personal greeting to set the tone.",
    defaults: () => ({
      eyebrow: "Selamat Datang",
      title: "Dengan penuh syukur",
      message:
        "Kami mengundang Anda untuk berbagi kebahagiaan di hari istimewa kami. Terima kasih telah menjadi bagian dari perjalanan ini.",
      signature: "Kedua Mempelai",
    }),
    fields: [
      { path: "eyebrow", label: "Eyebrow", kind: "text", localizable: true, placeholder: "Selamat Datang" },
      { path: "title", label: "Title", kind: "text", localizable: true },
      { path: "message", label: "Message", kind: "textarea", required: true, localizable: true },
      {
        path: "signature",
        label: "Signature",
        kind: "text",
        localizable: true,
        help: "Script sign-off, e.g. the couple's names.",
      },
    ],
  },
  quote: {
    category: "opening",
    label: "Quote",
    navLabel: "Quote",
    description: "A verse or quote framed by botanical dividers.",
    defaults: () => ({
      source: "Sumber Kutipan",
      children: "Tuliskan kutipan atau ayat favorit kalian di sini.",
    }),
    fields: [
      { path: "children", label: "Quote", kind: "textarea", required: true, localizable: true },
      { path: "source", label: "Source", kind: "text", localizable: true, placeholder: "QS. Ar-Rum: 21" },
    ],
  },
  couple: {
    category: "couple",
    label: "The Couple",
    navLabel: "Couple",
    description: "Introduce the bride and groom with photos and parentage.",
    defaults: () => ({
      bride: {
        name: "Mempelai Wanita",
        parentage: "Putri dari Bpk. … & Ibu …",
      },
      groom: {
        name: "Mempelai Pria",
        parentage: "Putra dari Bpk. … & Ibu …",
      },
    }),
    fields: [
      { path: "bride.name", label: "Name", kind: "text", group: "Bride", required: true },
      { path: "bride.fullName", label: "Full name", kind: "text", group: "Bride" },
      { path: "bride.parentage", label: "Parentage", kind: "text", group: "Bride", localizable: true },
      { path: "bride.bio", label: "Bio", kind: "textarea", group: "Bride", localizable: true },
      { path: "bride.photoUrl", label: "Photo", kind: "image", group: "Bride" },
      { path: "bride.instagram", label: "Instagram", kind: "text", group: "Bride", placeholder: "@handle" },
      { path: "groom.name", label: "Name", kind: "text", group: "Groom", required: true },
      { path: "groom.fullName", label: "Full name", kind: "text", group: "Groom" },
      { path: "groom.parentage", label: "Parentage", kind: "text", group: "Groom", localizable: true },
      { path: "groom.bio", label: "Bio", kind: "textarea", group: "Groom", localizable: true },
      { path: "groom.photoUrl", label: "Photo", kind: "image", group: "Groom" },
      { path: "groom.instagram", label: "Instagram", kind: "text", group: "Groom", placeholder: "@handle" },
    ],
  },
  loveStory: {
    category: "couple",
    label: "Love Story",
    navLabel: "Story",
    description: "A timeline of your journey together.",
    defaults: () => ({
      milestones: [
        { period: "2020", title: "Pertama Bertemu", body: "Ceritakan bagaimana kalian pertama bertemu." },
        { period: "2024", title: "Lamaran", body: "Momen ketika semuanya menjadi resmi." },
      ],
    }),
    fields: [
      {
        path: "milestones",
        label: "Milestones",
        kind: "list",
        itemLabel: "Milestone",
        of: [
          { path: "period", label: "Period", kind: "text", localizable: true, placeholder: "2024" },
          { path: "title", label: "Title", kind: "text", required: true, localizable: true },
          { path: "body", label: "Story", kind: "textarea", localizable: true },
          { path: "photoUrl", label: "Photo", kind: "image" },
        ],
      },
    ],
  },
  event: {
    category: "event",
    label: "Event Details",
    navLabel: "Event",
    description: "Ceremony and reception sessions with map and calendar links.",
    defaults: () => ({
      sessions: [
        {
          title: "Akad Nikah",
          dateLabel: "Tanggal Acara",
          timeLabel: "08.00 WIB",
          venueName: "Nama Tempat",
          address: "Alamat lengkap acara",
        },
      ],
    }),
    fields: [
      {
        path: "sessions",
        label: "Sessions",
        kind: "list",
        itemLabel: "Session",
        of: [
          { path: "title", label: "Title", kind: "text", required: true, localizable: true, placeholder: "Akad Nikah" },
          { path: "dateLabel", label: "Date", kind: "text", required: true, localizable: true },
          { path: "timeLabel", label: "Time", kind: "text", localizable: true, placeholder: "08.00 WIB" },
          { path: "venueName", label: "Venue", kind: "text", required: true },
          { path: "address", label: "Address", kind: "textarea" },
          { path: "mapsUrl", label: "Maps link", kind: "url" },
        ],
      },
    ],
  },
  countdown: {
    category: "event",
    label: "Countdown",
    navLabel: "Countdown",
    description: "A live countdown to the big day.",
    defaults: () => ({
      target: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    }),
    fields: [
      { path: "target", label: "Target date", kind: "date", required: true },
    ],
  },
  liveStream: {
    category: "event",
    label: "Live Stream",
    navLabel: "Live",
    description: "A prominent link to your live broadcast.",
    defaults: () => ({
      url: "https://",
      platform: "Live Streaming",
      note: "Bagi yang berhalangan hadir, saksikan momen kami secara langsung.",
    }),
    fields: [
      { path: "url", label: "Stream URL", kind: "url", required: true },
      { path: "platform", label: "Platform", kind: "text", localizable: true, placeholder: "YouTube Live" },
      { path: "note", label: "Note", kind: "textarea", localizable: true },
      { path: "label", label: "Button label", kind: "text", localizable: true },
    ],
  },
  qrCheckIn: {
    category: "event",
    label: "QR Check-in",
    navLabel: "Check-in",
    description: "A guest QR pass with check-in status.",
    defaults: () => ({
      title: "Kartu Masuk Anda",
      guestName: "Nama Tamu",
      code: "INV-0000",
    }),
    // `guestName` / `code` / `qrSrc` are per-guest data, not authored template copy.
    fields: [
      { path: "eyebrow", label: "Eyebrow", kind: "text", localizable: true },
      { path: "title", label: "Title", kind: "text", localizable: true },
      { path: "instructions", label: "Instructions", kind: "textarea", localizable: true },
      { path: "checkInLabel", label: "Check-in button label", kind: "text", localizable: true },
    ],
  },
  rsvp: {
    category: "guests",
    label: "RSVP",
    navLabel: "RSVP",
    description: "Let guests confirm their attendance.",
    defaults: () => ({}),
    // No authored copy — the form is self-contained; guest replies are runtime.
    fields: [],
  },
  guestbook: {
    category: "guests",
    label: "Guestbook",
    navLabel: "Wishes",
    description: "Collect wishes and prayers from your guests.",
    defaults: () => ({ messages: [] }),
    // `messages` is the runtime guest feed, not authored content.
    fields: [],
  },
  gallery: {
    category: "guests",
    label: "Gallery",
    navLabel: "Gallery",
    description: "A photo grid that opens into a lightbox.",
    defaults: () => ({
      images: Array.from(
        { length: 6 },
        (_, i) => `https://picsum.photos/seed/dos-gallery${i}/400/400`
      ),
    }),
    fields: [
      {
        path: "images",
        label: "Photos",
        kind: "list",
        itemLabel: "Photo",
        // Scalar list — each item is a bare image URL (empty item path).
        of: [{ path: "", label: "Image", kind: "image" }],
      },
    ],
  },
  wishlist: {
    category: "guests",
    label: "Wishlist",
    navLabel: "Wishlist",
    description: "A claimable list of gift ideas.",
    defaults: () => ({
      items: [
        { id: "1", name: "Nama Hadiah", description: "Deskripsi singkat hadiah.", price: "± Rp 0" },
      ],
    }),
    fields: [
      {
        path: "items",
        label: "Items",
        kind: "list",
        itemLabel: "Item",
        of: [
          { path: "name", label: "Name", kind: "text", required: true },
          { path: "description", label: "Description", kind: "textarea", localizable: true },
          { path: "price", label: "Price", kind: "text", placeholder: "± Rp 0" },
          { path: "imageUrl", label: "Image", kind: "image" },
          { path: "shopUrl", label: "Shopping link", kind: "url" },
        ],
      },
    ],
  },
  gift: {
    category: "guests",
    label: "Wedding Gift",
    navLabel: "Gift",
    description: "Share bank or e-wallet details for gifts.",
    defaults: () => ({
      accounts: [
        { provider: "Bank", number: "0000 0000 00", holder: "Nama Pemilik Rekening" },
      ],
    }),
    fields: [
      { path: "note", label: "Note", kind: "textarea", localizable: true },
      {
        path: "accounts",
        label: "Accounts",
        kind: "list",
        itemLabel: "Account",
        of: [
          { path: "provider", label: "Provider", kind: "text", required: true, placeholder: "BCA" },
          { path: "number", label: "Number", kind: "text", required: true },
          { path: "holder", label: "Account holder", kind: "text", required: true },
          { path: "qrUrl", label: "QR image", kind: "image" },
        ],
      },
    ],
  },
  teamPoll: {
    category: "games",
    label: "Team Poll",
    navLabel: "Poll",
    description: "Guests pick a side and watch the tally update.",
    defaults: () => ({
      title: "Kamu tim yang mana?",
      description: "Ajak tamu memilih sisi favorit mereka.",
      options: [
        { id: "bride", label: "Team Bride", icon: "🌸", accent: "rose" },
        { id: "groom", label: "Team Groom", icon: "🌿", accent: "sage" },
      ],
    }),
    fields: [
      { path: "eyebrow", label: "Eyebrow", kind: "text", localizable: true },
      { path: "title", label: "Title", kind: "text", localizable: true },
      { path: "description", label: "Description", kind: "textarea", localizable: true },
      {
        path: "options",
        label: "Options",
        kind: "list",
        itemLabel: "Option",
        of: [
          { path: "label", label: "Label", kind: "text", required: true, localizable: true },
          { path: "tagline", label: "Tagline", kind: "text", localizable: true },
          { path: "icon", label: "Icon (emoji)", kind: "text" },
          {
            path: "accent",
            label: "Accent",
            kind: "select",
            options: [
              { value: "rose", label: "Rose" },
              { value: "sage", label: "Sage" },
              { value: "gold", label: "Gold" },
            ],
          },
        ],
      },
      { path: "footnote", label: "Footnote", kind: "text", localizable: true },
    ],
  },
  triviaQuiz: {
    category: "games",
    label: "Trivia Quiz",
    navLabel: "Quiz",
    description: "A quick quiz about the couple with a final score.",
    defaults: () => ({
      questions: [
        { question: "Di mana kami pertama bertemu?", options: ["Kampus", "Kantor", "Kafe", "Online"], answerIndex: 0 },
      ],
    }),
    fields: [
      {
        path: "questions",
        label: "Questions",
        kind: "list",
        itemLabel: "Question",
        of: [
          { path: "question", label: "Question", kind: "text", required: true, localizable: true },
          {
            path: "options",
            label: "Answer options",
            kind: "list",
            itemLabel: "Option",
            of: [{ path: "", label: "Option", kind: "text", localizable: true }],
          },
          { path: "answerIndex", label: "Correct option (0-based index)", kind: "number", required: true },
        ],
      },
    ],
  },
  songRequest: {
    category: "games",
    label: "Song Requests",
    navLabel: "Songs",
    description: "Let guests request songs for the reception.",
    defaults: () => ({ requests: [] }),
    // `requests` is the runtime guest feed, not authored content.
    fields: [],
  },
  bingo: {
    category: "games",
    label: "Bingo Card",
    navLabel: "Bingo",
    description: "A reception bingo card guests tap through.",
    defaults: () => ({
      cells: [
        "Pengantin menangis", "Ada yang telat", "Lagu dangdut", "Foto kabur", "Anak kecil lari",
        "MC salah nama", "Selfie booth", "Buket dilempar", "Makanan habis", "Tamu joget",
        "Pidato panjang", "Tiba-tiba hujan", "Free space", "Cincin susah", "Tepuk tangan",
        "Doa haru", "Kue dipotong", "Tos sampanye", "Video call", "Sepatu copot",
        "Konfeti", "Ketawa lepas", "Baju kembaran", "Salaman lama", "Momen haru",
      ],
    }),
    fields: [
      {
        path: "cells",
        label: "Cells",
        kind: "list",
        itemLabel: "Cell",
        of: [{ path: "", label: "Cell", kind: "text", localizable: true }],
      },
    ],
  },
  scratchCard: {
    category: "games",
    label: "Scratch Card",
    navLabel: "Lucky Draw",
    description: "Guests scratch to reveal a prize.",
    defaults: () => ({
      prize: "Selamat! Anda mendapatkan hadiah.",
    }),
    fields: [
      { path: "prize", label: "Prize", kind: "textarea", required: true, localizable: true },
      { path: "coverLabel", label: "Cover label", kind: "text", localizable: true, placeholder: "Gosok di sini ✨" },
    ],
  },
  guessDetail: {
    category: "games",
    label: "Guess the Detail",
    navLabel: "Guess",
    description: "Guests guess a hidden detail before the reveal.",
    defaults: () => ({
      title: "Tebak detailnya",
      question: "Tuliskan pertanyaan tebakan di sini.",
      answer: "Jawabannya 🎉",
    }),
    fields: [
      { path: "eyebrow", label: "Eyebrow", kind: "text", localizable: true },
      { path: "title", label: "Title", kind: "text", localizable: true },
      { path: "question", label: "Question", kind: "textarea", required: true, localizable: true },
      { path: "answer", label: "Answer", kind: "text", required: true, localizable: true },
      { path: "hint", label: "Hint", kind: "text", localizable: true },
    ],
  },
  photoChallenge: {
    category: "games",
    label: "Photo Challenge",
    navLabel: "Photos",
    description: "Photo prompts guests can upload to.",
    defaults: () => ({
      prompts: ["Selfie bersama pengantin", "Foto meja terbaik"],
      photos: [],
    }),
    // `photos` is the runtime upload feed, not authored content.
    fields: [
      {
        path: "prompts",
        label: "Prompts",
        kind: "list",
        itemLabel: "Prompt",
        of: [{ path: "", label: "Prompt", kind: "text", localizable: true }],
      },
      { path: "uploadLabel", label: "Upload button label", kind: "text", localizable: true },
    ],
  },
  bestDressed: {
    category: "games",
    label: "Best Dressed",
    navLabel: "Best Dressed",
    description: "Guests vote for the best-dressed attendee.",
    defaults: () => ({
      description: "Siapa yang berpakaian terbaik malam ini?",
      nominees: [
        { id: "a", name: "Nominasi 1" },
        { id: "b", name: "Nominasi 2" },
      ],
    }),
    fields: [
      { path: "eyebrow", label: "Eyebrow", kind: "text", localizable: true },
      { path: "title", label: "Title", kind: "text", localizable: true },
      { path: "description", label: "Description", kind: "textarea", localizable: true },
      {
        path: "nominees",
        label: "Nominees",
        kind: "list",
        itemLabel: "Nominee",
        of: [
          { path: "name", label: "Name", kind: "text", required: true },
          { path: "photoUrl", label: "Photo", kind: "image" },
          { path: "note", label: "Note", kind: "text", localizable: true },
        ],
      },
      { path: "footnote", label: "Footnote", kind: "text", localizable: true },
    ],
  },
  closing: {
    category: "closing",
    label: "Closing",
    navLabel: "Thanks",
    description: "A closing thank-you with your monogram and hashtag.",
    defaults: () => ({
      brideName: "Mempelai Wanita",
      groomName: "Mempelai Pria",
      message:
        "Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu berkenan hadir memberikan doa restu.",
    }),
    fields: [
      { path: "title", label: "Title", kind: "text", localizable: true },
      { path: "message", label: "Message", kind: "textarea", localizable: true },
      { path: "brideName", label: "Bride name", kind: "text" },
      { path: "groomName", label: "Groom name", kind: "text" },
      { path: "hashtag", label: "Hashtag", kind: "text" },
      { path: "initials", label: "Monogram initials", kind: "text" },
    ],
  },
}
