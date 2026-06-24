import {
  AppState,
  FinancialRecord,
  GoalConfig,
  GoalRecord,
  Task,
  WeightRecord,
  getDayLog,
  isFutureDate,
  normalizeGoalType,
} from "./store";
import { todayISO } from "./dates";

export type FinancialDayRow = {
  date: string;
  income: number;
  expense: number;
  net: number;
  balance: number;
  note?: string;
};

export type WeightDayRow = {
  date: string;
  value: number;
  note?: string;
};

export type MonthlyFinancialSummary = {
  month: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  daysLogged: number;
  trend: { date: string; balance: number }[];
};

export type GoalMeta = {
  task: Task;
  type: "financial" | "weight";
  title: string;
  config: GoalConfig;
};

/** Strip legacy emoji/text prefixes from auto-generated goal task titles. */
export function cleanGoalTaskTitle(title: string): string {
  return title
    .replace(/^[💰⚖️]\s*/, "")
    .replace(/^(Track|Weigh-in):\s*/i, "")
    .trim();
}

export function getGoalMeta(task: Task): GoalMeta | null {
  if (!task.goalType || !task.goalConfig) return null;
  const type = normalizeGoalType(task.goalType);
  if (!type) return null;
  return {
    task,
    type,
    title: task.goalTitle ?? cleanGoalTaskTitle(task.title),
    config: task.goalConfig,
  };
}

function isFinancialRecord(r: GoalRecord): r is FinancialRecord {
  return r.type === "financial";
}

function isWeightRecord(r: GoalRecord): r is WeightRecord {
  return r.type === "weight";
}

/** Collect all records for a goal task, sorted by date. */
export function getGoalRecords(
  state: AppState,
  taskId: string,
): { date: string; record: GoalRecord }[] {
  const rows: { date: string; record: GoalRecord }[] = [];
  for (const [date, log] of Object.entries(state.days)) {
    if (isFutureDate(date)) continue;
    const record = log.goalRecords?.[taskId];
    if (record) rows.push({ date, record });
    else {
      const legacy = log.goalEntries?.[taskId];
      if (typeof legacy === "number") {
        const task = state.tasks[taskId];
        const type = normalizeGoalType(task?.goalType);
        if (type === "weight") {
          rows.push({
            date,
            record: { type: "weight", value: legacy },
          });
        } else if (type === "financial") {
          rows.push({
            date,
            record: { type: "financial", income: legacy, expense: 0 },
          });
        }
      }
    }
  }
  return rows.sort((a, b) => a.date.localeCompare(b.date));
}

export function getFinancialRows(
  state: AppState,
  taskId: string,
): FinancialDayRow[] {
  const task = state.tasks[taskId];
  const config = task?.goalConfig;
  const starting =
    config && "startingBalance" in config
      ? (config.startingBalance ?? 0)
      : 0;
  let balance = starting;
  return getGoalRecords(state, taskId)
    .filter((row): row is { date: string; record: FinancialRecord } =>
      isFinancialRecord(row.record),
    )
    .map(({ date, record }) => {
      const net = record.income - record.expense;
      balance += net;
      return {
        date,
        income: record.income,
        expense: record.expense,
        net,
        balance,
        note: record.note,
      };
    });
}

export function getWeightRows(state: AppState, taskId: string): WeightDayRow[] {
  return getGoalRecords(state, taskId)
    .filter((row): row is { date: string; record: WeightRecord } =>
      isWeightRecord(row.record),
    )
    .map(({ date, record }) => ({
      date,
      value: record.value,
      note: record.note,
    }));
}

export function getMonthlyFinancialSummary(
  state: AppState,
  taskId: string,
  month: string,
): MonthlyFinancialSummary {
  const rows = getFinancialRows(state, taskId).filter((r) =>
    r.date.startsWith(month),
  );
  const totalIncome = rows.reduce((s, r) => s + r.income, 0);
  const totalExpense = rows.reduce((s, r) => s + r.expense, 0);
  return {
    month,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    daysLogged: rows.length,
    trend: rows.map((r) => ({ date: r.date, balance: r.balance })),
  };
}

export function getCurrentBalance(state: AppState, taskId: string): number {
  const rows = getFinancialRows(state, taskId);
  if (rows.length > 0) return rows[rows.length - 1].balance;
  const task = state.tasks[taskId];
  const config = task?.goalConfig;
  if (config && "startingBalance" in config) {
    return config.startingBalance ?? 0;
  }
  return 0;
}

export function getLatestWeight(state: AppState, taskId: string): number | undefined {
  const rows = getWeightRows(state, taskId);
  return rows.length > 0 ? rows[rows.length - 1].value : undefined;
}

export function isWeightDue(
  state: AppState,
  taskId: string,
  date = todayISO(),
): boolean {
  const task = state.tasks[taskId];
  const config = task?.goalConfig;
  const every =
    config && "checkEveryDays" in config ? config.checkEveryDays ?? 7 : 7;
  const rows = getWeightRows(state, taskId);
  if (rows.length === 0) return true;
  const last = rows[rows.length - 1].date;
  const days = daysBetween(last, date);
  return days >= every;
}

export function nextWeightCheckDate(
  state: AppState,
  taskId: string,
): string | undefined {
  const task = state.tasks[taskId];
  const config = task?.goalConfig;
  const every =
    config && "checkEveryDays" in config ? config.checkEveryDays ?? 7 : 7;
  const rows = getWeightRows(state, taskId);
  if (rows.length === 0) return todayISO();
  const last = rows[rows.length - 1].date;
  return addDaysISO(last, every);
}

function daysBetween(start: string, end: string): number {
  const a = new Date(start + "T00:00:00").getTime();
  const b = new Date(end + "T00:00:00").getTime();
  return Math.round((b - a) / 86_400_000);
}

function addDaysISO(date: string, days: number): string {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatMoney(value: number, currency = "THB"): string {
  const formatted = Number.isInteger(value)
    ? value.toLocaleString()
    : value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return `${formatted} ${currency}`;
}

export function formatWeight(value: number, unit = "kg"): string {
  return `${Number.isInteger(value) ? value : value.toFixed(1)} ${unit}`;
}

/** Progress toward financial target (0–100). */
export function financialProgressPercent(
  state: AppState,
  taskId: string,
): number {
  const task = state.tasks[taskId];
  const target = task?.goalConfig?.target ?? 0;
  if (target <= 0) return 0;
  const balance = getCurrentBalance(state, taskId);
  return Math.min(100, Math.max(0, Math.round((balance / target) * 100)));
}

/** Progress toward weight target (0–100). */
export function weightProgressPercent(state: AppState, taskId: string): number {
  const task = state.tasks[taskId];
  const config = task?.goalConfig;
  if (!config || !("target" in config)) return 0;
  const target = config.target;
  const rows = getWeightRows(state, taskId);
  const start =
    config && "start" in config && typeof config.start === "number"
      ? config.start
      : rows[0]?.value;
  const current = rows[rows.length - 1]?.value ?? start;
  if (start === undefined || current === undefined) return 0;
  const direction =
    config && "direction" in config && config.direction
      ? config.direction
      : target < start
        ? "loss"
        : "gain";
  const total = Math.abs(start - target);
  if (total <= 0) return 0;
  const moved =
    direction === "loss" ? start - current : current - start;
  return Math.max(0, Math.min(100, Math.round((moved / total) * 100)));
}

export function getRecordForDate(
  state: AppState,
  taskId: string,
  date: string,
): GoalRecord | undefined {
  return getDayLog(state, date).goalRecords?.[taskId];
}
