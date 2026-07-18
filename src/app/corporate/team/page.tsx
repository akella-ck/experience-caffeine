import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, KeyRound, Mail, ShieldCheck, UserRoundCheck, Users } from "lucide-react";
import {
  CorporateMetricCard,
  CorporatePageHeader,
  CorporatePanel,
  CorporatePreviewNotice,
  CorporateProgress,
  CorporateSectionTitle,
} from "@/components/corporate/CorporateUI";
import { corporateTeam, roleDefinitions, teamSummary } from "@/data/corporate";

export const metadata: Metadata = {
  title: "Corporate Team",
  description: "Illustrative team roster, operational role definitions, internal learning completion, and permission boundaries.",
};

export default function CorporateTeamPage() {
  const averageLearning = Math.round(corporateTeam.reduce((sum, member) => sum + member.learningCompletion, 0) / corporateTeam.length);

  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 xl:px-10">
      <div className="relative mx-auto max-w-[92rem] space-y-10">
        <CorporatePageHeader
          eyebrow="Team"
          meta="Role model preview"
          title={<>Give every role the context it <span className="editorial-title text-[#e5af6c]">actually needs.</span></>}
          description="Operational roles keep learning, standards, and quality responsibilities legible. The roster below is an illustrative subset rather than a live directory."
          actions={<Link href="/corporate/settings" className="button-secondary">Access settings <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
        />
        <CorporatePreviewNotice>Roster, activity, invitations, credentials, and completion are mock data. No HR, payroll, email, or identity system is connected.</CorporatePreviewNotice>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Team summary">
          <CorporateMetricCard label="Team members" value={String(teamSummary.totalMembers)} detail={`${teamSummary.representedInPreview} represented below`} signal="on-track" icon={<Users className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="Active" value={String(teamSummary.activeMembers)} detail="Illustrative account state" signal="on-track" icon={<UserRoundCheck className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="Invited" value={String(teamSummary.invitedMembers)} detail="No email was actually sent" signal="review" icon={<Mail className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="Learning completion" value={`${averageLearning}%`} detail="Preview roster average" signal="review" icon={<BadgeCheck className="h-5 w-5" aria-hidden="true" />} />
        </section>

        <section>
          <CorporateSectionTitle eyebrow="Roster" title="People and readiness" description="Completion is shown beside role and location so it remains a support signal rather than a performance verdict." />
          <CorporatePanel className="mt-7 overflow-hidden">
            <div aria-label="Corporate team roster, horizontally scrollable" className="overflow-x-auto" role="region" tabIndex={0}>
              <table className="w-full min-w-[880px] border-collapse text-left">
                <caption className="sr-only">Corporate team roster</caption>
                <thead><tr className="bg-white/[0.02]">{["Team member", "Operational role", "Location", "Learning", "Internal acknowledgements", "Activity"].map((heading) => <th key={heading} scope="col" className="px-5 py-4 text-[0.58rem] font-medium uppercase tracking-[0.13em] text-[#b5a797] sm:px-6">{heading}</th>)}</tr></thead>
                <tbody>{corporateTeam.map((member) => <tr key={member.id} className="border-t border-white/[0.06]"><th scope="row" className="px-5 py-5 sm:px-6"><div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#84502f] text-[0.62rem] font-semibold text-[#f1dcc0]">{member.initials}</span><span><span className="block text-sm font-medium text-[#ddd0bd]">{member.name}</span><span className="mt-1 block text-[0.6rem] text-[#a99c8e]">{member.status}</span></span></div></th><td className="px-5 py-5 text-xs font-medium text-[#b5a795] sm:px-6">{member.role}</td><td className="px-5 py-5 text-xs text-[#a99c8e] sm:px-6">{member.location}</td><td className="w-44 px-5 py-5 sm:px-6"><CorporateProgress value={member.learningCompletion} label="Completion" /></td><td className="max-w-xs px-5 py-5 sm:px-6"><div className="flex flex-wrap gap-1.5">{member.certifications.length ? member.certifications.map((item) => <span key={item} className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[0.58rem] text-[#a99c8e]">{item}</span>) : <span className="text-xs text-[#a99c8e]">None recorded</span>}</div></td><td className="px-5 py-5 font-mono text-[0.6rem] text-[#a99c8e] sm:px-6">{member.lastActive}</td></tr>)}</tbody>
              </table>
            </div>
          </CorporatePanel>
        </section>

        <section>
          <CorporateSectionTitle eyebrow="Access model" title="Eight operational roles, bounded by work" description="These are product-level permission intentions. Production authorization still requires server-side enforcement, tenancy, audit history, and organization policy." />
          <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {roleDefinitions.map((definition) => (
              <CorporatePanel key={definition.role} className="p-5">
                <div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl border border-amber-300/12 bg-amber-300/[0.05]"><KeyRound className="h-4 w-4 text-amber-300/70" aria-hidden="true" /></span><span className="font-mono text-[0.57rem] uppercase tracking-[0.11em] text-[#675e55]">{definition.scope}</span></div>
                <h3 className="mt-6 text-lg font-medium text-[#e4d7c4]">{definition.role}</h3>
                <ul className="mt-5 space-y-2">{definition.permissions.map((permission) => <li key={permission} className="flex gap-2 text-xs leading-5 text-[#8f8377]"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300/55" aria-hidden="true" />{permission}</li>)}</ul>
              </CorporatePanel>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
