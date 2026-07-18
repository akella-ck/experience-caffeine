type GrindScaleProps = {
  active?: "fine" | "medium-fine" | "medium" | "medium-coarse" | "coarse";
  className?: string;
};

const grades = [
  { id: "fine", label: "Fine", size: 2, count: 55, reference: "Table salt" },
  { id: "medium-fine", label: "Medium-fine", size: 3, count: 42, reference: "Fine sand" },
  { id: "medium", label: "Medium", size: 4, count: 34, reference: "Regular sand" },
  { id: "medium-coarse", label: "Medium-coarse", size: 6, count: 24, reference: "Coarse sand" },
  { id: "coarse", label: "Coarse", size: 8, count: 16, reference: "Sea salt" },
] as const;

function pseudoRandom(index: number, salt: number) {
  return ((index * (37 + salt * 2) + salt * 19) % 97) / 97;
}

export function GrindScale({ active, className = "" }: GrindScaleProps) {
  return (
    <figure className={className} aria-labelledby="grind-scale-caption">
      <div className="grid gap-2 sm:grid-cols-5">
        {grades.map((grade, gradeIndex) => (
          <div
            key={grade.id}
            className={`group rounded-2xl border p-3 transition-colors ${
              active === grade.id
                ? "border-amber-300/40 bg-amber-300/[0.08]"
                : "border-white/[0.07] bg-black/15"
            }`}
          >
            <div
              className="relative h-24 overflow-hidden rounded-xl border border-white/[0.05] bg-[#0b0907]"
              aria-hidden="true"
            >
              {Array.from({ length: grade.count }, (_, index) => {
                const left = pseudoRandom(index, gradeIndex) * 92 + 2;
                const top = pseudoRandom(index, gradeIndex + 4) * 84 + 5;
                const rotation = pseudoRandom(index, gradeIndex + 8) * 90;
                return (
                  <span
                    key={index}
                    className="absolute rounded-[45%] bg-[linear-gradient(145deg,#a36b3a,#50301b)] shadow-[0_1px_1px_rgba(0,0,0,0.6)]"
                    style={{
                      width: grade.size,
                      height: Math.max(2, grade.size * 0.7),
                      left: `${left}%`,
                      top: `${top}%`,
                      transform: `rotate(${rotation}deg)`,
                    }}
                  />
                );
              })}
            </div>
            <p className="mt-3 text-sm font-medium text-[#eee1cc]">{grade.label}</p>
            <p className="mt-0.5 text-[0.68rem] text-[#8f8375]">≈ {grade.reference}</p>
          </div>
        ))}
      </div>
      <figcaption id="grind-scale-caption" className="mt-4 text-xs leading-5 text-[#8f8375]">
        Visual references are approximate. Particle distribution matters as much as average size.
      </figcaption>
    </figure>
  );
}
