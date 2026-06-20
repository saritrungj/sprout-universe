import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Check,
  ChevronDown,
  X,
  Sunrise,
  Sun,
  Moon,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  AppState,
  Slot,
  getDayTaskIds,
  getDayLog,
  setTaskDone,
  addDayTask,
  removeDayTask,
  setDayNote,
  setDaySkipped,
} from "../lib/store";
import { todayISO, formatDayLabel, weekdayLabels } from "../lib/dates";
import {
  getDayStatus,
  getStreak,
  getMonthStats,
  DayStatus,
} from "../lib/status";
import { useCountUp } from "../lib/useCountUp";
import { useT, TFn } from "../lib/i18n";
import { getDailyMotivation } from "../lib/motivation";
import { playSound } from "../lib/sound";
import InstallButton from "./InstallButton";
import Celebration from "./Celebration";
import HeroPlanner from "./HeroPlanner";
import HeroInfo from "./HeroInfo";

type Props = {
  state: AppState;
  setState: (s: AppState) => void;
};

const WEEK_CELL: Record<DayStatus, string> = {
  complete: "bg-sprout-500 text-white",
  "in-progress":
    "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  missed: "bg-red-50 dark:bg-red-950 text-red-500 dark:text-red-400",
  neutral:
    "bg-surface-muted dark:bg-surface-dark-muted text-ink-subtle dark:text-surface-muted",
  rest: "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300",
};

const SLOT_ORDER: Slot[] = ["morning", "afternoon", "evening"];
const SLOT_ICON: Record<Slot, typeof Sun> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Moon,
};

function lastSevenDays(): string[] {
  const [y, m, d] = todayISO().split("-").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(y, m - 1, d - (6 - i));
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  });
}

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

function streakMascotSrc(days: number): string {
  if (days >= 21) return "/sprout-streak-21.png";
  if (days >= 15) return "/sprout-streak-15.png";
  if (days >= 7) return "/sprout-streak-7.png";
  if (days >= 3) return "/sprout-streak-3.png";
  if (days >= 1) return "/sprout-streak-1.png";
  return "/sprout-streak.png";
}

