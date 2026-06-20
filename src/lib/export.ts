import { toBlob } from "html-to-image";

export type ExportRatio = "9:16" | "16:9";

const SIZES: Record<ExportRatio, { w: number; h: number }> = {
  "9:16": { w: 1080, h: 1920 },
  "16:9": { w: 1920, h: 1080 },
};

/** Build the off-screen, fixed-size export card from the live dashboard. */
function buildWrapper(contentEl: HTMLElement, ratio: ExportRatio): HTMLElement {
  const { w, h } = SIZES[ratio];
  const rootStyle = getComputedStyle(document.documentElement);
  const fontBody =
    rootStyle.getPropertyValue("--font-body").trim() ||
    "Roboto, ui-sans-serif, system-ui, sans-serif";
  const locale = document.documentElement.lang || "en-US";

  // NOTE: block layout only. html-to-image rasterizes via an SVG
  // <foreignObject>, where flexbox (flex:1, %/flex heights) collapses and the
  // content disappears — so everything below uses block flow + explicit sizes.
  // IMPORTANT: html-to-image renders BLANK for off-screen-positioned nodes
  // (e.g. top:-9999px) in current Chromium — the original cause of the "black"
  // export. Keep the capture node on-screen at 0,0 but tuck it behind the
  // opaque app shell with z-index:-1 (do NOT use opacity/visibility — those
  // copy onto the clone and blank the capture).
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: ${w}px;
    height: ${h}px;
    background: #f0fdf4;
    overflow: hidden;
    font-family: ${fontBody};
    padding: 60px;
    box-sizing: border-box;
    pointer-events: none;
  `;

  // Header
  const header = document.createElement("div");
  header.style.cssText =
    "display:flex;align-items:center;gap:12px;margin-bottom:32px;";
  header.innerHTML = `
    <img src="/sprout-logo.png" alt="" style="width:${ratio === "9:16" ? 64 : 56}px;height:${ratio === "9:16" ? 64 : 56}px;object-fit:contain;flex:none;" />
    <div style="line-height:1.15;">
      <div style="font-size:${ratio === "9:16" ? 40 : 32}px;font-weight:700;color:#15803d;">Sprout Planner</div>
      <div style="font-size:${ratio === "9:16" ? 24 : 20}px;color:#4b5563;margin-top:6px;">${new Date().toLocaleDateString(locale, { month: "long", year: "numeric" })}</div>
    </div>
  `;
  wrapper.appendChild(header);

  // Clone the live content (forcing a light surface for legibility)
  const clone = contentEl.cloneNode(true) as HTMLElement;
  clone.style.cssText = `
    display: block;
    width: 100%;
    overflow: hidden;
    border-radius: 24px;
    background: #ffffff;
    color: #1a2e1e;
    font-family: ${fontBody};
    padding: 40px;
    margin-bottom: 24px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.08);
  `;
  // Strip interactive-only bits (the export/share toolbar)
  clone.querySelectorAll("[data-export-hide]").forEach((el) => el.remove());
  wrapper.appendChild(clone);

  // Footer
  const footer = document.createElement("div");
  footer.style.cssText =
    "font-size:20px;color:#6b7280;text-align:center;padding-top:8px;";
  footer.textContent = `sprout-planner · ${new Date().toISOString().slice(0, 10)}`;
  wrapper.appendChild(footer);

  return wrapper;
}

export function exportFilename(ratio: ExportRatio): string {
  return `sprout-dashboard-${new Date().toISOString().slice(0, 10)}-${ratio.replace(":", "x")}.png`;
}

/** Render the dashboard to a PNG Blob at the requested aspect ratio. */
export async function renderDashboardBlob(
  contentEl: HTMLElement,
  ratio: ExportRatio,
): Promise<Blob> {
  const { w, h } = SIZES[ratio];
  const wrapper = buildWrapper(contentEl, ratio);
  document.body.appendChild(wrapper);
  // Make sure fonts and the (same-origin) mascot images are decoded before we
  // rasterize, so text and pictures aren't dropped from the capture.
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
      // A solid sprout-tint background — without this the PNG is transparent
      // and looks pure black in most viewers / when shared.
      backgroundColor: "#f0fdf4",
      // The Google Fonts stylesheet is cross-origin, so html-to-image cannot
      // read its rules and the whole capture fails (empty/black image). Skip
      // font embedding; text still renders with the already-loaded faces.
      skipFonts: true,
    });
    if (!blob) throw new Error("Failed to render image");
    return blob;
  } finally {
    document.body.removeChild(wrapper);
  }
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Save the dashboard image to the user's device. */
export async function downloadDashboard(
  contentEl: HTMLElement,
  ratio: ExportRatio,
): Promise<void> {
  const blob = await renderDashboardBlob(contentEl, ratio);
  downloadBlob(blob, exportFilename(ratio));
}

export type ShareResult = "shared" | "downloaded" | "cancelled";

/**
 * Share the dashboard image via the Web Share API (native share sheet on
 * mobile). Falls back to a download when sharing files isn't supported.
 */
export async function shareDashboard(
  contentEl: HTMLElement,
  ratio: ExportRatio,
): Promise<ShareResult> {
  const blob = await renderDashboardBlob(contentEl, ratio);
  const filename = exportFilename(ratio);
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
      // Anything else: fall through to a download so the image isn't lost.
    }
  }

  downloadBlob(blob, filename);
  return "downloaded";
}
