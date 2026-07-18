import type { HTMLAttributes, ReactNode } from "react";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  glow?: "none" | "amber";
};

export function GlassPanel({
  children,
  className = "",
  glow = "none",
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,250,238,0.075),rgba(255,250,238,0.025))] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl ${
        glow === "amber"
          ? "before:pointer-events-none before:absolute before:-right-24 before:-top-24 before:h-56 before:w-56 before:rounded-full before:bg-amber-400/[0.07] before:blur-3xl"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
