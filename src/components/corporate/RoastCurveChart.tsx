import type { RoastProfile } from "@/types";

const colors = ["#efb76e", "#72b9d2", "#b8d596"];
const dashPatterns = [undefined, "10 6", "3 5"];
const linePatternLabels = ["solid line", "long-dashed line", "short-dashed line"];

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function RoastCurveChart({ profiles, compact = false }: { profiles: RoastProfile[]; compact?: boolean }) {
  const width = 760;
  const height = compact ? 250 : 330;
  const padding = { top: 26, right: 22, bottom: 38, left: 48 };
  const maxSeconds = Math.max(1, ...profiles.map((profile) => profile.totalTimeSeconds));
  const allTemperatures = profiles.flatMap((profile) => profile.curve.map((point) => point.beanTemperatureC));
  const minimumTemperature = Math.min(70, ...allTemperatures);
  const maximumTemperature = Math.max(215, ...allTemperatures);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const x = (seconds: number) => padding.left + (seconds / maxSeconds) * plotWidth;
  const y = (temperature: number) => padding.top + (1 - (temperature - minimumTemperature) / (maximumTemperature - minimumTemperature)) * plotHeight;
  const timeTicks = [0, 0.25, 0.5, 0.75, 1];
  const temperatureTicks = [80, 120, 160, 200];

  return (
    <figure className="min-w-0" aria-label={`Bean-temperature roast curve${profiles.length > 1 ? " comparison" : ""}`}>
      <div
        aria-label="Roast curve chart, horizontally scrollable"
        className="overflow-x-auto rounded-xl scrollbar-subtle outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
        role="region"
        tabIndex={0}
      >
        <svg
          aria-label={`${profiles.length > 1 ? "Compared" : "Bean-temperature"} roast profile curves. Comparison series also use distinct line patterns.`}
          className="min-w-[36rem] w-full"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
        >
          <title>{profiles.length > 1 ? "Compared roast profile curves" : `${profiles[0]?.name ?? "Roast"} curve`}</title>
          <desc>Bean temperature over elapsed time. When profiles are compared, each series uses both a distinct color and a distinct dash pattern.</desc>
          <rect fill="rgba(255,255,255,.018)" height={plotHeight} rx="12" width={plotWidth} x={padding.left} y={padding.top} />
          {temperatureTicks.map((temperature) => (
            <g key={temperature}>
              <line stroke="rgba(255,255,255,.08)" strokeDasharray="3 5" x1={padding.left} x2={width - padding.right} y1={y(temperature)} y2={y(temperature)} />
              <text fill="#a99c8e" fontSize="10" textAnchor="end" x={padding.left - 10} y={y(temperature) + 3}>{temperature}°</text>
            </g>
          ))}
          {timeTicks.map((tick) => {
            const seconds = Math.round(maxSeconds * tick);
            return (
              <g key={tick}>
                <line stroke="rgba(255,255,255,.05)" x1={x(seconds)} x2={x(seconds)} y1={padding.top} y2={height - padding.bottom} />
                <text fill="#a99c8e" fontSize="10" textAnchor="middle" x={x(seconds)} y={height - 15}>{formatTime(seconds)}</text>
              </g>
            );
          })}
          {profiles.map((profile, index) => {
            const color = colors[index % colors.length];
            const points = profile.curve.map((point) => `${x(point.seconds)},${y(point.beanTemperatureC)}`).join(" ");
            return (
              <g key={profile.id}>
                <polyline
                  fill="none"
                  points={points}
                  stroke={color}
                  strokeDasharray={dashPatterns[index % dashPatterns.length]}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={index === 0 ? 3 : 2.4}
                />
                {profile.curve.filter((point) => point.event).map((point) => (
                  <circle key={`${profile.id}-${point.event}`} cx={x(point.seconds)} cy={y(point.beanTemperatureC)} fill="#120d09" r="4" stroke={color} strokeWidth="2" />
                ))}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-[#8f8274]">
        <span className="w-full text-[#a99c8e]">Mock reference data · local preview only</span>
        {profiles.map((profile, index) => (
          <span className="flex items-center gap-2" key={profile.id}>
            <svg aria-hidden="true" className="h-2 w-7 shrink-0" viewBox="0 0 28 8">
              <line
                stroke={colors[index % colors.length]}
                strokeDasharray={dashPatterns[index % dashPatterns.length]}
                strokeLinecap="round"
                strokeWidth="3"
                x1="1"
                x2="27"
                y1="4"
                y2="4"
              />
            </svg>
            {profile.name} · {linePatternLabels[index % linePatternLabels.length]} · {formatTime(profile.totalTimeSeconds)} · {profile.developmentRatioPercent}% dev
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
