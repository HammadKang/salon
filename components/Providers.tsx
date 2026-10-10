"use client";

import { MotionConfig } from "motion/react";
import BookingProvider from "@/components/booking/BookingProvider";
import PopupManager from "@/components/popups/PopupManager";
import { MobileBar } from "@/components/sections/Closing";

/** Respects the visitor's "reduce motion" setting for every animation on the site. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <BookingProvider>
        {children}
        <MobileBar />
        <PopupManager />
      </BookingProvider>
    </MotionConfig>
  );
}
