import { useEffect, useMemo, useState } from "react";

type Props = {
  /** Increment to fire a burst. 0 = idle. */
  burstKey: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  rot: number;
  delay: number;
  emoji: string;
  size: number;
};

const GLYPHS = ["🌱", "🍃", "🌿", "✨"];

/**
 * Full-screen seed-burst celebration. Pure transform/opacity animation,
 * pointer-events-none, auto-clears. Fires whenever burstKey changes.
 */
export default function Celebration({ burstKey }: Props) {
  const [active, setActive] = useState(false);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 28 }, (_, id) => {
      const angle = (Math.PI * 2 * id) / 28 + Math.random() * 0.4;
      const dist = 120 + Math.random() * 160;
      return {
        id,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 40, // bias upward
        rot: (Math.random() - 0.5) * 540,
        delay: Math.random() * 0.08,
        emoji: GLYPHS[id % GLYPHS.length],
        size: 14 + Math.random() * 18,
      };
    });
    // regenerate per burst
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burstKey]);

  useEffect(() => {
    if (burstKey === 0) return;
    setActive(true);
    const t = setTimeout(() => setActive(false), 1400);
    return () => clearTimeout(t);
  }, [burstKey]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={`${burstKey}-${p.id}`}
          className="absolute"
          style={{
            fontSize: `${p.size}px`,
            // @ts-expect-error custom props consumed by the keyframes
            "--tx": `${p.x}px`,
            "--ty": `${p.y}px`,
            "--rot": `${p.rot}deg`,
            animation: `seed-burst 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${p.delay}s forwards`,
          }}
        >
          {p.emoji}
        </span>
      ))}

      <style>{`
        @keyframes seed-burst {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.4) rotate(0deg); }
          15%  { opacity: 1; }
          70%  { opacity: 1; }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot));
          }
        }
      `}</style>
    </div>
  );
}
