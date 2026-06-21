import { useMemo, useState } from "react";
import { Heart, Smile, CloudSun, BatteryMedium } from "lucide-react";
import { AppState, MoodKey, setMoodLog } from "../lib/store";
import { todayISO } from "../lib/dates";
import { useT } from "../lib/i18n";

type Props = {
  state: AppState;
  setState: (s: AppState) => void;
};

const MOODS: { key: MoodKey; src: string; tone: string }[] = [
  { key: "happy", src: "/sprout-success.png", tone: "bg-sprout-50 text-sprout-700" },
  { key: "calm", src: "/sprout-neutral.png", tone: "bg-sky-50 text-sky-700" },
  { key: "tired", src: "/sprout-rest.png", tone: "bg-amber-50 text-amber-700" },
  { key: "sad", src: "/sprout-fail.png", tone: "bg-red-50 text-red-600" },
  { key: "stressed", src: "/sprout-work.png", tone: "bg-orange-50 text-orange-700" },
];

export default function MoodView({ state, setState }: Props) {
  const { t } = useT();
  const today = todayISO();
  const existing = state.moodLogs[today];
  const [mood, setMood] = useState<MoodKey>(existing?.mood ?? "calm");
  const [energy, setEnergy] = useState(existing?.energy ?? 3);
  const [gratitude, setGratitude] = useState(existing?.gratitude ?? "");
  const [vent, setVent] = useState(existing?.vent ?? "");
  const week = useMemo(() => lastSevenDays(today), [today]);
  const selectedMood = MOODS.find((item) => item.key === mood) ?? MOODS[1];

  function saveMood() {
    setState(setMoodLog(state, today, { mood, energy, gratitude, vent }));
  }

  return (
    <div className="mx-auto min-h-full w-full max-w-6xl px-4 py-5 lg:px-8 lg:py-8">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
          {t("mood.kicker")}
        </p>
        <h1 className="font-sans text-3xl font-bold text-ink dark:text-surface">
          {t("nav.mood")}
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-3xl border border-sprout-100 bg-surface p-5 dark:border-sprout-900 dark:bg-surface-dark-muted sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
            <div className="flex flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-sprout-50 to-surface-muted p-5 text-center dark:from-sprout-950/40 dark:to-surface-dark">
              <img
                src={selectedMood.src}
                alt=""
                aria-hidden="true"
                className="h-32 w-32 object-contain"
                style={{ animation: "streak-float 4.6s ease-in-out infinite" }}
              />
              <p className="mt-3 text-sm font-bold text-sprout-700 dark:text-sprout-300">
                {t(`mood.${mood}`)}
              </p>
              <p className="mt-1 text-xs text-ink-subtle dark:text-surface-muted">
                {t("mood.reflect")}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <h2 className="flex items-center gap-2 text-base font-bold text-ink dark:text-surface">
                  <Smile size={18} className="text-sprout-600" />
                  {t("mood.checkin")}
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {MOODS.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      data-flat
                      aria-pressed={mood === item.key}
                      onClick={() => setMood(item.key)}
                      className={`min-h-[44px] rounded-2xl border px-3 py-2 text-sm font-bold transition-colors ${
                        mood === item.key
                          ? "border-sprout-300 bg-sprout-50 text-sprout-700 dark:border-sprout-700 dark:bg-sprout-950 dark:text-sprout-300"
                          : "border-sprout-100 bg-surface-muted text-ink-muted dark:border-sprout-900 dark:bg-surface-dark dark:text-surface-muted"
                      }`}
                    >
                      {t(`mood.${item.key}`)}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-2">
                <span className="flex items-center gap-2 text-sm font-bold text-ink dark:text-surface">
                  <BatteryMedium size={17} className="text-sprout-600" />
                  {t("mood.energy", { n: energy })}
                </span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="accent-sprout-600"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-ink dark:text-surface">
                  {t("mood.gratitude")}
                </span>
                <input
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  placeholder={t("mood.gratitudePlaceholder")}
                  className="min-h-[44px] rounded-2xl border border-sprout-100 bg-surface-muted px-4 py-3 text-sm dark:border-sprout-900 dark:bg-surface-dark"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-ink dark:text-surface">
                  {t("mood.vent")}
                </span>
                <textarea
                  value={vent}
                  onChange={(e) => setVent(e.target.value)}
                  placeholder={t("mood.ventPlaceholder")}
                  rows={4}
                  className="resize-none rounded-2xl border border-sprout-100 bg-surface-muted px-4 py-3 text-sm dark:border-sprout-900 dark:bg-surface-dark"
                />
              </label>

              <button
                type="button"
                onClick={saveMood}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-sprout-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sprout-700"
              >
                <Heart size={17} />
                {t("mood.save")}
              </button>
            </div>
          </div>
        </section>

        <aside className="flex flex-col gap-5">
          <section className="rounded-2xl border border-sprout-100 bg-surface p-5 dark:border-sprout-900 dark:bg-surface-dark-muted">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink dark:text-surface">
              <CloudSun size={18} className="text-sprout-600" />
              {t("mood.week")}
            </h2>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {week.map((date) => {
                const log = state.moodLogs[date];
                const item = log
                  ? MOODS.find((entry) => entry.key === log.mood)
                  : undefined;
                return (
                  <div key={date} className="flex flex-col items-center gap-1">
                    <div
                      className={`flex aspect-square w-full items-center justify-center rounded-xl ${
                        item?.tone ?? "bg-surface-muted text-ink-subtle dark:bg-surface-dark"
                      }`}
                      title={date}
                    >
                      {log ? log.energy : ""}
                    </div>
                    <span className="text-[10px] text-ink-subtle dark:text-surface-muted">
                      {date.slice(8)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function lastSevenDays(today: string): string[] {
  const [y, m, d] = today.split("-").map(Number);
  const pad = (value: number) => String(value).padStart(2, "0");
  return Array.from({ length: 7 }, (_, index) => {
    const dt = new Date(y, m - 1, d - (6 - index));
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  });
}
