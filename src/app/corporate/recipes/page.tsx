import type { Metadata } from "next";
import { CorporateRecipeWorkspace } from "@/components/corporate/CorporateRecipeWorkspace";

export const metadata: Metadata = {
  title: "Corporate Recipes",
  description: "Create, review, approve, duplicate, and archive location-aware coffee operating recipes.",
};

export default function CorporateRecipesPage() {
  return <main><CorporateRecipeWorkspace /></main>;
}

