import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppState } from "../lib/store";
import {
  buildMonthGrid,
  currentMonth,
  prevMonth,
  nextMonth,
  formatMonthLabel,
  todayISO,
  weekdayLabels,
} from "../lib/dates";
import { getDayStatus, statusStyles, DayStatus } from "../lib/status";
import { useT } from "../lib/i18n";
import DayEditor from "./DayEditor";

type Props = {
  state: AppState;
  setState: (s: AppState) => void;
};

function DayStamp({
  status,
  date,
  today,
}: {
  status: DayStatus;
  date: string;
  today: string;
}) {
  const isToday = date === today;
  const base =
    "w-full aspect-square rounded-xl flex items-center justify-center text-xs font-semibold transition-all";
  const st = statusStyles[status];
  const todayRing =
    isToday && status === "neutral"
      ? "ring-2 ring-sprout-300 dark:ring-sprout-600"
      : "";

  if (status === "complete")
    return (
      <div
        className={`${base} ${st.stamp} ${isToday ? "ring-2 ring-sprout-300" : ""}`}
        aria-hidden="true"
      >
        ✓
      </div>
    );
  if (status === "missed")
    return (
      <div
        className={`${base} ${st.stamp} ${isToday ? "ring-2 ring-red-300" : ""}`}
        aria-hidden="true"
      >
        ✕
      </div>
    );
  if (status === "in-progress")
    return (
      <div
        className={`${base} ${st.stamp} ring-2 ring-amber-300`}
        aria-hidden="true"
      >
        …
      </div>
    );
  return <div className={`${base} ${todayRing}`} aria-hidden="true" />;
}

export default function CalendarView({ state, setState }: Props) {
  const { t, locale } = useT();
  const [month, setMonth] = useState(currentMonth());
  const [selected, setSelected] = useState<string | null>(null);
  const today = todayISO();
  const grid = buildMonthGrid(month);
  const dayLabels = weekdayLabels(locale, "short");

  const statusName: Record<DayStatus, string> = {
    complete: t("cal.complete"),
    missed: t("cal.missed"),
    "in-progress": t("cal.inProgress"),
    neutral: "",
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-xl mx-auto w-full">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMonth(prevMonth(month))}
          aria-label={t("cal.prev")}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-sprout-50 dark:hover:bg-sprout-950 text-ink-muted dark:text-surface-muted transition-colors"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <h2 className="text-lg font-bold font-sans text-ink dark:text-surface">
          {formatMonthLabel(month, locale)}
        </h2>
        <button
          onClick={() => setMonth(nextMonth(month))}
          aria-label={t("cal.next")}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-sprout-50 dark:hover:bg-sprout-950 text-ink-muted dark:text-surface-muted transition-colors"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1" aria-hidden="true">
        {dayLabels.map((d, i) => (
          <div
            key={i}
            className="text-center text-xs text-ink-subtle dark:text-surface-muted font-medium py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className="flex flex-col gap-1"
        role="grid"
        aria-label={formatMonthLabel(month, locale)}
      >
        {grid.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1" role="row">
            {week.map((date, di) => {
              if (!date)
                return <div key={di} role="gridcell" aria-hidden="true" />;
              const status = getDayStatus(state, date);
              const dayNum = parseInt(date.slice(8));
              const statusText = statusName[status]
                ? `, ${statusName[status]}`
                : "";
              return (
                <div key={date} role="gridcell">
                  <button
                    onClick={() => setSelected(date)}
                    aria-label={`${date === today ? t("day.today") + ", " : ""}${date}${statusText}`}
                    className="w-full flex flex-col items-center gap-1 p-1 rounded-xl hover:bg-sprout-50 dark:hover:bg-sprout-950 transition-colors"
                  >
                    <span
                      className={`text-xs font-medium ${
                        date === today
                          ? "text-sprout-600 dark:text-sprout-400 font-bold"
                          : "text-ink-muted dark:text-surface-muted"
                      }`}
                      aria-hidden="true"
                    >
                      {dayNum}
                    </span>
                    <DayStamp status={status} date={date} today={today} />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-4 justify-center pt-2 text-xs text-ink-subtle dark:text-surface-muted"
        aria-hidden="true"
      >
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-sprout-500 inline-block" />{" "}
          {t("cal.complete")}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-100 dark:bg-red-950 inline-block" />{" "}
          {t("cal.missed")}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-950 inline-block" />{" "}
          {t("cal.inProgress")}
        </span>
      </div>

      {selected && (
        <DayEditor
          date={selected}
          state={state}
          setState={setState}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
