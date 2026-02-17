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
      <div className="absolute inset-0 backdrop-blur-[9.35px] bg-[rgba(0,75,58,0.08)]" />

      {/* Decorative glow elements */}
      <div className="absolute top-[-100px] left-[10%] h-[400px] w-[400px] rounded-full bg-[rgba(107,250,214,0.08)] blur-[120px]" />
      <div className="absolute bottom-[20%] right-[5%] h-[300px] w-[300px] rounded-full bg-[rgba(107,250,214,0.05)] blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Keep it Sealed heading */}
        <div className="flex items-center gap-6">
          <h1
            className="text-5xl font-medium text-white md:text-7xl lg:text-[76px]"
            style={{
              textShadow: '0px 4px 7.4px rgba(251,251,251,0.33)',
            }}
          >
            Keep it
          </h1>
          <Image
            src="/assets/sealed-logo.svg"
            alt="Sealed Logo"
            width={412}
            height={120}
            className="h-[60px] w-auto md:h-[90px] lg:h-[120px]"
            priority
          />
        </div>

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
