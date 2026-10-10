/**
 * ONE FILE TO CUSTOMISE THE WHOLE SITE.
 * Everything marked `sample` is placeholder content: replace it with the real salon's details.
 * Nothing here is a real business claim until you edit it.
 */
/** Domain used for the default contact email (contactus@domain). Change to the salon's real domain. */
const EMAIL_DOMAIN = "aurellesalon.com";

export const salon = {
  name: "Aurelle",
  tagline: "Salon & Spa",
  description:
    "A quiet, considered space for hair, skin, nails and bridal beauty. Book your appointment online in under a minute.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),

  /** Set to true once phone/address/hours below are the salon's REAL details. Enables LocalBusiness SEO data and the live map. */
  verified: false,

  contact: {
    phone: process.env.NEXT_PUBLIC_SALON_PHONE || "+92 330 2538977",
    whatsapp: process.env.NEXT_PUBLIC_SALON_WHATSAPP || "923302538977", // digits only, with country code. Bookings arrive here
    email: process.env.NEXT_PUBLIC_SALON_EMAIL || `contactus@${EMAIL_DOMAIN}`,
  },

  address: {
    line1: "Shop 12, Zamzama Boulevard",
    area: "DHA Phase 5",
    city: "Karachi",
    postcode: "75500",
    country: "Pakistan",
  },

  /** Show the Google Map in the Contact section (uses the address above). */
  showMap: true,

  /** 0 = Sunday ... 6 = Saturday. `null` = closed. Used by BOTH the page and the booking engine. */
  hours: {
    0: { open: "12:00", close: "18:00" },
    1: { open: "10:00", close: "20:00" },
    2: { open: "10:00", close: "20:00" },
    3: { open: "10:00", close: "20:00" },
    4: { open: "10:00", close: "20:00" },
    5: { open: "10:00", close: "20:00" },
    6: { open: "10:00", close: "21:00" },
  } as Record<number, { open: string; close: string } | null>,

  social: {
    instagram: "https://instagram.com/", // replace with the salon's profile
    facebook: "https://facebook.com/",
    tiktok: "",
  },

  currency: { code: "PKR", locale: "en-PK" },

  /**
   * No backend: availability comes from the hours above plus these two lists, which the salon edits.
   *  closedDates:  whole days the salon is closed (holidays), "YYYY-MM-DD"
   *  blockedSlots: times already taken / unavailable. stylistId "*" blocks everyone.
   */
  closedDates: [] as string[],
  blockedSlots: [] as { date: string; time: string; durationMin: number; stylistId: string }[],

  booking: {
    slotIntervalMin: 30,
    minNoticeHours: 3, // can't book sooner than this
    maxAdvanceDays: 60,
    timezone: "Asia/Karachi",
    policy:
      "Free rescheduling or cancellation up to 24 hours before your appointment. Late cancellations may be charged. Please arrive 5 minutes early.",
  },

  /** First-visit offer. Set enabled:false if the salon does not run one. */
  offer: {
    enabled: true,
    code: "WELCOME10",
    percent: 10,
    title: "Your First Visit, Made Special",
    text: "Enjoy 10% off your first salon experience with us.",
    terms: "Valid for first-time clients on one booking. Cannot be combined with other offers.",
  },

  /** Pop-up behaviour. Times in seconds, cooldowns in days. */
  popups: {
    enabled: true,
    welcome: { enabled: true, delaySec: 30, minScrollPct: 25, cooldownDays: 14 },
    reminder: { enabled: true, viewServicesSec: 10, cooldownDays: 2 },
    newsletter: { enabled: true, delaySec: 45, minScrollPct: 55, cooldownDays: 30 },
    exitIntent: { enabled: true, minTimeOnPageSec: 20, cooldownDays: 7 },
    maxPerSession: 2,
    minGapSec: 40,
  },

  seo: {
    title: "Aurelle Salon & Spa | Hair, Skin, Nails & Bridal Beauty",
    description:
      "Luxury hair, makeup, skin, nail and spa services. Meet our stylists and book your appointment online.",
  },

  /** Counters/testimonials: reviews below are demo content until you add real ones. */
  testimonialsAreSample: true,
};

export type Salon = typeof salon;

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
