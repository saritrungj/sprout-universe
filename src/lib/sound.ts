/**
 * Tiny Web Audio chime player — synthesized, no asset files. Used for
 * notification-style moments (daily reminder, all-tasks-done celebration,
 * task ticks, goal logs). Gated by the user's sound setting.
 */

type Sound = "complete" | "notify" | "tap" | "add";

type Pattern = {
  freqs: number[];
  dur: number;
  gap: number;
  type: OscillatorType;
  gain: number;
};

const PATTERNS: Record<Sound, Pattern> = {
  // C5 → E5 → G5 → C6 rising arpeggio — a happy "you finished!" chime
  complete: { freqs: [523.25, 659.25, 783.99, 1046.5], dur: 0.16, gap: 0.08, type: "sine", gain: 0.13 },
  // gentle two-note ping for reminders / notifications
  notify: { freqs: [659.25, 880.0], dur: 0.2, gap: 0.1, type: "sine", gain: 0.12 },
  // soft single blip for ticking a task done
  tap: { freqs: [880.0], dur: 0.09, gap: 0, type: "sine", gain: 0.07 },
  // light up-blip for adding / logging
  add: { freqs: [659.25, 987.77], dur: 0.1, gap: 0.05, type: "sine", gain: 0.09 },
};

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/**
 * Play a short chime. `enabled` lets callers pass the user's sound preference
 * (`state.settings.sound !== false`) so a single check happens at the call site.
 */
export function playSound(kind: Sound, enabled = true): void {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;
  const p = PATTERNS[kind];
  const start = audio.currentTime;
  p.freqs.forEach((freq, i) => {
    const t0 = start + i * (p.dur + p.gap);
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = p.type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(p.gain, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + p.dur);
    osc.connect(gain).connect(audio.destination);
    osc.start(t0);
    osc.stop(t0 + p.dur + 0.03);
  });
}
