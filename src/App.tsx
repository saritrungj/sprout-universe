import { useState } from "react";
import { useAppState } from "./lib/storage";
import { setTheme, setLanguage, Lang } from "./lib/store";
import { I18nProvider, useT } from "./lib/i18n";
import { Tab, SideNav, MobileTopBar, BottomNav } from "./components/Navigation";
import TodayView from "./components/TodayView";
import CalendarView from "./components/CalendarView";
import Dashboard from "./components/Dashboard";
import SettingsView from "./components/SettingsView";
import MoodView from "./components/MoodView";
import FocusView from "./components/FocusView";
import GoalsView from "./components/goals/GoalsView";
import RemindersRunner from "./components/RemindersRunner";
import Splash from "./components/Splash";

function SkipToContent() {
  const { t } = useT();
  return (
    <a href="#main-content" className="sr-only">
      {t("a11y.skipToContent")}
    </a>
  );
}

export default function App() {
  const [state, setState] = useAppState();
  const [tab, setTab] = useState<Tab>(() => tabFromHash() ?? "today");
  const [booting, setBooting] = useState(true);

  function toggleTheme() {
    setState(
      setTheme(state, state.settings.theme === "dark" ? "light" : "dark"),
    );
  }

  function changeLanguage(lang: Lang) {
    setState(setLanguage(state, lang));
  }

  function navigateTab(next: Tab) {
    setTab(next);
    window.location.hash = next;
  }

  return (
    <I18nProvider lang={state.settings.language}>
      {booting && <Splash onDone={() => setBooting(false)} />}
      <RemindersRunner state={state} reminders={state.settings.reminders} />

      <SkipToContent />

      <div className="flex h-dvh w-full overflow-hidden bg-surface dark:bg-surface-dark">
        <SideNav
          active={tab}
          onChange={navigateTab}
          state={state}
          onToggleTheme={toggleTheme}
          onChangeLanguage={changeLanguage}
        />

        <div className="flex h-dvh min-w-0 flex-1 flex-col lg:pl-72">
          <MobileTopBar
            state={state}
            onToggleTheme={toggleTheme}
            onChangeLanguage={changeLanguage}
          />

          {/* Content — keyed so each view fades/rises in on switch */}
          <main
            id="main-content"
            className="min-h-0 flex-1 overflow-y-auto scroll-smooth pb-28 lg:pb-0"
          >
            <div key={tab} className="view-enter min-h-full">
              {tab === "today" && (
                <TodayView state={state} setState={setState} />
              )}
              {tab === "calendar" && (
                <CalendarView state={state} setState={setState} />
              )}
              {tab === "focus" && (
                <FocusView state={state} setState={setState} />
              )}
              {tab === "mood" && <MoodView state={state} setState={setState} />}
              {tab === "goals" && (
                <GoalsView state={state} setState={setState} />
              )}
              {tab === "dashboard" && (
                <Dashboard
                  state={state}
                  onOpenGoals={() => navigateTab("goals")}
                />
              )}
              {tab === "settings" && (
                <SettingsView state={state} setState={setState} />
              )}
            </div>
          </main>
        </div>

        <BottomNav active={tab} onChange={navigateTab} />
      </div>
    </I18nProvider>
  );
}

function tabFromHash(): Tab | null {
  const hash = window.location.hash.replace("#", "");
  return ["today", "calendar", "focus", "mood", "goals", "dashboard", "settings"].includes(
    hash,
  )
    ? (hash as Tab)
    : null;
}
