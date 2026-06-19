import { DayStatus } from "../lib/status";

type Props = {
  pct: number;
  status: DayStatus;
  size?: number;
  children?: React.ReactNode;
};

const STROKE: Record<DayStatus, string> = {
  complete: "#22c55e",
  "in-progress": "#fbbf24",
  missed: "#f87171",
  neutral: "#cbd5d0",
};

/**
 * Animated circular progress ring. The arc eases to `pct` via CSS transition
 * on stroke-dashoffset (a paint-only property, no layout thrash).
 */
export default function ProgressRing({
  pct,
  status,
  size = 56,
  children,
}: Props) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={STROKE[status]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
