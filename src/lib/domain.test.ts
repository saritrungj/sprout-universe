import assert from "node:assert/strict";
import {
  AppState,
  addDayTask,
  defaultState,
  getDayLog,
  getDayTaskIds,
  setDayNote,
  setDaySkipped,
  setGoalEntry,
  setTaskDone,
  addTask,
  addMainTask,
  addMonthTask,
  addSubtask,
  setSubtaskDone,
  addFocusSession,
  setMoodLog,
} from "./store";
import {
  getRecommendedReminderTime,
  getConsistencyData,
  getDayStatus,
  getGoalProgress,
  getMonthStats,
  getStreak,
  isFutureDate,
} from "./status";
import { migrateState } from "./storage";
import {
  buildAIRequest,
  parseAITasks,
  type AISettings,
} from "./ai";

function cloneState(): AppState {
  return JSON.parse(JSON.stringify(defaultState)) as AppState;
}

function testDailyTasksDeduplicateWithinDay() {
  let state = cloneState();
  [state] = addDayTask(state, "2026-06-19", "Save money");
  [state] = addDayTask(state, "2026-06-19", " save MONEY ");
  assert.equal(getDayTaskIds(state, "2026-06-19").length, 1);
}

function testSameTaskTitleAllowedAcrossDays() {
  let state = cloneState();
  [state] = addDayTask(state, "2026-06-17", "Journal");
  [state] = addDayTask(state, "2026-06-18", "Journal");
  assert.equal(getDayTaskIds(state, "2026-06-17").length, 1);
  assert.equal(getDayTaskIds(state, "2026-06-18").length, 1);
  assert.notEqual(
    getDayTaskIds(state, "2026-06-17")[0],
    getDayTaskIds(state, "2026-06-18")[0],
  );
}

function testRestDayIsNeutralAndDoesNotAddCompletion() {
  let state = cloneState();
  [state] = addDayTask(state, "2026-06-18", "Workout");
  state = setTaskDone(state, "2026-06-18", getDayTaskIds(state, "2026-06-18")[0], true);
  state = setDaySkipped(state, "2026-06-19", true);

  assert.equal(getDayStatus(state, "2026-06-19"), "rest");
  assert.equal(getMonthStats(state, "2026-06").greenDays, 1);
  assert.equal(getStreak(state).best >= 1, true);
}

function testFutureMutationGuard() {
  const future = "2999-01-01";
  assert.equal(isFutureDate(future), true);
  let state = cloneState();
  [state] = addDayTask(state, future, "Future task");
  state = setDayNote(state, future, "future note");
  assert.equal(getDayTaskIds(state, future).length, 0);
  assert.equal(getDayLog(state, future).note ?? "", "");
}

function testSavingsAndWeightGoalProgress() {
  let state = cloneState();
  let savingsId = "";
  [state, savingsId] = addDayTask(state, "2026-06-19", "Save", {
    goalType: "savings",
    goalConfig: { target: 50000 },
  });
  let weightId = "";
  [state, weightId] = addDayTask(state, "2026-06-19", "Weigh in", {
    goalType: "weight",
    goalConfig: { target: 65, checkEveryDays: 7 },
  });
  state = setGoalEntry(state, "2026-06-18", savingsId, 15000);
  state = setGoalEntry(state, "2026-06-19", savingsId, 5000);
  state = setGoalEntry(state, "2026-06-12", weightId, 72);
  state = setGoalEntry(state, "2026-06-19", weightId, 70.5);

  const progress = getGoalProgress(state);
  const savings = progress.find((item) => item.taskId === savingsId);
  const weight = progress.find((item) => item.taskId === weightId);

  assert.equal(savings?.percent, 40);
  assert.equal(savings?.current, 20000);
  assert.equal(weight?.current, 70.5);
  assert.equal(weight?.nextCheckDate, "2026-06-26");
}

