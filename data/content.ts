import { IMG, photo } from "@/lib/images";

export type GalleryCategory = "Hair" | "Colour" | "Bridal" | "Skin" | "Nails" | "Spa";
export const GALLERY_FILTERS: ("All" | GalleryCategory)[] = ["All", "Hair", "Colour", "Bridal", "Skin", "Nails", "Spa"];

export type GalleryItem = { id: string; category: GalleryCategory; caption: string; src: string; alt: string; ratio: "tall" | "wide" | "square" };

/** SAMPLE portfolio: replace with the salon's own work. */
export const GALLERY: GalleryItem[] = [
  { id: "g1", category: "Colour", caption: "Soft ash balayage", src: photo(IMG.ash, 900), alt: "Long wavy hair with soft ash balayage", ratio: "tall" },
  { id: "g2", category: "Bridal", caption: "Bridal glow", src: photo(IMG.bridal1, 900), alt: "Bride with soft glam makeup and traditional jewellery", ratio: "tall" },
  { id: "g3", category: "Hair", caption: "Sculpted copper updo", src: photo(IMG.updoB, 900), alt: "Copper-red braided updo seen from behind", ratio: "square" },
  { id: "g4", category: "Skin", caption: "Hydrating facial", src: photo(IMG.facial1, 900), alt: "Client enjoying a hydrating facial treatment", ratio: "tall" },
  { id: "g5", category: "Nails", caption: "Mauve & glitter gel", src: photo(IMG.nails3, 900), alt: "Hand with mauve, white and glitter manicure", ratio: "square" },
  { id: "g6", category: "Colour", caption: "Fashion colour", src: photo(IMG.vivid, 900), alt: "Vivid purple and teal hair colour", ratio: "tall" },
  { id: "g7", category: "Hair", caption: "Textured waves", src: photo(IMG.curls, 900), alt: "Stylist curling a client's hair into soft waves", ratio: "wide" },
  { id: "g8", category: "Bridal", caption: "Bridal editorial", src: photo(IMG.bridal3, 900), alt: "Bridal look with red dupatta and a rose in her hair", ratio: "tall" },
  { id: "g9", category: "Spa", caption: "Ritual set-up", src: photo(IMG.spa1, 900), alt: "Warm towels and candles for a spa treatment", ratio: "square" },
  { id: "g10", category: "Nails", caption: "Minimal nude", src: photo(IMG.nails2, 900), alt: "Light pink manicured nails", ratio: "tall" },
  { id: "g11", category: "Hair", caption: "Precision cut", src: photo(IMG.cut, 900), alt: "Stylist cutting long dark hair with scissors", ratio: "tall" },
  { id: "g12", category: "Skin", caption: "Calming mask", src: photo(IMG.facial2, 900), alt: "Woman relaxing with a facial mask", ratio: "wide" },
  { id: "g13", category: "Bridal", caption: "Evening makeup", src: photo(IMG.makeupArtist, 900), alt: "Makeup artist applying makeup to a client", ratio: "tall" },
  { id: "g14", category: "Spa", caption: "Cucumber & calm", src: photo(IMG.spa2, 900), alt: "Guest relaxing with cucumber slices over her eyes", ratio: "tall" },
];

export const TESTIMONIALS = [
  { id: "t1", name: "Amelia R.", service: "Balayage", text: "Emma listened to exactly what I wanted and gave me the softest, most natural colour. I get compliments every single week." },
  { id: "t2", name: "Charlotte W.", service: "Bridal makeup", text: "From the trial to the wedding morning, everything was calm and beautiful. My makeup lasted all night and looked perfect in every photo." },
  { id: "t3", name: "Isabella T.", service: "Hydrating facial", text: "The most relaxing hour of my month. My skin felt fresh and glowing for days, and the advice for home care was genuinely helpful." },
];

export const FAQS = [
  { q: "How do I book an appointment?", a: "Choose “Book Appointment” anywhere on the site, pick your service, stylist, date and time, and confirm. You'll receive a booking reference immediately." },
  { q: "Can I change or cancel my booking?", a: "Yes. Call or message us on WhatsApp with your booking reference. Rescheduling is free up to 24 hours before your appointment." },
  { q: "Do I need a consultation for colour or bridal services?", a: "We recommend one. Mention it in the notes when booking and we'll allow extra time, or book a bridal trial ahead of your big day." },
  { q: "Which payment methods do you accept?", a: "Payment is taken at the salon after your appointment. Please ask the team if you would like to know which payment methods are accepted." },
  { q: "How long will my appointment take?", a: "Each service shows its typical duration. Longer treatments like balayage or bridal can take a little more, depending on hair length and detail." },
  { q: "I'm running late. What should I do?", a: "Please call us as soon as you can. We'll do our best to accommodate you, though a shortened service may be needed." },
];

export const HOW_IT_WORKS = [
  { title: "Choose your service", text: "Browse treatments with clear durations and prices." },
  { title: "Pick your stylist & time", text: "Select a favourite stylist, or any available, then see live openings." },
  { title: "Confirm in a minute", text: "Add your details, review, and receive your booking reference." },
  { title: "Arrive and unwind", text: "We'll take care of the rest. Just bring yourself." },
];

export const OFFERS = [
  { id: "o1", tag: "First visit", title: "10% off your first appointment", text: "Welcome gift for new clients. Mention code at booking.", image: photo(IMG.reception, 900) },
  { id: "o2", tag: "Seasonal", title: "Bridal trial session", text: "Plan your look early with a styled trial.", image: photo(IMG.bridal4, 900) },
];
