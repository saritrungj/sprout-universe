import { useT } from "../lib/i18n";

type Props = {
  open: boolean;
  /** 0–100 */
  progress: number;
  /** Cute, in-progress message (swapped for a done line at 100%). */
  message: string;
};

/**
 * Full-screen friendly loader: a bouncing Sprout logo inside a soft glow ring
 * (a touch larger than the logo) over a 0–100% bar. Used for the slow, opaque
 * operations — image export, config export/import, AI planning.
 */
export default function LoadingOverlay({ open, progress, message }: Props) {
  const { t } = useT();
  if (!open) return null;
  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  const done = pct >= 100;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={done ? t("proc.done") : message}
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-7 bg-surface/80 backdrop-blur-md dark:bg-surface-dark/80"
    >
      {/* Logo cluster — glow ring sits a step larger than the logo */}
      <div className="relative h-44 w-44 sm:h-52 sm:w-52">
        <span
          aria-hidden="true"
          className="absolute inset-0 m-auto h-44 w-44 rounded-full border border-sprout-300/45 shadow-[0_0_42px_rgba(34,197,94,0.26),inset_0_0_32px_rgba(187,247,208,0.28)] dark:border-sprout-500/35 dark:shadow-[0_0_46px_rgba(34,197,94,0.18),inset_0_0_34px_rgba(34,197,94,0.12)] sm:h-52 sm:w-52"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 m-auto h-40 w-40 rounded-full bg-sprout-300/40 blur-3xl dark:bg-sprout-600/30"
        />
        <img
          src="/sprout-logo.png"
          alt=""
          aria-hidden="true"
          className="animate-logo-boing absolute inset-0 m-auto h-32 w-32 object-contain drop-shadow-[0_18px_34px_rgba(22,101,52,0.22)] sm:h-36 sm:w-36"
        />
      </div>

      <p className="px-6 text-center text-base font-bold text-ink dark:text-surface">
        {done ? t("proc.done") : message}
      </p>

      <div className="w-64 max-w-[80vw]">
        <div className="h-2.5 overflow-hidden rounded-full bg-sprout-100 dark:bg-sprout-950">
          <div
            className="h-full rounded-full bg-sprout-500 transition-[width] duration-200 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm font-bold tabular-nums text-sprout-700 dark:text-sprout-300">
          {pct}%
        </p>
      </div>
    </div>
  );
}
