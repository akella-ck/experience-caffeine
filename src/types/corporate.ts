export type OperationalStatus = "draft" | "in-review" | "approved" | "archived";

export type Organization = {
  id: string;
  name: string;
  type: "cafe" | "roaster" | "cafe_and_roaster";
  locations: string[];
};

export type RoastEvent = "charge" | "turning-point" | "yellowing" | "first-crack" | "drop";

export type RoastCurvePoint = {
  seconds: number;
  beanTemperatureC: number;
  rateOfRiseCPerMinute: number;
  event?: RoastEvent;
};

export type RoastProfileRevision = {
  version: number;
  changedAt: string;
  changedBy: string;
  summary: string;
};

export type RoastProfile = {
  id: string;
  code: string;
  name: string;
  coffeeId: string;
  coffee: string;
  origin: string;
  process: string;
  intendedUse: string;
  machineId: string;
  batchSizeKg: number;
  roasterModel: string;
  greenDensityGramsPerLiter: number;
  greenMoisturePercent: number;
  chargeTemperatureC: number;
  turningPointSeconds: number;
  yellowingSeconds: number;
  dropTemperatureC: number;
  firstCrackSeconds: number;
  totalTimeSeconds: number;
  developmentSeconds: number;
  developmentRatioPercent: number;
  weightLossPercent: number;
  roastColor: string;
  sensoryTargets: string[];
  notes: string[];
  qualityScore: number | null;
  status: OperationalStatus;
  version: number;
  revisionHistory: RoastProfileRevision[];
  owner: string;
  updatedAt: string;
  curve: RoastCurvePoint[];
};

export type RoastProfileDraft = Omit<RoastProfile, "id" | "updatedAt" | "version" | "curve"> & {
  id?: string;
  curve?: RoastCurvePoint[];
};

export type RoastProfileMetrics = {
  developmentSeconds: number;
  developmentRatioPercent: number;
  temperatureRiseC: number;
  averageRateOfRiseCPerMinute: number;
};

export type RoastSimulationPhase = "ready" | "roasting" | "paused" | "complete" | "aborted";

export type RoastSimulationEvent = {
  id: string;
  atSeconds: number;
  label: string;
  detail: string;
  kind: "system" | "operator" | "milestone" | "warning";
};

export type CorporateRecipeMethod =
  | "Roast reference"
  | "V60"
  | "AeroPress"
  | "Filter"
  | "Batch brewer"
  | "Espresso"
  | "Cold brew"
  | "Signature beverage"
  | "Cupping";

export type RecipePour = {
  id: string;
  label: string;
  cumulativeWaterGrams: number;
  atSeconds: number;
};

export type CorporateRecipeRevision = {
  version: number;
  changedAt: string;
  changedBy: string;
  summary: string;
  snapshot: {
    status: OperationalStatus;
    method: CorporateRecipeMethod;
    coffeeDoseGrams: number;
    waterGrams: number | null;
    yieldGrams: number | null;
    temperatureCelsius: number;
    targetBrewTime: string;
    grinder: string;
    grinderSetting: string;
    qualityTarget: string[];
    staffNotes: string[];
  };
};

export type CorporateRecipe = {
  id: string;
  code: string;
  name: string;
  coffee: string;
  origin: string;
  method: CorporateRecipeMethod;
  roastProfileId: string | null;
  locationIds: string[];
  equipmentIds: string[];
  coffeeDoseGrams: number;
  waterGrams: number | null;
  yieldGrams: number | null;
  temperatureCelsius: number;
  targetTimeSeconds: number;
  pressureBar: number | null;
  pours: RecipePour[];
  grinder: string;
  grinderSetting: string;
  grindTarget: string;
  targetBrewTime: string;
  steps: string[];
  qualityTarget: string[];
  tastingNotes: string[];
  staffNotes: string[];
  tags: string[];
  status: OperationalStatus;
  version: number;
  revisionHistory: CorporateRecipeRevision[];
  approvedBy: string | null;
  owner: string;
  updatedAt: string;
};

