import type { HTMLAttributes, ReactNode } from "react";
import { CircleAlert, Info, Radio } from "lucide-react";
import type { CorporateSignal, IntegrationStatus, StandardStatus } from "@/data/corporate";

export function CorporatePanel({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-[1.5rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,246,228,.06),rgba(255,255,255,.018)_48%),rgba(18,13,10,.72)] shadow-[0_20px_60px_rgba(0,0,0,.2),inset_0_1px_0_rgba(255,255,255,.04)] ${className}`} {...props}>
      {children}
    </div>
  );
}

type CorporatePageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  actions?: ReactNode;
  meta?: string;
};

export function CorporatePageHeader({ eyebrow, title, description, actions, meta }: CorporatePageHeaderProps) {
  return (
    <header className="flex flex-col gap-7 border-b border-white/[0.08] pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-amber-300/75">{eyebrow}</p>
          {meta ? <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.12em] text-[#807469]">{meta}</span> : null}
        </div>
        <h1 className="mt-5 text-balance text-4xl font-medium leading-[1] tracking-[-0.05em] text-[#f4ead8] sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-pretty text-sm leading-7 text-[#a99d8e] sm:text-base">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}

export function CorporatePreviewNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-sky-300/10 bg-sky-300/[0.035] px-4 py-3 text-xs leading-5 text-[#a9a9a0]">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-200/65" aria-hidden="true" />
      <p>{children ?? "Illustrative workspace data. No live device, production, payroll, or customer systems are connected."}</p>
    </div>
  );
}

type CorporateMetricCardProps = {
  label: string;
  value: string;
  detail: string;
  signal?: CorporateSignal;
  icon: ReactNode;
};

export function CorporateMetricCard({ label, value, detail, signal = "on-track", icon }: CorporateMetricCardProps) {
  return (
    <CorporatePanel className="p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-amber-300/75">{icon}</span>
        <SignalPill signal={signal} />
      </div>
      <p className="mt-7 font-mono text-3xl font-medium tracking-[-0.04em] text-[#f1e5d3] tabular-nums">{value}</p>
      <p className="mt-2 text-sm font-medium text-[#d7caba]">{label}</p>
      <p className="mt-1 text-xs leading-5 text-[#7f7368]">{detail}</p>
    </CorporatePanel>
  );
}

export function SignalPill({ signal }: { signal: CorporateSignal }) {
  const labels: Record<CorporateSignal, string> = {
    "on-track": "On track",
    attention: "Attention",
    review: "Review",
  };
  const styles: Record<CorporateSignal, string> = {
    "on-track": "border-emerald-300/15 bg-emerald-300/[0.055] text-emerald-200/75",
    attention: "border-rose-300/15 bg-rose-300/[0.055] text-rose-200/80",
    review: "border-amber-300/15 bg-amber-300/[0.055] text-amber-200/80",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.12em] ${styles[signal]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{labels[signal]}</span>;
}

export function StandardStatusPill({ status }: { status: StandardStatus }) {
  const styles: Record<StandardStatus, string> = {
    Approved: "border-emerald-300/15 bg-emerald-300/[0.055] text-emerald-200/75",
    "In review": "border-amber-300/15 bg-amber-300/[0.055] text-amber-200/80",
    Draft: "border-white/[0.08] bg-white/[0.03] text-[#94877b]",
  };
  return <span className={`rounded-full border px-2.5 py-1 text-[0.6rem] font-medium ${styles[status]}`}>{status}</span>;
}

export function IntegrationStatusPill({ status }: { status: IntegrationStatus }) {
  const styles: Record<IntegrationStatus, string> = {
    Available: "border-emerald-300/15 bg-emerald-300/[0.055] text-emerald-200/80",
    Prototype: "border-amber-300/15 bg-amber-300/[0.055] text-amber-200/80",
    Planned: "border-white/[0.08] bg-white/[0.03] text-[#918579]",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.1em] ${styles[status]}`}><Radio className="h-3 w-3" aria-hidden="true" />{status}</span>;
}

export function CorporateProgress({ value, label }: { value: number; label: string }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="text-[#918579]">{label}</span><span className="font-mono text-[#cfc1ae] tabular-nums">{safeValue}%</span></div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeValue}>
        <div className="h-full rounded-full bg-gradient-to-r from-[#a85f34] to-[#e9b66e]" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

export function CorporateSectionTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="font-mono text-[0.61rem] font-semibold uppercase tracking-[0.18em] text-amber-300/65">{eyebrow}</p> : null}
        <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#eee1cf] sm:text-3xl">{title}</h2>
        {description ? <p className="mt-3 text-sm leading-6 text-[#8f8377]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function CorporateWarning({ children }: { children: ReactNode }) {
  return <div className="flex items-start gap-3 rounded-xl border border-amber-300/12 bg-amber-300/[0.04] p-4 text-xs leading-5 text-[#a99a89]"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/70" aria-hidden="true" />{children}</div>;
}
