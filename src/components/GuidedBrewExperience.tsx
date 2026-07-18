"use client";

import { useSearchParams } from "next/navigation";
import { MemberRouteGuard } from "@/components/auth/RouteGuards";
import { GuidedBrewTimer, type GuidedBrewStep } from "@/components/GuidedBrewTimer";
import { brewMethods, coffeeOrigins, grinders } from "@/data";
import { calculateRecipe } from "@/lib/recipe";
import type {
  BrewMethodId,
  BrewingMethod,
  CalculatedRecipe,
  GrinderId,
  OriginId,
  RoastLevel,
} from "@/types";

function buildV60Steps(
  dose: number,
  water: number,
  bloom: number,
  bloomSeconds: number,
  firstMainTarget: number,
): GuidedBrewStep[] {
  return [
    {
      id: "prepare-filter",
      title: "Prepare filter",
      instruction: "Rinse the paper thoroughly, warm the brewer, then discard the rinse water.",
      durationSeconds: 20,
      targetWaterGrams: 0,
      cue: "No coffee yet",
    },
    {
      id: "add-coffee",
      title: `Add ${dose} g coffee`,
      instruction: "Add the grounds and gently shake the brewer to create a flat bed.",
      durationSeconds: 15,
      targetWaterGrams: 0,
      cue: "Tare your scale",
    },
    {
      id: "first-pour",
      title: `Pour to ${bloom} g`,
      instruction: "Wet every ground with a controlled spiral, working from the center outward.",
      durationSeconds: 12,
      targetWaterGrams: bloom,
      cue: "Gentle, complete saturation",
    },
    {
      id: "bloom",
      title: `Bloom for ${bloomSeconds} seconds`,
      instruction: "Let trapped gas escape. Give the brewer one careful swirl if dry pockets remain.",
      durationSeconds: bloomSeconds,
      targetWaterGrams: bloom,
      cue: "Wait for the bed to settle",
    },
    {
      id: "second-pour",
      title: `Pour to ${firstMainTarget} g`,
      instruction: "Pour slowly in tight circles. Keep the water level comfortably below the rim.",
      durationSeconds: 30,
      targetWaterGrams: firstMainTarget,
      cue: "Steady 4–5 g per second",
    },
    {
      id: "final-pour",
      title: `Pour to ${water} g`,
      instruction: "Complete the final pour, then give the brewer one small settling swirl.",
      durationSeconds: 30,
      targetWaterGrams: water,
      cue: "Finish with a level coffee bed",
    },
    {
      id: "drawdown",
      title: "Wait for drawdown",
      instruction: "Let the water pass through the bed. Avoid stirring or tapping the brewer now.",
      durationSeconds: 75,
      targetWaterGrams: water,
      cue: "Watch the flow and total time",
    },
    {
      id: "taste",
      title: "Taste and record",
      instruction: "Swirl the server, let the coffee cool slightly, and note sweetness, acidity, and finish.",
      durationSeconds: 0,
      targetWaterGrams: water,
      cue: "One adjustment at a time",
    },
  ];
}

function adaptMethodStepText(
  text: string,
  method: BrewingMethod,
  recipe: CalculatedRecipe,
  originalTarget?: number,
  scaledTarget?: number,
) {
  const defaultDose = Math.round((method.defaultCupSizeGrams / method.ratio) * 2) / 2;
  return text.replace(/(\d+(?:\.\d+)?)\s*g\b/g, (match, rawValue: string) => {
    const value = Number(rawValue);
    if (Math.abs(value - defaultDose) <= 0.75) return `${recipe.coffeeDoseGrams} g`;
    if (originalTarget && scaledTarget && Math.abs(value - originalTarget) <= 0.75) {
      return `${scaledTarget} g`;
    }
    if (Math.abs(value - method.defaultCupSizeGrams) <= 0.75) return `${recipe.waterGrams} g`;
    return match;
  });
}

