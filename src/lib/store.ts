import { todayISO } from "./dates";

/** Optional time-of-day grouping for a task. */
export type Slot = "morning" | "afternoon" | "evening";

export type Task = {
  id: string;
  title: string;
  createdAt: string;
  slot?: Slot;
  isTemplate?: boolean;
  goalType?: GoalType;
  goalConfig?: GoalConfig;
  subtasks?: Subtask[];
  recurrence?: Recurrence;
};

export type GoalType = "savings" | "weight";
export type Subtask = { id: string; title: string };
export type Recurrence =
  | { type: "daily" }
  | { type: "weekly"; weekdays: number[] };
export type WeightDirection = "loss" | "gain";

export type GoalConfig =
  | { target: number }
  | {
      target: number;
      checkEveryDays?: number;
      start?: number;
      direction?: WeightDirection;
    };

/** Mascot avatar poses the user can pick (maps to /sprout-<key>.png). */
export type MascotKey =
  | "neutral"
  | "success"
  | "streak"
  | "rest"
  | "progress"
  | "empty"
  | "work";

export type Reminders = {
  enabled: boolean;
  time: string;
  mode?: "fixed" | "smart";
};
export type AISettings = { endpoint: string; model: string };
export type FocusSession = {
  id: string;
  taskId?: string;
  startedAt: string;
  endedAt: string;
  minutes: number;
  mode: "focus" | "break";
};
export type MoodKey = "happy" | "calm" | "tired" | "sad" | "stressed";
export type MoodLog = {
  date: string;
  mood: MoodKey;
  energy: number;
  gratitude?: string;
  vent?: string;
};
export type MonthPlan = {
  month: string; // "2026-06"
  mainTaskIds: string[];
};

export type DayLog = {
  date: string; // "2026-06-19"
  done: Record<string, boolean>;
  addonTaskIds: string[];
  taskIds?: string[];
  skipped?: boolean;
  note?: string;
  goalEntries?: Record<string, number>;
  subtasksDone?: Record<string, Record<string, boolean>>;
  doneAt?: Record<string, string>;
};

export type Lang = "en" | "th" | "zh-CN" | "zh-TW";

export type Settings = {
  theme: "light" | "dark";
  language: Lang;
  zenMode: boolean;
  mascot: MascotKey;
  reminders: Reminders;
  ai: AISettings;
  /** Sound effects for notifications & celebrations (default on). */
  sound?: boolean;
};

export type AppState = {
  tasks: Record<string, Task>;
  months: Record<string, MonthPlan>;
  days: Record<string, DayLog>;
  templates?: string[];
  focusSessions: FocusSession[];
  moodLogs: Record<string, MoodLog>;
  settings: Settings;
};

export const defaultState: AppState = {
  tasks: {},
  months: {},
  days: {},
  templates: [],
  focusSessions: [],
  moodLogs: {},
  settings: {
    theme: "light",
    language: "th",
    zenMode: false,
    mascot: "neutral",
    reminders: { enabled: false, time: "20:00", mode: "fixed" },
    ai: { endpoint: "", model: "cloud-task-model" },
  },
};

export function isFutureDate(date: string): boolean {
  return date > todayISO();
}

export function getMonthPlan(state: AppState, month: string): MonthPlan {
  return state.months[month] ?? { month, mainTaskIds: [] };
}

export function getDayLog(state: AppState, date: string): DayLog {
  const log = state.days[date];
  return {
    date: log?.date ?? date,
    done: log?.done ?? {},
    addonTaskIds: log?.addonTaskIds ?? [],
    taskIds: log?.taskIds,
    skipped: log?.skipped ?? false,
    note: log?.note ?? "",
    goalEntries: log?.goalEntries ?? {},
    subtasksDone: log?.subtasksDone ?? {},
    doneAt: log?.doneAt ?? {},
  };
}

export function taskRecursOnDate(task: Task | undefined, date: string): boolean {
  if (!task?.recurrence) return false;
  if (task.recurrence.type === "daily") return true;
  const day = new Date(date + "T00:00:00").getDay();
  return task.recurrence.weekdays.includes(day);
}

/**
 * Tasks planned for a date — month main tasks + recurring + per-day adds —
 * resolved regardless of whether the date is in the future. Use this to
 * *preview* what a day holds (e.g. the calendar's read-only future view).
 */
