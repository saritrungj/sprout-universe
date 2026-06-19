import { useEffect, useRef, useState } from "react";
import { Plus, Check, ChevronDown, Repeat2, Flame, X } from "lucide-react";
import {
  AppState,
  getDayTaskIds,
  getDayLog,
  getMonthPlan,
  setTaskDone,
  addTask,
  addAddonTask,
  removeAddonTask,
} from "../lib/store";
import { todayISO, formatDayLabel, weekdayLabels } from "../lib/dates";
import {
  getDayStatus,
  getStreak,
  getMonthStats,
  DayStatus,
} from "../lib/status";
import { useCountUp } from "../lib/useCountUp";
import { useT } from "../lib/i18n";
import TaskManager from "./TaskManager";
import Celebration from "./Celebration";
import InstallButton from "./InstallButton";

type Props = {
  state: AppState;
  setState: (s: AppState) => void;
};

/** Rolling 7 days ending today (oldest first), built in local time. */
function lastSevenDays(): string[] {
  const [y, m, d] = todayISO().split("-").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(y, m - 1, d - (6 - i));
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  });
}

const WEEK_CELL: Record<DayStatus, string> = {
  complete: "bg-sprout-500 text-white",
  "in-progress":
    "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  missed: "bg-red-50 dark:bg-red-950 text-red-500 dark:text-red-400",
  neutral:
    "bg-surface-muted dark:bg-surface-dark-muted text-ink-subtle dark:text-surface-muted",
};

/** Map completion percent → the matching mascot pose + encouragement key. */
function stageFor(pct: number, total: number) {
  if (total === 0)
    return { src: "/sprout-empty.png", key: "today.stage.empty" };
  if (pct >= 100)
    return { src: "/sprout-success.png", key: "today.stage.done" };
  if (pct >= 75)
    return { src: "/sprout-success.png", key: "today.stage.almost" };
  if (pct >= 50)
    return { src: "/sprout-empty.png", key: "today.stage.growing" };
  if (pct >= 25)
    return { src: "/sprout-progress.png", key: "today.stage.progress" };
  return { src: "/sprout-fail.png", key: "today.stage.start" };
}

