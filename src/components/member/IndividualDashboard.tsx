"use client";

import {
  ArrowRight,
  BookOpenCheck,
  Coffee,
  Gauge,
  History,
  NotebookPen,
  Sparkles,
  Star,
  UserRound,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { brewMethods, coffeeOrigins, grinders, journalEntries } from "@/data";
import {
  savedRecipeHref,
  savedRecipes,
} from "@/features/member/demo-member-data";
import { useMemberPreferences } from "@/features/member/use-member-preferences";

const quickActions = [
  { href: "/brew-lab", label: "Build a recipe", detail: "Match coffee, brewer, and grinder", icon: Coffee },
  { href: "/troubleshoot", label: "Fix a brew", detail: "Turn taste into one next adjustment", icon: Wrench },
  { href: "/journal", label: "Open journal", detail: "Compare your recent cups", icon: NotebookPen },
  { href: "/learn", label: "Continue learning", detail: "Practice one variable at a time", icon: BookOpenCheck },
] as const;

export function IndividualDashboard() {
  const { session } = useAuth();
  const { preferences } = useMemberPreferences();
  const primaryGrinder = grinders.find((grinder) => grinder.id === preferences.primaryGrinderId);
  const primaryMethod = brewMethods.find((method) => method.id === preferences.primaryMethodId);
  const recentBrews = journalEntries.slice(0, 3);
  const lastUsedMethod = brewMethods.find((method) => method.id === recentBrews[0]?.brewMethodId);
  const preferredOrigins = coffeeOrigins
    .filter((origin) => preferences.preferredOriginIds.includes(origin.id))
    .map((origin) => origin.name)
    .join(" · ");

  return (
    <main className="relative overflow-hidden bg-[#0b0908] pb-24 pt-28 text-[#f7f0e5] sm:pt-36">
      <div className="ambient-grid pointer-events-none absolute inset-x-0 top-0 h-[52rem] opacity-65" />
      <div className="pointer-events-none absolute right-[8%] top-20 size-96 rounded-full bg-[#a75f2c]/10 blur-[120px]" />

      <div className="section-shell relative">
        <section className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow">Individual workspace</p>
            <h1 className="page-title mt-6 max-w-4xl">Welcome back, <span className="editorial-title amber-text">{session?.displayName.split(" ")[0] ?? "brewer"}.</span></h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[#b8aa99] sm:text-lg">
              Pick up a saved recipe, diagnose the last cup, or turn one lesson into a measured experiment.
            </p>
          </div>
          <Link className="button-primary" href="/brew-lab">Build today’s recipe <ArrowRight aria-hidden="true" className="size-4" /></Link>
        </section>

        <section aria-label="Brewing summary" className="mt-10 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {[
            { label: "Brews this month", value: "6", detail: "2 methods" },
            { label: "Average rating", value: "4.6", detail: "out of 5" },
            { label: "Saved recipes", value: String(savedRecipes.length), detail: "ready to brew" },
            { label: "Last used method", value: lastUsedMethod?.name ?? "—", detail: "most recent journal entry" },
          ].map((item) => (
            <div className="glass-panel rounded-2xl p-4 sm:p-5" key={item.label}>
              <p className="text-[9px] uppercase tracking-[0.16em] text-[#75695e]">{item.label}</p>
              <p className="mt-5 text-2xl font-medium tracking-[-0.04em] text-[#f1e7da] sm:text-3xl">{item.value}</p>
              <p className="mt-1 text-[10px] text-[#7e7165]">{item.detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-14" aria-labelledby="quick-actions-title">
          <div className="flex items-end justify-between gap-5">
            <div><p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-amber-300/70">Next move</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.04em]" id="quick-actions-title">What do you want to improve?</h2></div>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map(({ href, label, detail, icon: Icon }) => (
              <Link className="group glass-panel rounded-[1.4rem] p-5 transition hover:border-amber-300/25" href={href} key={href}>
                <span className="grid size-10 place-items-center rounded-xl border border-amber-300/10 bg-amber-300/[0.05]"><Icon aria-hidden="true" className="size-4 text-amber-200" /></span>
                <h3 className="mt-7 text-lg font-medium tracking-[-0.025em] text-[#ede2d3]">{label}</h3>
                <p className="mt-2 text-xs leading-5 text-[#8d8074]">{detail}</p>
                <ArrowRight aria-hidden="true" className="mt-5 size-4 text-[#796b5f] transition-transform group-hover:translate-x-1 group-hover:text-amber-200" />
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <section className="glass-panel rounded-[2rem] p-5 sm:p-7" aria-labelledby="saved-recipes-title">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-amber-300/70">Saved recipes</p><h2 className="mt-3 text-2xl font-medium tracking-[-0.035em]" id="saved-recipes-title">Your repeatable starting points.</h2></div>
              <Link className="button-quiet !min-h-10 !px-2" href="/journal">View brew history <ArrowRight aria-hidden="true" className="size-3.5" /></Link>
            </div>
            <div className="mt-7 space-y-3">
              {savedRecipes.map((recipe) => {
                const method = brewMethods.find((candidate) => candidate.id === recipe.brewMethodId);
                const grinder = grinders.find((candidate) => candidate.id === recipe.grinderId);
                return (
                  <article className="grid gap-4 rounded-2xl border border-white/[0.07] bg-black/10 p-4 sm:grid-cols-[1fr_auto] sm:items-center" key={recipe.id}>
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><h3 className="font-medium text-[#eee3d4]">{recipe.name}</h3><span className="flex items-center gap-1 text-[10px] text-amber-200/70"><Star aria-hidden="true" className="size-3 fill-current" />{recipe.rating}.0</span></div>
                      <p className="mt-1 text-xs text-[#84776c]">{method?.name} · {grinder?.name} · {recipe.cupSizeGrams} g</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">{recipe.flavorNotes.map((note) => <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[9px] text-[#aa9b8b]" key={note}>{note}</span>)}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <Link className="button-quiet !min-h-10 !px-3" href={savedRecipeHref(recipe)}>Open &amp; modify</Link>
                      <Link className="button-secondary !min-h-10 !px-3" href={`${savedRecipeHref(recipe)}&duplicate=${recipe.id}`}>Duplicate to Brew Lab <ArrowRight aria-hidden="true" className="size-3.5" /></Link>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 border-t border-white/[0.07] pt-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2"><History aria-hidden="true" className="size-4 text-amber-300/65" /><h3 className="text-sm font-medium text-[#ddcfbf]">Recent journal brews</h3></div>
                <Link className="text-[10px] text-[#8d7e70] hover:text-amber-200" href="/journal">See all entries</Link>
              </div>
              <ul className="mt-4 divide-y divide-white/[0.06]">
                {recentBrews.map((entry) => {
                  const method = brewMethods.find((candidate) => candidate.id === entry.brewMethodId);
                  return (
                    <li className="grid gap-2 py-3 text-xs sm:grid-cols-[1fr_auto] sm:items-center" key={entry.id}>
                      <div><p className="font-medium text-[#cfc1b0]">{entry.coffeeName}</p><p className="mt-1 text-[10px] text-[#776b60]">{method?.name} · {entry.grindSetting} · {entry.brewTimeSeconds}s</p></div>
                      <div className="flex items-center gap-2 text-[10px] text-[#8e8174]"><span>{new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}</span><span aria-label={`${entry.rating} out of 5 stars`} className="flex items-center gap-1 text-amber-200/70"><Star aria-hidden="true" className="size-3 fill-current" />{entry.rating}</span></div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <div className="space-y-5">
            <section className="glass-panel rounded-[2rem] p-6" aria-labelledby="equipment-title">
              <div className="flex items-center justify-between"><Gauge aria-hidden="true" className="size-5 text-amber-300/70" /><Link href="/profile" className="text-[10px] text-[#8d7e70] hover:text-amber-200">Edit profile</Link></div>
              <h2 className="mt-6 text-xl font-medium" id="equipment-title">Your brew setup</h2>
              <dl className="mt-5 space-y-3 text-xs">
                <div className="flex justify-between gap-3 border-b border-white/[0.06] pb-3"><dt className="text-[#7e7165]">Grinder</dt><dd className="text-right text-[#cbbdac]">{primaryGrinder?.name}</dd></div>
                <div className="flex justify-between gap-3 border-b border-white/[0.06] pb-3"><dt className="text-[#7e7165]">Primary method</dt><dd className="text-right text-[#cbbdac]">{primaryMethod?.name}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-[#7e7165]">Favorite origins</dt><dd className="text-right text-[#cbbdac]">{preferredOrigins}</dd></div>
              </dl>
            </section>
            <section className="relative overflow-hidden rounded-[2rem] border border-amber-300/15 bg-amber-300/[0.045] p-6">
              <Sparkles aria-hidden="true" className="size-5 text-amber-300/70" />
              <p className="mt-7 font-mono text-[0.59rem] uppercase tracking-[0.16em] text-amber-200/60">Continue learning</p>
              <h2 className="mt-3 text-xl font-medium tracking-[-0.025em]">How grind size changes extraction</h2>
              <p className="mt-3 text-xs leading-5 text-[#9c8e80]">Resume the interactive model, then apply it to one saved recipe.</p>
              <Link className="button-primary mt-6 w-full" href="/learn/grind-size">Resume lesson <ArrowRight aria-hidden="true" className="size-4" /></Link>
            </section>
          </div>
        </div>

        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-white/[0.07] p-4 text-xs leading-5 text-[#84776b]">
          <UserRound aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-300/60" />
          This foundational dashboard uses typed demo data. Profile preferences persist locally; cloud sync is a future integration.
        </div>
      </div>
    </main>
  );
}
