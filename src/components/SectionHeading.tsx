import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`${align === "center" ? "mx-auto items-center text-center" : "items-start"} flex max-w-3xl flex-col ${className}`}
    >
      {eyebrow ? (
        <p className="mb-4 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-amber-300/80">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold leading-[1.06] tracking-[-0.04em] text-[#f4ead8] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <div className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[#b8aa99] sm:text-lg sm:leading-8">
          {description}
        </div>
      ) : null}
    </div>
  );
}
