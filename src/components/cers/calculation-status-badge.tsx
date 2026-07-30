import { type CalculationStatus, deriveCalculationStatus } from "@/lib/cers/public";
import type { CersCompanyListItem } from "@/lib/cers/types";
import type { SupportedLocale } from "@/lib/cers/i18n";

const STATUS_CONFIG: Record<
  CalculationStatus,
  { labels: Record<SupportedLocale, string>; classes: string }
> = {
  scored: {
    labels: {
      ko: "산정 완료",
      en: "Scored",
      zh: "已评分",
      ja: "算定済み",
      vi: "Đã chấm",
      ru: "Оценено",
      id: "Dinilai",
      th: "ประเมินแล้ว",
      bn: "স্কোরপ্রাপ্ত",
      es: "Evaluada",
    },
    classes:
      "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-500/35 dark:bg-teal-950/40 dark:text-teal-300",
  },
  pending: {
    labels: {
      ko: "산정 대기",
      en: "Pending",
      zh: "等待评分",
      ja: "算定待ち",
      vi: "Đang chờ",
      ru: "Ожидает",
      id: "Menunggu",
      th: "รอประเมิน",
      bn: "অপেক্ষমাণ",
      es: "Pendiente",
    },
    classes:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/35 dark:bg-amber-950/40 dark:text-amber-300",
  },
  not_scored: {
    labels: {
      ko: "점수 없음",
      en: "Not scored",
      zh: "未评分",
      ja: "スコアなし",
      vi: "Chưa chấm",
      ru: "Без оценки",
      id: "Belum dinilai",
      th: "ยังไม่มีคะแนน",
      bn: "স্কোর নেই",
      es: "Sin evaluar",
    },
    classes:
      "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500",
  },
};

type CalculationStatusBadgeProps = {
  company: CersCompanyListItem;
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
