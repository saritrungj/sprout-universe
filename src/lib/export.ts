import { toBlob } from "html-to-image";

export type ExportRatio = "9:16" | "16:9";

const SIZES: Record<ExportRatio, { w: number; h: number }> = {
  "9:16": { w: 1080, h: 1920 },
  "16:9": { w: 1920, h: 1080 },
};

/* Brand palette as literal hex — html-to-image rasterizes via an SVG
 * <foreignObject>, so every style must be inline and self-contained (CSS vars
 * and Tailwind classes don't resolve inside the clone). */
const C = {
  bg: "#eef8f1", // surface-muted
  surface: "#f7fdf8", // surface
  border: "#dcfce7", // sprout-100
  ink: "#1a2e1e",
  inkMuted: "#4b6255",
  inkSubtle: "#6b8c76",
  sprout100: "#dcfce7",
  sprout500: "#22c55e",
  sprout600: "#16a34a",
  sprout700: "#15803d",
} as const;

/** Pre-formatted data for one shareable summary card. No app logic lives here. */
export type ExportStat = { label: string; value: string; accent?: boolean };
export type ExportGoalBar = { title: string; percent: number; meta: string };
export type ExportStampCell = { day: number; color: string; today?: boolean } | null;
export type ExportLegend = { label: string; color: string };

export type ExportSummary = {
  title: string;
  monthLabel: string;
  headline: string;
  weekdayLetters: string[];
  stamps: ExportStampCell[]; // flat 6×7 grid, null = padding
  stats: ExportStat[];
  goals: ExportGoalBar[];
  legend: ExportLegend[];
  footer: string;
};

