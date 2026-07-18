import { describe, expect, it } from "vitest";

import {
  beans,
  brewMethods,
  grinders,
  lessons,
  lessonTracks,
  origins,
  recipes,
} from "../data";

describe("coffee domain data integrity", () => {
  const methodIds = new Set(brewMethods.map((method) => method.id));
  const originIds = new Set(origins.map((origin) => origin.id));
  const grinderIds = new Set(grinders.map((grinder) => grinder.id));
  const recipeIds = new Set(recipes.map((recipe) => recipe.id));
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));

  it("resolves every relationship used by brewing methods", () => {
    for (const method of brewMethods) {
      expect(method.relatedOriginIds.every((id) => originIds.has(id))).toBe(true);
      expect(method.relatedGrinderIds.every((id) => grinderIds.has(id))).toBe(true);
    }
  });

  it("gives every catalog grinder a setting for all supported methods", () => {
    for (const grinder of grinders.filter((item) => item.id !== "other")) {
      const settingMethodIds = new Set(
        grinder.settings.map((setting) => setting.brewMethodId),
      );
      expect(settingMethodIds.size).toBe(methodIds.size);
      for (const methodId of methodIds) {
        expect(settingMethodIds.has(methodId)).toBe(true);
      }
    }
  });

  it("keeps bean, recipe, grinder, and lesson references valid", () => {
    expect(beans.every((bean) => originIds.has(bean.originId))).toBe(true);
    expect(
      recipes.every(
        (recipe) =>
          originIds.has(recipe.originId) &&
          methodIds.has(recipe.brewMethodId) &&
          grinderIds.has(recipe.grinderId),
      ),
    ).toBe(true);
    expect(
      grinders.every((grinder) =>
        grinder.recommendedRecipeIds.every((id) => recipeIds.has(id)),
      ),
    ).toBe(true);
    expect(
      lessonTracks.every((track) =>
        track.lessonIds.every((id) => lessonIds.has(id)),
      ),
    ).toBe(true);
  });
});
