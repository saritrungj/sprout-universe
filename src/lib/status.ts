import {
  AppState,
  GoalType,
  MoodKey,
  Task,
  getDayLog,
  getDayTaskIds,
  isFutureDate,
  normalizeGoalType,
} from "./store";
import {
  getCurrentBalance,
  getFinancialRows,
  getWeightRows,
  cleanGoalTaskTitle,
} from "./goals";
import { todayISO, buildHeatmapDates, buildMonthGrid } from "./dates";

export type DayStatus =
  | "complete"
  | "missed"
  | "in-progress"
  | "neutral"
  | "rest";

/** Single source of truth for status → Tailwind class mappings. */
export const statusStyles = {
  complete: {
    bg: "bg-sprout-500",
    bgLight: "bg-sprout-50 dark:bg-sprout-950",
    border: "border-sprout-200 dark:border-sprout-800",
    ring: "ring-2 ring-sprout-300 dark:ring-sprout-600",
    text: "text-white",
    badge: "bg-sprout-500 text-white",
    stamp: "bg-sprout-500 text-white shadow-sm",
  },
  "in-progress": {
    bg: "bg-amber-300 dark:bg-amber-700",
    bgLight: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-200 dark:border-amber-800",
    ring: "ring-2 ring-amber-300",
    text: "text-amber-900 dark:text-amber-100",
    badge: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200",
    stamp: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  },
  missed: {
    bg: "bg-red-300 dark:bg-red-800",
    bgLight: "bg-red-50 dark:bg-red-950",
    border: "border-red-200 dark:border-red-800",
    ring: "ring-2 ring-red-300",
    text: "text-red-700 dark:text-red-300",
    badge: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
    stamp: "bg-red-100 dark:bg-red-950 text-red-500 dark:text-red-400",
  },
  neutral: {
    bg: "bg-surface-muted dark:bg-surface-dark-muted",
    bgLight: "bg-transparent",
    border: "border-sprout-100 dark:border-sprout-900",
    ring: "",
    text: "text-ink-muted dark:text-surface-muted",
    badge: "bg-surface-muted dark:bg-surface-dark-muted text-ink-muted",
    stamp: "",
  },
  rest: {
    bg: "bg-sky-200 dark:bg-sky-900",
    bgLight: "bg-sky-50 dark:bg-sky-950",
    border: "border-sky-200 dark:border-sky-800",
    ring: "ring-2 ring-sky-300 dark:ring-sky-700",
    text: "text-sky-700 dark:text-sky-300",
    badge: "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300",
    stamp: "bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300",
  },
} satisfies Record<DayStatus, Record<string, string>>;

export function getDayStatus(state: AppState, date: string): DayStatus {
  const today = todayISO();
  const log = getDayLog(state, date);
  if (log.skipped) return "rest";
  const taskIds = getDayTaskIds(state, date);
  if (taskIds.length === 0) return "neutral";
  if (date > today) return "neutral";

  const allDone = taskIds.every((id) => log.done[id]);

  if (allDone) return "complete";
  if (date === today) return "in-progress";
  return "missed";
}

export function getCompletionRatio(state: AppState, date: string): number {
  if (getDayLog(state, date).skipped) return 0;
  const taskIds = getDayTaskIds(state, date);
  if (taskIds.length === 0) return 0;
  const log = getDayLog(state, date);
  const done = taskIds.filter((id) => log.done[id]).length;
  return done / taskIds.length;
}

export type StreakInfo = { current: number; best: number };

export function getStreak(state: AppState): StreakInfo {
  const today = todayISO();
  let current = 0;
  let best = 0;
  let streak = 0;
  let d = new Date(today);

  // Walk backwards day by day until we hit neutral or missed
  while (true) {
    const dateStr = d.toISOString().slice(0, 10);
    const status = getDayStatus(state, dateStr);
    if (status === "complete") {
      streak++;
      if (streak > best) best = streak;
    } else if (status === "rest") {
      d.setDate(d.getDate() - 1);
      continue;
    } else if (status === "in-progress" && dateStr === today) {
      // today not yet done — still counts toward potential streak
      d.setDate(d.getDate() - 1);
      continue;
    } else {
      break;
    }
    d.setDate(d.getDate() - 1);
  }
  current = streak;

  // Scan all history for best streak (if best from current walk isn't already from history)
  // Find all complete days and compute longest run
  const allDates = Object.keys(state.days).sort();
  let runBest = 0;
  let run = 0;
  let prev = "";
  for (const date of allDates) {
    const status = getDayStatus(state, date);
    if (status === "rest") {
      prev = date;
      continue;
    }
    if (status === "complete") {
      if (prev) {
        const prevD = new Date(prev);
        const curD = new Date(date);
        const diff = (curD.getTime() - prevD.getTime()) / 86400000;
        if (diff === 1) {
          run++;
        } else {
          run = 1;
        }
      } else {
        run = 1;
      }
      if (run > runBest) runBest = run;
      prev = date;
    } else {
      prev = "";
      run = 0;
    }
  }
  best = Math.max(current, runBest);

  return { current, best };
}

