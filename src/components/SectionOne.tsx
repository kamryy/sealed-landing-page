'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import GradientBadge from '@/components/GradientBadge';
import { SlideIcon } from '@/components/icons';
import {
  ARC_CENTER,
  BASE_TOP_ANGLE,
  ROTATIONS,
  SLIDES,
  STEP_ANGLE,
  STEP_COUNT,
} from '@/constants/slides';
import { useScrollScrub } from '@/hooks/useScrollScrub';
import { pointOnOrbit } from '@/lib/geometry';

/* ──────────────────────────────────────────────────────────────────── *
 *  Zero-Trace header (formerly its own section)
 * ──────────────────────────────────────────────────────────────────── */

function ZeroTraceHeader() {
  return (
    <div className="mt-[clamp(3.5rem,10vw,16rem)] flex w-full max-w-312.5 flex-col items-center gap-3.75 pt-[2.5px] text-center">
      <GradientBadge>
        <Image
          src="/assets/icons/confirmation.svg"
          alt=""
          width={24}
          height={24}
        />
        <p className="font-lexend text-[clamp(0.95rem,1.4vw,1.125rem)] font-light leading-[1.35] text-white">
          Zero-Trace Security
        </p>
      </GradientBadge>

      <h2 className="max-w-260 text-balance font-lexend text-[clamp(2rem,5.4vw,2.5rem)] font-bold leading-[1.06] text-white lg:max-w-none lg:text-[clamp(2.25rem,3vw,2.9rem)] mt-4">
        Completely secure, untraceable communication
      </h2>

      <p className="max-w-312.5 text-balance text-[clamp(1rem,2.2vw,1.25rem)] leading-[clamp(1.5rem,3vw,1.875rem)] text-[#b3b3b3]">
        Sealed solution ensures total privacy by enabling communication that
        cannot be monitored, tracked, or accessed by any third party.
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── *
 *  Serverless arc sub-components
 * ──────────────────────────────────────────────────────────────────── */

function MobileCardStack() {
  const [highlightedIndex, setHighlightedIndex] = useState(
    Math.floor(SLIDES.length / 2)
  );
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardBackground =
    'linear-gradient(208.737deg, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 0.2) 39.716%), linear-gradient(90deg, rgba(28, 28, 28, 0.2) 0%, rgba(28, 28, 28, 0.2) 100%)';

  useEffect(() => {
    let rafId = 0;

    const updateCenteredCard = () => {
      const viewportCenterY = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        if (!isVisible) return;

        const cardCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenterY - viewportCenterY);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestDistance < Number.POSITIVE_INFINITY) {
        setHighlightedIndex((prev) =>
          prev === closestIndex ? prev : closestIndex
        );
      }
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateCenteredCard();
      });
    };

    updateCenteredCard();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  return (
    <div className="relative z-10 w-full px-4 md:hidden">
      <div className="mx-auto flex w-full max-w-128.5 flex-col gap-5">
        {SLIDES.map((slide, index) => {
          const isHighlighted = index === highlightedIndex;
          return (
            <div
              key={`${slide.cardTitle}-${index}`}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className={`rounded-[15px] p-[1.25px] transition-[background-image] duration-200 ${
                isHighlighted
                  ? 'bg-[linear-gradient(93.5866deg,rgba(107,250,214,1)_18.598%,rgba(202,115,68,1)_96.15%)]'
                  : 'bg-transparent'
              }`}
            >
              <div
                className="flex flex-col items-center justify-center gap-2.5 rounded-[calc(15px-1.25px)] bg-[#060808] p-5 text-center shadow-[0_1.25px_2.5px_rgba(0,0,0,0.05)]"
                style={{ backgroundImage: cardBackground }}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors duration-200 ${
                    isHighlighted
                      ? 'border-sealed-teal bg-[rgba(107,250,214,0.1)]'
                      : 'border-[#7c7c7c] bg-white/5'
                  }`}
                >
                  <SlideIcon
                    icon={slide.icon}
                    className={isHighlighted ? 'text-sealed-teal' : undefined}
                  />
                </div>

                <h3 className="font-lexend text-xl font-bold leading-10 text-white">
                  {slide.cardTitle}
                </h3>

                <p className="text-base leading-6.25 text-[#b3b3b3]">
                  {slide.cardDescription}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ArcDefs() {
  return (
    <defs>
      <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6bfad6" stopOpacity="0.8" />
        <stop offset="80%" stopColor="#6bfad6" stopOpacity="1" />
        <stop offset="100%" stopColor="#6bfad6" stopOpacity="0.3" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

function ArcPaths() {
  return (
    <>
      <path
        d="M 450 20 A 430 430 0 0 0 20 450"
        stroke="url(#arcGlow)"
        strokeWidth="1"
        fill="none"
        filter="url(#glow)"
      />
      <path
        d="M 450 20 A 430 430 0 0 1 880 450"
        stroke="#6bfad6"
        strokeWidth="1"
        strokeDasharray="8 8"
        strokeOpacity="0.3"
        fill="none"
      />
      <path
        d="M 880 450 A 430 430 0 0 1 450 880"
        stroke="#6bfad6"
        strokeWidth="1"
        strokeDasharray="8 8"
        strokeOpacity="0.15"
        fill="none"
      />
      <path
        d="M 20 450 A 430 430 0 0 0 450 880"
        stroke="url(#arcGlow)"
        strokeWidth="2"
        strokeOpacity="0.6"
        fill="none"
        filter="url(#glow)"
      />
    </>
  );
}

function OrbitDots({
  rotation,
  currentStep,
}: {
  rotation: number;
  currentStep: number;
}) {
  return (
    <>
      {Array.from({ length: STEP_COUNT }, (_, i) => {
        const orbitAngle = BASE_TOP_ANGLE + i * STEP_ANGLE - rotation;
        const pos = pointOnOrbit(orbitAngle);
        const isRight = pos.x > ARC_CENTER.x;
        const isActive = i === currentStep;
        const norm = ((orbitAngle % 360) + 360) % 360;
        const rightToTop = norm >= 270 ? (360 - norm) / 90 : 0;
        const fillOpacity = isRight ? rightToTop / 2 : 1;

        return (
          <circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r="10"
            fill="#6bfad6"
            fillOpacity={fillOpacity}
            stroke="#6bfad6"
            strokeWidth="1.5"
            strokeOpacity={0.9}
            filter={isActive ? 'url(#glow)' : undefined}
          />
        );
      })}
    </>
  );
}

function FeatureCard({
  step,
  cardRef,
}: {
  step: number;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const slide = SLIDES[step];

  return (
    <div
      ref={cardRef}
      className="absolute left-1/2 top-85 z-30 w-[92%] max-w-128.5 -translate-x-1/2 rounded-2xl bg-[#0f0f0f] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)] md:p-5 lg:w-full"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#7c7c7c] bg-white/5">
          <SlideIcon icon={slide.icon} />
        </div>
        <h3 className="min-h-8 font-lexend text-xl font-bold text-white transition-all duration-500">
          {slide.cardTitle}
        </h3>
        <p className="min-h-24 text-center text-base leading-relaxed text-[#b3b3b3] transition-all duration-500">
          {slide.cardDescription}
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── *
 *  SectionOne — Zero-Trace intro + Serverless arc carousel
 * ──────────────────────────────────────────────────────────────────── */

export default function SectionOne() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const arcContainerRef = useRef<HTMLDivElement | null>(null);
  const featureCardRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { currentStep, animatedRotation } = useScrollScrub(
    sectionRef,
    arcContainerRef,
    featureCardRef,
    isMobile
  );

  const slide = SLIDES[isMobile ? 0 : currentStep];
  const rotation = isMobile ? ROTATIONS[0] : animatedRotation;

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative flex flex-col items-center overflow-visible"
    >
      {/* Zero-Trace header */}
      <ZeroTraceHeader />

      {/* Serverless carousel */}
      <div className="mt-[clamp(2.5rem,4vw,4rem)] flex w-full flex-col items-center py-12 sm:py-16">
        {/* Mobile: static card */}
        <MobileCardStack />

        {/* Desktop: scroll-scrubbed arc */}
        <div className="hidden w-full md:block md:min-h-[105vh]">
          <div className="sticky top-0 flex h-screen w-full flex-col items-center overflow-visible pt-6">
            {/* Dot-grid background */}
            <div className="pointer-events-none absolute -top-20 left-1/2 z-0 h-230 w-230 -translate-x-1/2 rounded-full opacity-35">
              <div
                className="h-full w-full rounded-full"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(107,250,214,0.16) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  maskImage:
                    'radial-gradient(circle at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.25) 62%, transparent 78%)',
                  WebkitMaskImage:
                    'radial-gradient(circle at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.25) 62%, transparent 78%)',
                }}
              />
            </div>

            {/* Centre glow */}
            <div
              className="pointer-events-none absolute left-1/2 mt-80 md:mt-60 z-0 h-[clamp(16rem,34vw,28rem)] w-[clamp(20rem,48vw,34rem)] -translate-x-1/2 rounded-full bg-sealed-teal blur-3xl md:top-68 md:blur-[96px] lg:top-72"
              style={{ animation: 'sealedHaloPulse 5.5s ease-in-out infinite' }}
            />

            {/* Heading */}
            <div className="relative z-10 mb-8 flex min-h-37.5 flex-col items-center gap-2.5 px-4 text-center">
              <h2 className="font-lexend text-2xl font-bold text-white transition-all duration-500">
                {slide.heading}
              </h2>
              <p className="min-h-18 max-w-md text-base text-[#b3b3b3] transition-all duration-500">
                {slide.subheading}
              </p>
            </div>

            {/* Arc container */}
            <div
              ref={arcContainerRef}
              className="relative z-10 mx-auto h-95 w-full max-w-250 md:h-112.5 lg:h-125"
            >
              {/* Bottom fade overlay */}
              <div className="pointer-events-none absolute left-1/2 top-full z-20 h-[120%] w-screen -translate-x-1/2">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(6,9,8,0.00) 0%,rgba(6,9,8,0.97) 15%,  rgba(6,9,8,1) 60%, rgba(6,9,8,0.7) 80%, transparent 90%)',
                  }}
                />
              </div>

              {/* Dashed vertical line */}
              <div className="absolute -top-14 left-1/2 h-32 w-px -translate-x-1/2 md:-top-20 md:h-44 lg:-top-23 lg:h-47.5">
                <span className="absolute left-1/2 top-10 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sealed-teal shadow-[0_0_10px_rgba(107,250,214,0.9)]" />
                <svg
                  width="25"
                  height="100%"
                  viewBox="0 0 2 190"
                  fill="none"
                  className="h-full w-full"
                >
                  <line
                    x1="1"
                    y1="-20"
                    x2="1"
                    y2="190"
                    stroke="#6bfad6"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    strokeOpacity="0.5"
                  />
                </svg>
              </div>

              {/* Arc SVG */}
              <div className="absolute left-1/2 top-8 h-200 w-225 origin-top -translate-x-1/2 scale-[0.7] transition-transform duration-1000 ease-in-out md:top-10 sm:scale-[0.6] md:scale-[0.86] lg:top-12 lg:scale-100">
                <svg
                  viewBox="0 0 900 900"
                  fill="none"
                  className="h-full w-full"
                  style={{ overflow: 'visible' }}
                >
                  <ArcDefs />
                  <ArcPaths />
                  <OrbitDots rotation={rotation} currentStep={currentStep} />
                </svg>
              </div>

              <FeatureCard step={currentStep} cardRef={featureCardRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
