"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { useBooking } from "@/components/booking/BookingProvider";
import { STYLISTS, type Stylist } from "@/data/stylists";
import { cn } from "@/lib/format";

/** Portraits share one warm, slightly muted tone so mixed photos feel like one shoot. Colour returns on hover. */
const TONE = "saturate-[0.72] sepia-[0.18] contrast-[1.03] transition-[filter,transform] duration-[1400ms] ease-[var(--ease-lux)] group-hover:saturate-100 group-hover:sepia-0 group-hover:scale-[1.04]";

function Card({ s, big = false }: { s: Stylist; big?: boolean }) {
  const { open } = useBooking();
  return (
    <div className="group flex h-full flex-col">
      <div className={cn("relative w-full overflow-hidden bg-sand/40", big ? "aspect-[4/5] lg:min-h-[34rem] lg:flex-1" : "aspect-[4/5]")}>
        <Image src={s.image} alt={`Portrait of ${s.name}, ${s.role}`} fill sizes={big ? "(min-width:1024px) 480px, 92vw" : "(min-width:1024px) 280px, 46vw"} className={cn("object-cover", TONE)} />
        <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/85 to-transparent p-4 pt-16 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 max-md:hidden">
          <p className="text-sm leading-relaxed text-ivory/95">{s.bio}</p>
        </div>
      </div>
      <div className="pt-4">
        <h3 className={cn("font-display leading-tight", big ? "text-4xl" : "text-2xl sm:text-3xl")}>{s.name}</h3>
        <p className="text-[0.66rem] uppercase tracking-[0.22em] text-gold">{s.role}</p>
        <p className="mt-1.5 text-sm text-mocha">{s.specialties.join(" · ")}</p>
        {big && <p className="mt-3 max-w-md text-mocha">{s.bio}</p>}
        <button onClick={() => open({ stylistId: s.id })} className="link-line mt-2 inline-flex min-h-11 items-center text-[0.7rem] uppercase tracking-[0.2em]">Book with {s.name.split(" ")[0]}</button>
      </div>
    </div>
  );
}

export default function Team() {
  const [lead, ...rest] = STYLISTS;
  return (
    <section id="team" className="bg-champagne/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal><p className="eyebrow">Meet the team</p></Reveal>
        <Reveal delay={0.1}><h2 className="mt-4 max-w-2xl font-display text-4xl font-light leading-[1.05] sm:text-6xl">The hands behind <em className="italic text-gold">the work.</em></h2></Reveal>
        <div className="mt-14 grid gap-x-8 gap-y-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5"><Card s={lead} big /></Reveal>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:col-span-7">
            {rest.map((s, i) => <Reveal as="li" key={s.id} delay={i * 0.08}><Card s={s} /></Reveal>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
