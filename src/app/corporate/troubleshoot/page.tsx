import type { Metadata } from "next";
import { CorporateTroubleshooter } from "@/components/corporate/CorporateTroubleshooter";

export const metadata: Metadata = {
  title: "Corporate Troubleshooting",
  description: "Capture operating context and produce a deterministic, uncertainty-aware quality assessment.",
};

export default function CorporateTroubleshootPage() {
  return <main><CorporateTroubleshooter /></main>;
}

