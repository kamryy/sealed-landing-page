'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import GradientBadge from './GradientBadge';

export default function WhiteListSection() {
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState('');
  const [nickname, setNickname] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
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

    if (!acceptTerms) {
      setErrorMessage('Please accept the terms before submitting.');
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
      setAcceptTerms(false);
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

      <div className="relative mx-auto   w-[80%]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-10 z-0 rounded-[3rem] bg-[radial-gradient(circle_at_50%_55%,rgba(107,250,214,0.34)_0%,rgba(107,250,214,0.18)_35%,rgba(107,250,214,0.04)_60%,rgba(107,250,214,0)_78%)] blur-2xl animate-[sealedHaloPulse_4.2s_ease-in-out_infinite]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 z-1 rounded-4xl bg-[radial-gradient(circle_at_50%_50%,rgba(107,250,214,0.42)_0%,rgba(107,250,214,0.24)_34%,rgba(107,250,214,0.08)_62%,rgba(107,250,214,0)_82%)] blur-3xl animate-[sealedHaloPulse_3.8s_ease-in-out_infinite]"
        />

        <section className="relative z-10 overflow-hidden rounded-3xl px-4 py-8 sm:px-8 sm:py-12 lg:px-16 lg:py-16">
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
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 flex flex-col gap-8"
          >
            <div className="flex max-w-225 flex-col items-start gap-6 lg:gap-6.25">
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
                <h2 className="font-lexend text-[clamp(1rem,3vw,2rem)] font-bold leading-[0.95] text-white lg:max-w-225">
                  Be the first and sign up for the whitelist
                </h2>
                <p className="mt-3 max-w-250 font-dm-sans text-[clamp(0.7rem,1.4vw,1.4rem)] leading-[1.45] text-[#b3b3b3] lg:mt-3.125">
                  Description goes here: Simple step-by-step explanation or
                  diagram of how the messenger ensures security and anonymity.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-6">
              <div className="space-y-1">
                <label
                  htmlFor="white-list-email"
                  className="font-dm-sans text-base font-medium leading-5 text-white sm:text-lg"
                >
                  Email
                </label>
                <input
                  id="white-list-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Input Value"
                  className="h-10 w-full rounded-md border border-white bg-black/25 px-3 font-dm-sans text-sm leading-5 text-white outline-none transition-colors placeholder:text-[rgba(223,235,253,0.3)] focus:border-sealed-teal"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* <div className="space-y-1">
                <label
                  htmlFor="white-list-wallet"
                  className="font-dm-sans text-base font-medium leading-5 text-white sm:text-lg"
                >
                  Wallet (optional)
                </label>
                <input
                  id="white-list-wallet"
                  type="text"
                  value={wallet}
                  onChange={(event) => setWallet(event.target.value)}
                  placeholder="Input Value"
                  className="h-10 w-full rounded-md border border-white bg-black/25 px-3 font-dm-sans text-sm leading-5 text-white outline-none transition-colors placeholder:text-[rgba(223,235,253,0.3)] focus:border-sealed-teal"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="white-list-nickname"
                  className="font-dm-sans text-base font-medium leading-5 text-white sm:text-lg"
                >
                  Nickname (optional)
                </label>
                <input
                  id="white-list-nickname"
                  type="text"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  placeholder="Input Value"
                  className="h-10 w-full rounded-md border border-white bg-black/25 px-3 font-dm-sans text-sm leading-5 text-white outline-none transition-colors placeholder:text-[rgba(223,235,253,0.3)] focus:border-sealed-teal"
                  disabled={isSubmitting}
                />
              </div> */}

              <label className="inline-flex w-full items-center gap-2 pb-4">
                <span className="relative flex h-4 w-4 items-center justify-center overflow-hidden rounded-[3px] border border-white bg-[rgba(13,13,13,0.5)]">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(event) => setAcceptTerms(event.target.checked)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    disabled={isSubmitting}
                  />
                  {acceptTerms ? (
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
                  ) : null}
                </span>
                <span className="font-dm-sans text-base font-medium leading-5 text-white sm:text-lg">
                  I accept the Terms
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-fit items-center justify-center rounded-[12.5px] bg-sealed-teal px-[18.75px] py-[8.5px] font-lexend text-md font-medium leading-[31.25px] text-black transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>

              {successMessage ? (
                <p className="font-dm-sans text-sm text-sealed-teal">
                  {successMessage}
                </p>
              ) : null}

              {errorMessage ? (
                <p className="font-dm-sans text-sm text-red-300">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
