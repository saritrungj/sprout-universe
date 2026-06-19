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
  getGoalProgress,
} from "../lib/status";
import { exportDashboard, ExportRatio } from "../lib/export";
import { useCountUp } from "../lib/useCountUp";
import { useT } from "../lib/i18n";
import Heatmap from "./Heatmap";
import StreakCard from "./StreakCard";

type Props = { state: AppState };

export default function Dashboard({ state }: Props) {
  const { t, locale } = useT();
  const zen = state.settings.zenMode;
  const exportRef = useRef<HTMLDivElement>(null);
  const month = currentMonth();
  const streak = getStreak(state);
  const stats = getMonthStats(state, month);
  const heatmap = getHeatmapData(state, 26);
  const goals = getGoalProgress(state);
  const recentNotes = Object.values(state.days)
    .filter((log) => (log.note ?? "").trim())
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

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
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col gap-5 px-4 py-5 lg:px-8 lg:py-8">
      {/* Export buttons */}
      <div className="flex flex-wrap justify-end gap-2" data-export-hide>
        <button
          onClick={() => handleExport("9:16")}
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-sprout-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-sprout-700"
        >
          <Download size={14} aria-hidden="true" />{" "}
          {t("dash.export", { ratio: "9:16" })}
        </button>
        <button
          onClick={() => handleExport("16:9")}
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-sprout-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-sprout-700"
        >
          <Download size={14} aria-hidden="true" />{" "}
          {t("dash.export", { ratio: "16:9" })}
        </button>
      </div>

      {/* Exportable content */}
      <div
        ref={exportRef}
        className="grid flex-1 content-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-start"
      >
        {/* Growth headline */}
        <div className="px-1 lg:col-span-2">
          <p className="text-xs text-ink-subtle dark:text-surface-muted uppercase tracking-wide font-medium mb-1">
            {t("dash.growth")}
          </p>
          <p className="text-2xl font-bold font-sans text-ink dark:text-surface leading-snug">
            {zen ? t("dash.thisMonth") : headline}
          </p>
        </div>

        {/* Streak with 3D flame */}
        {/* Heatmap — hero artifact */}
        {/* Typographic stat row — no boxes */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-sprout-100 px-1 pt-4 dark:border-sprout-950 sm:grid-cols-4 lg:col-span-2">
          {!zen && (
            <StatItem
              label={t("dash.completion")}
              value={stats.completionPct}
              suffix="%"
              sub={t("dash.thisMonth")}
            />
          )}
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
            accent="text-ink-muted dark:text-surface-muted"
          />
          {!zen && (
            <StatItem
              label={t("dash.bestStreak")}
              value={streak.best}
              suffix={t("unit.dayShort")}
              sub={t("dash.allTime")}
              accent="text-orange-500 dark:text-orange-400"
            />
          )}
        </div>

        <div className="lg:col-span-2">
          <Heatmap cells={heatmap} />
        </div>

        {goals.length > 0 && (
          <section className="grid gap-3 lg:col-span-2 sm:grid-cols-2">
            {goals.map((goal) => (
              <div
                key={goal.taskId}
                className="rounded-2xl border border-sprout-100 bg-surface p-4 dark:border-sprout-950 dark:bg-surface-dark-muted"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
                      {goal.type === "savings"
                        ? t("goal.savings")
                        : t("goal.weight")}
                    </p>
                    <h3 className="mt-1 text-sm font-bold text-ink dark:text-surface">
                      {goal.title}
                    </h3>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-sprout-600 dark:text-sprout-400">
                    {goal.percent}%
                  </p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-sprout-100 dark:bg-sprout-950">
                  <div
                    className="h-full rounded-full bg-sprout-500"
                    style={{ width: `${goal.percent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-ink-muted dark:text-surface-muted tabular-nums">
                  {goal.current} / {goal.target}{" "}
                  {goal.type === "savings" ? t("goal.currency") : t("goal.kg")}
                </p>
                {goal.nextCheckDate && (
                  <p className="mt-1 text-xs text-ink-subtle dark:text-surface-muted">
                    {t("goal.nextCheck", { date: goal.nextCheckDate })}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {recentNotes.length > 0 && (
          <section className="rounded-2xl border border-sprout-100 bg-surface p-4 dark:border-sprout-950 dark:bg-surface-dark-muted lg:col-span-2">
            <h3 className="text-xs font-medium uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
              {t("note.recent")}
            </h3>
            <div className="mt-3 grid gap-2">
              {recentNotes.map((log) => (
                <div
                  key={log.date}
                  className="rounded-xl bg-surface-muted px-3 py-2 text-sm text-ink dark:bg-surface-dark dark:text-surface"
                >
                  <span className="mr-2 font-bold tabular-nums text-sprout-700 dark:text-sprout-300">
                    {log.date}
                  </span>
                  {log.note}
                </div>
              ))}
            </div>
          </section>
        )}

        {!zen && <StreakCard streak={streak} todayPending={todayPending} />}

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
              role="img"
              aria-label={date}
              className={`aspect-square rounded flex items-center justify-center text-[10px] font-medium transition-colors
                ${
                  status === "complete"
                    ? "bg-sprout-500 text-white"
                    : status === "rest"
                      ? "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300"
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
