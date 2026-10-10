"use client";

import Counter from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { salon } from "@/config/salon";
import { SERVICES, SERVICE_CATEGORIES } from "@/data/services";
import { STYLISTS } from "@/data/stylists";

const WORDS = ["Hair", "Colour", "Bridal", "Skin", "Nails", "Waxing", "Spa"];

export function MarqueeBand() {
  const items = [...WORDS, ...WORDS, ...WORDS, ...WORDS];
  return (
    <div className="marquee overflow-hidden border-y border-sand/60 bg-ivory py-5" aria-hidden>
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap font-display text-3xl italic text-mocha/80 sm:text-4xl">
        {items.map((w, i) => <span key={i} className="flex items-center gap-12">{w}<span className="text-gold">✦</span></span>)}
      </div>
    </div>
  );
}

export default function Intro() {
  // Every figure is computed from the real data files, never invented.
  const stats = [
    { n: SERVICES.length, label: "Services", note: "From a precision cut to a bridal morning." },
    { n: SERVICE_CATEGORIES.length, label: "Disciplines", note: "Hair, colour, skin, nails, spa and more." },
    { n: STYLISTS.length, label: "Specialists", note: "Each with a craft they are known for." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28" aria-label="Welcome">
      <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
        <div>
          <Reveal><p className="eyebrow">Welcome</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-4xl font-light leading-[1.08] sm:text-5xl lg:text-6xl">
              Considered beauty, <em className="italic text-gold">tailored to you.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}><p className="mt-6 max-w-xl text-lg leading-relaxed text-mocha">{salon.description}</p></Reveal>
          <Reveal delay={0.3}><a href="#services" className="link-line mt-8 inline-flex min-h-11 items-center text-[0.72rem] uppercase tracking-[0.22em]">Explore the treatments</a></Reveal>
        </div>
        <dl className="self-end">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="grid grid-cols-[5.5rem_1fr] items-center gap-5 border-t border-sand/80 py-6 first:border-t-0 first:pt-0 sm:grid-cols-[7rem_1fr]">
              <dd className="font-display text-6xl font-light leading-none text-ink sm:text-7xl"><Counter to={s.n} /></dd>
              <dt><span className="block font-display text-2xl">{s.label}</span><span className="text-sm text-mocha">{s.note}</span></dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
