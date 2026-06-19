import { Sun, Moon } from "lucide-react";
import { useT } from "../lib/i18n";

type Props = {
  theme: "light" | "dark";
  onToggle: () => void;
};

export default function ThemeToggle({ theme, onToggle }: Props) {
  const { t } = useT();
  return (
    <button
      onClick={onToggle}
      aria-label={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-sprout-700 dark:text-sprout-300 hover:bg-sprout-100 dark:hover:bg-sprout-900 transition-colors"
    >
      {theme === "dark" ? (
        <Sun size={20} aria-hidden="true" />
      ) : (
        <Moon size={20} aria-hidden="true" />
      )}
    </button>
  );
}
