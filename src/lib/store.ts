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
};

export type GoalType = "savings" | "weight";

export type GoalConfig =
  | { target: number }
  | { target: number; checkEveryDays: number };

/** Mascot avatar poses the user can pick (maps to /sprout-<key>.png). */
export type MascotKey =
  | "neutral"
  | "success"
  | "streak"
  | "rest"
  | "progress"
  | "empty"
  | "work";

export type Reminders = { enabled: boolean; time: string };
export type AISettings = { endpoint: string; model: string };

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
};

export type Lang = "en" | "th" | "zh-CN" | "zh-TW";

export type Settings = {
  theme: "light" | "dark";
  language: Lang;
  zenMode: boolean;
  mascot: MascotKey;
  reminders: Reminders;
  ai: AISettings;
};

export type AppState = {
  tasks: Record<string, Task>;
  months: Record<string, MonthPlan>;
  days: Record<string, DayLog>;
  templates?: string[];
  settings: Settings;
};

export const defaultState: AppState = {
  tasks: {},
  months: {},
  days: {},
  templates: [],
  settings: {
    theme: "light",
    language: "en",
    zenMode: false,
    mascot: "neutral",
    reminders: { enabled: false, time: "20:00" },
    ai: { endpoint: "", model: "cloud-task-model" },
  },
};

export function isFutureDate(date: string): boolean {
  return date > new Date().toISOString().slice(0, 10);
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
  };
}

export function getDayTaskIds(state: AppState, date: string): string[] {
  if (isFutureDate(date)) return [];
  const month = date.slice(0, 7);
  const plan = getMonthPlan(state, month);
  const log = getDayLog(state, date);
  const dayIds = log.taskIds ?? [];
  const templateIds = state.templates ?? plan.mainTaskIds;
  const baseIds = dayIds.length > 0 ? dayIds : templateIds;
  return [...new Set([...baseIds, ...log.addonTaskIds])];
}

export function nanoid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Mutations — return new state (immutable)
export function addTask(
  state: AppState,
  title: string,
  slot?: Slot,
  options: Pick<Task, "isTemplate" | "goalType" | "goalConfig"> = {},
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
  const templateIds = state.templates ?? plan.mainTaskIds;
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
    templates: [...new Set([...(state.templates ?? []), taskId])],
    months: {
      ...state.months,
      [month]: { ...plan, mainTaskIds: [...plan.mainTaskIds, taskId] },
    },
  };
}

export function removeMainTask(
  state: AppState,
  month: string,
  taskId: string,
): AppState {
  const plan = getMonthPlan(state, month);
  return {
    ...state,
    templates: (state.templates ?? []).filter((id) => id !== taskId),
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
        skipped: false,
        done: { ...log.done, [taskId]: done },
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

export function setAISettings(
  state: AppState,
  ai: AISettings,
): AppState {
  return { ...state, settings: { ...state.settings, ai } };
}
