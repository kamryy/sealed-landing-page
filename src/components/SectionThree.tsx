'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import CTASection from '@/components/CTASection';
import SectionHeader from '@/components/SectionHeader';

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

export default function SectionThree() {
  const scrubAreaRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const desktopSlideContentRef = useRef<HTMLDivElement | null>(null);
  const mobileTabsRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const snappedStepRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [displayedDesktopIndex, setDisplayedDesktopIndex] = useState(0);
  const [isDesktopSwitching, setIsDesktopSwitching] = useState(false);
  const [displayedMobileIndex, setDisplayedMobileIndex] = useState(0);
  const [isMobileSwitching, setIsMobileSwitching] = useState(false);

  const maxStep = STATES.length - 1;
  const DWELL_WINDOW = 0.1;
  const DWELL_RELEASE_WINDOW = 0.1;

  const setSlideByIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(maxStep, index));
    const nextProgress = maxStep === 0 ? 0 : clampedIndex / maxStep;

    progressRef.current = nextProgress;
    snappedStepRef.current = clampedIndex;
    setProgress(nextProgress);
    setIsScrollLocked(false);
  };

  const getScrubState = useCallback(() => {
    const scrubArea = scrubAreaRef.current;
    if (!scrubArea) {
      return { canScrub: false, beforeLockStart: true, afterLockEnd: false };
    }

    const rect = scrubArea.getBoundingClientRect();
    const viewport = window.innerHeight;
    // Start scrubbing when the section is vertically centered (top within top 35% of viewport)
    const lockStartY = viewport * 0.35;
    // End scrubbing when the scrub area bottom is near the bottom of viewport
    const lockEndY = viewport * 0.95;

    return {
      canScrub: rect.top <= lockStartY && rect.bottom >= lockEndY,
      beforeLockStart: rect.top > lockStartY,
      afterLockEnd: rect.bottom < lockEndY,
    };
  }, []);

  const applyProgress = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(1, next));
      progressRef.current = clamped;

      // Mark as completed when reaching the end
      if (clamped >= 1) {
        hasCompletedRef.current = true;
      }

      const continuousRaw = clamped * maxStep;
      const nearestStep = Math.round(continuousRaw);

      if (
        snappedStepRef.current == null &&
        Math.abs(continuousRaw - nearestStep) <= DWELL_WINDOW / 2
      ) {
        snappedStepRef.current = nearestStep;
      }

      if (snappedStepRef.current != null) {
        const snapped = snappedStepRef.current;
        if (
          continuousRaw < snapped - DWELL_RELEASE_WINDOW / 2 ||
          continuousRaw > snapped + DWELL_RELEASE_WINDOW / 2
        ) {
          snappedStepRef.current = null;
        }
      }

      setProgress(clamped);
      setIsScrollLocked(clamped > 0 && clamped < 1);
    },
    [maxStep]
  );

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const onScroll = () => {
      const state = getScrubState();
      if (state.beforeLockStart) {
        if (progressRef.current !== 0) applyProgress(0);
        // Reset completed flag when scrolling back above the section
        hasCompletedRef.current = false;
        setIsScrollLocked(false);
        return;
      }
      if (state.afterLockEnd) {
        if (progressRef.current !== 1) applyProgress(1);
        setIsScrollLocked(false);
      }
    };

    const isOverSlideContent = (clientX: number, clientY: number) => {
      const slideContent = desktopSlideContentRef.current;
      if (!slideContent) return false;

      const slideRect = slideContent.getBoundingClientRect();
      return (
        clientX >= slideRect.left &&
        clientX <= slideRect.right &&
        clientY >= slideRect.top &&
        clientY <= slideRect.bottom
      );
    };

    const isOverCTA = (clientX: number, clientY: number) => {
      const cta = ctaRef.current;
      if (!cta) return false;

      const rect = cta.getBoundingClientRect();
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    };

    const onWheel = (e: WheelEvent) => {
      // Don't trigger animation when over CTA
      if (isOverCTA(e.clientX, e.clientY)) {
        return;
      }

      if (isOverSlideContent(e.clientX, e.clientY)) {
        setIsScrollLocked(false);
        return;
      }

      const state = getScrubState();
      if (!state.canScrub) {
        setIsScrollLocked(false);
        return;
      }

      // If animation completed and user is scrolling down, don't re-lock
      if (hasCompletedRef.current && e.deltaY > 0) {
        setIsScrollLocked(false);
        return;
      }

      // If scrolling up, allow re-entering the animation
      if (hasCompletedRef.current && e.deltaY < 0 && progressRef.current >= 1) {
        hasCompletedRef.current = false;
      }

      const delta = e.deltaY * 0.0014;
      const next = Math.max(0, Math.min(1, progressRef.current + delta));

      if (next !== progressRef.current) {
        e.preventDefault();
        applyProgress(next);
        return;
      }

      const leavingStart = progressRef.current <= 0 && e.deltaY < 0;
      const leavingEnd = progressRef.current >= 1 && e.deltaY > 0;
      setIsScrollLocked(!(leavingStart || leavingEnd));
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      // Don't trigger animation when over CTA
      if (isOverCTA(touch.clientX, touch.clientY)) {
        return;
      }

      const state = getScrubState();
      if (!state.canScrub) {
        setIsScrollLocked(false);
        return;
      }

      const startY = touchStartYRef.current;
      const currentY = touch.clientY;
      if (startY == null) return;

      const swipeDirection = startY - currentY; // positive = scrolling down

      // If animation completed and user is swiping down, don't re-lock
      if (hasCompletedRef.current && swipeDirection > 0) {
        setIsScrollLocked(false);
        return;
      }

      // If swiping up, allow re-entering the animation
      if (
        hasCompletedRef.current &&
        swipeDirection < 0 &&
        progressRef.current >= 1
      ) {
        hasCompletedRef.current = false;
      }

      const delta = swipeDirection * 0.0024;
      const next = Math.max(0, Math.min(1, progressRef.current + delta));

      if (next !== progressRef.current) {
        e.preventDefault();
        touchStartYRef.current = currentY;
        applyProgress(next);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      setIsScrollLocked(false);
    };
  }, [getScrubState, applyProgress]);

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 640) return;

    document.body.style.overflow = isScrollLocked ? 'hidden' : '';
    document.body.style.touchAction = isScrollLocked ? 'none' : '';

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isScrollLocked]);

  useEffect(() => {
    if (mobileIndex === displayedMobileIndex) return;

    setIsMobileSwitching(true);
    const timeout = window.setTimeout(() => {
      setDisplayedMobileIndex(mobileIndex);
      setIsMobileSwitching(false);
    }, 160);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [mobileIndex, displayedMobileIndex]);

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

  const floatStep = progress * maxStep;
  const activeIndex = Math.min(maxStep, Math.floor(floatStep + 0.98));
  const desktopState = STATES[displayedDesktopIndex];
  const mobileState = STATES[displayedMobileIndex];

  useEffect(() => {
    if (activeIndex === displayedDesktopIndex) return;

    setIsDesktopSwitching(true);
    const timeout = window.setTimeout(() => {
      setDisplayedDesktopIndex(activeIndex);
      setIsDesktopSwitching(false);
    }, 170);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeIndex, displayedDesktopIndex]);

  const tabTranslatePx = useMemo(() => {
    const TAB_WIDTH = 188;
    const TAB_GAP = 18;
    return -(floatStep * (TAB_WIDTH + TAB_GAP));
  }, [floatStep]);

  return (
    <section className="flex flex-col items-center pt-[clamp(1.5rem,3vw,2.5rem)] pb-[clamp(3.5rem,10vw,7.5rem)]">
      <div className="flex w-full max-w-210 flex-col items-center gap-3.75 pt-[2.5px] text-center">
        <SectionHeader
          badgeIcon="/assets/icons/confirmation.svg"
          badgeText="Uncensored Expression"
          title="Freedom to Speak Without Control"
          subtitle="Sealed empowers users to communicate openly and securely without censorship, surveillance, or external interference"
        />
      </div>

      <div
        ref={scrubAreaRef}
        className="mt-12 hidden h-[100vh] w-full max-w-400 md:block"
      >
        <div className="sticky top-0 flex h-screen items-start pt-2">
          <div className="w-full">
            <div className="relative overflow-hidden">
              <div
                className="flex gap-4.5"
                style={{ transform: `translateX(${tabTranslatePx}px)` }}
              >
                {STATES.map((state, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      type="button"
                      key={state.id}
                      onClick={() => setSlideByIndex(index)}
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
                        src={state.iconSrc}
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
                        {state.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div
              ref={desktopSlideContentRef}
              className="mt-8 grid grid-cols-12 gap-[clamp(1.5rem,3vw,3rem)]"
            >
              <div
                className={`col-span-5 pt-6 transform transition-all duration-300 ${
                  isDesktopSwitching
                    ? 'translate-y-2 opacity-0'
                    : 'translate-y-0 opacity-100'
                }`}
              >
                <h3 className="max-w-137.5 font-lexend text-[clamp(2rem,2.6vw,2.25rem)] font-semibold leading-[1.05] text-white">
                  {desktopState.title}
                </h3>
                <p className="mt-4 max-w-140 text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.6] text-[#b3b3b3]">
                  {desktopState.description}
                </p>
              </div>

              <div
                className={`col-span-7 self-start rounded-3xl bg-[linear-gradient(93.5866deg,rgba(107,250,214,1)_18.598%,rgba(202,115,68,1)_96.15%)] p-px transform transition-all duration-300 bg-[#060808] ${
                  isDesktopSwitching
                    ? 'translate-y-2 opacity-0'
                    : 'translate-y-0 opacity-100'
                }`}
              >
                <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)]  ">
                  <div className="relative aspect-video w-full max-h-125 min-h-72 overflow-hidden px-6 md:px-8 lg:px-12 bg-[#060808]">
                    <Image
                      src={desktopState.visualSrc}
                      alt={desktopState.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 58vw"
                      className={
                        desktopState.visualSrc ==
                        '/assets/section_three/visual_four.png'
                          ? 'object-cover object-bottom'
                          : 'object-contain object-bottom'
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop CTA - inside sticky container */}
            <div ref={ctaRef} className="mt-48">
              <CTASection />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full max-w-210 md:hidden">
        <div className="overflow-x-auto pb-1 touch-pan-x [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div ref={mobileTabsRef} className="flex min-w-max gap-4.5">
            {STATES.map((state, index) => {
              const isActive = index === mobileIndex;

              return (
                <button
                  type="button"
                  key={state.id}
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
                    src={state.iconSrc}
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
                    {state.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`mt-8 transform transition-all duration-300 ${
            isMobileSwitching
              ? 'translate-y-2 opacity-0'
              : 'translate-y-0 opacity-100'
          }`}
        >
          <h3 className="max-w-137.5 font-lexend text-[clamp(2rem,2.6vw,2.25rem)] font-semibold leading-[1.05] text-white">
            {mobileState.title}
          </h3>
          <p className="mt-4 max-w-140 text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.6] text-[#b3b3b3]">
            {mobileState.description}
          </p>

          <div className="mt-6 rounded-3xl bg-[linear-gradient(93.5866deg,rgba(107,250,214,1)_18.598%,rgba(202,115,68,1)_96.15%)] p-px ">
            <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#060808]">
              <div className="relative aspect-16/10 w-full overflow-hidden">
                <Image
                  src={mobileState.visualSrc}
                  alt={mobileState.title}
                  fill
                  sizes="100vw"
                  className={'object-cover object-bottom'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="mt-24 w-full md:hidden">
        <CTASection />
      </div>
    </section>
  );
}
