"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Minus, Plus, Quote } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { useBooking } from "@/components/booking/BookingProvider";
import { salon } from "@/config/salon";
import { FAQS, HOW_IT_WORKS, OFFERS, TESTIMONIALS } from "@/data/content";
import { cn } from "@/lib/format";

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="how-title">
      <Reveal><p className="eyebrow">How booking works</p></Reveal>
      <Reveal delay={0.1}><h2 id="how-title" className="mt-4 font-display text-4xl font-light sm:text-6xl">Four simple steps.</h2></Reveal>
      <ol className="mt-16 grid gap-10 md:grid-cols-4 md:gap-8">
        {HOW_IT_WORKS.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 0.12} className="relative pl-[4.5rem] md:pl-0 md:pt-[4.5rem]">
            <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-ivory font-display text-2xl text-gold">{i + 1}</span>
            {i < HOW_IT_WORKS.length - 1 && (
              <motion.span aria-hidden initial={{ scaleX: 0, scaleY: 0 }} whileInView={{ scaleX: 1, scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.3 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-6 top-14 h-[calc(100%-1rem)] w-px origin-top bg-sand md:left-14 md:top-6 md:h-px md:w-[calc(100%-2rem)] md:origin-left" />
            )}
            <h3 className="font-display text-2xl">{s.title}</h3>
            <p className="mt-2 text-mocha">{s.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

export function Testimonials() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const go = (d: number) => { setDir(d); setI((x) => (x + d + TESTIMONIALS.length) % TESTIMONIALS.length); };
  const t = TESTIMONIALS[i];
  return (
    <section id="testimonials" className="bg-ink py-20 text-ivory sm:py-28">
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
        <Reveal><p className="eyebrow !text-gold-light">Kind words</p></Reveal>
        <Quote className="mx-auto mt-8 text-gold" size={48} strokeWidth={1} aria-hidden />
        <div className="relative mt-6 min-h-[19rem] sm:min-h-[16rem]" aria-live="polite">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.figure key={t.id} custom={dir} initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }} transition={{ duration: 0.45 }}
              drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}>
              <blockquote className="font-display text-[1.7rem] font-light leading-[1.25] sm:text-5xl sm:leading-[1.15]">“{t.text}”</blockquote>
              <figcaption className="mt-8 flex flex-col items-center gap-1"><span className="font-display text-2xl italic text-gold-light">{t.name}</span><span className="text-[0.68rem] uppercase tracking-[0.25em] text-ivory/60">{t.service}</span></figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex items-center justify-center gap-5">
          <button onClick={() => go(-1)} aria-label="Previous testimonial" className="flex h-12 w-12 items-center justify-center border border-ivory/30 hover:bg-ivory hover:text-ink"><ChevronLeft size={18} /></button>
          <div className="flex gap-2">{TESTIMONIALS.map((x, n) => <button key={x.id} onClick={() => { setDir(n > i ? 1 : -1); setI(n); }} aria-label={`Show testimonial ${n + 1}`} aria-current={n === i} className="flex h-8 w-8 items-center justify-center"><span className={cn("h-1.5 rounded-full transition-all", n === i ? "w-8 bg-gold" : "w-1.5 bg-ivory/40")} /></button>)}</div>
          <button onClick={() => go(1)} aria-label="Next testimonial" className="flex h-12 w-12 items-center justify-center border border-ivory/30 hover:bg-ivory hover:text-ink"><ChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}

export function Offers() {
  const { open, claimOffer } = useBooking();
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="offers-title">
      <Reveal><p className="eyebrow">Special offers</p></Reveal>
      <Reveal delay={0.1}><h2 id="offers-title" className="mt-4 font-display text-4xl font-light sm:text-6xl">Little <em className="italic text-gold">extras.</em></h2></Reveal>
      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {OFFERS.filter((o) => o.id !== "o1" || salon.offer.enabled).map((o, n) => (
          <Reveal as="li" key={o.id} delay={n * 0.1} className="group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden p-7 text-ivory sm:p-10">
            <Image src={o.image} alt="" fill sizes="(min-width:768px) 600px, 92vw" className="-z-20 object-cover transition-transform duration-[1400ms] ease-[var(--ease-lux)] group-hover:scale-105" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10" />
            <p className="eyebrow !text-gold-light">{o.tag}</p>
            <h3 className="mt-2 font-display text-4xl leading-tight">{o.id === "o1" ? `${salon.offer.percent}% off your first appointment` : o.title}</h3>
            <p className="mt-2 max-w-sm text-ivory/80">{o.text}</p>
            <div className="mt-6"><Button variant="light" onClick={() => { if (o.id === "o1") claimOffer(); open(); }}>{o.id === "o1" ? "Book with this offer" : "Book now"}</Button></div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export function Faq() {
  const [openIdx, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-champagne/50 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <Reveal><p className="eyebrow">FAQ</p></Reveal>
          <Reveal delay={0.1}><h2 className="mt-4 font-display text-4xl font-light leading-[1.05] sm:text-5xl">Good to <em className="italic text-gold">know.</em></h2></Reveal>
          <Reveal delay={0.2}><p className="mt-4 max-w-xs text-mocha">{salon.booking.policy}</p></Reveal>
        </div>
        <ul className="divide-y divide-sand border-y border-sand">
          {FAQS.map((f, n) => {
            const isOpen = openIdx === n;
            return (
              <li key={f.q}>
                <h3>
                  <button id={`faq-btn-${n}`} aria-expanded={isOpen} aria-controls={`faq-${n}`} onClick={() => setOpen(isOpen ? null : n)} className="flex min-h-16 w-full items-center justify-between gap-6 py-4 text-left font-display text-2xl">
                    {f.q}{isOpen ? <Minus size={20} className="shrink-0 text-gold" /> : <Plus size={20} className="shrink-0 text-gold" />}
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div id={`faq-${n}`} role="region" aria-labelledby={`faq-btn-${n}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                      <p className="pb-6 pr-10 leading-relaxed text-mocha">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
