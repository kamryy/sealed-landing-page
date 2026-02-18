'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
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

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden ">
      {/* Background with blur effect */}
      <div className="absolute inset-0 backdrop-blur-[9.35px] bg-[rgba(0,12,9,0.16)]" />

      {/* Decorative glow elements */}
      <div className="absolute top-[-100px] left-[10%] h-[400px] w-[400px] rounded-full bg-[rgba(107,250,214,0.08)] blur-[120px]" />
      <div className="absolute bottom-[20%] right-[5%] h-[300px] w-[300px] rounded-full bg-[rgba(107,250,214,0.05)] blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Keep it Sealed heading */}
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

        {/* Coming Soon */}
        <p className="mt-4 text-3xl font-medium text-white md:text-4xl lg:text-[48px]">
          Coming Soon
        </p>

        {/* Email signup card */}
        <div className="mt-10 flex w-full max-w-[838px] flex-col items-center gap-8 rounded-[32px] border-2 border-[rgba(107,250,214,0.6)] bg-[rgba(4,4,4,0.7)] px-6 py-8 backdrop-blur-sm">
          {/* Early Access Badge */}
          <Image
            src="/assets/early-access-badge.png"
            alt="Join the Early Access List"
            width={330}
            height={53}
            className="h-auto w-[280px] md:w-[330px]"
          />

          {/* Email form */}
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
              className="w-[280px] bg-transparent px-2 py-2 text-center text-lg font-light text-white/70 placeholder-white/50 outline-none md:w-[350px]"
              disabled={isSubmitting}
              required
            />
            <button
              type="submit"
              className="cursor-pointer rounded-[12px] bg-[rgba(107,250,214,0.7)] px-8 py-2.5 text-base font-medium text-white transition-all hover:bg-[rgba(107,250,214,0.9)] hover:shadow-[0_0_20px_rgba(107,250,214,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
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
    </main>
  );
}