export function getPlannedTaskIds(state: AppState, date: string): string[] {
  const month = date.slice(0, 7);
  const plan = getMonthPlan(state, month);
  const log = getDayLog(state, date);
  const dayIds = log.taskIds ?? [];
  const legacyTemplateIds = state.templates ?? [];
  const templateIds = plan.mainTaskIds.length > 0 ? plan.mainTaskIds : legacyTemplateIds;
  const recurringIds = Object.values(state.tasks)
    .filter((task) => taskRecursOnDate(task, date))
    .map((task) => task.id);
  const baseIds =
    dayIds.length > 0
      ? dayIds
      : templateIds.filter((id) => !state.tasks[id]?.recurrence);
  return [...new Set([...baseIds, ...recurringIds, ...log.addonTaskIds])];
}

/** Active tasks for a date. Future days resolve to nothing (locked). */
export function getDayTaskIds(state: AppState, date: string): string[] {
  if (isFutureDate(date)) return [];
  return getPlannedTaskIds(state, date);
}

export function nanoid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Mutations — return new state (immutable)
export function addTask(
  state: AppState,
  title: string,
  slot?: Slot,
  options: Pick<
    Task,
    "isTemplate" | "goalType" | "goalConfig" | "recurrence"
  > = {},
): [AppState, string] {
  const id = nanoid();
  const task: Task = {
    id,
    title: title.trim(),
    createdAt: new Date().toISOString(),
    ...(slot ? { slot } : {}),
    ...options,
  };
  return [{ ...state, tasks: { ...state.tasks, [id]: task } }, id];
}

export type AddDayTaskOptions = {
  slot?: Slot;
  asTemplate?: boolean;
  goalType?: GoalType;
  goalConfig?: GoalConfig;
  recurrence?: Recurrence;
};

