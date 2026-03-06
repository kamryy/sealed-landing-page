'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function CTASection() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let angle = 0;
    let animationId: number;

    const animate = () => {
      angle = (angle + 0.5) % 360;
      if (glowRef.current) {
        glowRef.current.style.background = `conic-gradient(
          from ${angle}deg,
          #00d4aa,
          #22d3ee,
          #8b5cf6,
          #d946ef,
          #f97316,
          #eab308,
          #22c55e,
          #00d4aa
        )`;
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative">
      {/* Animated Rainbow Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 z-0"
      >
        <div
          ref={glowRef}
          className="h-full w-full"
          style={{
            filter: 'blur(80px)',
            opacity: 0.3,
          }}
        />
      </div>

      <section className="relative z-10 overflow-hidden rounded-[20px] border-1 border-white/5 px-5 py-9 sm:px-12 lg:px-20 lg:py-20">
        {/* Background layers */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[20px]"
        >
          {/* Base dark background */}
          <div className="absolute inset-0 rounded-[20px] bg-[#000000]" />
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 rounded-[20px] opacity-20 mix-blend-screen"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />
          {/* Gradient overlay from right */}
          <div
            className="absolute inset-0 rounded-[20px]"
            style={{
              backgroundImage:
                'linear-gradient(257deg, rgb(20, 20, 20) 40.67%, rgba(28, 28, 28, 0) 99.81%)',
            }}
          />
        </div>

        {/* Abstract design - rotated dot pattern in top-left */}
        <div className="pointer-events-none absolute -left-8 -top-8 h-[298px] w-[283px] -rotate-90 opacity-60 sm:-left-4 sm:-top-4">
          <Image
            src="/assets/abstract_design.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-[150px]">
          {/* Text Container */}
          <div className="flex w-full flex-1 flex-col gap-3.5 lg:items-start">
            <h2 className="w-full text-center font-lexend text-[32px] font-medium leading-[1.2] text-white lg:text-left lg:text-[clamp(1.75rem,4vw,2.5rem)] lg:font-normal lg:leading-[1.5]">
              Early Access Starts with the Whitelist
            </h2>
            <p className="w-full font-dm-sans text-base leading-[1.5] text-[#b3b3b3] lg:max-w-[747px] lg:text-[clamp(1rem,1.5vw,1.25rem)]">
              Sign up for the whitelist to secure early access and be among the
              first to experience a new standard of private communication.
            </p>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            className="w-full shrink-0 rounded-[12.5px] bg-sealed-teal px-[18.75px] py-[12.5px] font-lexend text-lg font-semibold leading-[31.25px] text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-sealed-teal/20 lg:w-auto"
          >
            Sign up
          </button>
        </div>
      </section>
    </div>
  );
}
