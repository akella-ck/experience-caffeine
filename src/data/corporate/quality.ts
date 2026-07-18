import type {
  BatchApprovalRecord,
  BrewQualityCheck,
  CorrectiveActionRecord,
  CuppingRecord,
  QualityAlertRecord,
  QualityLocation,
  QualityMetricSnapshot,
  QualityObservation,
  RoastDeviationRecord,
} from "./types";

export const qualityMetricSnapshot: QualityMetricSnapshot = {
  batchConsistencyPercent: 96.8,
  roastColorVariance: "±1.8 points",
  weightLossVariancePercent: 0.6,
  averageCuppingScore: 87.4,
  recipeAdherencePercent: 89.5,
  openCorrectiveActions: 3,
};

export const qualityLocations: QualityLocation[] = [
  { id: "south-market", name: "South Market", qualityScore: 95.1, recipeAdherence: 93, checksCompleted: 18, checksExpected: 18, signal: "on-track", leadingObservation: "Filter service remains consistent across both grinders." },
  { id: "harbor-point", name: "Harbor Point", qualityScore: 86.8, recipeAdherence: 79, checksCompleted: 14, checksExpected: 18, signal: "attention", leadingObservation: "Water temperature varied across three V60 checks." },
  { id: "north-roastery", name: "North Roastery", qualityScore: 94.3, recipeAdherence: 96, checksCompleted: 12, checksExpected: 12, signal: "on-track", leadingObservation: "Release checks complete for four current standards." },
  { id: "union-hall", name: "Union Hall", qualityScore: 92.7, recipeAdherence: 90, checksCompleted: 16, checksExpected: 18, signal: "review", leadingObservation: "New espresso grinder is still inside its calibration window." },
];

export const qualityObservations: QualityObservation[] = [
  { id: "observation-1", title: "V60 water temperature below standard", location: "Harbor Point", category: "Brew", severity: "Medium", status: "Open", recommendation: "Confirm kettle calibration and repeat one controlled check before changing the recipe.", reportedAt: "Jul 16 · 13:05" },
  { id: "observation-2", title: "Seasonal espresso finish drying", location: "Union Hall", category: "Sensory", severity: "Low", status: "Watching", recommendation: "Hold dose and yield; compare one grinder step coarser after the burrs settle.", reportedAt: "Jul 15 · 09:40" },
  { id: "observation-3", title: "Batch brewer cleaning record missed", location: "Harbor Point", category: "Process", severity: "Low", status: "Resolved", recommendation: "Daily reset owner confirmed and the following check was recorded.", reportedAt: "Jul 14 · 17:22" },
  { id: "observation-4", title: "Filter grinder setting drift", location: "South Market", category: "Equipment", severity: "Low", status: "Resolved", recommendation: "Reference setting restored after chamber cleaning and calibration check.", reportedAt: "Jul 12 · 11:18" },
];

export const cuppingRecords: CuppingRecord[] = [
  {
    id: "cupping-0247",
    coffee: "Huila Regional Blend",
    batchCode: "B-0247",
    roastProfile: "House Espresso Base v7",
    location: "North Roastery",
    panel: "Maya Chen · Jon Bell",
    score: 87.8,
    status: "Approved",
    notes: "Brown sugar, red apple, cocoa; clean finish at the release reference.",
    cuppedAt: "Jul 17 · 09:10",
  },
  {
    id: "cupping-0246",
    coffee: "Aricha Lot 24",
    batchCode: "B-0246",
    roastProfile: "Aricha Floral Filter v4",
    location: "North Roastery",
    panel: "Quality panel · 3 tasters",
    score: 91.2,
    status: "Reviewed",
    notes: "Jasmine and peach remain clear; one cup will be repeated after 48 hours rest.",
    cuppedAt: "Jul 16 · 14:40",
  },
  {
    id: "cupping-0245",
    coffee: "Kii AA",
    batchCode: "B-0245",
    roastProfile: "Kirinyaga Seasonal v2",
    location: "Training Lab",
    panel: "Nia Brooks · Ari Stone",
    score: 83.1,
    status: "Draft",
    notes: "Promising blackcurrant character; drying finish requires a repeat panel before disposition.",
    cuppedAt: "Jul 15 · 11:25",
  },
];

export const batchApprovalRecords: BatchApprovalRecord[] = [
  {
    id: "approval-0247",
    batchCode: "B-0247",
    roastProfile: "House Espresso Base v7",
    evidence: "Color, weight loss, curve review, cupping, and espresso reference complete",
    status: "Approved",
    reviewer: "Maya Chen",
    updatedAt: "Today · 10:05",
  },
  {
    id: "approval-0246",
    batchCode: "B-0246",
    roastProfile: "Aricha Floral Filter v4",
    evidence: "Release cupping complete; filter verification scheduled after rest",
    status: "Pending review",
    reviewer: "Nia Brooks",
    updatedAt: "Today · 08:40",
  },
  {
    id: "approval-0245",
    batchCode: "B-0245",
    roastProfile: "Kirinyaga Seasonal v2",
    evidence: "Drying finish observed by two tasters; repeat panel required",
    status: "Held",
    reviewer: "Maya Chen",
    updatedAt: "Yesterday · 15:20",
  },
];

