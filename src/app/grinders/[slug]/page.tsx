import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberPreviewGate } from "@/components/auth/MemberPreviewGate";
import { GrinderGuide } from "@/components/GrinderGuide";
import { brewMethods } from "@/data/brewing-methods";
import { grinders } from "@/data/grinders";
import { recipes } from "@/data/recipes";

type GrinderPageProps = {
  params: Promise<{ slug: string }>;
};

const supportedGrinders = grinders.filter((grinder) => grinder.id !== "other");

export function generateStaticParams() {
  return supportedGrinders.map((grinder) => ({ slug: grinder.slug }));
}

export async function generateMetadata({ params }: GrinderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const grinder = supportedGrinders.find((candidate) => candidate.slug === slug);

  if (!grinder) {
    return {
      title: "Grinder Guide Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${grinder.name} Grind Settings & Calibration`,
    description: `Starting settings, visual grind references, zero-point calibration, cleaning, and brew-method guidance for the ${grinder.name}.`,
    openGraph: {
      title: `${grinder.name} Grinder Guide`,
      description: grinder.description,
      type: "article",
    },
  };
}

export default async function GrinderPage({ params }: GrinderPageProps) {
  const { slug } = await params;
  const grinderIndex = supportedGrinders.findIndex((candidate) => candidate.slug === slug);

  if (grinderIndex < 0) {
    notFound();
  }

  const grinder = supportedGrinders[grinderIndex];
  const recommendedRecipes = recipes.filter((recipe) => grinder.recommendedRecipeIds.includes(recipe.id));
  const previous = grinderIndex > 0 ? supportedGrinders[grinderIndex - 1] : undefined;
  const next = grinderIndex < supportedGrinders.length - 1 ? supportedGrinders[grinderIndex + 1] : undefined;

  return (
    <MemberPreviewGate
      description={`Translate broad grind language into useful ${grinder.name} starting settings, then calibrate those settings through time and taste.`}
      features={["Brew-method starting settings", "Zero point, calibration, and cleaning guidance", "Visual particle scale and adjustment advice"]}
      loginPath={`/grinders/${grinder.slug}`}
      secondaryHref="/grinders"
      secondaryLabel="Compare grinder guides"
      title={`Calibrate your ${grinder.name} with a clearer reference.`}
    >
      <GrinderGuide
        grinder={grinder}
        methods={brewMethods}
        recipes={recommendedRecipes}
        previous={previous}
        next={next}
      />
    </MemberPreviewGate>
  );
}
