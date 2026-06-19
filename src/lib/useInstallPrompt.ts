import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

function isIOS(): boolean {
  const ua = window.navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua);
}

/** Coarse pointer or narrow viewport — i.e. phone/tablet. */
function isHandheld(): boolean {
  return (
    window.matchMedia("(max-width: 1024px)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

export type InstallState = {
  /** Show the install affordance at all (handheld, not already installed). */
  canShow: boolean;
  /** A native prompt is available (Android/Chromium). */
  canPrompt: boolean;
  /** iOS Safari needs the manual Add-to-Home-Screen instructions. */
  isIOS: boolean;
  /** Trigger the native prompt; resolves true if accepted. */
  promptInstall: () => Promise<boolean>;
};

export function useInstallPrompt(): InstallState {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    const onBeforePrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforePrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforePrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const ios = isIOS();
  const canPrompt = deferred !== null;
  const canShow = !installed && isHandheld() && (canPrompt || ios);

  async function promptInstall(): Promise<boolean> {
    if (!deferred) return false;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setDeferred(null);
    return outcome === "accepted";
  }

  return { canShow, canPrompt, isIOS: ios, promptInstall };
}
