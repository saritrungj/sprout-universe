import { useState } from "react";
import { useAppState } from "./lib/storage";
import { setTheme, setLanguage, Lang } from "./lib/store";
import { I18nProvider } from "./lib/i18n";
import { Tab } from "./components/TabBar";
import TabBar from "./components/TabBar";
import TodayView from "./components/TodayView";
import CalendarView from "./components/CalendarView";
import Dashboard from "./components/Dashboard";
import ThemeToggle from "./components/ThemeToggle";
import LanguageSelect from "./components/LanguageSelect";
import Splash from "./components/Splash";

export default function App() {
  const [state, setState] = useAppState();
  const [tab, setTab] = useState<Tab>("today");
  const [booting, setBooting] = useState(true);

  function toggleTheme() {
    setState(
      setTheme(state, state.settings.theme === "dark" ? "light" : "dark"),
    );
  }

  function changeLanguage(lang: Lang) {
    setState(setLanguage(state, lang));
  }

  return (
    <I18nProvider lang={state.settings.language}>
      {booting && <Splash onDone={() => setBooting(false)} />}

      <div className="flex min-h-dvh w-full flex-col bg-surface dark:bg-surface-dark">
        {/* Sticky translucent top bar — lets the full-bleed hero show through */}
        <div className="sticky top-0 z-40 border-b border-sprout-100/70 bg-surface/85 backdrop-blur-md dark:border-sprout-900/70 dark:bg-surface-dark/85">
          <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <img
                src="/sprout-logo.png"
                alt=""
                aria-hidden="true"
                className="h-9 w-9 object-contain"
              />
              <span className="font-sans text-lg font-bold text-sprout-700 dark:text-sprout-400">
                Sprout
              </span>
            </div>
            <div className="flex items-center gap-1">
              <LanguageSelect
                value={state.settings.language}
                onChange={changeLanguage}
              />
              <ThemeToggle
                theme={state.settings.theme}
                onToggle={toggleTheme}
              />
            </div>
          </header>

          {/* Tab nav */}
          <TabBar active={tab} onChange={setTab} />
        </div>

        {/* Content — keyed so each view fades/rises in on switch */}
        <main className="flex-1">
          <div key={tab} className="view-enter">
            {tab === "today" && <TodayView state={state} setState={setState} />}
            {tab === "calendar" && (
              <CalendarView state={state} setState={setState} />
            )}
            {tab === "dashboard" && <Dashboard state={state} />}
          </div>
        </main>
      </div>
    </I18nProvider>
  );
}
