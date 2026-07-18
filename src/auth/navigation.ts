import type { UserRole } from "./types";

export type RoleNavigationItem = {
  href: string;
  label: string;
};

const publicNavigation: readonly RoleNavigationItem[] = [
  { href: "/explore", label: "Explore" },
  { href: "/brew-methods", label: "Brew Methods" },
  { href: "/grinders", label: "Grinder Guides" },
  { href: "/learn", label: "Learn" },
  { href: "/for-business", label: "For Cafés & Roasters" },
];

const individualNavigation: readonly RoleNavigationItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/brew-lab", label: "Brew Lab" },
  { href: "/guided-brew", label: "Guided Brew" },
  { href: "/journal", label: "Journal" },
  { href: "/troubleshoot", label: "Troubleshoot" },
  { href: "/learn", label: "Learn" },
  { href: "/profile", label: "Profile" },
];

const corporateNavigation: readonly RoleNavigationItem[] = [
  { href: "/corporate/dashboard", label: "Dashboard" },
  { href: "/corporate/roasting/session", label: "Roasting" },
  { href: "/corporate/recipes", label: "Recipes" },
  { href: "/corporate/quality", label: "Quality" },
  { href: "/corporate/troubleshoot", label: "Troubleshoot" },
  { href: "/corporate/learning", label: "Learning" },
  { href: "/corporate/integrations", label: "Integrations" },
  { href: "/corporate/team", label: "Team" },
  { href: "/corporate/locations", label: "Locations" },
];

const corporateDesktopNavigation = corporateNavigation.slice(0, 4).concat(corporateNavigation[5]);

export function navigationForRole(role: UserRole, compact = false) {
  if (role === "individual") return individualNavigation;
  if (role === "corporate") return compact ? corporateDesktopNavigation : corporateNavigation;
  return publicNavigation;
}
