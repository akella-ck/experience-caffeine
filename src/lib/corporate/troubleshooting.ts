import type { CorporateTroubleshootingInput, CorporateTroubleshootingResult, CorporateTroubleSymptom } from "../../types";

type CoreGuidance = Pick<CorporateTroubleshootingResult, "likelyCause" | "firstAction" | "rationale" | "severity">;

const symptomGuidance: Record<CorporateTroubleSymptom, CoreGuidance> = {
  sour: { likelyCause: "Extraction may be low or uneven for the current coffee.", firstAction: "If the brew also ran fast, move the grind one small step finer; otherwise verify even wetting before changing the recipe.", rationale: "A controlled grind or distribution check distinguishes low extraction from channeling.", severity: "observe" },
  bitter: { likelyCause: "Extraction, water temperature, or roast contribution may be too high.", firstAction: "If the brew ran slow, move the grind one small step coarser and hold the remaining variables.", rationale: "Reducing contact or extraction is the clearest first comparison for persistent bitterness.", severity: "observe" },
  hollow: { likelyCause: "The brew may be unevenly extracted or missing sufficient middle-palate strength.", firstAction: "Verify complete saturation and distribution before changing dose or temperature.", rationale: "Better uniformity can restore sweetness without obscuring the test with multiple changes.", severity: "observe" },
  flat: { likelyCause: "Coffee age, water chemistry, or low extraction may be suppressing aroma.", firstAction: "Confirm roast date and water specification before changing the recipe.", rationale: "Recipe adjustments cannot restore lost aromatics or correct water outside the approved range.", severity: "review" },
  weak: { likelyCause: "Beverage concentration may be low, or fast flow may also be limiting extraction.", firstAction: "If timing was fast, grind slightly finer; otherwise increase dose by about 5% with water held constant.", rationale: "Timing separates an extraction problem from a ratio problem.", severity: "observe" },
  harsh: { likelyCause: "Aggressive extraction, high temperature, or roast-driven flavors may be dominating the cup.", firstAction: "Verify temperature and recipe compliance, then reduce one extraction variable for the comparison brew.", rationale: "Checking execution first prevents a local process miss from becoming an unnecessary recipe revision.", severity: "review" },
  dry: { likelyCause: "Localized over-extraction or fines migration may be producing a drying finish.", firstAction: "Reduce agitation; if drawdown is slow, move the grind one small step coarser instead.", rationale: "A calmer bed or reduced resistance can limit astringent extraction.", severity: "observe" },
  astringent: { likelyCause: "Uneven flow, excess agitation, or excessive contact may be extracting drying compounds.", firstAction: "Inspect distribution and reduce agitation for one controlled repeat.", rationale: "Technique is the lowest-impact first test before changing the approved ratio.", severity: "review" },
  smoky: { likelyCause: "Roast development, exhaust contamination, or equipment cleanliness may be contributing smoke character.", firstAction: "Hold affected coffee from service and compare against the approved roast reference and a clean control cup.", rationale: "A sensory hold prevents a potential batch issue from reaching multiple locations.", severity: "hold" },
  baked: { likelyCause: "The roast may have lost momentum or spent too long at a low rate of rise.", firstAction: "Place the batch on quality hold and review the roast curve against its approved profile.", rationale: "Baked character is a roast-process concern and should not be corrected by changing the café brew recipe first.", severity: "hold" },
  scorched: { likelyCause: "Excess early heat, conductive contact, or a machine cleanliness issue may have scorched the coffee.", firstAction: "Stop release of the affected batch and ask the roasting and quality leads to inspect the curve, green condition, and machine.", rationale: "Scorching can affect an entire batch and requires traceable release review.", severity: "hold" },
  underdeveloped: { likelyCause: "The roast may not have developed enough solubility or may show green, cereal-like character.", firstAction: "Hold the batch for quality review and compare roast color, weight loss, development, and cooled-cup character.", rationale: "A brew adjustment should not mask a roast-development problem.", severity: "hold" },
  "inconsistent-shots": { likelyCause: "Dose, distribution, grinder retention, calibration, or machine delivery may be varying between shots.", firstAction: "Run three measured shots without changing the recipe and record dose, yield, and time for each.", rationale: "A short controlled series identifies whether variation comes from preparation, grinder, or machine.", severity: "review" },
  "slow-drawdown": { likelyCause: "The grind may be too fine, fines may be migrating, or the filter path may be restricted.", firstAction: "Verify dose and filter placement, then move the grind one small step coarser for a controlled repeat.", rationale: "Removing setup errors before a grind adjustment keeps the test interpretable.", severity: "review" },
  "fast-drawdown": { likelyCause: "The grind may be too coarse, the dose low, or the coffee bed may be channeling.", firstAction: "Verify dose and even wetting, then move the grind one small step finer if technique was stable.", rationale: "Flow and extraction can improve together when resistance is restored carefully.", severity: "review" },
};

