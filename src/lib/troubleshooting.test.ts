import { describe, expect, it } from "vitest";

import { diagnoseBrew } from "./troubleshooting";

const baseInput = {
  brewMethodId: "v60" as const,
  roastLevel: "medium" as const,
};

describe("diagnoseBrew", () => {
  it("recommends a finer grind for a sour, fast brew", () => {
    const diagnosis = diagnoseBrew({
      ...baseInput,
      taste: "sour",
      speed: "faster",
    });

    expect(diagnosis.matchedRuleId).toBe("sour-fast");
    expect(diagnosis.firstAdjustment).toMatch(/grind slightly finer/i);
  });

  it("recommends a coarser grind for a bitter, slow brew", () => {
    const diagnosis = diagnoseBrew({
      ...baseInput,
      taste: "bitter",
      speed: "slower",
    });

    expect(diagnosis.matchedRuleId).toBe("bitter-slow");
    expect(diagnosis.firstAdjustment).toMatch(/grind slightly coarser/i);
  });

  it("raises dose for weak coffee with a normal brew time", () => {
    const diagnosis = diagnoseBrew({
      ...baseInput,
      taste: "weak",
      speed: "as-expected",
    });

    expect(diagnosis.matchedRuleId).toBe("weak-normal");
    expect(diagnosis.firstAdjustment).toMatch(/increase the coffee dose/i);
  });

  it("prioritizes lower agitation for a dry, slow brew", () => {
    const diagnosis = diagnoseBrew({
      ...baseInput,
      taste: "dry",
      speed: "slower",
    });

    expect(diagnosis.matchedRuleId).toBe("dry-slow");
    expect(diagnosis.firstAdjustment).toMatch(/reduce agitation/i);
  });

  it("checks coffee age before recipe changes when flat coffee is stale", () => {
    const diagnosis = diagnoseBrew({
      ...baseInput,
      taste: "flat",
      speed: "as-expected",
      freshness: "stale",
    });

    expect(diagnosis.matchedRuleId).toBe("flat-stale-coffee");
    expect(diagnosis.firstAdjustment).toMatch(/roast date and storage/i);
    expect(diagnosis.principle).toMatch(/one major variable at a time/i);
  });
});
