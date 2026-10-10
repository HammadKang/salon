"use client";

import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useBooking } from "@/components/booking/BookingProvider";
import { salon } from "@/config/salon";
import { IMG, photo } from "@/lib/images";

type Kind = "welcome" | "reminder" | "newsletter" | "exit";
const KEY = "aurelle:popups";
const DAY = 86_400_000;

type Store = Partial<Record<Kind, number>> & { subscribed?: boolean };
const readStore = (): Store => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } };
const writeStore = (s: Store) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };

/**
 * One brain for every pop-up. Guarantees: never two at once, never while booking, capped per session,
 * minimum gap between pop-ups, per-type cool-downs remembered across visits, no pop-up on first paint.
 */
export default function PopupManager() {
  const cfg = salon.popups;
  const { isOpen: bookingOpen, bookingStarted, offerClaimed, open: openBooking } = useBooking();
  const [active, setActive] = useState<Kind | null>(null);

  const state = useRef({ start: Date.now(), scrollPct: 0, servicesMs: 0, shownThisSession: 0, lastShown: 0, bookingOpen: false, bookingStarted: false, offerClaimed: false, active: null as Kind | null });
  state.current.bookingOpen = bookingOpen;
  state.current.bookingStarted = bookingStarted;
  state.current.offerClaimed = offerClaimed;
  state.current.active = active;

  const cooled = (kind: Kind, days: number) => {
    const t = readStore()[kind];
    return !t || Date.now() - t > days * DAY;
  };

  const show = useCallback((kind: Kind) => {
    const s = state.current;
    s.shownThisSession += 1; s.lastShown = Date.now();
    writeStore({ ...readStore(), [kind]: Date.now() });
    setActive(kind);
  }, []);

  const canShow = () => {
    const s = state.current;
    return cfg.enabled && !s.active && !s.bookingOpen && document.visibilityState === "visible" &&
      s.shownThisSession < cfg.maxPerSession && Date.now() - s.lastShown > cfg.minGapSec * 1000;
  };

  useEffect(() => {
    if (!cfg.enabled) return;
    const s = state.current;

    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      s.scrollPct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Time spent actually looking at the services section
    let inView = false;
    const target = document.getElementById("services");
    const io = target ? new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0.35 }) : null;
    if (target && io) io.observe(target);

    const tick = setInterval(() => {
      if (inView && document.visibilityState === "visible") s.servicesMs += 1000;
      if (!canShow()) return;
      const elapsed = (Date.now() - s.start) / 1000;
      const store = readStore();

      if (cfg.welcome.enabled && salon.offer.enabled && !s.offerClaimed && elapsed >= cfg.welcome.delaySec && s.scrollPct >= cfg.welcome.minScrollPct && cooled("welcome", cfg.welcome.cooldownDays)) return show("welcome");
      if (cfg.reminder.enabled && !s.bookingStarted && s.servicesMs / 1000 >= cfg.reminder.viewServicesSec && cooled("reminder", cfg.reminder.cooldownDays)) return show("reminder");
      if (cfg.newsletter.enabled && !store.subscribed && elapsed >= cfg.newsletter.delaySec && s.scrollPct >= cfg.newsletter.minScrollPct && cooled("newsletter", cfg.newsletter.cooldownDays)) return show("newsletter");
    }, 1000);

    // Exit intent: only for real mouse pointers leaving through the top edge. Not simulated on touch devices.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onLeave = (e: MouseEvent) => {
      if (!finePointer || !cfg.exitIntent.enabled) return;
      if (e.relatedTarget || e.clientY > 0) return;
      if ((Date.now() - s.start) / 1000 < cfg.exitIntent.minTimeOnPageSec) return;
      if (!canShow() || !cooled("exit", cfg.exitIntent.cooldownDays) || s.bookingStarted) return;
      show("exit");
    };
    document.addEventListener("mouseout", onLeave);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeave);
      clearInterval(tick);
      io?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => { state.current.lastShown = Date.now(); setActive(null); }, []);
  const book = () => { close(); setTimeout(() => openBooking(), 150); };
  const markSubscribed = () => writeStore({ ...readStore(), subscribed: true });

  return (
    <>
      {active === "welcome" && <WelcomeOffer onClose={close} onBook={book} />}
      {active === "newsletter" && <NewsletterPopup onClose={close} onSubscribed={markSubscribed} />}
      {active === "exit" && <ExitIntent onClose={close} onBook={book} />}
      <AnimatePresence>{active === "reminder" && <ReminderToast onClose={close} onBook={book} />}</AnimatePresence>
    </>
  );
}

