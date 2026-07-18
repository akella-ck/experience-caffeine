import type { RoastCurvePoint, RoastProfile, RoastProfileDraft, RoastProfileMetrics } from "../../types";

function round(value: number, places = 1) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function calculateDevelopmentRatio(firstCrackSeconds: number, totalTimeSeconds: number) {
  if (!Number.isFinite(firstCrackSeconds) || !Number.isFinite(totalTimeSeconds) || totalTimeSeconds <= 0) {
    return 0;
  }
  const developmentSeconds = Math.max(0, totalTimeSeconds - firstCrackSeconds);
  return round((developmentSeconds / totalTimeSeconds) * 100);
}

export function calculateRoastProfileMetrics(profile: Pick<
  RoastProfile,
  "curve" | "dropTemperatureC" | "firstCrackSeconds" | "totalTimeSeconds" | "turningPointSeconds"
>): RoastProfileMetrics {
  const developmentSeconds = Math.max(0, profile.totalTimeSeconds - profile.firstCrackSeconds);
  const turningPoint = profile.curve.find((point) => point.event === "turning-point") ?? profile.curve[1] ?? profile.curve[0];
  const temperatureRiseC = turningPoint
    ? Math.max(0, profile.dropTemperatureC - turningPoint.beanTemperatureC)
    : 0;
  const riseDurationSeconds = Math.max(1, profile.totalTimeSeconds - profile.turningPointSeconds);

  return {
    developmentSeconds,
    developmentRatioPercent: calculateDevelopmentRatio(profile.firstCrackSeconds, profile.totalTimeSeconds),
    temperatureRiseC: round(temperatureRiseC),
    averageRateOfRiseCPerMinute: round((temperatureRiseC / riseDurationSeconds) * 60),
  };
}

export function buildReferenceCurve(profile: Pick<
  RoastProfileDraft,
  | "chargeTemperatureC"
  | "dropTemperatureC"
  | "turningPointSeconds"
  | "yellowingSeconds"
  | "firstCrackSeconds"
  | "totalTimeSeconds"
>): RoastCurvePoint[] {
  const turningTemperature = Math.max(70, Math.min(110, profile.chargeTemperatureC - 105));
  const yellowingTemperature = Math.min(profile.dropTemperatureC - 35, 160);
  const firstCrackTemperature = Math.min(profile.dropTemperatureC - 6, 198);
  const midpointSeconds = Math.round((profile.yellowingSeconds + profile.firstCrackSeconds) / 2);
  const midpointTemperature = round((yellowingTemperature + firstCrackTemperature) / 2);

  return [
    { seconds: 0, beanTemperatureC: profile.chargeTemperatureC, rateOfRiseCPerMinute: 0, event: "charge" },
    { seconds: profile.turningPointSeconds, beanTemperatureC: turningTemperature, rateOfRiseCPerMinute: 15.5, event: "turning-point" },
    { seconds: profile.yellowingSeconds, beanTemperatureC: yellowingTemperature, rateOfRiseCPerMinute: 10.2, event: "yellowing" },
    { seconds: midpointSeconds, beanTemperatureC: midpointTemperature, rateOfRiseCPerMinute: 8 },
    { seconds: profile.firstCrackSeconds, beanTemperatureC: firstCrackTemperature, rateOfRiseCPerMinute: 6.1, event: "first-crack" },
    { seconds: profile.totalTimeSeconds, beanTemperatureC: profile.dropTemperatureC, rateOfRiseCPerMinute: 3.4, event: "drop" },
  ];
}

export function validateRoastProfile(profile: Pick<
  RoastProfileDraft,
  | "batchSizeKg"
  | "chargeTemperatureC"
  | "dropTemperatureC"
  | "turningPointSeconds"
  | "yellowingSeconds"
  | "firstCrackSeconds"
  | "totalTimeSeconds"
  | "greenDensityGramsPerLiter"
  | "greenMoisturePercent"
  | "weightLossPercent"
  | "qualityScore"
>) {
  const issues: string[] = [];
  if (profile.batchSizeKg <= 0) issues.push("Batch size must be greater than zero.");
  if (profile.chargeTemperatureC < 100 || profile.chargeTemperatureC > 300) issues.push("Charge temperature must be between 100°C and 300°C.");
  if (profile.dropTemperatureC < 100 || profile.dropTemperatureC > 250) issues.push("Drop temperature must be between 100°C and 250°C.");
  if (!(profile.turningPointSeconds < profile.yellowingSeconds && profile.yellowingSeconds < profile.firstCrackSeconds && profile.firstCrackSeconds < profile.totalTimeSeconds)) {
    issues.push("Milestones must progress from turning point to yellowing, first crack, and drop.");
  }
  if (profile.greenDensityGramsPerLiter < 400 || profile.greenDensityGramsPerLiter > 1000) issues.push("Green density must be between 400 and 1,000 g/L.");
  if (profile.greenMoisturePercent < 5 || profile.greenMoisturePercent > 20) issues.push("Green moisture must be between 5% and 20%.");
  if (profile.weightLossPercent < 0 || profile.weightLossPercent > 30) issues.push("Weight loss must be between 0% and 30%.");
  if (profile.qualityScore !== null && (profile.qualityScore < 0 || profile.qualityScore > 100)) issues.push("Quality score must be between 0 and 100.");
  return issues;
}

export function synchronizeRoastProfile(profile: RoastProfile): RoastProfile {
  const metrics = calculateRoastProfileMetrics(profile);
  return {
    ...profile,
    developmentSeconds: metrics.developmentSeconds,
    developmentRatioPercent: metrics.developmentRatioPercent,
  };
}
