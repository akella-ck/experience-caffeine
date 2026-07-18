"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Building2, LogIn, LogOut, Menu, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigationForRole } from "@/auth/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { isHydrated, logout, role, session } = useAuth();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const desktopNavigation = isHydrated ? navigationForRole(role, true) : [];
  const mobileNavigation = isHydrated ? navigationForRole(role) : [];

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1280px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpenPath(null);
    };
    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = mobilePanelRef.current;
    const menuButton = menuButtonRef.current;
    const mainContent = document.querySelector<HTMLElement>("#main-content");
    const footer = document.querySelector<HTMLElement>("body > footer");
    const focusable = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      : [];

    document.body.style.overflow = "hidden";
    mainContent?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    focusable[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenPath(null);
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      mainContent?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      document.removeEventListener("keydown", handleKeyDown);
      menuButton?.focus();
    };
  }, [open]);

  function signOut() {
    logout();
    setOpenPath(null);
    router.push("/");
  }

  if (pathname === "/guided-brew") {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#090705]/78 backdrop-blur-xl">
      <div className="section-shell flex h-[4.65rem] items-center justify-between gap-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Experience Caffeine home">
          <span className="relative grid size-8 place-items-center rounded-full border border-amber/30 bg-amber/[0.08]">
            <span className="h-4 w-2.5 rotate-[28deg] rounded-[50%] border border-[#e4aa65] bg-gradient-to-br from-[#a76035] to-[#3b2114] shadow-[0_0_18px_rgba(217,154,78,.32)]" />
          </span>
          <span className="text-[0.77rem] font-semibold uppercase tracking-[0.17em] text-[#f2eadc] sm:text-[0.82rem]">
            Experience <span className="text-[#d99a4e]">Caffeine</span>
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-0.5 xl:flex" aria-label="Primary navigation">
          {!isHydrated ? <span className="px-4 text-[0.68rem] text-[#75695e]">Checking access…</span> : desktopNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-2.5 py-2 text-[0.72rem] font-medium transition-colors ${
                isActive(pathname, item.href)
                  ? "bg-white/[0.07] text-[#f1c384]"
                  : "text-[#bcb09e] hover:bg-white/[0.045] hover:text-[#f4ead8]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {!isHydrated ? <span className="hidden min-h-10 items-center px-3 text-[0.68rem] text-[#75695e] lg:inline-flex">Checking access…</span> : session ? (
            <>
              <span
                aria-label={`Signed in as ${session.displayName}, ${session.role} account`}
                className="hidden min-h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 text-[0.68rem] text-[#c9bcaa] 2xl:inline-flex"
              >
                {session.role === "corporate" ? <Building2 aria-hidden="true" className="size-3.5 text-amber-300/70" /> : <UserRound aria-hidden="true" className="size-3.5 text-amber-300/70" />}
                {session.displayName.split(" ")[0]}
              </span>
              <button className="button-quiet !hidden !min-h-10 !px-3 xl:!inline-flex" onClick={signOut} type="button">
                <LogOut aria-hidden="true" className="size-3.5" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link className="button-quiet !hidden !min-h-10 !px-3 lg:!inline-flex" href="/login">
                <LogIn aria-hidden="true" className="size-3.5" /> Login
              </Link>
              <Link href="/brew-lab" className="button-primary !hidden !min-h-10 !px-4 lg:!inline-flex">
                Preview Brew Lab <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </>
          )}
          <button
            ref={menuButtonRef}
            type="button"
            className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.035] text-cream xl:hidden"
            disabled={!isHydrated}
            onClick={() => setOpenPath(open ? null : pathname)}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            {open ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={mobilePanelRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full h-[calc(100dvh-4.65rem)] border-t border-white/[0.07] bg-[#0b0806]/98 px-4 py-5 backdrop-blur-2xl xl:hidden"
          >
            <nav className="mx-auto flex h-full min-h-0 max-w-lg flex-col" aria-label="Mobile navigation">
              <div className="min-h-0 flex-1 overflow-y-auto scrollbar-subtle">
                {mobileNavigation.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpenPath(null)}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={`flex min-h-14 items-center justify-between border-b border-white/[0.08] px-1 text-lg ${isActive(pathname, item.href) ? "text-amber-200" : "text-[#eee3d2]"}`}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[0.65rem] text-[#967f68]">{String(index + 1).padStart(2, "0")}</span>
                  </Link>
                ))}
              </div>

              {isHydrated && session ? (
                <div className="mt-4 border-t border-white/[0.08] pt-4">
                  <div className="mb-3 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-amber-300/[0.08]">
                      {session.role === "corporate" ? <Building2 aria-hidden="true" className="size-4 text-amber-200" /> : <UserRound aria-hidden="true" className="size-4 text-amber-200" />}
                    </span>
                    <span className="min-w-0"><span className="block truncate text-sm text-[#eee3d2]">{session.displayName}</span><span className="mt-0.5 block truncate text-[10px] text-[#817469]">{session.accountName}</span></span>
                  </div>
                  <button className="button-secondary w-full" onClick={signOut} type="button"><LogOut aria-hidden="true" className="size-4" /> Logout</button>
                </div>
              ) : (
                <div className="mt-4 grid gap-2 border-t border-white/[0.08] pt-4 sm:grid-cols-2">
                  <Link href="/login" className="button-secondary w-full" onClick={() => setOpenPath(null)}><LogIn aria-hidden="true" className="size-4" /> Login</Link>
                  <Link href="/brew-lab" className="button-primary w-full" onClick={() => setOpenPath(null)}>Preview Brew Lab <ArrowUpRight size={16} aria-hidden="true" /></Link>
                </div>
              )}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
