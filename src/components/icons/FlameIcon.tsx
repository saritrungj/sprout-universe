type Props = {
  /** 0..1 — drives flicker speed and glow. */
  intensity?: number;
  className?: string;
};

/**
 * Kawaii flame mascot drawn as SVG. Flickers and sways; the floating ember
 * drifts. Higher intensity = faster, brighter flicker.
 */
export default function FlameIcon({ intensity = 1, className }: Props) {
  const i = Math.max(0, Math.min(intensity, 1));
  const flickerDur = 2.4 - i * 1.2; // faster when hotter

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Streak flame"
      style={
        {
          // expose intensity to keyframes
          ["--flick" as string]: `${flickerDur}s`,
        } as React.CSSProperties
      }
    >
      <defs>
        <linearGradient id="flameBody" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#ff3b30" />
          <stop offset="45%" stopColor="#ff6b4a" />
          <stop offset="100%" stopColor="#ff8a5c" />
        </linearGradient>
        <radialGradient id="flameFace" cx="0.5" cy="0.55" r="0.55">
          <stop offset="0%" stopColor="#fff6e6" />
          <stop offset="70%" stopColor="#ffe2b0" />
          <stop offset="100%" stopColor="#ffcaa0" />
        </radialGradient>
      </defs>

      {/* Floating ember */}
      <path
        d="M44 60 q-7 -9 2 -16 q7 8 -2 16 z"
        fill="#ff6b4a"
        style={{ animation: "ember-float 2.6s ease-in-out infinite" }}
      />

      {/* Flame body + face flicker as one group */}
      <g
        style={{
          transformOrigin: "100px 150px",
          transformBox: "fill-box",
          animation: "flame-flicker var(--flick) ease-in-out infinite",
        }}
      >
        {/* Body — teardrop with a notched top */}
        <path
          d="M104 22
             C 96 44, 90 52, 78 58
             C 70 46, 70 38, 74 30
             C 60 50, 44 74, 44 108
             C 44 146, 72 172, 104 172
             C 138 172, 162 144, 158 108
             C 155 80, 138 62, 130 44
             C 124 56, 118 56, 112 46
             C 108 38, 108 30, 104 22 Z"
          fill="url(#flameBody)"
        />

        {/* Inner cream face glow */}
        <ellipse cx="101" cy="124" rx="42" ry="40" fill="url(#flameFace)" />

        {/* Eyes */}
        <g fill="#5b1020">
          <rect x="78" y="108" width="14" height="22" rx="7" />
          <rect x="110" y="108" width="14" height="22" rx="7" />
        </g>
        {/* Eye highlights */}
        <g fill="#ffffff">
          <circle cx="82" cy="114" r="3.4" />
          <circle cx="114" cy="114" r="3.4" />
        </g>

        {/* Smiling open mouth */}
        <path d="M88 140 Q101 156 114 140 Q101 150 88 140 Z" fill="#7a1226" />
        <path d="M96 145 Q101 152 106 145 Z" fill="#ff7a59" />
      </g>

      <style>{`
        @keyframes flame-flicker {
          0%, 100% { transform: scaleY(1) scaleX(1) rotate(-1.5deg); }
          50%      { transform: scaleY(1.06) scaleX(0.97) rotate(1.5deg); }
        }
        @keyframes ember-float {
          0%   { transform: translate(0, 4px); opacity: 0.2; }
          50%  { transform: translate(-3px, -4px); opacity: 1; }
          100% { transform: translate(0, 4px); opacity: 0.2; }
        }
      `}</style>
    </svg>
  );
}
