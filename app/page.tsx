import Navbar from "./components/navbar";
import { Hero } from "./components/hero";
import AboutSection from "./components/about";
import VisionSection from "./components/vision";
import ServicesList from "./components/services";
import StatsSection from "./components/stats";
import PricingSection from "./components/pricing";
import BookingSection from "./components/booking";
import LocationSection from "./components/location";
import FooterSection from "./components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f12]">
      <Navbar />
      <Hero />
      <AboutSection />
      <ServicesList />
      <StatsSection />
      <PricingSection />
      <VisionSection />
      <BookingSection />
      <LocationSection />
      <FooterSection />
    </main>
  );
}
