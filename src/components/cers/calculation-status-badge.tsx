import { type CalculationStatus, deriveCalculationStatus } from "@/lib/cers/public";
import type { CersCompanyProfile } from "@/lib/cers/types";
import type { SupportedLocale } from "@/lib/cers/i18n";

const STATUS_CONFIG: Record<
  CalculationStatus,
  { labelEn: string; labelKo: string; classes: string }
> = {
  full: {
    labelEn: "Full Index",
    labelKo: "Full Index",
    classes:
      "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-500/35 dark:bg-teal-950/40 dark:text-teal-300",
  },
  limited: {
    labelEn: "Limited",
    labelKo: "Limited",
    classes:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/35 dark:bg-amber-950/40 dark:text-amber-300",
  },
  disclosure_only: {
    labelEn: "Disclosure Only",
    labelKo: "공시 기반",
    classes:
      "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400",
  },
  universe_only: {
    labelEn: "Tracked",
    labelKo: "추적 중",
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
  const label = locale === "ko" ? config.labelKo : config.labelEn;

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
