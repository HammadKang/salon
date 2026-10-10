"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/format";
import { salon } from "@/config/salon";
import { isoDate } from "@/lib/booking/engine";

const WEEK = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** Month calendar. `counts` = number of free slots per ISO date (undefined while loading). */
export default function Calendar({
  selected,
  onSelect,
  counts,
  today,
  maxDate,
}: {
  selected?: string;
  onSelect: (iso: string) => void;
  counts?: Record<string, number>;
  today: string;
  maxDate: string;
}) {
  const start = new Date(today + "T12:00:00");
  const [view, setView] = useState(new Date(start.getFullYear(), start.getMonth(), 1));

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const lead = (first.getDay() + 6) % 7; // Monday first
    const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    return [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => isoDate(new Date(view.getFullYear(), view.getMonth(), i + 1)))] as (string | null)[];
  }, [view]);

  const monthLabel = view.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const canPrev = view > new Date(start.getFullYear(), start.getMonth(), 1);
  const canNext = view < new Date(new Date(maxDate + "T12:00:00").getFullYear(), new Date(maxDate + "T12:00:00").getMonth(), 1);

  return (
    <div role="group" aria-label="Choose a date">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" aria-label="Previous month" disabled={!canPrev} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-champagne disabled:opacity-30">
          <ChevronLeft size={18} />
        </button>
        <p className="font-display text-xl" aria-live="polite">{monthLabel}</p>
        <button type="button" aria-label="Next month" disabled={!canNext} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-champagne disabled:opacity-30">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] uppercase tracking-widest text-stone">
        {WEEK.map((d) => <div key={d} className="py-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((iso, i) => {
          if (!iso) return <div key={"e" + i} />;
          const weekday = new Date(iso + "T12:00:00").getDay();
          const closed = !salon.hours[weekday];
          const out = iso < today || iso > maxDate;
          const loading = counts === undefined;
          const free = counts?.[iso] ?? 0;
          const disabled = out || closed || loading || free === 0;
          const isSel = selected === iso;
          const label = new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(iso)}
              aria-pressed={isSel}
              aria-label={`${label}${closed ? ", closed" : disabled && !out && !loading ? ", fully booked" : ""}`}
              className={cn(
                "relative flex aspect-square min-h-11 items-center justify-center rounded-full text-sm transition",
                isSel ? "bg-ink text-ivory" : "hover:bg-champagne",
                disabled && "cursor-not-allowed text-stone/40 hover:bg-transparent",
                loading && !out && "skeleton text-transparent",
                iso === today && !isSel && "ring-1 ring-gold"
              )}
            >
              {Number(iso.slice(8))}
              {!disabled && !isSel && free > 0 && free <= 3 && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-gold" aria-hidden />}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-stone">A gold dot means only a few openings remain that day.</p>
    </div>
  );
}
