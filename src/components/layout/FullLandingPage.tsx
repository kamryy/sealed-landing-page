import BackgroundEffects from "@/components/layout/BackgroundEffects";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FAQSection from "@/components/sections/FAQSection";
import FreedomSection from "@/components/sections/FreedomSection";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PrivacyFeaturesSection from "@/components/sections/PrivacyFeaturesSection";
// import TokenomicsSection from "@/components/sections/TokenomicsSection";
import WaitlistSection from "@/components/sections/WaitlistSection";
import ZeroTraceSection from "@/components/sections/ZeroTraceSection";

/**
 * Sealed landing page root.
 *
 * Layout notes:
 *   - The page uses native scrolling only. ZeroTraceSection and FreedomSection
 *     each render a tall wrapper with a `position: sticky` child to pin
 *     while the user scrolls — no wheel hijacking, no body overflow
 *     toggling.
 *   - `content-visibility: auto` is applied to below-the-fold sections
 *     to skip paint/layout until they're near the viewport.
 */
export default function FullLandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip pb-12 pt-0 lg:px-12 lg:pt-6">
      <BackgroundEffects />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <Navbar />

        <HeroSection />

        <div className="relative px-8 lg:px-4">
          <ZeroTraceSection />
        </div>

        <div className="section-two-stack cv-auto">
          <div className="relative px-8 lg:px-4">
            <PrivacyFeaturesSection />
          </div>
          <div className="relative px-8 lg:px-4">
            <FreedomSection />
          </div>
        </div>

        {/*commented for now, because we dont want to display it */}
        
        {/* <div className="section-four-stack relative px-8 lg:px-4 cv-auto">
          <TokenomicsSection />
        </div> */}

        <div className="section-gap-md relative px-8 lg:px-4 cv-auto">
          <HowItWorksSection />
        </div>

        <div className="section-gap-md relative px-8 lg:px-4 cv-auto">
          <FAQSection />
        </div>

        <div
          id="whitelist"
          className="section-gap-md relative px-8 lg:px-4 cv-auto"
        >
          <WaitlistSection />
        </div>

        <div className="section-gap-sm relative px-8 lg:px-4 cv-auto">
          <Footer />
        </div>
      </div>
    </main>
  );
}
