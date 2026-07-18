import type { Metadata } from "next";
import { Bell, Database, KeyRound, Settings2 } from "lucide-react";
import { CorporateSettingsForm } from "@/components/corporate/CorporateSettingsForm";
import {
  CorporatePageHeader,
  CorporatePanel,
  CorporatePreviewNotice,
  CorporateSectionTitle,
} from "@/components/corporate/CorporateUI";
import { defaultCorporatePreferences, settingsReadiness } from "@/data/corporate";

export const metadata: Metadata = {
  title: "Corporate Settings",
  description: "Local corporate organization preferences with transparent identity, persistence, notification, and audit readiness labels.",
};

const readinessIcons = [KeyRound, Database, Bell, Settings2];

export default function CorporateSettingsPage() {
  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 xl:px-10">
      <div className="relative mx-auto max-w-[92rem] space-y-10">
        <CorporatePageHeader
          eyebrow="Settings"
          meta="Local preview"
          title={<>Configure the workflow without hiding what still needs a <span className="editorial-title text-[#e5af6c]">backend.</span></>}
          description="Evaluate organization, measurement, publishing, learning, and approval defaults locally. Changes stay in this page session and do not alter authentication or production data."
        />
        <CorporatePreviewNotice>Settings are not persisted to an organization, audit log, identity provider, notification service, or server.</CorporatePreviewNotice>

        <section className="grid gap-7 xl:grid-cols-[.62fr_1.38fr] xl:items-start">
          <CorporateSectionTitle eyebrow="Readiness" title="What each control means today" description="Foundation, local preview, and planned states are kept visible so a polished control is not mistaken for production infrastructure." />
          <div className="grid gap-3 sm:grid-cols-2">
            {settingsReadiness.map((item, index) => {
              const Icon = readinessIcons[index] ?? Settings2;
              return <CorporatePanel key={item.id} className="p-5"><div className="flex items-center justify-between"><Icon className="h-4 w-4 text-amber-300/70" aria-hidden="true" /><span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-[0.57rem] text-[#8d8175]">{item.status}</span></div><h2 className="mt-6 text-lg font-medium text-[#e1d4c1]">{item.label}</h2><p className="mt-3 text-xs leading-6 text-[#8f8377]">{item.detail}</p></CorporatePanel>;
            })}
          </div>
        </section>

        <section>
          <CorporateSectionTitle eyebrow="Organization preferences" title="Local control preview" description="Use these controls to evaluate information architecture and defaults. Save applies only to in-memory state on this page." />
          <div className="mt-7"><CorporateSettingsForm defaults={defaultCorporatePreferences} /></div>
        </section>
      </div>
    </main>
  );
}
