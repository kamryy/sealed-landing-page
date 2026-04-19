import BackgroundEffects from '@/components/BackgroundEffects';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import SectionFive from '@/components/SectionFive';
import SectionFour from '@/components/SectionFour';
import SectionOne from '@/components/SectionOne';
import SectionThree from '@/components/SectionThree';
import SectionTwo from '@/components/SectionTwo';
import WhiteListSection from '@/components/WhiteListSection';

/**
 * Sealed landing page root.
 *
 * Layout notes:
 *   - The page uses native scrolling only. SectionOne and SectionThree
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
          <SectionOne />
        </div>

        <div className="section-two-stack cv-auto">
          <div className="relative px-8 lg:px-4">
            <SectionTwo />
          </div>
          <div className="relative px-8 lg:px-4">
            <SectionThree />
          </div>
        </div>

        <div className="section-four-stack relative px-8 lg:px-4 cv-auto">
          <SectionFour />
        </div>

        <div className="section-gap-md relative px-8 lg:px-4 cv-auto">
          <SectionFive />
        </div>

        <div className="section-gap-md relative px-8 lg:px-4 cv-auto">
          <FAQSection />
        </div>

        <div
          id="whitelist"
          className="section-gap-md relative px-8 lg:px-4 cv-auto"
        >
          <WhiteListSection />
        </div>

        <div className="section-gap-sm relative px-8 lg:px-4 cv-auto">
          <Footer />
        </div>
      </div>
    </main>
  );
}
