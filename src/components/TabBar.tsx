import {
  CalendarDays,
  LayoutDashboard,
  ListChecks,
  LucideIcon,
} from "lucide-react";
import { useT } from "../lib/i18n";

export type Tab = "today" | "calendar" | "dashboard";

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

const tabs: { id: Tab; labelKey: string; Icon: LucideIcon }[] = [
  { id: "today", labelKey: "nav.today", Icon: ListChecks },
  { id: "calendar", labelKey: "nav.calendar", Icon: CalendarDays },
  { id: "dashboard", labelKey: "nav.dashboard", Icon: LayoutDashboard },
];

export default function TabBar({ active, onChange }: Props) {
  const { t } = useT();
  return (
    <nav
      className="mx-auto w-full max-w-2xl px-4 pb-3"
      aria-label="Main navigation"
    >
      <div
        className="grid grid-cols-3 gap-1 rounded-2xl border border-sprout-100 bg-surface-muted p-1 shadow-sm dark:border-sprout-900 dark:bg-surface-dark-muted"
        role="tablist"
      >
        {tabs.map(({ id, labelKey, Icon }) => {
          const selected = active === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              onClick={() => onChange(id)}
              aria-selected={selected}
              aria-current={selected ? "page" : undefined}
              className={`min-h-[52px] rounded-xl px-2 py-2 text-xs font-semibold transition-all
                flex flex-col items-center justify-center gap-1
                ${
                  selected
                    ? "bg-surface text-sprout-700 shadow-[0_8px_20px_rgba(22,101,52,0.12)] ring-1 ring-sprout-100 dark:bg-surface-dark dark:text-sprout-300 dark:ring-sprout-900"
                    : "text-ink-muted hover:bg-surface hover:text-sprout-700 dark:text-surface-muted dark:hover:bg-surface-dark dark:hover:text-sprout-300"
                }`}
            >
              <Icon
                size={19}
                strokeWidth={selected ? 2.4 : 2}
                aria-hidden="true"
              />
              <span className="leading-none">{t(labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
