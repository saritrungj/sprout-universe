import { useState } from "react";
import { Lang, setLanguage } from "../lib/store";
import { loadState, saveState } from "../lib/storage";

/**
 * Language state for the landing page, persisted in the same store the Planner
 * uses (localStorage `sprout-planner:v1`). Picking a language here carries over
 * into the Planner module, and vice-versa. Defaults to Thai for new visitors.
 */
export function useLandingLang() {
  const [lang, setLang] = useState<Lang>(() => loadState().settings.language);

  function change(next: Lang) {
    setLang(next);
    saveState(setLanguage(loadState(), next));
  }

  return [lang, change] as const;
}
