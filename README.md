# Aurelle: Luxury Salon Website

A premium, fully responsive salon website with a working online-booking flow, built with Next.js, Tailwind CSS and Motion.
"Aurelle" is a **sample brand**. Everything is driven by a few editable files, so it can be re-branded for any salon.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production check
```

Requires Node.js 20+.

## What's inside

| Area | Details |
|---|---|
| Hero | Full-screen image with parallax, word-by-word headline reveal, two CTAs, scroll cue |
| Navigation | Transparent over the hero, sticky ivory header on scroll, animated underlines, active-section highlight, full-screen mobile menu with focus trap |
| Services | 15 services in 7 categories. Shows 6 first with **View all**, compact rows on mobile, animated filter tabs, duration, "from" price, promo labels, **Book this service** (the choice carries into the booking flow) |
| Signature treatments | Large editorial rows with parallax imagery |
| About, Team | Layered imagery, stylist profiles, "Book with …" preselects the stylist |
| Gallery | Masonry grid, category filter, lightbox with arrows, keyboard, swipe and Esc |
| Booking | 5 steps: service, stylist (or any available), date and time, details, review. Then a confirmation with reference, "send to salon on WhatsApp", add-to-calendar (.ics) and copy-details |
| Pop-ups | Welcome offer, exit intent (desktop mouse only), booking reminder, updates (WhatsApp). Managed by one controller |
| Trust and info | How booking works, testimonials carousel, offers, FAQ accordion, hours, click-to-call, WhatsApp, map, mobile sticky action bar |
| SEO | Metadata, Open Graph, sitemap, robots, LocalBusiness JSON-LD (see below) |

## Customise (no UI code needed)

| What | Where |
|---|---|
| Name, contact, address, **opening hours**, social links, currency, booking rules, offer, pop-up timing, SEO | `config/salon.ts` |
| Services and prices | `data/services.ts` |
| Stylists | `data/stylists.ts` |
| Gallery, testimonials, FAQs, offers, "how it works" | `data/content.ts` |
| Photos | `lib/images.ts` (Unsplash ids) or any `/public` file |
| Colours and fonts | `app/globals.css` (`@theme`) and `app/layout.tsx` |

Opening hours, durations and stylist days off in these files are used by the **real availability engine**, so changing them changes which slots customers can book.

## How booking works (no backend, no API)

Everything runs in the visitor's browser. There is no server, no database and no API to host or pay for.

1. **Live availability.** Slots are calculated on the spot from the salon's opening hours, each service's duration, stylists' days off, the minimum notice and the booking window (all in `config/salon.ts` and `data/`).
2. **Instant feedback.** The customer picks service, stylist, date and time, fills in their details and confirms. They immediately see a "Booking received" screen with a booking reference, add-to-calendar and a copy-details button.
3. **It reaches the salon through WhatsApp.** The confirmation screen has a **Send to salon on WhatsApp** button that opens WhatsApp with the full booking pre-written (reference, service, stylist, time, name, phone, notes, total). The salon gets the booking on its own WhatsApp number and confirms the slot.
4. **Saved on the customer's device.** Their bookings are remembered in the browser (`localStorage`), so they see "Your upcoming bookings" next time and the same slot can't be booked twice on that device.

**Be aware of the limits of a no-backend design:**
- Availability is **not shared between customers**. Two different people can pick the same time, and the salon resolves it when the WhatsApp message arrives. The page says "received" and asks the customer to send it to the salon; it never claims the salon has confirmed.
- To keep the page in step with the real diary, the salon edits two lists in `config/salon.ts`: `closedDates` (holidays) and `blockedSlots` (times already taken). Redeploy and the calendar updates for everyone.
- A real shared diary and automatic salon notifications need a backend. That can be added later without changing the design.

**Before going live:** the WhatsApp/phone number is set, but the address (a Karachi example), email (`contactus@aurellesalon.com`), prices, team names and photos, and the three reviews are **placeholder content**. Replace them with the salon's real details in `config/salon.ts` and `data/`. In particular, publish only real client reviews. Set `verified: true` once everything is real to switch on the LocalBusiness structured data for Google. The map (`showMap`) uses whatever address is in the config. The 10% first-visit offer is a sample too: the booking records the code and the salon decides eligibility at the visit; set `offer.enabled: false` if there is no offer.

## Environment variables

Copy `.env.example` to `.env.local`. All are optional.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Live URL for SEO, sitemap and Open Graph |
| `NEXT_PUBLIC_SALON_PHONE` | Overrides the phone number |
| `NEXT_PUBLIC_SALON_WHATSAPP` | Overrides the WhatsApp number (digits only, with country code). This is where bookings arrive |

## Pop-up behaviour

All timings are in `config/salon.ts → popups`.
- Never two at once, never while the booking dialog is open, never on first paint
- Maximum 2 per session and a minimum gap between pop-ups
- Each type has its own cool-down (remembered in the browser)
- Welcome offer: after 30 s and 25% scroll. Updates pop-up (join by WhatsApp): later, deeper in the page
- Exit intent: desktop mouse only, after 20 s on the page, never on touch devices
- Booking reminder: a small non-blocking card after the visitor has spent time on Services without opening booking
- All have close buttons, Esc to close, focus trapping and fit small screens

## Accessibility and motion

- Semantic landmarks, skip link, visible focus rings, labelled form fields, ARIA for tabs, accordion, dialogs and progress
- All animation respects `prefers-reduced-motion` (Motion's `MotionConfig` plus CSS)
- Animations use transforms and opacity only; scroll effects use Motion's scroll hooks, not scroll handlers

## Deploy to Vercel

1. Push to GitHub and import the repo in Vercel (defaults are fine).
2. Set `NEXT_PUBLIC_SITE_URL`.
3. Put the real WhatsApp number in `config/salon.ts` so bookings reach the salon.

## Verified

Type-check and production build pass (every route is static). Tested in a browser: full booking flow end to end with zero network calls, slot removal after booking, upcoming-bookings list, WhatsApp message contents, form validation, the lightbox, welcome and exit-intent pop-ups, and no horizontal overflow at 320 px wide. **Lighthouse / Core Web Vitals were not measured**, so please run them on your deployed site.
