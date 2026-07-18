"use client";

import { useMemo, useRef, useState } from "react";
import { Cable, CheckCircle2, ChevronRight, CircleOff, Database, PlugZap, Shield, X } from "lucide-react";
import { operationalIntegrations } from "@/data/corporate";
import { createRoasterAdapter } from "@/lib/integrations/roasters";
import { useAccessibleDialog } from "@/hooks/use-accessible-dialog";
import type { OperationalIntegration, OperationalIntegrationBadge, OperationalIntegrationCategory } from "@/types";
import { OperationalNotice, OperationalPageIntro } from "./OperationalUI";

const badgeStyle: Record<OperationalIntegrationBadge, string> = {
  Mock: "border-amber-300/20 bg-amber-300/[0.08] text-amber-200",
  Planned: "border-sky-300/20 bg-sky-300/[0.07] text-sky-200",
  "Read-only": "border-white/10 bg-white/[0.04] text-[#b4a696]",
  "Control capable": "border-red-300/20 bg-red-300/[0.06] text-red-100",
  "Not connected": "border-white/10 bg-black/15 text-[#82766a]",
  Connected: "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200",
};

export function IntegrationsCatalog() {
  const [category, setCategory] = useState<"all" | OperationalIntegrationCategory>("all");
  const [selected, setSelected] = useState<OperationalIntegration | null>(null);
  const adapter = useMemo(() => createRoasterAdapter("mock-roaster"), []);
  const [mockConnected, setMockConnected] = useState(adapter?.getConnectionSnapshot().state === "connected");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("No production systems are connected.");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { captureDialogTrigger, dialogRef } = useAccessibleDialog({
    open: selected !== null,
    onClose: () => setSelected(null),
    initialFocusRef: closeButtonRef,
  });
  const categories = useMemo(() => Array.from(new Set(operationalIntegrations.map((item) => item.category))), []);
  const filtered = category === "all" ? operationalIntegrations : operationalIntegrations.filter((item) => item.category === category);

  function openIntegration(integration: OperationalIntegration) {
    captureDialogTrigger();
    setSelected(integration);
  }

  async function toggleMockConnection() {
    if (!adapter) return;
    setBusy(true);
    if (mockConnected) {
      const snapshot = await adapter.disconnect();
      setMockConnected(snapshot.state === "connected");
      setMessage("Local roaster sandbox disconnected.");
    } else {
      const snapshot = await adapter.connect({ workspaceId: "local-corporate-demo", label: "Corporate integration preview" });
      setMockConnected(snapshot.state === "connected");
      setMessage(snapshot.message);
    }
    setBusy(false);
  }

  function displayedBadges(integration: OperationalIntegration) {
    if (integration.id !== "mock-roaster") return integration.badges;
    return integration.badges.map((badge) => badge === "Connected" || badge === "Not connected" ? (mockConnected ? "Connected" : "Not connected") : badge).filter((badge, index, all) => all.indexOf(badge) === index);
  }

  return (
    <div className="section-shell py-10 sm:py-14">
      <OperationalPageIntro description="Review future connection boundaries before credentials, procurement, or production rollout. Only the local roaster sandbox is executable; every partner connector is clearly planned." eyebrow="Platform operations · Connection registry" title="Integrations without hidden capabilities." />
      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3 text-xs text-[#a99b8c]"><Shield className="size-4 text-amber-300" /><span>{message}</span></div><label className="text-xs text-[#8b7e72]">Category<select className="form-control mt-2 sm:ml-3 sm:mt-0 sm:w-auto" onChange={(event) => setCategory(event.target.value as "all" | OperationalIntegrationCategory)} value={category}><option value="all">All integration categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label></div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((integration) => (
          <article className="glass-panel flex min-h-80 flex-col rounded-[1.6rem] p-5" key={integration.id}>
            <div className="flex items-start justify-between gap-4"><span className="grid size-11 place-items-center rounded-2xl border border-amber-300/12 bg-amber-300/[0.045]"><Cable className="size-5 text-amber-200/75" /></span><div className="flex flex-wrap justify-end gap-1.5">{displayedBadges(integration).map((badge) => <span className={`rounded-full border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] ${badgeStyle[badge]}`} key={badge}>{badge}</span>)}</div></div>
            <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.15em] text-[#766a5f]">{integration.category}</p><h2 className="mt-2 text-lg font-medium text-[#eee3d4]">{integration.name}</h2><p className="mt-1 text-[10px] text-[#766a5f]">{integration.vendor}</p><p className="mt-4 text-xs leading-5 text-[#a99b8c]">{integration.description}</p>
            <div className="mt-5 rounded-xl border border-white/[0.07] bg-black/10 p-3"><p className="text-[9px] uppercase tracking-[0.14em] text-[#75695e]">Data available</p><p className="mt-2 text-[11px] leading-5 text-[#b4a697]">{integration.dataAvailable.slice(0, 2).join(" · ")}{integration.dataAvailable.length > 2 ? ` · +${integration.dataAvailable.length - 2} more` : ""}</p></div>
            <dl className="mt-3 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-3 text-[10px]"><dt className="text-[#75695e]">Last synchronization</dt><dd className="text-right text-[#b8aa9b]">{integration.id === "mock-roaster" && mockConnected ? "Just now · local" : integration.lastSync ?? "Never"}</dd></dl>
            <div className="mt-auto pt-6"><button className="flex min-h-11 w-full items-center justify-between rounded-xl border border-white/[0.08] px-4 text-xs text-[#d5c8b9] hover:border-amber-300/20 hover:bg-amber-300/[0.035]" onClick={() => openIntegration(integration)} type="button"><span>{integration.mode === "mock" ? "Open sandbox setup" : "Review planned setup"}</span><ChevronRight className="size-4" /></button></div>
          </article>
        ))}
      </div>

      <div className="mt-6"><OperationalNotice><strong className="block text-[#ead8bd]">Control-capable does not mean controls are available.</strong>It identifies a future integration class requiring separate vendor, security, safety, authorization, audit, and physical-operator review. This foundation implements no production commands.</OperationalNotice></div>

      {selected ? (
        <div ref={dialogRef} tabIndex={-1} aria-labelledby="integration-title" aria-modal="true" className="fixed inset-0 z-[80] flex justify-end bg-black/70 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }} role="dialog">
          <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#120d0a] p-5 shadow-2xl scrollbar-subtle sm:p-8">
            <div className="flex items-start justify-between gap-5"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-300/70">{selected.category} · {selected.vendor}</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.04em]" id="integration-title">{selected.name}</h2></div><button ref={closeButtonRef} aria-label="Close integration details" className="grid size-11 place-items-center rounded-full hover:bg-white/5" onClick={() => setSelected(null)} type="button"><X className="size-5" /></button></div>
            <div className="mt-5 flex flex-wrap gap-2">{displayedBadges(selected).map((badge) => <span className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${badgeStyle[badge]}`} key={badge}>{badge}</span>)}</div>
            <p className="mt-6 text-sm leading-7 text-[#b3a596]">{selected.description}</p>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/[0.08] p-4"><dt className="text-[9px] uppercase tracking-[0.15em] text-[#75695e]">Connection status</dt><dd className="mt-2 flex items-center gap-2 text-sm text-[#ddd0c1]">{selected.id === "mock-roaster" && mockConnected ? <CheckCircle2 className="size-4 text-emerald-300" /> : <CircleOff className="size-4 text-[#817468]" />}{selected.id === "mock-roaster" && mockConnected ? "Connected locally" : "Not connected"}</dd></div><div className="rounded-2xl border border-white/[0.08] p-4"><dt className="text-[9px] uppercase tracking-[0.15em] text-[#75695e]">Last sync</dt><dd className="mt-2 text-sm text-[#ddd0c1]">{selected.id === "mock-roaster" && mockConnected ? "Just now · local" : selected.lastSync ?? "Never"}</dd></div><div className="rounded-2xl border border-white/[0.08] p-4 sm:col-span-2"><dt className="text-[9px] uppercase tracking-[0.15em] text-[#75695e]">Data direction</dt><dd className="mt-2 text-sm text-[#ddd0c1]">{selected.dataDirection}</dd></div></dl>
            <section className="mt-7"><h3 className="text-sm font-medium">Data available</h3><ul className="mt-3 space-y-2">{selected.dataAvailable.map((item) => <li className="flex items-center gap-3 rounded-xl border border-white/[0.06] p-3 text-xs text-[#ad9f90]" key={item}><Database className="size-3.5 text-amber-300/70" />{item}</li>)}</ul></section>
            <section className="mt-7"><h3 className="text-sm font-medium">Setup sequence</h3><ol className="mt-3 space-y-2">{selected.setupSummary.map((item, index) => <li className="flex gap-3 rounded-xl border border-white/[0.06] p-3 text-xs leading-5 text-[#ad9f90]" key={item}><span className="grid size-6 shrink-0 place-items-center rounded-full bg-amber-300/[0.08] font-mono text-[9px] text-amber-200">{index + 1}</span>{item}</li>)}</ol></section>
            <div className="mt-7"><OperationalNotice tone={selected.controlCapability === "control-capable" ? "red" : "neutral"}><strong className="block">Safety boundary</strong>{selected.safetyBoundary}</OperationalNotice></div>
            {selected.id === "mock-roaster" ? <button className={mockConnected ? "button-secondary mt-7 w-full" : "button-primary mt-7 w-full"} disabled={busy} onClick={toggleMockConnection} type="button"><PlugZap className="size-4" />{busy ? "Updating local connection…" : mockConnected ? "Disconnect local sandbox" : "Connect local sandbox"}</button> : <button className="button-secondary mt-7 w-full" disabled type="button">Planned · setup unavailable</button>}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
