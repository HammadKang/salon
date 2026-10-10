"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import { SplitText } from "@/components/ui/Reveal";
import { useBooking } from "@/components/booking/BookingProvider";
import { IMG, photo } from "@/lib/images";

export default function Hero() {
  const { open } = useBooking();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.05, 1.18]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-ivory">
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-20 will-change-transform">
        <motion.div initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }} className="h-full w-full">
          <Image src={photo(IMG.curls, 2200)} alt="A stylist shaping soft waves in a bright, elegant salon" fill priority sizes="100vw" className="object-cover object-[62%_center]" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent" />

      <motion.div style={{ opacity: fade }} className="mx-auto w-full max-w-7xl px-5 pb-24 pt-40 sm:px-8 sm:pb-28">
        <div>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }} className="eyebrow !text-gold-light whitespace-nowrap !text-[0.62rem] !tracking-[0.2em] sm:!text-[0.72rem] sm:!tracking-[0.28em]">
            Hair · Colour · Bridal · Skin · Nails · Spa
          </motion.p>
          <h1 className="mt-5 max-w-6xl font-display text-[clamp(2.9rem,7.4vw,6.4rem)] font-light leading-[1.02] tracking-tight">
            <span className="block"><SplitText text="Where beauty becomes" delay={0.6} /></span>
            <em className="block font-light italic text-gold-light"><SplitText text="an art form." delay={1.05} /></em>
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1, ease: [0.22, 1, 0.36, 1] }} className="mt-7 max-w-lg text-base leading-relaxed text-ivory/85 sm:text-lg">
            A calm, considered space where skilled hands and honest advice leave you feeling beautifully, effortlessly yourself.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.75, duration: 1, ease: [0.22, 1, 0.36, 1] }} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => open()} variant="gold" size="lg" magnetic>Book Your Appointment</Button>
            <Button href="#services" variant="light" size="lg">Explore Our Services</Button>
          </motion.div>
        </div>

      </motion.div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.4em] text-ivory/70 md:flex" aria-hidden>
        Scroll
        <span className="relative block h-12 w-px overflow-hidden bg-ivory/30"><span className="scroll-cue absolute inset-0 bg-ivory" /></span>
      </div>
    </section>
  );
}
