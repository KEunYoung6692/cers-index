import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { formatScore } from "@/lib/cers/public";
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
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{industry.label}</h3>
          <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {industry.performanceTag}
          </p>
        </div>
        <TrendingUp className="h-5 w-5 text-emerald-500" />
      </div>
      <div className="mb-4 flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight text-teal-600">
          {formatScore(industry.averageScore)}
        </span>
        <span className="pb-1 text-sm text-slate-500 dark:text-slate-400">{t.common.avgScore}</span>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{industry.summary}</p>
      <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 transition group-hover:text-teal-700 dark:text-slate-100 dark:group-hover:text-teal-300">
        {t.common.viewDetails}
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
