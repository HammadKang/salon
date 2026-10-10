"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import Parallax from "@/components/ui/Parallax";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";
import { useBooking } from "@/components/booking/BookingProvider";
import { IMG, photo } from "@/lib/images";

export default function About() {
  const { open } = useBooking();
  return (
    <section id="about" className="relative overflow-hidden bg-ink py-20 text-ivory sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          <ImageReveal className="relative ml-auto aspect-[4/5] w-[82%]">
            <Parallax amount={30} className="absolute -inset-[6%]"><Image src={photo(IMG.interior, 1400)} alt="The salon floor: black chairs facing round mirrors" fill sizes="(min-width:1024px) 480px, 80vw" className="object-cover object-[30%_center]" /></Parallax>
          </ImageReveal>
          <ImageReveal delay={0.25} className="absolute -bottom-8 left-0 aspect-[4/3] w-[52%] border-[6px] border-ink shadow-2xl">
            <Image src={photo(IMG.reception, 700)} alt="The salon reception desk" fill sizes="300px" className="object-cover" />
          </ImageReveal>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal><p className="eyebrow !text-gold-light">Our story</p></Reveal>
          <Reveal delay={0.1}><h2 className="mt-4 font-display text-4xl font-light leading-[1.05] sm:text-6xl">A salon built on <em className="italic text-gold-light">listening.</em></h2></Reveal>
          <Reveal delay={0.2}>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ivory/80">
              <p>We believe the best beauty work begins with a conversation. Our stylists take the time to understand your hair, your skin and the way you live, then craft something that feels like you, only more so.</p>
              <p>Calm rooms, quality products and unhurried appointments are how we work, so every visit feels like time that is entirely yours.</p>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <ul className="mt-8 grid grid-cols-3 gap-4 border-t border-ivory/15 pt-6 text-sm">
              {["Personal consultation", "Premium products", "Unhurried care"].map((t) => <li key={t} className="font-display text-xl leading-tight">{t}</li>)}
            </ul>
          </Reveal>
          <Reveal delay={0.4} className="mt-9"><Button onClick={() => open()} variant="gold" magnetic>Book your visit</Button></Reveal>
        </div>
      </div>
    </section>
  );
}
