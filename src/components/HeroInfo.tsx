import { useEffect, useState } from "react";
import { Info, X, Sparkles, AlertTriangle } from "lucide-react";
import { useT } from "../lib/i18n";

/**
 * Small info affordance pinned to the hero's top-right corner, wrapped in a
 * soft breathing sprout glow. Opens a dialog with a quick "how to use" and an
 * important notice that data lives only in this browser (localStorage).
 */
export default function HeroInfo() {
  const { t } = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const howto = [t("info.how1"), t("info.how2"), t("info.how3"), t("info.how4")];
  const data = [t("info.data1"), t("info.data2"), t("info.data3")];

  return (
    <>
      <div className="absolute right-4 top-4 z-20">
        {/* Soft breathing sprout glow behind the button */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1.5 -z-10 rounded-full bg-sprout-400/40 blur-md motion-safe:animate-pulse dark:bg-sprout-500/30"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("info.aria")}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-sprout-100 bg-surface/80 text-sprout-600 shadow-[0_0_14px_rgba(34,197,94,0.35)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-sprout-50 hover:text-sprout-700 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sprout-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:border-sprout-900 dark:bg-surface-dark-muted/80 dark:text-sprout-400 dark:hover:bg-sprout-950 dark:focus-visible:ring-offset-surface-dark"
        >
          <Info size={18} aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[95] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={t("info.title")}
          onClick={() => setOpen(false)}
        >
          <div
            className="animate-pop-in w-full max-w-md rounded-3xl border border-sprout-100 bg-surface p-5 shadow-[0_24px_60px_rgba(22,101,52,0.24)] dark:border-sprout-900 dark:bg-surface-dark-muted"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold text-ink dark:text-surface">
                {t("info.title")}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("plan.close")}
                className="-mr-1 -mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-ink-subtle hover:bg-surface-muted hover:text-ink dark:text-surface-muted dark:hover:bg-surface-dark dark:hover:text-surface"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Quick start */}
            <div className="mb-4">
              <h3 className="mb-2 inline-flex items-center gap-1.5 text-sm font-bold text-sprout-700 dark:text-sprout-300">
                <Sparkles size={15} aria-hidden="true" />
                {t("info.howTitle")}
              </h3>
              <ul className="flex flex-col gap-1.5 text-sm text-ink-muted dark:text-surface-muted">
                {howto.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sprout-400 dark:bg-sprout-500"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {/* Data caution */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/60 dark:bg-amber-950/40">
              <h3 className="mb-1.5 inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 dark:text-amber-300">
                <AlertTriangle size={15} aria-hidden="true" />
                {t("info.dataTitle")}
              </h3>
              <ul className="flex flex-col gap-1.5 text-sm text-amber-800/90 dark:text-amber-200/80">
                {data.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
