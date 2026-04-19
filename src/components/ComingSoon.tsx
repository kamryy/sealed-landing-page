import Image from 'next/image';
import Link from 'next/link';

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
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

      {/* Ambient teal glow blobs — same style as main landing page */}
      <div
        className="pointer-events-none absolute -left-34 top-8 h-[clamp(22rem,45vw,40rem)] w-[clamp(8rem,18vw,17.5rem)] -rotate-20 rounded-full bg-sealed-teal/45 blur-[70px]"
        style={{ animation: 'sealedLightPulse 8s ease-in-out infinite' }}
      />
      <div
        className="pointer-events-none absolute -left-2 top-50 h-[clamp(20rem,42vw,40rem)] w-[clamp(2rem,4vw,2.75rem)] -rotate-45 rounded-full bg-sealed-teal/45 blur-[30px]"
        style={{ animation: 'sealedLightPulse 10s ease-in-out infinite 2s' }}
      />

      <div className="relative z-10 flex w-full flex-col items-center gap-6">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/assets/sealed-logo.svg"
            alt="Sealed"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <span className="text-3xl font-medium text-white md:text-4xl">
            Sealed
          </span>
        </Link>

        <h1 className="mt-6 text-center font-lexend text-[clamp(2rem,5vw,3rem)] font-bold text-white">
          {title}
        </h1>

        <p className="mt-2 text-center text-xl font-medium text-sealed-teal md:text-2xl">
          Coming Soon
        </p>

        <p className="mt-4 max-w-md text-center font-dm-sans text-base leading-relaxed text-[#b3b3b3] md:text-lg">
          We&apos;re working on this page. Check back soon for updates.
        </p>

        <Link
          href="/"
          className="mt-8 rounded-xl bg-sealed-teal px-6 py-3 font-lexend text-base font-semibold text-black transition-transform duration-200 hover:scale-[1.02]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
