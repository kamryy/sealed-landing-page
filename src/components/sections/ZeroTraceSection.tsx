'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import GradientBadge from '@/components/ui/GradientBadge';
import { SlideIcon } from '@/components/ui/icons';
import {
  ARC_CENTER,
  BASE_TOP_ANGLE,
  SLIDES,
  STEP_ANGLE,
  STEP_COUNT,
} from '@/constants/slides';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { pointOnOrbit } from '@/lib/geometry';

/* ──────────────────────────────────────────────────────────────────── *
 *  Zero-Trace header
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
 *  Mobile card stack
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
      rafId = 0;
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

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateCenteredCard);
    };

    updateCenteredCard();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div className="relative z-10 w-full px-4 [@media(min-width:768px)_and_(min-height:500px)]:hidden">
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

/* ──────────────────────────────────────────────────────────────────── *
 *  Arc SVG (static — rotation applied to a child <g> via ref)
 * ──────────────────────────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────────────────────────── *
 *  Desktop scrub scene — pinned via native `position: sticky`.
 *  Scroll progress drives transforms directly on the DOM; React only
 *  re-renders when the discrete step index changes.
 * ──────────────────────────────────────────────────────────────────── */

function DesktopScrubScene() {
  const scrubWrapperRef = useRef<HTMLDivElement | null>(null);
  const rotationGroupRef = useRef<SVGGElement | null>(null);
  const dotRefs = useRef<Array<SVGCircleElement | null>>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const totalTransitions = STEP_COUNT - 1;

  const applyDotOpacity = useCallback((rotation: number) => {
    for (let i = 0; i < STEP_COUNT; i++) {
      const dot = dotRefs.current[i];
      if (!dot) continue;
      const orbitAngle = BASE_TOP_ANGLE + i * STEP_ANGLE - rotation;
      const pos = pointOnOrbit(orbitAngle);
      const isRight = pos.x > ARC_CENTER.x;
      const norm = ((orbitAngle % 360) + 360) % 360;
      const rightToTop = norm >= 270 ? (360 - norm) / 90 : 0;
      const fillOpacity = isRight ? rightToTop / 2 : 1;
      dot.setAttribute('cx', String(pos.x));
      dot.setAttribute('cy', String(pos.y));
      dot.setAttribute('fill-opacity', String(fillOpacity));
    }
  }, []);

  useScrollProgress(scrubWrapperRef, (progress) => {
    const continuous = progress * totalTransitions;
    const rotation = continuous * STEP_ANGLE;

    // Apply rotation to the orbit dot positions (computed per-dot).
    applyDotOpacity(rotation);

    // Step index: whichever transition we're closest to.
    const idx = Math.min(totalTransitions, Math.round(continuous));
    setCurrentStep((prev) => (prev === idx ? prev : idx));
  });

  // Initial dot layout on mount.
  useEffect(() => {
    applyDotOpacity(0);
  }, [applyDotOpacity]);

  const slide = SLIDES[currentStep];

  return (
    <div
      ref={scrubWrapperRef}
      className="relative hidden w-full [@media(min-width:768px)_and_(min-height:500px)]:block md:h-[400vh]"
    >
      <div className="sticky top-[var(--nav-h)] flex h-[calc(100svh-var(--nav-h))] w-full flex-col items-center pt-[clamp(0.5rem,2vh,1.5rem)]">
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
          className="pointer-events-none absolute left-1/2 top-5/6 z-0 h-[clamp(16rem,34vw,28rem)] w-[clamp(20rem,48vw,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sealed-teal blur-3xl md:blur-[96px]"
          style={{ animation: 'sealedHaloPulse 5.5s ease-in-out infinite' }}
        />

        {/* Heading */}
        <div className="relative z-10 mb-[clamp(0.75rem,2vh,2rem)] flex min-h-[clamp(5rem,12vh,9.375rem)] flex-col items-center gap-2.5 px-4 text-center">
          <h2
            key={`h-${currentStep}`}
            className="font-lexend text-2xl font-bold text-white transition-opacity duration-300"
          >
            {slide.heading}
          </h2>
          <p
            key={`s-${currentStep}`}
            className="min-h-18 max-w-md text-base text-[#b3b3b3] transition-opacity duration-300"
          >
            {slide.subheading}
          </p>
        </div>

        {/* Arc container */}
        <div
          className="relative z-10 mx-auto w-full max-w-250"
          style={
            {
              // Available vertical space for the arc: viewport minus nav, heading block, and card.
              // Clamped so it stays sensible on very tall or very short viewports.
              ['--arc-size' as string]:
                'clamp(18rem, calc(100svh - var(--nav-h) - 18rem), 34rem)',
              height: 'var(--arc-size)',
            } as React.CSSProperties
          }
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
          <div className="absolute -top-[clamp(2rem,6vh,6rem)] left-1/2 h-[clamp(3rem,7vh,5.5rem)] w-px -translate-x-1/2 ">
            <span className="absolute left-1/2 top-[45%] z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sealed-teal shadow-[0_0_10px_rgba(107,250,214,0.9)]" />
            <svg
              width="25"
              height="100%"
              viewBox="0 20 2 50"
              preserveAspectRatio="none"
              fill="none"
              className="h-full w-full"
            >
              {/* Line starts at the dot center (~45% down) and stops before the arc (~95%) */}
              <line
                x1="1"
                y1="45"
                x2="1"
                y2="95"
                stroke="#6bfad6"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeOpacity="0.5"
              />
            </svg>
          </div>

          {/* Arc SVG — rendered taller than the visible container; only the top half-circle sits in view (bottom is covered by the fade overlay). */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 origin-top"
            style={{
              height: 'calc(var(--arc-size) * 1.6)',
              width: 'calc(var(--arc-size) * 1.8)',
            }}
          >
            <svg
              viewBox="0 0 900 900"
              fill="none"
              className="h-full w-full"
              style={{ overflow: 'visible' }}
            >
              <ArcDefs />
              <ArcPaths />
              <g ref={rotationGroupRef}>
                {Array.from({ length: STEP_COUNT }, (_, i) => (
                  <circle
                    key={i}
                    ref={(node) => {
                      dotRefs.current[i] = node;
                    }}
                    cx={ARC_CENTER.x}
                    cy={ARC_CENTER.y}
                    r="10"
                    fill="#6bfad6"
                    fillOpacity={1}
                    stroke="#6bfad6"
                    strokeWidth="1.5"
                    strokeOpacity={0.9}
                    filter={i === currentStep ? 'url(#glow)' : undefined}
                  />
                ))}
              </g>
            </svg>
          </div>

          {/* Feature card */}
          <div
            className="absolute left-1/2 z-30 w-[92%] max-w-128.5 -translate-x-1/2 rounded-2xl bg-[#0f0f0f] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)] md:p-5 lg:w-full"
            style={{ top: 'calc(var(--arc-size) * 0.68)' }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#7c7c7c] bg-white/5">
                <SlideIcon icon={slide.icon} />
              </div>
              <h3
                key={`ct-${currentStep}`}
                className="min-h-8 font-lexend text-xl font-bold text-white"
              >
                {slide.cardTitle}
              </h3>
              <p
                key={`cd-${currentStep}`}
                className="min-h-24 text-center text-base leading-relaxed text-[#b3b3b3]"
              >
                {slide.cardDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── *
 *  SectionOne — Zero-Trace intro + Serverless arc carousel
 * ──────────────────────────────────────────────────────────────────── */

export default function ZeroTraceSection() {
  return (
    <section
      id="features"
      className="relative flex flex-col items-center overflow-visible"
    >
      <ZeroTraceHeader />

      <div className="mt-[clamp(2.5rem,4vw,4rem)] flex w-full flex-col items-center py-12 sm:py-16">
        <MobileCardStack />
        <DesktopScrubScene />
      </div>
    </section>
  );
}
