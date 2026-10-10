"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Clock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { useBooking } from "@/components/booking/BookingProvider";
import { SERVICES, SERVICE_CATEGORIES } from "@/data/services";
import { cn, formatDuration, formatPrice } from "@/lib/format";

const PREVIEW = 6;

export default function Services() {
  const { open } = useBooking();
  const [cat, setCat] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const filtered = cat === "all" ? SERVICES : SERVICES.filter((s) => s.category === cat);
  const collapsed = cat === "all" && !showAll && filtered.length > PREVIEW;
  const list = collapsed ? filtered.slice(0, PREVIEW) : filtered;

  return (
    <section id="services" className="bg-champagne/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Reveal><p className="eyebrow">Services & pricing</p></Reveal>
            <Reveal delay={0.1}><h2 className="mt-4 font-display text-4xl font-light leading-[1.05] sm:text-6xl">Treatments, <em className="italic text-gold">thoughtfully made.</em></h2></Reveal>
          </div>
          <Reveal delay={0.15}><p className="max-w-sm text-mocha">Prices are starting prices and may vary with hair length and detail. Your stylist will confirm before they begin.</p></Reveal>
        </div>

        <div className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter services">
          {[{ id: "all", label: "All" }, ...SERVICE_CATEGORIES].map((c) => (
            <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)}
              className={cn("relative min-h-11 shrink-0 px-5 text-[0.72rem] uppercase tracking-[0.2em] transition-colors", cat === c.id ? "text-ivory" : "text-ink hover:text-gold")}>
              {cat === c.id && <motion.span layoutId="svc-pill" className="absolute inset-0 bg-ink" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">{c.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile: compact rows (thumbnail + details). Desktop: image cards. */}
        <motion.ul layout className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 md:mt-10 md:grid-cols-2 md:gap-x-6 md:gap-y-12 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((s) => (
              <motion.li key={s.id} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group flex gap-4 border border-sand/70 bg-ivory/60 p-3 md:flex-col md:gap-0 md:border-0 md:bg-transparent md:p-0">
                <div className="relative aspect-[4/5] w-28 shrink-0 self-start overflow-hidden bg-sand/40 md:w-full">
                  <Image src={s.image} alt={`${s.name} at the salon`} fill sizes="(min-width:1024px) 380px, (min-width:768px) 45vw, 112px" className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-lux)] group-hover:scale-[1.06]" />
                  {s.promo && <span className="absolute left-0 top-3 bg-gold px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.22em] text-ivory md:top-5 md:px-4 md:py-1.5 md:text-[0.62rem] md:tracking-[0.25em]">{s.promo}</span>}
                </div>
                <div className="flex min-w-0 flex-1 flex-col md:pt-5">
                  <div className="md:flex md:items-baseline md:justify-between md:gap-4">
                    <h3 className="font-display text-[1.45rem] leading-tight md:text-[1.7rem]">{s.name}</h3>
                    <p className="mt-0.5 shrink-0 text-sm md:mt-0 md:text-right"><span className="mr-1 text-[0.6rem] uppercase tracking-[0.2em] text-stone md:mr-0 md:block">From</span>{formatPrice(s.price)}</p>
                  </div>
                  <p className="mt-2 line-clamp-2 flex-1 text-[0.92rem] leading-relaxed text-mocha md:line-clamp-none md:text-[0.95rem]">{s.description}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-stone"><Clock size={13} /> {formatDuration(s.durationMin)}</p>
                  <button onClick={() => open({ serviceId: s.id })} className="link-line mt-2 inline-flex min-h-11 items-center gap-2 self-start text-[0.72rem] uppercase tracking-[0.2em] md:mt-3" aria-label={`Book ${s.name}`}>
                    Book this service <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {collapsed && (
          <div className="mt-12 flex justify-center">
            <Button variant="outline" onClick={() => setShowAll(true)}>View all {filtered.length} services</Button>
          </div>
        )}
      </div>
    </section>
  );
}
