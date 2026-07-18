import type {
  RoasterAdapter,
  RoasterAdapterDescriptor,
  RoasterConnectionConfig,
  RoasterConnectionSnapshot,
} from "./types";

export abstract class BaseRoasterAdapter implements RoasterAdapter {
  abstract readonly descriptor: RoasterAdapterDescriptor;

  private connection: RoasterConnectionSnapshot = {
    state: "not_connected",
    connectedAt: null,
    workspaceId: null,
    message: "Not connected",
  };

  protected abstract openConnection(config: RoasterConnectionConfig): Promise<void>;

  async connect(config: RoasterConnectionConfig) {
    this.connection = {
      state: "connecting",
      connectedAt: null,
      workspaceId: config.workspaceId,
      message: "Connecting",
    };
    try {
      await this.openConnection(config);
      this.connection = {
        state: "connected",
        connectedAt: new Date().toISOString(),
        workspaceId: config.workspaceId,
        message: this.descriptor.mode === "mock" ? "Local simulation connected" : "Connected",
      };
    } catch (error) {
      this.connection = {
        state: "error",
        connectedAt: null,
        workspaceId: config.workspaceId,
        message: error instanceof Error ? error.message : "Connection failed",
      };
    }
    return this.getConnectionSnapshot();
  }

  async disconnect() {
    this.connection = {
      state: "not_connected",
      connectedAt: null,
      workspaceId: null,
      message: "Not connected",
    };
    return this.getConnectionSnapshot();
  }

  getConnectionSnapshot() {
    return { ...this.connection };
  }

  protected assertConnected() {
    if (this.connection.state !== "connected") {
      throw new Error("Connect the roaster adapter before reading operational data.");
    }
  }

  abstract listProfiles(): ReturnType<RoasterAdapter["listProfiles"]>;
  abstract getProfile(profileId: string): ReturnType<RoasterAdapter["getProfile"]>;
  abstract getTelemetrySample(profileId: string, elapsedSeconds: number): ReturnType<RoasterAdapter["getTelemetrySample"]>;
}
