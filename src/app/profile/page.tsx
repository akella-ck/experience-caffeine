import type { Metadata } from "next";
import { IndividualRouteGuard } from "@/components/auth/RouteGuards";
import { ProfileClient } from "@/components/member/ProfileClient";

export const metadata: Metadata = {
  title: "Brewing Profile",
  description: "Set your brewing equipment, learning pace, preferred origins, and cup goals.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <IndividualRouteGuard nextPath="/profile">
      <ProfileClient />
    </IndividualRouteGuard>
  );
}