function buildMethodSteps(method: BrewingMethod, recipe: CalculatedRecipe): GuidedBrewStep[] {
  const techniqueSteps = method.steps.map((step) => {
    const scaledTarget = step.targetWaterGrams
      ? Math.round((step.targetWaterGrams / method.defaultCupSizeGrams) * recipe.waterGrams)
      : 0;
    const title = adaptMethodStepText(
      step.title,
      method,
      recipe,
      step.targetWaterGrams,
      scaledTarget,
    );
    const instruction = adaptMethodStepText(
      step.instruction,
      method,
      recipe,
      step.targetWaterGrams,
      scaledTarget,
    );

    return {
      id: step.id,
      title,
      instruction,
      durationSeconds: step.durationSeconds ?? 20,
      targetWaterGrams: scaledTarget,
      cue: step.tip
        ?? (scaledTarget > 0
          ? `Target ${scaledTarget} g cumulative`
          : step.order === 2
            ? `${recipe.grinderSetting} starting range`
            : "Follow the technique cue"),
    };
  });

  return [
    ...techniqueSteps,
    {
      id: "taste",
      title: "Taste and record",
      instruction: "Let the coffee reach a comfortable temperature, then record sweetness, acidity, body, and finish.",
      durationSeconds: 0,
      targetWaterGrams: recipe.waterGrams,
      cue: "Change one variable next time",
    },
  ];
}

export function GuidedBrewExperience() {
  const params = useSearchParams();
  const requestedOrigin = params.get("origin");
  const requestedMethod = params.get("method");
  const requestedGrinder = params.get("grinder");
  const requestedRoast = params.get("roast");

  const originId: OriginId = coffeeOrigins.find((origin) => origin.id === requestedOrigin)?.id ?? "ethiopia";
  const method = brewMethods.find((candidate) => candidate.id === requestedMethod) ?? brewMethods[0];
  const brewMethodId: BrewMethodId = method.id;
  const grinderId: GrinderId = grinders.find((grinder) => grinder.id === requestedGrinder)?.id ?? "baratza-encore";
  const roastLevels: RoastLevel[] = ["light", "medium", "medium-dark", "dark"];
  const roastLevel: RoastLevel = roastLevels.find((roast) => roast === requestedRoast) ?? "light";
  const requestedSize = Number(params.get("size"));
  const minimumSize = brewMethodId === "espresso" ? 20 : 100;
  const cupSizeGrams = Number.isFinite(requestedSize) && requestedSize >= minimumSize
    ? Math.min(1500, requestedSize)
    : method.defaultCupSizeGrams;

  const recipe = calculateRecipe({
    originId,
    roastLevel,
    brewMethodId,
    grinderId,
    cupSizeGrams,
  });
  const origin = coffeeOrigins.find((candidate) => candidate.id === originId);

  const steps: GuidedBrewStep[] = brewMethodId === "v60"
    ? buildV60Steps(
        recipe.coffeeDoseGrams,
        recipe.waterGrams,
        recipe.bloomAmountGrams,
        recipe.bloomDurationSeconds,
        recipe.pourStages[1]?.cumulativeWaterGrams ?? Math.round(recipe.waterGrams * 0.6),
      )
    : buildMethodSteps(method, recipe);

  const guidedPath = `/guided-brew?origin=${originId}&roast=${roastLevel}&method=${brewMethodId}&grinder=${grinderId}&size=${cupSizeGrams}`;

  return (
    <MemberRouteGuard nextPath={guidedPath}>
      <GuidedBrewTimer
        brewMethodId={brewMethodId}
        methodLabel={method.name}
        recipeTitle={`${origin?.name ?? "Coffee"} · ${method.name} starting recipe`}
        roastLevel={roastLevel}
        returnHref={`/brew-lab?origin=${originId}&roast=${roastLevel}&method=${brewMethodId}&grinder=${grinderId}&size=${cupSizeGrams}`}
        steps={steps}
      />
    </MemberRouteGuard>
  );
}
