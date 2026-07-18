import { MockRoasterAdapter, mockRoasterDescriptor } from "./mock-roaster-adapter";
import type { RoasterAdapter, RoasterAdapterDescriptor } from "./types";

export const roasterAdapterDescriptors: RoasterAdapterDescriptor[] = [
  mockRoasterDescriptor,
  {
    id: "cropster-roast",
    name: "Cropster Roast",
    vendor: "Cropster",
    mode: "planned",
    capabilities: ["read-profiles", "read-batch-history"],
    safetyBoundary: "Planned read-first integration. No production machine-control scope is approved.",
  },
];

export function createRoasterAdapter(id: string): RoasterAdapter | null {
  if (id === mockRoasterDescriptor.id) return new MockRoasterAdapter();
  return null;
}

