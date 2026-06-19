import { useRef } from "react";
import { Download } from "lucide-react";
import { AppState } from "../lib/store";
import {
  currentMonth,
  buildMonthGrid,
  todayISO,
  weekdayLabels,
} from "../lib/dates";
import {
  getStreak,
  getMonthStats,
  getHeatmapData,
  getDayStatus,
} from "../lib/status";
import { exportDashboard, ExportRatio } from "../lib/export";
import { useCountUp } from "../lib/useCountUp";
import { useT } from "../lib/i18n";
import Heatmap from "./Heatmap";
import StreakCard from "./StreakCard";

type Props = { state: AppState };

export default function Dashboard({ state }: Props) {
  const { t, locale } = useT();
  const exportRef = useRef<HTMLDivElement>(null);
  const month = currentMonth();
  const streak = getStreak(state);
  const stats = getMonthStats(state, month);
  const heatmap = getHeatmapData(state, 26);

  // Today still pending? (drives the streak chain nudge)
  const todayStatus = getDayStatus(state, todayISO());
  const todayPending =
    todayStatus === "in-progress" || todayStatus === "neutral";

  async function handleExport(ratio: ExportRatio) {
    if (!exportRef.current) return;
    await exportDashboard(exportRef.current, ratio);
  }

  const streakPart =
    streak.current > 0
      ? t("headline.streak", { n: streak.current })
      : streak.best > 0
        ? t("headline.best", { n: streak.best })
        : t("headline.start");
  const monthPart =
    stats.totalDays > 0
      ? t("headline.month", {
          pct: stats.completionPct,
          month: monthName(month, locale),
        })
      : null;
  const headline =
    [streakPart, monthPart].filter(Boolean).join(t("common.sep")) +
    t("common.end");

  return (
    <div className="flex flex-col gap-4 p-4 max-w-xl mx-auto w-full">
      {/* Export buttons */}
      <div className="flex gap-2 justify-end" data-export-hide>
        <button
          onClick={() => handleExport("9:16")}
          className="flex items-center gap-2 px-3 py-2 bg-sprout-600 hover:bg-sprout-700 text-white text-xs rounded-xl transition-colors font-medium"
        >
          <Download size={14} aria-hidden="true" />{" "}
          {t("dash.export", { ratio: "9:16" })}
        </button>
        <button
          onClick={() => handleExport("16:9")}
          className="flex items-center gap-2 px-3 py-2 bg-sprout-600 hover:bg-sprout-700 text-white text-xs rounded-xl transition-colors font-medium"
        >
          <Download size={14} aria-hidden="true" />{" "}
          {t("dash.export", { ratio: "16:9" })}
        </button>
      </div>

      {/* Exportable content */}
      <div ref={exportRef} className="flex flex-col gap-5">
        {/* Growth headline */}
        <div className="px-1">
          <p className="text-xs text-ink-subtle dark:text-surface-muted uppercase tracking-wide font-medium mb-1">
            {t("dash.growth")}
          </p>
          <p className="text-2xl font-bold font-sans text-ink dark:text-surface leading-snug">
            {headline}
          </p>
        </div>

        {/* Streak with 3D flame */}
        <StreakCard streak={streak} todayPending={todayPending} />

        {/* Heatmap — hero artifact */}
        <Heatmap cells={heatmap} />

        {/* Typographic stat row — no boxes */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 px-1 border-t border-sprout-100 dark:border-sprout-950 pt-4">
          <StatItem
            label={t("dash.completion")}
            value={stats.completionPct}
            suffix="%"
            sub={t("dash.thisMonth")}
          />
          <StatItem
            label={t("dash.greenDays")}
            value={stats.greenDays}
            sub={t("dash.ofTracked", { n: stats.totalDays })}
            accent="text-sprout-600 dark:text-sprout-400"
          />
          <StatItem
            label={t("dash.tasksDone")}
            value={stats.tasksCompleted}
            sub={t("dash.thisMonth")}
            accent="text-blue-500 dark:text-blue-400"
          />
          <StatItem
            label={t("dash.bestStreak")}
            value={streak.best}
            suffix={t("unit.dayShort")}
            sub={t("dash.allTime")}
            accent="text-orange-500 dark:text-orange-400"
          />
        </div>

        {/* Mini month calendar */}
        <MiniMonthSummary state={state} month={month} />
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  suffix = "",
  sub,
  accent = "text-ink dark:text-surface",
}: {
  label: string;
  value: number;
  suffix?: string;
  sub?: string;
  accent?: string;
}) {
  const animated = useCountUp(value, 900);
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-ink-subtle dark:text-surface-muted uppercase tracking-wide font-medium">
        {label}
      </span>
      <span className={`text-2xl font-bold tabular-nums ${accent}`}>
        {animated}
        {suffix}
      </span>
      {sub && (
        <span className="text-xs text-ink-subtle dark:text-surface-muted">
          {sub}
        </span>
      )}
    </div>
  );
}

function MiniMonthSummary({
  state,
  month,
}: {
  state: AppState;
  month: string;
}) {
  const { t, locale } = useT();
  const today = todayISO();
  const grid = buildMonthGrid(month);
  const stats = getMonthStats(state, month);
  const dayLetters = weekdayLabels(locale, "narrow");

  return (
    <div className="bg-surface dark:bg-surface-dark-muted rounded-2xl p-4 border border-sprout-100 dark:border-sprout-950">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs text-ink-subtle dark:text-surface-muted uppercase tracking-wide font-medium">
          {monthName(month, locale)}
        </h3>
        <span className="text-xs text-ink-muted dark:text-surface-muted">
          {t("dash.complete", {
            green: stats.greenDays,
            total: stats.totalDays,
          })}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dayLetters.map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] text-ink-subtle dark:text-surface-muted pb-1"
            aria-hidden="true"
          >
            {d}
          </div>
        ))}
        {grid.flat().map((date, i) => {
          if (!date) return <div key={i} />;
          const status = getDayStatus(state, date);
          const dayNum = parseInt(date.slice(8));
          const isToday = date === today;
          return (
            <div
              key={i}
              aria-label={date}
              className={`aspect-square rounded flex items-center justify-center text-[10px] font-medium transition-colors
                ${
                  status === "complete"
                    ? "bg-sprout-500 text-white"
                    : status === "missed"
                      ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
                      : status === "in-progress"
                        ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                        : isToday
                          ? "bg-sprout-50 dark:bg-sprout-950 text-sprout-600 font-bold"
                          : "text-ink-subtle dark:text-surface-muted"
                }`}
            >
              {dayNum}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function monthName(month: string, locale = "en-US"): string {
  return new Date(month + "-01T00:00:00").toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });
}
