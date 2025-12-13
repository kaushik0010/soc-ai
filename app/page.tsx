// app/page.tsx
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CoreFeaturesSection from '@/components/landing/CoreFeaturesSection';
import FinalCtaSection from '@/components/landing/FinalCtaSection';

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <CoreFeaturesSection />
      <FinalCtaSection />
    </>
  );
};

export default LandingPage;