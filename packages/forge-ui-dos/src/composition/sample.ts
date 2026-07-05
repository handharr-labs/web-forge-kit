import type { InvitationConfig } from "./invitation"

/**
 * A complete, handler-free demo invitation — the canonical "order slip". Renders
 * a fully working preview with `<Invitation config={sampleInvitationConfig} />`
 * (components are controlled-optional, so no persistence is required). Clone it
 * as a starting template, or drive the catalog's assembled-page preview.
 */
export const sampleInvitationConfig: InvitationConfig = {
  layout: { type: "single" },
  theme: {},
  sections: [
    {
      type: "cover",
      props: {
        brideName: "Vania",
        groomName: "Arbi",
        dateLabel: "Sabtu · 12 Desember 2026",
        guestName: "Keluarga Handharmahua",
      },
    },
    {
      type: "welcome",
      props: {
        eyebrow: "Welcome to our day",
        title: "With joy & gratitude",
        message:
          "This little website was personally made to celebrate this beautiful chapter with the people who have walked with us along the way. Thank you for being here.",
        signature: "Vania & Arbi",
      },
    },
    {
      type: "quote",
      props: {
        source: "QS. Ar-Rum: 21",
        children:
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya…",
      },
    },
    {
      type: "couple",
      heading: { eyebrow: "Meet the Bride & Groom", title: "Mempelai" },
      props: {
        bride: {
          name: "Vania",
          fullName: "Vania Ayu Lestari",
          parentage: "Putri dari Bpk. Hendra & Ibu Sari",
          instagram: "vania",
        },
        groom: {
          name: "Arbi",
          fullName: "Arbi Ramadhan",
          parentage: "Putra dari Bpk. Rudi & Ibu Wati",
          instagram: "arbi",
        },
      },
    },
    {
      type: "loveStory",
      heading: { eyebrow: "Our Journey", title: "The Road To Us", tone: "surface" },
      props: {
        milestones: [
          { period: "2019", title: "First Meet", body: "Dipertemukan di sebuah acara kampus." },
          { period: "2022", title: "The Journey", body: "Menjalani hubungan jarak jauh penuh kesabaran." },
          { period: "2026", title: "Forever", body: "Memutuskan melangkah ke jenjang pernikahan." },
        ],
      },
    },
    {
      type: "event",
      heading: { eyebrow: "Save the Date", title: "The Wedding Day" },
      props: {
        sessions: [
          {
            title: "Akad Nikah",
            dateLabel: "Sabtu, 12 Desember 2026",
            timeLabel: "08.00 – 10.00 WIB",
            venueName: "Masjid Agung",
            address: "Jl. Merdeka No. 1, Bandung",
            mapsUrl: "https://maps.google.com",
            calendar: {
              title: "Akad Nikah Vania & Arbi",
              start: "2026-12-12T08:00:00",
              end: "2026-12-12T10:00:00",
              location: "Masjid Agung, Bandung",
            },
          },
          {
            title: "Resepsi",
            dateLabel: "Sabtu, 12 Desember 2026",
            timeLabel: "11.00 – 14.00 WIB",
            venueName: "Balai Sartika",
            address: "Jl. Merdeka No. 2, Bandung",
            mapsUrl: "https://maps.google.com",
          },
        ],
      },
    },
    {
      type: "countdown",
      heading: { title: "Counting Down", tone: "surface" },
      props: { target: "2026-12-12T08:00:00" },
    },
    {
      type: "gallery",
      heading: { eyebrow: "Gallery", title: "Moments" },
      props: {
        images: Array.from(
          { length: 6 },
          (_, i) => `https://picsum.photos/seed/mekar${i}/400/400`
        ),
      },
    },
    {
      type: "teamPoll",
      props: {
        eyebrow: "After reading our story, it's time to choose your side!",
        title: "Which team are you?",
        description:
          "Team Groom — quietly noticing from afar? Or Team Bride — blissfully unbothered, but ready to say yes to forever?",
        options: [
          { id: "bride", label: "Team Bride", tagline: "Unbothered, Then Married", icon: "🌸", accent: "rose" },
          { id: "groom", label: "Team Groom", tagline: "Quietly Crushing First", icon: "🌿", accent: "sage" },
        ],
        results: { bride: 82, groom: 55 },
        footnote: "Results may or may not become a lifelong debate.",
      },
    },
    {
      type: "rsvp",
      heading: { eyebrow: "Be Part of Our Day", title: "RSVP" },
      props: { defaultName: "Keluarga Handharmahua" },
    },
    {
      type: "guestbook",
      heading: { eyebrow: "A Wall of Love", title: "Doa & Ucapan", tone: "surface" },
      props: {
        messages: [
          { name: "Rani", message: "Selamat menempuh hidup baru! 🤍" },
          { name: "Dimas", message: "Bahagia selalu untuk kalian berdua." },
        ],
      },
    },
    {
      type: "gift",
      heading: { eyebrow: "A Token of Love", title: "Wedding Gift" },
      props: {
        accounts: [
          { provider: "BCA", number: "1234 5678 90", holder: "Vania Ayu Lestari" },
          { provider: "GoPay", number: "0812 3456 7890", holder: "Arbi Ramadhan" },
        ],
      },
    },
    {
      type: "wishlist",
      heading: { eyebrow: "Our Wishlist", title: "Wedding Wishlist", tone: "surface" },
      props: {
        items: [
          { id: "1", name: "Coffee Machine", description: "Espresso maker untuk pagi berdua.", price: "± Rp 2.500.000", shopUrl: "https://example.com" },
          { id: "2", name: "Air Purifier", description: "Udara bersih di rumah baru.", price: "± Rp 1.200.000", claimedBy: "Keluarga Sari" },
        ],
      },
    },
    {
      type: "liveStream",
      heading: { title: "Live Streaming" },
      props: {
        url: "https://youtube.com",
        platform: "YouTube Live",
        note: "Bagi yang berhalangan hadir, saksikan momen kami secara langsung.",
      },
    },
    {
      type: "closing",
      props: {
        brideName: "Vania",
        groomName: "Arbi",
        hashtag: "#VaniaArbi2026",
        message:
          "Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu berkenan hadir memberikan doa restu.",
      },
    },
  ],
}
