import { Wallet, Scale } from "lucide-react";
import { GoalType, normalizeGoalType } from "../../lib/store";

type Props = {
  type?: GoalType | "financial" | "weight";
  size?: number;
  className?: string;
};

export default function GoalTypeIcon({ type, size = 18, className }: Props) {
  const kind =
    type === "financial" || type === "weight" ? type : normalizeGoalType(type);
  if (kind === "weight") {
    return <Scale size={size} className={className} aria-hidden="true" />;
  }
  if (kind === "financial") {
    return <Wallet size={size} className={className} aria-hidden="true" />;
  }
  return null;
}