export type CorporateRecipeDraft = Omit<CorporateRecipe, "id" | "updatedAt" | "version"> & {
  id?: string;
};

export type RecipeValidationField =
  | "code"
  | "name"
  | "coffee"
  | "origin"
  | "locationIds"
  | "coffeeDoseGrams"
  | "waterGrams"
  | "yieldGrams"
  | "temperatureCelsius"
  | "grinder"
  | "grinderSetting"
  | "grindTarget"
  | "targetBrewTime"
  | "steps"
  | "qualityTarget";

export type RecipeValidationIssue = {
  field: RecipeValidationField;
  message: string;
};

export type CorporateTroubleSymptom =
  | "sour"
  | "bitter"
  | "hollow"
  | "flat"
  | "weak"
  | "harsh"
  | "dry"
  | "astringent"
  | "smoky"
  | "baked"
  | "scorched"
  | "underdeveloped"
  | "inconsistent-shots"
  | "slow-drawdown"
  | "fast-drawdown";

export type CorporateTroubleTiming =
  | "faster"
  | "on-target"
  | "slower"
  | "variable"
  | "not-measured";

export type CorporateTroubleScope = "single-cup" | "station" | "location" | "batch";

export type CorporateRecentChange =
  | "none"
  | "coffee"
  | "grinder"
  | "water"
  | "recipe"
  | "equipment";

export type CorporateTroubleshootingInput = {
  symptom: CorporateTroubleSymptom;
  timing: CorporateTroubleTiming;
  scope: CorporateTroubleScope;
  recentChanges: CorporateRecentChange[];
  method: string;
  coffeeId?: string;
  coffeeName?: string;
  roastDate?: string;
  roastProfileId?: string;
  grinder?: string;
  grindSetting?: string;
  doseGrams?: number;
  waterGrams?: number;
  yieldGrams?: number;
  brewTimeSeconds?: number;
  temperatureCelsius?: number;
  waterProfile?: string;
  machine?: string;
  location: string;
  shift?: string;
  notes: string;
};

export type CorporateTroubleshootingResult = {
  ruleId: string;
  severity: "observe" | "review" | "hold";
  confidence: "moderate" | "high";
  likelyCause: string;
  possibleCauses: string[];
  containment: string;
  firstVariableToChange: string;
  firstAction: string;
  why: string;
  rationale: string;
  evidenceToCapture: string[];
  whatToMeasureNext: string[];
  inspectionTarget: "roast" | "grinder" | "water" | "machine" | "technique";
  escalation: string;
  escalationRecommendation: string;
  safetyNote: string;
};

export type TroubleshootingRecord<TInput, TResult> = {
  id: string;
  createdAt: string;
  input: TInput;
  result: TResult;
  status: "open" | "monitoring" | "resolved";
};

export type SavedCorporateTroubleshootingRecord = TroubleshootingRecord<
  CorporateTroubleshootingInput,
  CorporateTroubleshootingResult
>;

export type OperationalIntegrationMode = "mock" | "planned";

export type OperationalIntegrationCategory =
  | "Roasting machines"
  | "Temperature probes"
  | "Smart scales"
  | "Grinders"
  | "Espresso machines"
  | "Inventory systems"
  | "Point-of-sale systems"
  | "Quality-control tools";

export type OperationalIntegrationBadge =
  | "Mock"
  | "Planned"
  | "Read-only"
  | "Control capable"
  | "Not connected"
  | "Connected";

export type OperationalIntegration = {
  id: string;
  name: string;
  vendor: string;
  category: OperationalIntegrationCategory;
  mode: OperationalIntegrationMode;
  status: "connected" | "not-connected";
  description: string;
  capabilities: string[];
  dataAvailable: string[];
  controlCapability: "read-only" | "control-capable";
  lastSync: string | null;
  badges: OperationalIntegrationBadge[];
  dataDirection: string;
  safetyBoundary: string;
  setupSummary: string[];
};
