import type { CoffeeOrigin } from "../types";

export const origins = [
  {
    id: "ethiopia",
    slug: "ethiopia",
    name: "Ethiopia",
    regions: ["Yirgacheffe", "Guji", "Sidama"],
    altitude: "1,700–2,200 m",
    altitudeMeters: [1700, 2200],
    processes: ["Washed", "Natural", "Anaerobic"],
    flavorNotes: ["Floral", "Citrus", "Berry", "Bergamot"],
    body: "Tea-like and delicate",
    acidity: "Bright, fragrant, and lively",
    recommendedRoasts: ["light", "medium"],
    recommendedMethods: ["v60", "chemex", "aeropress"],
    description:
      "Ethiopia's many heirloom varieties produce some of coffee's most aromatic cups. Washed lots often emphasize jasmine and citrus, while natural processing can bring ripe berry sweetness.",
    coordinates: { x: 63, y: 45 },
  },
  {
    id: "colombia",
    slug: "colombia",
    name: "Colombia",
    regions: ["Huila", "Nariño", "Antioquia"],
    altitude: "1,200–2,000 m",
    altitudeMeters: [1200, 2000],
    processes: ["Washed", "Natural", "Honey"],
    flavorNotes: ["Caramel", "Red apple", "Citrus", "Cocoa"],
    body: "Silky and balanced",
    acidity: "Rounded, often apple-like",
    recommendedRoasts: ["light", "medium", "medium-dark"],
    recommendedMethods: ["v60", "aeropress", "espresso", "automatic-drip"],
    description:
      "Colombia's varied elevations and microclimates support harvests throughout much of the year. Its coffees are known for dependable sweetness, structured acidity, and an adaptable flavor profile.",
    coordinates: { x: 27, y: 42 },
  },
  {
    id: "brazil",
    slug: "brazil",
    name: "Brazil",
    regions: ["Minas Gerais", "Cerrado Mineiro", "Mogiana"],
    altitude: "900–1,400 m",
    altitudeMeters: [900, 1400],
    processes: ["Natural", "Honey", "Washed"],
    flavorNotes: ["Chocolate", "Hazelnut", "Dried fruit", "Brown sugar"],
    body: "Full and creamy",
    acidity: "Low to moderate",
    recommendedRoasts: ["medium", "medium-dark", "dark"],
    recommendedMethods: ["espresso", "french-press", "moka-pot", "automatic-drip"],
    description:
      "Brazilian coffees frequently build a sweet, low-acid foundation with chocolate and nut character. Natural processing and broad, sunny patios commonly reinforce their generous body.",
    coordinates: { x: 34, y: 65 },
  },
  {
    id: "kenya",
    slug: "kenya",
    name: "Kenya",
    regions: ["Nyeri", "Kirinyaga", "Embu"],
    altitude: "1,500–2,100 m",
    altitudeMeters: [1500, 2100],
    processes: ["Washed"],
    flavorNotes: ["Blackcurrant", "Grapefruit", "Tomato leaf", "Brown sugar"],
    body: "Juicy and structured",
    acidity: "Vivid, complex, and wine-like",
    recommendedRoasts: ["light", "medium"],
    recommendedMethods: ["v60", "chemex", "aeropress"],
    description:
      "Kenyan lots are prized for intense fruit and a savory-sweet complexity. Carefully managed washing and high-elevation growing conditions often yield exceptional clarity and acidity.",
    coordinates: { x: 61, y: 51 },
  },
  {
    id: "guatemala",
    slug: "guatemala",
    name: "Guatemala",
    regions: ["Antigua", "Huehuetenango", "Atitlán"],
    altitude: "1,300–2,000 m",
    altitudeMeters: [1300, 2000],
    processes: ["Washed", "Natural", "Honey"],
    flavorNotes: ["Cocoa", "Orange", "Spice", "Stone fruit"],
    body: "Velvety and substantial",
    acidity: "Crisp and citrus-led",
    recommendedRoasts: ["light", "medium", "medium-dark"],
    recommendedMethods: ["chemex", "french-press", "espresso", "automatic-drip"],
    description:
      "Volcanic soils and dramatic elevation changes give Guatemalan coffees a compelling mix of cocoa depth, citrus brightness, and gentle spice. They remain expressive across several roast levels.",
    coordinates: { x: 18, y: 40 },
  },
] satisfies CoffeeOrigin[];

export const coffeeOrigins = origins;

export const originById = Object.fromEntries(
  origins.map((origin) => [origin.id, origin]),
) as Record<(typeof origins)[number]["id"], (typeof origins)[number]>;
