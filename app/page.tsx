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
import { FadeIn } from "./components/scroll-anim";
import ShopTeaserSection from "./components/shop-teaser";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f12]">
      <Navbar />
      <FadeIn>
        <Hero />
      </FadeIn>
      <FadeIn delay={0.1}>
        <AboutSection />
      </FadeIn>
      <FadeIn delay={0.1}>
        <VisionSection />
      </FadeIn>
      
      <ServicesList />
      
      
      <FadeIn delay={0.1}>
        <StatsSection />
      </FadeIn>
      <FadeIn delay={0.1}>
        <PricingSection />
      </FadeIn>
            <FadeIn delay={0.1}>
        <ShopTeaserSection />
      </FadeIn>

      <FadeIn delay={0.1}>
        <BookingSection />
      </FadeIn>

      <FadeIn delay={0.1}>
        <LocationSection />
      </FadeIn>
      <FooterSection />
    </main>
  );
}
