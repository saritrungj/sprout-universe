import { useRef, useState } from "react";
import {
  Download,
  Share2,
  Loader2,
  Smartphone,
  Monitor,
  Plus,
  Check,
  Trash2,
  Target,
} from "lucide-react";
import {
  AppState,
  GoalType,
  GoalConfig,
  addDayTask,
  removeTask,
  setGoalEntry,
} from "../lib/store";
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
  DayStatus,
} from "../lib/status";
import {
  downloadDashboard,
  shareDashboard,
  ExportRatio,
} from "../lib/export";
import { useCountUp } from "../lib/useCountUp";
import { TFn, useT } from "../lib/i18n";
import Heatmap from "./Heatmap";
import StreakCard from "./StreakCard";

type Props = { state: AppState; setState: (s: AppState) => void };

export default function Dashboard({ state, setState }: Props) {
  const { t, locale } = useT();
  const zen = state.settings.zenMode;
  const exportRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState<ExportRatio>("9:16");
  const [busy, setBusy] = useState<"save" | "share" | null>(null);
  const [imgMsg, setImgMsg] = useState("");
  const month = currentMonth();
  const streak = getStreak(state);
  const stats = getMonthStats(state, month);
  const heatmap = getHeatmapData(state, 26);
  const goals = getGoalProgress(state);

  // Today still pending? (drives the streak chain nudge)
  const todayStatus = getDayStatus(state, todayISO());
  const todayPending =
    todayStatus === "in-progress" || todayStatus === "neutral";

  async function handleSave() {
    if (!exportRef.current || busy) return;
    setBusy("save");
    setImgMsg("");
    try {
      await downloadDashboard(exportRef.current, ratio);
      setImgMsg(t("dash.saved"));
    } catch {
      setImgMsg(t("dash.imgError"));
    } finally {
      setBusy(null);
    }
  }

  async function handleShare() {
    if (!exportRef.current || busy) return;
    setBusy("share");
    setImgMsg("");
    try {
      const result = await shareDashboard(exportRef.current, ratio);
      if (result === "downloaded") setImgMsg(t("dash.shareFallback"));
      else if (result === "shared") setImgMsg(t("dash.shared"));
      else setImgMsg("");
    } catch {
      setImgMsg(t("dash.imgError"));
    } finally {
      setBusy(null);
    }
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
    <div className="w-full overflow-x-hidden">
      {/* ── Overview — first full-height page ────────────────────────── */}
      <section className="w-full px-4 py-5 lg:px-8 lg:py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      {/* Save / share toolbar */}
      <div
        className="flex flex-wrap items-center justify-end gap-2"
        data-export-hide
      >
        {imgMsg && (
          <span
            role="status"
            className="mr-auto text-xs font-medium text-sprout-700 dark:text-sprout-300"
          >
            {imgMsg}
          </span>
        )}

        {/* Aspect-ratio toggle */}
        <div
          className="flex rounded-full border border-sprout-100 bg-surface-muted p-1 dark:border-sprout-900 dark:bg-surface-dark"
          role="group"
          aria-label={t("dash.ratioLabel")}
        >
          <RatioChip
            active={ratio === "9:16"}
            onClick={() => setRatio("9:16")}
            icon={<Smartphone size={14} aria-hidden="true" />}
            label="9:16"
          />
          <RatioChip
            active={ratio === "16:9"}
            onClick={() => setRatio("16:9")}
            icon={<Monitor size={14} aria-hidden="true" />}
            label="16:9"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={busy !== null}
          className="flex min-h-[44px] items-center gap-2 rounded-xl border border-sprout-200 bg-surface px-3.5 py-2 text-xs font-semibold text-sprout-700 transition-colors hover:bg-sprout-50 disabled:opacity-60 dark:border-sprout-800 dark:bg-surface-dark-muted dark:text-sprout-300 dark:hover:bg-sprout-950"
        >
          {busy === "save" ? (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          ) : (
            <Download size={14} aria-hidden="true" />
          )}
          {t("dash.save")}
        </button>
        <button
          onClick={handleShare}
          disabled={busy !== null}
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-sprout-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-sprout-700 disabled:opacity-60"
        >
          {busy === "share" ? (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          ) : (
            <Share2 size={14} aria-hidden="true" />
          )}
          {t("dash.share")}
        </button>
      </div>

      {/* Exportable content */}
      <div
        ref={exportRef}
        className="grid min-w-0 content-start gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-start"
      >
        {/* Growth headline */}
        <div className="min-w-0 px-1 lg:col-span-2">
          <p className="text-xs text-ink-subtle dark:text-surface-muted uppercase tracking-wide font-medium mb-1">
            {t("dash.growth")}
          </p>
          <p className="max-w-[calc(100vw-2rem)] whitespace-normal break-words font-sans text-xl font-bold leading-snug text-ink dark:text-surface sm:max-w-none sm:text-2xl">
            {zen ? t("dash.thisMonth") : headline}
          </p>
        </div>

        <div className="grid min-w-0 gap-4 lg:hidden">
          <StatsRow stats={stats} streak={streak} zen={zen} t={t} />
          <GoalForecastPanel
            goals={goals}
            state={state}
            setState={setState}
            t={t}
          />
          <Heatmap cells={heatmap} />
          {!zen && <StreakCard streak={streak} todayPending={todayPending} />}
        </div>

        <div className="hidden min-w-0 gap-4 lg:col-span-2 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.48fr)] lg:items-start">
          <div className="grid min-w-0 gap-4">
            <StatsRow stats={stats} streak={streak} zen={zen} t={t} />
            <Heatmap cells={heatmap} />
            {!zen && (
              <StreakCard streak={streak} todayPending={todayPending} />
            )}
          </div>

          <aside className="min-w-0">
            <GoalForecastPanel
              goals={goals}
              state={state}
              setState={setState}
              t={t}
            />
          </aside>
        </div>
          </div>
        </div>
      </section>

      {/* ── Stamp calendar — second full-height page ─────────────────── */}
      <section className="flex min-h-[100svh] w-full flex-col justify-center px-4 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <header className="mb-6 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
              {t("dash.stamps")}
            </p>
            <h2 className="mt-1 font-sans text-2xl font-bold text-ink dark:text-surface">
              {monthName(month, locale)}
            </h2>
          </header>
          <StampMonth state={state} month={month} />
        </div>
      </section>
    </div>
  );
}

function RatioChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold tabular-nums transition-all ${
        active
          ? "bg-surface text-sprout-700 shadow-sm dark:bg-surface-dark-muted dark:text-sprout-300"
          : "text-ink-subtle hover:text-sprout-700 dark:text-surface-muted dark:hover:text-sprout-300"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatsRow({
  stats,
  streak,
  zen,
  t,
}: {
  stats: ReturnType<typeof getMonthStats>;
  streak: ReturnType<typeof getStreak>;
  zen: boolean;
  t: TFn;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-3 border-t border-sprout-100 px-1 pt-3 dark:border-sprout-950 sm:grid-cols-4">
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
  );
}

function GoalForecastPanel({
  goals,
  state,
  setState,
  t,
}: {
  goals: ReturnType<typeof getGoalProgress>;
  state: AppState;
  setState: (s: AppState) => void;
  t: TFn;
}) {
  const [showForm, setShowForm] = useState(false);
  const [gtype, setGtype] = useState<GoalType>("savings");
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [start, setStart] = useState("");
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [logDrafts, setLogDrafts] = useState<Record<string, string>>({});

  const unit = (type: GoalType) =>
    type === "savings" ? t("goal.currency") : t("goal.kg");

  function createGoal(e: React.FormEvent) {
    e.preventDefault();
    const tgt = Number(target);
    if (!title.trim() || !Number.isFinite(tgt) || tgt <= 0) return;
    let config: GoalConfig;
    if (gtype === "weight") {
      const st = Number(start);
      const base = Number.isFinite(st) && st > 0 ? st : tgt;
      config = {
        target: tgt,
        start: base,
        direction: tgt < base ? "loss" : "gain",
        checkEveryDays: 7,
      };
    } else {
      config = { target: tgt };
    }
    const [next] = addDayTask(state, todayISO(), title.trim(), {
      asTemplate: true,
      goalType: gtype,
      goalConfig: config,
    });
    setState(next);
    setTitle("");
    setTarget("");
    setStart("");
    setShowForm(false);
  }

  function logToday(taskId: string) {
    const value = Number(logDrafts[taskId]);
    if (!Number.isFinite(value) || logDrafts[taskId] === "") return;
    setState(setGoalEntry(state, todayISO(), taskId, value));
    setLogDrafts((drafts) => ({ ...drafts, [taskId]: "" }));
  }

  const fieldCls =
    "min-h-[44px] w-full min-w-0 rounded-xl border border-sprout-100 bg-surface px-3 text-sm text-ink placeholder-ink-subtle focus:border-sprout-400 dark:border-sprout-900 dark:bg-surface-dark dark:text-surface dark:placeholder-surface-muted";

  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-start justify-between gap-2 px-1">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
            {t("goal.section")}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-muted dark:text-surface-muted">
            {t("goal.sectionHint")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
          className="inline-flex min-h-[36px] flex-none items-center gap-1.5 rounded-full border border-sprout-200 bg-surface px-3 text-xs font-semibold text-sprout-700 transition-colors hover:bg-sprout-50 dark:border-sprout-800 dark:bg-surface-dark-muted dark:text-sprout-300 dark:hover:bg-sprout-950"
        >
          <Plus size={14} aria-hidden="true" />
          {t("goal.setCta")}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={createGoal}
          className="animate-pop-in mb-3 grid gap-2 rounded-2xl border border-sprout-100 bg-surface p-3 dark:border-sprout-900 dark:bg-surface-dark-muted"
        >
          <div className="flex rounded-full border border-sprout-100 bg-surface-muted p-1 dark:border-sprout-900 dark:bg-surface-dark">
            <TypeChip
              active={gtype === "savings"}
              onClick={() => setGtype("savings")}
              label={t("goal.savings")}
            />
            <TypeChip
              active={gtype === "weight"}
              onClick={() => setGtype("weight")}
              label={t("goal.weight")}
            />
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("goal.titlePlaceholder")}
            aria-label={t("goal.titlePlaceholder")}
            className={fieldCls}
          />
          <div className="grid grid-cols-2 gap-2">
            {gtype === "weight" && (
              <input
                type="number"
                inputMode="decimal"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                placeholder={`${t("goal.startWeight")} (${unit(gtype)})`}
                aria-label={t("goal.startWeight")}
                className={fieldCls}
              />
            )}
            <input
              type="number"
              inputMode="decimal"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={`${t("goal.target")} (${unit(gtype)})`}
              aria-label={t("goal.target")}
              className={`${fieldCls} ${gtype === "weight" ? "" : "col-span-2"}`}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-sprout-600 px-4 text-sm font-bold text-white transition-colors hover:bg-sprout-700"
            >
              <Target size={15} aria-hidden="true" />
              {t("goal.create")}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted dark:text-surface-muted dark:hover:bg-surface-dark"
            >
              {t("goal.cancel")}
            </button>
          </div>
        </form>
      )}

      {goals.length === 0 ? (
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-dashed border-sprout-200 bg-surface px-4 py-3 dark:border-sprout-900 dark:bg-surface-dark-muted">
          <img
            src="/sprout-finance.png"
            alt=""
            aria-hidden="true"
            className="h-14 w-14 flex-none object-contain"
          />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-ink dark:text-surface">
              {t("goal.emptyTitle")}
            </h3>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-muted dark:text-surface-muted">
              {t("goal.emptyBody")}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {goals.map((goal) => (
            <div
              key={goal.taskId}
              className="min-w-0 rounded-2xl border border-sprout-100 bg-surface p-3 dark:border-sprout-950 dark:bg-surface-dark-muted"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
                    {goal.type === "savings"
                      ? t("goal.savings")
                      : t("goal.weight")}
                  </p>
                  <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-ink dark:text-surface">
                    {goal.title}
                  </h3>
                </div>
                <div className="flex flex-none items-center gap-2">
                  <p className="text-xl font-bold tabular-nums text-sprout-600 dark:text-sprout-400">
                    {goal.percent}%
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmRemove(
                        confirmRemove === goal.taskId ? null : goal.taskId,
                      )
                    }
                    aria-label={t("goal.remove")}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-subtle transition-colors hover:bg-red-50 hover:text-red-500 dark:text-surface-muted dark:hover:bg-red-950 dark:hover:text-red-400"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {confirmRemove === goal.taskId && (
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900/60 dark:bg-red-950/30">
                  <span className="text-xs font-medium text-red-700 dark:text-red-300">
                    {t("goal.removeConfirm")}
                  </span>
                  <span className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setState(removeTask(state, goal.taskId));
                        setConfirmRemove(null);
                      }}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      {t("goal.remove")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmRemove(null)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-muted hover:bg-surface-muted dark:text-surface-muted dark:hover:bg-surface-dark"
                    >
                      {t("goal.cancel")}
                    </button>
                  </span>
                </div>
              )}

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sprout-100 dark:bg-sprout-950">
                <div
                  className="h-full rounded-full bg-sprout-500 transition-[width] duration-700"
                  style={{ width: `${goal.percent}%` }}
                />
              </div>
              <GoalSparkline points={goal.trend} target={goal.target} />
              <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
                <GoalMetric
                  label={t("goal.current")}
                  value={`${formatGoalNumber(goal.current)} ${unit(goal.type)}`}
                />
                <GoalMetric
                  label={t("goal.remaining")}
                  value={`${formatGoalNumber(goal.remaining)} ${unit(goal.type)}`}
                />
                <GoalMetric
                  label={t("goal.pace")}
                  value={
                    goal.pacePerDay
                      ? `${formatGoalNumber(goal.pacePerDay)}/${t("unit.dayShort")}`
                      : t("goal.needsTwoPoints")
                  }
                />
                <GoalMetric
                  label={t("goal.forecast")}
                  value={
                    goal.reached
                      ? t("goal.reached")
                      : goal.forecastDate ?? t("goal.needsTwoPoints")
                  }
                />
              </div>

              {/* Quick log today's value */}
              <div className="mt-2 flex gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  value={logDrafts[goal.taskId] ?? ""}
                  onChange={(e) =>
                    setLogDrafts((d) => ({ ...d, [goal.taskId]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      logToday(goal.taskId);
                    }
                  }}
                  placeholder={`${t("goal.logToday")} (${unit(goal.type)})`}
                  aria-label={t("goal.logToday")}
                  className="min-h-[40px] min-w-0 flex-1 rounded-xl border border-sprout-100 bg-surface-muted px-3 text-sm text-ink placeholder-ink-subtle focus:border-sprout-400 dark:border-sprout-900 dark:bg-surface-dark dark:text-surface dark:placeholder-surface-muted"
                />
                <button
                  type="button"
                  onClick={() => logToday(goal.taskId)}
                  aria-label={t("goal.logCta")}
                  className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl bg-sprout-600 text-white transition-colors hover:bg-sprout-700"
                >
                  <Check size={16} aria-hidden="true" />
                </button>
              </div>

              {goal.nextCheckDate && (
                <p className="mt-2 text-[11px] text-ink-subtle dark:text-surface-muted">
                  {t("goal.nextCheck", { date: goal.nextCheckDate })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TypeChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-[36px] flex-1 items-center justify-center rounded-full px-3 text-xs font-bold transition-all ${
        active
          ? "bg-surface text-sprout-700 shadow-sm dark:bg-surface-dark-muted dark:text-sprout-300"
          : "text-ink-subtle dark:text-surface-muted"
      }`}
    >
      {label}
    </button>
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

/** Mascot-head sticker per status — mirrors the calendar's stamp set. */
const DASH_STATUS_HEAD: Record<Exclude<DayStatus, "neutral">, string> = {
  complete: "/sprout-head-happy.png",
  missed: "/sprout-head-sad.png",
  "in-progress": "/sprout-head-work.png",
  rest: "/sprout-head-rest.png",
};

/** Full-page month grid stamped with mascot heads, matching the calendar. */
function StampMonth({ state, month }: { state: AppState; month: string }) {
  const { t, locale } = useT();
  const today = todayISO();
  const grid = buildMonthGrid(month);
  const stats = getMonthStats(state, month);
  const dayLetters = weekdayLabels(locale, "narrow");

  return (
    <div className="rounded-3xl border border-sprout-100 bg-surface p-4 dark:border-sprout-900 dark:bg-surface-dark-muted sm:p-6">
      <div className="mb-3 flex items-center justify-end">
        <span className="text-xs font-medium text-ink-muted dark:text-surface-muted tabular-nums">
          {t("dash.complete", {
            green: stats.greenDays,
            total: stats.totalDays,
          })}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {dayLetters.map((d, i) => (
          <div
            key={i}
            className="pb-1 text-center text-[11px] font-medium text-ink-subtle dark:text-surface-muted"
            aria-hidden="true"
          >
            {d}
          </div>
        ))}
        {grid.flat().map((date, i) => {
          if (!date) return <div key={i} />;
          const status = getDayStatus(state, date);
          const dayNum = parseInt(date.slice(8), 10);
          const isToday = date === today;
          const isFuture = date > today;
          return (
            <div
              key={i}
              role="img"
              aria-label={`${date}`}
              className="flex flex-col items-center gap-1"
            >
              <span
                className={`text-[10px] tabular-nums ${
                  isToday
                    ? "font-bold text-sprout-600 dark:text-sprout-400"
                    : "text-ink-subtle dark:text-surface-muted"
                }`}
                aria-hidden="true"
              >
                {dayNum}
              </span>
              <div
                className={`flex aspect-square w-full items-center justify-center rounded-xl ${
                  isToday
                    ? "ring-2 ring-sprout-400 ring-offset-1 ring-offset-surface dark:ring-sprout-500 dark:ring-offset-surface-dark-muted"
                    : ""
                } ${
                  status === "neutral" && !isFuture
                    ? "bg-surface-muted/60 dark:bg-surface-dark/60"
                    : ""
                }`}
              >
                {status !== "neutral" && (
                  <img
                    src={DASH_STATUS_HEAD[status]}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain p-0.5 drop-shadow-[0_2px_4px_rgba(22,101,52,0.18)]"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-ink-subtle dark:text-surface-muted">
        <StampLegend src="/sprout-head-happy.png" label={t("cal.complete")} />
        <StampLegend src="/sprout-head-work.png" label={t("cal.inProgress")} />
        <StampLegend src="/sprout-head-sad.png" label={t("cal.missed")} />
        <StampLegend src="/sprout-head-rest.png" label={t("status.rest")} />
      </div>
    </div>
  );
}

function StampLegend({ src, label }: { src: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="h-5 w-5 flex-none object-contain"
      />
      {label}
    </span>
  );
}

function GoalMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-muted px-2.5 py-1.5 dark:bg-surface-dark">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
        {label}
      </p>
      <p className="mt-0.5 break-words text-[11px] font-bold tabular-nums text-ink dark:text-surface">
        {value}
      </p>
    </div>
  );
}

function GoalSparkline({
  points,
  target,
}: {
  points: { date: string; value: number }[];
  target: number;
}) {
  if (points.length < 2) {
    return (
      <div className="mt-2 flex h-12 items-center justify-center rounded-xl bg-surface-muted text-xs text-ink-subtle dark:bg-surface-dark dark:text-surface-muted">
        --
      </div>
    );
  }
  const values = points.map((point) => point.value);
  // Include the target in the y-range so the goal line is always visible.
  const lo = Math.min(...values, target);
  const hi = Math.max(...values, target);
  const span = Math.max(1, hi - lo);
  const yOf = (v: number) => 54 - ((v - lo) / span) * 48;
  const xOf = (i: number) => (i / (points.length - 1)) * 100;
  const line = points.map((p, i) => `${xOf(i)},${yOf(p.value)}`).join(" ");
  const area =
    `0,60 ` + points.map((p, i) => `${xOf(i)},${yOf(p.value)}`).join(" ") + ` 100,60`;
  const targetY = yOf(target);
  return (
    <svg
      viewBox="0 0 100 60"
      role="img"
      aria-label="Goal trend toward target"
      className="mt-2 h-12 w-full rounded-xl bg-surface-muted p-1.5 dark:bg-surface-dark"
      preserveAspectRatio="none"
    >
      {/* Filled area under the trend (inline color so SVG fill is reliable) */}
      <polygon points={area} fill="rgba(34,197,94,0.12)" stroke="none" />
      {/* Target guideline */}
      <line
        x1="0"
        y1={targetY}
        x2="100"
        y2={targetY}
        stroke="#86efac"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      {/* Trend line */}
      <polyline
        points={line}
        fill="none"
        stroke="#22c55e"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatGoalNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function monthName(month: string, locale = "en-US"): string {
  return new Date(month + "-01T00:00:00").toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });
}
