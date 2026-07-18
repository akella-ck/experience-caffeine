"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Coffee, RotateCcw, Save, Settings2, UserRound } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { brewMethods, coffeeOrigins, grinders } from "@/data";
import {
  defaultMemberPreferences,
  savedRecipeHref,
  savedRecipes,
  type BrewGoal,
  type ExperienceLevel,
  type MemberPreferences,
} from "@/features/member/demo-member-data";
import { useMemberPreferences } from "@/features/member/use-member-preferences";
import type { BrewMethodId, GrinderId, OriginId, RoastLevel } from "@/types";

const experienceOptions: { id: ExperienceLevel; label: string; detail: string }[] = [
  { id: "new", label: "New to brewing", detail: "Explain each variable and technique." },
  { id: "comfortable", label: "Comfortable", detail: "Balance guidance with faster controls." },
  { id: "advanced", label: "Advanced", detail: "Lead with measurements and adjustment ranges." },
];

const goalOptions: { id: BrewGoal; label: string }[] = [
  { id: "balanced", label: "Balance" },
  { id: "clarity", label: "Clarity" },
  { id: "sweetness", label: "Sweetness" },
  { id: "body", label: "Body" },
];

const roastOptions: { id: RoastLevel; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "medium", label: "Medium" },
  { id: "medium-dark", label: "Medium-dark" },
  { id: "dark", label: "Dark" },
];

type ProfileFormProps = {
  initialPreferences: MemberPreferences;
  onReset: () => void;
  onSave: (preferences: MemberPreferences) => void;
};

