import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import HowItWorks from "@/components/home/HowItWorks";
import {
  FeaturedBusinesses,
  FeaturedProviders,
} from "@/components/home/FeaturedSection";
import CtaBanner from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <div className="bg-white">
        <FeaturedBusinesses />
      </div>
      <HowItWorks />
      <div className="bg-white">
        <FeaturedProviders />
      </div>
      <CtaBanner />
    </>
  );
}
