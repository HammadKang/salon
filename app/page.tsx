import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Intro, { MarqueeBand } from "@/components/sections/Intro";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Signature from "@/components/sections/Signature";
import Gallery from "@/components/sections/Gallery";
import Team from "@/components/sections/Team";
import { Faq, HowItWorks, Offers, Testimonials } from "@/components/sections/Journey";
import Contact from "@/components/sections/Contact";
import { FinalCta, Footer } from "@/components/sections/Closing";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <MarqueeBand />
        <Intro />
        <Services />
        <About />
        <Signature />
        <Gallery />
        <Team />
        <HowItWorks />
        <Testimonials />
        <Offers />
        <Faq />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
