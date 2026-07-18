import { describe, expect, it } from "vitest";

import { calculateRecipe } from "./recipe";

describe("calculateRecipe", () => {
  it("builds the 250 g V60 starting recipe deterministically", () => {
    const recipe = calculateRecipe({
      originId: "ethiopia",
      roastLevel: "light",
      brewMethodId: "v60",
      grinderId: "baratza-encore",
      cupSizeGrams: 250,
    });

    expect(recipe.coffeeDoseGrams).toBe(15);
    expect(recipe.waterGrams).toBe(250);
    expect(recipe.ratioLabel).toBe("1:16.7");
    expect(recipe.grinderSetting).toBe("14–18");
    expect(recipe.grindDescription).toBe("medium-fine");
    expect(recipe.waterTemperatureCelsius).toBe(95);
    expect(recipe.bloomAmountGrams).toBe(45);
    expect(recipe.bloomDurationSeconds).toBe(45);
    expect(recipe.pourStages.map((stage) => stage.cumulativeWaterGrams)).toEqual([
      45, 150, 250,
    ]);
    expect(recipe.expectedFlavorProfile).toContain("Floral");
  });

  it("changes grinder guidance without changing the measured recipe", () => {
    const encore = calculateRecipe({
      originId: "kenya",
      roastLevel: "light",
      brewMethodId: "v60",
      grinderId: "baratza-encore",
      cupSizeGrams: 300,
    });
    const timemore = calculateRecipe({
      originId: "kenya",
      roastLevel: "light",
      brewMethodId: "v60",
      grinderId: "timemore-c2",
      cupSizeGrams: 300,
    });

    expect(timemore.grinderSetting).toBe("14–17 clicks");
    expect(timemore.coffeeDoseGrams).toBe(encore.coffeeDoseGrams);
    expect(timemore.waterGrams).toBe(encore.waterGrams);
  });

  it("uses roast level to produce a cooler dark-roast starting point", () => {
    const light = calculateRecipe({
      originId: "colombia",
      roastLevel: "light",
      brewMethodId: "aeropress",
      grinderId: "comandante-c40",
      cupSizeGrams: 240,
    });
    const dark = calculateRecipe({
      originId: "colombia",
      roastLevel: "dark",
      brewMethodId: "aeropress",
      grinderId: "comandante-c40",
      cupSizeGrams: 240,
    });

    expect(light.waterTemperatureCelsius).toBe(94);
    expect(dark.waterTemperatureCelsius).toBe(88);
    expect(dark.waterTemperatureCelsius).toBeLessThan(light.waterTemperatureCelsius);
  });

  it("calculates espresso as beverage yield with no bloom", () => {
    const recipe = calculateRecipe({
      originId: "brazil",
      roastLevel: "medium-dark",
      brewMethodId: "espresso",
      grinderId: "breville-smart-grinder-pro",
      cupSizeGrams: 36,
    });

    expect(recipe.coffeeDoseGrams).toBe(18);
    expect(recipe.ratioLabel).toBe("1:2");
    expect(recipe.bloomAmountGrams).toBe(0);
    expect(recipe.pourStages).toHaveLength(1);
    expect(recipe.pourStages[0]?.cumulativeWaterGrams).toBe(36);
  });

  it("rejects an invalid cup size", () => {
    expect(() =>
      calculateRecipe({
        originId: "ethiopia",
        roastLevel: "light",
        brewMethodId: "v60",
        grinderId: "baratza-encore",
        cupSizeGrams: 0,
      }),
    ).toThrow(RangeError);
  });
});
