import { type CalculationStatus, deriveCalculationStatus } from "@/lib/cers/public";
import type { CersCompanyProfile } from "@/lib/cers/types";
import type { SupportedLocale } from "@/lib/cers/i18n";

const STATUS_CONFIG: Record<
  CalculationStatus,
  { labels: Record<SupportedLocale, string>; classes: string }
> = {
  scored: {
    labels: { en: "Scored", ko: "산정 완료", ja: "算定済み" },
    classes:
      "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-500/35 dark:bg-teal-950/40 dark:text-teal-300",
  },
  pending: {
    labels: { en: "Pending", ko: "산정 대기", ja: "算定待ち" },
    classes:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/35 dark:bg-amber-950/40 dark:text-amber-300",
  },
  not_scored: {
    labels: { en: "Not scored", ko: "점수 없음", ja: "スコアなし" },
    classes:
      "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500",
  },
};

type CalculationStatusBadgeProps = {
  company: CersCompanyProfile;
  locale?: SupportedLocale;
  size?: "sm" | "xs";
};

export function CalculationStatusBadge({
  company,
  locale = "en",
  size = "sm",
}: CalculationStatusBadgeProps) {
  const status = deriveCalculationStatus(company);
  const config = STATUS_CONFIG[status];
  const label = config.labels[locale];

  const sizeClass =
    size === "xs"
      ? "px-2 py-0.5 text-[10px] tracking-[0.12em]"
      : "px-2.5 py-0.5 text-xs tracking-[0.14em]";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase ${sizeClass} ${config.classes}`}
    >
      {label}
    </span>
  );
}

export { deriveCalculationStatus };
export type { CalculationStatus };
