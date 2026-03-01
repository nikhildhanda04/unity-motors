import Navbar from "./components/navbar";
import { Hero } from "./components/hero";
import AboutSection from "./components/about";
import ServicesList from "./components/services";
import StatsSection from "./components/stats";
import PricingSection from "./components/pricing";
import BookingSection from "./components/booking";
import FooterSection from "./components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <AboutSection />
      <ServicesList />
      <StatsSection />
      <PricingSection />
      <BookingSection />
      <FooterSection />
    </main>
  );
}
