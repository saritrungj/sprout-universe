import { useEffect, useState } from "react";
import { useT } from "../lib/i18n";

type Props = {
  /** Called after the exit animation finishes. */
  onDone: () => void;
  /** Minimum time the splash stays up (ms). */
  minDuration?: number;
};

const BRAND_TEXT = "Sprout.Planner";

/**
 * Minimal launch splash: website logo plus a typewritten brand welcome.
 * Fades out after minDuration.
 */
export default function Splash({ onDone, minDuration = 3000 }: Props) {
  const { t } = useT();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let done: ReturnType<typeof setTimeout> | undefined;

    const minDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, minDuration),
    );
    const pageLoaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener("load", () => resolve(), { once: true }),
          );

    Promise.all([minDelay, pageLoaded]).then(() => {
      if (cancelled) return;
      setLeaving(true);
      done = setTimeout(onDone, 650);
    });

    return () => {
      cancelled = true;
      if (done) clearTimeout(done);
    };
  }, [minDuration, onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-surface transition-opacity duration-500 dark:bg-surface-dark ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-label={t("splash.loading")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(187,247,208,0.36),transparent_36%),linear-gradient(180deg,rgba(240,253,244,0.96),rgba(220,252,231,0.7))] dark:bg-[radial-gradient(circle_at_50%_42%,rgba(34,197,94,0.18),transparent_36%),linear-gradient(180deg,rgba(5,46,22,0.96),rgba(6,78,59,0.74))]"
      />

      <div className="relative flex flex-col items-center">
        <span
          aria-hidden="true"
          className="logo-aura absolute -top-7 h-56 w-56 rounded-full bg-[conic-gradient(from_140deg,rgba(34,197,94,0),rgba(34,197,94,0.4),rgba(187,247,208,0.9),rgba(34,197,94,0.32),rgba(34,197,94,0))] opacity-70 blur-sm dark:opacity-45 sm:-top-9 sm:h-64 sm:w-64"
        />
        <span
          aria-hidden="true"
          className="logo-ring absolute top-0 h-40 w-40 rounded-full border border-sprout-300/45 shadow-[0_0_42px_rgba(34,197,94,0.26),inset_0_0_32px_rgba(187,247,208,0.28)] dark:border-sprout-500/35 dark:shadow-[0_0_46px_rgba(34,197,94,0.18),inset_0_0_34px_rgba(34,197,94,0.12)] sm:h-52 sm:w-52"
        />
        <span
          aria-hidden="true"
          className="logo-sweep absolute top-4 h-32 w-32 rounded-full bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.74)_48%,transparent_66%)] opacity-0 mix-blend-screen dark:opacity-0 sm:top-5 sm:h-40 sm:w-40"
        />
        <span
          aria-hidden="true"
          className="logo-glow absolute top-1 h-40 w-40 rounded-full bg-sprout-300/45 blur-3xl dark:bg-sprout-600/30 sm:h-48 sm:w-48"
        />
        <img
          src="/sprout-logo.png"
          alt=""
          aria-hidden="true"
          className="relative h-36 w-36 object-contain drop-shadow-[0_22px_40px_rgba(22,101,52,0.22)] sm:h-44 sm:w-44"
          style={{
            opacity: 0,
            transformOrigin: "50% 50%",
            animation:
              "logo-arrive 0.72s cubic-bezier(0.16, 1, 0.3, 1) 0.12s forwards",
          }}
        />

        <p
          className="brand-type mt-5 max-w-[86vw] whitespace-nowrap text-center font-sans text-3xl font-bold tracking-normal text-black dark:text-surface sm:text-4xl"
          style={
            {
              "--brand-chars": BRAND_TEXT.length,
              animation:
                "brand-reveal 1.2s steps(var(--brand-chars)) 0.72s forwards, brand-caret 0.72s step-end 0.72s 4",
            } as React.CSSProperties
          }
        >
          <span className="text-sprout-700 dark:text-sprout-400">Sprout</span>
          <span className="text-sprout-500 dark:text-sprout-300">.</span>
          <span>Planner</span>
        </p>
      </div>

      <style>{`
        @keyframes logo-arrive {
          from { opacity: 0; transform: translateY(12px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .logo-aura {
          animation: logo-aura-spin 7s linear infinite, logo-aura-breathe 2.7s ease-in-out infinite;
        }
        .logo-ring {
          animation: logo-ring-pulse 2.6s ease-in-out infinite;
        }
        .logo-glow {
          animation: logo-glow-breathe 2.4s ease-in-out infinite;
        }
        .logo-sweep {
          animation: logo-sweep 2.8s ease-in-out 0.5s infinite;
        }
        @keyframes logo-aura-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes logo-aura-breathe {
          0%, 100% { filter: blur(8px); opacity: 0.46; }
          50%      { filter: blur(14px); opacity: 0.78; }
        }
        @keyframes logo-ring-pulse {
          0%, 100% { transform: scale(0.98); opacity: 0.68; }
          50%      { transform: scale(1.08); opacity: 1; }
        }
        @keyframes logo-glow-breathe {
          0%, 100% { transform: scale(0.92); opacity: 0.72; }
          50%      { transform: scale(1.16); opacity: 1; }
        }
        @keyframes logo-sweep {
          0%   { opacity: 0; transform: translateX(-42%) rotate(-12deg); }
          22%  { opacity: 0.5; }
          46%  { opacity: 0; transform: translateX(42%) rotate(-12deg); }
          100% { opacity: 0; transform: translateX(42%) rotate(-12deg); }
        }
        .brand-type {
          width: 0;
          overflow: hidden;
          border-right: 0.08em solid currentColor;
        }
        @keyframes brand-reveal {
          from { width: 0; }
          to   { width: calc(var(--brand-chars) * 0.64em); }
        }
        @keyframes brand-caret {
          0%, 100% { border-color: transparent; }
          50%      { border-color: currentColor; }
        }
      `}</style>
    </div>
  );
}
