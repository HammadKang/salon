"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CalendarPlus, Clock, Copy, MessageCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Calendar from "./Calendar";
import { salon } from "@/config/salon";
import { SERVICES, SERVICE_CATEGORIES, getService } from "@/data/services";
import { STYLISTS, getStylist } from "@/data/stylists";
import { addDays, computeSlots, discountFor, salonNow, stylistsForService, type StoredBooking } from "@/lib/booking/engine";
import { loadBookings, removeBooking, saveBooking } from "@/lib/booking/local";
import { validateDetails, type FieldErrors } from "@/lib/booking/validate";
import { IMG, photo } from "@/lib/images";
import { cn, formatDuration, formatLongDate, formatPrice, to12h } from "@/lib/format";
import { useBooking } from "./BookingProvider";

const STEPS = ["Service", "Stylist", "Date & time", "Your details", "Review"];

export default function BookingDialog() {
  const { isOpen, close, draft, setDraft, result, setResult, reset, offerClaimed } = useBooking();
  const service = draft.serviceId ? getService(draft.serviceId) : undefined;
  const stylist = draft.stylistId !== "any" ? getStylist(draft.stylistId) : undefined;
  const promo = offerClaimed ? salon.offer.code : undefined;
  const discount = discountFor(promo);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Scroll the step content back to the top whenever the step changes
  useEffect(() => { bodyRef.current?.scrollTo({ top: 0 }); }, [draft.step, result]);

  const canContinue =
    (draft.step === 0 && !!draft.serviceId) ||
    draft.step === 1 ||
    (draft.step === 2 && !!draft.date && !!draft.time);

  const go = (step: number) => setDraft({ step });

  return (
    <Modal open={isOpen} onClose={close} label="Book an appointment" size="xl" className="sm:h-[min(48rem,92dvh)] sm:flex-row">
      {result ? (
        <Confirmation booking={result} onDone={() => { close(); reset(); }} />
      ) : (
        <>
          {/* Summary rail (desktop) */}
          <aside className="relative hidden w-[19rem] shrink-0 flex-col justify-between overflow-hidden bg-ink p-8 text-ivory lg:flex">
            <Image src={service?.image ?? photo(IMG.reception, 700)} alt="" fill sizes="304px" className={cn("object-cover transition-opacity duration-700", service ? "opacity-30" : "opacity-40")} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
            <div className="relative">
              <p className="eyebrow !text-gold-light">Your appointment</p>
              <h2 className="mt-3 font-display text-3xl leading-tight">{service?.name ?? "Reserve your time"}</h2>
              {!service && <p className="mt-3 text-sm leading-relaxed text-ivory/75">Choose a treatment, then a stylist and a time. It takes about a minute.</p>}
            </div>
            <dl className="relative space-y-4 text-sm">
              <Row label="Duration" value={service ? formatDuration(service.durationMin) : "-"} />
              <Row label="Stylist" value={draft.serviceId ? (stylist?.name ?? "Any available") : "-"} />
              <Row label="When" value={draft.date && draft.time ? `${formatLongDate(draft.date)}, ${to12h(draft.time)}` : "-"} />
              <div className="hairline opacity-40" />
              {service && (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-ivory/60">{discount ? "Total (offer applied)" : "From"}</dt>
                  <dd className="mt-1 font-display text-3xl">
                    {formatPrice(Math.round(service.price * (1 - discount / 100)))}
                    {discount > 0 && <span className="ml-2 text-base text-ivory/50 line-through">{formatPrice(service.price)}</span>}
                  </dd>
                </div>
              )}
            </dl>
          </aside>

          <div className="flex min-h-0 flex-1 flex-col">
            {/* Progress */}
            <header className="shrink-0 border-b border-sand/50 px-5 pb-4 pt-5 pr-[4.5rem] sm:px-8 sm:pr-20">
              <p className="eyebrow">Step {draft.step + 1} of {STEPS.length}</p>
              <ol className="mt-3 flex gap-2" aria-label="Booking progress">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex-1" aria-current={i === draft.step ? "step" : undefined}>
                    <div className="h-[3px] overflow-hidden rounded bg-sand/50">
                      <motion.div className="h-full bg-gold" initial={false} animate={{ width: i <= draft.step ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
                    </div>
                    <span className={cn("mt-1.5 hidden text-[0.65rem] uppercase tracking-widest sm:block", i === draft.step ? "text-ink" : "text-stone")}>{s}</span>
                  </li>
                ))}
              </ol>
            </header>

            <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={draft.step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                  {draft.step === 0 && <StepService onPick={(id) => setDraft((d) => ({ serviceId: id, stylistId: stylistsForService(id).some((x) => x.id === d.stylistId) ? d.stylistId : "any", date: undefined, time: undefined, step: 1 }))} selected={draft.serviceId} />}
                  {draft.step === 1 && service && <StepStylist serviceId={service.id} selected={draft.stylistId} onPick={(id) => setDraft({ stylistId: id, date: undefined, time: undefined })} />}
                  {draft.step === 2 && service && <StepDateTime key={service.id + draft.stylistId} serviceId={service.id} stylistId={draft.stylistId} date={draft.date} time={draft.time} onChange={(date, time) => setDraft({ date, time })} />}
                  {draft.step === 3 && <StepDetails />}
                  {draft.step === 4 && service && <StepReview onEdit={go} onBooked={setResult} promo={promo} discount={discount} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {draft.step < 3 && (
              <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-sand/50 bg-ivory px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
                <button type="button" onClick={() => go(draft.step - 1)} disabled={draft.step === 0} className="inline-flex min-h-12 items-center gap-2 text-sm uppercase tracking-widest text-mocha transition hover:text-ink disabled:invisible">
                  <ArrowLeft size={16} /> Back
                </button>
                <Button onClick={() => go(draft.step + 1)} disabled={!canContinue}>
                  Continue <ArrowRight size={16} />
                </Button>
              </footer>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-ivory/60">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}

/* ---------- Step 1: service ---------- */
function StepService({ selected, onPick }: { selected?: string; onPick: (id: string) => void }) {
  const [cat, setCat] = useState<string>("all");
  const list = cat === "all" ? SERVICES : SERVICES.filter((s) => s.category === cat);
  return (
    <div>
      <MyBookings />
      <h3 className="font-display text-3xl">Choose your service</h3>
      <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Service categories">
        {[{ id: "all", label: "All" }, ...SERVICE_CATEGORIES].map((c) => (
          <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)} className={cn("min-h-11 shrink-0 border px-4 text-xs uppercase tracking-widest transition", cat === c.id ? "border-ink bg-ink text-ivory" : "border-sand hover:border-ink")}>
            {c.label}
          </button>
        ))}
      </div>
      <ul className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-3">
        {list.map((s) => (
          <li key={s.id}>
            <button type="button" onClick={() => onPick(s.id)} aria-pressed={selected === s.id} className={cn("flex w-full items-center gap-4 border p-3 text-left transition hover:border-ink", selected === s.id ? "border-ink bg-champagne/60" : "border-sand/70")}>
              <span className="relative h-16 w-16 shrink-0 overflow-hidden bg-champagne sm:h-20 sm:w-20">
                <Image src={s.image} alt="" fill sizes="80px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-display text-xl leading-tight">{s.name}</span>
                  {s.promo && <span className="bg-gold px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-ivory">{s.promo}</span>}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-stone"><Clock size={12} /> {formatDuration(s.durationMin)}</span>
              </span>
              <span className="text-right text-sm"><span className="block text-[0.65rem] uppercase tracking-widest text-stone">From</span>{formatPrice(s.price)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Step 2: stylist ---------- */
function StepStylist({ serviceId, selected, onPick }: { serviceId: string; selected: string; onPick: (id: string) => void }) {
  const list = stylistsForService(serviceId);
  return (
    <div>
      <h3 className="font-display text-3xl">Choose your stylist</h3>
      <p className="mt-1 text-sm text-stone">Pick a favourite, or let us match you with whoever is free at your time.</p>
      <ul className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
        <li>
          <button type="button" onClick={() => onPick("any")} aria-pressed={selected === "any"} className={cn("flex h-full w-full items-center gap-4 border p-3 text-left transition hover:border-ink", selected === "any" ? "border-ink bg-champagne/60" : "border-sand/70")}>
            <span className="flex h-16 w-16 shrink-0 items-center justify-center bg-champagne font-display text-2xl">★</span>
            <span><span className="block font-display text-xl">Any available</span><span className="text-xs text-stone">Most openings</span></span>
          </button>
        </li>
        {list.map((st) => (
          <li key={st.id}>
            <button type="button" onClick={() => onPick(st.id)} aria-pressed={selected === st.id} className={cn("flex h-full w-full items-center gap-4 border p-3 text-left transition hover:border-ink", selected === st.id ? "border-ink bg-champagne/60" : "border-sand/70")}>
              <span className="relative h-16 w-16 shrink-0 overflow-hidden bg-champagne"><Image src={st.image} alt="" fill sizes="64px" className="object-cover" /></span>
              <span><span className="block font-display text-xl leading-tight">{st.name}</span><span className="text-xs text-stone">{st.role}</span></span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Step 3: date & time ---------- */
function StepDateTime({ serviceId, stylistId, date, time, onChange }: { serviceId: string; stylistId: string; date?: string; time?: string; onChange: (date?: string, time?: string) => void }) {
  const today = useMemo(() => salonNow().date, []);
  const maxDate = addDays(today, salon.booking.maxAdvanceDays);
  // Availability is computed live in the browser from the salon's hours, closed dates, blocked slots and this device's own bookings.
  const mine = useMemo(() => loadBookings(), []);
  const slotsFor = (d: string) => computeSlots({ date: d, serviceId, stylistId, booked: mine.filter((b) => b.date === d) });

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (let i = 0; i <= salon.booking.maxAdvanceDays; i++) { const d = addDays(today, i); c[d] = computeSlots({ date: d, serviceId, stylistId, booked: mine.filter((b) => b.date === d) }).length; }
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, stylistId, today, mine]);

  const slots = date ? slotsFor(date) : undefined;
  const groups = useMemo(() => {
    const g = { Morning: [] as string[], Afternoon: [] as string[], Evening: [] as string[] };
    slots?.forEach((s) => {
      const h = Number(s.time.slice(0, 2));
      (h < 12 ? g.Morning : h < 17 ? g.Afternoon : g.Evening).push(s.time);
    });
    return g;
  }, [slots]);

  return (
    <div>
      <h3 className="font-display text-3xl">Pick a date & time</h3>
      <div className="mt-5 grid gap-8 md:grid-cols-[1fr_1fr]">
        <Calendar selected={date} counts={counts} today={today} maxDate={maxDate} onSelect={(d) => onChange(d, undefined)} />
        <div aria-live="polite">
          {!date && <p className="rounded-sm border border-dashed border-sand p-6 text-center text-sm text-stone">Select a date to see available times.</p>}
          {date && (
            <>
              <p className="font-display text-xl">{formatLongDate(date)}</p>
              {slots && slots.length === 0 && <p className="mt-4 text-sm text-stone">No times left on this day. Please choose another date.</p>}
              {slots && slots.length > 0 &&
                (Object.entries(groups) as [string, string[]][]).filter(([, t]) => t.length).map(([label, times]) => (
                  <fieldset key={label} className="mt-4">
                    <legend className="eyebrow !text-stone">{label}</legend>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {times.map((t) => (
                        <button key={t} type="button" aria-pressed={time === t} onClick={() => onChange(date, t)} className={cn("min-h-11 border text-sm transition", time === t ? "border-ink bg-ink text-ivory" : "border-sand hover:border-ink")}>
                          {to12h(t)}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 4: details ---------- */
function StepDetails() {
  const { draft, setDraft } = useBooking();
  const d = draft.details;
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const set = (k: keyof typeof d, v: string | boolean) => {
    const next = { ...d, [k]: v };
    setDraft({ details: next });
    setErrors(validateDetails(next));
  };
  const show = (k: keyof FieldErrors) => (touched[k] ? errors[k] : undefined);
  const touch = (k: string) => { setTouched((t) => ({ ...t, [k]: true })); setErrors(validateDetails(d)); };

  const next = () => {
    const e = validateDetails(d);
    setErrors(e);
    setTouched({ name: true, phone: true, email: true, notes: true, consent: true });
    if (!Object.keys(e).length) setDraft({ step: 4 });
  };

  const input = "mt-1.5 w-full min-h-12 border bg-white px-4 text-base outline-none transition focus:border-ink";
  return (
    <form onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
      <h3 className="font-display text-3xl">Your details</h3>
      <p className="mt-1 text-sm text-stone">So we can confirm and look after you. We never share your information.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={show("name")}>
          <input data-autofocus className={cn(input, show("name") ? "border-red-500" : "border-sand")} value={d.name} onChange={(e) => set("name", e.target.value)} onBlur={() => touch("name")} autoComplete="name" required aria-invalid={!!show("name")} />
        </Field>
        <Field label="Phone number" error={show("phone")}>
          <input className={cn(input, show("phone") ? "border-red-500" : "border-sand")} type="tel" inputMode="tel" value={d.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => touch("phone")} autoComplete="tel" placeholder="+92 300 1234567" required aria-invalid={!!show("phone")} />
        </Field>
        <Field label="Email (optional)" error={show("email")} className="sm:col-span-2">
          <input className={cn(input, show("email") ? "border-red-500" : "border-sand")} type="email" value={d.email} onChange={(e) => set("email", e.target.value)} onBlur={() => touch("email")} autoComplete="email" placeholder="you@example.com" aria-invalid={!!show("email")} />
        </Field>
        <Field label="Notes (optional)" error={show("notes")} className="sm:col-span-2">
          <textarea className={cn(input, "min-h-24 py-3", show("notes") ? "border-red-500" : "border-sand")} value={d.notes} onChange={(e) => set("notes", e.target.value)} onBlur={() => touch("notes")} maxLength={500} placeholder="Allergies, inspiration, anything we should know" />
        </Field>
      </div>
      <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm">
        <input type="checkbox" checked={d.consent} onChange={(e) => set("consent", e.target.checked)} onBlur={() => touch("consent")} className="mt-1 h-5 w-5 accent-[#a8844d]" />
        <span>I agree to be contacted about this booking and accept the <a href="/privacy" target="_blank" className="underline">privacy policy</a>.</span>
      </label>
      {show("consent") && <p role="alert" className="mt-1 text-sm text-red-700">{errors.consent}</p>}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" onClick={() => setDraft({ step: 2 })} className="inline-flex min-h-12 items-center gap-2 text-sm uppercase tracking-widest text-mocha hover:text-ink"><ArrowLeft size={16} /> Back</button>
        <Button type="submit">Review <ArrowRight size={16} /></Button>
      </div>
    </form>
  );
}

function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block text-sm", className)}>
      <span className="text-[0.7rem] uppercase tracking-widest text-mocha">{label}</span>
      {children}
      {error && <span role="alert" className="mt-1 block text-sm text-red-700">{error}</span>}
    </label>
  );
}

/* ---------- Step 5: review & confirm ---------- */
function StepReview({ onEdit, onBooked, promo, discount }: { onEdit: (s: number) => void; onBooked: (b: StoredBooking) => void; promo?: string; discount: number }) {
  const { draft, setDraft } = useBooking();
  const service = getService(draft.serviceId!)!;
  const stylist = draft.stylistId !== "any" ? getStylist(draft.stylistId) : undefined;
  const [error, setError] = useState("");
  const total = Math.round(service.price * (1 - discount / 100));

  const confirm = () => {
    setError("");
    const mine = loadBookings();
    const sameDay = mine.filter((b) => b.date === draft.date);
    // Re-check right now: the slot may have been taken since the customer picked it.
    const slot = computeSlots({ date: draft.date!, serviceId: service.id, stylistId: draft.stylistId, booked: sameDay }).find((s) => s.time === draft.time);
    if (!slot) { setError("Sorry, that time is no longer available. Please choose another."); setDraft({ time: undefined }); return; }
    const dup = sameDay.find((b) => b.serviceId === service.id);
    if (dup) { setError(`You already have this service on that day (${dup.reference}).`); return; }

    const load = (id: string) => sameDay.filter((b) => b.stylistId === id).length;
    const stylistId = draft.stylistId !== "any" ? draft.stylistId : [...slot.stylistIds].sort((a, b) => load(a) - load(b))[0];
    onBooked(saveBooking({
      serviceId: service.id, stylistId, date: draft.date!, time: draft.time!, durationMin: service.durationMin,
      name: draft.details.name.trim(), phone: draft.details.phone.trim(), email: draft.details.email.trim() || undefined, notes: draft.details.notes.trim() || undefined,
      promoCode: discount ? salon.offer.code : undefined, discountPercent: discount, price: service.price, total,
    }));
  };

  const rows: [string, string, number][] = [
    ["Service", `${service.name} · ${formatDuration(service.durationMin)}`, 0],
    ["Stylist", stylist?.name ?? "Any available stylist", 1],
    ["Date & time", `${formatLongDate(draft.date!)}, ${to12h(draft.time!)}`, 2],
    ["Your details", `${draft.details.name} · ${draft.details.phone}${draft.details.email ? " · " + draft.details.email : ""}`, 3],
  ];

  return (
    <div>
      <h3 className="font-display text-3xl">Review & confirm</h3>
      <dl className="mt-5 divide-y divide-sand/60 border-y border-sand/60">
        {rows.map(([k, v, step]) => (
          <div key={k} className="flex items-start justify-between gap-4 py-3.5">
            <div className="min-w-0"><dt className="text-[0.65rem] uppercase tracking-widest text-stone">{k}</dt><dd className="mt-0.5 break-words">{v}</dd></div>
            <button type="button" onClick={() => onEdit(step)} className="shrink-0 text-xs uppercase tracking-widest text-gold underline-offset-4 hover:underline">Edit</button>
          </div>
        ))}
        {draft.details.notes && <div className="py-3.5"><dt className="text-[0.65rem] uppercase tracking-widest text-stone">Notes</dt><dd className="mt-0.5 break-words text-sm">{draft.details.notes}</dd></div>}
      </dl>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-widest text-stone">Estimated total</p>
          {discount > 0 && <p className="text-xs text-gold">{salon.offer.percent}% first-visit offer applied ({promo})</p>}
        </div>
        <p className="font-display text-3xl">{formatPrice(total)}{discount > 0 && <span className="ml-2 text-base text-stone line-through">{formatPrice(service.price)}</span>}</p>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-stone">{salon.booking.policy} Final price is confirmed at the salon.</p>
      {discount > 0 && <p className="mt-1 text-xs text-stone">{salon.offer.terms}</p>}

      {error && <div role="alert" className="mt-4 border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}<button className="ml-2 underline" onClick={() => onEdit(2)}>Choose another time</button></div>}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" onClick={() => onEdit(3)} className="inline-flex min-h-12 items-center gap-2 text-sm uppercase tracking-widest text-mocha hover:text-ink"><ArrowLeft size={16} /> Back</button>
        <Button onClick={confirm} disabled={!draft.time} variant="gold">Confirm booking <Check size={16} /></Button>
      </div>
    </div>
  );
}

/* ---------- Confirmation ---------- */
const bookingMessage = (b: StoredBooking) => {
  const service = getService(b.serviceId);
  const stylist = getStylist(b.stylistId);
  return [
    `Hello ${salon.name}, I'd like to confirm my appointment:`,
    `Reference: ${b.reference}`,
    `Service: ${service?.name} (${formatDuration(b.durationMin)})`,
    `Stylist: ${stylist?.name ?? "Any available"}`,
    `When: ${formatLongDate(b.date)}, ${to12h(b.time)}`,
    `Name: ${b.name}`,
    `Phone: ${b.phone}`,
    b.promoCode ? `Offer code: ${b.promoCode}` : "",
    b.notes ? `Notes: ${b.notes}` : "",
    `Estimated total: ${formatPrice(b.total)}`,
  ].filter(Boolean).join("\n");
};

function Confirmation({ booking, onDone }: { booking: StoredBooking; onDone: () => void }) {
  const service = getService(booking.serviceId);
  const stylist = getStylist(booking.stylistId);
  const [copied, setCopied] = useState(false);
  const message = bookingMessage(booking);
  const wa = `https://wa.me/${salon.contact.whatsapp}?text=${encodeURIComponent(message)}`;

  const ics = () => {
    const [y, m, d] = booking.date.split("-");
    const start = `${y}${m}${d}T${booking.time.replace(":", "")}00`;
    const endMin = Number(booking.time.slice(0, 2)) * 60 + Number(booking.time.slice(3)) + booking.durationMin;
    const end = `${y}${m}${d}T${String(Math.floor(endMin / 60)).padStart(2, "0")}${String(endMin % 60).padStart(2, "0")}00`;
    const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Aurelle//Booking//EN", "BEGIN:VEVENT", `UID:${booking.id}@aurelle`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
      `DTSTART;TZID=${salon.booking.timezone}:${start}`, `DTEND;TZID=${salon.booking.timezone}:${end}`, `SUMMARY:${service?.name} at ${salon.name}`, `DESCRIPTION:Booking ${booking.reference} with ${stylist?.name ?? "our team"}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const a = document.createElement("a"); a.href = url; a.download = `${booking.reference}.ics`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(message); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-10 text-center sm:px-14" role="status">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/15">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#a8844d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path className="draw" d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      </motion.div>
      <p className="eyebrow mt-6">Booking received</p>
      <h3 className="mt-2 font-display text-4xl">Thank you, {booking.name.split(" ")[0]}.</h3>
      <p className="mx-auto mt-3 max-w-md text-mocha">Your appointment is saved. <strong className="font-medium text-ink">One last step:</strong> send it to the salon on WhatsApp so the team can confirm your slot.</p>

      <div className="mx-auto mt-7 w-full max-w-md border border-sand bg-white p-5 text-left">
        <p className="text-center text-[0.65rem] uppercase tracking-widest text-stone">Booking reference</p>
        <p className="text-center font-display text-3xl tracking-wider">{booking.reference}</p>
        <div className="hairline my-4" />
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-stone">Service</dt><dd className="text-right">{service?.name}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-stone">Stylist</dt><dd className="text-right">{stylist?.name}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-stone">When</dt><dd className="text-right">{formatLongDate(booking.date)}, {to12h(booking.time)}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-stone">Estimated total</dt><dd className="text-right">{formatPrice(booking.total)}</dd></div>
        </dl>
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-md flex-col gap-3">
        <Button variant="gold" size="lg" href={wa} external className="w-full"><MessageCircle size={18} /> Send to salon on WhatsApp</Button>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={ics} className="flex-1"><CalendarPlus size={16} /> Add to calendar</Button>
          <Button variant="outline" onClick={copy} className="flex-1"><Copy size={16} /> {copied ? "Copied" : "Copy details"}</Button>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-stone">{salon.booking.policy}</p>
      <div className="mt-6"><Button onClick={onDone}>Done</Button></div>
    </div>
  );
}

/* ---------- Existing bookings on this device ---------- */
export function MyBookings() {
  const [list, setList] = useState<StoredBooking[]>([]);
  useEffect(() => { setList(loadBookings().filter((b) => b.date >= salonNow().date)); }, []);
  if (!list.length) return null;
  return (
    <section aria-label="Your upcoming bookings" className="mb-6 border border-sand bg-champagne/40 p-4">
      <p className="eyebrow">Your upcoming bookings</p>
      <ul className="mt-2 divide-y divide-sand/60">
        {list.map((b) => (
          <li key={b.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
            <span className="min-w-0"><span className="block truncate font-medium">{getService(b.serviceId)?.name}</span><span className="text-xs text-stone">{formatLongDate(b.date)}, {to12h(b.time)} · {b.reference}</span></span>
            <button type="button" aria-label={`Remove booking ${b.reference} from this device`} onClick={() => { removeBooking(b.id); setList((l) => l.filter((x) => x.id !== b.id)); }} className="flex h-11 w-11 shrink-0 items-center justify-center text-stone hover:text-red-700"><Trash2 size={16} /></button>
          </li>
        ))}
      </ul>
      <p className="mt-1 text-xs text-stone">Removing only clears it from this device. Message the salon to cancel or change a confirmed time.</p>
    </section>
  );
}
