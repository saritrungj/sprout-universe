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
  src: string;
  size: number;
};

const SPRITE_SOURCES = [
  "/sprout-logo.png",
  "/sprout-success.png",
  "/sprout-progress.png",
  "/sprout-head-happy.png",
];

/**
 * Full-screen day-complete celebration: big jumping mascot centered +
 * radial seed burst. Pointer-events-none, auto-clears.
 */
export default function Celebration({ burstKey }: Props) {
  const [active, setActive] = useState(false);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 40 }, (_, id) => {
      const angle = (Math.PI * 2 * id) / 40 + Math.random() * 0.5;
      const dist = 140 + Math.random() * 220;
      return {
        id,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        rot: (Math.random() - 0.5) * 720,
        delay: Math.random() * 0.1,
        src: SPRITE_SOURCES[id % SPRITE_SOURCES.length],
        size: 20 + Math.random() * 32,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burstKey]);

  useEffect(() => {
    if (burstKey === 0) return;
    setActive(true);
    const t = setTimeout(() => setActive(false), 2800);
    return () => clearTimeout(t);
  }, [burstKey]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="celebration-flash absolute inset-0 bg-sprout-300/25 dark:bg-sprout-600/15" />

      {[0, 1, 2].map((ring) => (
        <span
          key={ring}
          className="celebration-ring absolute rounded-full border-[3px] border-sprout-400/70 dark:border-sprout-300/50"
          style={{
            width: "6rem",
            height: "6rem",
            animationDelay: `${ring * 0.14}s`,
          }}
        />
      ))}

      <span
        className="celebration-ring celebration-ring-gold absolute rounded-full border-[2px] border-amber-400/60"
        style={{ width: "4rem", height: "4rem", animationDelay: "0.08s" }}
      />

      {particles.map((p) => (
        <img
          key={`${burstKey}-${p.id}`}
          src={p.src}
          alt=""
          className="absolute object-contain"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            // @ts-expect-error custom props consumed by keyframes
            "--tx": `${p.x}px`,
            "--ty": `${p.y}px`,
            "--rot": `${p.rot}deg`,
            animation: `seed-burst 1.35s cubic-bezier(0.16, 1, 0.3, 1) ${p.delay}s forwards`,
          }}
        />
      ))}

      <div className="celebration-mascot-pop relative flex flex-col items-center">
        <span
          aria-hidden="true"
          className="complete-rays absolute h-64 w-64 rounded-full blur-lg sm:h-80 sm:w-80"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(251,191,36,0), rgba(251,191,36,0.6), rgba(34,197,94,0), rgba(34,197,94,0.55), rgba(251,191,36,0))",
          }}
        />
        <span
          aria-hidden="true"
          className="complete-aura absolute h-52 w-52 rounded-full bg-amber-300/60 blur-2xl dark:bg-amber-400/40 sm:h-64 sm:w-64"
        />
        <img
          src="/sprout-success.png"
          alt=""
          decoding="async"
          draggable={false}
          className="celebration-jump relative h-56 w-56 object-contain drop-shadow-[0_24px_48px_rgba(245,158,11,0.5)] sm:h-72 sm:w-72 lg:h-80 lg:w-80"
        />
      </div>
    </div>
  );
}
