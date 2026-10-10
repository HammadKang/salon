"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Reveal } from "@/components/ui/Reveal";
import { GALLERY, GALLERY_FILTERS, type GalleryItem } from "@/data/content";
import { cn } from "@/lib/format";

const RATIO = { tall: "aspect-[3/4]", wide: "aspect-[4/3]", square: "aspect-square" };

export default function Gallery() {
  const [filter, setFilter] = useState<(typeof GALLERY_FILTERS)[number]>("All");
  const [index, setIndex] = useState<number | null>(null);
  const items = filter === "All" ? GALLERY : GALLERY.filter((g) => g.category === filter);

  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const current: GalleryItem | undefined = index === null ? undefined : items[index];

  return (
    <section id="gallery" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <Reveal><p className="eyebrow">Our work</p></Reveal>
          <Reveal delay={0.1}><h2 className="mt-4 font-display text-4xl font-light leading-[1.05] sm:text-6xl">A portfolio of <em className="italic text-gold">transformations.</em></h2></Reveal>
        </div>
        <div className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter gallery">
          {GALLERY_FILTERS.map((f) => (
            <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={cn("min-h-11 shrink-0 border-b px-3 text-[0.72rem] uppercase tracking-[0.2em] transition", filter === f ? "border-ink text-ink" : "border-transparent text-stone hover:text-ink")}>{f}</button>
          ))}
        </div>
      </div>

      <motion.ul layout className="mt-12 columns-2 gap-3 sm:gap-5 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {items.map((g, i) => (
            <motion.li key={g.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mb-3 break-inside-avoid sm:mb-5">
              <button onClick={() => setIndex(i)} className="group relative block w-full overflow-hidden bg-sand/40" aria-label={`Open image: ${g.caption}`}>
                <div className={cn("relative w-full", RATIO[g.ratio])}>
                  <Image src={g.src} alt={g.alt} fill sizes="(min-width:1024px) 380px, 46vw" className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-lux)] group-hover:scale-[1.07]" />
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:opacity-100">
                  <div className="text-left text-ivory"><p className="text-[0.6rem] uppercase tracking-[0.25em] text-gold-light">{g.category}</p><p className="font-display text-xl leading-tight">{g.caption}</p></div>
                </div>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Modal open={index !== null} onClose={() => setIndex(null)} label="Image viewer" fullscreen>
        {current && (
          <div className="relative flex h-full flex-col">
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={current.id} className="absolute inset-0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}
                  drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25} onDragEnd={(_, info) => { if (info.offset.x < -70) step(1); else if (info.offset.x > 70) step(-1); }}>
                  <Image src={current.src.replace("w=900", "w=1600")} alt={current.alt} fill sizes="100vw" className="pointer-events-none object-contain" priority />
                </motion.div>
              </AnimatePresence>
              <button onClick={() => step(-1)} aria-label="Previous image" className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-ivory hover:bg-ink sm:left-6"><ChevronLeft /></button>
              <button onClick={() => step(1)} aria-label="Next image" className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-ivory hover:bg-ink sm:right-6"><ChevronRight /></button>
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8" aria-live="polite">
              <div><p className="text-[0.6rem] uppercase tracking-[0.25em] text-gold-light">{current.category}</p><p className="font-display text-2xl">{current.caption}</p></div>
              <p className="text-sm text-ivory/60">{(index ?? 0) + 1} / {items.length}</p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
