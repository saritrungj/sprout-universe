import {
  ListChecks,
  CalendarDays,
  LayoutDashboard,
  Settings,
  Smile,
  Timer,
  Target,
  LucideIcon,
} from "lucide-react";
import { AppState, Lang } from "../lib/store";
import { useT } from "../lib/i18n";
import LanguageSelect from "./LanguageSelect";
import ThemeToggle from "./ThemeToggle";

export type Tab =
  | "today"
  | "calendar"
  | "focus"
  | "mood"
  | "goals"
  | "dashboard"
  | "settings";

const NAV: { id: Tab; labelKey: string; Icon: LucideIcon }[] = [
  { id: "today", labelKey: "nav.today", Icon: ListChecks },
  { id: "calendar", labelKey: "nav.calendar", Icon: CalendarDays },
  { id: "focus", labelKey: "nav.focus", Icon: Timer },
  { id: "mood", labelKey: "nav.mood", Icon: Smile },
  { id: "goals", labelKey: "nav.goals", Icon: Target },
  { id: "dashboard", labelKey: "nav.dashboard", Icon: LayoutDashboard },
  { id: "settings", labelKey: "nav.settings", Icon: Settings },
];

type NavProps = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

type ShellProps = NavProps & {
  state: AppState;
  onToggleTheme: () => void;
  onChangeLanguage: (lang: Lang) => void;
};

/* ── Desktop: left sidebar ─────────────────────────────────────────── */
export function SideNav({
  active,
  onChange,
  state,
  onToggleTheme,
  onChangeLanguage,
}: ShellProps) {
  const { t } = useT();

  return (
    <nav
      aria-label={t("nav.main")}
      className="fixed left-0 top-0 z-40 hidden h-dvh w-72 flex-col gap-1 border-r border-sprout-100 bg-surface-muted/95 p-4 backdrop-blur-md dark:border-sprout-900 dark:bg-surface-dark-muted/95 lg:flex"
    >
      {/* Brand — Planner is a module of Sprout Universe; the wordmark links home */}
      <a
        href="/"
        aria-label={t("nav.universeHome")}
        className="mb-5 flex items-center gap-2 rounded-2xl px-2 py-1"
      >
        <img
          src="/sprout-logo.png"
          alt=""
          aria-hidden="true"
          className="h-9 w-9 object-contain"
        />
        <span className="flex flex-col leading-none">
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-ink-subtle dark:text-sprout-500">
            Sprout Universe
          </span>
          <span className="font-sans text-lg font-bold text-sprout-700 dark:text-sprout-400">
            Planner
          </span>
        </span>
      </a>

      {/* Links */}
      <div className="flex flex-col gap-1">
        {NAV.map(({ id, labelKey, Icon }) => {
          const selected = active === id;
          return (
            <button
              key={id}
              type="button"
              data-flat
              aria-current={selected ? "page" : undefined}
              onClick={() => onChange(id)}
              className={`flex min-h-[48px] items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all
                ${
                  selected
                    ? "bg-sprout-100 text-sprout-800 dark:bg-sprout-950 dark:text-sprout-200"
                    : "text-ink-muted hover:bg-surface hover:text-sprout-700 dark:text-surface-muted dark:hover:bg-surface-dark dark:hover:text-sprout-300"
                }`}
            >
              <Icon
                size={20}
                strokeWidth={selected ? 2.4 : 2}
                aria-hidden="true"
              />
              {t(labelKey)}
            </button>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="mt-auto flex items-center justify-between gap-1 border-t border-sprout-100 pt-3 dark:border-sprout-900">
        <LanguageSelect
          value={state.settings.language}
          onChange={onChangeLanguage}
        />
        <ThemeToggle theme={state.settings.theme} onToggle={onToggleTheme} />
      </div>
    </nav>
  );
}

/* ── Mobile/tablet: top bar ────────────────────────────────────────── */
export function MobileTopBar({
  state,
  onToggleTheme,
  onChangeLanguage,
}: Omit<ShellProps, "active" | "onChange">) {
  const { t } = useT();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-sprout-100/70 bg-surface/85 px-4 py-3 backdrop-blur-md dark:border-sprout-900/70 dark:bg-surface-dark/85 lg:hidden">
      <a href="/" aria-label={t("nav.universeHome")} className="flex items-center gap-2 rounded-2xl">
        <img
          src="/sprout-logo.png"
          alt=""
          aria-hidden="true"
          className="h-8 w-8 object-contain"
        />
        <span className="flex flex-col leading-none">
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-ink-subtle dark:text-sprout-500">
            Sprout Universe
          </span>
          <span className="font-sans text-lg font-bold text-sprout-700 dark:text-sprout-400">
            Planner
          </span>
        </span>
      </a>
      <div className="flex items-center gap-1">
        <LanguageSelect
          value={state.settings.language}
          onChange={onChangeLanguage}
        />
        <ThemeToggle theme={state.settings.theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}

/* ── Mobile/tablet: bottom nav ─────────────────────────────────────── */
export function BottomNav({ active, onChange }: NavProps) {
  const { t } = useT();
  return (
    <nav
      aria-label={t("nav.main")}
      className="fixed inset-x-2 bottom-2 z-50 grid grid-cols-7 rounded-[1.5rem] border border-sprout-100 bg-surface/95 p-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] shadow-[0_16px_40px_rgba(22,101,52,0.14)] backdrop-blur-md dark:border-sprout-900 dark:bg-surface-dark/95 lg:hidden"
    >
      {NAV.map(({ id, labelKey, Icon }) => {
        const selected = active === id;
        return (
          <button
            key={id}
            type="button"
            data-flat
            aria-current={selected ? "page" : undefined}
            onClick={() => onChange(id)}
            className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-[1.2rem] px-0.5 py-1 text-[9px] font-semibold transition-all
              ${
                selected
                  ? "bg-sprout-50 text-sprout-700 shadow-sm dark:bg-sprout-950 dark:text-sprout-300"
                  : "text-ink-subtle hover:bg-surface-muted hover:text-sprout-700 dark:text-surface-muted dark:hover:bg-surface-dark-muted dark:hover:text-sprout-300"
              }`}
          >
            <span
              className={`flex h-7 w-9 items-center justify-center rounded-full transition-colors ${
                selected ? "bg-surface dark:bg-surface-dark" : ""
              }`}
            >
              <Icon
                size={18}
                strokeWidth={selected ? 2.4 : 2}
                aria-hidden="true"
              />
            </span>
            {t(labelKey)}
          </button>
        );
      })}
    </nav>
  );
}