export type MonthStats = {
  completionPct: number;
  greenDays: number;
  totalDays: number;
  tasksCompleted: number;
  restDays: number;
};

export function getMonthStats(state: AppState, month: string): MonthStats {
  const today = todayISO();
  const grid = buildMonthGrid(month);
  const dates = grid
    .flat()
    .filter((d): d is string => d !== null && d <= today);
  let green = 0,
    tasksCompleted = 0,
    counted = 0,
    restDays = 0;
  for (const date of dates) {
    if (getDayLog(state, date).skipped) {
      restDays++;
      continue;
    }
    const taskIds = getDayTaskIds(state, date);
    if (taskIds.length === 0) continue;
    counted++;
    const log = getDayLog(state, date);
    const done = taskIds.filter((id) => log.done[id]).length;
    tasksCompleted += done;
    if (taskIds.every((id) => log.done[id])) green++;
  }
  return {
    completionPct: counted === 0 ? 0 : Math.round((green / counted) * 100),
    greenDays: green,
    totalDays: counted,
    tasksCompleted,
    restDays,
  };
}

/* ── Focus & mood summaries — power the dashboard wellbeing cards ───────── */

export type FocusStats = {
  minutesToday: number;
  minutesThisMonth: number;
  sessionsThisMonth: number;
  minutesAllTime: number;
};

export function getFocusStats(state: AppState): FocusStats {
  const today = todayISO();
  const month = today.slice(0, 7);
  let minutesToday = 0;
  let minutesThisMonth = 0;
  let sessionsThisMonth = 0;
  let minutesAllTime = 0;
  for (const session of state.focusSessions) {
    if (session.mode !== "focus") continue;
    minutesAllTime += session.minutes;
    if (session.startedAt.startsWith(month)) {
      minutesThisMonth += session.minutes;
      sessionsThisMonth++;
    }
    if (session.startedAt.startsWith(today)) minutesToday += session.minutes;
  }
  return { minutesToday, minutesThisMonth, sessionsThisMonth, minutesAllTime };
}

export type MoodSummary = {
  daysLogged: number;
  avgEnergy: number;
  topMood?: MoodKey;
  /** Up to the last 7 logged check-ins, oldest first. */
  trend: { date: string; energy: number; mood: MoodKey }[];
};

export function getMoodSummary(state: AppState): MoodSummary {
  const month = todayISO().slice(0, 7);
  const entries = Object.values(state.moodLogs)
    .filter((log) => log.date.startsWith(month))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (entries.length === 0) {
    return { daysLogged: 0, avgEnergy: 0, trend: [] };
  }
  const energySum = entries.reduce((sum, log) => sum + log.energy, 0);
  const counts = new Map<MoodKey, number>();
  for (const log of entries) {
    counts.set(log.mood, (counts.get(log.mood) ?? 0) + 1);
  }
  let topMood: MoodKey | undefined;
  let topCount = 0;
  for (const [mood, count] of counts) {
    if (count > topCount) {
      topCount = count;
      topMood = mood;
    }
  }
  return {
    daysLogged: entries.length,
    avgEnergy: Math.round((energySum / entries.length) * 10) / 10,
    topMood,
    trend: entries
      .slice(-7)
      .map((log) => ({ date: log.date, energy: log.energy, mood: log.mood })),
  };
}

/** Count of days the user logged at least one completed task. */
export function getDaysTended(state: AppState): number {
  return Object.values(state.days).filter((log) =>
    Object.values(log.done).some(Boolean),
  ).length;
}

export type HeatmapCell = {
  date: string;
  ratio: number;
  status: DayStatus;
  counted?: boolean;
};

export function getHeatmapData(state: AppState, weeks = 26): HeatmapCell[] {
  return getConsistencyData(state, weeks);
}

export function isFutureDateStatus(date: string): boolean {
  return isFutureDate(date);
}

export function getConsistencyData(
  state: AppState,
  weeks = 26,
): HeatmapCell[] {
  return buildHeatmapDates(weeks).map((date) => {
    const status = getDayStatus(state, date);
    const taskIds = getDayTaskIds(state, date);
    const counted =
      !isFutureDate(date) && status !== "rest" && taskIds.length > 0;
    return {
      date,
      ratio: counted ? getCompletionRatio(state, date) : 0,
      status,
      counted,
    };
  });
}

export type GoalProgress = {
  taskId: string;
  title: string;
  type: "financial" | "weight";
  current: number;
  target: number;
  percent: number;
  remaining: number;
  pacePerDay?: number;
  forecastDate?: string;
  trend: { date: string; value: number }[];
  latestDate?: string;
  nextCheckDate?: string;
  needsMoreData?: boolean;
  reached?: boolean;
};

export function getRecommendedReminderTime(state: AppState): string {
  const minutes = Object.values(state.days)
    .flatMap((log) => Object.values(log.doneAt ?? {}))
    .map((iso) => new Date(iso))
    .filter((date) => Number.isFinite(date.getTime()))
    .slice(-14)
    .map((date) => date.getHours() * 60 + date.getMinutes());
  if (minutes.length < 3) return state.settings.reminders.time || "20:00";
  const avg = Math.round(
    minutes.reduce((sum, value) => sum + value, 0) / minutes.length,
  );
  return `${String(Math.floor(avg / 60)).padStart(2, "0")}:${String(
    avg % 60,
  ).padStart(2, "0")}`;
}

