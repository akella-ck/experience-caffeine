"use client";

import { ArrowRight, Building2, LockKeyhole, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardPathForRole } from "@/auth/access";
import type { RouteAccessLevel } from "@/auth/access";
import type { UserRole } from "@/auth/types";
import { useAuth } from "@/components/auth/AuthProvider";

type AccessDeniedProps = {
  requiredLabel: string;
  requiredAccess?: RouteAccessLevel;
  nextPath?: string;
  role?: UserRole;
};

export function AccessDenied({ requiredLabel, requiredAccess, nextPath, role: suppliedRole }: AccessDeniedProps) {
  const router = useRouter();
  const { logout, role: contextRole, session } = useAuth();
  const role = suppliedRole ?? contextRole;
  const loginHref = nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login";
  const isPublic = role === "public";
  const individualNeedsCorporate = role === "individual" && requiredAccess === "corporate";

  function switchAccount() {
    logout();
    router.push(loginHref);
  }

  if (individualNeedsCorporate) {
    return (
      <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-[#0b0908] px-5 py-32 text-[#f7f0e5]">
        <div className="ambient-grid pointer-events-none absolute inset-0 opacity-60" />
        <section className="glass-panel relative w-full max-w-2xl rounded-[2rem] p-7 text-center sm:p-10">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-amber-300/15 bg-amber-300/[0.06]">
            <Building2 aria-hidden="true" className="size-5 text-amber-200" />
          </span>
          <p className="mt-6 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300/70">Corporate access</p>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] text-[#f4ead8] sm:text-4xl">A corporate account is required.</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#a99d8f] sm:text-base">
            You are signed in to the individual learning workspace. Corporate tools are designed for teams managing roasting, recipes, quality, and locations.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link className="button-primary" href="/dashboard">Return to my dashboard <ArrowRight aria-hidden="true" className="size-4" /></Link>
            <Link className="button-secondary" href="/for-business">Explore business plans</Link>
            <Link className="button-quiet" href="/for-business#inquiry">Request access</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-[#0b0908] px-5 py-32 text-[#f7f0e5]">
      <div className="ambient-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[34rem] -translate-x-1/2 rounded-full bg-[#a75f2c]/12 blur-[120px]" />
      <section className="glass-panel relative w-full max-w-2xl overflow-hidden rounded-[2rem] p-7 text-center sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] text-amber-200">
          {isPublic ? <LockKeyhole aria-hidden="true" className="size-5" /> : role === "corporate" ? <Building2 aria-hidden="true" className="size-5" /> : <UserRound aria-hidden="true" className="size-5" />}
        </div>
        <p className="mt-6 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300/70">
          {isPublic ? "Member access" : "Different workspace"}
        </p>
        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] text-[#f4ead8] sm:text-4xl">
          {isPublic ? `Sign in for ${requiredLabel}.` : `${requiredLabel} is not included with this account.`}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#a99d8f] sm:text-base">
          {isPublic
            ? "Use one of the demo accounts to continue. Your session stays in this browser only."
            : `You are signed in as ${session?.accountName ?? role}. Switch accounts or return to the workspace built for this role.`}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {isPublic ? (
            <Link className="button-primary" href={loginHref}>
              Sign in to continue <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          ) : (
            <>
              <Link className="button-primary" href={dashboardPathForRole(role)}>
                Go to my dashboard <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <button className="button-secondary" onClick={switchAccount} type="button">Switch demo account</button>
            </>
          )}
          <Link className={isPublic ? "button-secondary" : "button-quiet"} href="/">
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
