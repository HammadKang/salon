import { salon } from "@/config/salon";
import { getService } from "@/data/services";
import { STYLISTS, getStylist, type Stylist } from "@/data/stylists";

/** Pure booking logic shared by the API routes (server) and the UI (client hints). */

export type StoredBooking = {
  id: string;
  reference: string;
  serviceId: string;
  stylistId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMin: number;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  promoCode?: string;
  discountPercent: number;
  price: number;
  total: number;
  createdAt: string;
  status: "confirmed"; // "received": saved on the customer's device; the salon confirms via WhatsApp
};

export const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
export const fromMin = (n: number) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

export const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const weekdayOf = (iso: string) => new Date(iso + "T12:00:00").getDay();

/** Current wall-clock time in the salon's timezone (so "today" is correct for the salon, not the server). */
export function salonNow(): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: salon.booking.timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const hour = Number(get("hour")) % 24;
  return { date: `${get("year")}-${get("month")}-${get("day")}`, minutes: hour * 60 + Number(get("minute")) };
}

export const addDays = (iso: string, n: number) => {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return isoDate(d);
};

export function stylistsForService(serviceId: string): Stylist[] {
  const s = getService(serviceId);
  if (!s) return [];
  return STYLISTS.filter((st) => st.categories.includes(s.category));
}

type Busy = Pick<StoredBooking, "stylistId" | "time" | "durationMin">;

/** Slots (start times) for a date. Each slot lists the stylists that are free for the whole service duration. */
export function computeSlots(opts: {
  date: string;
  serviceId: string;
  stylistId: string | "any";
  booked: Busy[];
}): { time: string; stylistIds: string[] }[] {
  const service = getService(opts.serviceId);
  if (!service) return [];
  const hours = salon.hours[weekdayOf(opts.date)];
  if (!hours || salon.closedDates.includes(opts.date)) return [];
  const blocked = salon.blockedSlots.filter((b) => b.date === opts.date);

  const { date: today, minutes: nowMin } = salonNow();
  if (opts.date < today || opts.date > addDays(today, salon.booking.maxAdvanceDays)) return [];

  const earliest = opts.date === today ? nowMin + salon.booking.minNoticeHours * 60 : 0;
  const open = toMin(hours.open);
  const close = toMin(hours.close);
  const candidates =
    opts.stylistId === "any"
      ? stylistsForService(opts.serviceId)
      : stylistsForService(opts.serviceId).filter((s) => s.id === opts.stylistId);

  const working = candidates.filter((s) => !(s.daysOff ?? []).includes(weekdayOf(opts.date)));
  const result: { time: string; stylistIds: string[] }[] = [];

  for (let start = open; start + service.durationMin <= close; start += salon.booking.slotIntervalMin) {
    if (start < earliest) continue;
    const free = working.filter((st) =>
      [...opts.booked, ...blocked]
        .filter((b) => b.stylistId === st.id || b.stylistId === "*")
        .every((b) => start + service.durationMin <= toMin(b.time) || start >= toMin(b.time) + b.durationMin)
    );
    if (free.length) result.push({ time: fromMin(start), stylistIds: free.map((s) => s.id) });
  }
  return result;
}

export function discountFor(code?: string) {
  if (!code || !salon.offer.enabled) return 0;
  return code.trim().toUpperCase() === salon.offer.code ? salon.offer.percent : 0;
}

export const makeReference = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `AUR-${s}`;
};

export { getStylist };