function goalDisplayTitle(task: Task): string {
  return task.goalTitle ?? cleanGoalTaskTitle(task.title);
}

export function getGoalProgress(state: AppState): GoalProgress[] {
  return Object.values(state.tasks)
    .filter(
      (task): task is Task & {
        goalType: GoalType;
        goalConfig: { target: number; checkEveryDays?: number };
      } => !!task.goalType && !!task.goalConfig,
    )
    .map((task) => {
      const kind = normalizeGoalType(task.goalType)!;
      const target = task.goalConfig?.target ?? 0;
      const title = goalDisplayTitle(task);

      if (kind === "financial") {
        const finRows = getFinancialRows(state, task.id);
        const netEntries = finRows.map((row) => ({
          date: row.date,
          value: row.net,
        }));
        const current = getCurrentBalance(state, task.id);
        const remaining = Math.max(0, target - current);
        const pacePerDay = savingsPacePerDay(netEntries);
        const forecastDate =
          remaining <= 0
            ? finRows[finRows.length - 1]?.date
            : pacePerDay
              ? addDaysISO(
                  finRows[finRows.length - 1]?.date ?? todayISO(),
                  Math.ceil(remaining / pacePerDay),
                )
              : undefined;
        return {
          taskId: task.id,
          title,
          type: "financial" as const,
          current,
          target,
          remaining,
          percent:
            target > 0
              ? Math.min(100, Math.round((current / target) * 100))
              : 0,
          pacePerDay,
          forecastDate,
          trend: finRows.map((row) => ({ date: row.date, value: row.balance })),
          latestDate: finRows[finRows.length - 1]?.date,
          needsMoreData: finRows.length < 2 && remaining > 0,
          reached: target > 0 && current >= target,
        };
      }

      const entries = getWeightRows(state, task.id).map((row) => ({
        date: row.date,
        value: row.value,
      }));
      const latest = entries[entries.length - 1];
      const start =
        "start" in task.goalConfig && typeof task.goalConfig.start === "number"
          ? task.goalConfig.start
          : entries[0]?.value;
      const direction =
        "direction" in task.goalConfig && task.goalConfig.direction
          ? task.goalConfig.direction
          : start !== undefined && target < start
            ? "loss"
            : "gain";
      const current = latest?.value ?? start ?? 0;
      const totalChange =
        start !== undefined ? Math.abs(start - target) : Math.abs(current - target);
      const moved =
        start !== undefined
          ? direction === "loss"
            ? start - current
            : current - start
          : 0;
      const remaining =
        direction === "loss"
          ? Math.max(0, current - target)
          : Math.max(0, target - current);
      const pacePerDay = weightPacePerDay(entries, direction);
      const forecastDate =
        remaining <= 0
          ? latest?.date
          : pacePerDay
            ? addDaysISO(latest?.date ?? todayISO(), Math.ceil(remaining / pacePerDay))
            : undefined;
      const checkEveryDays =
        "checkEveryDays" in task.goalConfig
          ? task.goalConfig.checkEveryDays
          : undefined;
      return {
        taskId: task.id,
        title,
        type: "weight" as const,
        current,
        target,
        remaining,
        percent:
          totalChange > 0
            ? Math.max(0, Math.min(100, Math.round((moved / totalChange) * 100)))
            : 0,
        pacePerDay,
        forecastDate,
        trend: entries,
        latestDate: latest?.date,
        needsMoreData: entries.length < 2 && remaining > 0,
        reached: remaining <= 0 && entries.length > 0,
        nextCheckDate:
          latest && checkEveryDays
            ? addDaysISO(latest.date, checkEveryDays)
            : undefined,
      };
    });
}

function savingsPacePerDay(entries: { date: string; value: number }[]): number | undefined {
  if (entries.length < 2) return undefined;
  const first = entries[0];
  const latest = entries[entries.length - 1];
  const days = Math.max(1, daysBetween(first.date, latest.date));
  const total = entries.reduce((sum, entry) => sum + entry.value, 0);
  return total > 0 ? total / days : undefined;
}

function weightPacePerDay(
  entries: { date: string; value: number }[],
  direction: "loss" | "gain",
): number | undefined {
  if (entries.length < 2) return undefined;
  const first = entries[0];
  const latest = entries[entries.length - 1];
  const days = Math.max(1, daysBetween(first.date, latest.date));
  const delta =
    direction === "loss" ? first.value - latest.value : latest.value - first.value;
  return delta > 0 ? delta / days : undefined;
}

function daysBetween(start: string, end: string): number {
  const a = new Date(start + "T00:00:00").getTime();
  const b = new Date(end + "T00:00:00").getTime();
  return Math.round((b - a) / 86400000);
}

function addDaysISO(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(year, month - 1, day + days);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(next.getDate()).padStart(2, "0")}`;
}

export { isFutureDate };
