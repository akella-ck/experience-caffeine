import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberPreviewGate } from "@/components/auth/MemberPreviewGate";
import { MethodGuide } from "@/components/MethodGuide";
import { beans } from "@/data/beans";
import { brewMethods } from "@/data/brewing-methods";
import { grinders } from "@/data/grinders";

type MethodPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return brewMethods.map((method) => ({ slug: method.slug }));
}

export async function generateMetadata({ params }: MethodPageProps): Promise<Metadata> {
  const { slug } = await params;
  const method = brewMethods.find((candidate) => candidate.slug === slug);

  if (!method) {
    return {
      title: "Brewing Method Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${method.name} Brewing Guide`,
    description: `${method.tagline}. Learn the ${method.name} recipe, grind range, water temperature, technique, common mistakes, and taste adjustments.`,
    openGraph: {
      title: `${method.name} Brewing Guide`,
      description: method.description,
      type: "article",
    },
  };
}

export default async function MethodPage({ params }: MethodPageProps) {
  const { slug } = await params;
  const methodIndex = brewMethods.findIndex((candidate) => candidate.slug === slug);

  if (methodIndex < 0) {
    notFound();
  }

  const method = brewMethods[methodIndex];
  const relatedBeans = beans.filter((bean) =>
    method.relatedOriginIds.some((originId) => originId === bean.originId),
  );
  const relatedGrinders = grinders.filter((grinder) =>
    method.relatedGrinderIds.some((grinderId) => grinderId === grinder.id),
  );
  const previous = methodIndex > 0 ? brewMethods[methodIndex - 1] : undefined;
  const next = methodIndex < brewMethods.length - 1 ? brewMethods[methodIndex + 1] : undefined;

  return (
    <MemberPreviewGate
      description={`Learn the complete ${method.name} technique, including an equipment checklist, step sequence, common mistakes, and taste-led corrections.`}
      features={["Complete step-by-step technique", "Grind, ratio, and temperature starting ranges", "Related beans and grinder guides"]}
      loginPath={`/brew-methods/${method.slug}`}
      secondaryHref="/brew-methods"
      secondaryLabel="Compare all methods"
      title={`Take the ${method.name} guide from overview to repeatable practice.`}
    >
      <MethodGuide
        method={method}
        relatedBeans={relatedBeans}
        relatedGrinders={relatedGrinders}
        previous={previous}
        next={next}
      />
    </MemberPreviewGate>
  );
}
