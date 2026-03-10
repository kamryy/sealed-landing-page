import Image from 'next/image';

const FOOTER_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Careers', href: '/careers' },
  { label: 'About', href: '/about' },
  { label: 'Security', href: '/security' },
];

function XIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
        fill="#0a0a0a"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-10 py-0 mt-60">
      <a href="#" className="flex items-center gap-2.25">
        <Image
          src="/assets/sealed-logo.svg"
          alt="Sealed"
          width={39}
          height={40}
        />
        <span className="text-2xl font-bold tracking-[1.09px] text-white">
          Sealed
        </span>
      </a>

      <nav className="flex flex-wrap items-center justify-center gap-6.5">
        {FOOTER_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="font-lexend text-lg text-[#d6d6d6] transition-colors hover:text-white"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Divider */}
      <div className="h-px w-full bg-[#b3b3b3] opacity-20" />

      {/* Bottom bar */}
      <div className="relative flex w-full flex-col items-center gap-6 rounded-full border border-[#262626] bg-[#1a1a1a] px-4 py-4 sm:flex-row sm:justify-between sm:pr-7.5">
        {/* Social icons */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            aria-label="Facebook"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-sealed-teal transition-opacity hover:opacity-80"
          >
            <Image
              src="/assets/footer/social-icons/Sealed - LP/facebook.svg"
              alt=""
              width={15}
              height={15}
            />
          </a>
          <a
            href="#"
            aria-label="X (Twitter)"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-sealed-teal transition-opacity hover:opacity-80"
          >
            <XIcon />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-sealed-teal transition-opacity hover:opacity-80"
          >
            <Image
              src="/assets/footer/social-icons/Sealed - LP/in.svg"
              alt=""
              width={15}
              height={15}
            />
          </a>
        </div>

        {/* Copyright */}
        <p className="font-lexend text-xs font-light text-[#b3b3b3] sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:text-sm">
          Sealed All Rights Reserved
        </p>

        {/* Legal links */}
        <div className="flex items-center gap-3">
          <a
            href="/privacy-policy"
            className="font-lexend text-xs font-light text-[#b3b3b3] transition-colors hover:text-white sm:text-sm"
          >
            Privacy Policy
          </a>
          <span className="h-4 w-px bg-[#b3b3b3]" aria-hidden="true" />
          <a
            href="/terms-of-service"
            className="font-lexend text-xs font-light text-[#b3b3b3] transition-colors hover:text-white sm:text-sm"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
