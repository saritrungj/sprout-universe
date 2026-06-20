import { useRef, useState } from "react";
import {
  Moon,
  Sun,
  Bell,
  Sparkles,
  Leaf,
  Repeat2,
  Download,
  Upload,
  RotateCcw,
  DatabaseBackup,
} from "lucide-react";
import {
  AppState,
  MascotKey,
  defaultState,
  setZenMode,
  setMascot,
  setReminders,
  setSound,
  setTheme,
} from "../lib/store";
import { playSound } from "../lib/sound";
import { getStreak, getDaysTended, getRecommendedReminderTime } from "../lib/status";
import { exportBackup, parseBackup, backupFilename } from "../lib/storage";
import {
  notifSupported,
  notifPermission,
  requestNotif,
} from "../lib/useReminders";
import { useT } from "../lib/i18n";
import TaskManager from "./TaskManager";

type Props = {
  state: AppState;
  setState: (s: AppState) => void;
};

const MASCOTS: MascotKey[] = [
  "neutral",
  "success",
  "streak",
  "rest",
  "progress",
  "empty",
  "work",
];

export default function SettingsView({ state, setState }: Props) {
  const { t } = useT();
  const { settings } = state;
  const streak = getStreak(state);
  const tended = getDaysTended(state);
  const recommendedReminder = getRecommendedReminderTime(state);
  const [notifState, setNotifState] =
    useState<NotificationPermission>(notifPermission());
  // Bump to replay the companion's hop animation on tap.
  const [playKey, setPlayKey] = useState(0);

  // Backup & restore
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [backupMsg, setBackupMsg] = useState<{ text: string; ok: boolean }>();

  function handleExport() {
    const blob = new Blob([exportBackup(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = backupFilename();
    a.click();
    URL.revokeObjectURL(url);
    setBackupMsg({ text: t("settings.exportOk"), ok: true });
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-importing the same file
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const next = parseBackup(String(reader.result ?? ""));
      if (next) {
        setState(next);
        setBackupMsg({ text: t("settings.importOk"), ok: true });
      } else {
        setBackupMsg({ text: t("settings.importErr"), ok: false });
      }
    };
    reader.onerror = () =>
      setBackupMsg({ text: t("settings.importErr"), ok: false });
    reader.readAsText(file);
  }

  function handleReset() {
    setState(defaultState);
    try {
      localStorage.removeItem("sprout-planner:aiplan");
    } catch {
      /* ignore */
    }
    setConfirmReset(false);
    setBackupMsg({ text: t("settings.resetOk"), ok: true });
  }

  async function toggleReminders() {
    if (!settings.reminders.enabled) {
      const perm = await requestNotif();
      setNotifState(perm);
      if (perm !== "granted") return;
      setState(setReminders(state, { ...settings.reminders, enabled: true }));
    } else {
      setState(setReminders(state, { ...settings.reminders, enabled: false }));
    }
  }

  function changeReminderTime(time: string) {
    setState(setReminders(state, { ...settings.reminders, time }));
  }

  return (
    <div className="mx-auto min-h-full w-full max-w-6xl px-4 py-5 lg:px-8 lg:py-8">
      <header className="mb-8">
        <h1 className="font-sans text-3xl font-bold text-ink dark:text-surface">
          {t("settings.title")}
        </h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-surface-muted">
          {t("settings.subtitle")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Recurring tasks */}
          <Section
            icon={<Repeat2 size={18} aria-hidden="true" />}
            title={t("taskmgr.title")}
            desc={t("settings.recurringDesc")}
          >
            <TaskManager state={state} setState={setState} embedded />
          </Section>

          {/* Preferences */}
          <Section
            icon={<Sparkles size={18} aria-hidden="true" />}
            title={t("settings.preferences")}
          >
            <div className="flex flex-col divide-y divide-sprout-100 dark:divide-sprout-950">
              <Row
                title={t("settings.sound")}
                desc={t("settings.soundDesc")}
                control={
                  <Toggle
                    checked={settings.sound !== false}
                    onChange={(v) => {
                      setState(setSound(state, v));
                      if (v) playSound("complete", true);
                    }}
                    label={t("settings.sound")}
                  />
                }
              />
              <Row
                title={t("settings.zen")}
                desc={t("settings.zenDesc")}
                control={
                  <Toggle
                    checked={settings.zenMode}
                    onChange={(v) => setState(setZenMode(state, v))}
                    label={t("settings.zen")}
                  />
                }
              />
              <Row
                title={t("settings.reminders")}
                desc={t("settings.remindersDesc")}
                control={
                  <Toggle
                    checked={settings.reminders.enabled}
                    onChange={toggleReminders}
                    label={t("settings.reminders")}
                  />
                }
              >
                {settings.reminders.enabled && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Bell
                      size={15}
                      aria-hidden="true"
                      className="text-sprout-600 dark:text-sprout-400"
                    />
                    <label className="text-sm text-ink-muted dark:text-surface-muted">
                      {t("settings.reminderTime")}
                    </label>
                    <input
                      type="time"
                      value={settings.reminders.time}
                      onChange={(e) => changeReminderTime(e.target.value)}
                      className="rounded-xl border border-gray-200 bg-surface px-3 py-1.5 text-sm text-ink focus:border-sprout-400 dark:border-gray-700 dark:bg-surface-dark dark:text-surface"
                    />
                    <select
                      value={settings.reminders.mode ?? "fixed"}
                      onChange={(e) =>
                        setState(
                          setReminders(state, {
                            ...settings.reminders,
                            mode: e.target.value as "fixed" | "smart",
                          }),
                        )
                      }
                      className="min-h-[40px] rounded-xl border border-sprout-100 bg-surface px-3 py-1.5 text-sm text-ink dark:border-sprout-900 dark:bg-surface-dark dark:text-surface"
                    >
                      <option value="fixed">{t("settings.reminderFixed")}</option>
                      <option value="smart">{t("settings.reminderSmart")}</option>
                    </select>
                    {settings.reminders.mode === "smart" && (
                      <span className="text-xs font-semibold text-sprout-700 dark:text-sprout-300">
                        {t("settings.reminderRecommended", {
                          time: recommendedReminder,
                        })}
                      </span>
                    )}
                  </div>
                )}
                {!notifSupported() && (
                  <p className="mt-2 text-xs text-ink-subtle dark:text-surface-muted">
                    {t("settings.notifUnsupported")}
                  </p>
                )}
                {notifSupported() && notifState === "denied" && (
                  <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                    {t("settings.notifBlocked")}
                  </p>
                )}
              </Row>
            </div>
          </Section>

          {/* Appearance */}
          <Section
            icon={<Leaf size={18} aria-hidden="true" />}
            title={t("settings.appearance")}
          >
            <Row
              title={t("settings.themeLabel")}
              control={
                <div className="flex rounded-full border border-sprout-100 bg-surface-muted p-1 dark:border-sprout-900 dark:bg-surface-dark">
                  <ThemeChip
                    active={settings.theme === "light"}
                    onClick={() => setState(setTheme(state, "light"))}
                    icon={<Sun size={15} aria-hidden="true" />}
                    label={t("settings.themeLight")}
                  />
                  <ThemeChip
                    active={settings.theme === "dark"}
                    onClick={() => setState(setTheme(state, "dark"))}
                    icon={<Moon size={15} aria-hidden="true" />}
                    label={t("settings.themeDark")}
                  />
                </div>
              }
            />
          </Section>

          {/* Backup & restore */}
          <Section
            icon={<DatabaseBackup size={18} aria-hidden="true" />}
            title={t("settings.backup")}
            desc={t("settings.backupDesc")}
          >
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-sprout-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sprout-700"
              >
                <Download size={16} aria-hidden="true" />
                {t("settings.export")}
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-sprout-200 bg-surface px-4 py-2 text-sm font-semibold text-sprout-700 transition-colors hover:bg-sprout-50 dark:border-sprout-800 dark:bg-surface-dark-muted dark:text-sprout-300 dark:hover:bg-sprout-950"
              >
                <Upload size={16} aria-hidden="true" />
                {t("settings.import")}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                onChange={handleImportFile}
                className="hidden"
              />

              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmReset(true);
                    setBackupMsg(undefined);
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-red-200 bg-surface px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/60 dark:bg-surface-dark-muted dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  {t("settings.reset")}
                </button>
              ) : (
                <span className="inline-flex flex-wrap items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900/60 dark:bg-red-950/30">
                  <span className="text-xs font-medium text-red-700 dark:text-red-300">
                    {t("settings.resetConfirm")}
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex min-h-[40px] items-center rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    {t("settings.resetConfirmYes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="inline-flex min-h-[40px] items-center rounded-lg px-3 py-1.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted dark:text-surface-muted dark:hover:bg-surface-dark"
                  >
                    {t("settings.cancel")}
                  </button>
                </span>
              )}
            </div>

            {backupMsg && (
              <p
                role="status"
                className={`mt-3 text-sm font-medium ${
                  backupMsg.ok
                    ? "text-sprout-700 dark:text-sprout-300"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {backupMsg.text}
              </p>
            )}
          </Section>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Companion picker */}
          <div className="overflow-hidden rounded-2xl border border-sprout-100 bg-gradient-to-b from-sprout-50 to-surface p-5 dark:border-sprout-900 dark:from-sprout-950/50 dark:to-surface-dark-muted">
            <div className="flex flex-col items-center text-center">
              {/* Tap the buddy to make it hop */}
              <button
                type="button"
                onClick={() => setPlayKey((k) => k + 1)}
                aria-label={t("settings.companionPlay")}
                title={t("settings.companionPlay")}
                className="group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sprout-400 focus-visible:ring-offset-2 focus-visible:ring-offset-sprout-50 dark:focus-visible:ring-offset-surface-dark-muted"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2 bottom-3 -z-10 h-4 rounded-full bg-sprout-300/30 blur-xl dark:bg-sprout-600/25"
                />
                <span
                  className="block"
                  style={{ animation: "streak-float 4.6s ease-in-out infinite" }}
                >
                  <img
                    key={`${settings.mascot}-${playKey}`}
                    src={`/sprout-${settings.mascot}.png`}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    className="animate-hop h-28 w-28 object-contain drop-shadow-[0_14px_24px_rgba(22,101,52,0.18)] transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
                  />
                </span>
              </button>
              <h2 className="mt-2 text-base font-bold text-sprout-800 dark:text-sprout-200">
                {t(`mascot.${settings.mascot}`)}
              </h2>
              <p className="mt-1 text-xs text-ink-muted dark:text-surface-muted">
                {t("settings.companionPlay")}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {MASCOTS.map((key) => {
                const selected = settings.mascot === key;
                return (
                  <button
                    key={key}
                    onClick={() => setState(setMascot(state, key))}
                    aria-pressed={selected}
                    aria-label={t(`mascot.${key}`)}
                    title={t(`mascot.${key}`)}
                    className={`group flex aspect-square items-center justify-center rounded-xl border p-1 transition-all duration-200 hover:-translate-y-0.5 active:scale-95
                      ${
                        selected
                          ? "border-sprout-400 bg-surface ring-2 ring-sprout-300 dark:border-sprout-600 dark:bg-surface-dark dark:ring-sprout-700"
                          : "border-transparent bg-surface/60 hover:bg-surface hover:shadow-sm dark:bg-surface-dark/40 dark:hover:bg-surface-dark"
                      }`}
                  >
                    <img
                      key={selected ? `sel-${key}` : key}
                      src={`/sprout-${key}.png`}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-contain transition-transform duration-200 group-hover:scale-110 ${
                        selected ? "animate-wiggle" : ""
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats snippet */}
          <div className="flex items-center gap-4 rounded-2xl border border-sprout-100 bg-surface p-4 dark:border-sprout-900 dark:bg-surface-dark-muted">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sprout-100 text-sprout-700 dark:bg-sprout-950 dark:text-sprout-300">
              <Leaf size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
                {t("settings.daysTended")}
              </p>
              <p className="font-sans text-3xl font-bold text-ink dark:text-surface tabular-nums">
                {tended}
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
                {t("streak.best")}
              </p>
              <p className="text-lg font-bold text-sprout-600 dark:text-sprout-400 tabular-nums">
                {streak.best}
                {t("unit.dayShort")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-sprout-100 bg-surface p-5 dark:border-sprout-900 dark:bg-surface-dark-muted">
      <div className="mb-4 flex items-start gap-2">
        <span className="mt-0.5 text-ink-subtle dark:text-surface-muted">
          {icon}
        </span>
        <div>
          <h2 className="text-base font-bold text-ink dark:text-surface">
            {title}
          </h2>
          {desc && (
            <p className="text-xs text-ink-subtle dark:text-surface-muted">
              {desc}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function Row({
  title,
  desc,
  control,
  children,
}: {
  title: string;
  desc?: string;
  control: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink dark:text-surface">
            {title}
          </p>
          {desc && (
            <p className="mt-0.5 max-w-sm text-xs text-ink-muted dark:text-surface-muted">
              {desc}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">{control}</div>
      </div>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full border transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sprout-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-surface-dark ${
        checked
          ? "border-sprout-500 bg-sprout-500"
          : "border-sprout-200 bg-sprout-100 dark:border-sprout-700 dark:bg-surface-dark"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-1 ring-black/10 transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function ThemeChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
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
