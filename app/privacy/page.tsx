import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Closing";
import { salon } from "@/config/salon";

export const metadata: Metadata = { title: "Privacy Policy", description: `How ${salon.name} handles your personal information.`, alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <>
      <Navbar solid />
      <main id="main" className="mx-auto max-w-3xl px-5 pb-24 pt-36 sm:px-8">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 font-display text-5xl font-light">Privacy policy</h1>
        <div className="mt-8 space-y-5 leading-relaxed text-mocha [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-ink">
          <h2>What we collect</h2>
          <p>When you book, the details you enter (name, phone number, optional email and notes, and your chosen appointment) are saved on your own device and are sent to us only when you choose to message us on WhatsApp. We do not run a server that stores them.</p>
          <h2>How we use it</h2>
          <p>To manage and confirm your appointment and to contact you about it. If you message us to join our updates list, we use your number only for news and offers, and you can ask us to stop at any time.</p>
          <h2>Sharing</h2>
          <p>We do not sell your information. We only share it with service providers needed to run the website and booking system.</p>
          <h2>Your choices</h2>
          <p>You can ask us to correct or delete your information by contacting us at <a className="underline" href={`mailto:${salon.contact.email}`}>{salon.contact.email}</a>.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
