import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { brewMethods, grinders } from "@/data";

export const dynamic = "force-static";

const routes = [
  "",
  "/explore",
  "/brew-lab",
  "/brew-methods",
  "/grinders",
  "/learn",
  "/learn/grind-size",
  "/for-business",
  "/troubleshoot",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const dynamicRoutes = [
    ...brewMethods.map((method) => `/brew-methods/${method.slug}`),
    ...grinders
      .filter((grinder) => grinder.id !== "other")
      .map((grinder) => `/grinders/${grinder.slug}`),
  ];

  return [...routes, ...dynamicRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
