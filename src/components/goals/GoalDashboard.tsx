import { useRef, useState } from "react";
import {
  Download,
  Share2,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { AppState } from "../../lib/store";
import {
  GoalMeta,
  getFinancialRows,
  getWeightRows,
  getMonthlyFinancialSummary,
  getCurrentBalance,
  financialProgressPercent,
  weightProgressPercent,
  formatMoney,
  formatWeight,
} from "../../lib/goals";
import { currentMonth, formatMonthLabel } from "../../lib/dates";
import {
  captureDashboardBlob,
  downloadBlob,
  shareBlob,
  goalExportFilename,
} from "../../lib/goalExport";
import { useT } from "../../lib/i18n";
import { useProcessing } from "../../lib/useProcessing";
import LoadingOverlay from "../LoadingOverlay";

type Props = {
  state: AppState;
  taskId: string;
  meta: GoalMeta;
};

export default function GoalDashboard({ state, taskId, meta }: Props) {
  const { t, locale } = useT();
  const exportRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"save" | "share" | null>(null);
  const [msg, setMsg] = useState("");
  const { processing, run } = useProcessing();
  const month = currentMonth();

  async function handleExport(mode: "save" | "share") {
    if (!exportRef.current || busy) return;
    setBusy(mode);
    setMsg("");
    try {
      const blob = await run(t("proc.exportImage"), () =>
        captureDashboardBlob(exportRef.current!, goalExportFilename(meta.title)),
      );
      const filename = goalExportFilename(meta.title);
      if (mode === "save") {
        downloadBlob(blob, filename);
        setMsg(t("dash.saved"));
      } else {
        const result = await shareBlob(blob, filename, meta.title);
        if (result === "downloaded") setMsg(t("dash.shareFallback"));
        else if (result === "shared") setMsg(t("dash.shared"));
      }
    } catch {
      setMsg(t("dash.imgError"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <LoadingOverlay
        open={!!processing}
        progress={processing?.progress ?? 0}
        message={processing?.message ?? ""}
      />

      <div
        className="flex flex-wrap items-center justify-end gap-2"
        data-export-hide
      >
        {msg && (
          <span
            role="status"
            className="mr-auto text-xs font-medium text-sprout-700 dark:text-sprout-300"
          >
            {msg}
          </span>
        )}
        <button
          type="button"
          onClick={() => handleExport("save")}
          disabled={busy !== null}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-sprout-200 bg-surface px-3.5 py-2 text-xs font-semibold text-sprout-700 disabled:opacity-60 dark:border-sprout-800 dark:bg-surface-dark-muted dark:text-sprout-300"
        >
          {busy === "save" ? (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <Download size={14} aria-hidden="true" />
          )}
          {t("dash.save")}
        </button>
        <button
          type="button"
          onClick={() => handleExport("share")}
          disabled={busy !== null}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-sprout-600 px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {busy === "share" ? (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <Share2 size={14} aria-hidden="true" />
          )}
          {t("dash.share")}
        </button>
      </div>

      <div
        ref={exportRef}
        className="flex flex-col gap-4 rounded-3xl border border-sprout-100 bg-surface p-5 dark:border-sprout-900 dark:bg-surface-dark-muted"
      >
        <header>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
            {meta.type === "financial" ? t("goal.financial") : t("goal.weight")}
          </p>
          <h2 className="font-sans text-xl font-bold text-ink dark:text-surface">
            {meta.title}
          </h2>
          <p className="text-sm text-ink-muted dark:text-surface-muted">
            {formatMonthLabel(month, locale)}
          </p>
        </header>

        {meta.type === "financial" ? (
          <FinancialDashboard
            state={state}
            taskId={taskId}
            meta={meta}
            month={month}
          />
        ) : (
          <WeightDashboard state={state} taskId={taskId} meta={meta} />
        )}

        <footer className="border-t border-sprout-100 pt-3 text-center text-xs text-ink-subtle dark:border-sprout-900 dark:text-surface-muted">
          sprout-planner · {meta.title}
        </footer>
      </div>
    </div>
  );
}

function FinancialDashboard({
  state,
  taskId,
  meta,
  month,
}: {
  state: AppState;
  taskId: string;
  meta: GoalMeta;
  month: string;
}) {
  const { t } = useT();
  const summary = getMonthlyFinancialSummary(state, taskId, month);
  const rows = getFinancialRows(state, taskId);
  const balance = getCurrentBalance(state, taskId);
  const target = meta.config.target ?? 0;
  const percent = financialProgressPercent(state, taskId);

  const chartData = summary.trend.map((p) => ({
    date: p.date.slice(8),
    balance: p.balance,
  }));

  const barData = rows
    .filter((r) => r.date.startsWith(month))
    .map((r) => ({
      date: r.date.slice(8),
      income: r.income,
      expense: r.expense,
    }));

  const trendIcon =
    summary.netBalance > 0 ? (
      <TrendingUp className="text-sprout-600" size={16} aria-hidden="true" />
    ) : summary.netBalance < 0 ? (
      <TrendingDown className="text-red-500" size={16} aria-hidden="true" />
    ) : (
      <Minus className="text-ink-subtle" size={16} aria-hidden="true" />
    );

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label={t("goals.totalIncome")}
          value={formatMoney(summary.totalIncome, t("goal.currency"))}
        />
        <StatCard
          label={t("goals.totalExpense")}
          value={formatMoney(summary.totalExpense, t("goal.currency"))}
        />
        <StatCard
          label={t("goals.netMonth")}
          value={formatMoney(summary.netBalance, t("goal.currency"))}
          icon={trendIcon}
        />
        <StatCard
          label={t("goals.currentBalance")}
          value={formatMoney(balance, t("goal.currency"))}
          accent
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-semibold text-ink-muted dark:text-surface-muted">
            {t("goals.progressTarget")}
          </span>
          <span className="font-bold tabular-nums text-sprout-600 dark:text-sprout-400">
            {percent}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-sprout-100 dark:bg-sprout-950">
          <div
            className="h-full rounded-full bg-sprout-500 transition-[width] duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-ink-subtle dark:text-surface-muted">
          {formatMoney(balance, t("goal.currency"))} /{" "}
          {formatMoney(target, t("goal.currency"))}
        </p>
      </div>

      {chartData.length > 0 && (
        <ChartCard title={t("goals.balanceTrend")}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#6b8c76" />
              <YAxis tick={{ fontSize: 11 }} stroke="#6b8c76" width={48} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #dcfce7",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#16a34a"
                strokeWidth={2}
                fill="url(#balanceGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {barData.length > 0 && (
        <ChartCard title={t("goals.incomeExpense")}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#6b8c76" />
              <YAxis tick={{ fontSize: 11 }} stroke="#6b8c76" width={48} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #dcfce7",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </>
  );
}

function WeightDashboard({
  state,
  taskId,
  meta,
}: {
  state: AppState;
  taskId: string;
  meta: GoalMeta;
}) {
  const { t } = useT();
  const rows = getWeightRows(state, taskId);
  const target = meta.config.target ?? 0;
  const start =
    "start" in meta.config && typeof meta.config.start === "number"
      ? meta.config.start
      : rows[0]?.value;
  const current = rows[rows.length - 1]?.value;
  const percent = weightProgressPercent(state, taskId);

  const chartData = rows.map((r) => ({
    date: r.date.slice(5),
    weight: r.value,
  }));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {start !== undefined && (
          <StatCard
            label={t("goal.start")}
            value={formatWeight(start, t("goal.kg"))}
          />
        )}
        {current !== undefined && (
          <StatCard
            label={t("goal.current")}
            value={formatWeight(current, t("goal.kg"))}
            accent
          />
        )}
        <StatCard
          label={t("goal.target")}
          value={formatWeight(target, t("goal.kg"))}
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-semibold text-ink-muted dark:text-surface-muted">
            {t("goals.progressTarget")}
          </span>
          <span className="font-bold tabular-nums text-sprout-600 dark:text-sprout-400">
            {percent}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-sprout-100 dark:bg-sprout-950">
          <div
            className="h-full rounded-full bg-sprout-500 transition-[width] duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {chartData.length > 0 && (
        <ChartCard title={t("goals.weightTrend")}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#6b8c76" />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 11 }}
                stroke="#6b8c76"
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #dcfce7",
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                y={target}
                stroke="#86efac"
                strokeDasharray="4 4"
                label={{
                  value: t("goal.target"),
                  fontSize: 10,
                  fill: "#6b8c76",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={{ fill: "#16a34a", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {rows.length === 0 && (
        <p className="text-center text-sm text-ink-muted dark:text-surface-muted">
          {t("goals.noRecords")}
        </p>
      )}
    </>
  );
}

function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-sprout-100 bg-surface-muted px-3 py-2.5 dark:border-sprout-950 dark:bg-surface-dark">
      <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
        {label}
        {icon}
      </p>
      <p
        className={`mt-0.5 text-sm font-bold tabular-nums ${
          accent
            ? "text-sprout-600 dark:text-sprout-400"
            : "text-ink dark:text-surface"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-sprout-100 bg-surface-muted p-3 dark:border-sprout-950 dark:bg-surface-dark">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted dark:text-surface-muted">
        {title}
      </h3>
      {children}
    </div>
  );
}
