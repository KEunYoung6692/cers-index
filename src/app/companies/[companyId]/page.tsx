import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/cers/app-shell";
import { CarbonNeutralRoadmapCard } from "@/components/cers/carbon-neutral-roadmap-card";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import {
  formatCompactNumber,
  formatEmissions,
  formatPercent,
  formatScore,
  getIndustrySummaries,
} from "@/lib/cers/public";
import { getCersDashboardData, getCompanyEmissionHistory } from "@/lib/server/cers-dashboard";

export const dynamic = "force-dynamic";

type CompanyDetailPageProps = {
  params: Promise<{ companyId: string }>;
};

export async function renderCompanyDetailPage(
  { params }: CompanyDetailPageProps,
  locale: SupportedLocale = "en",
) {
  const { companyId } = await params;
  const t = getTranslations(locale);
  const data = await getCersDashboardData(locale);
  const company = data.companies.find((item) => item.id === companyId);
  if (!company) notFound();

  const industries = getIndustrySummaries(data, locale);
  const industry = industries.find((item) => item.industryCode === company.industryCode);
  const industryAverage = industry?.averageScore ?? null;
  const topPeers = industry?.companies.filter((peer) => peer.id !== company.id).slice(0, 3) || [];
  const emissionsHistory = await getCompanyEmissionHistory(company.id);
  const latestEmissionPoint = emissionsHistory.at(-1);
  const displayScope1 = latestEmissionPoint?.scope1Emissions ?? company.metrics.scope1Emissions;
  const displayScope2 = latestEmissionPoint?.scope2Emissions ?? company.metrics.scope2Emissions;
  const displayTotal =
    latestEmissionPoint?.totalEmissions ??
    company.metrics.totalEmissions ??
    (displayScope1 !== null || displayScope2 !== null ? (displayScope1 || 0) + (displayScope2 || 0) : null);
  const displayTargetEmissions =
    company.targetSummary.targetEmissions ??
    (company.targetSummary.reductionPct !== null && displayTotal !== null
      ? displayTotal * (1 - company.targetSummary.reductionPct / 100)
      : null);
  const displayReductionPct =
    company.targetSummary.reductionPct ??
    (displayTotal !== null && displayTargetEmissions !== null && displayTotal > 0
      ? ((displayTotal - displayTargetEmissions) / displayTotal) * 100
      : null);

  return (
    <AppShell source={data.source} issue={data.issue} locale={locale}>
      <div className="container py-8">
        <Link href={localizedPath(locale, "/companies")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
          <ArrowLeft className="h-4 w-4" />
          {t.common.backToCompanies}
        </Link>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-elevated dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{company.industryLabel}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">{company.displayName}</h1>
              <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{company.interpretation}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {company.badges.map((badge) => (
                  <span key={badge} className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="min-w-[180px] rounded-[28px] bg-slate-50 p-5 text-right dark:bg-slate-900">
              <div className="text-4xl font-semibold tracking-tight text-teal-600 md:text-5xl">{formatScore(company.overallScore)}</div>
              <div className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.companyDetail.cersScore}</div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{company.summary}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-4">
          {company.categories.map((category) => (
            <div key={category.code} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{category.label}</div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-teal-600">{formatScore(category.rawScore)}</div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {t.common.weightedContribution}: {formatScore(category.weightedScore)}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6">
          <CarbonNeutralRoadmapCard company={company} emissionsHistory={emissionsHistory} locale={locale} />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-6">
          {[
            { label: t.companyDetail.kpis.scope1, value: formatEmissions(displayScope1) },
            { label: t.companyDetail.kpis.scope2, value: formatEmissions(displayScope2) },
            { label: t.companyDetail.kpis.total, value: formatEmissions(displayTotal) },
            { label: t.companyDetail.kpis.targetYear, value: company.targetSummary.targetYear || "—" },
            { label: t.companyDetail.kpis.targetEmissions, value: formatEmissions(displayTargetEmissions) },
            { label: t.companyDetail.kpis.reductionPct, value: formatPercent(displayReductionPct) },
          ].map((item) => (
            <div key={item.label} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
              <div className="text-sm font-medium tracking-[0.02em] text-slate-600 dark:text-slate-300">{item.label}</div>
              <div className="mt-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-xl">{item.value}</div>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.companyDetail.industryComparison}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-900">
                <div className="text-sm text-slate-500 dark:text-slate-400">{company.name}</div>
                <div className="mt-3 h-48 rounded-t-[24px] bg-gradient-to-t from-teal-600 to-teal-400 p-4 text-right text-2xl font-semibold text-white">
                  {formatScore(company.overallScore)}
                </div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-900">
                <div className="text-sm text-slate-500 dark:text-slate-400">{industry?.label || t.companyDetail.industryAverage}</div>
                <div className="mt-3 h-48 rounded-t-[24px] bg-gradient-to-t from-slate-500 to-slate-300 p-4 text-right text-2xl font-semibold text-white">
                  {formatScore(industryAverage)}
                </div>
              </div>
            </div>
            <p className="mt-6 rounded-3xl bg-teal-50 px-5 py-4 text-sm leading-7 text-slate-700 dark:bg-teal-950/30 dark:text-slate-200">
              {industryAverage !== null && company.overallScore !== null && company.overallScore >= industryAverage
                ? t.companyDetail.aboveAverage
                : t.companyDetail.belowAverage}
            </p>

            {topPeers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{t.companyDetail.peerSnapshot}</h3>
                <div className="mt-4 space-y-3">
                  {topPeers.map((peer, index) => (
                    <Link
                      key={peer.id}
                      href={localizedPath(locale, `/companies/${peer.id}`)}
                      className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-teal-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-950"
                    >
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">#{index + 1}</div>
                        <div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{peer.displayName}</div>
                      </div>
                      <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">{formatScore(peer.overallScore)}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.companyDetail.targetDetails}</h2>
            <div className="mt-6 space-y-4">
              {[
                { label: t.companyDetail.targetRows.baselineYear, value: company.targetSummary.baseYear || "—" },
                { label: t.companyDetail.targetRows.targetType, value: company.targetSummary.targetTypeLabel || "—" },
                { label: t.companyDetail.targetRows.coverageScope, value: company.targetSummary.scopeLabel || "—" },
                { label: t.companyDetail.targetRows.netZeroTargetYear, value: company.targetSummary.netZeroYear || "—" },
                { label: t.companyDetail.targetRows.interimTarget, value: company.targetSummary.interimTargetLabel || t.common.no },
                { label: t.companyDetail.targetRows.sbtiStatus, value: company.targetSummary.sbtiApproved ? t.companyDetail.targetRows.approved : t.companyDetail.targetRows.notDisclosed },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{item.label}</div>
                  <div className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <div>{t.common.latestDisclosure}: {company.latestDocument?.title || t.common.noLinkedDocument}</div>
              <div>{t.common.frameworks}: {company.disclosure.frameworks.join(", ") || "—"}</div>
              <div>{t.common.assurance}: {company.disclosure.assuranceType || "—"}</div>
              <div>{t.common.revenue}: {formatCompactNumber(company.metrics.revenue, 1, locale)}</div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  return renderCompanyDetailPage({ params }, "en");
}
