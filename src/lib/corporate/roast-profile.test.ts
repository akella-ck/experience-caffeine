import { describe, expect, it } from "vitest";
import { roastProfiles } from "../../data/corporate";
import { calculateDevelopmentRatio, calculateRoastProfileMetrics, validateRoastProfile } from "./roast-profile";

describe("corporate roast-profile calculations", () => {
  it("calculates development time and ratio from first crack to drop", () => {
    expect(calculateDevelopmentRatio(480, 590)).toBe(18.6);
    const metrics = calculateRoastProfileMetrics(roastProfiles[0]);
    expect(metrics.developmentSeconds).toBe(110);
    expect(metrics.developmentRatioPercent).toBe(18.6);
    expect(metrics.temperatureRiseC).toBeGreaterThan(100);
    expect(metrics.averageRateOfRiseCPerMinute).toBeGreaterThan(10);
  });

  it("returns a safe zero ratio for invalid timing", () => {
    expect(calculateDevelopmentRatio(100, 0)).toBe(0);
    expect(calculateDevelopmentRatio(Number.NaN, 500)).toBe(0);
  });

  it("rejects milestones that are out of order", () => {
    const invalid = { ...roastProfiles[0], yellowingSeconds: 520 };
    expect(validateRoastProfile(invalid)).toContain("Milestones must progress from turning point to yellowing, first crack, and drop.");
  });
});
