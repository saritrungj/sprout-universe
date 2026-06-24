import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import {
  AppState,
  removeGoalRecord,
  setFinancialRecord,
  setWeightRecord,
} from "../../lib/store";
import {
  GoalMeta,
  getFinancialRows,
  getWeightRows,
  getRecordForDate,
  formatMoney,
  formatWeight,
  isWeightDue,
  nextWeightCheckDate,
} from "../../lib/goals";
import { todayISO } from "../../lib/dates";
import { useT } from "../../lib/i18n";

type Props = {
  state: AppState;
  setState: (s: AppState) => void;
  taskId: string;
  meta: GoalMeta;
};

export default function GoalTracking({
  state,
  setState,
  taskId,
  meta,
}: Props) {
  const { t } = useT();
  const today = todayISO();
  const [editDate, setEditDate] = useState<string | null>(null);

  if (meta.type === "financial") {
    const rows = getFinancialRows(state, taskId);
    const todayRecord = getRecordForDate(state, taskId, today);
    return (
      <div className="flex flex-col gap-4">
        <FinancialEntryForm
          date={today}
          initial={
            todayRecord?.type === "financial"
              ? {
                  income: todayRecord.income,
                  expense: todayRecord.expense,
                  note: todayRecord.note ?? "",
                }
              : { income: "", expense: "", note: "" }
          }
          onSave={(income, expense, note) => {
            setState(setFinancialRecord(state, today, taskId, income, expense, note));
          }}
        />

        <section>
          <h2 className="mb-2 text-sm font-bold text-ink dark:text-surface">
            {t("goals.recordHistory")}
          </h2>
          {rows.length === 0 ? (
            <p className="text-sm text-ink-muted dark:text-surface-muted">
              {t("goals.noRecords")}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {[...rows].reverse().map((row) => (
                <li key={row.date}>
                  {editDate === row.date ? (
                    <FinancialEntryForm
                      date={row.date}
                      initial={{
                        income: String(row.income),
                        expense: String(row.expense),
                        note: row.note ?? "",
                      }}
                      onSave={(income, expense, note) => {
                        setState(
                          setFinancialRecord(
                            state,
                            row.date,
                            taskId,
                            income,
                            expense,
                            note,
                          ),
                        );
                        setEditDate(null);
                      }}
                      onCancel={() => setEditDate(null)}
                    />
                  ) : (
                    <RecordRow
                      date={row.date}
                      primary={`${formatMoney(row.income, t("goal.currency"))} / ${formatMoney(row.expense, t("goal.currency"))}`}
                      secondary={`${t("goals.balance")}: ${formatMoney(row.balance, t("goal.currency"))}`}
                      note={row.note}
                      onEdit={() => setEditDate(row.date)}
                      onDelete={() =>
                        setState(removeGoalRecord(state, row.date, taskId))
                      }
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    );
  }

  const rows = getWeightRows(state, taskId);
  const due = isWeightDue(state, taskId, today);
  const nextCheck = nextWeightCheckDate(state, taskId);
  const todayRecord = getRecordForDate(state, taskId, today);

  return (
    <div className="flex flex-col gap-4">
      {due ? (
        <p className="rounded-xl bg-sprout-50 px-3 py-2 text-xs font-medium text-sprout-800 dark:bg-sprout-950 dark:text-sprout-200">
          {t("goals.weightDueToday")}
        </p>
      ) : (
        nextCheck && (
          <p className="text-xs text-ink-subtle dark:text-surface-muted">
            {t("goal.nextCheck", { date: nextCheck })}
          </p>
        )
      )}

      <WeightEntryForm
        date={today}
        initial={
          todayRecord?.type === "weight"
            ? { value: String(todayRecord.value), note: todayRecord.note ?? "" }
            : { value: "", note: "" }
        }
        onSave={(value, note) => {
          setState(setWeightRecord(state, today, taskId, value, note));
        }}
      />

      <section>
        <h2 className="mb-2 text-sm font-bold text-ink dark:text-surface">
          {t("goals.recordHistory")}
        </h2>
        {rows.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-surface-muted">
            {t("goals.noRecords")}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {[...rows].reverse().map((row) => (
              <li key={row.date}>
                {editDate === row.date ? (
                  <WeightEntryForm
                    date={row.date}
                    initial={{
                      value: String(row.value),
                      note: row.note ?? "",
                    }}
                    onSave={(value, note) => {
                      setState(
                        setWeightRecord(state, row.date, taskId, value, note),
                      );
                      setEditDate(null);
                    }}
                    onCancel={() => setEditDate(null)}
                  />
                ) : (
                  <RecordRow
                    date={row.date}
                    primary={formatWeight(row.value, t("goal.kg"))}
                    note={row.note}
                    onEdit={() => setEditDate(row.date)}
                    onDelete={() =>
                      setState(removeGoalRecord(state, row.date, taskId))
                    }
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function RecordRow({
  date,
  primary,
  secondary,
  note,
  onEdit,
  onDelete,
}: {
  date: string;
  primary: string;
  secondary?: string;
  note?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useT();
  return (
    <div className="flex items-start gap-2 rounded-2xl border border-sprout-100 bg-surface px-3 py-2.5 dark:border-sprout-900 dark:bg-surface-dark-muted">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-ink-subtle dark:text-surface-muted">
          {date}
        </p>
        <p className="text-sm font-bold text-ink dark:text-surface">{primary}</p>
        {secondary && (
          <p className="text-xs text-ink-muted dark:text-surface-muted">
            {secondary}
          </p>
        )}
        {note && (
          <p className="mt-0.5 text-xs italic text-ink-muted dark:text-surface-muted">
            {note}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label={t("goals.editRecord")}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-subtle hover:bg-surface-muted hover:text-sprout-700 dark:hover:bg-surface-dark"
      >
        <Pencil size={15} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={t("goals.deleteRecord")}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-subtle hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
      >
        <Trash2 size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

function FinancialEntryForm({
  date,
  initial,
  onSave,
  onCancel,
}: {
  date: string;
  initial: { income: string | number; expense: string | number; note: string };
  onSave: (income: number, expense: number, note?: string) => void;
  onCancel?: () => void;
}) {
  const { t } = useT();
  const [income, setIncome] = useState(String(initial.income));
  const [expense, setExpense] = useState(String(initial.expense));
  const [note, setNote] = useState(initial.note);

  const fieldCls =
    "min-h-[44px] w-full rounded-xl border border-sprout-100 bg-surface-muted px-3 text-sm text-ink dark:border-sprout-900 dark:bg-surface-dark dark:text-surface";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const inc = Number(income) || 0;
    const exp = Number(expense) || 0;
    onSave(inc, exp, note);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-sprout-200 bg-surface p-4 dark:border-sprout-800 dark:bg-surface-dark-muted"
    >
      <p className="mb-2 text-xs font-semibold uppercase text-ink-subtle dark:text-surface-muted">
        {date === todayISO() ? t("goals.logToday") : date}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-ink-muted">{t("goals.income")}</span>
          <input
            type="number"
            inputMode="decimal"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className={fieldCls}
            min={0}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-ink-muted">{t("goals.expense")}</span>
          <input
            type="number"
            inputMode="decimal"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
            className={fieldCls}
            min={0}
          />
        </label>
      </div>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={t("goals.noteOptional")}
        className={`${fieldCls} mt-2`}
      />
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1 rounded-xl bg-sprout-600 text-sm font-semibold text-white"
        >
          <Check size={15} aria-hidden="true" />
          {t("goal.logCta")}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-[40px] items-center justify-center rounded-xl px-3 text-ink-muted"
          >
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>
    </form>
  );
}

function WeightEntryForm({
  date,
  initial,
  onSave,
  onCancel,
}: {
  date: string;
  initial: { value: string; note: string };
  onSave: (value: number, note?: string) => void;
  onCancel?: () => void;
}) {
  const { t } = useT();
  const [value, setValue] = useState(initial.value);
  const [note, setNote] = useState(initial.note);

  const fieldCls =
    "min-h-[44px] w-full rounded-xl border border-sprout-100 bg-surface-muted px-3 text-sm text-ink dark:border-sprout-900 dark:bg-surface-dark dark:text-surface";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = Number(value);
    if (!Number.isFinite(v) || v <= 0) return;
    onSave(v, note);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-sprout-200 bg-surface p-4 dark:border-sprout-800 dark:bg-surface-dark-muted"
    >
      <p className="mb-2 text-xs font-semibold uppercase text-ink-subtle dark:text-surface-muted">
        {date === todayISO() ? t("goals.logToday") : date}
      </p>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-ink-muted">{t("goal.weightToday")}</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={fieldCls}
          required
        />
      </label>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={t("goals.noteOptional")}
        className={`${fieldCls} mt-2`}
      />
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1 rounded-xl bg-sprout-600 text-sm font-semibold text-white"
        >
          <Check size={15} aria-hidden="true" />
          {t("goal.logCta")}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-[40px] items-center justify-center rounded-xl px-3 text-ink-muted"
          >
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>
    </form>
  );
}
