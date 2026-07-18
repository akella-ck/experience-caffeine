import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import Link from "next/link";

type PublicFeaturePreviewProps = {
  eyebrow?: string;
  title: string;
  description: string;
  features: readonly string[];
  loginPath: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function PublicFeaturePreview({
  eyebrow = "Member preview",
  title,
  description,
  features,
  loginPath,
  secondaryHref = "/learn",
  secondaryLabel = "Explore public lessons",
}: PublicFeaturePreviewProps) {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#0b0908] px-5 pb-24 pt-32 text-[#f7f0e5] sm:px-8 sm:pt-40">
      <div className="ambient-grid pointer-events-none absolute inset-x-0 top-0 h-[48rem] opacity-70" />
      <div className="pointer-events-none absolute right-[12%] top-28 size-96 rounded-full bg-[#a75f2c]/12 blur-[120px]" />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_.82fr] lg:items-center">
        <section>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title mt-6 max-w-4xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-[#b8aa99] sm:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="button-primary" href={`/login?next=${encodeURIComponent(loginPath)}`}>
              Login to Continue <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link className="button-secondary" href={secondaryHref}>{secondaryLabel}</Link>
          </div>
          <p className="mt-5 max-w-xl text-xs leading-5 text-[#7f7367]">
            Demo access uses browser-only sessions. No account data is sent to a production service.
          </p>
        </section>

        <section aria-label="Included member features" className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-amber-300/[0.08] blur-3xl" />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-amber-300/70">Inside the workspace</p>
              <h2 className="mt-3 text-2xl font-medium tracking-[-0.035em] text-[#f2e6d2]">A practical tool, not a teaser form.</h2>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-amber-300/15 bg-amber-300/[0.06]">
              <LockKeyhole aria-hidden="true" className="size-4 text-amber-200" />
            </span>
          </div>
          <ul className="relative mt-7 space-y-3">
            {features.map((feature) => (
              <li className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-black/10 px-4 py-3 text-sm leading-6 text-[#b8aa99]" key={feature}>
                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-amber-300/70" />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
