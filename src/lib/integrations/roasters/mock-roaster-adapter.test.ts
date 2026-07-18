import { describe, expect, it } from "vitest";
import { MockRoasterAdapter } from "./mock-roaster-adapter";

describe("MockRoasterAdapter", () => {
  it("stays read-only and requires an explicit local connection", async () => {
    const adapter = new MockRoasterAdapter();
    expect(adapter.getConnectionSnapshot().state).toBe("not_connected");
    expect("sendCommand" in adapter).toBe(false);
    await expect(adapter.listProfiles()).rejects.toThrow(/Connect the roaster adapter/);

    const connected = await adapter.connect({ workspaceId: "test-workspace" });
    expect(connected.state).toBe("connected");
    expect(connected.message).toMatch(/simulation/i);

    const profiles = await adapter.listProfiles();
    expect(profiles.length).toBeGreaterThan(0);
    const telemetry = await adapter.getTelemetrySample(profiles[0].id, 300);
    expect(telemetry.source).toBe("simulation");
    expect(telemetry.timestamp).toBeTruthy();
    expect(telemetry.beanTemperatureC).toBeGreaterThan(0);
    expect(telemetry.rateOfRiseCPerMinute).toBeGreaterThanOrEqual(0);

    const disconnected = await adapter.disconnect();
    expect(disconnected.state).toBe("not_connected");
  });
});

