import BackgroundEffects from '@/components/BackgroundEffects';
import FAQSection from '@/components/FAQSection';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import SectionFive from '@/components/SectionFive';
import SectionFour from '@/components/SectionFour';
import SectionOne from '@/components/SectionOne';
import SectionThree from '@/components/SectionThree';
import SectionTwo from '@/components/SectionTwo';

export default function FullLandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip overflow-y-visible pb-12 pt-0 lg:px-12 lg:pt-6 ">
      <BackgroundEffects />

      <div className="relative z-10 mx-auto w-full max-w-7xl overflow-visible">
        <Navbar />

        <div className="overflow-visible">
          <HeroSection />
        </div>
        <div className="relative z-10 overflow-visible px-8 lg:px-4 ">
          <SectionOne />
        </div>
        <div className="section-two-stack">
          <div className="relative z-30 overflow-visible px-8 lg:px-4 ">
            <SectionTwo />
          </div>
          <div className="relative z-30 overflow-visible px-8 lg:px-4">
            <SectionThree />
          </div>
        </div>
        <div className="section-four-stack relative z-30 overflow-visible px-8 lg:px-4">
          <SectionFour />
        </div>
        <div className="relative z-30 overflow-visible px-8 lg:px-4">
          <SectionFive />
        </div>
        <div className="relative z-30 overflow-visible px-8 lg:px-4">
          <FAQSection />
        </div>
      </div>
    </main>
  );
}
