"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/format";

type Props = {
  children: React.ReactNode;
  variant?: "solid" | "gold" | "outline" | "light" | "ghost";
  size?: "md" | "lg";
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  magnetic?: boolean;
  external?: boolean;
  "aria-label"?: string;
};

const variants = {
  solid: "bg-ink text-ivory hover:bg-mocha",
  gold: "bg-gold text-ivory hover:bg-[#8f6f3f]",
  outline: "border border-ink/40 text-ink hover:bg-ink hover:text-ivory",
  light: "border border-ivory/60 text-ivory hover:bg-ivory hover:text-ink",
  ghost: "text-ink hover:bg-champagne",
};

/** Pill-free, squared luxury button. `magnetic` adds a subtle pull toward the cursor (fine pointers only). */
export default function Button({ children, variant = "solid", size = "md", className, href, onClick, type = "button", disabled, magnetic, external, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  const move = (e: React.PointerEvent) => {
    if (!magnetic || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => { x.set(0); y.set(0); };

  const cls = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden text-[0.78rem] font-medium uppercase tracking-[0.18em] transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-50",
    size === "lg" ? "min-h-14 px-9" : "min-h-12 px-7",
    variants[variant],
    className
  );

  const hrefCls = cn(cls, "flex-1");
  const inner = <span className="relative z-10 flex items-center gap-2">{children}</span>;
  const motionProps = { style: { x: sx, y: sy }, onPointerMove: move, onPointerLeave: reset };

  if (href) {
    const isExternal = external || /^(https?:|tel:|mailto:)/.test(href);
    return (
      <motion.span {...motionProps} className="inline-flex">
        {isExternal ? (
          <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} onClick={onClick} className={hrefCls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} aria-label={rest["aria-label"]}>{inner}</a>
        ) : (
          <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={hrefCls} aria-label={rest["aria-label"]}>{inner}</Link>
        )}
      </motion.span>
    );
  }

  return (
    <motion.button ref={ref as React.Ref<HTMLButtonElement>} type={type} onClick={onClick} disabled={disabled} className={cls} aria-label={rest["aria-label"]} {...motionProps}>
      {inner}
    </motion.button>
  );
}
