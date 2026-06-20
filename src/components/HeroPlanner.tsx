import { useMemo, useState } from "react";
import {
  Sparkles,
  Loader2,
  Plus,
  Check,
  X,
  Sunrise,
  Sun,
  Moon,
  CalendarRange,
  Repeat2,
  Trash2,
} from "lucide-react";
import { AppState, Slot, addDayTask, addMonthTask, getDayTaskIds } from "../lib/store";
import { currentMonth, formatMonthLabel, nextMonth, todayISO } from "../lib/dates";
import {
  MonthlyPlan,
  MonthlyPlanMonth,
  ParsedAITask,
  getGeminiConfig,
  requestGeminiMonthlyPlan,
  requestGeminiTasks,
} from "../lib/ai";
import { useT } from "../lib/i18n";

type Props = {
  state: AppState;
  setState: (s: AppState) => void;
};

type Mode = "day" | "month";

const SLOT_ICON: Record<Slot, typeof Sun> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Moon,
};

const MONTH_OPTIONS = [1, 2, 3, 6, 12];

/* Persist the generated roadmap so a multi-month plan survives a refresh. */
const PLAN_KEY = "sprout-planner:aiplan";
type SavedPlan = { months: number; plan: MonthlyPlan };

function loadSavedPlan(): SavedPlan | null {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    return raw ? (JSON.parse(raw) as SavedPlan) : null;
  } catch {
    return null;
  }
}

function saveSavedPlan(p: SavedPlan | null) {
  try {
    if (p) localStorage.setItem(PLAN_KEY, JSON.stringify(p));
    else localStorage.removeItem(PLAN_KEY);
  } catch {
    /* ignore storage errors */
  }
}

/**
 * Hero "Plan with AI" widget. Two modes, both powered by Google Gemini
 * (free tier, configured via VITE_GEMINI_API_KEY):
 *  - Today: turn a goal into a few tasks for today.
 *  - Monthly: build a progressive month-by-month roadmap toward a bigger goal,
 *    then drop each month's tasks into the matching month plan.
 */
