import Image from 'next/image';

import {
  ReceiverChatPreview,
  SenderChatPreview,
} from '@/components/ui/ChatPreview';
import GradientBadge from '@/components/ui/GradientBadge';

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
          End-2-End
          <br />
          Messenger
        </h1>

        <p className="mt-5 max-w-155 text-lg leading-[1.6] text-[#e4e4e7] md:text-[20px]">
          The only fully anonymous messenger that enables the exchange of fully
          encrypted messages — for people who value the privacy of shared
          information in an era of widespread surveillance.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <a
            href="/download/sealed-latest.apk"
            download
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sealed-teal px-6 py-3 text-lg font-semibold text-black transition-transform duration-200 hover:scale-[1.02] sm:inline-flex sm:w-auto"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 13 13"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M12.5 7.75V11.75C12.5 11.9489 12.421 12.1397 12.2803 12.2803C12.1397 12.421 11.9489 12.5 11.75 12.5H0.75C0.551088 12.5 0.360322 12.421 0.21967 12.2803C0.0790177 12.1397 0 11.9489 0 11.75V7.75C0 7.55109 0.0790177 7.36032 0.21967 7.21967C0.360322 7.07902 0.551088 7 0.75 7C0.948912 7 1.13968 7.07902 1.28033 7.21967C1.42098 7.36032 1.5 7.55109 1.5 7.75V11H11V7.75C11 7.55109 11.079 7.36032 11.2197 7.21967C11.3603 7.07902 11.5511 7 11.75 7C11.9489 7 12.1397 7.07902 12.2803 7.21967C12.421 7.36032 12.5 7.55109 12.5 7.75ZM5.71938 8.28063C5.78905 8.35054 5.87185 8.40602 5.96301 8.44388C6.05417 8.48173 6.15191 8.50122 6.25062 8.50122C6.34934 8.50122 6.44707 8.48173 6.53824 8.44388C6.6294 8.40602 6.7122 8.35054 6.78187 8.28063L9.28187 5.78062C9.42277 5.63973 9.50193 5.44863 9.50193 5.24937C9.50193 5.05012 9.42277 4.85902 9.28187 4.71812C9.14098 4.57723 8.94988 4.49807 8.75062 4.49807C8.55137 4.49807 8.36027 4.57723 8.21937 4.71812L7 5.9375V0.75C7 0.551088 6.92098 0.360322 6.78033 0.21967C6.63968 0.0790177 6.44891 0 6.25 0C6.05109 0 5.86032 0.0790177 5.71967 0.21967C5.57902 0.360322 5.5 0.551088 5.5 0.75V5.9375L4.28062 4.71938C4.21086 4.64961 4.12804 4.59427 4.03689 4.55651C3.94573 4.51876 3.84804 4.49932 3.74937 4.49932C3.55012 4.49932 3.35902 4.57848 3.21812 4.71938C3.14836 4.78914 3.09302 4.87196 3.05526 4.96311C3.01751 5.05427 2.99807 5.15196 2.99807 5.25063C2.99807 5.44988 3.07723 5.64098 3.21812 5.78188L5.71938 8.28063Z" />
            </svg>
            Download
          </a>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <a
              
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black px-3.5 py-2 transition-all duration-200 hover:scale-[1.03]"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M3.6 2.2a1.5 1.5 0 0 0-.6 1.2v17.2a1.5 1.5 0 0 0 .6 1.2l.1.1L13.4 12 3.7 2.1l-.1.1Z" fill="#00D3FF" />
                  <path d="M17 15.6 13.4 12l3.6-3.6 4.3 2.4c1.2.7 1.2 1.8 0 2.5L17 15.6Z" fill="#FFCE00" />
                  <path d="m17 15.6-3.6-3.6-9.8 9.9c.4.4 1.1.5 1.8.1L17 15.6Z" fill="#FF3B44" />
                  <path d="M5.4 1.9 17 8.4l-3.6 3.6L3.6 2.2c.5-.5 1.2-.5 1.8-.3Z" fill="#00F076" />
                </svg>
                <span className="flex flex-col text-left leading-none text-white">
                  <span className="text-[9px] font-normal uppercase tracking-wide text-white/80">
                    Get on
                  </span>
                  <span className="-mt-0.5 text-base font-semibold">
                    Google Play 
                  </span>
                </span>
              </a>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black px-3.5 py-2 opacity-55 transition-all duration-200 hover:scale-[1.03] hover:opacity-100">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#ffffff"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M17.05 12.04c-.03-2.4 1.96-3.55 2.05-3.61-1.12-1.64-2.86-1.86-3.48-1.89-1.48-.15-2.89.87-3.64.87-.75 0-1.91-.85-3.14-.83-1.62.02-3.11.94-3.94 2.39-1.68 2.92-.43 7.24 1.2 9.61.8 1.16 1.75 2.46 3 2.41 1.2-.05 1.66-.78 3.11-.78 1.45 0 1.86.78 3.13.75 1.29-.02 2.11-1.18 2.9-2.35.91-1.35 1.29-2.66 1.31-2.73-.03-.01-2.52-.97-2.55-3.84ZM14.63 4.97c.66-.81 1.11-1.92.99-3.04-.95.04-2.12.64-2.81 1.44-.62.71-1.16 1.86-1.02 2.95 1.07.08 2.17-.54 2.84-1.35Z" />
                </svg>
                <span className="flex flex-col text-left leading-none text-white">
                  <span className="text-[9px] font-normal text-white/80">
                    Download on the
                  </span>
                  <span className="-mt-0.5 text-base font-semibold">
                    App Store
                  </span>
                </span>
              </div>
            </div>
            <span className="text-sm font-medium text-white/60">
               coming soon
            </span>
          </div>
        </div>
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