export default function TodayView({ state, setState }: Props) {
  const { t, locale } = useT();
  const today = todayISO();
  const month = today.slice(0, 7);
  const taskIds = getDayTaskIds(state, today);
  const log = getDayLog(state, today);
  const status = getDayStatus(state, today);
  const mainIds = new Set(getMonthPlan(state, month).mainTaskIds);
  const [newTask, setNewTask] = useState("");
  const [showManager, setShowManager] = useState(false);
  const [burst, setBurst] = useState(0);

  const done = taskIds.filter((id) => log.done[id]).length;
  const total = taskIds.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const displayPct = useCountUp(pct, 700);

  const streak = getStreak(state);
  const stats = getMonthStats(state, month);
  const weekDays = weekdayLabels(locale, "narrow");
  const week = lastSevenDays();
  const stage = stageFor(pct, total);

  // Fire the celebration the moment the day flips to complete.
  const wasComplete = useRef(status === "complete");
  useEffect(() => {
    if (status === "complete" && !wasComplete.current) {
      setBurst((b) => b + 1);
    }
    wasComplete.current = status === "complete";
  }, [status]);

  function toggle(taskId: string) {
    setState(setTaskDone(state, today, taskId, !log.done[taskId]));
  }

  function removeAddon(taskId: string) {
    setState(removeAddonTask(state, today, taskId));
  }

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;
    const [s2, id] = addTask(state, newTask.trim());
    setState(addAddonTask(s2, today, id));
    setNewTask("");
  }

  function scrollToTasks() {
    document
      .getElementById("today-tasks")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="w-full">
      <Celebration burstKey={burst} />

      {/* ── Progression hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 py-12">
        {/* Base + liquid growth fill (transform-only, no layout thrash) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-sprout-50 to-surface dark:from-sprout-950/60 dark:to-surface-dark"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full origin-bottom bg-gradient-to-t from-sprout-300/45 via-sprout-200/20 to-transparent transition-transform duration-700 ease-out dark:from-sprout-700/40 dark:via-sprout-800/15"
          style={{
            transform: `scaleY(${Math.max(pct, total === 0 ? 4 : 6) / 100})`,
          }}
        />

        <p className="mb-2 text-sm font-medium text-ink-subtle dark:text-surface-muted">
          {formatDayLabel(today, locale)}
        </p>

        {/* Mascot with soft glow */}
        <div className="relative flex items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute h-40 w-40 rounded-full bg-sprout-300/30 blur-3xl dark:bg-sprout-600/25 sm:h-56 sm:w-56"
          />
          <img
            key={stage.src}
            src={stage.src}
            alt=""
            aria-hidden="true"
            className="relative w-40 object-contain drop-shadow-[0_18px_30px_rgba(22,101,52,0.18)] animate-bloom sm:w-52 lg:w-60"
            style={{ animation: "streak-float 4.6s ease-in-out infinite" }}
          />
        </div>

        {/* Percent + count */}
        <div
          className="mt-4 flex flex-col items-center"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("today.progressAria", { pct })}
        >
          <div className="font-sans text-7xl font-bold leading-none tracking-tight text-ink dark:text-surface tabular-nums sm:text-8xl">
            {displayPct}
            <span className="text-3xl align-top text-sprout-600 dark:text-sprout-400 sm:text-4xl">
              %
            </span>
          </div>
          {total > 0 && (
            <p className="mt-2 text-sm font-medium text-ink-muted dark:text-surface-muted tabular-nums">
              {t("today.count", { done, total })}
            </p>
          )}
        </div>

        {/* Stage encouragement */}
        <p className="mt-3 max-w-xs text-center text-lg font-semibold text-ink dark:text-surface sm:text-xl">
          {t(stage.key)}
        </p>

        {/* Streak + month, inline */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm">
          <span className="inline-flex items-center gap-1.5 font-semibold text-ink dark:text-surface">
            <Flame
              size={16}
              aria-hidden="true"
              className={
                streak.current > 0
                  ? "text-orange-500 dark:text-orange-400"
                  : "text-ink-subtle dark:text-surface-muted"
              }
            />
            {streak.current > 0
              ? t("headline.streak", { n: streak.current })
              : t("today.streakStart")}
          </span>
          {stats.totalDays > 0 && (
            <span className="text-ink-muted dark:text-surface-muted tabular-nums">
              {t("today.monthInline", { pct: stats.completionPct })}
            </span>
          )}
        </div>

        {/* Install (handheld only) + scroll cue */}
        <div className="mt-8 flex flex-col items-center gap-5">
          <InstallButton />
          <button
            onClick={scrollToTasks}
            className="flex flex-col items-center gap-1 text-xs font-medium uppercase tracking-wide text-ink-subtle hover:text-sprout-700 dark:text-surface-muted dark:hover:text-sprout-300"
          >
            {t("today.scrollTasks")}
            <ChevronDown
              size={20}
              aria-hidden="true"
              className="animate-bounce"
            />
          </button>
        </div>
      </section>

      {/* ── Tasks ────────────────────────────────────────────────────── */}
      <section
        id="today-tasks"
        className="mx-auto flex w-full max-w-xl flex-col gap-6 scroll-mt-28 px-4 py-10"
      >
        {/* This week — rolling 7-day status strip */}
        <div>
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
            {t("today.thisWeek")}
          </h2>
          <div className="grid grid-cols-7 gap-1.5">
            {week.map((date) => {
              const st = getDayStatus(state, date);
              const isToday = date === today;
              const dayNum = parseInt(date.slice(8), 10);
              const letter = weekDays[new Date(date + "T00:00:00").getDay()];
              return (
                <div key={date} className="flex flex-col items-center gap-1">
                  <span
                    className="text-[10px] text-ink-subtle dark:text-surface-muted"
                    aria-hidden="true"
                  >
                    {letter}
                  </span>
                  <div
                    aria-label={`${formatDayLabel(date, locale)} — ${t(
                      st === "complete"
                        ? "status.done"
                        : st === "in-progress"
                          ? "status.inProgress"
                          : st === "missed"
                            ? "status.missed"
                            : "day.empty",
                    )}`}
                    className={`flex aspect-square w-full items-center justify-center rounded-lg text-[11px] font-semibold tabular-nums transition-colors ${
                      WEEK_CELL[st]
                    } ${
                      isToday
                        ? "ring-2 ring-sprout-400 ring-offset-1 ring-offset-surface dark:ring-sprout-500 dark:ring-offset-surface-dark"
                        : ""
                    }`}
                  >
                    {dayNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task list */}
        {taskIds.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sprout-200 py-10 text-center text-ink-subtle dark:border-sprout-900 dark:text-surface-muted">
            <img
              src="/sprout-empty.png"
              alt=""
              aria-hidden="true"
              className="mx-auto mb-3 h-20 w-20 object-contain"
            />
            <p className="text-sm">{t("today.empty")}</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {taskIds.map((id) => {
              const task = state.tasks[id];
              if (!task) return null;
              const isDone = !!log.done[id];
              const isAddon = !mainIds.has(id);
              return (
                <li key={id} className="flex items-stretch gap-2">
                  <button
                    onClick={() => toggle(id)}
                    aria-pressed={isDone}
                    aria-label={t(isDone ? "task.unmark" : "task.mark", {
                      title: task.title,
                    })}
                    className={`flex flex-1 items-center gap-3 rounded-2xl border p-4 text-left transition-all
                      ${
                        isDone
                          ? "border-sprout-200 bg-sprout-50 dark:border-sprout-800 dark:bg-sprout-950"
                          : "border-gray-100 bg-surface hover:border-sprout-300 dark:border-gray-800 dark:bg-surface-dark-muted"
                      }`}
                  >
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all
                        ${
                          isDone
                            ? "border-sprout-500 bg-sprout-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      aria-hidden="true"
                    >
                      {isDone && (
                        <Check size={14} className="text-white animate-bloom" />
                      )}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isDone
                          ? "text-ink-subtle line-through dark:text-surface-muted"
                          : "text-ink dark:text-surface"
                      }`}
                    >
                      {task.title}
                    </span>
                  </button>
                  {isAddon && (
                    <button
                      onClick={() => removeAddon(id)}
                      aria-label={t("today.removeAria", { title: task.title })}
                      className="flex min-h-[44px] w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-surface text-ink-subtle hover:border-red-300 hover:text-red-500 dark:border-gray-800 dark:bg-surface-dark-muted dark:text-surface-muted dark:hover:text-red-400"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Add today task */}
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder={t("today.addPlaceholder")}
            aria-label={t("today.newTaskAria")}
            className="flex-1 rounded-2xl border border-gray-200 bg-surface px-4 py-3 text-sm text-ink placeholder-ink-subtle transition-colors focus:border-sprout-400 dark:border-gray-700 dark:bg-surface-dark-muted dark:text-surface dark:placeholder-surface-muted"
          />
          <button
            type="submit"
            aria-label={t("task.addAria")}
            className="min-h-[44px] min-w-[44px] rounded-2xl bg-sprout-600 px-4 py-3 text-white transition-colors hover:bg-sprout-700"
          >
            <Plus size={18} aria-hidden="true" />
          </button>
        </form>

        {/* Manage monthly tasks */}
        <button
          onClick={() => setShowManager((v) => !v)}
          aria-expanded={showManager}
          aria-controls="monthly-recurring-tasks"
          className={`inline-flex min-h-[44px] items-center justify-center gap-2 self-center rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-all
            ${
              showManager
                ? "border-sprout-300 bg-sprout-50 text-sprout-700 dark:border-sprout-800 dark:bg-sprout-950 dark:text-sprout-300"
                : "border-sprout-100 bg-surface-muted text-sprout-700 hover:border-sprout-300 hover:bg-sprout-50 dark:border-sprout-900 dark:bg-surface-dark-muted dark:text-sprout-300 dark:hover:bg-sprout-950"
            }`}
        >
          <Repeat2 size={16} aria-hidden="true" />
          <span>
            {t(showManager ? "today.hideRecurring" : "today.showRecurring")}
          </span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`transition-transform duration-300 ease-in-out ${
              showManager ? "rotate-180" : ""
            }`}
          />
        </button>

        {showManager && (
          <div id="monthly-recurring-tasks" className="view-enter">
            <TaskManager state={state} setState={setState} />
          </div>
        )}
      </section>
    </div>
  );
}
