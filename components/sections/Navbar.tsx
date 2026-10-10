"use client";

import { AnimatePresence, motion } from "motion/react";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useBooking } from "@/components/booking/BookingProvider";
import { salon } from "@/config/salon";
import { cn } from "@/lib/format";

const LINKS = [
  { href: "#top", label: "Home", id: "top" },
  { href: "#about", label: "About", id: "about" },
  { href: "#services", label: "Services", id: "services" },
  { href: "#gallery", label: "Our Work", id: "gallery" },
  { href: "#team", label: "Our Team", id: "team" },
  { href: "#testimonials", label: "Testimonials", id: "testimonials" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <a href="/" aria-label={`${salon.name} ${salon.tagline}, home`} className={cn("group inline-flex flex-col leading-none", light ? "text-ivory" : "text-ink", className)}>
      <span className="font-display text-[1.9rem] font-medium tracking-[0.14em] uppercase">{salon.name}</span>
      <span className="mt-1 text-[0.58rem] uppercase tracking-[0.5em] opacity-70">{salon.tagline}</span>
    </a>
  );
}

export default function Navbar({ solid = false }: { solid?: boolean }) {
  const { open } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (solid) return;
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [solid]);

  const dark = solid || scrolled;

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={cn("fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-500", dark ? "bg-ivory/92 py-2.5 shadow-[0_1px_0_rgba(168,132,77,0.25)] backdrop-blur-md" : "py-5")}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Logo light={!dark} />
          <nav aria-label="Primary" className="hidden items-center gap-7 xl:flex">
            {LINKS.map((l) => (
              <a key={l.id} href={solid ? "/" + l.href : l.href} aria-current={active === l.id && !solid} className={cn("link-line text-[0.72rem] uppercase tracking-[0.2em]", dark ? "text-ink" : "text-ivory")}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block"><Button onClick={() => open()} variant={dark ? "solid" : "light"} magnetic className="!min-h-11">Book Appointment</Button></div>
            <button onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu} className={cn("flex h-12 w-12 items-center justify-center xl:hidden", dark ? "text-ink" : "text-ivory")}>
              <Menu size={26} />
            </button>
          </div>
        </div>
      </motion.header>

      <Modal open={menu} onClose={() => setMenu(false)} label="Menu" fullscreen>
        <div className="flex h-full flex-col px-7 pb-8 pt-6">
          <Logo light />
          <nav aria-label="Mobile" className="mt-10 flex flex-1 flex-col justify-center gap-1">
            <AnimatePresence>
              {LINKS.map((l, i) => (
                <motion.a key={l.id} href={solid ? "/" + l.href : l.href} onClick={() => setMenu(false)}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-12 items-center border-b border-ivory/10 font-display text-[2rem] leading-none transition hover:pl-2 hover:text-gold-light">
                  {l.label}
                </motion.a>
              ))}
            </AnimatePresence>
          </nav>
          <Button variant="gold" size="lg" onClick={() => { setMenu(false); setTimeout(open, 200); }} className="w-full">Book Appointment</Button>
        </div>
      </Modal>
    </>
  );
}
