import type { Metadata } from "next";
import { IntegrationsCatalog } from "@/components/corporate/IntegrationsCatalog";

export const metadata: Metadata = {
  title: "Corporate Integrations",
  description: "Review mock, planned, read-only, and control-capable integration boundaries without hidden production connections.",
};

export default function CorporateIntegrationsPage() {
  return <main><IntegrationsCatalog /></main>;
}

