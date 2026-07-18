import type { Metadata } from "next";
import { RoastingSimulator } from "@/components/corporate/RoastingSimulator";

export const metadata: Metadata = {
  title: "Roasting Session Simulator",
  description: "Practice roast-session observation in an explicit simulation that cannot control production equipment.",
};

export default function CorporateRoastingSessionPage() {
  return <main><RoastingSimulator /></main>;
}