function testWeeklyRecurringTasksOnlyAppearOnSelectedWeekdays() {
  let state = cloneState();
  let taskId = "";
  [state, taskId] = addTask(state, "Run", "morning", {
    isTemplate: true,
    recurrence: { type: "weekly", weekdays: [1, 3] },
  });
  state = { ...state, templates: [taskId] };

  assert.deepEqual(getDayTaskIds(state, "2026-06-15"), [taskId]);
  assert.deepEqual(getDayTaskIds(state, "2026-06-16"), []);
  assert.deepEqual(getDayTaskIds(state, "2026-06-17"), [taskId]);
}

function testMigrationConvertsTemplatesToDailyRecurrence() {
  let state = cloneState();
  let taskId = "";
  [state, taskId] = addTask(state, "Read", "morning", { isTemplate: true });
  const migrated = migrateState({ ...state, templates: [taskId] });

  assert.deepEqual(migrated.tasks[taskId].recurrence, { type: "daily" });
}

function testSubtasksPersistPerDayOnly() {
  let state = cloneState();
  let taskId = "";
  [state, taskId] = addDayTask(state, "2026-06-19", "Study");
  const [withSubtask, subtaskId] = addSubtask(state, taskId, "Read chapter");
  state = setSubtaskDone(withSubtask, "2026-06-19", taskId, subtaskId, true);

  assert.equal(getDayLog(state, "2026-06-19").subtasksDone?.[taskId]?.[subtaskId], true);
  assert.equal(getDayLog(state, "2026-06-20").subtasksDone?.[taskId]?.[subtaskId], undefined);
}

function testSmartReminderFallsBackAndLearnsFromCompletionTimes() {
  let state = cloneState();
  assert.equal(getRecommendedReminderTime(state), "20:00");

  let taskId = "";
  [state, taskId] = addDayTask(state, "2026-06-17", "Water plants");
  state = setTaskDone(state, "2026-06-17", taskId, true, "2026-06-17T10:20:00.000Z");
  state = setTaskDone(state, "2026-06-18", taskId, true, "2026-06-18T10:40:00.000Z");
  state = setTaskDone(state, "2026-06-19", taskId, true, "2026-06-19T11:00:00.000Z");

  assert.equal(getRecommendedReminderTime(state), "18:40");
}

function testGoalForecastsNeedEnoughDataAndProjectDates() {
  let state = cloneState();
  let savingsId = "";
  [state, savingsId] = addDayTask(state, "2026-06-10", "Save for laptop", {
    goalType: "savings",
    goalConfig: { target: 10000 },
  });
  state = setGoalEntry(state, "2026-06-10", savingsId, 1000);
  assert.equal(getGoalProgress(state).find((g) => g.taskId === savingsId)?.forecastDate, undefined);

  state = setGoalEntry(state, "2026-06-20", savingsId, 1000);
  const savings = getGoalProgress(state).find((g) => g.taskId === savingsId);
  assert.equal(savings?.remaining, 8000);
  assert.equal(savings?.forecastDate, "2026-07-30");
}

function testWeightForecastSupportsLossDirection() {
  let state = cloneState();
  let weightId = "";
  [state, weightId] = addDayTask(state, "2026-06-10", "Weigh in", {
    goalType: "weight",
    goalConfig: { target: 65, start: 75, direction: "loss", checkEveryDays: 7 },
  });
  state = setGoalEntry(state, "2026-06-10", weightId, 75);
  state = setGoalEntry(state, "2026-06-20", weightId, 73);

  const weight = getGoalProgress(state).find((g) => g.taskId === weightId);
  assert.equal(weight?.percent, 20);
  assert.equal(weight?.remaining, 8);
  assert.equal(weight?.forecastDate, "2026-07-30");
}

