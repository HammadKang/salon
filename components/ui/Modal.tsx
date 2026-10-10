"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/format";

const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input:not([type="hidden"]),select,[tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal: focus trap, Escape to close, scroll lock, focus restore, aria-modal.
 * Mobile: bottom sheet that never exceeds the viewport. Desktop: centred panel.
 */
export default function Modal({
  open,
  onClose,
  label,
  children,
  size = "md",
  closeOnBackdrop = true,
  hideClose = false,
  fullscreen = false,
  className,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnBackdrop?: boolean;
  hideClose?: boolean;
  fullscreen?: boolean;
  className?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = setTimeout(() => {
      const el = panel.current;
      if (!el) return;
      (el.querySelector<HTMLElement>("[data-autofocus]") ?? el.querySelector<HTMLElement>(FOCUSABLE) ?? el).focus({ preventScroll: true });
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      } else if (e.key === "Tab" && panel.current) {
        const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const widths = { sm: "sm:max-w-md", md: "sm:max-w-xl", lg: "sm:max-w-3xl", xl: "sm:max-w-5xl", full: "sm:max-w-6xl" };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={cn("fixed inset-0 z-[100] flex justify-center", fullscreen ? "items-stretch" : "items-end sm:items-center sm:p-6")} role="presentation">
          <motion.div
            className="absolute inset-0 bg-ink/60 backdrop-blur-[3px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            aria-labelledby={undefined}
            tabIndex={-1}
            data-title={titleId}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative flex max-h-[100dvh] w-full flex-col overflow-hidden bg-ivory shadow-2xl outline-none",
              fullscreen ? "h-[100dvh] max-w-none !bg-ink text-ivory" : "rounded-t-3xl sm:max-h-[92dvh] sm:rounded-sm",
              !fullscreen && widths[size],
              className
            )}
          >
            {!hideClose && (
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className={cn("absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full transition", fullscreen ? "text-ivory hover:bg-ivory/10" : "bg-ivory/90 text-ink hover:bg-champagne")}
              >
                <X size={20} />
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
