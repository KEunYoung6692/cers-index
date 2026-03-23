import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatEmissions, formatScore } from "@/lib/cers/public";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import type { CersCompanyProfile } from "@/lib/cers/types";

type CompanyCardProps = {
  company: CersCompanyProfile;
  compact?: boolean;
  locale?: SupportedLocale;
};

export function CompanyCard({ company, compact = false, locale = "en" }: CompanyCardProps) {
  const t = getTranslations(locale);

  return (
    <Link
      href={localizedPath(locale, `/companies/${company.id}`)}
      className="group block rounded-[28px] border border-slate-200 bg-white p-6 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-elevated dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-teal-500"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{company.industryLabel}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{company.displayName}</h3>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-4xl font-semibold tracking-tight text-teal-600">{formatScore(company.overallScore)}</div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.common.score}</div>
        </div>
      </div>

      {!compact && (
        <div className="mb-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-900">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{t.companyDetail.roadmapCards.currentTotalEmissions}</div>
            <div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{formatEmissions(company.metrics.totalEmissions)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{t.companyDetail.roadmapCards.targetYear}</div>
            <div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{company.targetSummary.targetYear || "—"}</div>
          </div>
        </div>
      )}

      <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{company.summary}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {company.badges.slice(0, compact ? 2 : 4).map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200"
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 transition group-hover:text-teal-700 dark:text-slate-100 dark:group-hover:text-teal-300">
        {t.common.viewDetails}
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
