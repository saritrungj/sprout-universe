import { Task, normalizeGoalType } from "../lib/store";
import { cleanGoalTaskTitle } from "../lib/goals";
import GoalTypeIcon from "./goals/GoalTypeIcon";

type Props = {
  task: Task;
  className?: string;
};

/** Task label with a goal-type icon when the task is linked to a goal. */
export default function TaskTitle({ task, className }: Props) {
  const kind = normalizeGoalType(task.goalType);
  const label = task.goalTitle ?? cleanGoalTaskTitle(task.title);

  if (!kind) {
    return <span className={className}>{task.title}</span>;
  }

  return (
    <span className={`inline-flex min-w-0 items-center gap-1.5 ${className ?? ""}`}>
      <GoalTypeIcon
        type={kind}
        size={16}
        className="flex-none text-sprout-600 dark:text-sprout-400"
      />
      <span className="truncate">{label}</span>
    </span>
  );
}
