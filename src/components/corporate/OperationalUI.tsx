import type { ReactNode } from "react";
import type { OperationalStatus } from "@/types";

const statusStyles: Record<OperationalStatus, string> = {
  approved: "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200",
  "in-review": "border-sky-300/20 bg-sky-300/[0.08] text-sky-200",
  draft: "border-amber-300/20 bg-amber-300/[0.08] text-amber-200",
  archived: "border-white/10 bg-white/[0.04] text-[#93877a]",
};

export function OperationalStatusBadge({ status }: { status: OperationalStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] ${statusStyles[status]}`}>
      {status.replace("-", " ")}
    </span>
  );
}

export function OperationalPageIntro({ eyebrow, title, description, actions }: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-white/[0.08] pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-balance text-4xl font-medium tracking-[-0.045em] text-[#f7efe3] sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#a99c8d] sm:text-base">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function OperationalField({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block text-xs font-medium text-[#d8cbbb]">
      <span className="mb-2 flex items-center justify-between gap-3">
        {label}
        {hint ? <span className="font-normal text-[#766a5e]">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

export function OperationalNotice({ children, tone = "amber" }: { children: ReactNode; tone?: "amber" | "red" | "neutral" }) {
  const classes = tone === "red"
    ? "border-red-300/25 bg-red-300/[0.07] text-red-100"
    : tone === "amber"
      ? "border-amber-300/20 bg-amber-300/[0.06] text-[#e1c499]"
      : "border-white/10 bg-white/[0.035] text-[#b9ab9c]";
  return <div className={`rounded-2xl border p-4 text-xs leading-6 ${classes}`}>{children}</div>;
}

