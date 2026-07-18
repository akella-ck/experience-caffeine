import type { Bean } from "../types";

export const beans = [
  {
    id: "konga-washed",
    slug: "konga-washed",
    name: "Konga Washed",
    originId: "ethiopia",
    region: "Yirgacheffe",
    producer: "Konga cooperative smallholders",
    variety: ["Ethiopian landraces"],
    process: "Washed",
    altitude: "1,900–2,100 m",
    flavorNotes: ["Jasmine", "Bergamot", "Lemon", "White tea"],
    roastLevel: "light",
    recommendedMethods: ["v60", "chemex", "aeropress"],
    description:
      "A clean, perfumed example designed to show how gentle extraction preserves floral aromatics.",
  },
  {
    id: "huila-pink-bourbon",
    slug: "huila-pink-bourbon",
    name: "Huila Pink Bourbon",
    originId: "colombia",
    region: "Huila",
    producer: "Regional smallholder blend",
    variety: ["Pink Bourbon"],
    process: "Washed",
    altitude: "1,750–1,950 m",
    flavorNotes: ["Red apple", "Caramel", "Mandarin", "Panela"],
    roastLevel: "medium",
    recommendedMethods: ["v60", "aeropress", "automatic-drip"],
    description:
      "Balanced sweetness and citrus structure make this a forgiving reference coffee for recipe comparisons.",
  },
  {
    id: "cerrado-natural",
    slug: "cerrado-natural",
    name: "Cerrado Natural",
    originId: "brazil",
    region: "Cerrado Mineiro",
    producer: "Cerrado regional producers",
    variety: ["Mundo Novo", "Catuai"],
    process: "Natural",
    altitude: "1,050–1,250 m",
    flavorNotes: ["Milk chocolate", "Hazelnut", "Fig", "Brown sugar"],
    roastLevel: "medium-dark",
    recommendedMethods: ["espresso", "french-press", "moka-pot"],
    description:
      "Dense sweetness and a plush texture suit concentrated and immersion brewing styles.",
  },
  {
    id: "nyeri-aa",
    slug: "nyeri-aa",
    name: "Nyeri AA",
    originId: "kenya",
    region: "Nyeri",
    producer: "Nyeri cooperative smallholders",
    variety: ["SL28", "SL34", "Ruiru 11"],
    process: "Washed",
    altitude: "1,700–2,000 m",
    flavorNotes: ["Blackcurrant", "Ruby grapefruit", "Hibiscus", "Molasses"],
    roastLevel: "light",
    recommendedMethods: ["v60", "chemex", "aeropress"],
    description:
      "A vivid, high-acid coffee that rewards even pouring and careful control of drawdown.",
  },
  {
    id: "huehuetenango-caturra",
    slug: "huehuetenango-caturra",
    name: "Huehuetenango Caturra",
    originId: "guatemala",
    region: "Huehuetenango",
    producer: "Highland family farms",
    variety: ["Caturra", "Bourbon"],
    process: "Washed",
    altitude: "1,600–1,900 m",
    flavorNotes: ["Cocoa nib", "Orange", "Plum", "Cinnamon"],
    roastLevel: "medium",
    recommendedMethods: ["chemex", "french-press", "espresso", "automatic-drip"],
    description:
      "Cocoa depth meets crisp fruit, giving this coffee enough structure for both filter and espresso recipes.",
  },
] satisfies Bean[];

export const beanById = Object.fromEntries(
  beans.map((bean) => [bean.id, bean]),
) as Record<string, (typeof beans)[number]>;
