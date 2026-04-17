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

function InstagramIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.08 4.08 0 011.47.958c.453.453.78.898.958 1.47.163.46.35 1.26.404 2.43.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.08 4.08 0 01-.958 1.47 4.08 4.08 0 01-1.47.958c-.46.163-1.26.35-2.43.404-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.08 4.08 0 01-1.47-.958 4.08 4.08 0 01-.958-1.47c-.163-.46-.35-1.26-.404-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.08 4.08 0 01.958-1.47 4.08 4.08 0 011.47-.958c.46-.163 1.26-.35 2.43-.404C8.416 2.175 8.796 2.163 12 2.163zM12 0C8.741 0 8.333.014 7.053.072 5.775.13 4.903.333 4.14.63a5.876 5.876 0 00-2.126 1.384A5.876 5.876 0 00.63 4.14C.333 4.903.13 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.058 1.278.261 2.15.558 2.913a5.876 5.876 0 001.384 2.126A5.876 5.876 0 004.14 23.37c.763.297 1.635.5 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.278-.058 2.15-.261 2.913-.558a5.876 5.876 0 002.126-1.384 5.876 5.876 0 001.384-2.126c.297-.763.5-1.635.558-2.913C23.986 15.667 24 15.259 24 12s-.014-3.667-.072-4.947c-.058-1.278-.261-2.15-.558-2.913a5.876 5.876 0 00-1.384-2.126A5.876 5.876 0 0019.86.63C19.097.333 18.225.13 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"
        fill="#0a0a0a"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
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
            href="https://x.com/sealedchannel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-sealed-teal transition-opacity hover:opacity-80"
          >
            <XIcon />
          </a>
          <a
            href="https://www.instagram.com/sealed.channel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-sealed-teal transition-opacity hover:opacity-80"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://www.linkedin.com/company/sealedchannel/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
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
          <a
            href="https://discord.gg/bYMqbEWby"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-sealed-teal transition-opacity hover:opacity-80"
          >
            <DiscordIcon />
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
