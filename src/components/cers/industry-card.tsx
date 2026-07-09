import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPercent, formatScore } from "@/lib/cers/public";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import type { CersIndustrySummary } from "@/lib/cers/types";

type IndustryCardProps = {
  industry: CersIndustrySummary;
  locale?: SupportedLocale;
};

export function IndustryCard({ industry, locale = "en" }: IndustryCardProps) {
  const t = getTranslations(locale);

  return (
    <Link
      href={localizedPath(locale, `/industries/${industry.industryCode}`)}
      className="group block rounded-[28px] border border-slate-200 bg-white p-6 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-elevated dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-teal-500"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{industry.label}</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t.common.companiesLabel(industry.companyCount)}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            industry.sampleBucket === "robust"
              ? "bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
          }`}
        >
          {industry.sampleBucket === "robust" ? t.industries.robustSample : t.industries.limitedSample}
        </span>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-900">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{t.industries.medianScore}</div>
          <div className="metric-number mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{formatScore(industry.medianScore)}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-900">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{t.industries.scoreCoverage}</div>
          <div className="metric-number mt-2 text-2xl font-semibold text-teal-700 dark:text-teal-300">{formatPercent(industry.scoreCoverage)}</div>
        </div>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{industry.summary}</p>
      {(industry.strongestCategory || industry.weakestCategory) && (
        <div className="mb-5 grid gap-2 text-xs">
          {industry.strongestCategory && (
            <div className="rounded-xl bg-teal-50 px-3 py-2 text-teal-800 dark:bg-teal-950/25 dark:text-teal-300">
              {t.industryDetail.strongestDimension}: {industry.strongestCategory}
            </div>
          )}
          {industry.weakestCategory && (
            <div className="rounded-xl bg-slate-100 px-3 py-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              {t.industryDetail.weakestDimension}: {industry.weakestCategory}
            </div>
          )}
        </div>
      )}
      <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 transition group-hover:text-teal-700 dark:text-slate-100 dark:group-hover:text-teal-300">
        {t.common.viewDetails}
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