function normalizeTitle(title: string): string {
  return title.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function getOrCreateDayPlan(state: AppState, date: string): AppState {
  if (isFutureDate(date)) return state;
  const log = getDayLog(state, date);
  if (log.taskIds) return state;
  const month = date.slice(0, 7);
  const plan = getMonthPlan(state, month);
  const legacyTemplateIds = state.templates ?? [];
  const templateIds = plan.mainTaskIds.length > 0 ? plan.mainTaskIds : legacyTemplateIds;
  return {
    ...state,
    days: {
      ...state.days,
      [date]: { ...log, taskIds: [...new Set(templateIds)] },
    },
  };
}

export function addDayTask(
  state: AppState,
  date: string,
  title: string,
  options: AddDayTaskOptions = {},
): [AppState, string] {
  const cleanTitle = title.trim();
  if (!cleanTitle || isFutureDate(date)) return [state, ""];
  let nextState = getOrCreateDayPlan(state, date);
  const log = getDayLog(nextState, date);
  const existingTitle = normalizeTitle(cleanTitle);
  const duplicate = getDayTaskIds(nextState, date).some(
    (id) => normalizeTitle(nextState.tasks[id]?.title ?? "") === existingTitle,
  );
  if (duplicate) return [nextState, ""];

  const [withTask, id] = addTask(nextState, cleanTitle, options.slot, {
    isTemplate: options.asTemplate,
    goalType: options.goalType,
    goalConfig: options.goalConfig,
    recurrence: options.recurrence,
  });
  const templates =
    options.asTemplate && !(withTask.templates ?? []).includes(id)
      ? [...(withTask.templates ?? []), id]
      : withTask.templates;
  return [
    {
      ...withTask,
      templates,
      days: {
        ...withTask.days,
        [date]: {
          ...log,
          taskIds: [...new Set([...(log.taskIds ?? []), id])],
          skipped: false,
        },
      },
    },
    id,
  ];
}

export function setTaskSlot(
  state: AppState,
  id: string,
  slot: Slot | undefined,
): AppState {
  const task = state.tasks[id];
  if (!task) return state;
  return {
    ...state,
    tasks: { ...state.tasks, [id]: { ...task, slot } },
  };
}

export function removeTask(state: AppState, id: string): AppState {
  const tasks = { ...state.tasks };
  delete tasks[id];
  const templates = (state.templates ?? []).filter((taskId) => taskId !== id);
  return { ...state, tasks, templates };
}

export function renameTask(
  state: AppState,
  id: string,
  title: string,
): AppState {
  return {
    ...state,
    tasks: {
      ...state.tasks,
      [id]: { ...state.tasks[id], title: title.trim() },
    },
  };
}

export function addMainTask(
  state: AppState,
  month: string,
  taskId: string,
): AppState {
  const plan = getMonthPlan(state, month);
  if (plan.mainTaskIds.includes(taskId)) return state;
  return {
    ...state,
    tasks: {
      ...state.tasks,
      [taskId]: { ...state.tasks[taskId], isTemplate: true },
    },
    months: {
      ...state.months,
      [month]: { ...plan, mainTaskIds: [...plan.mainTaskIds, taskId] },
    },
  };
}

export function addMonthTask(
  state: AppState,
  month: string,
  title: string,
  slot?: Slot,
): [AppState, string] {
  const cleanTitle = title.trim();
  if (!cleanTitle) return [state, ""];
  const plan = getMonthPlan(state, month);
  const duplicate = plan.mainTaskIds.some(
    (id) => normalizeTitle(state.tasks[id]?.title ?? "") === normalizeTitle(cleanTitle),
  );
  if (duplicate) return [state, ""];
  const [withTask, id] = addTask(state, cleanTitle, slot, { isTemplate: true });
  return [
    {
      ...withTask,
      months: {
        ...withTask.months,
        [month]: { ...plan, mainTaskIds: [...plan.mainTaskIds, id] },
      },
    },
    id,
  ];
}

export function removeMainTask(
  state: AppState,
  month: string,
  taskId: string,
): AppState {
  const plan = getMonthPlan(state, month);
  return {
    ...state,
    months: {
      ...state.months,
      [month]: {
        ...plan,
        mainTaskIds: plan.mainTaskIds.filter((id) => id !== taskId),
      },
    },
  };
}

export function addAddonTask(
  state: AppState,
  date: string,
  taskId: string,
): AppState {
  const log = getDayLog(state, date);
  if (log.addonTaskIds.includes(taskId)) return state;
  return {
    ...state,
    days: {
      ...state.days,
      [date]: { ...log, addonTaskIds: [...log.addonTaskIds, taskId] },
    },
  };
}

export function setDaySkipped(
  state: AppState,
  date: string,
  skipped: boolean,
): AppState {
  if (isFutureDate(date)) return state;
  const stateWithPlan = getOrCreateDayPlan(state, date);
  const log = getDayLog(stateWithPlan, date);
  return {
    ...stateWithPlan,
    days: {
      ...stateWithPlan.days,
      [date]: { ...log, skipped },
    },
  };
}

export function setDayNote(
  state: AppState,
  date: string,
  note: string,
): AppState {
  if (isFutureDate(date)) return state;
  const stateWithPlan = getOrCreateDayPlan(state, date);
  const log = getDayLog(stateWithPlan, date);
  return {
    ...stateWithPlan,
    days: {
      ...stateWithPlan.days,
      [date]: { ...log, note },
    },
  };
}

export function setGoalEntry(
  state: AppState,
  date: string,
  taskId: string,
  value: number,
): AppState {
  if (isFutureDate(date) || !Number.isFinite(value)) return state;
  const stateWithPlan = getOrCreateDayPlan(state, date);
  const log = getDayLog(stateWithPlan, date);
  return {
    ...stateWithPlan,
    days: {
      ...stateWithPlan.days,
      [date]: {
        ...log,
        goalEntries: { ...(log.goalEntries ?? {}), [taskId]: value },
      },
    },
  };
}

export function addSubtask(
  state: AppState,
  taskId: string,
  title: string,
): [AppState, string] {
  const task = state.tasks[taskId];
  const cleanTitle = title.trim();
  if (!task || !cleanTitle) return [state, ""];
  const id = nanoid();
  return [
    {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          subtasks: [...(task.subtasks ?? []), { id, title: cleanTitle }],
        },
      },
    },
    id,
  ];
}

export function removeSubtask(
  state: AppState,
  taskId: string,
  subtaskId: string,
): AppState {
  const task = state.tasks[taskId];
  if (!task) return state;
  const days: Record<string, DayLog> = {};
  for (const [date, log] of Object.entries(state.days)) {
    const taskDone = { ...(log.subtasksDone?.[taskId] ?? {}) };
    delete taskDone[subtaskId];
    days[date] = {
      ...log,
      subtasksDone: {
        ...(log.subtasksDone ?? {}),
        [taskId]: taskDone,
      },
    };
  }
  return {
    ...state,
    tasks: {
      ...state.tasks,
      [taskId]: {
        ...task,
        subtasks: (task.subtasks ?? []).filter((item) => item.id !== subtaskId),
      },
    },
    days,
  };
}

