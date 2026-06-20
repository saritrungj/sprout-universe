import { Reminders } from "../lib/store";
import { AppState } from "../lib/store";
import { useReminders } from "../lib/useReminders";
import { useT } from "../lib/i18n";
import { getRecommendedReminderTime } from "../lib/status";

/** Headless: schedules the daily reminder while the app is open. */
export default function RemindersRunner({
  state,
  reminders,
}: {
  state: AppState;
  reminders: Reminders;
}) {
  const { t } = useT();
  useReminders(
    reminders.mode === "smart"
      ? { ...reminders, time: getRecommendedReminderTime(state) }
      : reminders,
    t("reminder.body"),
    state.settings.sound !== false,
  );
  return null;
}
