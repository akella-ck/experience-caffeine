"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  { href: "/explore", label: "Coffee explorer" },
  { href: "/brew-lab", label: "Build a recipe" },
  { href: "/brew-methods", label: "Method library" },
  { href: "/grinders", label: "Grinder guides" },
  { href: "/for-business", label: "For cafés & roasters" },
  { href: "/troubleshoot", label: "Troubleshoot a cup" },
  { href: "/journal", label: "Brew journal" },
];

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/guided-brew" || pathname.startsWith("/corporate/")) {
    return null;
  }

  return (
    <footer className="border-t border-white/[0.08] bg-[#080604]">
      <div className="section-shell grid gap-12 py-14 md:grid-cols-[1.15fr_.85fr] md:py-20">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
            <span className="h-3.5 w-2.5 rotate-[28deg] rounded-[50%] bg-[#b76f3d]" />
            Experience Caffeine
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#a99d8c]">
            A practical coffee laboratory for understanding variables, building repeatable recipes, and learning what to change next.
          </p>
          <p className="mt-8 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#998b7c]">
            Settings are starting points, not universal calibrations.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3 md:grid-cols-2">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="group flex items-center gap-1.5 text-sm text-[#bcb09e] hover:text-[#f2c080]">
              {link.label}
              <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
      <div className="section-shell flex flex-col gap-2 border-t border-white/[0.07] py-5 text-[0.67rem] text-[#998b7c] sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Experience Caffeine</span>
        <span>Built for curious, attentive brewers.</span>
      </div>
    </footer>
  );
}
