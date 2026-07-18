"use client";

import { Plus, RotateCcw, Wrench } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import type { CorporateEquipment } from "@/data/corporate";
import { CorporatePanel } from "@/components/corporate/CorporateUI";

type FilterValue = "all" | string;

export function CorporateEquipmentInventory({ initialEquipment }: { initialEquipment: CorporateEquipment[] }) {
  const [equipment, setEquipment] = useState(initialEquipment);
  const [location, setLocation] = useState<FilterValue>("all");
  const [category, setCategory] = useState<FilterValue>("all");
  const [status, setStatus] = useState("");

  const locations = [...new Set(equipment.map((item) => item.location))];
  const categories = [...new Set(equipment.map((item) => item.category))];
  const filtered = useMemo(() => equipment.filter((item) => (location === "all" || item.location === location) && (category === "all" || item.category === category)), [category, equipment, location]);

  function addEquipment(form: FormData) {
    const name = String(form.get("name") ?? "").trim();
    const model = String(form.get("model") ?? "").trim();
    const nextLocation = String(form.get("location") ?? "").trim();
    const nextCategory = String(form.get("category") ?? "Grinder") as CorporateEquipment["category"];
    if (!name || !model || !nextLocation) return;
    const item: CorporateEquipment = {
      id: `local-${Date.now()}`,
      name,
      category: nextCategory,
      model,
      location: nextLocation,
      station: String(form.get("station") ?? "Unassigned").trim() || "Unassigned",
      status: "Calibration due",
      dataMode: "Manual",
      lastCheck: "Not checked",
      nextAction: "Complete the organization’s approved intake and calibration check",
      owner: String(form.get("owner") ?? "Unassigned").trim() || "Unassigned",
    };
    setEquipment((current) => [item, ...current]);
    setStatus(`${name} added to this page session only.`);
  }

  return (
    <div className="space-y-6">
      <CorporatePanel className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            <label><span className="mb-2 block text-[0.6rem] uppercase tracking-[0.12em] text-[#74695f]">Location</span><select value={location} onChange={(event) => setLocation(event.target.value)} className="form-control text-xs"><option value="all">All locations</option>{locations.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span className="mb-2 block text-[0.6rem] uppercase tracking-[0.12em] text-[#74695f]">Category</span><select value={category} onChange={(event) => setCategory(event.target.value)} className="form-control text-xs"><option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          <button type="button" onClick={() => { setLocation("all"); setCategory("all"); }} className="button-quiet shrink-0"><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />Reset</button>
        </div>
      </CorporatePanel>

      <p aria-live="polite" className={`min-h-5 text-xs text-amber-200/70 ${status ? "opacity-100" : "opacity-0"}`}>{status || "Equipment status"}</p>

      <CorporatePanel className="overflow-hidden">
        <div aria-label="Equipment inventory, horizontally scrollable" className="overflow-x-auto" role="region" tabIndex={0}>
          <table className="w-full min-w-[980px] border-collapse text-left">
            <caption className="sr-only">Corporate equipment inventory</caption>
            <thead><tr className="bg-white/[0.02]">{["Equipment", "Location / station", "Status", "Data mode", "Last check", "Next action", "Owner"].map((heading) => <th key={heading} scope="col" className="px-5 py-4 text-[0.58rem] font-medium uppercase tracking-[0.13em] text-[#b5a797]">{heading}</th>)}</tr></thead>
            <tbody>{filtered.map((item) => <tr key={item.id} className="border-t border-white/[0.06]"><th scope="row" className="px-5 py-5"><span className="block text-sm font-medium text-[#ddd0bd]">{item.name}</span><span className="mt-1 block text-[0.62rem] text-[#a99c8e]">{item.category} · {item.model}</span></th><td className="px-5 py-5 text-xs text-[#a99c8e]">{item.location}<span className="mt-1 block text-[0.6rem] text-[#a99c8e]">{item.station}</span></td><td className="px-5 py-5"><span className={`rounded-full border px-2.5 py-1 text-[0.6rem] ${item.status === "Ready" ? "border-emerald-300/15 bg-emerald-300/[0.05] text-emerald-200/80" : item.status === "Calibration due" ? "border-amber-300/15 bg-amber-300/[0.05] text-amber-200/80" : "border-rose-300/15 bg-rose-300/[0.05] text-rose-200/80"}`}>{item.status}</span></td><td className="px-5 py-5 text-xs text-[#a99c8e]">{item.dataMode}</td><td className="px-5 py-5 text-xs text-[#a99c8e]">{item.lastCheck}</td><td className="max-w-xs px-5 py-5 text-xs leading-5 text-[#a99c8e]">{item.nextAction}</td><td className="px-5 py-5 text-xs text-[#a99c8e]">{item.owner}</td></tr>)}</tbody>
          </table>
        </div>
        {filtered.length === 0 ? <div className="border-t border-white/[0.06] p-10 text-center text-sm text-[#8f8377]">No equipment matches both filters.</div> : null}
      </CorporatePanel>

      <details id="equipment-intake" className="group scroll-mt-28 rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"><span><span className="flex items-center gap-2 text-sm font-medium text-[#e4d7c5]"><Plus className="h-4 w-4 text-amber-300/70" aria-hidden="true" />Add equipment to this preview</span><span className="mt-2 block text-xs text-[#a99c8e]">Session-only intake; no server record or integration is created.</span></span><span className="text-[#a99c8e] transition-transform group-open:rotate-45">+</span></summary>
        <form action={addEquipment} className="mt-7 grid gap-4 border-t border-white/[0.07] pt-7 sm:grid-cols-2 lg:grid-cols-3">
          <IntakeField label="Equipment name" id="equipment-name"><input id="equipment-name" name="name" required className="form-control" placeholder="Filter grinder 02" /></IntakeField>
          <IntakeField label="Model or reference" id="equipment-model"><input id="equipment-model" name="model" required className="form-control" placeholder="Manufacturer / model" /></IntakeField>
          <IntakeField label="Category" id="equipment-category"><select id="equipment-category" name="category" className="form-control">{["Grinder", "Brewer", "Espresso machine", "Scale", "Roaster"].map((item) => <option key={item}>{item}</option>)}</select></IntakeField>
          <IntakeField label="Location" id="equipment-location"><input id="equipment-location" name="location" required className="form-control" placeholder="Location name" /></IntakeField>
          <IntakeField label="Station" id="equipment-station"><input id="equipment-station" name="station" className="form-control" placeholder="Main bar" /></IntakeField>
          <IntakeField label="Owner" id="equipment-owner"><input id="equipment-owner" name="owner" className="form-control" placeholder="Café lead" /></IntakeField>
          <div className="sm:col-span-2 lg:col-span-3"><button type="submit" className="button-primary"><Wrench className="h-4 w-4" aria-hidden="true" />Add session-only record</button></div>
        </form>
      </details>
    </div>
  );
}

function IntakeField({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return <div><label htmlFor={id} className="mb-2 block text-xs font-medium text-[#cfc1ae]">{label}</label>{children}</div>;
}
