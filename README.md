# Aurelle: Luxury Salon Website

**Live site: [salon-khaki-three.vercel.app](https://salon-khaki-three.vercel.app/)**

A premium, fully responsive website for a beauty salon, with a complete online booking flow. Built with Next.js, Tailwind CSS and Motion.

"Aurelle" is a sample brand. The whole site is driven by a few configuration files, so it can be re-branded for any salon without touching the UI code.

## Highlights

- **Cinematic hero** with parallax, word-by-word headline reveal and a clear booking call to action.
- **Online booking in five steps:** service, stylist (or any available), date and time, details, review. Availability is calculated live from the salon's opening hours.
- **No backend required.** Bookings are completed in the browser and delivered to the salon through a pre-written WhatsApp message.
- **Services and pricing** with category filters, durations, "from" prices and a one-click "Book this service".
- **Portfolio gallery** with filters and an accessible lightbox (keyboard, swipe, Escape).
- **Considered pop-ups:** welcome offer, exit intent, booking reminder and updates sign-up, all governed by one controller with strict frequency rules.
- **Mobile-first:** sticky call, WhatsApp and book bar, full-screen menu, no horizontal overflow from 320 px upwards.
- **Accessible and motion-aware:** semantic landmarks, focus management in dialogs, visible focus states, and full support for `prefers-reduced-motion`.
- **SEO ready:** metadata, Open Graph, sitemap, robots and LocalBusiness structured data (enabled once real details are supplied).

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Motion (`motion/react`) |
| Icons | Lucide |
| Fonts | Cormorant Garamond, Jost (via `next/font`) |
| Images | `next/image` with Unsplash sources |
| Hosting | Any static host; tested for Vercel |

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm start            # serve the production build
npm run typecheck    # TypeScript check
```

## Project structure

```
app/                  Routes: home, privacy, sitemap, robots, icon
components/
  sections/           Page sections (Hero, Services, Gallery, Team, ...)
  booking/            Booking dialog, calendar, provider
  popups/             Pop-up controller and individual pop-ups
  ui/                 Buttons, modal, reveal and parallax primitives
config/salon.ts       Brand, contact, hours, offer, booking rules, pop-up timing
data/                 Services, stylists, gallery, testimonials, FAQs
lib/                  Booking engine, formatting, image helpers
```

## Customising the site

Almost everything is editable in plain data files.

| To change | Edit |
|---|---|
| Name, contact details, address, opening hours, social links, currency | `config/salon.ts` |
| Booking rules (slot length, notice, window), offer and pop-up timing | `config/salon.ts` |
| Closed dates and already-taken times | `closedDates` and `blockedSlots` in `config/salon.ts` |
| Services, durations and prices | `data/services.ts` |
| Team | `data/stylists.ts` |
| Gallery, testimonials, FAQs, offers | `data/content.ts` |
| Photos | `lib/images.ts` (Unsplash ids) or any file in `public/` |
| Colours and typography | `app/globals.css` (`@theme`) and `app/layout.tsx` |

Opening hours, service durations and stylist days off feed the booking engine directly, so editing them changes which times customers can choose.

## How booking works

Everything runs in the visitor's browser. There is no server, database or API to host.

1. **Live availability.** Time slots are calculated from opening hours, service duration, stylist working days, minimum notice and the booking window.
2. **Instant confirmation screen.** After confirming, the customer sees a booking reference, an add-to-calendar file and a copy-details button.
3. **Delivery to the salon.** A **Send to salon on WhatsApp** button opens WhatsApp with the complete booking pre-written (reference, service, stylist, time, name, phone, notes, total). The salon receives it on its own WhatsApp number and confirms the slot.
4. **Remembered on the device.** The customer's bookings are stored in the browser, so they see their upcoming bookings on return and the same slot cannot be booked twice from that device.

### Limitations of the no-backend design

- Availability is **not shared between customers**. Two people can choose the same time; the salon resolves it when the WhatsApp message arrives. The interface therefore says "booking received" and asks the customer to send it, rather than claiming the salon has confirmed.
- To keep the calendar aligned with the real diary, update `closedDates` and `blockedSlots` in `config/salon.ts` and redeploy.
- A shared live diary and automatic notifications to the salon require a backend. The booking logic in `lib/booking/` is separated from the UI so one can be added later.

## Pop-up behaviour

All timings live in `config/salon.ts` under `popups`.

- Never two at once, never while the booking dialog is open, never on first paint.
- At most two per session, with a minimum gap between them.
- Each type has its own cool-down, remembered in the browser.
- Welcome offer: after 30 seconds and 25% scroll.
- Exit intent: desktop mouse only, after 20 seconds on the page. Not simulated on touch devices.
- Booking reminder: a small, non-blocking card after time spent on the services section without starting a booking.
- Every pop-up has a close button, closes on Escape, traps focus and fits small screens.

## Environment variables

All optional. Copy `.env.example` to `.env.local` for local use.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL used for SEO, sitemap and Open Graph |
| `NEXT_PUBLIC_SALON_PHONE` | Overrides the displayed phone number |
| `NEXT_PUBLIC_SALON_WHATSAPP` | Overrides the WhatsApp number (digits only, with country code). Bookings arrive here |
| `NEXT_PUBLIC_SALON_EMAIL` | Overrides the contact email |

## Deployment

1. Push the repository to GitHub.
2. Import it into Vercel (defaults work).
3. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
4. Confirm the WhatsApp number in `config/salon.ts`, since this is where bookings are delivered.

## Before going live

The following are placeholders and must be replaced with the salon's real information:

- Address (a Karachi example), email domain (`aurellesalon.com`), prices, team names and portraits, and the three testimonials. Publish only genuine client reviews.
- The 10% first-visit offer is a sample. The booking records the code and the salon decides eligibility at the visit. Set `offer.enabled: false` if there is no offer.
- Set `verified: true` in `config/salon.ts` once all details are real, which enables LocalBusiness structured data for search engines. The map (`showMap`) uses the address in the config.
- Review the privacy policy text with a legal professional.

## Quality checks

- Type-check and production build pass; every route is statically generated.
- Verified in Chrome with scripted checks: the full booking flow, form validation, services filtering, lightbox, FAQ, mobile menu, sticky mobile bar, pop-up timing and dismissal, reduced-motion behaviour, and no horizontal overflow at 320, 390, 768, 1024 and 1440 px.
- Lighthouse and Core Web Vitals have not been measured. Run them against the deployed site.

## Disclaimer

Photography is sourced from Unsplash for demonstration. Confirm licensing and replace with the salon's own imagery before launch.
