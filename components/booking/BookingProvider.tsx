"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { StoredBooking } from "@/lib/booking/engine";

export type Details = { name: string; phone: string; email: string; notes: string; consent: boolean };
export type Draft = {
  step: number; // 0 service, 1 stylist, 2 date & time, 3 details, 4 review
  serviceId?: string;
  stylistId: string; // "any" or stylist id
  date?: string;
  time?: string;
  details: Details;
};

const EMPTY: Draft = { step: 0, stylistId: "any", details: { name: "", phone: "", email: "", notes: "", consent: false } };
const DRAFT_KEY = "aurelle:booking-draft";
const OFFER_KEY = "aurelle:offer-claimed";

type Ctx = {
  isOpen: boolean;
  open: (o?: { serviceId?: string; stylistId?: string }) => void;
  close: () => void;
  draft: Draft;
  setDraft: (u: Partial<Draft> | ((d: Draft) => Partial<Draft>)) => void;
  result: StoredBooking | null;
  setResult: (b: StoredBooking | null) => void;
  reset: () => void;
  offerClaimed: boolean;
  claimOffer: () => void;
  /** true once the visitor has opened the booking flow this session */
  bookingStarted: boolean;
};

const BookingContext = createContext<Ctx | null>(null);
export const useBooking = () => {
  const c = useContext(BookingContext);
  if (!c) throw new Error("useBooking must be used inside <BookingProvider>");
  return c;
};

const BookingDialog = dynamic(() => import("./BookingDialog"), { ssr: false });

export default function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [draft, setDraftState] = useState<Draft>(EMPTY);
  const [result, setResult] = useState<StoredBooking | null>(null);
  const [offerClaimed, setOfferClaimed] = useState(false);
  const [bookingStarted, setStarted] = useState(false);

  // Restore draft + offer from storage (client only, avoids hydration mismatch)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) setDraftState({ ...EMPTY, ...JSON.parse(raw) });
      setOfferClaimed(localStorage.getItem(OFFER_KEY) === "1");
    } catch {}
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch {}
  }, [draft]);

  const setDraft: Ctx["setDraft"] = useCallback((u) => {
    setDraftState((d) => ({ ...d, ...(typeof u === "function" ? u(d) : u) }));
  }, []);

  const open: Ctx["open"] = useCallback((o) => {
    setMounted(true);
    setStarted(true);
    setResult(null);
    setDraftState((d) => {
      if (!o?.serviceId) return o?.stylistId ? { ...d, stylistId: o.stylistId } : d;
      // Preselected service from a "Book this service" button: jump past the service step.
      const changed = d.serviceId !== o.serviceId;
      return { ...d, serviceId: o.serviceId, stylistId: o.stylistId ?? (changed ? "any" : d.stylistId), date: changed ? undefined : d.date, time: changed ? undefined : d.time, step: Math.max(1, changed ? 1 : d.step) };
    });
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const reset = useCallback(() => { setDraftState(EMPTY); setResult(null); }, []);
  const claimOffer = useCallback(() => {
    setOfferClaimed(true);
    try { localStorage.setItem(OFFER_KEY, "1"); } catch {}
  }, []);

  const value = useMemo(
    () => ({ isOpen, open, close, draft, setDraft, result, setResult, reset, offerClaimed, claimOffer, bookingStarted }),
    [isOpen, open, close, draft, setDraft, result, reset, offerClaimed, claimOffer, bookingStarted]
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      {mounted && <BookingDialog />}
    </BookingContext.Provider>
  );
}
