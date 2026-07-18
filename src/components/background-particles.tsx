const particles = [
  [8, 18, 2, 0],
  [18, 72, 3, 2],
  [31, 34, 1, 4],
  [43, 83, 2, 1],
  [56, 22, 2, 5],
  [67, 64, 1, 3],
  [78, 31, 3, 6],
  [90, 76, 2, 2],
  [95, 16, 1, 4],
];

export function BackgroundParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map(([left, top, size, delay], index) => (
        <span
          key={`${left}-${top}`}
          className="absolute rounded-full bg-[#e1a45e]/45 blur-[0.2px] motion-safe:animate-[float_8s_ease-in-out_infinite]"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay * -1}s`,
            opacity: 0.2 + (index % 3) * 0.12,
          }}
        />
      ))}
    </div>
  );
}
