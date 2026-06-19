import { Languages } from "lucide-react";
import { Lang } from "../lib/store";
import { LANGUAGES, useT } from "../lib/i18n";

type Props = {
  value: Lang;
  onChange: (lang: Lang) => void;
};

/**
 * Native <select> styled as a compact pill — accessible (keyboard + screen
 * reader) by default, with a leading globe icon overlay.
 */
export default function LanguageSelect({ value, onChange }: Props) {
  const { t } = useT();
  const current = LANGUAGES.find((l) => l.code === value) ?? LANGUAGES[0];

  return (
    <div className="relative flex items-center">
      <Languages
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-2.5 text-sprout-700 dark:text-sprout-300"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Lang)}
        aria-label={t("lang.label")}
        title={current.label}
        className="appearance-none cursor-pointer rounded-xl bg-surface-muted dark:bg-surface-dark-muted text-sm font-medium text-ink dark:text-surface pl-8 pr-7 py-2 min-h-[44px] hover:bg-sprout-100 dark:hover:bg-sprout-950 transition-colors"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      {/* chevron */}
      <svg
        className="pointer-events-none absolute right-2.5 text-ink-subtle dark:text-surface-muted"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 4.5L6 7.5L9 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
