import type { CorporateRecipe, CorporateRecipeDraft, RecipeValidationIssue } from "../../types";

export function validateCorporateRecipe(recipe: CorporateRecipe | CorporateRecipeDraft): RecipeValidationIssue[] {
  const issues: RecipeValidationIssue[] = [];
  const requiredText: Array<["code" | "name" | "coffee" | "origin" | "grinder" | "grinderSetting" | "grindTarget" | "targetBrewTime", string]> = [
    ["code", recipe.code],
    ["name", recipe.name],
    ["coffee", recipe.coffee],
    ["origin", recipe.origin],
    ["grinder", recipe.grinder],
    ["grinderSetting", recipe.grinderSetting],
    ["grindTarget", recipe.grindTarget],
    ["targetBrewTime", recipe.targetBrewTime],
  ];
  requiredText.forEach(([field, value]) => {
    if (!value.trim()) issues.push({ field, message: `${field === "grindTarget" ? "Grind target" : field === "targetBrewTime" ? "Target brew time" : field[0].toUpperCase() + field.slice(1)} is required.` });
  });

  if (recipe.locationIds.length === 0) issues.push({ field: "locationIds", message: "Choose at least one location scope." });
  if (!Number.isFinite(recipe.coffeeDoseGrams) || recipe.coffeeDoseGrams <= 0) issues.push({ field: "coffeeDoseGrams", message: "Coffee dose must be greater than zero." });
  if (recipe.method === "Espresso") {
    if (!recipe.yieldGrams || recipe.yieldGrams <= 0) issues.push({ field: "yieldGrams", message: "Espresso requires a positive beverage yield." });
  } else if (!recipe.waterGrams || recipe.waterGrams <= 0) {
    issues.push({ field: "waterGrams", message: "This recipe requires a positive water amount." });
  }
  if (!Number.isFinite(recipe.temperatureCelsius) || recipe.temperatureCelsius < 0 || recipe.temperatureCelsius > 100) {
    issues.push({ field: "temperatureCelsius", message: "Temperature must be between 0°C and 100°C." });
  }
  if (recipe.steps.filter((step) => step.trim()).length === 0) issues.push({ field: "steps", message: "Add at least one operational step." });
  if (recipe.qualityTarget.filter((target) => target.trim()).length === 0) issues.push({ field: "qualityTarget", message: "Add at least one quality target." });
  if (recipe.status === "approved" && !recipe.approvedBy?.trim()) issues.push({ field: "qualityTarget", message: "Approved recipes must identify an approver." });
  return issues;
}

export function recipeRatio(recipe: Pick<CorporateRecipe, "coffeeDoseGrams" | "waterGrams" | "yieldGrams">) {
  const liquid = recipe.waterGrams ?? recipe.yieldGrams ?? 0;
  if (recipe.coffeeDoseGrams <= 0 || liquid <= 0) return 0;
  return Math.round((liquid / recipe.coffeeDoseGrams) * 10) / 10;
}
