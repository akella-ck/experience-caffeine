import { roastProfiles } from "../../../data/corporate";
import { BaseRoasterAdapter } from "./base-adapter";
import type { RoasterAdapterDescriptor, RoasterConnectionConfig } from "./types";

export const mockRoasterDescriptor: RoasterAdapterDescriptor = {
  id: "mock-roaster",
  name: "Roaster telemetry sandbox",
  vendor: "Experience Caffeine",
  mode: "mock",
  capabilities: ["read-profiles", "read-telemetry", "export-profile-reference"],
  safetyBoundary: "Local simulation only. This adapter cannot issue start, stop, heat, airflow, drum, or drop commands.",
};

export class MockRoasterAdapter extends BaseRoasterAdapter {
  readonly descriptor = mockRoasterDescriptor;

  protected async openConnection(config: RoasterConnectionConfig) {
    if (!config.workspaceId.trim()) throw new Error("A workspace identifier is required.");
    await Promise.resolve();
  }

  async listProfiles() {
    this.assertConnected();
    return roastProfiles.map((profile) => ({
      ...profile,
      curve: profile.curve.map((point) => ({ ...point })),
      notes: [...profile.notes],
      revisionHistory: profile.revisionHistory.map((revision) => ({ ...revision })),
      sensoryTargets: [...profile.sensoryTargets],
    }));
  }

  async getProfile(profileId: string) {
    this.assertConnected();
    const profile = roastProfiles.find((candidate) => candidate.id === profileId);
    return profile
      ? {
          ...profile,
          curve: profile.curve.map((point) => ({ ...point })),
          notes: [...profile.notes],
          revisionHistory: profile.revisionHistory.map((revision) => ({ ...revision })),
          sensoryTargets: [...profile.sensoryTargets],
        }
      : null;
  }

  async getTelemetrySample(profileId: string, elapsedSeconds: number) {
    this.assertConnected();
    const profile = roastProfiles.find((candidate) => candidate.id === profileId);
    if (!profile) throw new Error("The requested mock profile is not available.");
    const clamped = Math.max(0, Math.min(profile.totalTimeSeconds, Math.round(elapsedSeconds)));
    const nextIndex = profile.curve.findIndex((point) => point.seconds >= clamped);
    const next = nextIndex < 0 ? profile.curve[profile.curve.length - 1] : profile.curve[nextIndex];
    const previous = nextIndex <= 0 ? profile.curve[0] : profile.curve[nextIndex - 1];
    if (!next || !previous) throw new Error("The mock profile has no telemetry points.");
    const duration = Math.max(1, next.seconds - previous.seconds);
    const progress = Math.max(0, Math.min(1, (clamped - previous.seconds) / duration));

    return {
      profileId,
      timestamp: new Date(clamped * 1000).toISOString(),
      elapsedSeconds: clamped,
      beanTemperatureC: Math.round((previous.beanTemperatureC + (next.beanTemperatureC - previous.beanTemperatureC) * progress) * 10) / 10,
      rateOfRiseCPerMinute: Math.round((previous.rateOfRiseCPerMinute + (next.rateOfRiseCPerMinute - previous.rateOfRiseCPerMinute) * progress) * 10) / 10,
      source: "simulation" as const,
    };
  }
}
