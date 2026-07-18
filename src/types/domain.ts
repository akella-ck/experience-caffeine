export type RoastLevel = "light" | "medium" | "medium-dark" | "dark";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type BrewMethodId =
  | "v60"
  | "aeropress"
  | "french-press"
  | "chemex"
  | "espresso"
  | "moka-pot"
  | "cold-brew"
  | "automatic-drip";

export type OriginId =
  | "ethiopia"
  | "colombia"
  | "brazil"
  | "kenya"
  | "guatemala";

export type GrinderId =
  | "baratza-encore"
  | "fellow-ode-gen-2"
  | "timemore-c2"
  | "comandante-c40"
  | "breville-smart-grinder-pro"
  | "other";

export type ProcessingMethod =
  | "Washed"
  | "Natural"
  | "Honey"
  | "Wet-hulled"
  | "Anaerobic";

export type GrindDescription =
  | "fine"
  | "medium-fine"
  | "medium"
  | "medium-coarse"
  | "coarse"
  | "extra-coarse";

export type LessonTrackId =
  | "coffee-foundations"
  | "brewing-science"
  | "equipment-skills"
  | "sensory-skills";

export type LessonType = "Article" | "Interactive" | "Video" | "Practice";

export type LessonProgress = "not-started" | "in-progress" | "complete";

export type TasteProblem =
  | "sour"
  | "bitter"
  | "weak"
  | "too-strong"
  | "dry"
  | "hollow"
  | "flat";

export type BrewSpeed = "faster" | "as-expected" | "slower";

export type CoffeeFreshness = "fresh" | "unknown" | "stale";

export type JournalRating = 1 | 2 | 3 | 4 | 5;

export interface CoffeeOrigin {
  id: OriginId;
  slug: OriginId;
  name: string;
  regions: string[];
  altitude: string;
  altitudeMeters: readonly [number, number];
  processes: ProcessingMethod[];
  flavorNotes: string[];
  body: string;
  acidity: string;
  recommendedRoasts: RoastLevel[];
  recommendedMethods: BrewMethodId[];
  description: string;
  coordinates: {
    x: number;
    y: number;
  };
}

export interface Bean {
  id: string;
  slug: string;
  name: string;
  originId: OriginId;
  region: string;
  producer: string;
  variety: string[];
  process: ProcessingMethod;
  altitude: string;
  flavorNotes: string[];
  roastLevel: RoastLevel;
  recommendedMethods: BrewMethodId[];
  description: string;
}

export interface BrewInstruction {
  id: string;
  order: number;
  title: string;
  instruction: string;
  durationSeconds?: number;
  targetWaterGrams?: number;
  tip?: string;
}

export interface CommonMistake {
  title: string;
  symptom: string;
  correction: string;
}

export interface VideoChapter {
  title: string;
  timestamp: string;
}

export interface VideoPlaceholder {
  title: string;
  duration: string;
  thumbnail: string;
  captionsAvailable: boolean;
  description: string;
  chapters: VideoChapter[];
}

export interface BrewingMethod {
  id: BrewMethodId;
  slug: BrewMethodId;
  name: string;
  category: "Pour over" | "Immersion" | "Pressure" | "Stovetop" | "Cold" | "Automatic";
  tagline: string;
  description: string;
  difficulty: Difficulty;
  brewTime: string;
  brewTimeMinutes: readonly [number, number];
  body: string;
  clarity: string;
  flavorProfile: string[];
  equipment: string[];
  grindRange: string;
  grindDescription: GrindDescription;
  recommendedRatio: string;
  ratio: number;
  waterTemperature: string;
  temperatureRangeCelsius: readonly [number, number];
  defaultCupSizeGrams: number;
  defaultBloomSeconds: number;
  steps: BrewInstruction[];
  commonMistakes: CommonMistake[];
  troubleshooting: string[];
  video: VideoPlaceholder;
  relatedOriginIds: OriginId[];
  relatedGrinderIds: GrinderId[];
}

export interface GrinderSetting {
  brewMethodId: BrewMethodId;
  startingRange: string;
  grindDescription: GrindDescription;
  adjustmentAdvice: string;
}