/** Escape dynamic text before it enters an innerHTML template. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function statTile(stat: ExportStat, width: number): string {
  const color = stat.accent ? C.sprout600 : C.ink;
  return `
    <div style="box-sizing:border-box;width:${width}px;background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:20px 22px;">
      <div style="font-size:20px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${C.inkSubtle};">${esc(stat.label)}</div>
      <div style="margin-top:6px;font-size:46px;line-height:1;font-weight:700;color:${color};">${esc(stat.value)}</div>
    </div>`;
}

function statGrid(stats: ExportStat[], tileW: number, gap: number): string {
  return `<div style="display:flex;flex-wrap:wrap;gap:${gap}px;">${stats
    .map((s) => statTile(s, tileW))
    .join("")}</div>`;
}

function goalBar(goal: ExportGoalBar, width: number): string {
  const pct = Math.max(0, Math.min(100, goal.percent));
  return `
    <div style="box-sizing:border-box;width:${width}px;background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:20px 22px;">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;">
        <div style="font-size:24px;font-weight:700;color:${C.ink};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(goal.title)}</div>
        <div style="font-size:30px;font-weight:700;color:${C.sprout600};">${pct}%</div>
      </div>
      <div style="margin-top:12px;height:12px;border-radius:9999px;background:${C.sprout100};overflow:hidden;">
        <div style="height:100%;width:${pct}%;border-radius:9999px;background:${C.sprout500};"></div>
      </div>
      <div style="margin-top:10px;font-size:20px;color:${C.inkMuted};">${esc(goal.meta)}</div>
    </div>`;
}

function stampCard(summary: ExportSummary, cardW: number, cell: number, gap: number): string {
  const cells = summary.stamps
    .map((c) => {
      if (!c) return `<div style="width:${cell}px;height:${cell}px;"></div>`;
      const ring = c.today ? `box-shadow:0 0 0 3px ${C.sprout500};` : "";
      return `
        <div style="position:relative;width:${cell}px;height:${cell}px;border-radius:14px;background:${c.color};${ring}">
          <span style="position:absolute;top:4px;left:7px;font-size:${Math.round(cell * 0.26)}px;font-weight:600;color:${C.inkSubtle};">${c.day}</span>
        </div>`;
    })
    .join("");
  const weekdays = summary.weekdayLetters
    .map(
      (d) =>
        `<div style="width:${cell}px;text-align:center;font-size:20px;font-weight:600;color:${C.inkSubtle};">${esc(d)}</div>`,
    )
    .join("");
  const legend = summary.legend
    .map(
      (l) =>
        `<span style="display:inline-flex;align-items:center;gap:8px;font-size:20px;color:${C.inkMuted};"><span style="width:18px;height:18px;border-radius:6px;background:${l.color};"></span>${esc(l.label)}</span>`,
    )
    .join("");
  return `
    <div style="box-sizing:border-box;width:${cardW}px;background:${C.surface};border:1px solid ${C.border};border-radius:28px;padding:28px;">
      <div style="display:flex;flex-wrap:wrap;gap:${gap}px;margin-bottom:${gap}px;">${weekdays}</div>
      <div style="display:flex;flex-wrap:wrap;gap:${gap}px;">${cells}</div>
      <div style="display:flex;flex-wrap:wrap;gap:24px;justify-content:center;margin-top:28px;">${legend}</div>
    </div>`;
}

function headerBlock(summary: ExportSummary, logo: number): string {
  return `
    <div style="display:flex;align-items:center;gap:18px;">
      <img src="/sprout-logo.png" alt="" style="width:${logo}px;height:${logo}px;object-fit:contain;flex:none;" />
      <div style="line-height:1.15;">
        <div style="font-size:${Math.round(logo * 0.62)}px;font-weight:700;color:${C.sprout700};">${esc(summary.title)}</div>
        <div style="font-size:${Math.round(logo * 0.36)}px;color:${C.inkMuted};margin-top:6px;">${esc(summary.monthLabel)}</div>
      </div>
    </div>`;
}

/** Build the off-screen, fixed-size summary card for the given aspect ratio. */
function buildSummary(summary: ExportSummary, ratio: ExportRatio): HTMLElement {
  const { w, h } = SIZES[ratio];
  const wrapper = document.createElement("div");
  // IMPORTANT: html-to-image renders BLANK for off-screen-positioned nodes
  // (e.g. top:-9999px) in current Chromium. Keep the node on-screen at 0,0 but
  // tuck it behind the opaque app shell with z-index:-1 (never opacity/display:
  // none — those copy onto the clone and blank the capture).
  const pad = ratio === "9:16" ? 64 : 56;
  wrapper.style.cssText = `
    position:fixed;top:0;left:0;z-index:-1;
    width:${w}px;height:${h}px;background:${C.bg};
    box-sizing:border-box;padding:${pad}px;overflow:hidden;pointer-events:none;
    font-family:Roboto,Prompt,'Noto Sans SC','Noto Sans TC',ui-sans-serif,system-ui,sans-serif;
    color:${C.ink};
  `;

  const gap = 16;

  if (ratio === "9:16") {
    const innerW = w - pad * 2;
    const tileW = Math.floor((innerW - gap) / 2);
    const cell = Math.floor((innerW - 56 - gap * 6) / 7);
    wrapper.innerHTML = `
      ${headerBlock(summary, 84)}
      <div style="margin-top:36px;font-size:44px;line-height:1.18;font-weight:700;color:${C.ink};">${esc(summary.headline)}</div>
      <div style="margin-top:32px;">${statGrid(summary.stats, tileW, gap)}</div>
      ${summary.goals.length ? `<div style="margin-top:${gap}px;display:flex;flex-direction:column;gap:${gap}px;">${summary.goals.map((g) => goalBar(g, innerW)).join("")}</div>` : ""}
      <div style="margin-top:28px;">${stampCard(summary, innerW, cell, gap)}</div>
      <div style="margin-top:28px;text-align:center;font-size:22px;color:${C.inkSubtle};">${esc(summary.footer)}</div>
    `;
  } else {
    const innerW = w - pad * 2;
    const colGap = 40;
    const leftW = Math.round(innerW * 0.55);
    const rightW = innerW - colGap - leftW;
    const tileW = Math.floor((leftW - gap) / 2);
    const cell = Math.floor((rightW - 56 - gap * 6) / 7);
    wrapper.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:24px;">
        ${headerBlock(summary, 76)}
        <div style="max-width:${Math.round(innerW * 0.42)}px;text-align:right;font-size:34px;line-height:1.2;font-weight:700;color:${C.ink};">${esc(summary.headline)}</div>
      </div>
      <div style="display:flex;gap:${colGap}px;margin-top:40px;">
        <div style="width:${leftW}px;display:flex;flex-direction:column;gap:${gap}px;">
          ${statGrid(summary.stats, tileW, gap)}
          ${summary.goals.map((g) => goalBar(g, leftW)).join("")}
        </div>
        <div style="width:${rightW}px;">${stampCard(summary, rightW, cell, gap)}</div>
      </div>
      <div style="margin-top:36px;text-align:center;font-size:22px;color:${C.inkSubtle};">${esc(summary.footer)}</div>
    `;
  }

  return wrapper;
}

export function exportFilename(ratio: ExportRatio): string {
  return `sprout-dashboard-${new Date().toISOString().slice(0, 10)}-${ratio.replace(":", "x")}.png`;
}

/** Render the designed summary to a PNG Blob at the requested aspect ratio. */
export async function renderSummaryBlob(
  summary: ExportSummary,
  ratio: ExportRatio,
): Promise<Blob> {
  const { w, h } = SIZES[ratio];
  const wrapper = buildSummary(summary, ratio);
  document.body.appendChild(wrapper);
  // Decode fonts + the same-origin logo before rasterizing so nothing drops.
  try {
    await document.fonts?.ready;
  } catch {
    /* fonts API unavailable — continue */
  }
  await Promise.all(
    Array.from(wrapper.querySelectorAll("img")).map((img) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : img.decode().catch(() => undefined),
    ),
  );
  try {
    const blob = await toBlob(wrapper, {
      width: w,
      height: h,
      pixelRatio: 2,
      backgroundColor: C.bg,
      // The Google Fonts stylesheet is cross-origin, so html-to-image cannot
      // read its rules; skip font embedding (faces are already loaded).
      skipFonts: true,
    });
    if (!blob) throw new Error("Failed to render image");
    return blob;
  } finally {
    document.body.removeChild(wrapper);
  }
}

/** Save a rendered Blob to the user's device. Call only after progress hits 100%. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export type ShareResult = "shared" | "downloaded" | "cancelled";

/**
 * Share a rendered Blob via the Web Share API (native share sheet on mobile),
 * falling back to a download when sharing files isn't supported or is denied.
 */
export async function shareBlob(
  blob: Blob,
  filename: string,
): Promise<ShareResult> {
  const file = new File([blob], filename, { type: "image/png" });
  const nav = navigator as Navigator & {
    canShare?: (data?: ShareData) => boolean;
  };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: "Sprout Planner" });
      return "shared";
    } catch (err) {
      // User dismissed the share sheet — not an error, don't double-download.
      if (err instanceof DOMException && err.name === "AbortError") {
        return "cancelled";
      }
      // Anything else (e.g. lost user-activation): fall through to a download.
    }
  }
  downloadBlob(blob, filename);
  return "downloaded";
}
