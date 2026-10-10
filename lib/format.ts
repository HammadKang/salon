import { salon } from "@/config/salon";

export const formatPrice = (n: number) =>
  new Intl.NumberFormat(salon.currency.locale, {
    style: "currency",
    currency: salon.currency.code,
    maximumFractionDigits: 0,
  }).format(n);

export const formatDuration = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return [h ? `${h} hr` : "", m ? `${m} min` : ""].filter(Boolean).join(" ");
};

export const to12h = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${ap}`;
};

export const formatLongDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
