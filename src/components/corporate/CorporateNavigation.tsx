"use client";

import {
  Activity,
  BarChart3,
  BookOpenCheck,
  Building2,
  ChevronDown,
  Coffee,
  FlaskConical,
  Gauge,
  Link2,
  Menu,
  Settings2,
  SlidersHorizontal,
  Users,
  Wrench,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = { href: string; label: string; icon: LucideIcon };

const navigation: Array<{ label: string; items: NavItem[] }> = [
  {
    label: "Workspace",
    items: [
      { href: "/corporate/dashboard", label: "Dashboard", icon: BarChart3 },
      { href: "/corporate/roasting/session", label: "Roasting", icon: Coffee },
      { href: "/corporate/roast-profiles", label: "Roast Profiles", icon: Activity },
      { href: "/corporate/recipes", label: "Recipe Manager", icon: SlidersHorizontal },
      { href: "/corporate/learning", label: "Learning", icon: BookOpenCheck },
      { href: "/corporate/quality", label: "Quality", icon: FlaskConical },
      { href: "/corporate/troubleshoot", label: "Troubleshoot", icon: Gauge },
    ],
  },
  {
    label: "Organization",
    items: [
      { href: "/corporate/equipment", label: "Equipment", icon: Wrench },
      { href: "/corporate/team", label: "Team", icon: Users },
      { href: "/corporate/locations", label: "Locations", icon: Building2 },
      { href: "/corporate/integrations", label: "Integrations", icon: Link2 },
      { href: "/corporate/settings", label: "Settings", icon: Settings2 },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/corporate/roasting/session") return pathname.startsWith("/corporate/roasting");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CorporateNavigation() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuPath(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <>
      <div className="sticky top-[4.65rem] z-40 border-b border-white/[0.08] bg-[#0c0907]/96 px-4 py-3 backdrop-blur-xl lg:hidden">
        <button type="button" onClick={() => setMenuPath(open ? null : pathname)} aria-expanded={open} aria-controls="corporate-mobile-navigation" className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-left text-sm text-[#e5d9c7]">
          {open ? <X className="h-4 w-4 text-amber-300" aria-hidden="true" /> : <Menu className="h-4 w-4 text-amber-300" aria-hidden="true" />}
          <span className="font-medium">Corporate workspace</span>
          <span className="ml-auto text-xs text-[#a99c8e]">{navigation.flatMap((section) => section.items).find((item) => isActive(pathname, item.href))?.label ?? "Menu"}</span>
          <ChevronDown className={`h-4 w-4 text-[#a99c8e] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
        {open ? (
          <nav id="corporate-mobile-navigation" aria-label="Corporate navigation" className="absolute inset-x-4 top-full max-h-[calc(100dvh-9rem)] overflow-y-auto rounded-b-2xl border border-white/[0.08] bg-[#100c09] p-3 shadow-2xl">
            <NavigationSections pathname={pathname} onNavigate={() => setMenuPath(null)} />
          </nav>
        ) : null}
      </div>

      <aside className="fixed bottom-0 left-0 top-[4.65rem] z-30 hidden w-64 flex-col border-r border-white/[0.08] bg-[#0c0907]/92 backdrop-blur-xl lg:flex">
        <div className="border-b border-white/[0.08] p-5">
          <Link href="/corporate/dashboard" className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-amber-300/15 bg-amber-300/[0.06]"><Building2 className="h-4 w-4 text-amber-300/75" aria-hidden="true" /></span>
            <span><span className="block text-sm font-semibold text-[#ecdfcd]">Northline Coffee</span><span className="mt-0.5 block text-[0.58rem] uppercase tracking-[0.13em] text-[#a99c8e]">Corporate preview</span></span>
          </Link>
        </div>
        <nav aria-label="Corporate navigation" className="flex-1 overflow-y-auto px-3 py-5"><NavigationSections pathname={pathname} /></nav>
        <div className="border-t border-white/[0.08] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.025] p-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#8f5631] text-[0.62rem] font-semibold text-[#f6dfc3]">ER</span>
            <span className="min-w-0"><span className="block truncate text-xs font-medium text-[#ddd0bd]">Elena Ruiz</span><span className="mt-0.5 block text-[0.58rem] text-[#a99c8e]">Program admin · preview</span></span>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavigationSections({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="space-y-6">
      {navigation.map((section) => (
        <div key={section.label}>
          <p className="mb-2 px-3 font-mono text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-[#b5a797]">{section.label}</p>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-amber-300/70 ${active ? "bg-amber-300/[0.09] text-amber-100" : "text-[#b5a797] hover:bg-white/[0.035] hover:text-[#e0d4c4]"}`}>
                  <Icon className={`h-4 w-4 ${active ? "text-amber-300" : "text-[#a99c8e]"}`} strokeWidth={1.6} aria-hidden="true" />{item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