export default function HeroPlanner({ state, setState }: Props) {
  const { t, lang } = useT();
  const saved = useMemo(loadSavedPlan, []);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("day");
  const [goal, setGoal] = useState("");
  const [months, setMonths] = useState<number>(saved?.months ?? 3);
  const [tasks, setTasks] = useState<ParsedAITask[]>([]);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [plan, setPlan] = useState<MonthlyPlan | null>(saved?.plan ?? null);
  const [addedMonths, setAddedMonths] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const configured = !!getGeminiConfig().apiKey;
  const today = todayISO();

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!goal.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      if (mode === "day") {
        setTasks([]);
        setAdded(new Set());
        const existing = getDayTaskIds(state, today)
          .map((id) => state.tasks[id]?.title)
          .filter((title): title is string => !!title);
        const result = await requestGeminiTasks({
          goal,
          language: lang,
          date: today,
          existingTasks: existing,
        });
        if (result.length === 0) setError(t("plan.empty"));
        setTasks(result);
      } else {
        const result = await requestGeminiMonthlyPlan({
          goal,
          months,
          language: lang,
          date: today,
        });
        if (result.months.length === 0) {
          setError(t("plan.empty"));
          setPlan(null);
          saveSavedPlan(null);
        } else {
          setPlan(result);
          setAddedMonths(new Set());
          saveSavedPlan({ months, plan: result });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("ai.error"));
    } finally {
      setLoading(false);
    }
  }

  function add(task: ParsedAITask) {
    const [next, id] = addDayTask(state, today, task.title, { slot: task.slot });
    if (!id) return;
    setState(next);
    setAdded((prev) => new Set(prev).add(task.title));
  }

  function addAll() {
    let next = state;
    const nextAdded = new Set(added);
    for (const task of tasks) {
      if (nextAdded.has(task.title)) continue;
      const [s, id] = addDayTask(next, today, task.title, { slot: task.slot });
      if (id) {
        next = s;
        nextAdded.add(task.title);
      }
    }
    setState(next);
    setAdded(nextAdded);
  }

  /* Drop a month's tasks into the matching monthly task set. */
  function applyMonth(idx: number, m: MonthlyPlanMonth) {
    let next = state;
    const targetMonth = addMonths(currentMonth(), idx);
    for (const task of m.tasks) {
      const [s, id] = addMonthTask(next, targetMonth, task.title, task.slot);
      if (id) next = s;
    }
    setState(next);
    setAddedMonths((prev) => new Set(prev).add(idx));
  }

  function clearPlan() {
    setPlan(null);
    setAddedMonths(new Set());
    saveSavedPlan(null);
  }

  const remaining = tasks.filter((task) => !added.has(task.title)).length;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-ai-glow group relative inline-flex min-h-[44px] items-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-sprout-500 via-sprout-600 to-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sprout-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-surface-dark"
      >
        <span
          aria-hidden="true"
          className="ai-shimmer pointer-events-none absolute inset-0"
        />
        <Sparkles
          size={16}
          aria-hidden="true"
          className="animate-sparkle relative drop-shadow-[0_1px_4px_rgba(255,255,255,0.6)]"
        />
        <span className="relative">{t("plan.cta")}</span>
      </button>
    );
  }

  return (
    <div
      className={`animate-pop-in w-full rounded-3xl border border-sprout-100 bg-surface/95 p-4 text-left shadow-[0_24px_48px_rgba(22,101,52,0.16)] backdrop-blur-md dark:border-sprout-900 dark:bg-surface-dark-muted/95 ${
        mode === "month" ? "max-w-lg" : "max-w-md"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-ink dark:text-surface">
          <Sparkles
            size={16}
            className="animate-sparkle text-sprout-600 dark:text-sprout-400"
            aria-hidden="true"
          />
          {t("plan.title")}
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("plan.close")}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-subtle hover:bg-surface-muted hover:text-ink dark:text-surface-muted dark:hover:bg-surface-dark dark:hover:text-surface"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Mode toggle */}
      <div className="mb-3 inline-flex rounded-full border border-sprout-100 bg-surface-muted p-1 dark:border-sprout-900 dark:bg-surface-dark">
        <ModeButton
          active={mode === "day"}
          onClick={() => setMode("day")}
          icon={<Sun size={14} aria-hidden="true" />}
          label={t("plan.modeDay")}
        />
        <ModeButton
          active={mode === "month"}
          onClick={() => setMode("month")}
          icon={<CalendarRange size={14} aria-hidden="true" />}
          label={t("plan.modeMonth")}
        />
      </div>

      {configured ? (
        <form onSubmit={generate} className="flex flex-col gap-2">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate(e);
            }}
            placeholder={
              mode === "day" ? t("plan.placeholder") : t("plan.roadmapPlaceholder")
            }
            rows={3}
            autoFocus
            className="resize-none rounded-2xl border border-sprout-100 bg-surface-muted px-3 py-2.5 text-sm text-ink placeholder-ink-subtle transition-colors focus:border-sprout-400 focus:outline-none focus:ring-2 focus:ring-sprout-200 dark:border-sprout-900 dark:bg-surface-dark dark:text-surface dark:placeholder-surface-muted dark:focus:ring-sprout-900"
          />
          {mode === "month" && (
            <label className="flex items-center gap-2 text-xs font-medium text-ink-subtle dark:text-surface-muted">
              {t("plan.monthsLabel")}
              <select
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="min-h-[40px] rounded-xl border border-sprout-100 bg-surface px-3 py-2 text-sm font-semibold text-ink focus:border-sprout-400 dark:border-sprout-900 dark:bg-surface-dark dark:text-surface"
              >
                {MONTH_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {t("plan.monthsUnit", { n })}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            type="submit"
            disabled={loading || !goal.trim()}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-sprout-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-sprout-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-sprout-300 disabled:active:scale-100"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles size={16} aria-hidden="true" />
            )}
            {mode === "day" ? t("plan.generate") : t("plan.generateRoadmap")}
          </button>
        </form>
      ) : (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {t("plan.needsKey")}
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {/* Today suggestions */}
      {mode === "day" && tasks.length > 0 && (
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
              {t("plan.suggestions")}
            </span>
            {remaining > 0 && (
              <button
                type="button"
                onClick={addAll}
                className="text-xs font-bold text-sprout-700 hover:underline dark:text-sprout-300"
              >
                {t("plan.addAll")}
              </button>
            )}
          </div>
          <ul className="flex flex-col gap-2">
            {tasks.map((task, i) => {
              const isAdded = added.has(task.title);
              const Icon = task.slot ? SLOT_ICON[task.slot] : null;
              return (
                <li
                  key={task.title}
                  style={{ "--i": i } as React.CSSProperties}
                  className="animate-rise flex items-center gap-3 rounded-2xl border border-sprout-100 bg-surface-muted px-3 py-2 transition-colors hover:border-sprout-300 dark:border-sprout-950 dark:bg-surface-dark dark:hover:border-sprout-700"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink dark:text-surface">
                      {task.title}
                    </p>
                    {task.slot && (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-subtle dark:text-surface-muted">
                        {Icon && <Icon size={12} aria-hidden="true" />}
                        {t(`slot.${task.slot}`)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => add(task)}
                    disabled={isAdded}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition-all active:scale-95 ${
                      isAdded
                        ? "cursor-default bg-sprout-100 text-sprout-700 dark:bg-sprout-950 dark:text-sprout-300"
                        : "bg-sprout-600 text-white hover:bg-sprout-700"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={15} aria-hidden="true" className="animate-bloom" />
                        {t("plan.added")}
                      </>
                    ) : (
                      <>
                        <Plus size={15} aria-hidden="true" />
                        {t("ai.addTask")}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Monthly roadmap */}
      {mode === "month" && plan && plan.months.length > 0 && (
        <div className="mt-3">
          {plan.overview && (
            <p className="mb-2 rounded-2xl bg-sprout-50 px-3 py-2 text-sm font-medium text-sprout-800 dark:bg-sprout-950/50 dark:text-sprout-200">
              {plan.overview}
            </p>
          )}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
              {t("plan.roadmap")}
            </span>
            <button
              type="button"
              onClick={clearPlan}
              className="inline-flex items-center gap-1 text-xs font-bold text-ink-subtle hover:text-red-500 dark:text-surface-muted dark:hover:text-red-400"
            >
              <Trash2 size={13} aria-hidden="true" />
              {t("plan.clear")}
            </button>
          </div>
          <ol className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1">
            {plan.months.map((m, i) => {
              const isAdded = addedMonths.has(i);
              return (
                <li
                  key={i}
                  style={{ "--i": i } as React.CSSProperties}
                  className="animate-rise rounded-2xl border border-sprout-100 bg-surface-muted p-3 dark:border-sprout-950 dark:bg-surface-dark"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sprout-100 px-2 py-0.5 text-[11px] font-bold text-sprout-700 dark:bg-sprout-950 dark:text-sprout-300">
                        {t("plan.monthLabel", { n: i + 1 })}
                      </span>
                      <span className="ml-2 text-[11px] font-semibold text-ink-subtle dark:text-surface-muted">
                        {formatMonthLabel(addMonths(currentMonth(), i), lang)}
                      </span>
                      <p className="mt-1.5 text-sm font-semibold text-ink dark:text-surface">
                        {m.focus}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => applyMonth(i, m)}
                      disabled={isAdded || m.tasks.length === 0}
                      className={`inline-flex min-h-[36px] flex-shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all active:scale-95 disabled:active:scale-100 ${
                        isAdded
                          ? "cursor-default bg-sprout-100 text-sprout-700 dark:bg-sprout-950 dark:text-sprout-300"
                          : "bg-sprout-600 text-white hover:bg-sprout-700 disabled:bg-sprout-300"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} aria-hidden="true" className="animate-bloom" />
                          {t("plan.monthAdded")}
                        </>
                      ) : (
                        <>
                          <Repeat2 size={14} aria-hidden="true" />
                          {t("plan.applyMonth")}
                        </>
                      )}
                    </button>
                  </div>
                  {m.tasks.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {m.tasks.map((task) => (
                        <li
                          key={task.title}
                          className="rounded-lg bg-surface px-2 py-1 text-xs text-ink-muted dark:bg-surface-dark-muted dark:text-surface-muted"
                        >
                          {task.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}

function addMonths(month: string, offset: number): string {
  let next = month;
  for (let i = 0; i < offset; i += 1) next = nextMonth(next);
  return next;
}

function ModeButton({
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
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
        active
          ? "bg-surface text-sprout-700 shadow-sm dark:bg-surface-dark-muted dark:text-sprout-300"
          : "text-ink-subtle dark:text-surface-muted"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