function testFocusAndMoodLogsPersistInState() {
  let state = cloneState();
  state = addFocusSession(state, {
    taskId: undefined,
    startedAt: "2026-06-20T10:00:00.000Z",
    endedAt: "2026-06-20T10:25:00.000Z",
    minutes: 25,
    mode: "focus",
  });
  state = setMoodLog(state, "2026-06-20", {
    mood: "happy",
    energy: 4,
    gratitude: "Clear morning",
    vent: "",
  });

  assert.equal(state.focusSessions.length, 1);
  assert.equal(state.moodLogs["2026-06-20"].mood, "happy");
}

function testMigrationPreservesMonthlyTasksAsTemplates() {
  let state = cloneState();
  let taskId = "";
  [state, taskId] = addTask(state, "Read", "morning");
  state = addMainTask(state, "2026-06", taskId);
  const migrated = migrateState(state);

  assert.equal(migrated.tasks[taskId].isTemplate, true);
  assert.equal(getDayTaskIds(migrated, "2026-06-19").length, 1);
}

function testMonthTasksStayInSelectedMonth() {
  let state = cloneState();
  [state] = addMonthTask(state, "2026-05", "Practice guitar", "evening");
  [state] = addMonthTask(state, "2026-06", "Read finance book", "morning");

  assert.equal(getDayTaskIds(state, "2026-05-19").length, 1);
  assert.equal(state.tasks[getDayTaskIds(state, "2026-05-19")[0]].title, "Practice guitar");
  assert.equal(getDayTaskIds(state, "2026-06-19").length, 1);
  assert.equal(state.tasks[getDayTaskIds(state, "2026-06-19")[0]].title, "Read finance book");
}

function testConsistencyDataIgnoresRestDays() {
  let state = cloneState();
  [state] = addDayTask(state, "2026-06-18", "Done");
  state = setTaskDone(state, "2026-06-18", getDayTaskIds(state, "2026-06-18")[0], true);
  state = setDaySkipped(state, "2026-06-19", true);
  const data = getConsistencyData(state, 26);
  const rest = data.find((cell) => cell.date === "2026-06-19");
  assert.equal(rest?.status, "rest");
  assert.equal(rest?.counted, false);
}

function testAIRequestAndTaskParsing() {
  const settings: AISettings = {
    endpoint: "https://example.com/sprout-ai",
    model: "cloud-task-model",
  };
  const request = buildAIRequest({
    settings,
    mode: "tasks",
    prompt: "I want to save money and exercise.",
    language: "en",
    date: "2026-06-19",
    existingTasks: ["Read"],
  });

  assert.equal(request.endpoint, settings.endpoint);
  assert.equal(request.body.model, "cloud-task-model");
  assert.equal(request.body.mode, "tasks");
  assert.deepEqual(
    parseAITasks({
      tasks: [
        { title: "Save 500 THB", slot: "morning", goalType: "savings", goalTarget: 50000 },
        { title: "Save 500 THB" },
        { title: "Walk 20 minutes", slot: "night" },
      ],
    }).map((task) => task.title),
    ["Save 500 THB", "Walk 20 minutes"],
  );
}

testDailyTasksDeduplicateWithinDay();
testSameTaskTitleAllowedAcrossDays();
testRestDayIsNeutralAndDoesNotAddCompletion();
testFutureMutationGuard();
testSavingsAndWeightGoalProgress();
testWeeklyRecurringTasksOnlyAppearOnSelectedWeekdays();
testMigrationConvertsTemplatesToDailyRecurrence();
testSubtasksPersistPerDayOnly();
testSmartReminderFallsBackAndLearnsFromCompletionTimes();
testGoalForecastsNeedEnoughDataAndProjectDates();
testWeightForecastSupportsLossDirection();
testFocusAndMoodLogsPersistInState();
testMigrationPreservesMonthlyTasksAsTemplates();
testMonthTasksStayInSelectedMonth();
testConsistencyDataIgnoresRestDays();
testAIRequestAndTaskParsing();

console.log("domain tests passed");