function ProfileForm({ initialPreferences, onReset, onSave }: ProfileFormProps) {
  const [draft, setDraft] = useState<MemberPreferences>(initialPreferences);
  const [status, setStatus] = useState("");

  function update<Key extends keyof MemberPreferences>(key: Key, value: MemberPreferences[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setStatus("");
  }

  function toggleOrigin(originId: OriginId) {
    const selected = draft.preferredOriginIds.includes(originId);
    if (selected && draft.preferredOriginIds.length === 1) {
      setStatus("Keep at least one favorite origin selected.");
      return;
    }
    update(
      "preferredOriginIds",
      selected
        ? draft.preferredOriginIds.filter((id) => id !== originId)
        : [...draft.preferredOriginIds, originId],
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(draft);
    setStatus("Preferences saved on this device.");
  }

  function reset() {
    setDraft(defaultMemberPreferences);
    onReset();
    setStatus("Demo preferences restored.");
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <section aria-labelledby="experience-title" className="glass-panel rounded-[2rem] p-5 sm:p-7">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-amber-300/65">Learning pace</p>
        <h2 className="mt-3 text-2xl font-medium tracking-[-0.035em]" id="experience-title">How should lessons meet you?</h2>
        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          {experienceOptions.map((option) => {
            const selected = draft.experienceLevel === option.id;
            return (
              <button
                aria-pressed={selected}
                className={`rounded-2xl border p-4 text-left transition ${selected ? "border-amber-300/35 bg-amber-300/[0.08]" : "border-white/[0.07] bg-black/10 hover:border-white/[0.14]"}`}
                key={option.id}
                onClick={() => update("experienceLevel", option.id)}
                type="button"
              >
                <span className="flex items-center justify-between gap-2 text-sm font-medium text-[#e9decf]">{option.label}{selected ? <Check aria-hidden="true" className="size-4 text-amber-300" /> : null}</span>
                <span className="mt-2 block text-[10px] leading-4 text-[#83766b]">{option.detail}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="equipment-preferences-title" className="glass-panel rounded-[2rem] p-5 sm:p-7">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl border border-amber-300/12 bg-amber-300/[0.05]"><Settings2 aria-hidden="true" className="size-4 text-amber-200" /></span><div><p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-amber-300/60">Equipment defaults</p><h2 className="mt-1 text-2xl font-medium tracking-[-0.035em]" id="equipment-preferences-title">Your everyday setup</h2></div></div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="block text-xs font-medium text-[#d5c8b8]">Primary grinder
            <select className="form-control mt-2" onChange={(event) => update("primaryGrinderId", event.target.value as GrinderId)} value={draft.primaryGrinderId}>
              {grinders.map((grinder) => <option key={grinder.id} value={grinder.id}>{grinder.name}</option>)}
            </select>
          </label>
          <label className="block text-xs font-medium text-[#d5c8b8]">Most-used brewer
            <select className="form-control mt-2" onChange={(event) => update("primaryMethodId", event.target.value as BrewMethodId)} value={draft.primaryMethodId}>
              {brewMethods.map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}
            </select>
          </label>
          <label className="block text-xs font-medium text-[#d5c8b8]">Preferred roast
            <select className="form-control mt-2" onChange={(event) => update("preferredRoast", event.target.value as RoastLevel)} value={draft.preferredRoast}>
              {roastOptions.map((roast) => <option key={roast.id} value={roast.id}>{roast.label}</option>)}
            </select>
          </label>
          <fieldset>
            <legend className="text-xs font-medium text-[#d5c8b8]">Cup goal</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {goalOptions.map((goal) => <button aria-pressed={draft.brewGoal === goal.id} className={`min-h-11 rounded-xl border px-3 text-xs transition ${draft.brewGoal === goal.id ? "border-amber-300/35 bg-amber-300/[0.08] text-amber-100" : "border-white/[0.07] text-[#998b7d] hover:border-white/[0.14]"}`} key={goal.id} onClick={() => update("brewGoal", goal.id)} type="button">{goal.label}</button>)}
            </div>
          </fieldset>
        </div>
        <fieldset className="mt-7">
          <legend className="text-xs font-medium text-[#d5c8b8]">Favorite origins</legend>
          <p className="mt-1 text-[10px] text-[#796d62]">Used to prioritize relevant beans and lessons. Choose at least one.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {coffeeOrigins.map((origin) => {
              const selected = draft.preferredOriginIds.includes(origin.id);
              return <button aria-pressed={selected} className={`min-h-11 rounded-full border px-4 text-xs transition ${selected ? "border-amber-300/30 bg-amber-300/[0.08] text-amber-100" : "border-white/[0.07] text-[#948678] hover:border-white/[0.14]"}`} key={origin.id} onClick={() => toggleOrigin(origin.id)} type="button">{origin.name}</button>;
            })}
          </div>
        </fieldset>
      </section>

      <div className="flex flex-col-reverse gap-3 rounded-[1.5rem] border border-white/[0.07] bg-black/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p aria-live="polite" className="min-h-5 text-xs text-amber-100/75">{status}</p><p className="text-[10px] leading-4 text-[#71665d]">Demo preferences stay in this browser and are not uploaded.</p></div>
        <div className="flex gap-2"><button className="button-quiet" onClick={reset} type="button"><RotateCcw aria-hidden="true" className="size-3.5" />Reset</button><button className="button-primary" type="submit"><Save aria-hidden="true" className="size-4" />Save preferences</button></div>
      </div>
    </form>
  );
}

export function ProfileClient() {
  const { session } = useAuth();
  const { isHydrated, preferences, resetPreferences, savePreferences } = useMemberPreferences();

  return (
    <main className="relative overflow-hidden bg-[#0b0908] pb-24 pt-28 text-[#f7f0e5] sm:pt-36">
      <div className="ambient-grid pointer-events-none absolute inset-x-0 top-0 h-[48rem] opacity-60" />
      <div className="section-shell relative">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
          <div>
            <p className="eyebrow">Member profile</p>
            <h1 className="page-title mt-6">Make every recommendation feel <span className="editorial-title amber-text">familiar.</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#a99b8d]">Set the equipment you reach for and the cups you enjoy. These defaults shape the starting context without pretending one recipe fits every coffee.</p>
            <div className="mt-10">
              {isHydrated ? <ProfileForm initialPreferences={preferences} onReset={resetPreferences} onSave={savePreferences} /> : <div className="glass-panel grid min-h-80 place-items-center rounded-[2rem] text-sm text-[#8f8174]">Loading your local preferences…</div>}
            </div>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-28">
            <section className="glass-panel rounded-[2rem] p-6" aria-labelledby="account-title">
              <span className="grid size-11 place-items-center rounded-2xl border border-amber-300/15 bg-amber-300/[0.06]"><UserRound aria-hidden="true" className="size-5 text-amber-200" /></span>
              <h2 className="mt-6 text-lg font-medium" id="account-title">{session?.displayName ?? "Individual member"}</h2>
              <p className="mt-1 break-all text-[10px] text-[#817469]">{session?.email}</p>
              <p className="mt-5 rounded-xl border border-white/[0.06] bg-black/10 px-3 py-2 text-[10px] leading-4 text-[#776b60]">Individual demo workspace · local data only</p>
              <Link className="button-secondary mt-5 w-full" href="/dashboard">Back to dashboard <ArrowRight aria-hidden="true" className="size-3.5" /></Link>
            </section>

            <section className="glass-panel rounded-[2rem] p-6" aria-labelledby="profile-recipes-title">
              <div className="flex items-center gap-2"><Coffee aria-hidden="true" className="size-4 text-amber-300/70" /><h2 className="text-sm font-medium" id="profile-recipes-title">Saved starting points</h2></div>
              <ul className="mt-4 divide-y divide-white/[0.06]">
                {savedRecipes.map((recipe) => <li className="py-3" key={recipe.id}><Link className="group flex items-center justify-between gap-3" href={savedRecipeHref(recipe)}><span><span className="block text-xs text-[#cbbdad]">{recipe.name}</span><span className="mt-1 block text-[9px] text-[#74685e]">{recipe.lastBrewed} · {recipe.cupSizeGrams} g</span></span><ArrowRight aria-hidden="true" className="size-3.5 text-[#6f6359] transition group-hover:translate-x-0.5 group-hover:text-amber-200" /></Link></li>)}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
