type FlavorDimension = {
  label: string;
  value: number;
};

type FlavorProfileChartProps = {
  values: FlavorDimension[];
  title?: string;
  className?: string;
};

const center = 100;
const radius = 70;

function pointAt(index: number, total: number, scale = 1) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: center + Math.cos(angle) * radius * scale,
    y: center + Math.sin(angle) * radius * scale,
  };
}

function pointsFor(values: FlavorDimension[], useValues: boolean) {
  return values
    .map((item, index) => {
      const scale = useValues ? Math.max(0, Math.min(5, item.value)) / 5 : 1;
      const point = pointAt(index, values.length, scale);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

export function FlavorProfileChart({
  values,
  title = "Flavor profile",
  className = "",
}: FlavorProfileChartProps) {
  if (values.length < 3) {
    return null;
  }

  return (
    <figure className={`relative ${className}`} aria-label={title}>
      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-labelledby="flavor-profile-title flavor-profile-description"
        className="mx-auto aspect-square w-full max-w-72 overflow-visible"
      >
        <title id="flavor-profile-title">{title}</title>
        <desc id="flavor-profile-description">
          A five-point scale: {values.map(({ label, value }) => `${label} ${value}`).join(", ")}.
        </desc>
        {[1, 0.75, 0.5, 0.25].map((scale) => (
          <polygon
            key={scale}
            points={values
              .map((_, index) => {
                const point = pointAt(index, values.length, scale);
                return `${point.x},${point.y}`;
              })
              .join(" ")}
            fill="none"
            stroke="rgba(244, 234, 216, 0.12)"
            strokeWidth="1"
          />
        ))}
        {values.map((_, index) => {
          const point = pointAt(index, values.length);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="rgba(244, 234, 216, 0.1)"
              strokeWidth="1"
            />
          );
        })}
        <polygon
          points={pointsFor(values, true)}
          fill="rgba(217, 151, 67, 0.18)"
          stroke="rgba(247, 187, 104, 0.9)"
          strokeWidth="1.5"
          className="motion-safe:animate-[pulse_5s_ease-in-out_infinite]"
        />
        {values.map((item, index) => {
          const valuePoint = pointAt(index, values.length, Math.max(0, Math.min(5, item.value)) / 5);
          return (
            <circle
              key={item.label}
              cx={valuePoint.x}
              cy={valuePoint.y}
              r="2.5"
              fill="#f4bd76"
            />
          );
        })}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-3">
        {values.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between gap-3 text-xs">
            <span className="text-[#a99d8e]">{label}</span>
            <span className="font-mono text-[#eadbc5]">{value}/5</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
