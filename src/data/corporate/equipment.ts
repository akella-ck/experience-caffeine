import type { CorporateEquipment } from "./types";

export const corporateEquipment: CorporateEquipment[] = [
  { id: "sm-espresso-01", name: "Main espresso machine", category: "Espresso machine", model: "Commercial 2-group reference", location: "South Market", station: "Main bar", status: "Ready", dataMode: "No connector", lastCheck: "Daily reset · Jul 17", nextAction: "Continue manual shot records", owner: "Café lead" },
  { id: "sm-grinder-01", name: "House espresso grinder", category: "Grinder", model: "Commercial flat-burr reference", location: "South Market", station: "Main bar", status: "Ready", dataMode: "Manual", lastCheck: "Calibration · Jul 17", nextAction: "Review after next chamber clean", owner: "Opening barista" },
  { id: "hp-kettle-02", name: "Filter kettle 02", category: "Brewer", model: "Temperature-control kettle", location: "Harbor Point", station: "Filter bar", status: "Calibration due", dataMode: "Manual", lastCheck: "Temperature check · Jul 3", nextAction: "Compare against reference thermometer", owner: "Café lead" },
  { id: "uh-scale-01", name: "Mobile service scale", category: "Scale", model: "Bluetooth-capable scale", location: "Union Hall", station: "Event kit", status: "Ready", dataMode: "Prototype connector", lastCheck: "Weight check · Jul 16", nextAction: "Use manual entry during prototype evaluation", owner: "Event lead" },
  { id: "nr-roaster-01", name: "Production roaster A", category: "Roaster", model: "Production roaster reference", location: "North Roastery", station: "Production floor", status: "Service review", dataMode: "No connector", lastCheck: "Operator review · Jul 15", nextAction: "Record service outcome outside the demo", owner: "Production lead" },
  { id: "nr-color-01", name: "Color reference station", category: "Brewer", model: "Internal roast-color reference", location: "North Roastery", station: "Quality lab", status: "Ready", dataMode: "Manual", lastCheck: "Reference check · Jul 12", nextAction: "Maintain weekly reference cadence", owner: "Quality lead" },
];

export const equipmentStatusSummary = [
  { label: "Ready", count: corporateEquipment.filter((item) => item.status === "Ready").length },
  { label: "Calibration due", count: corporateEquipment.filter((item) => item.status === "Calibration due").length },
  { label: "Service review", count: corporateEquipment.filter((item) => item.status === "Service review").length },
] as const;
