"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import Parallax from "@/components/ui/Parallax";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";
import { useBooking } from "@/components/booking/BookingProvider";
import { SERVICES } from "@/data/services";
import { cn, formatDuration, formatPrice } from "@/lib/format";

/** Large editorial rows for hero treatments: deliberately not another card grid. */
export default function Signature() {
  const { open } = useBooking();
  const items = SERVICES.filter((s) => s.signature).slice(0, 3);
  return (
    <section aria-labelledby="sig-title" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal><p className="eyebrow">Signature treatments</p></Reveal>
      <Reveal delay={0.1}><h2 id="sig-title" className="mt-4 max-w-2xl font-display text-4xl font-light leading-[1.05] sm:text-6xl">The ones <em className="italic text-gold">clients return for.</em></h2></Reveal>
      <div className="mt-16 space-y-20 sm:space-y-28">
        {items.map((s, i) => (
          <article key={s.id} className={cn("grid items-center gap-8 lg:grid-cols-12 lg:gap-16")}>
            <ImageReveal className={cn("relative aspect-[4/5] lg:col-span-6", i % 2 ? "lg:order-2" : "")}>
              <Parallax amount={40} className="absolute -inset-[8%]">
                <Image src={s.feature ?? s.image} alt={s.name} fill sizes="(min-width:1024px) 600px, 92vw" className="object-cover" />
              </Parallax>
            </ImageReveal>
            <div className={cn("lg:col-span-5", i % 2 ? "lg:col-start-1 lg:order-1" : "lg:col-start-8")}>
              <Reveal><p className="font-display text-7xl font-light text-sand sm:text-8xl">0{i + 1}</p></Reveal>
              <Reveal delay={0.1}><h3 className="font-display text-4xl leading-tight sm:text-5xl">{s.name}</h3></Reveal>
              <Reveal delay={0.2}><p className="mt-4 text-lg leading-relaxed text-mocha">{s.description}</p></Reveal>
              <Reveal delay={0.3}><p className="mt-5 text-sm uppercase tracking-[0.2em] text-stone">{formatDuration(s.durationMin)} · From {formatPrice(s.price)}</p></Reveal>
              <Reveal delay={0.4} className="mt-8"><Button onClick={() => open({ serviceId: s.id })} variant="outline">Book this treatment</Button></Reveal>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
