import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX, CheckCircle2 } from "lucide-react";
import {
  AppState,
  addFocusSession,
  getDayTaskIds,
} from "../lib/store";
import { todayISO } from "../lib/dates";
import { cleanGoalTaskTitle } from "../lib/goals";
import { useT } from "../lib/i18n";

type Props = {
  state: AppState;
  setState: (s: AppState) => void;
};

export default function FocusView({ state, setState }: Props) {
  const { t } = useT();
  const today = todayISO();
  const taskIds = getDayTaskIds(state, today);
  const [taskId, setTaskId] = useState(taskIds[0] ?? "");
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = useState(false);
  const startedAt = useRef<string | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const totalSeconds = (phase === "focus" ? focusMinutes : breakMinutes) * 60;
  const pct = totalSeconds > 0 ? 100 - Math.round((secondsLeft / totalSeconds) * 100) : 0;
  const recent = state.focusSessions.slice(-5).reverse();
  const focusToday = state.focusSessions.filter((session) =>
    session.startedAt.startsWith(today),
  );
  const focusMinutesToday = focusToday
    .filter((session) => session.mode === "focus")
    .reduce((sum, session) => sum + session.minutes, 0);

  const selectedTask = useMemo(() => {
    const task = taskId ? state.tasks[taskId] : undefined;
    if (!task) return "";
    return task.goalTitle ?? cleanGoalTaskTitle(task.title);
  }, [state.tasks, taskId]);

  useEffect(() => {
    setSecondsLeft((phase === "focus" ? focusMinutes : breakMinutes) * 60);
  }, [phase, focusMinutes, breakMinutes]);

  useEffect(() => {
    if (!running) return;
    if (!startedAt.current) startedAt.current = new Date().toISOString();
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value > 1) return value - 1;
        completeSession();
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, phase, focusMinutes, breakMinutes, taskId, state]);

  useEffect(() => {
    if (sound && running) startTone();
    else stopTone();
    return stopTone;
  }, [sound, running]);

  function startTone() {
    if (audioRef.current) return;
    const Audio =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Audio) return;
    const ctx = new Audio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 174;
    gain.gain.value = 0.018;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    audioRef.current = ctx;
    oscRef.current = osc;
  }

  function stopTone() {
    oscRef.current?.stop();
    audioRef.current?.close();
    oscRef.current = null;
    audioRef.current = null;
  }

  function completeSession() {
    const minutes = phase === "focus" ? focusMinutes : breakMinutes;
    setState(
      addFocusSession(state, {
        taskId: taskId || undefined,
        startedAt: startedAt.current ?? new Date().toISOString(),
        endedAt: new Date().toISOString(),
        minutes,
        mode: phase,
      }),
    );
    startedAt.current = null;
    setRunning(false);
    setPhase(phase === "focus" ? "break" : "focus");
  }

  function reset() {
    startedAt.current = null;
    setRunning(false);
    setSecondsLeft((phase === "focus" ? focusMinutes : breakMinutes) * 60);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="mx-auto min-h-full w-full max-w-6xl px-4 py-5 lg:px-8 lg:py-8">
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle dark:text-surface-muted">
            {t("focus.kicker")}
          </p>
          <h1 className="font-sans text-3xl font-bold text-ink dark:text-surface">
            {t("nav.focus")}
          </h1>
        </div>
        <p className="text-sm font-semibold text-sprout-700 dark:text-sprout-300">
          {t("focus.today", { minutes: focusMinutesToday })}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="relative overflow-hidden rounded-3xl border border-sprout-100 bg-gradient-to-b from-sprout-50 to-surface p-6 text-center dark:border-sprout-900 dark:from-sprout-950/50 dark:to-surface-dark-muted sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-full origin-bottom bg-sprout-200/40 transition-transform duration-700 dark:bg-sprout-800/30"
            style={{ transform: `scaleY(${Math.max(0.04, pct / 100)})` }}
          />
          <div className="relative z-10 flex flex-col items-center">
            <img
              src={phase === "focus" ? "/sprout-work.png" : "/sprout-rest.png"}
              alt=""
              aria-hidden="true"
              className="h-36 w-36 object-contain drop-shadow-[0_16px_30px_rgba(22,101,52,0.18)]"
              style={{ animation: "streak-float 4.6s ease-in-out infinite" }}
            />
            <p className="mt-4 text-sm font-bold text-sprout-700 dark:text-sprout-300">
              {phase === "focus" ? t("focus.phaseFocus") : t("focus.phaseBreak")}
            </p>
            <div className="mt-2 font-sans text-7xl font-bold tabular-nums text-ink dark:text-surface sm:text-8xl">
              {mm}:{ss}
            </div>
            <p className="mt-2 min-h-6 text-sm text-ink-muted dark:text-surface-muted">
              {selectedTask || t("focus.noTask")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setRunning((value) => !value)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-sprout-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sprout-700"
              >
                {running ? <Pause size={17} /> : <Play size={17} />}
                {running ? t("focus.pause") : t("focus.start")}
              </button>
              <button
                type="button"
                onClick={completeSession}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-sprout-200 bg-surface px-5 py-2.5 text-sm font-bold text-sprout-700 hover:bg-sprout-50 dark:border-sprout-800 dark:bg-surface-dark-muted dark:text-sprout-300"
              >
                <CheckCircle2 size={17} />
                {t("focus.complete")}
              </button>
              <button
                type="button"
                onClick={reset}
                aria-label={t("focus.reset")}
                title={t("focus.reset")}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-sprout-100 bg-surface text-ink-muted dark:border-sprout-900 dark:bg-surface-dark-muted dark:text-surface-muted"
              >
                <RotateCcw size={17} />
              </button>
              <button
                type="button"
                onClick={() => setSound((value) => !value)}
                aria-pressed={sound}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-sprout-100 bg-surface text-ink-muted dark:border-sprout-900 dark:bg-surface-dark-muted dark:text-surface-muted"
              >
                {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
              </button>
            </div>
          </div>
        </section>

        <aside className="flex flex-col gap-5">
          <section className="rounded-2xl border border-sprout-100 bg-surface p-5 dark:border-sprout-900 dark:bg-surface-dark-muted">
            <h2 className="text-base font-bold text-ink dark:text-surface">
              {t("focus.setup")}
            </h2>
            <label className="mt-4 flex flex-col gap-2 text-sm font-semibold text-ink dark:text-surface">
              {t("focus.task")}
              <select
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                className="min-h-[44px] rounded-xl border border-sprout-100 bg-surface-muted px-3 py-2 text-sm dark:border-sprout-900 dark:bg-surface-dark"
              >
                <option value="">{t("focus.noTask")}</option>
                {taskIds.map((id) => {
                  const task = state.tasks[id];
                  const label = task
                    ? task.goalTitle ?? cleanGoalTaskTitle(task.title)
                    : "";
                  return (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </label>
            <NumberField label={t("focus.focusMinutes")} value={focusMinutes} onChange={setFocusMinutes} />
            <NumberField label={t("focus.breakMinutes")} value={breakMinutes} onChange={setBreakMinutes} />
          </section>

          <section className="rounded-2xl border border-sprout-100 bg-surface p-5 dark:border-sprout-900 dark:bg-surface-dark-muted">
            <h2 className="text-base font-bold text-ink dark:text-surface">
              {t("focus.recent")}
            </h2>
            <div className="mt-3 grid gap-2">
              {recent.length === 0 ? (
                <p className="text-sm text-ink-subtle dark:text-surface-muted">
                  {t("focus.empty")}
                </p>
              ) : (
                recent.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-xl bg-surface-muted px-3 py-2 text-sm text-ink-muted dark:bg-surface-dark dark:text-surface-muted"
                  >
                    <span className="font-bold text-ink dark:text-surface">
                      {session.minutes}m
                    </span>{" "}
                    {session.mode === "focus" ? t("focus.phaseFocus") : t("focus.phaseBreak")}
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mt-4 flex items-center justify-between gap-3 text-sm font-semibold text-ink dark:text-surface">
      {label}
      <input
        type="number"
        min={1}
        max={120}
        value={value}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
        className="min-h-[44px] w-24 rounded-xl border border-sprout-100 bg-surface-muted px-3 py-2 text-sm dark:border-sprout-900 dark:bg-surface-dark"
      />
    </label>
  );
}
