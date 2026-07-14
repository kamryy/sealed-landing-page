import Image from "next/image";

import {
  ReceiverChatPreview,
  SenderChatPreview,
} from "@/components/ui/ChatPreview";
import GradientBadge from "@/components/ui/GradientBadge";

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
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.86 3.22a11.4 11.4 0 0 0-9.84 0L5.22 5.92a.38.38 0 1 0-.66.38L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52ZM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
            </svg>
            Download (APK)
          </a>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.sunship.sealed"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black px-3.5 py-2 transition-all duration-200 hover:scale-[1.03] cursor-pointer"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3.6 2.2a1.5 1.5 0 0 0-.6 1.2v17.2a1.5 1.5 0 0 0 .6 1.2l.1.1L13.4 12 3.7 2.1l-.1.1Z"
                    fill="#00D3FF"
                  />
                  <path
                    d="M17 15.6 13.4 12l3.6-3.6 4.3 2.4c1.2.7 1.2 1.8 0 2.5L17 15.6Z"
                    fill="#FFCE00"
                  />
                  <path
                    d="m17 15.6-3.6-3.6-9.8 9.9c.4.4 1.1.5 1.8.1L17 15.6Z"
                    fill="#FF3B44"
                  />
                  <path
                    d="M5.4 1.9 17 8.4l-3.6 3.6L3.6 2.2c.5-.5 1.2-.5 1.8-.3Z"
                    fill="#00F076"
                  />
                </svg>
                <span className="flex flex-col text-left leading-none text-white">
                  <span className="text-[9px] font-normal tracking-wide text-white/80">
                    Get it on
                  </span>
                  <span className="-mt-0.5 text-base font-semibold">
                    Google Play
                  </span>
                </span>
              </a>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black px-3.5 py-2 opacity-55 transition-all duration-200">
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
            <span className="text-sm font-medium text-white/60 mr-6">
              coming soon
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-0 mx-auto min-w-0 h-[clamp(34rem,60vw,42rem)] w-full max-w-[clamp(20rem,72vw,38rem)] overflow-visible">
        {/* Globe pulsing glow — locked to the globe container */}
        <div
          className="pointer-events-none absolute inset-0 z-[-1] m-auto h-[140%] translate-y-30 w-[160%] rounded-full opacity-0 -translate-x-5/12 lg:-translate-y-1/20 "
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(107,250,214,0.18) 0%, rgba(107,250,214,0.16) 30%, transparent 50%)",
            animation: "sealedGlobePulse 6s ease-in-out infinite",
          }}
        />
        {/* Globe core */}
        <div className="px-4">
          {" "}
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
              "radial-gradient(circle at 50% 50%, rgba(6,9,8,0.9) 0%, rgba(6,9,8,0.7) 40%, transparent 70%)",
          }}
        ></div>
      </div>
    </section>
  );
}
