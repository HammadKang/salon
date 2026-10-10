"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fade + rise on scroll. Content is visible without JS thanks to SSR initial state being overridden only by motion. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "span";
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </M>
  );
}

/** Clip-path image reveal with a gentle scale settle. */
export function ImageReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: "inset(12% 12% 12% 12%)", opacity: 0, scale: 1.04 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.2, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const word: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease } },
};

/** Words slide up out of a mask, one after another. Pass `inView` for scroll-triggered use, otherwise plays on load. */
export function SplitText({
  text,
  className,
  inView = false,
  delay = 0,
}: {
  text: string;
  className?: string;
  inView?: boolean;
  delay?: number;
}) {
  const props = inView
    ? { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } }
    : { animate: "show" };
  return (
    <motion.span
      className={cn("inline", className)}
      variants={container}
      initial="hidden"
      transition={{ delayChildren: delay }}
      {...props}
      aria-label={text}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom" aria-hidden>
          <motion.span className="inline-block" variants={word} transition={{ delay: delay + i * 0.07 }}>
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export const stagger = { container, item: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } } as Variants };
