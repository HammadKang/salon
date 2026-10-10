export type BookingInput = {
  serviceId: string;
  stylistId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  promoCode?: string;
  consent?: boolean;
  website?: string; // honeypot, must stay empty
};

export type FieldErrors = Partial<Record<"name" | "phone" | "email" | "notes" | "consent", string>>;

/** Shared by the form (instant feedback) and the API (real enforcement). */
export function validateDetails(v: Pick<BookingInput, "name" | "phone" | "email" | "notes" | "consent">): FieldErrors {
  const e: FieldErrors = {};
  const name = (v.name ?? "").trim();
  if (name.length < 2) e.name = "Please enter your full name.";
  else if (name.length > 80) e.name = "That name is a little long. Please shorten it.";

  const digits = (v.phone ?? "").replace(/[^\d]/g, "");
  if (!/^[+\d][\d\s\-()]{6,20}$/.test((v.phone ?? "").trim()) || digits.length < 7 || digits.length > 15)
    e.phone = "Enter a valid phone number, e.g. +92 300 1234567.";

  const email = (v.email ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = "That email doesn't look right.";

  if ((v.notes ?? "").length > 500) e.notes = "Notes can be up to 500 characters.";
  if (!v.consent) e.consent = "Please agree so we can contact you about this booking.";
  return e;
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
