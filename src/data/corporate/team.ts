import type { CorporateTeamMember, RoleDefinition } from "./types";

export const corporateTeam: CorporateTeamMember[] = [
  { id: "maya-chen", name: "Maya Chen", initials: "MC", role: "Quality manager", location: "North Roastery", learningCompletion: 100, certifications: ["Sensory calibration", "Quality reviewer"], lastActive: "12 min ago", status: "Active" },
  { id: "jon-bell", name: "Jon Bell", initials: "JB", role: "Head roaster", location: "North Roastery", learningCompletion: 96, certifications: ["Roast standards", "Production safety"], lastActive: "34 min ago", status: "Active" },
  { id: "ari-stone", name: "Ari Stone", initials: "AS", role: "Trainer", location: "All locations", learningCompletion: 100, certifications: ["Learning author", "Brew calibration"], lastActive: "1 hr ago", status: "Active" },
  { id: "nia-brooks", name: "Nia Brooks", initials: "NB", role: "Production roaster", location: "North Roastery", learningCompletion: 88, certifications: ["Production safety"], lastActive: "2 hr ago", status: "Active" },
  { id: "elena-ruiz", name: "Elena Ruiz", initials: "ER", role: "Owner", location: "All locations", learningCompletion: 91, certifications: ["Program administration"], lastActive: "Yesterday", status: "Active" },
  { id: "kai-patel", name: "Kai Patel", initials: "KP", role: "Café manager", location: "South Market", learningCompletion: 92, certifications: ["Filter service", "Equipment care"], lastActive: "Yesterday", status: "Active" },
  { id: "sora-kim", name: "Sora Kim", initials: "SK", role: "Lead barista", location: "Harbor Point", learningCompletion: 68, certifications: ["Coffee foundations"], lastActive: "2 days ago", status: "Active" },
  { id: "luca-gray", name: "Luca Gray", initials: "LG", role: "Barista", location: "Union Hall", learningCompletion: 0, certifications: [], lastActive: "Invitation sent", status: "Invited" },
];

export const roleDefinitions: RoleDefinition[] = [
  { role: "Owner", scope: "Organization", permissions: ["Manage team and locations", "Configure organization defaults", "View organization-wide summaries"] },
  { role: "Head roaster", scope: "Production and standards", permissions: ["Own roast standards", "Review production references", "Approve standards for quality review"] },
  { role: "Production roaster", scope: "Assigned production locations", permissions: ["View approved standards", "Contribute production notes", "Submit standards for review"] },
  { role: "Quality manager", scope: "Organization or assigned locations", permissions: ["Review standards", "Open and close quality observations", "View quality summaries"] },
  { role: "Café manager", scope: "Assigned café locations", permissions: ["Manage local assignments", "View location quality", "Confirm equipment and recipe readiness"] },
  { role: "Lead barista", scope: "Assigned café locations", permissions: ["View approved recipes", "Support local calibration", "Record quality observations"] },
  { role: "Barista", scope: "Assigned café locations", permissions: ["View approved recipes and standards", "Complete assigned learning", "Record brew observations"] },
  { role: "Trainer", scope: "Organization or assigned locations", permissions: ["Author and assign learning", "Publish internal skill acknowledgements", "View completion reports"] },
];

export const teamSummary = {
  totalMembers: 48,
  activeMembers: 47,
  invitedMembers: 1,
  representedInPreview: corporateTeam.length,
};