/* ---------- A. Welcome offer ---------- */
function WelcomeOffer({ onClose, onBook }: { onClose: () => void; onBook: () => void }) {
  const { claimOffer } = useBooking();
  const [done, setDone] = useState(false);

  return (
    <Modal open onClose={onClose} label={salon.offer.title} size="lg" className="sm:flex-row">
      <div className="relative hidden w-2/5 shrink-0 bg-champagne sm:block">
        <Image src={photo(IMG.facial1, 800)} alt="" fill sizes="320px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
      </div>
      <div className="flex-1 overflow-y-auto p-7 pt-14 sm:p-10">
        <Sparkles className="text-gold" size={22} />
        <p className="eyebrow mt-3">Welcome gift</p>
        <h2 className="mt-2 font-display text-4xl leading-[1.05]">{salon.offer.title}</h2>
        <p className="mt-3 text-mocha">{salon.offer.text}</p>
        {done ? (
          <div role="status" className="mt-6">
            <p className="font-display text-2xl">Your offer is saved.</p>
            <p className="mt-1 text-sm text-mocha">It is applied automatically when you book ({salon.offer.code}).</p>
            <div className="mt-5 flex flex-wrap gap-3"><Button onClick={onBook} variant="gold">Book now</Button><Button variant="ghost" onClick={onClose}>Later</Button></div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="gold" onClick={() => { claimOffer(); setDone(true); }}>Claim my offer</Button>
              <button type="button" onClick={onClose} className="min-h-11 px-2 text-xs uppercase tracking-widest text-stone underline-offset-4 hover:underline">No thanks</button>
            </div>
            <p className="mt-4 text-xs text-stone">{salon.offer.terms}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ---------- B. Exit intent ---------- */
function ExitIntent({ onClose, onBook }: { onClose: () => void; onBook: () => void }) {
  return (
    <Modal open onClose={onClose} label="Before you go" size="md">
      <div className="p-8 pt-14 text-center sm:p-12 sm:pt-14">
        <p className="eyebrow">Before you go…</p>
        <h2 className="mt-3 font-display text-4xl leading-[1.05]">Your next beauty moment awaits.</h2>
        <p className="mx-auto mt-3 max-w-sm text-mocha">Choose a service and reserve a time. It takes about a minute, and you can change it later.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={onBook} variant="gold">Book appointment</Button>
          <Button variant="outline" onClick={onClose}>Keep browsing</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------- D. Updates (no server: the visitor messages the salon on WhatsApp) ---------- */
function NewsletterPopup({ onClose, onSubscribed }: { onClose: () => void; onSubscribed: () => void }) {
  const wa = `https://wa.me/${salon.contact.whatsapp}?text=${encodeURIComponent(`Hello ${salon.name}, please add me to your updates and offers list.`)}`;
  return (
    <Modal open onClose={onClose} label="Get salon updates" size="md">
      <div className="p-8 pt-14 sm:p-10 sm:pt-14">
        <p className="eyebrow">Stay in the loop</p>
        <h2 className="mt-3 font-display text-4xl leading-[1.05]">New treatments and genuine offers.</h2>
        <p className="mt-3 text-mocha">Message us once on WhatsApp and we&apos;ll keep you posted. Nothing else, and you can say stop any time.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="gold" href={wa} external onClick={onSubscribed}><MessageCircle size={16} /> Join on WhatsApp</Button>
          <Button variant="ghost" onClick={onClose}>Not now</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------- C. Booking reminder (discreet, non-blocking) ---------- */
function ReminderToast({ onClose, onBook }: { onClose: () => void; onBook: () => void }) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-24 left-4 right-4 z-[90] border border-sand bg-ivory p-5 shadow-2xl sm:bottom-6 sm:left-6 sm:right-auto sm:w-[22rem] lg:bottom-6"
    >
      <button onClick={onClose} aria-label="Dismiss" className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center text-stone hover:text-ink"><X size={18} /></button>
      <p className="font-display text-xl pr-8">Found something you love?</p>
      <p className="mt-1 text-sm text-mocha">Reserve your time in under a minute. Openings fill up.</p>
      <div className="mt-3"><Button onClick={onBook} className="!min-h-11 !px-5">Book now</Button></div>
    </motion.div>
  );
}
