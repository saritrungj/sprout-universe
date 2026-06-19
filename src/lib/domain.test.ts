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
} from "./store";
import {
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

function testMigrationPreservesMonthlyTasksAsTemplates() {
  let state = cloneState();
  let taskId = "";
  [state, taskId] = addTask(state, "Read", "morning");
  state = addMainTask(state, "2026-06", taskId);
  const migrated = migrateState(state);

  assert.equal(migrated.tasks[taskId].isTemplate, true);
  assert.equal(getDayTaskIds(migrated, "2026-06-19").length, 1);
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
testMigrationPreservesMonthlyTasksAsTemplates();
testConsistencyDataIgnoresRestDays();
testAIRequestAndTaskParsing();

console.log("domain tests passed");
