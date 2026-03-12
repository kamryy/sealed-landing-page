import Image from 'next/image';

import {
  ReceiverChatPreview,
  SenderChatPreview,
} from '@/components/ChatPreview';
import GradientBadge from '@/components/GradientBadge';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="overflow-visible  relative grid items-center gap-10 pt-4 sm:pt-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
    >
      <div className="relative z-10 min-w-0 text-center sm:text-left lg:text-left px-6 lg:px-0">
        <div className="hidden sm:inline-flex">
          <GradientBadge>
            <Image
              src="/assets/icons/confirmation.svg"
              alt=""
              width={24}
              height={24}
            />
            Privacy Messaging
          </GradientBadge>
        </div>

        <h1 className="mt-4 text-[clamp(1.75rem,5.8vw,4rem)] font-medium leading-[1.12] text-white">
          Fully anonymous,
          <br />
          Multi-chain End-2-End
          <br />
          Messenger
        </h1>

        <p className="mt-5 max-w-155 text-lg leading-[1.6] text-[#e4e4e7] md:text-[20px]">
          The only fully anonymous messenger that enables the exchange of fully
          encrypted messages — for people who value the privacy of shared
          information in an era of widespread surveillance.
        </p>

        <a
          href="#whitelist"
          className="mt-10 flex w-full justify-center rounded-xl bg-sealed-teal px-6 py-3 text-lg font-semibold text-black transition-transform duration-200 hover:scale-[1.02] sm:inline-flex sm:w-auto"
        >
          Sign up
        </a>
      </div>

      <div className="relative z-0 mx-auto min-w-0 h-[clamp(24rem,60vw,36rem)] w-full max-w-[clamp(20rem,72vw,38rem)] overflow-visible">
        {/* Globe pulsing glow — locked to the globe container */}
        <div
          className="pointer-events-none absolute inset-0 z-[-1] m-auto h-[140%] translate-y-30 w-[160%] rounded-full opacity-0 -translate-x-5/12 lg:-translate-y-1/20 "
          style={{
            background:
              'radial-gradient(circle at 50% 40%, rgba(107,250,214,0.18) 0%, rgba(107,250,214,0.16) 30%, transparent 50%)',
            animation: 'sealedGlobePulse 6s ease-in-out infinite',
          }}
        />
        {/* Globe core */}
        <div className="px-4">
          {' '}
          <Image
            src="/assets/globe.png"
            alt=""
            fill
            className="z-0 object-contain  py-4 opacity-90"
            priority
          />
        </div>
        <SenderChatPreview />
        <ReceiverChatPreview />
        <div
          className="absolute -bottom-30 -right-50 z-10 h-[90%] w-[120%] overflow-visible rounded-full"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(6,9,8,0.9) 0%, rgba(6,9,8,0.7) 40%, transparent 70%)',
          }}
        ></div>
      </div>
    </section>
  );
}
