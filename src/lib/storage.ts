import { useEffect, useState } from "react";
import {
  AppState,
  DayLog,
  defaultState,
  getDayLog,
  getMonthPlan,
} from "./store";
import { currentMonth, todayISO } from "./dates";

const KEY = "sprout-planner:v1";

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return migrateState({
      ...defaultState,
      ...parsed,
      settings: {
        ...defaultState.settings,
        ...(parsed.settings ?? {}),
        ai: {
          ...defaultState.settings.ai,
          ...(parsed.settings?.ai ?? {}),
        },
      },
    });
  } catch {
    return defaultState;
  }
}

export function migrateState(raw: AppState): AppState {
  const templates = [
    ...new Set([
      ...(raw.templates ?? []),
      ...Object.values(raw.months ?? {}).flatMap((plan) => plan.mainTaskIds),
    ]),
  ].filter((id) => !!raw.tasks[id]);

  const tasks = { ...raw.tasks };
  for (const id of templates) {
    tasks[id] = { ...tasks[id], isTemplate: true };
  }

  const days: Record<string, DayLog> = {};
  for (const [date, log] of Object.entries(raw.days ?? {})) {
    const monthPlan = getMonthPlan(raw, date.slice(0, 7));
    days[date] = {
      ...getDayLog({ ...raw, days: {} }, date),
      ...log,
      taskIds: log.taskIds ?? [
        ...new Set([...monthPlan.mainTaskIds, ...(log.addonTaskIds ?? [])]),
      ],
      goalEntries: log.goalEntries ?? {},
      note: log.note ?? "",
      skipped: log.skipped ?? false,
    };
  }

  const today = todayISO();
  const currentPlan = getMonthPlan(raw, currentMonth());
  if (!days[today] && currentPlan.mainTaskIds.length > 0) {
    days[today] = {
      ...getDayLog({ ...raw, days: {} }, today),
      taskIds: [...new Set(currentPlan.mainTaskIds)],
    };
  }

  return { ...raw, tasks, days, templates };
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function useAppState() {
  const [state, setStateRaw] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [state.settings.theme]);

  useEffect(() => {
    document.documentElement.lang = state.settings.language;
  }, [state.settings.language]);

  return [state, setStateRaw] as const;
}
