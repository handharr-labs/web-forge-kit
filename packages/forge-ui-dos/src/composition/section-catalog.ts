import type { SectionType, SectionPropsMap } from "./invitation"

/* ----------------------------------------------------------------------------
   The catalog: metadata *about* the menu. `SECTION_REGISTRY` maps a type to its
   component (how to render); this maps a type to how to *present and seed* it in
   a builder — which category it belongs to, its human copy, whether it's a
   singleton, and valid starter props to drop in on add. Kept exhaustive over
   `SectionType` so adding an organism forces its classification here.
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

export type SectionMeta<K extends SectionType = SectionType> = {
  category: SectionCategory
  /** Full picker label — "Trivia Quiz". */
  label: string
  /** Short nav-rail label — "Quiz". The single source for nav-rail fallbacks. */
  navLabel: string
  /** One line for the picker card. */
  description: string
  /** Only one allowed in a config (cover, closing). Default false. */
  singleton?: boolean
  /**
   * Valid, handler-free starter props seeded on add — the data-only shape that
   * already renders a working optimistic preview under `<Invitation>`. Generic
   * placeholder content an operator then edits. A factory (not a shared
   * constant) so adding two of the same section never aliases props.
   */
  defaults: () => SectionPropsMap[K]
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
    singleton: true,
    defaults: () => ({
      brideName: "Mempelai Wanita",
      groomName: "Mempelai Pria",
      dateLabel: "Tanggal Acara",
    }),
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
  },
  countdown: {
    category: "event",
    label: "Countdown",
    navLabel: "Countdown",
    description: "A live countdown to the big day.",
    defaults: () => ({
      target: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    }),
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
  },
  rsvp: {
    category: "guests",
    label: "RSVP",
    navLabel: "RSVP",
    description: "Let guests confirm their attendance.",
    defaults: () => ({}),
  },
  guestbook: {
    category: "guests",
    label: "Guestbook",
    navLabel: "Wishes",
    description: "Collect wishes and prayers from your guests.",
    defaults: () => ({ messages: [] }),
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
  },
  songRequest: {
    category: "games",
    label: "Song Requests",
    navLabel: "Songs",
    description: "Let guests request songs for the reception.",
    defaults: () => ({ requests: [] }),
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
  },
  scratchCard: {
    category: "games",
    label: "Scratch Card",
    navLabel: "Lucky Draw",
    description: "Guests scratch to reveal a prize.",
    defaults: () => ({
      prize: "Selamat! Anda mendapatkan hadiah.",
    }),
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
  },
  closing: {
    category: "closing",
    label: "Closing",
    navLabel: "Thanks",
    description: "A closing thank-you with your monogram and hashtag.",
    singleton: true,
    defaults: () => ({
      brideName: "Mempelai Wanita",
      groomName: "Mempelai Pria",
      message:
        "Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu berkenan hadir memberikan doa restu.",
    }),
  },
}
