'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import GradientBadge from './GradientBadge';

export default function WhiteListSection() {
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState('');
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, wallet, nickname }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setErrorMessage(
          data.error || 'Failed to join waitlist. Please try again.'
        );
        return;
      }

      setSuccessMessage(data.message || 'You have been subscribed!');
      setEmail('');
      setWallet('');
      setNickname('');
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-14 left-1/2 -z-10 w-screen -translate-x-1/2 bg-no-repeat opacity-35"
        style={{
          backgroundImage: "url('/assets/whitelist/bg.png')",
          backgroundSize: 'auto 120%',
          backgroundPosition: 'center top',
        }}
      />

      <div className="relative mx-auto   w-[92%] sm:w-[87%] lg:w-[82%]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-10 z-0 rounded-[3rem] bg-[radial-gradient(circle_at_50%_55%,rgba(107,250,214,0.34)_0%,rgba(107,250,214,0.18)_35%,rgba(107,250,214,0.04)_60%,rgba(107,250,214,0)_78%)] blur-2xl animate-[sealedHaloPulse_4.2s_ease-in-out_infinite]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 z-1 rounded-4xl bg-[radial-gradient(circle_at_50%_50%,rgba(107,250,214,0.42)_0%,rgba(107,250,214,0.24)_34%,rgba(107,250,214,0.08)_62%,rgba(107,250,214,0)_82%)] blur-3xl animate-[sealedHaloPulse_3.8s_ease-in-out_infinite]"
        />

        <section className="relative z-10 overflow-hidden rounded-[28px] border border-white/10 px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute inset-0 bg-[#000000]" />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(266deg, #0d0d0d 40.67%, rgba(16, 16, 16, 0) 99.81%), linear-gradient(90deg, #0d0d0d 0%, #0f0f0f 100%)',
              }}
            />
            {/* Subtle corner highlight */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 15% 0%, rgba(107,250,214,0.12) 0%, transparent 45%), radial-gradient(circle at 100% 100%, rgba(107,250,214,0.08) 0%, transparent 55%)',
              }}
            />
            {/* Fine grid texture */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                maskImage:
                  'radial-gradient(circle at center, black 0%, transparent 80%)',
                WebkitMaskImage:
                  'radial-gradient(circle at center, black 0%, transparent 80%)',
              }}
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16"
          >
            {/* Left: copy */}
            <div className="flex flex-col items-start gap-6 lg:gap-7">
              <GradientBadge>
                <Image
                  src="/assets/icons/check-circle.svg"
                  alt=""
                  width={24}
                  height={24}
                />
                <p className="font-lexend text-[clamp(0.95rem,1.4vw,1.125rem)] font-light leading-[1.35] text-white">
                  Join the Early Access List
                </p>
              </GradientBadge>

              <div className="w-full">
                <h2 className="font-lexend text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.02] text-white">
                  Be the first to experience{' '}
                  <span className="bg-[linear-gradient(93deg,#6bfad6_18%,#ca7344_96%)] bg-clip-text text-transparent">
                    sealed privacy
                  </span>
                </h2>
                <p className="mt-4 max-w-xl font-dm-sans text-[clamp(0.95rem,1.15vw,1.125rem)] leading-[1.55] text-white/60">
                  Reserve your spot on the whitelist and get priority access the
                  moment we launch. No spam, no tracking — just an early
                  invitation.
                </p>
              </div>

              {/* Perk list */}
              <ul className="mt-1 flex flex-col gap-3 text-white/80">
                {[
                  'Priority access at launch',
                  'Exclusive early-supporter perks',
                  'Shape the roadmap with direct feedback',
                ].map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-3 font-dm-sans text-sm sm:text-base"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sealed-teal/15 ring-1 ring-sealed-teal/40">
                      <svg
                        viewBox="0 0 16 16"
                        className="h-3 w-3 text-sealed-teal"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3.5 8.5L6.5 11.5L12.5 4.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form panel */}
            <div className="relative">
              {/* Teal accent glow behind the panel */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-2 -z-10 rounded-[26px] bg-[radial-gradient(circle_at_50%_50%,rgba(107,250,214,0.1),transparent_70%)] blur-2xl"
              />

              <div className="rounded-[22px] border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-7">
                <div className="flex flex-col gap-5">
                  {/* Floating-label email field */}
                  <div className="group relative">
                    <input
                      id="white-list-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder=" "
                      className="peer h-14 w-full rounded-xl border border-white/15 bg-black/40 px-4 pt-5 pb-1.5 font-dm-sans text-[15px] leading-5 text-white outline-none transition-all placeholder:text-transparent focus:border-sealed-teal focus:shadow-[0_0_0_4px_rgba(107,250,214,0.12)]"
                      disabled={isSubmitting}
                      required
                    />
                    <label
                      htmlFor="white-list-email"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-dm-sans text-sm text-white/45 transition-all duration-150 peer-focus:top-3 peer-focus:text-[11px] peer-focus:text-sealed-teal peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-white/70"
                    >
                      Your email address
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative mt-1 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-sealed-teal px-6 py-3.5 font-lexend text-base font-semibold text-black shadow-[0_10px_30px_rgba(107,250,214,0.25)] transition-all hover:shadow-[0_14px_40px_rgba(107,250,214,0.45)] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? 'Reserving your spot…' : 'Join the whitelist'}
                    </span>
                    {!isSubmitting && (
                      <svg
                        aria-hidden
                        viewBox="0 0 20 20"
                        className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                      >
                        <path
                          d="M4 10h12m0 0l-4-4m4 4l-4 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {/* Shimmer sweep on hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                  </button>

                  {successMessage ? (
                    <div className="flex items-center gap-2 rounded-lg border border-sealed-teal/30 bg-sealed-teal/10 px-3 py-2.5">
                      <svg
                        viewBox="0 0 16 16"
                        className="h-4 w-4 shrink-0 text-sealed-teal"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3.5 8.5L6.5 11.5L12.5 4.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="font-dm-sans text-sm text-sealed-teal">
                        {successMessage}
                      </p>
                    </div>
                  ) : null}

                  {errorMessage ? (
                    <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2.5">
                      <p className="font-dm-sans text-sm text-red-300">
                        {errorMessage}
                      </p>
                    </div>
                  ) : null}

                  <p className="mt-1 font-dm-sans text-xs text-white/35">
                    We'll only email you about the launch. No spam, ever.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
