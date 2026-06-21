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
    const parsed = JSON.parse(raw, (key, value) =>
      key === "__proto__" || key === "constructor" || key === "prototype"
        ? undefined
        : value,
    );
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
        reminders: {
          ...defaultState.settings.reminders,
          ...(parsed.settings?.reminders ?? {}),
        },
      },
    });
  } catch {
    return defaultState;
  }
}

export function migrateState(raw: AppState): AppState {
  const templates = [...new Set(raw.templates ?? [])].filter((id) => !!raw.tasks[id]);
  const monthTaskIds = [
    ...new Set(Object.values(raw.months ?? {}).flatMap((plan) => plan.mainTaskIds)),
  ].filter((id) => !!raw.tasks[id]);

  const tasks = { ...raw.tasks };
  for (const id of templates) {
    tasks[id] = {
      ...tasks[id],
      isTemplate: true,
      recurrence: tasks[id].recurrence ?? { type: "daily" },
    };
  }
  for (const id of monthTaskIds) {
    tasks[id] = {
      ...tasks[id],
      isTemplate: true,
    };
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
      subtasksDone: log.subtasksDone ?? {},
      doneAt: log.doneAt ?? {},
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

  return {
    ...raw,
    tasks,
    days,
    templates,
    focusSessions: raw.focusSessions ?? [],
    moodLogs: raw.moodLogs ?? {},
    settings: {
      ...raw.settings,
      reminders: {
        ...defaultState.settings.reminders,
        ...(raw.settings?.reminders ?? {}),
      },
    },
  };
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

/* ── Backup / restore ──────────────────────────────────────────────────
 * Local data lives only in this browser, so let users export a portable
 * JSON file and re-import it to survive a cleared cache or a new device.   */

const BACKUP_APP = "sprout-planner";
const BACKUP_VERSION = 1;

export type BackupFile = {
  app: typeof BACKUP_APP;
  version: number;
  exportedAt: string;
  state: AppState;
};

/** Serialize the full app state into a portable, human-readable backup. */
export function exportBackup(state: AppState): string {
  const payload: BackupFile = {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    state,
  };
  return JSON.stringify(payload, null, 2);
}

/** Suggested download filename, e.g. sprout-planner-backup-2026-06-20.json */
export function backupFilename(): string {
  return `sprout-planner-backup-${todayISO()}.json`;
}

/**
 * Parse a backup file (or a raw exported AppState) back into a usable, merged
 * and migrated AppState. Returns null when the text isn't a valid backup.
 */
/** A plain JSON object (not null, not an array). */
function isObj(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function parseBackup(text: string): AppState | null {
  let parsed: unknown;
  try {
    // Reviver strips prototype-pollution keys at parse time: an imported file
    // could carry a task id / day key of "__proto__" that would otherwise hit a
    // `tasks[id] = …` bracket-assignment downstream and mutate Object.prototype.
    parsed = JSON.parse(text, (key, value) =>
      key === "__proto__" || key === "constructor" || key === "prototype"
        ? undefined
        : value,
    );
  } catch {
    return null;
  }
  if (!isObj(parsed)) return null;

  // Accept both the wrapped backup ({ app, state }) and a bare AppState.
  const wrapper = parsed as Partial<BackupFile> & Record<string, unknown>;
  const raw =
    wrapper.app === BACKUP_APP && isObj(wrapper.state)
      ? wrapper.state
      : parsed;

  // Must look like our shape, not some arbitrary JSON file.
  if (!("tasks" in raw || "days" in raw || "settings" in raw)) {
    return null;
  }

  // Coerce each top-level field to its expected container type so a malformed
  // (but shaped) file can't crash migrate or smuggle in unexpected structures.
  const rawSettings = isObj(raw.settings) ? raw.settings : {};
  return migrateState({
    ...defaultState,
    tasks: isObj(raw.tasks) ? (raw.tasks as AppState["tasks"]) : {},
    months: isObj(raw.months) ? (raw.months as AppState["months"]) : {},
    days: isObj(raw.days) ? (raw.days as AppState["days"]) : {},
    moodLogs: isObj(raw.moodLogs) ? (raw.moodLogs as AppState["moodLogs"]) : {},
    focusSessions: Array.isArray(raw.focusSessions)
      ? (raw.focusSessions as AppState["focusSessions"])
      : [],
    templates: Array.isArray(raw.templates) ? (raw.templates as string[]) : [],
    settings: {
      ...defaultState.settings,
      ...rawSettings,
      ai: {
        ...defaultState.settings.ai,
        ...(isObj(rawSettings.ai) ? rawSettings.ai : {}),
      },
      reminders: {
        ...defaultState.settings.reminders,
        ...(isObj(rawSettings.reminders) ? rawSettings.reminders : {}),
      },
    },
  } as AppState);
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
