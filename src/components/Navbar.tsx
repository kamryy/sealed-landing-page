import Image from 'next/image';

import { NAV_LINKS } from '@/constants/navigation';

function NavLinks({ mobile = false }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <>
        {NAV_LINKS.map(({ label, href, isActive }) => (
          <a
            key={label}
            href={href}
            className={`block rounded-lg px-3 py-2 text-sm ${
              isActive
                ? 'bg-white/5 text-white'
                : 'text-white/80 hover:text-white'
            } ${isActive ? '' : 'mt-1'}`}
          >
            {label}
          </a>
        ))}

        <a
          href="#"
          className="mt-2 block rounded-lg bg-sealed-teal px-3 py-2 text-center text-sm font-semibold text-black"
        >
          Sign up
        </a>
      </>
    );
  }

  return (
    <ul className="hidden items-center gap-2 rounded-full p-1 text-sm text-white/80 lg:flex">
      {NAV_LINKS.map(({ label, href, isActive }) => (
        <li key={label}>
          <a
            href={href}
            className={`rounded-full px-4 py-2 transition-colors ${
              isActive ? 'bg-white/5 text-white' : 'hover:text-white'
            }`}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 -mx-5 border border-white/5 bg-[#262626]/30 px-8 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur-lg sm:px-12 lg:top-4 lg:mx-0 lg:rounded-full lg:px-5 lg:py-4">
      <nav className="flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <Image
            src="/assets/sealed-logo.svg"
            alt="Sealed"
            width={28}
            height={28}
            className="h-8 w-8"
          />
          <span className="text-2xl font-medium text-white">Sealed</span>
        </a>

        {/* Desktop links */}
        <NavLinks />

        {/* Desktop CTA */}
        <a
          href="#"
          className="hidden rounded-full bg-sealed-teal px-5 py-2.5 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.02] lg:inline-flex"
        >
          Sign up
        </a>

        {/* Mobile menu */}
        <details className="group relative lg:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg text-white [&::-webkit-details-marker]:hidden">
            <Image
              src="/assets/icons/menu.svg"
              alt="menu"
              width={16}
              height={12}
            />
          </summary>

          <div className="absolute right-0 top-[calc(100%+10px)] z-20 w-52 rounded-2xl border border-white/10 bg-[#262626]/70 p-2 backdrop-blur-xl">
            <NavLinks mobile />
          </div>
        </details>
      </nav>
    </header>
  );
}
