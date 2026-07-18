import { troubleshootingRules } from "../data/troubleshooting-rules";
import type { BrewDiagnosis, BrewDiagnosisInput, TroubleshootingRule } from "../types";

const ruleMatches = (
  rule: TroubleshootingRule,
  input: BrewDiagnosisInput,
): boolean =>
  rule.taste === input.taste &&
  (!rule.brewSpeed || rule.brewSpeed === input.speed) &&
  (!rule.brewMethodIds || rule.brewMethodIds.includes(input.brewMethodId)) &&
  (!rule.roastLevels || rule.roastLevels.includes(input.roastLevel)) &&
  (!rule.freshness || rule.freshness === (input.freshness ?? "unknown"));

const specificity = (rule: TroubleshootingRule): number =>
  Number(Boolean(rule.brewSpeed)) +
  Number(Boolean(rule.brewMethodIds)) +
  Number(Boolean(rule.roastLevels)) +
  Number(Boolean(rule.freshness));

export function diagnoseBrew(input: BrewDiagnosisInput): BrewDiagnosis {
  const match = troubleshootingRules
    .filter((rule) => ruleMatches(rule, input))
    .sort((left, right) => {
      const priorityDifference = right.priority - left.priority;
      return priorityDifference || specificity(right) - specificity(left);
    })[0];

  if (!match) {
    throw new Error(`No troubleshooting guidance is available for taste: ${input.taste}`);
  }

  return {
    matchedRuleId: match.id,
    likelyCause: match.likelyCause,
    firstAdjustment: match.firstAdjustment,
    whyItHelps: match.whyItHelps,
    observeNext: match.observeNext,
    principle:
      "Change only one major variable at a time, then taste and record the result before making another adjustment.",
  };
}