const inspectionTargetBySymptom: Record<CorporateTroubleSymptom, CorporateTroubleshootingResult["inspectionTarget"]> = {
  sour: "grinder",
  bitter: "grinder",
  hollow: "technique",
  flat: "water",
  weak: "grinder",
  harsh: "technique",
  dry: "technique",
  astringent: "technique",
  smoky: "roast",
  baked: "roast",
  scorched: "roast",
  underdeveloped: "roast",
  "inconsistent-shots": "machine",
  "slow-drawdown": "grinder",
  "fast-drawdown": "grinder",
};

const firstVariableBySymptom: Record<CorporateTroubleSymptom, string> = {
  sour: "Grind or distribution, based on measured brew time",
  bitter: "Grind, after confirming temperature",
  hollow: "Wetting and distribution technique",
  flat: "Coffee freshness and water specification",
  weak: "Grind if fast; dose if timing is on target",
  harsh: "Recipe compliance before changing extraction",
  dry: "Agitation",
  astringent: "Distribution and agitation",
  smoky: "No recipe change — inspect roast and equipment",
  baked: "No recipe change — review roast profile",
  scorched: "No recipe change — hold and inspect roast",
  underdeveloped: "No recipe change — hold and inspect roast",
  "inconsistent-shots": "Preparation consistency, then grinder or machine",
  "slow-drawdown": "Grind after confirming dose and filter",
  "fast-drawdown": "Distribution, then grind",
};

export function diagnoseCorporateIssue(input: CorporateTroubleshootingInput): CorporateTroubleshootingResult {
  const base = symptomGuidance[input.symptom];
  const broadScope = input.scope === "location" || input.scope === "batch";
  const recentChangeDetail = input.recentChanges.length > 0 && !input.recentChanges.includes("none")
    ? ` Compare the result before and after the recent ${input.recentChanges.join(" / ")} change.`
    : "";
  const severity = base.severity === "hold" || (broadScope && base.severity === "review") ? base.severity : base.severity;
  const escalationRecommendation = severity === "hold"
    ? "Escalate to both roasting and quality leads before disposition."
    : broadScope
      ? "Escalate to the location lead and quality owner if the controlled repeat confirms the pattern."
      : "Escalate if the same symptom remains after one controlled adjustment.";
  const whatToMeasureNext = [
    "Repeat dose, water or yield, time, temperature, and grind setting",
    input.method.toLowerCase().includes("espresso") ? "Three consecutive shot outcomes" : "Flow, drawdown, and bed condition",
    "Sensory result after the single controlled change",
  ];
  const measuredContextCount = [
    typeof input.doseGrams === "number" && Number.isFinite(input.doseGrams) && input.doseGrams > 0,
    [input.waterGrams, input.yieldGrams].some((value) => typeof value === "number" && Number.isFinite(value) && value > 0),
    typeof input.brewTimeSeconds === "number" && Number.isFinite(input.brewTimeSeconds) && input.brewTimeSeconds > 0,
    typeof input.temperatureCelsius === "number" && Number.isFinite(input.temperatureCelsius) && input.temperatureCelsius > 0,
    Boolean(input.grindSetting?.trim()),
  ].filter(Boolean).length;
  const confidence = input.timing !== "not-measured" && measuredContextCount >= 4 ? "high" : "moderate";

  return {
    ruleId: `${input.symptom}-${input.timing}-${input.scope}`,
    severity,
    confidence,
    likelyCause: base.likelyCause,
    possibleCauses: [
      base.likelyCause,
      `Execution or calibration variation at ${input.location || "the selected location"}.`,
      input.recentChanges.length > 0 && !input.recentChanges.includes("none")
        ? `A recent ${input.recentChanges.join(" / ")} change may be contributing.`
        : "Coffee age, environment, or an unrecorded process change may be contributing.",
    ],
    containment: severity === "hold"
      ? "Do not release or serve the affected batch until an authorized quality lead records a disposition."
      : broadScope
        ? "Keep the approved recipe unchanged across the location while the issue is measured."
        : "Keep the remaining variables unchanged for the comparison attempt.",
    firstVariableToChange: firstVariableBySymptom[input.symptom],
    firstAction: `${base.firstAction}${recentChangeDetail}`,
    why: base.rationale,
    rationale: base.rationale,
    evidenceToCapture: [
      "Coffee, roast date, profile or recipe version",
      "Dose, water or yield, time, temperature, and grind setting",
      input.method.toLowerCase().includes("espresso") ? "Three-shot dose, yield, and time series" : "Bed, filter, flow, and drawdown observations",
      "Location, machine, grinder, shift, and recent changes",
    ],
    whatToMeasureNext,
    inspectionTarget: inspectionTargetBySymptom[input.symptom],
    escalation: escalationRecommendation,
    escalationRecommendation,
    safetyNote: "This guidance is diagnostic support, not an equipment command. Follow manufacturer procedures and your organization’s safety and release policies.",
  };
}
