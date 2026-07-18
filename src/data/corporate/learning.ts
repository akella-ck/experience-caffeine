import type { CorporateLessonDetail, LearningAssignment, LearningProgram } from "./types";

export const learningPrograms: LearningProgram[] = [
  {
    id: "roasting-foundations",
    title: "Roasting Foundations",
    description: "Build a shared model of how coffee changes through a roast before interpreting a profile graph.",
    audience: "New roasters, quality staff, trainers",
    moduleCount: 8,
    duration: "1 hr 18 min",
    completionPercent: 91,
    assignedLearners: 16,
    required: true,
    topics: ["Coffee-bean structure", "Heat transfer", "Drying phase", "Maillard reaction", "First crack", "Development time", "Cooling", "Degassing"],
  },
  {
    id: "roast-profile-development",
    title: "Roast Profile Development",
    description: "Read the variables that shape a repeatable production profile and understand how changes interact.",
    audience: "Head and production roasters",
    moduleCount: 9,
    duration: "1 hr 46 min",
    completionPercent: 72,
    assignedLearners: 9,
    required: true,
    topics: ["Charge temperature", "Turning point", "Rate of rise", "Phase percentages", "Development-time ratio", "End temperature", "Batch-size effects", "Environmental effects"],
  },
  {
    id: "roast-standards-quality",
    title: "Roast Standards and Quality",
    description: "Connect roast intent to measurable checks, sensory review, batch records, and release decisions.",
    audience: "Roasters, quality managers, trainers",
    moduleCount: 8,
    duration: "1 hr 32 min",
    completionPercent: 64,
    assignedLearners: 13,
    required: true,
    topics: ["Roast color", "Moisture loss", "Cupping evaluation", "Roast defects", "Batch consistency", "Logging and traceability", "Sample roasting", "Production roasting"],
  },
  {
    id: "machine-operations",
    title: "Machine Operations",
    description: "Recognize how roaster design, operator controls, probe behavior, and cooling systems affect the recorded roast.",
    audience: "Production roasters and roasting trainees",
    moduleCount: 9,
    duration: "1 hr 38 min",
    completionPercent: 81,
    assignedLearners: 11,
    required: true,
    topics: ["Drum roasters", "Fluid-bed roasters", "Sample roasters", "Burner controls", "Airflow control", "Drum speed", "Probe readings", "Cooling systems"],
  },
];

export const learningAssignments: LearningAssignment[] = [
  { id: "assignment-1", title: "Roasting Foundations", location: "North Roastery", dueLabel: "Due Jul 24", assigned: 16, completed: 14, progress: "In progress" },
  { id: "assignment-2", title: "Roast Profile Development", location: "Production team", dueLabel: "Due Jul 28", assigned: 9, completed: 6, progress: "In progress" },
  { id: "assignment-3", title: "Machine Operations: daily controls", location: "North Roastery", dueLabel: "Completed Jul 16", assigned: 7, completed: 7, progress: "Complete" },
  { id: "assignment-4", title: "Roast Standards and Quality", location: "Quality team", dueLabel: "Starts Aug 2", assigned: 13, completed: 0, progress: "Not started" },
];

export const featuredCorporateLesson: CorporateLessonDetail = {
  id: "understanding-rate-of-rise",
  title: "Understanding Rate of Rise",
  trackId: "roast-profile-development",
  duration: "12 min",
  difficulty: "Intermediate",
  objectives: [
    "Describe rate of rise as a rate of temperature change rather than a temperature target",
    "Identify how probe response and machine context affect the displayed curve",
    "Use trend shape as one input alongside sensory and production evidence",
  ],
  explanation: [
    "Rate of rise describes how quickly the measured coffee-temperature signal changes over a period of time. It can help an operator see momentum that a single temperature reading hides.",
    "The displayed curve is not a direct measurement of every bean. Probe placement, probe mass, batch size, airflow, machine design, smoothing, and software settings all influence what appears on screen.",
    "Use rate of rise to compare repeatable conditions on the same system. A smooth-looking curve is not proof of quality, and a number copied from another roaster is not automatically transferable.",
  ],
  diagram: [
    { label: "Charge & turning", detail: "The measured signal first responds to the new batch and machine environment.", signal: "Establish context" },
    { label: "Building momentum", detail: "Energy input, airflow, batch behavior, and probe response shape the rising signal.", signal: "Watch direction" },
    { label: "Approaching first crack", detail: "Interpret the changing trend with physical and sensory milestones—not the graph alone.", signal: "Correlate evidence" },
    { label: "Development & cooling", detail: "Record the finish and cool promptly, then verify the result through the release process.", signal: "Verify quality" },
  ],
  video: {
    title: "Reading momentum on a roast curve",
    duration: "05:48",
    chapters: ["What RoR represents", "Probe and smoothing effects", "Comparing like with like", "Sensory verification"],
    captionsAvailable: true,
  },
  knowledgeCheck: {
    question: "Which comparison makes a rate-of-rise trend most interpretable?",
    options: [
      "Two roasts on the same machine with documented, comparable conditions",
      "The same displayed number from two unrelated roaster models",
      "Any roast curves that use the same coffee origin",
    ],
    correctIndex: 0,
    explanation: "Comparing documented conditions on the same system reduces unknown differences in probe response, batch behavior, controls, and software processing.",
  },
  checklist: [
    "Confirm the correct machine, probe, and software context",
    "Record batch size, charge conditions, major control changes, and environmental context",
    "Mark physical milestones consistently",
    "Review the curve with roast color, moisture loss, cupping, and release notes",
    "Change one intentional profile variable at a time when learning",
  ],
  variabilityCaveat: "Roast behavior and displayed rate of rise vary with machine design, probe response, batch size, green-coffee properties, maintenance state, environment, operator controls, and software smoothing. Treat this lesson as a framework for controlled comparison—not a universal profile prescription.",
};

export const learningPrinciples = [
  "Internal completion reflects platform activity, not an externally accredited certification.",
  "Machine-specific operating procedures and safety instructions must come from the manufacturer and the organization’s approved training.",
  "Every operational roast standard should link to the lesson that explains why it exists.",
] as const;
