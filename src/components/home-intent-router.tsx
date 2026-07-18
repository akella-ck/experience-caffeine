import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleAlert,
  FlaskConical,
} from "lucide-react";

const intents = [
  {
    title: "I want to brew",
    description: "Build a starting recipe around the coffee and equipment already on your counter.",
    action: "Build a recipe",
    href: "/brew-lab",
    icon: FlaskConical,
    accent: false,
  },
  {
    title: "My cup tastes wrong",
    description: "Diagnose sour, bitter, weak, strong, dry, hollow, or flat coffee one change at a time.",
    action: "Troubleshoot this cup",
    href: "/troubleshoot",
    icon: CircleAlert,
    accent: true,
  },
  {
    title: "I want to understand",
    description: "Learn grind, ratio, water, extraction, technique, and tasting without the jargon.",
    action: "Start with the basics",
    href: "/learn",
    icon: BookOpen,
    accent: false,
  },
] as const;

const counterBaseline = [
  "Coffee with a known roast date",
  "Water you enjoy drinking",
  "A scale for coffee and water",
  "Clean, preheated equipment",
] as const;

export function HomeIntentRouter() {
  return (
    <section aria-labelledby="home-intent-title" className="border-b border-white/[0.07] bg-[#0d0907]/72">
      <div className="section-shell py-8 sm:py-10">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#d6a36c]">Start from where you are</p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#f1e6d5]" id="home-intent-title">
              What do you need right now?
            </h2>
          </div>
          <p className="max-w-md text-xs leading-5 text-[#8f8375]">You do not need to follow the whole site in order. Choose the job in front of you.</p>
        </div>

        <div className="grid overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-[#100c09] md:grid-cols-3">
          {intents.map(({ title, description, action, href, icon: Icon, accent }) => (
            <Link
              className={`group relative flex min-h-48 flex-col border-b border-white/[0.08] p-5 outline-none transition-colors last:border-b-0 focus-visible:z-10 md:border-b-0 md:border-r md:last:border-r-0 sm:p-6 ${accent ? "bg-[#d99a4e]/[0.07] hover:bg-[#d99a4e]/[0.11]" : "hover:bg-white/[0.035]"}`}
              href={href}
              key={title}
            >
              <span className={`grid size-10 place-items-center rounded-xl border ${accent ? "border-[#e8ae68]/25 bg-[#d99a4e]/10 text-[#edb46f]" : "border-white/[0.08] bg-white/[0.025] text-[#aa9176]"}`}>
                <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-medium tracking-[-0.025em] text-[#eee2d0]">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-[#948779]">{description}</p>
              <span className={`mt-auto flex items-center gap-2 pt-5 text-xs font-semibold ${accent ? "text-[#e8af6c]" : "text-[#b8a896]"}`}>
                {action} <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/[0.07] px-4 py-3 sm:flex-row sm:items-center sm:gap-5">
          <span className="shrink-0 font-mono text-[0.58rem] uppercase tracking-[0.15em] text-[#b58b5d]">Home-brewer baseline</span>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.68rem] text-[#918476]">
            {counterBaseline.map((item) => (
              <li className="flex items-center gap-1.5" key={item}>
                <Check size={11} className="text-[#dba05a]" aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
