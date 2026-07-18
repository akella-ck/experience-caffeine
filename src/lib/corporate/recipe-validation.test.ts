import { describe, expect, it } from "vitest";
import { corporateRecipes } from "../../data/corporate";
import { recipeRatio, validateCorporateRecipe } from "./recipe-validation";

describe("corporate recipe validation", () => {
  it("accepts a complete approved reference recipe", () => {
    expect(validateCorporateRecipe(corporateRecipes[0])).toEqual([]);
    expect(recipeRatio(corporateRecipes[0])).toBe(16.7);
  });

  it("requires water for a non-espresso recipe", () => {
    const invalid = { ...corporateRecipes[0], waterGrams: null };
    expect(validateCorporateRecipe(invalid)).toContainEqual({
      field: "waterGrams",
      message: "This recipe requires a positive water amount.",
    });
  });

  it("requires an approver before an approved recipe is valid", () => {
    const invalid = { ...corporateRecipes[0], approvedBy: null };
    expect(validateCorporateRecipe(invalid).some((issue) => issue.message.includes("approver"))).toBe(true);
  });
});
