"use client";

import { useCallback, useEffect, useState } from "react";
import { brewMethods, coffeeOrigins, grinders } from "@/data";
import type { BrewMethodId, GrinderId, OriginId, RoastLevel } from "@/types";
import {
  defaultMemberPreferences,
  MEMBER_PREFERENCES_STORAGE_KEY,
  type BrewGoal,
  type ExperienceLevel,
  type MemberPreferences,
} from "@/features/member/demo-member-data";

const experienceLevels = new Set<ExperienceLevel>(["new", "comfortable", "advanced"]);
const brewGoals = new Set<BrewGoal>(["balanced", "clarity", "sweetness", "body"]);
const roastLevels = new Set<RoastLevel>(["light", "medium", "medium-dark", "dark"]);
const grinderIds = new Set<GrinderId>(grinders.map((grinder) => grinder.id));
const methodIds = new Set<BrewMethodId>(brewMethods.map((method) => method.id));
const originIds = new Set<OriginId>(coffeeOrigins.map((origin) => origin.id));

export function isMemberPreferences(value: unknown): value is MemberPreferences {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<MemberPreferences>;
  return Boolean(
    candidate.experienceLevel && experienceLevels.has(candidate.experienceLevel)
      && candidate.primaryGrinderId && grinderIds.has(candidate.primaryGrinderId)
      && candidate.primaryMethodId && methodIds.has(candidate.primaryMethodId)
      && candidate.preferredRoast && roastLevels.has(candidate.preferredRoast)
      && candidate.brewGoal && brewGoals.has(candidate.brewGoal)
      && Array.isArray(candidate.preferredOriginIds)
      && candidate.preferredOriginIds.every((id) => originIds.has(id)),
  );
}

export function useMemberPreferences() {
  const [preferences, setPreferences] = useState<MemberPreferences>(defaultMemberPreferences);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(MEMBER_PREFERENCES_STORAGE_KEY);
        const parsed: unknown = stored ? JSON.parse(stored) : null;
        if (isMemberPreferences(parsed)) setPreferences(parsed);
      } catch {
        // Unavailable or malformed local storage falls back to the typed defaults.
      }
      setIsHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const savePreferences = useCallback((next: MemberPreferences) => {
    setPreferences(next);
    try {
      window.localStorage.setItem(MEMBER_PREFERENCES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the in-memory update even when browser storage is unavailable.
    }
  }, []);

  const resetPreferences = useCallback(() => {
    savePreferences(defaultMemberPreferences);
  }, [savePreferences]);

  return { isHydrated, preferences, resetPreferences, savePreferences };
}