export const roastDeviationRecords: RoastDeviationRecord[] = [
  {
    id: "deviation-0247",
    batchCode: "B-0247",
    metric: "Weight loss",
    target: "13.8–14.4%",
    observed: "14.2%",
    signal: "on-track",
    disposition: "Inside internal reference range",
  },
  {
    id: "deviation-0246",
    batchCode: "B-0246",
    metric: "Roast color",
    target: "Internal Light 71 ±2",
    observed: "Light 68.4",
    signal: "review",
    disposition: "Review beside cupping before release",
  },
  {
    id: "deviation-0245",
    batchCode: "B-0245",
    metric: "Development time",
    target: "Profile reference 103 s",
    observed: "118 s",
    signal: "attention",
    disposition: "Batch held for profile and sensory review",
  },
];

export const brewQualityChecks: BrewQualityCheck[] = [
  {
    id: "brew-check-1",
    location: "South Market",
    recipe: "House Espresso 1:2.1",
    method: "Espresso",
    adherencePercent: 96,
    result: "Pass",
    observation: "Three-shot dose, yield, and time series remained inside the approved window.",
    checkedAt: "Today · 07:18",
  },
  {
    id: "brew-check-2",
    location: "Harbor Point",
    recipe: "Harbor Point Batch 2 L",
    method: "Batch brew",
    adherencePercent: 78,
    result: "Repeat",
    observation: "Water delivery was below target; repeat after brewer inspection without changing grind.",
    checkedAt: "Today · 08:02",
  },
  {
    id: "brew-check-3",
    location: "Union Hall",
    recipe: "Seasonal Espresso",
    method: "Espresso",
    adherencePercent: 88,
    result: "Review",
    observation: "Yield was on target, but the drying finish remains under observation.",
    checkedAt: "Yesterday · 15:36",
  },
  {
    id: "brew-check-4",
    location: "Training Lab",
    recipe: "Aricha V60 250 g",
    method: "V60",
    adherencePercent: 94,
    result: "Pass",
    observation: "Recipe and drawdown matched the training reference; sweetness held as the cup cooled.",
    checkedAt: "Yesterday · 11:44",
  },
];

export const correctiveActionRecords: CorrectiveActionRecord[] = [
  {
    id: "corrective-1",
    title: "Verify Harbor Point brewer delivery",
    source: "Brew check BC-HP-118",
    owner: "Sora Kim",
    dueLabel: "Due today",
    status: "Open",
    firstAction: "Run the approved water-only delivery check; do not change the coffee recipe.",
    verification: "Record delivered mass and repeat one brew-quality check.",
  },
  {
    id: "corrective-2",
    title: "Repeat Kii AA release panel",
    source: "Batch B-0245",
    owner: "Maya Chen",
    dueLabel: "Due Jul 18",
    status: "Verifying",
    firstAction: "Keep the batch held while three calibrated tasters repeat the cooled-cup assessment.",
    verification: "Quality lead records disposition against the same profile version.",
  },
  {
    id: "corrective-3",
    title: "Confirm Union Hall grinder baseline",
    source: "Observation O-117",
    owner: "Lena Ortiz",
    dueLabel: "Due Jul 19",
    status: "Open",
    firstAction: "Record three unchanged shots after cleaning and zero-reference confirmation.",
    verification: "Compare dose, yield, time, and finish before adjusting the approved recipe.",
  },
];

export const qualityAlerts: QualityAlertRecord[] = [
  {
    id: "alert-1",
    title: "Kii AA batch remains on quality hold",
    scope: "Batch B-0245 · North Roastery",
    severity: "High",
    status: "Open",
    detectedAt: "Yesterday · 15:20",
    recommendedCheck: "Complete the repeat cupping panel before any release decision.",
  },
  {
    id: "alert-2",
    title: "Batch brewer delivery below reference",
    scope: "Harbor Point · Filter station",
    severity: "Medium",
    status: "Watching",
    detectedAt: "Today · 08:02",
    recommendedCheck: "Verify delivered water mass and equipment status before changing grind or dose.",
  },
  {
    id: "alert-3",
    title: "South Market espresso series verified",
    scope: "South Market · Main bar",
    severity: "Low",
    status: "Resolved",
    detectedAt: "Today · 07:18",
    recommendedCheck: "Continue normal opening calibration cadence.",
  },
];

export const qualityFramework = [
  { id: "record", title: "Record the observation", detail: "Capture taste, recipe, equipment, time, and local context without inventing a sensor reading." },
  { id: "isolate", title: "Isolate one likely cause", detail: "Use the approved standard and one-variable principle to choose a controlled next check." },
  { id: "verify", title: "Verify the result", detail: "Repeat the observation and close only when the signal is understood." },
] as const;
