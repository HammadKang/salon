import type { StoredBooking } from "./engine";
import { makeReference } from "./engine";

/**
 * Bookings live in THIS browser (localStorage). There is no server.
 * The salon receives the booking when the customer sends it via WhatsApp (see the confirmation screen).
 */
const KEY = "aurelle:my-bookings";

export function loadBookings(): StoredBooking[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function saveBooking(input: Omit<StoredBooking, "id" | "reference" | "createdAt" | "status">): StoredBooking {
  const booking: StoredBooking = { ...input, id: crypto.randomUUID(), reference: makeReference(), createdAt: new Date().toISOString(), status: "confirmed" };
  try { localStorage.setItem(KEY, JSON.stringify([...loadBookings(), booking])); } catch {}
  return booking;
}

export function removeBooking(id: string) {
  try { localStorage.setItem(KEY, JSON.stringify(loadBookings().filter((b) => b.id !== id))); } catch {}
}
