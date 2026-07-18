import type { Metadata } from "next";
import { CircleAlert, Link2, Settings2, ShieldCheck, Wrench } from "lucide-react";
import { CorporateEquipmentInventory } from "@/components/corporate/CorporateEquipmentInventory";
import {
  CorporateMetricCard,
  CorporatePageHeader,
  CorporatePanel,
  CorporatePreviewNotice,
  CorporateSectionTitle,
} from "@/components/corporate/CorporateUI";
import { corporateEquipment, equipmentStatusSummary } from "@/data/corporate";

export const metadata: Metadata = {
  title: "Corporate Equipment",
  description: "A typed, manual corporate coffee-equipment registry with readiness, calibration, service, ownership, and honest connector status.",
};

export default function CorporateEquipmentPage() {
  const manualCount = corporateEquipment.filter((item) => item.dataMode === "Manual").length;
  const prototypeCount = corporateEquipment.filter((item) => item.dataMode === "Prototype connector").length;

  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 xl:px-10">
      <div className="relative mx-auto max-w-[92rem] space-y-10">
        <CorporatePageHeader
          eyebrow="Equipment"
          meta="Manual registry"
          title={<>Keep the machine context beside the <span className="editorial-title text-[#e5af6c]">quality signal.</span></>}
          description="Record what is installed, where it works, who owns the check, and whether a value is manual or connected. The registry does not replace manufacturer maintenance or safety procedures."
          actions={<a href="#equipment-intake" className="button-primary">Add Equipment <Wrench className="h-4 w-4" aria-hidden="true" /></a>}
        />
        <CorporatePreviewNotice>Inventory and checks are illustrative or session-only. No equipment is remotely controlled, monitored, or serviced by this platform.</CorporatePreviewNotice>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Equipment summary">
          {equipmentStatusSummary.map((item, index) => <CorporateMetricCard key={item.label} label={item.label} value={String(item.count)} detail="Preview inventory records" signal={index === 0 ? "on-track" : index === 1 ? "review" : "attention"} icon={index === 0 ? <ShieldCheck className="h-5 w-5" aria-hidden="true" /> : <CircleAlert className="h-5 w-5" aria-hidden="true" />} />)}
          <CorporateMetricCard label="Connector prototypes" value={String(prototypeCount)} detail={`${manualCount} manual data workflows`} signal="review" icon={<Link2 className="h-5 w-5" aria-hidden="true" />} />
        </section>

        <section>
          <CorporateSectionTitle eyebrow="Inventory" title="Equipment and readiness" description="Filtering and session-only intake are functional locally. Production records require organization storage and audit history." />
          <div className="mt-7"><CorporateEquipmentInventory initialEquipment={corporateEquipment} /></div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {[
            { title: "Manual first", body: "A manual reading can be operationally useful when its person, time, equipment, and method are recorded clearly." },
            { title: "Connector second", body: "A device integration should identify source, freshness, failure state, and permissions rather than silently replacing the manual record." },
            { title: "Manufacturer authority", body: "Calibration, opening, electrical, hot-surface, cleaning, and service procedures must follow approved manufacturer and organization guidance." },
          ].map((item) => <CorporatePanel key={item.title} className="p-6"><Settings2 className="h-5 w-5 text-amber-300/70" aria-hidden="true" /><h2 className="mt-7 text-xl font-medium text-[#e4d7c4]">{item.title}</h2><p className="mt-3 text-sm leading-7 text-[#918579]">{item.body}</p></CorporatePanel>)}
        </section>
      </div>
    </main>
  );
}
