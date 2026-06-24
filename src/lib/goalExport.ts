import { toBlob } from "html-to-image";

/** Capture a live dashboard DOM node as a high-fidelity PNG blob. */
export async function captureDashboardBlob(
  node: HTMLElement,
  filename: string,
): Promise<Blob> {
  await document.fonts?.ready.catch(() => undefined);
  await Promise.all(
    Array.from(node.querySelectorAll("img")).map((img) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : img.decode().catch(() => undefined),
    ),
  );

  const width = node.offsetWidth;
  const height = node.offsetHeight;

  const blob = await toBlob(node, {
    width,
    height,
    pixelRatio: 2,
    cacheBust: true,
    skipFonts: true,
    style: {
      transform: "none",
      animation: "none",
    },
    filter: (el) => {
      if (el instanceof HTMLElement && el.dataset.exportHide !== undefined) {
        return false;
      }
      return true;
    },
  });

  if (!blob) throw new Error(`Failed to render ${filename}`);
  return blob;
}

export function goalExportFilename(goalTitle: string): string {
  const slug = goalTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `sprout-goal-${slug || "dashboard"}-${new Date().toISOString().slice(0, 10)}.png`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export type ShareResult = "shared" | "downloaded" | "cancelled";

export async function shareBlob(
  blob: Blob,
  filename: string,
  title: string,
): Promise<ShareResult> {
  const file = new File([blob], filename, { type: "image/png" });
  const nav = navigator as Navigator & {
    canShare?: (data?: ShareData) => boolean;
  };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return "cancelled";
      }
    }
  }
  downloadBlob(blob, filename);
  return "downloaded";
}
