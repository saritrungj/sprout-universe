import { useEffect, useState } from "react";
import { useT } from "../lib/i18n";

type Props = {
  /** Called after the exit animation finishes. */
  onDone: () => void;
  /** Minimum time the splash stays up (ms). */
  minDuration?: number;
};

/**
 * Branded launch splash: a 3D sprout grows from a seed while state hydrates.
 * Fades out after minDuration, then unmounts via onDone.
 */
export default function Splash({ onDone, minDuration = 1900 }: Props) {
  const { t } = useT();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setLeaving(true), minDuration);
    const done = setTimeout(onDone, minDuration + 600);
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, [minDuration, onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface dark:bg-surface-dark transition-opacity duration-500 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-label={t("splash.loading")}
    >
      <div className="w-48 h-48">
        <img
          src="/sprout-neutral.png"
          alt="Sprout"
          className="w-full h-full object-contain drop-shadow-[0_18px_32px_rgba(14,116,144,0.22)]"
          style={{
            opacity: 0,
            transformOrigin: "50% 85%",
            animation:
              "mascot-pop 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards, mascot-float 3.6s ease-in-out 1.1s infinite",
          }}
        />
      </div>
      <p
        className="mt-2 text-xl font-bold font-sans text-sprout-700 dark:text-sprout-400 tracking-tight"
        style={{
          opacity: 0,
          animation: "splash-fade-up 0.6s ease-out 0.9s forwards",
        }}
      >
        Sprout
      </p>

      <style>{`
        @keyframes mascot-pop {
          from { opacity: 0; transform: translateY(18px) scale(0.86); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes mascot-float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes splash-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
