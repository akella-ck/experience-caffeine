"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Building2, Check, Eye, EyeOff, ShieldCheck, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { canAccessPath, dashboardPathForRole, safeInternalPath } from "@/auth/access";
import { useAuth } from "@/components/auth/AuthProvider";
import { DEMO_AUTH_ENABLED, DEMO_CREDENTIALS } from "@/config/demo-auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isHydrated, login, session } = useAuth();
  const requestedRole = searchParams.get("role");
  const requestedCredential = DEMO_AUTH_ENABLED
    ? DEMO_CREDENTIALS.find((candidate) => candidate.role === requestedRole)
    : undefined;
  const [email, setEmail] = useState(requestedCredential?.email ?? "");
  const [password, setPassword] = useState(requestedCredential?.password ?? "");
  const [rememberSession, setRememberSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestedPath = safeInternalPath(searchParams.get("next"));

  useEffect(() => {
    if (!isHydrated || !session) return;
    const destination = requestedPath && requestedPath !== "/login" && canAccessPath(session.role, requestedPath)
      ? requestedPath
      : dashboardPathForRole(session.role);
    router.replace(destination);
  }, [isHydrated, requestedPath, router, session]);

  function selectDemo(role: "individual" | "corporate") {
    const account = DEMO_CREDENTIALS.find((candidate) => candidate.role === role);
    if (!account) return;
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    const result = login({ email, password, rememberSession });
    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    const destination = requestedPath && requestedPath !== "/login" && canAccessPath(result.session.role, requestedPath)
      ? requestedPath
      : dashboardPathForRole(result.session.role);
    router.replace(destination);
  }

  if (!isHydrated) {
    return <div className="glass-panel grid min-h-96 place-items-center rounded-[2rem] text-sm text-[#9e907e]">Preparing demo access…</div>;
  }

  if (session) return <div className="glass-panel grid min-h-96 place-items-center rounded-[2rem] text-sm text-[#9e907e]">Opening your workspace…</div>;

  return (
    <form className="glass-panel rounded-[2rem] p-6 sm:p-8" onSubmit={submit}>
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-amber-300/70">Demo sign in</p>
          <h2 className="mt-3 text-2xl font-medium tracking-[-0.035em] text-[#f2e6d2]">Use a demo account.</h2>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-amber-300/15 bg-amber-300/[0.06]">
          <ShieldCheck aria-hidden="true" className="size-5 text-amber-200" />
        </span>
      </div>

      {DEMO_AUTH_ENABLED ? <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <button className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-4 text-left transition hover:border-amber-300/30 hover:bg-amber-300/[0.05]" onClick={() => selectDemo("individual")} type="button">
          <UserRound aria-hidden="true" className="size-4 text-amber-300/75" />
          <span className="mt-4 block text-sm font-medium text-[#eee3d4]">Fill individual credentials</span>
          <span className="mt-1 block text-[10px] leading-4 text-[#817469]">Recipes, journal, profile, and guided learning</span>
        </button>
        <button className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-4 text-left transition hover:border-amber-300/30 hover:bg-amber-300/[0.05]" onClick={() => selectDemo("corporate")} type="button">
          <Building2 aria-hidden="true" className="size-4 text-amber-300/75" />
          <span className="mt-4 block text-sm font-medium text-[#eee3d4]">Fill corporate credentials</span>
          <span className="mt-1 block text-[10px] leading-4 text-[#817469]">Quality, roasting, teams, and locations</span>
        </button>
      </div> : null}

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#e9dfd0]" htmlFor="demo-email">Email</label>
          <input
            autoComplete="username"
            className="form-control"
            disabled={isSubmitting}
            id="demo-email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#e9dfd0]" htmlFor="demo-password">Password</label>
          <div className="relative">
            <input
              autoComplete="current-password"
              className="form-control pr-12"
              disabled={isSubmitting}
              id="demo-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-xl text-[#8f8174] hover:bg-white/[0.05] hover:text-[#e7dbca]"
              onClick={() => setShowPassword((current) => !current)}
              disabled={isSubmitting}
              type="button"
            >
              {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-5 text-[#a99b8d]">
        <input
          checked={rememberSession}
          className="mt-0.5 size-4 accent-amber-400"
          onChange={(event) => setRememberSession(event.target.checked)}
          disabled={isSubmitting}
          type="checkbox"
        />
        <span><span className="font-medium text-[#d9cdbc]">Remember this demo session.</span> Otherwise it ends when this browser tab closes.</span>
      </label>

      {error ? <p aria-live="polite" className="mt-5 rounded-xl border border-red-300/15 bg-red-300/[0.06] px-4 py-3 text-xs text-red-100">{error}</p> : null}

      <button className="button-primary mt-6 w-full disabled:cursor-wait disabled:opacity-70" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Checking access…" : "Sign in"} {!isSubmitting ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
      </button>
      <p className="mt-4 flex items-start gap-2 text-[10px] leading-4 text-[#776b60]">
        <Check aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-amber-300/60" />
        Demo only. No password is sent to a server and no real account is created.
      </p>
    </form>
  );
}
