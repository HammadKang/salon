"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsApp } from "@/components/ui/Icons";
import { useBooking } from "@/components/booking/BookingProvider";
import { DAY_NAMES, salon } from "@/config/salon";
import { to12h } from "@/lib/format";

const ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function Contact() {
  const { open } = useBooking();
  const a = salon.address;
  const full = [a.line1, a.area, `${a.city} ${a.postcode}`.trim(), a.country].filter(Boolean).join(", ");
  const today = new Date().getDay();
  const tel = "tel:" + salon.contact.phone.replace(/[^\d+]/g, "");

  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal><p className="eyebrow">Visit us</p></Reveal>
      <Reveal delay={0.1}><h2 className="mt-4 font-display text-4xl font-light leading-[1.05] sm:text-6xl">Come and <em className="italic text-gold">unwind.</em></h2></Reveal>
      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <ul className="space-y-5">
            <li className="flex gap-4"><MapPin className="mt-1 shrink-0 text-gold" size={22} strokeWidth={1.5} /><div><p className="eyebrow !text-stone">Address</p><p className="mt-1 text-lg">{full}</p></div></li>
            <li className="flex gap-4"><Phone className="mt-1 shrink-0 text-gold" size={22} strokeWidth={1.5} /><div><p className="eyebrow !text-stone">Call us</p><a href={tel} className="mt-1 inline-block min-h-8 text-lg underline-offset-4 hover:underline">{salon.contact.phone}</a></div></li>
            <li className="flex gap-4"><WhatsApp className="mt-1 shrink-0 text-gold" /><div><p className="eyebrow !text-stone">WhatsApp</p><a href={`https://wa.me/${salon.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block min-h-8 text-lg underline-offset-4 hover:underline">Message us</a></div></li>
            <li className="flex gap-4"><Mail className="mt-1 shrink-0 text-gold" size={22} strokeWidth={1.5} /><div><p className="eyebrow !text-stone">Email</p><a href={`mailto:${salon.contact.email}`} className="mt-1 inline-block min-h-8 break-all text-lg underline-offset-4 hover:underline">{salon.contact.email}</a></div></li>
          </ul>
          <div className="mt-10">
            <p className="eyebrow">Opening hours</p>
            <table className="mt-3 w-full max-w-sm text-left">
              <caption className="sr-only">Opening hours</caption>
              <tbody>
                {ORDER.map((d) => {
                  const h = salon.hours[d];
                  return (
                    <tr key={d} className={`border-b border-sand/60 ${d === today ? "font-medium text-ink" : "text-mocha"}`}>
                      <th scope="row" className="py-2.5 pr-4 font-normal">{DAY_NAMES[d]}{d === today && <span className="ml-2 text-[0.6rem] uppercase tracking-widest text-gold">Today</span>}</th>
                      <td className="py-2.5 text-right">{h ? `${to12h(h.open)} – ${to12h(h.close)}` : "Closed"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-8"><Button onClick={() => open()} variant="gold">Book Appointment</Button></div>
        </div>

        <div className="min-h-[22rem] lg:min-h-full">
          {salon.showMap ? (
            <iframe title={`Map showing ${salon.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full min-h-[22rem] w-full border-0 grayscale-[30%]" src={`https://www.google.com/maps?q=${encodeURIComponent(full)}&output=embed`} />
          ) : (
            <div className="flex h-full min-h-[22rem] flex-col items-center justify-center border border-dashed border-sand bg-champagne/40 p-8 text-center">
              <MapPin className="text-gold" size={32} strokeWidth={1.3} />
              <p className="mt-4 font-display text-3xl">Find us</p>
              <p className="mt-2 max-w-xs text-sm text-mocha">{full}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
