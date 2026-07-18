import type { Metadata } from "next";
import { RoastProfilesWorkspace } from "@/components/corporate/RoastProfilesWorkspace";

export const metadata: Metadata = {
  title: "Roast Profiles",
  description: "Create, compare, revise, and archive traceable roast-profile references in the protected corporate workspace.",
};

export default function CorporateRoastProfilesPage() {
  return <main><RoastProfilesWorkspace /></main>;
}

