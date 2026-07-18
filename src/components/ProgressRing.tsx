type ProgressRingProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  children?: React.ReactNode;
  className?: string;
};

export function ProgressRing({
  value,
  size = 240,
  strokeWidth = 6,
  label = "Brew progress",
  children,
  className = "",
}: ProgressRingProps) {
  const progress = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <div
      className={`relative grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        aria-label={`${label}: ${Math.round(progress)}%`}
        className="absolute inset-0 -rotate-90 overflow-visible"
        height={size}
        role="img"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        <circle
          className="stroke-white/8"
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="stroke-amber-400 transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none"
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute size-2 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(251,191,36,.8)]"
        style={{
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) rotate(${progress * 3.6}deg) translateY(-${radius}px)`,
        }}
      />
      <div className="relative z-10 grid place-items-center">{children}</div>
    </div>
  );
}
