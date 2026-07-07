import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatScore } from "@/lib/cers/public";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import type { CersCompanyProfile } from "@/lib/cers/types";
import { CalculationStatusBadge } from "./calculation-status-badge";

type CompanyCardProps = {
  company: CersCompanyProfile;
  compact?: boolean;
  locale?: SupportedLocale;
  showSectorMeta?: boolean;
};

export function CompanyCard({ company, compact = false, locale = "en", showSectorMeta = false }: CompanyCardProps) {
  const t = getTranslations(locale);
  const primaryMeta = company.sectorLabel || company.industryLabel;
  const secondaryMeta =
    showSectorMeta && company.sectorLabel && company.industryLabel && company.sectorLabel !== company.industryLabel
      ? company.industryLabel
      : null;
  const scoreYear = company.scoreFiscalYear ?? company.fiscalYear;
  const categoryTones = ["bg-teal-500", "bg-teal-500", "bg-teal-500", "bg-teal-500"];
  const sortedCategories = [...company.categories].sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 4);

  return (
    <Link
      href={localizedPath(locale, `/companies/${company.id}`)}
      className="group block rounded-[30px] border border-slate-200 bg-white p-6 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-elevated dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-teal-500"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{primaryMeta}</p>
            <CalculationStatusBadge company={company} locale={locale} size="xs" />
          </div>
          {secondaryMeta && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{secondaryMeta}</p>}
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{company.displayName}</h3>
          {(company.countryLabel || company.marketLabel) && (
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              {[company.countryLabel, company.marketLabel].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div className="text-2xl font-semibold tracking-tight text-teal-600">{formatScore(company.overallScore)}</div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.common.score}</div>
          {scoreYear !== null && <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{t.common.fiscalYearLabel(scoreYear)}</div>}
        </div>
      </div>

      <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{company.summary}</p>

      <div className="mb-5 grid grid-cols-2 gap-3">
        {sortedCategories.map((category, index) => {
          const score = category.rawScore;
          const width = score === null ? 0 : Math.max(0, Math.min(100, score));

          return (
            <div key={category.code} className="rounded-2xl bg-slate-50 px-3 py-3 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">{category.label}</span>
                <span className="text-xs font-semibold tabular-nums text-slate-800 dark:text-slate-200">{formatScore(score)}</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className={`h-full rounded-full ${categoryTones[index] ?? "bg-slate-500"}`} style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex flex-wrap gap-2">
          {company.badges.slice(0, compact ? 1 : 2).map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300"
            >
              {badge}
            </span>
          ))}
        </div>
        <div className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-slate-900 transition group-hover:text-teal-700 dark:text-slate-100 dark:group-hover:text-teal-300">
          {t.common.viewDetails}
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
