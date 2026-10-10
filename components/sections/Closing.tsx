"use client";

import { MessageCircle, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { Facebook, Instagram, TikTok } from "@/components/ui/Icons";
import { Logo } from "./Navbar";
import { useBooking } from "@/components/booking/BookingProvider";
import { DAY_NAMES, salon } from "@/config/salon";
import { IMG, photo } from "@/lib/images";
import { to12h } from "@/lib/format";

export function FinalCta() {
  const { open } = useBooking();
  return (
    <section className="relative isolate overflow-hidden py-28 text-center text-ivory sm:py-40">
      <Image src={photo(IMG.colorApply, 1800)} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-ink/70" />
      <div className="mx-auto max-w-3xl px-5">
        <Reveal><p className="eyebrow !text-gold-light">Your appointment</p></Reveal>
        <h2 className="mt-4 font-display text-5xl font-light leading-[1.02] sm:text-7xl"><SplitText text="Ready for your" inView /><br /><em className="italic text-gold-light"><SplitText text="best self?" inView delay={0.3} /></em></h2>
        <Reveal delay={0.4}><p className="mx-auto mt-6 max-w-md text-lg text-ivory/80">Choose a time that suits you. It takes about a minute.</p></Reveal>
        <Reveal delay={0.5} className="mt-10"><Button onClick={() => open()} variant="gold" size="lg" magnetic>Book Your Appointment</Button></Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const s = salon.social;
  const links = [["Instagram", s.instagram, Instagram], ["Facebook", s.facebook, Facebook], ["TikTok", s.tiktok, TikTok]] as const;
  return (
    <footer className="bg-ink pb-[3.5rem] text-ivory lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/70">{salon.description}</p>
          <div className="mt-5 flex gap-2">
            {links.filter(([, url]) => url).map(([name, url, Icon]) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${salon.name} on ${name}`} className="flex h-11 w-11 items-center justify-center border border-ivory/25 transition hover:bg-ivory hover:text-ink"><Icon /></a>
            ))}
          </div>
        </div>
        <nav aria-label="Footer"><p className="eyebrow !text-gold-light">Explore</p>
          <ul className="mt-4 space-y-1 text-sm text-ivory/80">
            {[["About", "#about"], ["Services", "#services"], ["Our Work", "#gallery"], ["Our Team", "#team"], ["FAQ", "#faq"], ["Contact", "#contact"], ["Privacy policy", "/privacy"]].map(([l, h]) => <li key={l}><a href={h.startsWith("#") ? "/" + h : h} className="inline-flex min-h-9 items-center transition hover:text-gold-light">{l}</a></li>)}
          </ul>
        </nav>
        <div><p className="eyebrow !text-gold-light">Hours</p>
          <ul className="mt-4 space-y-1.5 text-sm text-ivory/80">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => { const h = salon.hours[d]; return <li key={d} className="flex justify-between gap-4"><span>{DAY_NAMES[d].slice(0, 3)}</span><span>{h ? `${to12h(h.open)} – ${to12h(h.close)}` : "Closed"}</span></li>; })}
          </ul>
        </div>
        <div><p className="eyebrow !text-gold-light">Stay in the loop</p>
          <p className="mt-4 text-sm text-ivory/70">Beauty notes and genuine offers, by WhatsApp. Message us once to join.</p>
          <div className="mt-4"><Button variant="light" href={`https://wa.me/${salon.contact.whatsapp}?text=${encodeURIComponent(`Hello ${salon.name}, please add me to your updates and offers list.`)}`} external><MessageCircle size={16} /> Join on WhatsApp</Button></div>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-6 text-center text-xs text-ivory/50">© {new Date().getFullYear()} {salon.name} {salon.tagline}. All rights reserved.</div>
    </footer>
  );
}

/** Mobile-only sticky action bar: call, WhatsApp, book. */
export function MobileBar() {
  const { open, isOpen } = useBooking();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 520);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const tel = "tel:" + salon.contact.phone.replace(/[^\d+]/g, "");
  return (
    <AnimatePresence>
      {show && !isOpen && (
        <motion.div initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[auto_auto_1fr] gap-px border-t border-sand bg-sand pb-[env(safe-area-inset-bottom)] lg:hidden">
          <a href={tel} aria-label="Call the salon" className="flex h-14 w-14 items-center justify-center bg-ivory"><Phone size={20} /></a>
          <a href={`https://wa.me/${salon.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Message on WhatsApp" className="flex h-14 w-14 items-center justify-center bg-ivory"><MessageCircle size={20} /></a>
          <button onClick={() => open()} className="h-14 bg-ink text-[0.78rem] font-medium uppercase tracking-[0.2em] text-ivory">Book Appointment</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
