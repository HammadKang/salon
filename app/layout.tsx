import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { salon } from "@/config/salon";
import { DAY_NAMES } from "@/config/salon";
import { IMG, photo } from "@/lib/images";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(salon.url),
  title: { default: salon.seo.title, template: `%s | ${salon.name}` },
  description: salon.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", siteName: `${salon.name} ${salon.tagline}`, title: salon.seo.title, description: salon.seo.description,
    images: [{ url: photo(IMG.interior, 1200), width: 1200, height: 800, alt: `${salon.name} salon interior` }],
  },
  twitter: { card: "summary_large_image", title: salon.seo.title, description: salon.seo.description },
};

export const viewport: Viewport = { themeColor: "#faf6f0", width: "device-width", initialScale: 1 };

/** LocalBusiness data is only published once the owner marks the details as real (salon.verified). */
function jsonLd() {
  if (!salon.verified) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: `${salon.name} ${salon.tagline}`,
    url: salon.url,
    image: photo(IMG.interior, 1200),
    telephone: salon.contact.phone,
    email: salon.contact.email,
    address: { "@type": "PostalAddress", streetAddress: salon.address.line1, addressLocality: salon.address.city, postalCode: salon.address.postcode, addressCountry: salon.address.country },
    openingHoursSpecification: Object.entries(salon.hours).filter(([, h]) => h).map(([d, h]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: DAY_NAMES[Number(d)], opens: h!.open, closes: h!.close })),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ld = jsonLd();
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-3 focus:text-ivory">Skip to content</a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
