import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/cers/app-shell";
import { ScoreDistributionChart } from "@/components/cers/score-distribution-chart";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import { formatPercent, formatScore, getIndustrySummaries } from "@/lib/cers/public";
import { getCersDashboardData } from "@/lib/server/cers-dashboard";

export const dynamic = "force-dynamic";

type IndustryDetailPageProps = {
  params: Promise<{ industryCode: string }>;
};

function formatScoreRange(low: number | null, high: number | null) {
  if (low === null || high === null) return "—";
  return `${formatScore(low)} - ${formatScore(high)}`;
}

export async function renderIndustryDetailPage(
  { params }: IndustryDetailPageProps,
  locale: SupportedLocale = "en",
) {
  const { industryCode } = await params;
  const t = getTranslations(locale);
  const data = await getCersDashboardData(locale);
  const industries = getIndustrySummaries(data, locale);
  const industry = industries.find((item) => item.industryCode === industryCode);
  if (!industry) notFound();

  const snapshotCards = [
    {
      label: t.industryDetail.medianScore,
      value: formatScore(industry.medianScore),
      note: t.industryDetail.basedOnScoredCompanies(industry.scoredCompanyCount),
    },
    {
      label: t.industryDetail.scoreCoverage,
      value: formatPercent(industry.scoreCoverage),
      note: `${industry.scoredCompanyCount} / ${industry.companyCount}`,
    },
    {
      label: t.industryDetail.interquartileRange,
      value: formatScoreRange(industry.scoreQuartileLow, industry.scoreQuartileHigh),
      note: `${t.common.averageScore}: ${formatScore(industry.averageScore)}`,
    },
    {
      label: t.industryDetail.sampleRule,
      value: industry.sampleBucket === "robust" ? t.industryDetail.robustSample : t.industryDetail.limitedSample,
      note: industry.latestScoreYear ? t.common.fiscalYearLabel(industry.latestScoreYear) : t.common.noData,
    },
  ];

  const transitionCards = [
    {
      label: t.industryDetail.targetCoverage,
      value: formatPercent(industry.targetStats.targetCoverage.value),
      note: `${industry.targetStats.targetCoverage.count ?? 0} / ${industry.targetStats.targetCoverage.total ?? industry.companyCount}`,
    },
    {
      label: t.industryDetail.netZeroCoverage,
      value: formatPercent(industry.targetStats.netZeroCoverage.value),
      note: `${industry.targetStats.netZeroCoverage.count ?? 0} / ${industry.targetStats.netZeroCoverage.total ?? industry.companyCount}`,
    },
    {
      label: t.industryDetail.sbtiCoverage,
      value: formatPercent(industry.targetStats.sbtiCoverage.value),
      note: `${industry.targetStats.sbtiCoverage.count ?? 0} / ${industry.targetStats.sbtiCoverage.total ?? industry.companyCount}`,
    },
    {
      label: t.industryDetail.interimCoverage,
      value: formatPercent(industry.targetStats.interimCoverage.value),
      note: `${industry.targetStats.interimCoverage.count ?? 0} / ${industry.targetStats.interimCoverage.total ?? industry.companyCount}`,
    },
    {
      label: t.industryDetail.medianTargetYear,
      value: industry.targetStats.medianTargetYear ? String(industry.targetStats.medianTargetYear) : t.common.noData,
      note: t.common.companiesLabel(industry.companyCount),
    },
  ];

  const disclosureCards = [
    {
      label: t.industryDetail.assuranceCoverage,
      value: formatPercent(industry.disclosureStats.assuranceCoverage.value),
      note: `${industry.disclosureStats.assuranceCoverage.count ?? 0} / ${industry.disclosureStats.assuranceCoverage.total ?? industry.companyCount}`,
    },
    {
      label: t.industryDetail.scope3Coverage,
      value: formatPercent(industry.disclosureStats.scope3CoverageAverage),
      note: t.common.companiesLabel(industry.companyCount),
    },
    {
      label: t.industryDetail.primaryDataRatio,
      value: formatPercent(industry.disclosureStats.primaryDataRatioAverage, 1),
      note: t.common.companiesLabel(industry.companyCount),
    },
    {
      label: t.industryDetail.frameworkCoverage,
      value: formatPercent(industry.disclosureStats.frameworkCoverage.value),
      note: `${industry.disclosureStats.frameworkCoverage.count ?? 0} / ${industry.disclosureStats.frameworkCoverage.total ?? industry.companyCount}`,
    },
  ];

  return (
    <AppShell source={data.source} issue={data.issue} locale={locale}>
      <div className="container py-8">
        <Link href={localizedPath(locale, "/industries")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
          <ArrowLeft className="h-4 w-4" />
          {t.common.backToIndustries}
        </Link>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-elevated dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-700">{t.industryDetail.eyebrow}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">{industry.label}</h1>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">{industry.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">{industry.performanceTag}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">
                  {industry.latestScoreYear ? t.common.fiscalYearLabel(industry.latestScoreYear) : t.common.noData}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">{t.common.companiesLabel(industry.companyCount)}</span>
              </div>
              <Link
                href={`${localizedPath(locale, "/companies")}?sector=${encodeURIComponent(industry.industryCode)}`}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-teal-500 dark:hover:text-teal-300"
              >
                {t.industryDetail.viewSectorCompanies}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:w-[420px]">
              {snapshotCards.map((card) => (
                <div key={card.label} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{card.label}</div>
                  <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{card.value}</div>
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{card.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.industryDetail.categoryOverview}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{t.industryDetail.categoryOverviewDescription}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{t.industryDetail.strongestDimension}</div>
                <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{industry.strongestCategory ?? t.common.noData}</div>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{t.industryDetail.weakestDimension}</div>
                <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{industry.weakestCategory ?? t.common.noData}</div>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {industry.categoryAverages.map((category) => {
              const width = category.rawScore === null ? 0 : Math.max(0, Math.min(100, category.rawScore));
              return (
                <div key={category.code} className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{category.label}</div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatScore(category.rawScore)}</div>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-2.5 rounded-full bg-teal-500" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.industryDetail.transitionSignals}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{t.industryDetail.transitionSignalsDescription}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {transitionCards.map((card) => (
              <div key={card.label} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{card.label}</div>
                <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{card.value}</div>
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{card.note}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.industryDetail.disclosureSignals}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{t.industryDetail.disclosureSignalsDescription}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {disclosureCards.map((card) => (
              <div key={card.label} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{card.label}</div>
                <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{card.value}</div>
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{card.note}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.industryDetail.scoreDistribution}</h2>
          <div className="mt-6">
            <ScoreDistributionChart data={industry.scoreDistribution} locale={locale} />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {industry.scoreDistribution.map((bucket) => (
              <div key={bucket.range} className="rounded-3xl bg-slate-50 px-4 py-3 text-center dark:bg-slate-900">
                <div className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{bucket.count}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{bucket.range}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.industryDetail.topCompanies(industry.label)}</h2>
          <div className="mt-5 rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
            <ol className="space-y-3">
              {industry.companies.slice(0, 8).map((company, index) => (
                <li key={company.id} className="flex items-center gap-3 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 dark:border-slate-800">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{company.displayName}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default async function IndustryDetailPage({ params }: IndustryDetailPageProps) {
  return renderIndustryDetailPage({ params }, "en");
}
