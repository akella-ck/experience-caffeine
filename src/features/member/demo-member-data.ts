import type { BrewMethodId, GrinderId, OriginId, RoastLevel } from "@/types";

export type SavedRecipeSummary = {
  id: string;
  name: string;
  originId: OriginId;
  roastLevel: RoastLevel;
  brewMethodId: BrewMethodId;
  grinderId: GrinderId;
  cupSizeGrams: number;
  lastBrewed: string;
  rating: number;
  flavorNotes: readonly string[];
};

export type ExperienceLevel = "new" | "comfortable" | "advanced";
export type BrewGoal = "balanced" | "clarity" | "sweetness" | "body";

export type MemberPreferences = {
  experienceLevel: ExperienceLevel;
  primaryGrinderId: GrinderId;
  primaryMethodId: BrewMethodId;
  preferredRoast: RoastLevel;
  brewGoal: BrewGoal;
  preferredOriginIds: OriginId[];
};

export const savedRecipes = [
  {
    id: "saved-ethiopia-v60",
    name: "Weekday Yirgacheffe",
    originId: "ethiopia",
    roastLevel: "light",
    brewMethodId: "v60",
    grinderId: "baratza-encore",
    cupSizeGrams: 250,
    lastBrewed: "Jul 14",
    rating: 5,
    flavorNotes: ["Jasmine", "Lemon", "White tea"],
  },
  {
    id: "saved-colombia-aeropress",
    name: "Sweet travel AeroPress",
    originId: "colombia",
    roastLevel: "medium",
    brewMethodId: "aeropress",
    grinderId: "timemore-c2",
    cupSizeGrams: 240,
    lastBrewed: "Jul 12",
    rating: 4,
    flavorNotes: ["Caramel", "Red apple", "Cocoa"],
  },
  {
    id: "saved-guatemala-press",
    name: "Slow Sunday press",
    originId: "guatemala",
    roastLevel: "medium",
    brewMethodId: "french-press",
    grinderId: "comandante-c40",
    cupSizeGrams: 450,
    lastBrewed: "Jul 8",
    rating: 4,
    flavorNotes: ["Orange", "Cinnamon", "Round body"],
  },
] as const satisfies readonly SavedRecipeSummary[];

export const defaultMemberPreferences: MemberPreferences = {
  experienceLevel: "comfortable",
  primaryGrinderId: "baratza-encore",
  primaryMethodId: "v60",
  preferredRoast: "light",
  brewGoal: "clarity",
  preferredOriginIds: ["ethiopia", "kenya"],
};

export const MEMBER_PREFERENCES_STORAGE_KEY = "experience-caffeine-member-preferences-v1";

export function savedRecipeHref(recipe: SavedRecipeSummary) {
  const params = new URLSearchParams({
    origin: recipe.originId,
    roast: recipe.roastLevel,
    method: recipe.brewMethodId,
    grinder: recipe.grinderId,
    size: String(recipe.cupSizeGrams),
  });
  return `/brew-lab?${params.toString()}`;
}
