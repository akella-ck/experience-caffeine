import type {
  CorporateActivity,
  CorporateMetric,
  CorporateOperationalSignal,
  CorporateQuickAction,
  CorporateRoastBatchSummary,
  CorporateTroubleshootingSummary,
} from "./types";

export const corporateMetrics: CorporateMetric[] = [
  { id: "learning", label: "Learning completion", value: "84%", detail: "Across 41 assigned learners", signal: "on-track" },
  { id: "quality", label: "Quality index", value: "92.4", detail: "Illustrative composite score", signal: "on-track" },
  { id: "standards", label: "Approved standards", value: "8 / 11", detail: "Two in review, one draft", signal: "review" },
  { id: "locations", label: "Location readiness", value: "3 / 4", detail: "One location needs review", signal: "attention" },
];

export const corporateActivity: CorporateActivity[] = [
  { id: "activity-1", title: "Filter fundamentals assignment completed", detail: "South Market · 9 of 9 assigned learners complete", timestamp: "Today · 10:42", category: "Learning" },
  { id: "activity-2", title: "Bright Filter 101 advanced to v3.2", detail: "Sensory release language clarified by the quality lead", timestamp: "Yesterday · 16:18", category: "Standard" },
  { id: "activity-3", title: "Water-temperature observation opened", detail: "Harbor Point · V60 station", timestamp: "Yesterday · 13:05", category: "Quality" },
  { id: "activity-4", title: "Two team invitations accepted", detail: "North Roastery production team", timestamp: "Mon · 09:30", category: "Team" },
];

export const dashboardPriorityActions = [
  { id: "priority-1", title: "Review Harbor Point quality observation", detail: "A temperature-control pattern appears across three checks.", href: "/corporate/quality", label: "Review quality" },
  { id: "priority-2", title: "Approve Seasonal Espresso standard", detail: "Sensory and café owners have completed their review.", href: "/corporate/roasting/standards", label: "Open standards" },
  { id: "priority-3", title: "Follow up on equipment-care learning", detail: "Four learners have not started the current assignment.", href: "/corporate/learning", label: "View learning" },
] as const;

export const dashboardOperationalSignals: CorporateOperationalSignal[] = [
  {
    id: "production",
    label: "Current production status",
    value: "1 simulated batch",
    detail: "Aricha Floral Filter · minute 06:42",
    signal: "review",
    href: "/corporate/roasting/session",
  },
  {
    id: "profiles",
    label: "Active roast profiles",
    value: "2 approved",
    detail: "One seasonal profile remains in review",
    signal: "on-track",
    href: "/corporate/roast-profiles",
  },
  {
    id: "recipes",
    label: "Café recipes",
    value: "2 published",
    detail: "One location recipe is awaiting approval",
    signal: "review",
    href: "/corporate/recipes",
  },
  {
    id: "integrations",
    label: "Equipment integration status",
    value: "1 mock connected",
    detail: "All production connectors are planned or disconnected",
    signal: "attention",
    href: "/corporate/integrations",
  },
];

export const dashboardRecentRoastBatches: CorporateRoastBatchSummary[] = [
  {
    id: "batch-sim-0248",
    code: "SIM-0248",
    profile: "Aricha Floral Filter",
    machine: "Local telemetry sandbox",
    status: "Simulating",
    timing: "Now · 06:42 elapsed",
    signal: "review",
  },
  {
    id: "batch-0247",
    code: "B-0247",
    profile: "House Espresso Base",
    machine: "Loring S15 reference",
    status: "Ready for review",
    timing: "Today · 08:14",
    signal: "review",
  },
  {
    id: "batch-0246",
    code: "B-0246",
    profile: "Aricha Floral Filter",
    machine: "Loring S15 reference",
    status: "Approved",
    timing: "Yesterday · 15:36",
    signal: "on-track",
  },
];

export const dashboardRecentTroubleshootingRecords: CorporateTroubleshootingSummary[] = [
  {
    id: "trouble-118",
    issue: "Espresso tasted bitter and ran slowly",
    context: "South Market · House Espresso",
    firstAdjustment: "Grind slightly coarser; keep dose and yield unchanged",
    recordedAt: "Today · 09:22",
    signal: "review",
  },
  {
    id: "trouble-117",
    issue: "Batch brew presented hollow",
    context: "Harbor Point · 2 L filter batch",
    firstAdjustment: "Confirm coffee freshness before changing the recipe",
    recordedAt: "Yesterday · 14:10",
    signal: "attention",
  },
  {
    id: "trouble-116",
    issue: "V60 tasted sour with a fast drawdown",
    context: "Training Lab · Aricha Lot 24",
    firstAdjustment: "Grind one small step finer and observe drawdown",
    recordedAt: "Mon · 11:44",
    signal: "on-track",
  },
];

export const corporateQuickActions: CorporateQuickAction[] = [
  { id: "create-profile", title: "Create Roast Profile", detail: "Open the versioned profile workflow", href: "/corporate/roast-profiles#new-profile" },
  { id: "add-recipe", title: "Add Brew Recipe", detail: "Open the café recipe workflow", href: "/corporate/recipes#new-recipe" },
  { id: "start-session", title: "Start Roast Session", detail: "Open the simulation-ready session", href: "/corporate/roasting/session" },
  { id: "record-cupping", title: "Record Cupping", detail: "Add an illustrative sensory check", href: "/corporate/quality?record=cupping#record-cupping" },
  { id: "troubleshoot", title: "Troubleshoot a Cup", detail: "Work through one-variable guidance", href: "/corporate/troubleshoot" },
  { id: "add-equipment", title: "Add Equipment", detail: "Add a session-only inventory record", href: "/corporate/equipment#equipment-intake" },
  { id: "assign-training", title: "Assign Training", detail: "Review the local assignment workflow", href: "/corporate/learning#assignments" },
  { id: "review-alerts", title: "Review Quality Alerts", detail: "Inspect observations needing review", href: "/corporate/quality#observations" },
];
