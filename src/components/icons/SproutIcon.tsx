type Props = {
  /** Animate growth from seed to full. */
  grow?: boolean;
  className?: string;
};

/**
 * Clay-style sprout in a pot (kawaii / 3D-render look) drawn as SVG.
 * Leaves sway gently; optional grow-in on mount.
 */
export default function SproutIcon({ grow = false, className }: Props) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Sprout"
    >
      <defs>
        <linearGradient id="potBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9aa7f2" />
          <stop offset="55%" stopColor="#b09bf0" />
          <stop offset="100%" stopColor="#8f86e6" />
        </linearGradient>
        <linearGradient id="potRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fe6d6" />
          <stop offset="100%" stopColor="#43c9b6" />
        </linearGradient>
        <radialGradient id="soil" cx="0.5" cy="0.35" r="0.8">
          <stop offset="0%" stopColor="#7a543a" />
          <stop offset="100%" stopColor="#46301f" />
        </radialGradient>
        <linearGradient id="saucer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbc7d6" />
          <stop offset="100%" stopColor="#f3a9bf" />
        </linearGradient>
        <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7fe08a" />
          <stop offset="100%" stopColor="#39b24a" />
        </linearGradient>
        <linearGradient id="stem" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#2f9e40" />
          <stop offset="100%" stopColor="#52c463" />
        </linearGradient>
      </defs>

      {/* Saucer */}
      <ellipse cx="100" cy="178" rx="66" ry="13" fill="url(#saucer)" />
      <ellipse cx="100" cy="174" rx="66" ry="13" fill="#fdd6e1" />

      {/* Pot body */}
      <path
        d="M58 126 L142 126 L130 168 Q128 174 120 174 L80 174 Q72 174 70 168 Z"
        fill="url(#potBody)"
      />
      {/* Pot rim */}
      <rect
        x="50"
        y="112"
        width="100"
        height="22"
        rx="11"
        fill="url(#potRim)"
      />
      {/* Soil */}
      <ellipse cx="100" cy="118" rx="44" ry="8" fill="url(#soil)" />

      {/* Plant — sways from the soil line */}
      <g
        style={{
          transformOrigin: "100px 118px",
          transformBox: "fill-box",
          animation: grow
            ? "sprout-grow 1.4s cubic-bezier(0.16,1,0.3,1), sprout-sway 4s ease-in-out 1.4s infinite"
            : "sprout-sway 4s ease-in-out infinite",
        }}
      >
        {/* Stem */}
        <path
          d="M100 120 C 99 96, 96 80, 110 58"
          fill="none"
          stroke="url(#stem)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Right leaf */}
        <g transform="rotate(20 110 58)">
          <ellipse cx="128" cy="52" rx="28" ry="15" fill="url(#leaf)" />
          <ellipse
            cx="122"
            cy="48"
            rx="14"
            ry="6"
            fill="#a6f0ad"
            opacity="0.6"
          />
        </g>
        {/* Left leaf */}
        <g transform="rotate(-22 104 70)">
          <ellipse cx="74" cy="74" rx="26" ry="14" fill="url(#leaf)" />
          <ellipse
            cx="80"
            cy="70"
            rx="12"
            ry="5"
            fill="#a6f0ad"
            opacity="0.6"
          />
        </g>
      </g>

      <style>{`
        @keyframes sprout-grow {
          0%   { transform: scaleY(0.05) scaleX(0.4); opacity: 0; }
          60%  { opacity: 1; }
          100% { transform: scaleY(1) scaleX(1); opacity: 1; }
        }
        @keyframes sprout-sway {
          0%, 100% { transform: rotate(-3deg); }
          50%      { transform: rotate(3deg); }
        }
      `}</style>
    </svg>
  );
}
