import { describe, expect, it } from "vitest";
import { diagnoseCorporateIssue } from "./troubleshooting";
import type { CorporateTroubleSymptom, CorporateTroubleshootingInput } from "../../types";

const baseInput: CorporateTroubleshootingInput = {
  symptom: "sour",
  timing: "faster",
  scope: "single-cup",
  recentChanges: ["none"],
  method: "V60",
  location: "Test café",
  notes: "",
};

const allSymptoms: CorporateTroubleSymptom[] = ["sour", "bitter", "hollow", "flat", "weak", "harsh", "dry", "astringent", "smoky", "baked", "scorched", "underdeveloped", "inconsistent-shots", "slow-drawdown", "fast-drawdown"];

describe("corporate deterministic troubleshooting", () => {
  it("returns structured guidance for every supported symptom", () => {
    allSymptoms.forEach((symptom) => {
      const result = diagnoseCorporateIssue({ ...baseInput, symptom });
      expect(result.possibleCauses.length).toBeGreaterThanOrEqual(2);
      expect(result.firstVariableToChange).not.toHaveLength(0);
      expect(result.whatToMeasureNext.length).toBeGreaterThan(0);
      expect(result.escalationRecommendation).not.toHaveLength(0);
    });
  });

  it("places suspected roast defects on hold", () => {
    const result = diagnoseCorporateIssue({ ...baseInput, symptom: "scorched", scope: "batch" });
    expect(result.severity).toBe("hold");
    expect(result.inspectionTarget).toBe("roast");
    expect(result.containment).toMatch(/Do not release/i);
  });

  it("uses moderate confidence when timing was not measured", () => {
    const result = diagnoseCorporateIssue({ ...baseInput, timing: "not-measured" });
    expect(result.confidence).toBe("moderate");
  });

  it("does not claim high confidence from comparative timing alone", () => {
    const result = diagnoseCorporateIssue(baseInput);
    expect(result.confidence).toBe("moderate");
  });

  it("uses high confidence when timing and enough measured brew context are present", () => {
    const result = diagnoseCorporateIssue({
      ...baseInput,
      doseGrams: 18,
      yieldGrams: 38,
      brewTimeSeconds: 25,
      temperatureCelsius: 93,
      grindSetting: "4.2",
    });
    expect(result.confidence).toBe("high");
  });
});
