import {
  AppState,
  normalizeGoalType,
  setFinancialRecord,
  setWeightRecord,
} from "../../lib/store";
import { getRecordForDate } from "../../lib/goals";
import { useT } from "../../lib/i18n";

type Props = {
  state: AppState;
  setState: (s: AppState) => void;
  taskId: string;
  goalType: NonNullable<ReturnType<typeof normalizeGoalType>>;
  date: string;
};

/** Compact goal log fields for Today / Calendar day editor. */
export default function GoalGoalLog({
  state,
  setState,
  taskId,
  goalType,
  date,
}: Props) {
  const { t } = useT();
  const record = getRecordForDate(state, taskId, date);

  if (goalType === "financial") {
    const income =
      record?.type === "financial" ? String(record.income) : "";
    const expense =
      record?.type === "financial" ? String(record.expense) : "";

    return (
      <div className="flex flex-wrap items-center gap-2 px-1 pb-1 text-xs text-ink-subtle dark:text-surface-muted">
        <span className="font-medium">{t("goals.income")}</span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          defaultValue={income}
          key={`${taskId}-in-${income}`}
          onBlur={(e) => {
            const inc = Number(e.target.value) || 0;
            const exp =
              record?.type === "financial" ? record.expense : 0;
            setState(setFinancialRecord(state, date, taskId, inc, exp));
          }}
          className="min-h-[36px] w-20 rounded-xl border border-sprout-100 bg-surface-muted px-2 py-1 text-sm text-ink dark:border-sprout-900 dark:bg-surface-dark dark:text-surface"
        />
        <span className="font-medium">{t("goals.expense")}</span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          defaultValue={expense}
          key={`${taskId}-ex-${expense}`}
          onBlur={(e) => {
            const exp = Number(e.target.value) || 0;
            const inc =
              record?.type === "financial" ? record.income : 0;
            setState(setFinancialRecord(state, date, taskId, inc, exp));
          }}
          className="min-h-[36px] w-20 rounded-xl border border-sprout-100 bg-surface-muted px-2 py-1 text-sm text-ink dark:border-sprout-900 dark:bg-surface-dark dark:text-surface"
        />
        <span>{t("goal.currency")}</span>
      </div>
    );
  }

  const value = record?.type === "weight" ? String(record.value) : "";

  return (
    <label className="flex items-center gap-2 px-1 pb-1 text-xs text-ink-subtle dark:text-surface-muted">
      {t("goal.weightToday")}
      <input
        type="number"
        inputMode="decimal"
        step="0.1"
        defaultValue={value}
        key={`${taskId}-wt-${value}`}
        onBlur={(e) => {
          const v = Number(e.target.value);
          if (!Number.isFinite(v) || v <= 0) return;
          setState(setWeightRecord(state, date, taskId, v));
        }}
        className="min-h-[36px] w-24 rounded-xl border border-sprout-100 bg-surface-muted px-2 py-1 text-sm text-ink dark:border-sprout-900 dark:bg-surface-dark dark:text-surface"
      />
      <span>{t("goal.kg")}</span>
    </label>
  );
}
