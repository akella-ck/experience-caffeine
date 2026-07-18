"use client";

import { RotateCcw, Save } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { CorporatePreferences } from "@/data/corporate";
import { CorporatePanel } from "@/components/corporate/CorporateUI";

export function CorporateSettingsForm({ defaults }: { defaults: CorporatePreferences }) {
  const [preferences, setPreferences] = useState(defaults);
  const [saved, setSaved] = useState(false);

  function update<Key extends keyof CorporatePreferences>(key: Key, value: CorporatePreferences[Key]) {
    setPreferences((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); setSaved(true); }} className="space-y-5">
      <CorporatePanel className="p-6 sm:p-7">
        <h2 className="text-xl font-medium tracking-[-0.03em] text-[#e6d9c6]">Organization identity</h2>
        <p className="mt-2 text-xs leading-5 text-[#7f7368]">Preview labels only; these values do not create or rename a production organization.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <SettingField id="organization-name" label="Organization name"><input id="organization-name" className="form-control" value={preferences.organizationName} onChange={(event) => update("organizationName", event.target.value)} /></SettingField>
          <SettingField id="program-name" label="Program name"><input id="program-name" className="form-control" value={preferences.programName} onChange={(event) => update("programName", event.target.value)} /></SettingField>
        </div>
      </CorporatePanel>

      <CorporatePanel className="p-6 sm:p-7">
        <h2 className="text-xl font-medium tracking-[-0.03em] text-[#e6d9c6]">Measurement and publishing defaults</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <SettingField id="unit-system" label="Unit system"><select id="unit-system" className="form-control" value={preferences.unitSystem} onChange={(event) => update("unitSystem", event.target.value as CorporatePreferences["unitSystem"])}><option>Metric</option><option>Imperial</option></select></SettingField>
          <SettingField id="temperature-unit" label="Temperature"><select id="temperature-unit" className="form-control" value={preferences.temperatureUnit} onChange={(event) => update("temperatureUnit", event.target.value as CorporatePreferences["temperatureUnit"])}><option>Celsius</option><option>Fahrenheit</option></select></SettingField>
          <SettingField id="recipe-visibility" label="Default recipe visibility"><select id="recipe-visibility" className="form-control" value={preferences.defaultRecipeVisibility} onChange={(event) => update("defaultRecipeVisibility", event.target.value as CorporatePreferences["defaultRecipeVisibility"])}><option>Organization</option><option>Location</option><option>Private draft</option></select></SettingField>
          <SettingField id="quality-digest" label="Quality digest"><select id="quality-digest" className="form-control" value={preferences.qualityDigest} onChange={(event) => update("qualityDigest", event.target.value as CorporatePreferences["qualityDigest"])}><option>Daily</option><option>Weekly</option><option>Off</option></select></SettingField>
        </div>
      </CorporatePanel>

      <CorporatePanel className="p-6 sm:p-7">
        <h2 className="text-xl font-medium tracking-[-0.03em] text-[#e6d9c6]">Workflow defaults</h2>
        <div className="mt-6 space-y-3">
          <ToggleRow label="Learning reminders" detail="Preview the organization preference for reminder delivery; no notifications are sent." checked={preferences.learningReminders} onChange={(checked) => update("learningReminders", checked)} />
          <ToggleRow label="Require standard approval" detail="Keep drafts separate from service references. Server-side approval enforcement is future work." checked={preferences.requireStandardApproval} onChange={(checked) => update("requireStandardApproval", checked)} />
        </div>
      </CorporatePanel>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="button-primary"><Save className="h-4 w-4" aria-hidden="true" />Save in this session</button>
        <button type="button" onClick={() => { setPreferences(defaults); setSaved(false); }} className="button-secondary"><RotateCcw className="h-4 w-4" aria-hidden="true" />Reset preview</button>
        <p aria-live="polite" className={`text-xs text-emerald-200/70 ${saved ? "opacity-100" : "opacity-0"}`}>{saved ? "Preferences applied to this page session only." : "Settings status"}</p>
      </div>
    </form>
  );
}

function SettingField({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return <div><label htmlFor={id} className="mb-2 block text-xs font-medium text-[#cfc1ae]">{label}</label>{children}</div>;
}

function ToggleRow({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex cursor-pointer items-start justify-between gap-5 rounded-xl border border-white/[0.07] bg-black/10 p-4"><span><span className="block text-sm font-medium text-[#d8cab7]">{label}</span><span className="mt-1 block max-w-2xl text-xs leading-5 text-[#7f7368]">{detail}</span></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-amber-400" /></label>;
}
