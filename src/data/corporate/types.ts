export type CorporateSignal = "on-track" | "attention" | "review";

export type IntegrationStatus = "Available" | "Prototype" | "Planned";

export type LearningProgress = "Not started" | "In progress" | "Complete";

export type StandardStatus = "Approved" | "In review" | "Draft";

export type CorporateRole =
  | "Owner"
  | "Head roaster"
  | "Production roaster"
  | "Quality manager"
  | "Café manager"
  | "Lead barista"
  | "Barista"
  | "Trainer";

export type CorporateMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
  signal: CorporateSignal;
};

export type CorporateActivity = {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  category: "Learning" | "Standard" | "Quality" | "Team";
};

export type CorporateOperationalSignal = {
  id: "production" | "profiles" | "recipes" | "integrations";
  label: string;
  value: string;
  detail: string;
  signal: CorporateSignal;
  href: string;
};

export type CorporateRoastBatchSummary = {
  id: string;
  code: string;
  profile: string;
  machine: string;
  status: "Simulating" | "Cooling" | "Ready for review" | "Approved";
  timing: string;
  signal: CorporateSignal;
};

export type CorporateTroubleshootingSummary = {
  id: string;
  issue: string;
  context: string;
  firstAdjustment: string;
  recordedAt: string;
  signal: CorporateSignal;
};

export type CorporateQuickAction = {
  id:
    | "create-profile"
    | "add-recipe"
    | "start-session"
    | "record-cupping"
    | "troubleshoot"
    | "add-equipment"
    | "assign-training"
    | "review-alerts";
  title: string;
  detail: string;
  href: string;
};

export type CorporateOffering = {
  id: string;
  title: string;
  description: string;
  outcome: string;
  icon: "roast" | "recipe" | "learning" | "equipment" | "monitoring" | "diagnostics" | "locations" | "records";
};

export type BusinessAudience = {
  id: "cafes" | "roasters";
  title: string;
  description: string;
  benefits: string[];
};

export type CorporateIntegration = {
  id: string;
  name: string;
  category: string;
  status: IntegrationStatus;
  description: string;
  availabilityNote: string;
};

export type LearningProgram = {
  id: string;
  title: string;
  description: string;
  audience: string;
  moduleCount: number;
  duration: string;
  completionPercent: number;
  assignedLearners: number;
  required: boolean;
  topics: string[];
};

export type LearningAssignment = {
  id: string;
  title: string;
  location: string;
  dueLabel: string;
  assigned: number;
  completed: number;
  progress: LearningProgress;
};

export type CorporateLessonDetail = {
  id: string;
  title: string;
  trackId: string;
  duration: string;
  difficulty: string;
  objectives: string[];
  explanation: string[];
  diagram: Array<{ label: string; detail: string; signal: string }>;
  video: {
    title: string;
    duration: string;
    chapters: string[];
    captionsAvailable: boolean;
  };
  knowledgeCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  checklist: string[];
  variabilityCaveat: string;
};

export type RoastingStandard = {
  id: string;
  code: string;
  name: string;
  intendedUse: string;
  roastDirection: string;
  sensoryTarget: string[];
  referenceColor: string;
  releaseChecks: string[];
  version: string;
  status: StandardStatus;
  owner: string;
  reviewedAt: string;
};

export type OperationalStandardLabel =
  | "Internal standard"
  | "Training reference"
  | "Quality-control requirement"
  | "Suggested starting framework";

export type OperationalStandardReference = {
  id: string;
  title: string;
  label: OperationalStandardLabel;
  description: string;
  includes: string[];
  revision: string;
  format: "Checklist" | "Worksheet" | "Reference" | "Review form";
};

export type QualityLocation = {
  id: string;
  name: string;
  qualityScore: number;
  recipeAdherence: number;
  checksCompleted: number;
  checksExpected: number;
  signal: CorporateSignal;
  leadingObservation: string;
};

export type QualityObservation = {
  id: string;
  title: string;
  location: string;
  category: "Brew" | "Sensory" | "Equipment" | "Process";
  severity: "Low" | "Medium" | "High";
  status: "Open" | "Watching" | "Resolved";
  recommendation: string;
  reportedAt: string;
};

export type QualityMetricSnapshot = {
  batchConsistencyPercent: number;
  roastColorVariance: string;
  weightLossVariancePercent: number;
  averageCuppingScore: number;
  recipeAdherencePercent: number;
  openCorrectiveActions: number;
};

export type CuppingRecord = {
  id: string;
  coffee: string;
  batchCode: string;
  roastProfile: string;
  location: string;
  panel: string;
  score: number;
  status: "Draft" | "Reviewed" | "Approved";
  notes: string;
  cuppedAt: string;
};

export type BatchApprovalRecord = {
  id: string;
  batchCode: string;
  roastProfile: string;
  evidence: string;
  status: "Approved" | "Pending review" | "Held";
  reviewer: string;
  updatedAt: string;
};

export type RoastDeviationRecord = {
  id: string;
  batchCode: string;
  metric: string;
  target: string;
  observed: string;
  signal: CorporateSignal;
  disposition: string;
};

export type BrewQualityCheck = {
  id: string;
  location: string;
  recipe: string;
  method: string;
  adherencePercent: number;
  result: "Pass" | "Review" | "Repeat";
  observation: string;
  checkedAt: string;
};

export type CorrectiveActionRecord = {
  id: string;
  title: string;
  source: string;
  owner: string;
  dueLabel: string;
  status: "Open" | "Verifying" | "Closed";
  firstAction: string;
  verification: string;
};

export type QualityAlertRecord = {
  id: string;
  title: string;
  scope: string;
  severity: "Low" | "Medium" | "High";
  status: "Open" | "Watching" | "Resolved";
  detectedAt: string;
  recommendedCheck: string;
};

export type CorporateTeamMember = {
  id: string;
  name: string;
  initials: string;
  role: CorporateRole;
  location: string;
  learningCompletion: number;
  certifications: string[];
  lastActive: string;
  status: "Active" | "Invited";
};

export type RoleDefinition = {
  role: CorporateRole;
  scope: string;
  permissions: string[];
};

export type CorporateLocation = {
  id: string;
  name: string;
  code: string;
  region: string;
  format: string;
  teamCount: number;
  learningCompletion: number;
  qualityScore: number;
  activeStandards: number;
  equipment: string[];
  assignedRecipes: string[];
  recentIssues: string[];
  lastCalibration: string;
  signal: CorporateSignal;
  lead: string;
  localTime: string;
};

export type CorporateEquipment = {
  id: string;
  name: string;
  category: "Grinder" | "Brewer" | "Espresso machine" | "Scale" | "Roaster";
  model: string;
  location: string;
  station: string;
  status: "Ready" | "Calibration due" | "Service review";
  dataMode: "Manual" | "Prototype connector" | "No connector";
  lastCheck: string;
  nextAction: string;
  owner: string;
};

export type CorporatePreferences = {
  organizationName: string;
  programName: string;
  unitSystem: "Metric" | "Imperial";
  temperatureUnit: "Celsius" | "Fahrenheit";
  defaultRecipeVisibility: "Organization" | "Location" | "Private draft";
  qualityDigest: "Daily" | "Weekly" | "Off";
  learningReminders: boolean;
  requireStandardApproval: boolean;
};
