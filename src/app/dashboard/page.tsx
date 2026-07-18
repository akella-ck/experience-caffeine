import type { Metadata } from "next";
import { IndividualRouteGuard } from "@/components/auth/RouteGuards";
import { IndividualDashboard } from "@/components/member/IndividualDashboard";

export const metadata: Metadata = {
  title: "My Coffee Dashboard",
  description: "Resume saved recipes, continue lessons, and review your individual coffee-learning workspace.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <IndividualRouteGuard nextPath="/dashboard">
      <IndividualDashboard />
    </IndividualRouteGuard>
  );
}