export function setSubtaskDone(
  state: AppState,
  date: string,
  taskId: string,
  subtaskId: string,
  done: boolean,
): AppState {
  if (isFutureDate(date)) return state;
  const stateWithPlan = getOrCreateDayPlan(state, date);
  const log = getDayLog(stateWithPlan, date);
  return {
    ...stateWithPlan,
    days: {
      ...stateWithPlan.days,
      [date]: {
        ...log,
        subtasksDone: {
          ...(log.subtasksDone ?? {}),
          [taskId]: {
            ...(log.subtasksDone?.[taskId] ?? {}),
            [subtaskId]: done,
          },
        },
      },
    },
  };
}

export function removeAddonTask(
  state: AppState,
  date: string,
  taskId: string,
): AppState {
  const log = getDayLog(state, date);
  const done = { ...log.done };
  delete done[taskId];
  return {
    ...state,
    days: {
      ...state.days,
      [date]: {
        ...log,
        addonTaskIds: log.addonTaskIds.filter((id) => id !== taskId),
        done,
      },
    },
  };
}

export function setTaskDone(
  state: AppState,
  date: string,
  taskId: string,
  done: boolean,
  doneAt = new Date().toISOString(),
): AppState {
  if (isFutureDate(date)) return state;
  const stateWithPlan = getOrCreateDayPlan(state, date);
  const log = getDayLog(stateWithPlan, date);
  const nextDoneAt = { ...(log.doneAt ?? {}) };
  if (done) nextDoneAt[taskId] = doneAt;
  else delete nextDoneAt[taskId];
  return {
    ...stateWithPlan,
    days: {
      ...stateWithPlan.days,
      [date]: {
        ...log,
        skipped: false,
        done: { ...log.done, [taskId]: done },
        doneAt: nextDoneAt,
      },
    },
  };
}

export function removeDayTask(
  state: AppState,
  date: string,
  taskId: string,
): AppState {
  if (isFutureDate(date)) return state;
  const log = getDayLog(state, date);
  const done = { ...log.done };
  const goalEntries = { ...(log.goalEntries ?? {}) };
  delete done[taskId];
  delete goalEntries[taskId];
  return {
    ...state,
    days: {
      ...state.days,
      [date]: {
        ...log,
        taskIds: (log.taskIds ?? []).filter((id) => id !== taskId),
        addonTaskIds: log.addonTaskIds.filter((id) => id !== taskId),
        done,
        goalEntries,
      },
    },
  };
}

export function setTheme(state: AppState, theme: "light" | "dark"): AppState {
  return { ...state, settings: { ...state.settings, theme } };
}

export function setLanguage(state: AppState, language: Lang): AppState {
  return { ...state, settings: { ...state.settings, language } };
}

export function setZenMode(state: AppState, zenMode: boolean): AppState {
  return { ...state, settings: { ...state.settings, zenMode } };
}

export function setMascot(state: AppState, mascot: MascotKey): AppState {
  return { ...state, settings: { ...state.settings, mascot } };
}

export function setReminders(state: AppState, reminders: Reminders): AppState {
  return { ...state, settings: { ...state.settings, reminders } };
}

export function setSound(state: AppState, sound: boolean): AppState {
  return { ...state, settings: { ...state.settings, sound } };
}

export function addFocusSession(
  state: AppState,
  session: Omit<FocusSession, "id">,
): AppState {
  return {
    ...state,
    focusSessions: [
      ...(state.focusSessions ?? []),
      { ...session, id: nanoid() },
    ],
  };
}

export function setMoodLog(
  state: AppState,
  date: string,
  log: Omit<MoodLog, "date">,
): AppState {
  return {
    ...state,
    moodLogs: {
      ...(state.moodLogs ?? {}),
      [date]: { ...log, date },
    },
  };
}

export function setAISettings(
  state: AppState,
  ai: AISettings,
): AppState {
  return { ...state, settings: { ...state.settings, ai } };
}