export default function TodayView({ state, setState }: Props) {
  const { t, locale } = useT();
  const zen = state.settings.zenMode;
  const today = todayISO();
  const month = today.slice(0, 7);
  const taskIds = getDayTaskIds(state, today);
  const log = getDayLog(state, today);
  const status = getDayStatus(state, today);
  const [newTask, setNewTask] = useState("");
  const [newSlot, setNewSlot] = useState<Slot | "anytime">("anytime");
  const [burst, setBurst] = useState(0);

  const done = taskIds.filter((id) => log.done[id]).length;
  const total = taskIds.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const displayPct = useCountUp(pct, 700);
  const allDone = total > 0 && pct >= 100;

  const streak = getStreak(state);
  const stats = getMonthStats(state, month);
  const weekDays = weekdayLabels(locale, "narrow");
  const week = lastSevenDays();
  const stage = stageFor(pct, total);
  const motivation = getDailyMotivation(today, state.settings.language);
  const skipped = !!log.skipped;
  const streakDays = streak.current;
  const streakMascot = streakMascotSrc(streakDays);

  // Group task ids by slot (undefined slot → "anytime").
  const groups: Record<Slot | "anytime", string[]> = {
    morning: [],
    afternoon: [],
    evening: [],
    anytime: [],
  };
  for (const id of taskIds) {
    const slot = state.tasks[id]?.slot ?? "anytime";
    groups[slot].push(id);
  }
  const usesSlots = SLOT_ORDER.some((s) => groups[s].length > 0);
  const soundOn = state.settings.sound !== false;
  const wasComplete = useRef(status === "complete");
  useEffect(() => {
    if (status === "complete" && !wasComplete.current) {
      setBurst((b) => b + 1);
      playSound("complete", soundOn);
    }
    wasComplete.current = status === "complete";
  }, [status, soundOn]);

  function toggle(taskId: string) {
    const next = !log.done[taskId];
    setState(setTaskDone(state, today, taskId, next));
    if (next) playSound("tap", soundOn);
  }
  function removeTodayTask(taskId: string) {
    setState(removeDayTask(state, today, taskId));
  }
  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;
    const [nextState, id] = addDayTask(state, today, newTask.trim(), {
      slot: newSlot === "anytime" ? undefined : newSlot,
    });
    if (!id) return;
    setState(nextState);
    setNewTask("");
  }
  function scrollToTasks() {
    document
      .getElementById("today-tasks")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderRow(id: string) {
    const task = state.tasks[id];
    if (!task) return null;
    const isDone = !!log.done[id];
    return (
      <li key={id} className="flex flex-col gap-2 rounded-2xl border border-sprout-100 bg-surface p-2 dark:border-sprout-900 dark:bg-surface-dark-muted">
        <div className="flex items-stretch gap-2">
        <button
          onClick={() => toggle(id)}
          disabled={skipped}
          aria-pressed={isDone}
          aria-label={t(isDone ? "task.unmark" : "task.mark", {
            title: task.title,
          })}
          className={`flex flex-1 items-center gap-3 rounded-2xl border p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-55
            ${
              isDone
                ? "border-sprout-200 bg-sprout-50 dark:border-sprout-800 dark:bg-sprout-950"
                : "border-sprout-100 bg-surface hover:border-sprout-300 dark:border-sprout-900 dark:bg-surface-dark-muted"
            }`}
        >
          <span
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all
              ${
                isDone
                  ? "border-sprout-500 bg-sprout-500"
                  : "border-sprout-200 dark:border-sprout-700"
              }`}
            aria-hidden="true"
          >
            {isDone && <Check size={14} className="text-white animate-bloom" />}
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
          <button
            onClick={() => removeTodayTask(id)}
            aria-label={t("today.removeAria", { title: task.title })}
            className="flex min-h-[44px] w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-sprout-100 bg-surface text-ink-subtle hover:border-red-300 hover:text-red-500 dark:border-sprout-900 dark:bg-surface-dark-muted dark:text-surface-muted dark:hover:text-red-400"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </li>
    );
  }

  return (
    <div className="min-h-full w-full">
      <Celebration burstKey={burst} />

      {/* ── Progression hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100dvh-4.5rem)] w-full flex-col items-center justify-center overflow-hidden px-6 py-10 lg:min-h-dvh lg:py-12">
        <HeroInfo />
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

        <div className="relative z-10 grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          {/* Content — date, status, quote, actions */}
          <div className="order-2 flex w-full flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
              {formatDayLabel(today, locale)}
            </p>
            <p className="mt-1.5 text-balance text-sm font-semibold text-sprout-700 dark:text-sprout-300 sm:text-base">
              {t(stage.key)}
            </p>
            <figure className="mt-2 max-w-md">
              <blockquote className="text-balance font-sans text-2xl font-bold leading-snug tracking-tight text-ink dark:text-surface sm:text-3xl">
                <span className="text-sprout-400 dark:text-sprout-500">“</span>
                {motivation}
                <span className="text-sprout-400 dark:text-sprout-500">”</span>
              </blockquote>
            </figure>

            {!zen && stats.totalDays > 0 && (
              <p className="mt-4 text-sm font-semibold text-ink-muted dark:text-surface-muted tabular-nums">
                {t("today.monthInline", { pct: stats.completionPct })}
              </p>
            )}

            <div className="mt-6 flex w-full flex-col items-center gap-3 lg:items-start">
              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <HeroPlanner state={state} setState={setState} />
                <button
                  type="button"
                  onClick={scrollToTasks}
                  className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-sprout-200 bg-surface/80 px-4 py-2.5 text-sm font-bold text-ink-muted backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-sprout-300 hover:bg-sprout-50 hover:text-sprout-700 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sprout-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:border-sprout-800 dark:bg-surface-dark-muted/80 dark:text-surface-muted dark:hover:border-sprout-700 dark:hover:bg-sprout-950 dark:hover:text-sprout-300 dark:focus-visible:ring-offset-surface-dark"
                >
                  {t("today.scrollTasks")}
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className="text-sprout-500 transition-transform group-hover:translate-y-0.5 dark:text-sprout-400"
                  />
                </button>
              </div>
              <InstallButton />
            </div>
          </div>

          {!zen && allDone && (
            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              {/* All tasks done — a big, happy, celebrating sprout in a
                  radiant aura, on top of the existing seed-burst. */}
              <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80 lg:h-[22rem] lg:w-[22rem]">
                <span
                  aria-hidden="true"
                  className="complete-rays absolute h-60 w-60 rounded-full blur-md sm:h-72 sm:w-72"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(251,191,36,0), rgba(251,191,36,0.55), rgba(34,197,94,0), rgba(34,197,94,0.5), rgba(251,191,36,0), rgba(251,191,36,0.55), rgba(34,197,94,0))",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="complete-aura absolute h-52 w-52 rounded-full bg-amber-300/55 blur-2xl dark:bg-amber-400/35 sm:h-64 sm:w-64"
                />
                <img
                  src="/sprout-success.png"
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  draggable={false}
                  className="complete-cheer relative h-60 w-60 object-contain drop-shadow-[0_22px_44px_rgba(245,158,11,0.45)] sm:h-72 sm:w-72"
                />
                <div className="absolute -bottom-1 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/95 px-4 py-1.5 text-sm font-bold text-amber-700 shadow-[0_16px_36px_rgba(245,158,11,0.22)] dark:border-amber-800 dark:bg-amber-950/90 dark:text-amber-200">
                  <Sparkles
                    size={15}
                    aria-hidden="true"
                    className="animate-sparkle text-amber-500 dark:text-amber-300"
                  />
                  {t("today.allDone")}
                </div>
              </div>
            </div>
          )}

          {!zen && !allDone && (
            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <div className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
                <span
                  aria-hidden="true"
                  className="absolute h-48 w-48 rounded-full bg-sprout-200/55 blur-3xl dark:bg-sprout-600/25"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-6 top-8 h-16 w-16 rounded-full bg-amber-300/45 blur-2xl dark:bg-amber-500/25"
                />
                <img
                  src={streakMascot}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  draggable={false}
                  className="relative h-48 w-48 object-contain drop-shadow-[0_22px_34px_rgba(22,101,52,0.2)] sm:h-56 sm:w-56"
                  style={{ animation: "streak-float 4.8s ease-in-out infinite" }}
                />
                <div className="absolute right-2 top-7 flex min-h-20 min-w-20 flex-col items-center justify-center rounded-full border border-amber-200 bg-amber-50/95 px-3 text-center shadow-[0_16px_36px_rgba(245,158,11,0.22)] dark:border-amber-800 dark:bg-amber-950/90">
                  <Sparkles
                    size={15}
                    aria-hidden="true"
                    className="mb-0.5 text-amber-500 dark:text-amber-300"
                  />
                  <span className="font-sans text-2xl font-bold leading-none tabular-nums text-amber-600 dark:text-amber-300">
                    {streakDays}
                  </span>
                  <span className="mt-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-200">
                    {t("unit.dayShort")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Tasks — second full-height "page" ────────────────────────── */}
      <section
        id="today-tasks"
        className="flex min-h-[100svh] w-full scroll-mt-16 items-center px-4 py-12 lg:px-8"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
          {/* ── Main: add a task + the task list ─────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Add a task — simple by design: title + time of day. */}
            <div className="rounded-3xl border border-sprout-100 bg-surface p-4 dark:border-sprout-900 dark:bg-surface-dark-muted sm:p-5">
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
                {t("today.addHeading")}
              </h2>
              <form onSubmit={handleAddTask} className="flex flex-col gap-3">
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_12rem_3rem]">
                  <input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder={t("today.addPlaceholder")}
                    aria-label={t("today.newTaskAria")}
                    className="min-w-0 flex-1 rounded-2xl border border-sprout-100 bg-surface px-4 py-3 text-sm text-ink placeholder-ink-subtle transition-colors focus:border-sprout-400 dark:border-sprout-900 dark:bg-surface-dark dark:text-surface dark:placeholder-surface-muted"
                  />
                  <label className="relative min-w-0">
                    <span className="sr-only">{t("slot.assign")}</span>
                    <Clock
                      size={15}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle dark:text-surface-muted"
                    />
                    <select
                      value={newSlot}
                      onChange={(e) =>
                        setNewSlot(e.target.value as Slot | "anytime")
                      }
                      aria-label={t("slot.assign")}
                      className="min-h-[48px] w-full rounded-2xl border border-sprout-100 bg-surface py-3 pl-9 pr-3 text-sm font-semibold text-ink transition-colors focus:border-sprout-400 dark:border-sprout-900 dark:bg-surface-dark dark:text-surface"
                    >
                      <option value="anytime">{t("slot.anytime")}</option>
                      <option value="morning">{t("slot.morning")}</option>
                      <option value="afternoon">{t("slot.afternoon")}</option>
                      <option value="evening">{t("slot.evening")}</option>
                    </select>
                  </label>
                  <button
                    type="submit"
                    aria-label={t("task.addAria")}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl bg-sprout-600 text-white transition-colors hover:bg-sprout-700"
                  >
                    <Plus size={18} aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>

            {/* Task list (grouped by time of day when slots are used) */}
            <div className="flex flex-col gap-4">
              {!skipped && taskIds.length > 0 && (
                <h2 className="text-xs font-medium uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
                  {t("today.tasksHeading")}
                </h2>
              )}
              {skipped ? (
                <div className="animate-pop-in flex flex-col items-center gap-4 rounded-3xl border border-sky-200 bg-gradient-to-b from-sky-50 to-surface px-6 py-10 text-center dark:border-sky-900 dark:from-sky-950/50 dark:to-surface-dark-muted">
                  <span className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full bg-sky-300/35 blur-2xl dark:bg-sky-600/25"
                    />
                    <img
                      src="/sprout-rest.png"
                      alt=""
                      aria-hidden="true"
                      className="h-24 w-24 object-contain"
                      style={{ animation: "streak-float 4.6s ease-in-out infinite" }}
                    />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-sky-800 dark:text-sky-200">
                      {t("today.resting")}
                    </h3>
                    <p className="mx-auto mt-1 max-w-xs text-sm text-sky-700/90 dark:text-sky-300/80">
                      {t("today.restMessage")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setState(setDaySkipped(state, today, false))}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(2,132,199,0.28)] transition-all hover:-translate-y-0.5 hover:bg-sky-700 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-surface-dark"
                  >
                    <Sunrise size={16} aria-hidden="true" />
                    {t("today.resumeDay")}
                  </button>
                </div>
              ) : taskIds.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-sprout-200 py-10 text-center text-ink-subtle dark:border-sprout-900 dark:text-surface-muted">
                  <img
                    src="/sprout-empty.png"
                    alt=""
                    aria-hidden="true"
                    className="mx-auto mb-3 h-20 w-20 object-contain"
                  />
                  <p className="text-sm">{t("today.empty")}</p>
                </div>
              ) : usesSlots ? (
                <div className="flex flex-col gap-5">
                  {SLOT_ORDER.filter((s) => groups[s].length > 0).map((slot) => (
                    <SlotGroup key={slot} slot={slot} t={t}>
                      <ul className="flex flex-col gap-2">
                        {groups[slot].map(renderRow)}
                      </ul>
                    </SlotGroup>
                  ))}
                  {groups.anytime.length > 0 && (
                    <SlotGroup slot="anytime" t={t}>
                      <ul className="flex flex-col gap-2">
                        {groups.anytime.map(renderRow)}
                      </ul>
                    </SlotGroup>
                  )}
                </div>
              ) : (
                <ul className="flex flex-col gap-2">{taskIds.map(renderRow)}</ul>
              )}
            </div>
          </div>

          {/* ── Sidebar: day overview ────────────────────────────────── */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-16">
        {/* Today's progress — live stage mascot + completion. On a fully
            complete day the mascot cheers inside a radiant green/gold glow. */}
        <div
          className={`flex items-center gap-4 rounded-3xl border p-4 transition-colors duration-500 ${
            allDone
              ? "border-amber-200 bg-gradient-to-br from-amber-50 via-sprout-50 to-surface dark:border-amber-900/60 dark:from-amber-950/30 dark:via-sprout-950/40 dark:to-surface-dark-muted"
              : "border-sprout-100 bg-gradient-to-br from-sprout-50 to-surface dark:border-sprout-900 dark:from-sprout-950/40 dark:to-surface-dark-muted"
          }`}
        >
          <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center">
            {allDone ? (
              <>
                <span
                  aria-hidden="true"
                  className="complete-rays absolute h-24 w-24 rounded-full blur-md"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(251,191,36,0), rgba(251,191,36,0.55), rgba(34,197,94,0), rgba(34,197,94,0.5), rgba(251,191,36,0), rgba(251,191,36,0.55), rgba(34,197,94,0))",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="complete-aura absolute h-20 w-20 rounded-full bg-amber-300/55 blur-xl dark:bg-amber-400/35"
                />
              </>
            ) : (
              <span
                aria-hidden="true"
                className="absolute h-16 w-16 rounded-full bg-sprout-300/30 blur-2xl dark:bg-sprout-600/25"
              />
            )}
            <img
              key={`${stage.src}-${allDone}`}
              src={stage.src}
              alt=""
              aria-hidden="true"
              decoding="async"
              className={`relative h-20 w-20 object-contain ${
                allDone
                  ? "complete-cheer drop-shadow-[0_14px_26px_rgba(245,158,11,0.4)]"
                  : "animate-bloom drop-shadow-[0_12px_22px_rgba(22,101,52,0.18)]"
              }`}
              style={
                allDone
                  ? undefined
                  : { animation: "streak-float 4.6s ease-in-out infinite" }
              }
            />
          </div>
          <div
            className="min-w-0 flex-1"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("today.progressAria", { pct })}
          >
            <div className="flex items-baseline justify-between gap-2">
              {!zen && (
                <span
                  className={`font-sans text-5xl font-bold leading-none tracking-tight tabular-nums ${
                    allDone
                      ? "bg-gradient-to-r from-amber-500 to-sprout-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-sprout-400"
                      : "text-ink dark:text-surface"
                  }`}
                >
                  {displayPct}
                  <span
                    className={`align-top text-xl ${
                      allDone
                        ? "text-amber-500 dark:text-amber-400"
                        : "text-sprout-600 dark:text-sprout-400"
                    }`}
                  >
                    %
                  </span>
                </span>
              )}
              {total > 0 && (
                <span className="text-sm font-medium text-ink-muted dark:text-surface-muted tabular-nums">
                  {t("today.count", { done, total })}
                </span>
              )}
            </div>
            {allDone && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400">
                <Sparkles size={15} aria-hidden="true" className="animate-sparkle" />
                {t("today.allDone")}
              </p>
            )}
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sprout-100 dark:bg-sprout-950">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                  allDone
                    ? "bg-gradient-to-r from-amber-400 to-sprout-500"
                    : "bg-gradient-to-r from-sprout-400 to-sprout-600"
                }`}
                style={{ width: `${Math.max(pct, total === 0 ? 0 : 4)}%` }}
              />
            </div>
          </div>
        </div>

        {/* This week */}
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
                    role="img"
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

        {/* Need a break? — quiet rest-day entry point (hidden while resting) */}
        {!skipped && (
          <div className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 dark:border-sky-950 dark:bg-sky-950/30">
            <img
              src="/sprout-rest.png"
              alt=""
              aria-hidden="true"
              className="h-11 w-11 flex-shrink-0 object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink dark:text-surface">
                {t("today.restPromptTitle")}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted dark:text-surface-muted">
                {t("today.restPromptDesc")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setState(setDaySkipped(state, today, true))}
              className="inline-flex min-h-[40px] flex-shrink-0 items-center gap-1.5 rounded-full border border-sky-300 bg-surface px-3.5 py-2 text-sm font-bold text-sky-700 transition-all hover:-translate-y-0.5 hover:bg-sky-100 active:translate-y-0 dark:border-sky-800 dark:bg-surface-dark-muted dark:text-sky-300 dark:hover:bg-sky-950"
            >
              <Moon size={15} aria-hidden="true" />
              {t("today.skipRest")}
            </button>
          </div>
        )}

        {/* Daily note */}
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
            {t("note.title")}
          </span>
          <textarea
            value={log.note ?? ""}
            onChange={(e) => setState(setDayNote(state, today, e.target.value))}
            placeholder={t("note.placeholder")}
            rows={3}
            className="resize-none rounded-2xl border border-sprout-100 bg-surface px-4 py-3 text-sm text-ink placeholder-ink-subtle transition-colors focus:border-sprout-400 dark:border-sprout-900 dark:bg-surface-dark-muted dark:text-surface dark:placeholder-surface-muted"
          />
        </label>

        </aside>
        </div>
      </section>
    </div>
  );
}

function SlotGroup({
  slot,
  t,
  children,
}: {
  slot: Slot | "anytime";
  t: TFn;
  children: React.ReactNode;
}) {
  const Icon = slot === "anytime" ? Clock : SLOT_ICON[slot];
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-ink-muted dark:text-surface-muted">
        <Icon size={16} aria-hidden="true" />
        <h3 className="text-sm font-semibold">{t(`slot.${slot}`)}</h3>
      </div>
      {children}
    </div>
  );
}
