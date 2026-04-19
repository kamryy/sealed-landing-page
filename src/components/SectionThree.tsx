'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import CTASection from '@/components/CTASection';
import SectionHeader from '@/components/SectionHeader';
import { useScrollProgress } from '@/hooks/useScrollProgress';

const STATES = [
  {
    id: 'no-ads',
    label: 'No ads',
    iconSrc: '/assets/section_three/no_ads.svg',
    visualSrc: '/assets/section_three/visual_one.png',
    title: 'Sealed protects you from ads',
    description:
      'Sealed protects users from advertisements by eliminating data collection and third-party tracking. With no profiling, your conversations remain clean, private, and uninterrupted',
    cta: 'read more about Our solution',
  },
  {
    id: 'security',
    label: 'Security',
    iconSrc: '/assets/section_three/security.svg',
    visualSrc: '/assets/section_three/visual_two.png',
    title: 'Encrypted messages delivered directly to the recipient',
    description:
      'Each message is secured with strong encryption and transmitted straight to the recipient without passing through any central server. This direct delivery mode guarantees maximum privacy and prevents interception or surveillance.',
    cta: 'read more about Security',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    iconSrc: '/assets/section_three/privacy.svg',
    visualSrc: '/assets/section_three/visual_three.png',
    title: 'Server-Free, Fully Private Chat',
    description:
      'This serverless approach allows messages to flow directly from sender to recipient, eliminating any chance of interception through central servers. By removing intermediaries, it guarantees true end-to-end privacy that even developers cannot access.',
    cta: 'read more about Privacy',
  },
  {
    id: 'blockchain',
    label: 'Blockchain',
    iconSrc: '/assets/section_three/blockchain.svg',
    visualSrc: '/assets/section_three/visual_four.png',
    title: 'Next-Level Security Through Blockchain',
    description:
      'By combining strong cryptography with blockchain, each message is securely encrypted and permanently anchored, preventing unauthorized modifications. This approach provides verifiable, tamper-resistant communication that prioritizes privacy and trust.',
    cta: 'read more about Blockchain',
  },
] as const;

const TAB_WIDTH = 188;
const TAB_GAP = 18;

/* ──────────────────────────────────────────────────────────────────── *
 *  Desktop scrub scene — pinned via native `position: sticky`.
 *  Scroll progress drives tab translate directly on the DOM; React only
 *  re-renders when the active step changes.
 * ──────────────────────────────────────────────────────────────────── */

