'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';

export default function DevComingSoonGate() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [password, setPassword] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockErrorMessage, setUnlockErrorMessage] = useState('');

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
        body: JSON.stringify({ email }),
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

      setSuccessMessage(data.message || "🎉 You're on the list!");
      setEmail('');
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setUnlockErrorMessage('');

    if (!password) {
      setUnlockErrorMessage('Please enter the password.');
      return;
    }

    try {
      setIsUnlocking(true);

      const response = await fetch('/api/dev-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        setUnlockErrorMessage(data.error || 'Incorrect password.');
        return;
      }

      window.location.reload();
    } catch {
      setUnlockErrorMessage('Unable to unlock right now.');
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-26 pt-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/background.png')" }}
      />
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat blur-2xl"
        style={{
          backgroundImage: "url('/assets/background.png')",
          opacity: 0.45,
        }}
      />
      <div className="absolute inset-0 bg-[rgba(6,9,8,0.65)] backdrop-blur-sm" />

      <div className="relative z-10 flex w-full flex-col items-center gap-6">
        <h1
          className="flex flex-nowrap items-center gap-4 whitespace-nowrap text-[clamp(2.4rem,8vw,4.75rem)] font-medium text-white md:gap-6"
          style={{
            textShadow: '0px 4px 7.4px rgba(251,251,251,0.33)',
          }}
        >
          <span>Keep it </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 120 120"
            className="h-[1.2em] w-[1.2em] shrink-0"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M52.3082 0.245538C63.0572 -0.751089 73.8681 1.29913 83.5124 6.16081L83.7403 6.27666L83.7445 6.27868C112.098 20.7642 123.378 55.5972 108.978 84.0669C95.3052 111.099 62.7781 122.538 35.3099 111.277L10.4524 119.68L27.3341 89.7793H9.58543C4.35304 81.8393 1.13578 72.7082 0.247669 63.188L0.246328 63.1779C-2.66838 31.3724 20.6188 3.19537 52.3063 0.245538H52.3082ZM66.0651 57.4533L57.1243 73.6179H36.2749L27.3334 89.7813H71.8143C80.7025 89.7813 87.9077 82.5448 87.9084 73.6179C87.9084 64.6906 80.7032 57.4533 71.8143 57.4533H66.0651ZM43.4272 25.1257C34.5389 25.1258 27.3335 32.3624 27.3334 41.2895C27.3336 50.2163 34.539 57.4531 43.4272 57.4533H48.2305L57.1719 41.2895H78.9673L87.9084 25.1257H43.4272Z"
              fill="#6BFAD6"
            />
          </svg>
          <span> Sealed</span>
        </h1>

        <p className="mt-4 text-3xl font-medium text-white md:text-4xl lg:text-[48px]">
          Coming Soon
        </p>

        <div className="mt-10 flex w-full max-w-209.5 flex-col items-center gap-8 rounded-4xl border border-white/25 bg-white/0 px-6 py-8 shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <Image
            src="/assets/early-access-badge.png"
            alt="Join the Early Access List"
            width={330}
            height={53}
            className="h-auto w-70 md:w-82.5"
          />

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-6"
          >
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Type your email here...."
              className="w-70 bg-transparent px-2 py-2 text-center text-lg font-light text-white/70 placeholder-white/50 outline-none md:w-87.5"
              disabled={isSubmitting}
              required
            />
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-sealed-teal-70 px-8 py-2.5 text-base font-semibold text-white transition-all hover:bg-[rgba(107,250,214,0.9)] hover:shadow-[0_0_20px_rgba(107,250,214,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Submit'}
            </button>

            {successMessage ? (
              <p className="text-center text-sm text-[rgba(107,250,214,0.95)]">
                {successMessage}
              </p>
            ) : null}

            {errorMessage ? (
              <p className="text-center text-sm text-red-300">{errorMessage}</p>
            ) : null}
          </form>
        </div>
      </div>

      <footer className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[rgba(6,9,8,0.55)] px-4 py-4 backdrop-blur-xl">
        <form
          onSubmit={handleUnlock}
          className="mx-auto flex w-full max-w-240 flex-col items-center gap-3 md:flex-row md:justify-center"
        >
          <input
            type="password"
            name="dev-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Developer password"
            className="w-full max-w-100 rounded-xl border border-white/15 bg-black/30 px-4 py-2 text-center text-base text-white placeholder-white/45 outline-none focus:border-sealed-teal/70 md:text-left"
            disabled={isUnlocking}
            required
          />
          <button
            type="submit"
            className="w-full max-w-52 cursor-pointer rounded-xl border border-sealed-teal/50 bg-black/40 px-6 py-2.5 text-sm font-semibold text-sealed-teal transition-colors hover:bg-sealed-teal/15 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            disabled={isUnlocking}
          >
            {isUnlocking ? 'Unlocking...' : 'Open Full Landing'}
          </button>
        </form>

        {unlockErrorMessage ? (
          <p className="mt-2 text-center text-sm text-red-300">
            {unlockErrorMessage}
          </p>
        ) : null}
      </footer>
    </main>
  );
}