export interface Grinder {
  id: GrinderId;
  slug: GrinderId;
  name: string;
  brand: string;
  adjustmentType: string;
  description: string;
  overview: string;
  burrType: string;
  bestFor: BrewMethodId[];
  zeroPointInstructions: string[];
  settings: GrinderSetting[];
  calibrationSteps: string[];
  cleaningSteps: string[];
  commonErrors: CommonMistake[];
  video: VideoPlaceholder;
  recommendedRecipeIds: string[];
}

export interface BrewStep {
  id: string;
  title: string;
  instruction: string;
  durationSeconds?: number;
  targetWaterGrams?: number;
  cumulativeWeightGrams?: number;
}

export interface BrewRecipe {
  id: string;
  name: string;
  originId: OriginId;
  roastLevel: RoastLevel;
  brewMethodId: BrewMethodId;
  grinderId: GrinderId;
  coffeeDoseGrams: number;
  waterGrams: number;
  ratio: number;
  grindDescription: GrindDescription;
  grinderSetting: string;
  temperatureCelsius: number;
  bloomGrams: number;
  bloomSeconds: number;
  targetBrewTime: string;
  expectedFlavorProfile: string[];
  adjustmentTip: string;
  steps: BrewStep[];
}

export interface LessonSection {
  id: string;
  heading: string;
  body: string;
  takeaway?: string;
}

export interface Lesson {
  id: string;
  slug: string;
  trackId: LessonTrackId;
  title: string;
  summary: string;
  difficulty: Difficulty;
  durationMinutes: number;
  progress: LessonProgress;
  type: LessonType;
  icon: string;
  sections?: LessonSection[];
}

export interface LessonTrack {
  id: LessonTrackId;
  title: string;
  description: string;
  icon: string;
  lessonIds: string[];
}

export interface TroubleshootingRule {
  id: string;
  taste: TasteProblem;
  brewSpeed?: BrewSpeed;
  brewMethodIds?: BrewMethodId[];
  roastLevels?: RoastLevel[];
  freshness?: CoffeeFreshness;
  likelyCause: string;
  firstAdjustment: string;
  whyItHelps: string;
  observeNext: string;
  priority: number;
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  coffeeName: string;
  originId: OriginId;
  origin: string;
  roaster: string;
  roastDate: string;
  brewMethodId: BrewMethodId;
  grinderId: GrinderId;
  grindSetting: string;
  coffeeDoseGrams: number;
  waterGrams: number;
  temperatureCelsius: number;
  brewTimeSeconds: number;
  tasteNotes: string[];
  notes: string;
  rating: JournalRating;
}

export interface RecipeCalculationInput {
  originId: OriginId;
  roastLevel: RoastLevel;
  brewMethodId: BrewMethodId;
  grinderId: GrinderId;
  cupSizeGrams: number;
}

export interface PourStage {
  id: string;
  label: string;
  targetWaterGrams: number;
  cumulativeWaterGrams: number;
  startAtSeconds: number;
  guidance: string;
}

export interface CalculatedRecipe {
  name: string;
  originId: OriginId;
  roastLevel: RoastLevel;
  brewMethodId: BrewMethodId;
  grinderId: GrinderId;
  coffeeDoseGrams: number;
  waterGrams: number;
  ratio: number;
  ratioLabel: string;
  grindDescription: GrindDescription;
  grinderSetting: string;
  waterTemperatureCelsius: number;
  bloomAmountGrams: number;
  bloomDurationSeconds: number;
  pourStages: PourStage[];
  targetBrewTime: string;
  expectedFlavorProfile: string[];
  adjustmentTip: string;
  guidanceNote: string;
}

export interface BrewDiagnosisInput {
  taste: TasteProblem;
  speed: BrewSpeed;
  brewMethodId: BrewMethodId;
  roastLevel: RoastLevel;
  freshness?: CoffeeFreshness;
}

export interface BrewDiagnosis {
  matchedRuleId: string;
  likelyCause: string;
  firstAdjustment: string;
  whyItHelps: string;
  observeNext: string;
  principle: string;
}
