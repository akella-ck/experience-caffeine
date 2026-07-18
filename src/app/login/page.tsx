import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowLeft, Building2, FlaskConical, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { DEMO_AUTH_ENABLED, DEMO_CREDENTIALS } from "@/config/demo-auth";

export const metadata: Metadata = {
  title: "Demo Sign In",
  description: "Sign in to the individual or corporate Experience Caffeine demo workspace.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#0b0908] px-5 pb-24 pt-28 text-[#f7f0e5] sm:px-8 sm:pt-36">
      <div className="ambient-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute left-[7%] top-20 size-96 rounded-full bg-[#a75f2c]/12 blur-[120px]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-start">
        <section className="pt-4 lg:sticky lg:top-32">
          <Link className="mb-8 inline-flex items-center gap-2 text-xs text-[#9c8e80] hover:text-amber-200" href="/"><ArrowLeft aria-hidden="true" className="size-3.5" /> Back to public browsing</Link>
          <p className="eyebrow">Workspace access</p>
          <h1 className="page-title mt-6">One platform. Two ways to work.</h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-8 text-[#b8aa99] sm:text-lg">
            Enter the individual learning lab or preview the operating system for coffee teams. Both accounts use local, demo-only sessions.
          </p>

          {DEMO_AUTH_ENABLED ? <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {DEMO_CREDENTIALS.map((credential) => {
              const Icon = credential.role === "corporate" ? Building2 : UserRound;
              return (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4" key={credential.role}>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#e5d8c7]"><Icon aria-hidden="true" className="size-4 text-amber-300/70" /> {credential.accountName}</div>
                  <dl className="mt-4 grid gap-2 font-mono text-[10px]">
                    <div className="flex flex-wrap justify-between gap-2"><dt className="text-[#75695f]">Email</dt><dd className="text-[#c5b6a5]">{credential.email}</dd></div>
                    <div className="flex flex-wrap justify-between gap-2"><dt className="text-[#75695f]">Password</dt><dd className="text-[#c5b6a5]">{credential.password}</dd></div>
                  </dl>
                </div>
              );
            })}
          </div> : null}

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-300/10 bg-amber-300/[0.035] p-4 text-xs leading-5 text-[#a99b8c]">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-300/70" />
            Production authentication is intentionally not represented here. This screen exists to review role-aware product flows.
          </div>
        </section>

        <Suspense fallback={<div className="glass-panel grid min-h-[36rem] place-items-center rounded-[2rem] text-sm text-[#9e907e]">Preparing sign in…</div>}>
          <LoginForm />
        </Suspense>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute bottom-10 right-[8%] hidden items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.17em] text-[#665b51] lg:flex">
        <FlaskConical className="size-4" /> Demo environment
      </div>
    </main>
  );
}
