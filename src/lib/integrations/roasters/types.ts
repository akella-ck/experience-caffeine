import type { RoastProfile } from "../../../types";

export type RoasterConnectionStatus = "not_connected" | "connecting" | "connected" | "error";

export type RoasterAdapterMode = "mock" | "planned";

export type RoasterCapability =
  | "read-profiles"
  | "read-batch-history"
  | "read-telemetry"
  | "export-profile-reference";

export type RoasterAdapterDescriptor = {
  id: string;
  name: string;
  vendor: string;
  mode: RoasterAdapterMode;
  capabilities: RoasterCapability[];
  safetyBoundary: string;
};

export type RoasterConnectionConfig = {
  workspaceId: string;
  label?: string;
};

export type RoasterConnectionSnapshot = {
  state: RoasterConnectionStatus;
  connectedAt: string | null;
  workspaceId: string | null;
  message: string;
};

export type RoasterTelemetry = {
  timestamp: string;
  elapsedSeconds: number;
  beanTemperatureC?: number;
  environmentTemperatureC?: number;
  rateOfRiseCPerMinute?: number;
  powerPercent?: number;
  airflowPercent?: number;
  drumSpeedPercent?: number;
};

export type RoasterTelemetrySample = RoasterTelemetry & {
  profileId: string;
  beanTemperatureC: number;
  rateOfRiseCPerMinute: number;
  source: "simulation";
};

export type RoasterCommand =
  | { type: "set_power"; valuePercent: number }
  | { type: "set_airflow"; valuePercent: number }
  | { type: "set_drum_speed"; valuePercent: number }
  | { type: "mark_event"; label: string }
  | { type: "start_roast"; profileId: string }
  | { type: "end_roast"; reason: string };

export interface RoasterAdapter {
  readonly descriptor: RoasterAdapterDescriptor;
  connect(config: RoasterConnectionConfig): Promise<RoasterConnectionSnapshot>;
  disconnect(): Promise<RoasterConnectionSnapshot>;
  getConnectionSnapshot(): RoasterConnectionSnapshot;
  listProfiles(): Promise<RoastProfile[]>;
  getProfile(profileId: string): Promise<RoastProfile | null>;
  getTelemetrySample(profileId: string, elapsedSeconds: number): Promise<RoasterTelemetrySample>;
}
