import { brewMethodById } from "../data/brewing-methods";
import { grinderById } from "../data/grinders";
import { originById } from "../data/origins";
import type {
  BrewMethodId,
  CalculatedRecipe,
  PourStage,
  RecipeCalculationInput,
  RoastLevel,
} from "../types";

const temperatureByRoast: Record<RoastLevel, number> = {
  light: 95,
  medium: 93,
  "medium-dark": 91,
  dark: 89,
};

const methodTemperatureAdjustment: Partial<Record<BrewMethodId, number>> = {
  aeropress: -1,
  espresso: -1,
  "moka-pot": 0,
};

const roundToHalf = (value: number): number => Math.round(value * 2) / 2;
const roundWeight = (value: number): number => Math.round(value);

function buildPourStages(
  methodId: BrewMethodId,
  waterGrams: number,
  bloomAmountGrams: number,
  bloomDurationSeconds: number,
): PourStage[] {
  if (methodId === "v60" || methodId === "chemex") {
    const firstMainTarget = roundWeight(waterGrams * 0.6);
    return [
      {
        id: "bloom",
        label: "Bloom",
        targetWaterGrams: bloomAmountGrams,
        cumulativeWaterGrams: bloomAmountGrams,
        startAtSeconds: 0,
        guidance: "Wet every ground, then use one gentle swirl to remove dry pockets.",
      },
      {
        id: "first-main-pour",
        label: "First main pour",
        targetWaterGrams: firstMainTarget - bloomAmountGrams,
        cumulativeWaterGrams: firstMainTarget,
        startAtSeconds: bloomDurationSeconds,
        guidance: "Pour in calm concentric circles, keeping the stream over the coffee bed.",
      },
      {
        id: "final-pour",
        label: "Final pour",
        targetWaterGrams: waterGrams - firstMainTarget,
        cumulativeWaterGrams: waterGrams,
        startAtSeconds: bloomDurationSeconds + 30,
        guidance: "Complete the pour evenly and finish with a small leveling swirl.",
      },
    ];
  }

  if (methodId === "automatic-drip") {
    return [
      {
        id: "machine-bloom",
        label: "Bloom phase",
        targetWaterGrams: bloomAmountGrams,
        cumulativeWaterGrams: bloomAmountGrams,
        startAtSeconds: 0,
        guidance: "If your brewer has a bloom phase, confirm that the coffee bed becomes evenly wet.",
      },
      {
        id: "machine-brew",
        label: "Main brew cycle",
        targetWaterGrams: waterGrams - bloomAmountGrams,
        cumulativeWaterGrams: waterGrams,
        startAtSeconds: bloomDurationSeconds,
        guidance: "Let the machine complete its programmed delivery without stirring the basket.",
      },
    ];
  }

  const guidanceByMethod: Record<Exclude<BrewMethodId, "v60" | "chemex" | "automatic-drip">, string> = {
    aeropress: "Fill evenly, stir three times, and insert the plunger slightly to limit drip-through.",
    "french-press": "Pour evenly across the grounds, then leave the immersion undisturbed.",
    espresso: "Stop the shot at the target beverage weight and use time as a diagnostic.",
    "moka-pot": "Fill the lower chamber to its safe fill line before assembling the brewer.",
    "cold-brew": "Combine thoroughly enough to remove dry pockets, then leave the slurry undisturbed.",
  };

  return [
    {
      id: "water-delivery",
      label:
        methodId === "espresso"
          ? "Target espresso yield"
          : methodId === "moka-pot"
            ? "Fill the water chamber"
            : "Add all water",
      targetWaterGrams: waterGrams,
      cumulativeWaterGrams: waterGrams,
      startAtSeconds: 0,
      guidance: guidanceByMethod[methodId],
    },
  ];
}

function adjustmentTipFor(methodId: BrewMethodId): string {
  if (methodId === "espresso") {
    return "If the target yield arrives too quickly and tastes sour, grind slightly finer while keeping dose and yield unchanged.";
  }
  if (methodId === "aeropress" || methodId === "french-press" || methodId === "cold-brew") {
    return "If the cup tastes sour or hollow, make the grind slightly finer while keeping steep time and ratio unchanged.";
  }
  if (methodId === "moka-pot") {
    return "If the cup tastes bitter, lower the heat first while keeping dose and grind unchanged.";
  }
  return "If the brew is fast and sour, grind slightly finer; if it is slow and dry, grind slightly coarser. Change only one variable.";
}

export function calculateRecipe(input: RecipeCalculationInput): CalculatedRecipe {
  if (!Number.isFinite(input.cupSizeGrams) || input.cupSizeGrams <= 0) {
    throw new RangeError("Cup size must be a positive number of grams.");
  }

  const origin = originById[input.originId];
  const method = brewMethodById[input.brewMethodId];
  const grinder = grinderById[input.grinderId];
  const grinderSetting = grinder.settings.find(
    (setting) => setting.brewMethodId === input.brewMethodId,
  );

  if (!origin || !method || !grinder || !grinderSetting) {
    throw new Error("The selected coffee, brewing method, or grinder is not available.");
  }

  const waterGrams = roundWeight(input.cupSizeGrams);
  const coffeeDoseGrams = roundToHalf(waterGrams / method.ratio);
  const bloomMultiplier =
    input.brewMethodId === "v60" || input.brewMethodId === "chemex"
      ? 3
      : input.brewMethodId === "automatic-drip"
        ? 2
        : 0;
  const bloomAmountGrams = Math.min(
    waterGrams,
    roundWeight(coffeeDoseGrams * bloomMultiplier),
  );
  const bloomDurationSeconds = bloomAmountGrams > 0 ? method.defaultBloomSeconds : 0;
  const waterTemperatureCelsius =
    input.brewMethodId === "cold-brew"
      ? 20
      : temperatureByRoast[input.roastLevel] +
        (methodTemperatureAdjustment[input.brewMethodId] ?? 0);
  const methodCharacteristic = method.flavorProfile[0];
  const expectedFlavorProfile = Array.from(
    new Set([...origin.flavorNotes.slice(0, 3), methodCharacteristic]),
  );

  return {
    name: `${origin.name} ${method.name} starting recipe`,
    originId: input.originId,
    roastLevel: input.roastLevel,
    brewMethodId: input.brewMethodId,
    grinderId: input.grinderId,
    coffeeDoseGrams,
    waterGrams,
    ratio: method.ratio,
    ratioLabel: `1:${Number.isInteger(method.ratio) ? method.ratio : method.ratio.toFixed(1)}`,
    grindDescription: grinderSetting.grindDescription,
    grinderSetting: grinderSetting.startingRange,
    waterTemperatureCelsius,
    bloomAmountGrams,
    bloomDurationSeconds,
    pourStages: buildPourStages(
      input.brewMethodId,
      waterGrams,
      bloomAmountGrams,
      bloomDurationSeconds,
    ),
    targetBrewTime: method.brewTime,
    expectedFlavorProfile,
    adjustmentTip: adjustmentTipFor(input.brewMethodId),
    guidanceNote:
      "Recommended starting point. Adjust based on taste and drawdown time; calibration, burr wear, bean density, roast level, coffee age, and brewing technique can all shift the ideal setting.",
  };
}
