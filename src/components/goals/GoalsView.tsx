import { useState } from "react";
import {
  Plus,
  Target,
  ListTodo,
  ArrowLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import {
  AppState,
  Task,
  createGoal,
  getGoalTasks,
  removeGoal,
  GoalConfig,
  GoalType,
} from "../../lib/store";
import { getGoalMeta } from "../../lib/goals";
import { useT } from "../../lib/i18n";
import GoalTracking from "./GoalTracking";
import GoalDashboard from "./GoalDashboard";
import GoalTypeIcon from "./GoalTypeIcon";
import TaskTitle from "../TaskTitle";

type Props = {
  state: AppState;
  setState: (s: AppState) => void;
};

type HubTab = "goals" | "tasks";
type DetailTab = "tracking" | "dashboard";
type Route =
  | { screen: "hub"; tab: HubTab }
  | { screen: "detail"; taskId: string; tab: DetailTab };

export default function GoalsView({ state, setState }: Props) {
  const { t } = useT();
  const [route, setRoute] = useState<Route>({ screen: "hub", tab: "goals" });
  const [showForm, setShowForm] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const goalTasks = getGoalTasks(state);

  if (route.screen === "detail") {
    const task = state.tasks[route.taskId];
    const meta = task ? getGoalMeta(task) : null;
    if (!task || !meta) {
      setRoute({ screen: "hub", tab: "tasks" });
      return null;
    }
    return (
      <div className="view-enter mx-auto flex min-h-full w-full max-w-4xl flex-col gap-4 px-4 py-5 lg:px-8 lg:py-8">
        <header className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            data-flat
            onClick={() => setRoute({ screen: "hub", tab: "tasks" })}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-sprout-700 dark:text-surface-muted dark:hover:bg-surface-dark-muted dark:hover:text-sprout-300"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            {t("goals.back")}
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
              {meta.type === "financial" ? t("goal.financial") : t("goal.weight")}
            </p>
            <h1 className="truncate font-sans text-xl font-bold text-ink dark:text-surface">
              {meta.title}
            </h1>
          </div>
        </header>

        <div
          className="flex rounded-full border border-sprout-100 bg-surface-muted p-1 dark:border-sprout-900 dark:bg-surface-dark"
          role="tablist"
        >
          <HubChip
            active={route.tab === "tracking"}
            onClick={() => setRoute({ ...route, tab: "tracking" })}
            label={t("goals.tracking")}
          />
          <HubChip
            active={route.tab === "dashboard"}
            onClick={() => setRoute({ ...route, tab: "dashboard" })}
            label={t("goals.dashboard")}
          />
        </div>

        {route.tab === "tracking" ? (
          <GoalTracking
            state={state}
            setState={setState}
            taskId={route.taskId}
            meta={meta}
          />
        ) : (
          <GoalDashboard state={state} taskId={route.taskId} meta={meta} />
        )}
      </div>
    );
  }

  return (
    <div className="view-enter mx-auto flex min-h-full w-full max-w-4xl flex-col gap-5 px-4 py-5 lg:px-8 lg:py-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
          {t("goals.kicker")}
        </p>
        <h1 className="font-sans text-2xl font-bold text-ink dark:text-surface">
          {t("goals.title")}
        </h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-surface-muted">
          {t("goals.subtitle")}
        </p>
      </header>

      <div
        className="flex rounded-full border border-sprout-100 bg-surface-muted p-1 dark:border-sprout-900 dark:bg-surface-dark"
        role="tablist"
      >
        <HubChip
          active={route.tab === "goals"}
          onClick={() => setRoute({ screen: "hub", tab: "goals" })}
          label={t("goals.tabGoals")}
          icon={<Target size={14} aria-hidden="true" />}
        />
        <HubChip
          active={route.tab === "tasks"}
          onClick={() => setRoute({ screen: "hub", tab: "tasks" })}
          label={t("goals.tabTasks")}
          icon={<ListTodo size={14} aria-hidden="true" />}
        />
      </div>

      {route.tab === "goals" ? (
        <>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-sprout-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-sprout-700"
            >
              <Plus size={16} aria-hidden="true" />
              {t("goals.newGoal")}
            </button>
          </div>

          {showForm && (
            <GoalCreateForm
              onCancel={() => setShowForm(false)}
              onCreate={(title, type, config) => {
                const [next] = createGoal(state, title, type, config);
                setState(next);
                setShowForm(false);
              }}
            />
          )}

          {goalTasks.length === 0 ? (
            <EmptyGoals />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {goalTasks.map((task) => {
                const meta = getGoalMeta(task);
                if (!meta) return null;
                return (
                  <GoalListCard
                    key={task.id}
                    meta={meta}
                    onOpen={() =>
                      setRoute({
                        screen: "detail",
                        taskId: task.id,
                        tab: "tracking",
                      })
                    }
                    onRemove={() =>
                      setConfirmRemove(
                        confirmRemove === task.id ? null : task.id,
                      )
                    }
                    confirmRemove={confirmRemove === task.id}
                    onConfirmRemove={() => {
                      setState(removeGoal(state, task.id));
                      setConfirmRemove(null);
                    }}
                    onCancelRemove={() => setConfirmRemove(null)}
                  />
                );
              })}
            </div>
          )}
        </>
      ) : (
        <GoalTasksPanel
          tasks={goalTasks}
          onOpen={(taskId) =>
            setRoute({ screen: "detail", taskId, tab: "tracking" })
          }
        />
      )}
    </div>
  );
}

function HubChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all ${
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

function EmptyGoals() {
  const { t } = useT();
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-sprout-200 bg-surface px-6 py-12 text-center dark:border-sprout-900 dark:bg-surface-dark-muted">
      <img
        src="/sprout-finance.png"
        alt=""
        aria-hidden="true"
        className="h-24 w-24 object-contain"
      />
      <div>
        <h2 className="text-lg font-bold text-ink dark:text-surface">
          {t("goals.emptyTitle")}
        </h2>
        <p className="mt-1 text-sm text-ink-muted dark:text-surface-muted">
          {t("goals.emptyBody")}
        </p>
      </div>
    </div>
  );
}

function GoalListCard({
  meta,
  onOpen,
  onRemove,
  confirmRemove,
  onConfirmRemove,
  onCancelRemove,
}: {
  meta: NonNullable<ReturnType<typeof getGoalMeta>>;
  onOpen: () => void;
  onRemove: () => void;
  confirmRemove: boolean;
  onConfirmRemove: () => void;
  onCancelRemove: () => void;
}) {
  const { t } = useT();
  return (
    <article className="flex flex-col rounded-2xl border border-sprout-100 bg-surface p-4 transition-shadow hover:shadow-md dark:border-sprout-900 dark:bg-surface-dark-muted">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-sprout-100 text-sprout-700 dark:bg-sprout-950 dark:text-sprout-300">
          <GoalTypeIcon type={meta.type} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
            {meta.type === "financial" ? t("goal.financial") : t("goal.weight")}
          </p>
          <h3 className="truncate text-base font-bold text-ink dark:text-surface">
            {meta.title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-ink-muted dark:text-surface-muted">
            {t("goals.linkedTask")}: <TaskTitle task={meta.task} />
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={t("goal.remove")}
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-ink-subtle hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
        >
          <Trash2 size={15} aria-hidden="true" />
        </button>
      </div>

      {confirmRemove && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900/60 dark:bg-red-950/30">
          <span className="text-xs font-medium text-red-700 dark:text-red-300">
            {t("goal.removeConfirm")}
          </span>
          <span className="flex gap-2">
            <button
              type="button"
              onClick={onConfirmRemove}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
            >
              {t("goal.remove")}
            </button>
            <button
              type="button"
              onClick={onCancelRemove}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-muted"
            >
              {t("goal.cancel")}
            </button>
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={onOpen}
        className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-sprout-200 bg-surface-muted text-sm font-semibold text-sprout-700 transition-colors hover:bg-sprout-50 dark:border-sprout-800 dark:bg-surface-dark dark:text-sprout-300 dark:hover:bg-sprout-950"
      >
        {t("goals.openTracking")}
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </article>
  );
}

function GoalTasksPanel({
  tasks,
  onOpen,
}: {
  tasks: Task[];
  onOpen: (taskId: string) => void;
}) {
  const { t } = useT();
  if (tasks.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-sprout-200 px-4 py-8 text-center text-sm text-ink-muted dark:border-sprout-900 dark:text-surface-muted">
        {t("goals.tasksEmpty")}
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => {
        const meta = getGoalMeta(task);
        if (!meta) return null;
        return (
          <li key={task.id}>
            <button
              type="button"
              onClick={() => onOpen(task.id)}
              className="flex w-full min-h-[56px] items-center gap-3 rounded-2xl border border-sprout-100 bg-surface px-4 py-3 text-left transition-all hover:border-sprout-300 hover:shadow-sm dark:border-sprout-900 dark:bg-surface-dark-muted dark:hover:border-sprout-700"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-sprout-100 text-sprout-700 dark:bg-sprout-950 dark:text-sprout-300">
                <GoalTypeIcon type={meta.type} size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-ink dark:text-surface">
                  <TaskTitle task={task} />
                </span>
                <span className="block truncate text-xs text-ink-muted dark:text-surface-muted">
                  {meta.type === "financial"
                    ? t("goal.financial")
                    : t("goal.weight")}
                </span>
              </span>
              <ChevronRight
                size={18}
                className="flex-none text-ink-subtle dark:text-surface-muted"
                aria-hidden="true"
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function GoalCreateForm({
  onCreate,
  onCancel,
}: {
  onCreate: (title: string, type: GoalType, config: GoalConfig) => void;
  onCancel: () => void;
}) {
  const { t } = useT();
  const [gtype, setGtype] = useState<"financial" | "weight">("financial");
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [startBalance, setStartBalance] = useState("");
  const [startWeight, setStartWeight] = useState("");
  const [checkDays, setCheckDays] = useState("7");

  const fieldCls =
    "min-h-[44px] w-full rounded-xl border border-sprout-100 bg-surface px-3 text-sm text-ink placeholder-ink-subtle focus:border-sprout-400 dark:border-sprout-900 dark:bg-surface-dark dark:text-surface dark:placeholder-surface-muted";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tgt = Number(target);
    if (!title.trim() || !Number.isFinite(tgt) || tgt <= 0) return;
    if (gtype === "weight") {
      const st = Number(startWeight);
      const base = Number.isFinite(st) && st > 0 ? st : tgt;
      const every = Number(checkDays);
      onCreate(title.trim(), "weight", {
        target: tgt,
        start: base,
        direction: tgt < base ? "loss" : "gain",
        checkEveryDays: Number.isFinite(every) && every > 0 ? every : 7,
      });
    } else {
      const bal = Number(startBalance);
      onCreate(title.trim(), "financial", {
        target: tgt,
        ...(Number.isFinite(bal) ? { startingBalance: bal } : {}),
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-pop-in grid gap-3 rounded-2xl border border-sprout-100 bg-surface p-4 dark:border-sprout-900 dark:bg-surface-dark-muted"
    >
      <div className="flex rounded-full border border-sprout-100 bg-surface-muted p-1 dark:border-sprout-900 dark:bg-surface-dark">
        <TypeChip
          active={gtype === "financial"}
          onClick={() => setGtype("financial")}
          label={t("goal.financial")}
        />
        <TypeChip
          active={gtype === "weight"}
          onClick={() => setGtype("weight")}
          label={t("goal.weight")}
        />
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("goal.titlePlaceholder")}
        aria-label={t("goal.titlePlaceholder")}
        className={fieldCls}
        required
      />
      {gtype === "financial" ? (
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="decimal"
            value={startBalance}
            onChange={(e) => setStartBalance(e.target.value)}
            placeholder={t("goals.startBalance")}
            aria-label={t("goals.startBalance")}
            className={fieldCls}
          />
          <input
            type="number"
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder={`${t("goal.target")} (${t("goal.currency")})`}
            aria-label={t("goal.target")}
            className={fieldCls}
            required
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              inputMode="decimal"
              value={startWeight}
              onChange={(e) => setStartWeight(e.target.value)}
              placeholder={`${t("goal.startWeight")} (${t("goal.kg")})`}
              aria-label={t("goal.startWeight")}
              className={fieldCls}
            />
            <input
              type="number"
              inputMode="decimal"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={`${t("goal.target")} (${t("goal.kg")})`}
              aria-label={t("goal.target")}
              className={fieldCls}
              required
            />
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-ink-subtle dark:text-surface-muted">
              {t("goals.logFrequency")}
            </span>
            <select
              value={checkDays}
              onChange={(e) => setCheckDays(e.target.value)}
              className={fieldCls}
            >
              <option value="1">{t("goals.everyDay")}</option>
              <option value="3">{t("goals.every3Days")}</option>
              <option value="7">{t("goals.every7Days")}</option>
              <option value="14">{t("goals.every14Days")}</option>
            </select>
          </label>
        </>
      )}
      <p className="text-xs text-ink-subtle dark:text-surface-muted">
        {t("goals.autoTaskHint")}
      </p>
      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-sprout-600 text-sm font-bold text-white hover:bg-sprout-700"
        >
          <Target size={15} aria-hidden="true" />
          {t("goal.create")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 text-sm font-semibold text-ink-muted"
        >
          {t("goal.cancel")}
        </button>
      </div>
    </form>
  );
}

function TypeChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-[36px] flex-1 items-center justify-center rounded-full px-3 text-xs font-bold transition-all ${
        active
          ? "bg-surface text-sprout-700 shadow-sm dark:bg-surface-dark-muted dark:text-sprout-300"
          : "text-ink-subtle dark:text-surface-muted"
      }`}
    >
      {label}
    </button>
  );
}
