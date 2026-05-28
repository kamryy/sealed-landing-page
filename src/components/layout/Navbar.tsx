"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { NAV_LINKS } from "@/constants/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";

const SECTION_IDS = [
  "hero",
  ...NAV_LINKS.filter((l) => l.href.startsWith("#")).map((l) =>
    l.href.slice(1),
  ),
];

const SECTION_TO_HREF: Record<string, string> = { hero: "/" };
NAV_LINKS.forEach((l) => {
  if (l.href.startsWith("#")) SECTION_TO_HREF[l.href.slice(1)] = l.href;
});

function useActiveSection() {
  const [active, setActive] = useState<string>("/");
  const pathname = usePathname();

  // Effect for service-side navigation (when user clicks a nav link that changes the URL)
  useEffect(() => {
    const navPath = NAV_LINKS.find(
      (l) => !l.href.startsWith("#") && l.href === pathname,
    );
    if (navPath && pathname !== "/") {
      setTimeout(() => {
        setActive(navPath.href);
      }, 0);
    }
  }, [pathname]);

  // Effect for handling scrollable sections on the main page
  useEffect(() => {
    if (pathname !== "/") return;

    const visibleSet = new Map<string, IntersectionObserverEntry>();
    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSet.set(entry.target.id, entry);
          } else {
            visibleSet.delete(entry.target.id);
          }
        }

        // Pick the section closest to top of viewport among visible ones
        let best: string | null = null;
        let bestTop = Infinity;
        visibleSet.forEach((entry, id) => {
          const top = entry.boundingClientRect.top;
          if (Math.abs(top) < Math.abs(bestTop)) {
            bestTop = top;
            best = id;
          }
        });

        if (best) {
          setActive(SECTION_TO_HREF[best] ?? "/");
        }
      },
      { rootMargin: "-10% 0px -30% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));

    // Home active when at the very top
    const onScroll = () => {
      if (window.scrollY < 100) setActive("/");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return active;
}

function NavLinks({
  mobile = false,
  activeHref,
}: {
  mobile?: boolean;
  activeHref: string;
}) {
  if (mobile) {
    return (
      <>
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = href === activeHref;
          const isExternal = href.startsWith("http");
          const linkHref = href.startsWith("#") ? `/${href}` : href;

          if (isExternal) {
            return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`block rounded-lg px-3 py-2 text-sm ${
                  isActive
                    ? "bg-white/5 text-white"
                    : "text-white/80 hover:text-white"
                } ${isActive ? "" : "mt-1"}`}
              >
                {label}
              </a>
            );
          }

          return (
            <Link
              key={label}
              href={linkHref}
              className={`block rounded-lg px-3 py-2 text-sm ${
                isActive
                  ? "bg-white/5 text-white"
                  : "text-white/80 hover:text-white"
              } ${isActive ? "" : "mt-1"}`}
            >
              {label}
            </Link>
          );
        })}
        <a
          href={"/#whitelist"}
          className="mt-2 block rounded-lg bg-sealed-teal px-3 py-2 text-center text-sm font-semibold text-black"
        >
          Sign up
        </a>
      </>
    );
  }

  return (
    <ul className="hidden items-center gap-2 rounded-full p-1 text-sm text-white/80 lg:flex">
      {NAV_LINKS.map(({ label, href }) => {
        const isActive = href === activeHref;
        const isExternal = href.startsWith("http");
        const linkHref = href.startsWith("#") ? `/${href}` : href;

        if (isExternal) {
          return (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-full px-4 py-2 transition-colors ${
                  isActive ? "bg-white/5 text-white" : "hover:text-white"
                }`}
              >
                {label}
              </a>
            </li>
          );
        }

        return (
          <li key={label}>
            <Link
              href={linkHref}
              className={`rounded-full px-4 py-2 transition-colors ${
                isActive ? "bg-white/5 text-white" : "hover:text-white"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Navbar() {
  const activeHref = useActiveSection();
  const pathname = usePathname();
  const whitelistHref = pathname === "/" ? "#whitelist" : "/#whitelist";

  return (
    <header className="sticky top-0 z-50 -mx-5 border border-white/5 bg-[#262626]/30 px-8 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur-2xl sm:px-12 lg:top-4 lg:mx-0 lg:rounded-full lg:px-5 lg:py-4">
      <nav className="flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/assets/sealed-logo.svg"
            alt="Sealed"
            width={28}
            height={28}
            className="h-8 w-8"
          />
          <span className="text-2xl font-medium text-white">Sealed</span>
        </Link>

        {/* Desktop links */}
        <NavLinks activeHref={activeHref} />

        {/* Desktop CTA */}
        <a
          href={whitelistHref}
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
            <NavLinks mobile activeHref={activeHref} />
          </div>
        </details>
      </nav>
    </header>
  );
}