function DesktopScrubScene({ header }: { header: React.ReactNode }) {
  const scrubWrapperRef = useRef<HTMLDivElement | null>(null);
  const tabsTrackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const maxStep = STATES.length - 1;

  const setTabTranslate = useCallback((floatStep: number) => {
    const el = tabsTrackRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${-(floatStep * (TAB_WIDTH + TAB_GAP))}px, 0, 0)`;
  }, []);

  useScrollProgress(scrubWrapperRef, (progress) => {
    const floatStep = progress * maxStep;
    setTabTranslate(floatStep);
    const idx = Math.min(maxStep, Math.round(floatStep));
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  // Initial placement.
  useEffect(() => {
    setTabTranslate(0);
  }, [setTabTranslate]);

  const state = STATES[activeIndex];

  const setByTabClick = (index: number) => {
    const wrapper = scrubWrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const scrubRange = rect.height - window.innerHeight;
    if (scrubRange <= 0) return;
    const targetProgress = maxStep === 0 ? 0 : index / maxStep;
    const targetY = window.scrollY + rect.top + targetProgress * scrubRange;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <div
      ref={scrubWrapperRef}
      className="relative mt-12 hidden w-full max-w-400 md:block md:h-[400vh]"
    >
      <div className="sticky top-[var(--nav-h)] flex h-[calc(100svh-var(--nav-h))] flex-col items-center justify-center gap-6 pt-2">
        <div className="flex w-full justify-center">{header}</div>
        <div className="w-full">
          <div className="relative overflow-hidden">
            <div
              ref={tabsTrackRef}
              className="flex gap-4.5 will-change-transform"
            >
              {STATES.map((s, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setByTabClick(index)}
                    className={`flex h-10.5 w-47 shrink-0 items-center gap-3 px-2 ${
                      isActive ? 'bg-[rgba(107,250,214,0.05)]' : ''
                    }`}
                  >
                    <div
                      className={`h-6 w-1 rounded-full ${
                        isActive ? 'bg-sealed-teal' : 'bg-[#404040]'
                      }`}
                    />
                    <Image
                      src={s.iconSrc}
                      alt=""
                      width={16}
                      height={16}
                      className={isActive ? 'opacity-100' : 'opacity-60'}
                    />
                    <p
                      className={`font-bold leading-none whitespace-nowrap ${
                        isActive ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      {s.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            key={`slide-${activeIndex}`}
            className="mt-8 grid grid-cols-12 gap-[clamp(1.5rem,3vw,3rem)] animate-[fadeIn_300ms_ease-out]"
          >
            <div className="col-span-5 pt-6">
              <h3 className="max-w-137.5 font-lexend text-[clamp(2rem,2.6vw,2.25rem)] font-semibold leading-[1.05] text-white">
                {state.title}
              </h3>
              <p className="mt-4 max-w-140 text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.6] text-[#b3b3b3]">
                {state.description}
              </p>
            </div>

            <div className="col-span-7 self-start rounded-3xl bg-[linear-gradient(93.5866deg,rgba(107,250,214,1)_18.598%,rgba(202,115,68,1)_96.15%)] p-px">
              <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)]">
                <div className="relative aspect-video w-full max-h-125 min-h-72 overflow-hidden px-6 md:px-8 lg:px-12 bg-[#060808]">
                  <Image
                    src={state.visualSrc}
                    alt={state.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 58vw"
                    className={
                      state.visualSrc ===
                      '/assets/section_three/visual_four.png'
                        ? 'object-cover object-bottom'
                        : 'object-contain object-bottom'
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── *
 *  Mobile — horizontal-scroll tabs, no scroll hijacking
 * ──────────────────────────────────────────────────────────────────── */

function MobileTabs() {
  const [mobileIndex, setMobileIndex] = useState(0);
  const mobileTabsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tabsContainer = mobileTabsRef.current;
    if (!tabsContainer) return;
    const activeButton = tabsContainer.querySelector<HTMLButtonElement>(
      `[data-tab-index="${mobileIndex}"]`
    );
    activeButton?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [mobileIndex]);

  const state = STATES[mobileIndex];

  return (
    <div className="mt-6 w-full max-w-210 md:hidden">
      <div className="overflow-x-auto pb-1 touch-pan-x [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div ref={mobileTabsRef} className="flex min-w-max gap-4.5">
          {STATES.map((s, index) => {
            const isActive = index === mobileIndex;
            return (
              <button
                type="button"
                key={s.id}
                data-tab-index={index}
                onClick={() => setMobileIndex(index)}
                className={`flex h-10.5 w-47 shrink-0 items-center gap-3 px-2 ${
                  isActive ? 'bg-[rgba(107,250,214,0.05)]' : ''
                }`}
              >
                <div
                  className={`h-6 w-1 rounded-full ${
                    isActive ? 'bg-sealed-teal' : 'bg-[#404040]'
                  }`}
                />
                <Image
                  src={s.iconSrc}
                  alt=""
                  width={16}
                  height={16}
                  className={isActive ? 'opacity-100' : 'opacity-60'}
                />
                <p
                  className={`font-bold leading-none whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-white/60'
                  }`}
                >
                  {s.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={`m-${mobileIndex}`}
        className="mt-8 animate-[fadeIn_300ms_ease-out]"
      >
        <h3 className="max-w-137.5 font-lexend text-[clamp(2rem,2.6vw,2.25rem)] font-semibold leading-[1.05] text-white">
          {state.title}
        </h3>
        <p className="mt-4 max-w-140 text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.6] text-[#b3b3b3]">
          {state.description}
        </p>

        <div className="mt-6 rounded-3xl bg-[linear-gradient(93.5866deg,rgba(107,250,214,1)_18.598%,rgba(202,115,68,1)_96.15%)] p-px">
          <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#060808]">
            <div className="relative aspect-16/10 w-full overflow-hidden">
              <Image
                src={state.visualSrc}
                alt={state.title}
                fill
                sizes="100vw"
                className="object-cover object-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── *
 *  SectionThree
 * ──────────────────────────────────────────────────────────────────── */

export default function SectionThree() {
  // Memoize to keep reference stability of the static header block.
  const header = useMemo(
    () => (
      <div className="flex w-full max-w-210 flex-col items-center gap-3.75 pt-[2.5px] text-center">
        <SectionHeader
          badgeIcon="/assets/icons/confirmation.svg"
          badgeText="Uncensored Expression"
          title="Freedom to Speak Without Control"
          subtitle="Sealed empowers users to communicate openly and securely without censorship, surveillance, or external interference"
        />
      </div>
    ),
    []
  );

  return (
    <section className="flex flex-col items-center pt-[clamp(1.5rem,3vw,2.5rem)] pb-[clamp(3.5rem,10vw,7.5rem)]">
      {/* Mobile: header flows inline above the tabs. Desktop: header is rendered inside the sticky scene so it stays pinned with the content. */}
      <div className="md:hidden w-full flex justify-center">{header}</div>
      <DesktopScrubScene header={header} />
      <MobileTabs />

      {/* CTA lives outside the scrub scene so it flows naturally after */}
      <div className="mt-24 w-full">
        <CTASection />
      </div>
    </section>
  );
}
