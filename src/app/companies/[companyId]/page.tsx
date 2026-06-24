import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, FileText, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/cers/app-shell";
import { CarbonNeutralRoadmapCard } from "@/components/cers/carbon-neutral-roadmap-card";
import { CalculationStatusBadge } from "@/components/cers/calculation-status-badge";
import { KpiScoreGrid } from "@/components/cers/kpi-score-grid";
import { Button } from "@/components/ui/button";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import {
  formatCompactNumber,
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
  const industry = industries.find((item) => item.industryCode === (company.sectorCode || company.industryCode));
  const industryAverage = industry?.averageScore ?? null;
  const topPeers = industry?.companies.filter((peer) => peer.id !== company.id).slice(0, 3) || [];
  const emissionsHistory = await getCompanyEmissionHistory(company.id);
  const companyMetaLabel =
    company.sectorLabel && company.industryLabel && company.sectorLabel !== company.industryLabel
      ? `${company.sectorLabel} · ${company.industryLabel}`
      : company.industryLabel || company.sectorLabel;
  const scoreYear = company.scoreFiscalYear ?? company.fiscalYear;

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
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{companyMetaLabel}</p>
                <CalculationStatusBadge company={company} locale={locale} size="xs" />
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">{company.displayName}</h1>
              <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{company.interpretation}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {company.badges.map((badge) => (
                  <span key={badge} className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 dark:border-teal-500/35 dark:bg-slate-900 dark:text-teal-300">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="min-w-[180px] rounded-[28px] bg-slate-50 p-5 text-right dark:bg-slate-900">
              <div className="text-3xl font-semibold tracking-tight text-teal-600 md:text-4xl">{formatScore(company.overallScore)}</div>
              <div className="mt-2 text-sm tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.companyDetail.cersScore}</div>
              {scoreYear !== null && <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{t.common.fiscalYearLabel(scoreYear)}</div>}
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{company.summary}</p>
            </div>
          </div>

          <div className="mt-7 grid gap-3 border-t border-slate-200 pt-6 md:grid-cols-3 dark:border-slate-800">
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-900">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-teal-600 dark:text-teal-300" />
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{t.companyDetail.methodologyBasis}</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {company.methodologyVersion || data.methodologyVersion || "v1.5"}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-900">
              <CalendarDays className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-300" />
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{t.companyDetail.scoreBasisYear}</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {scoreYear !== null ? t.common.fiscalYearLabel(scoreYear) : t.common.noData}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-900">
              <FileText className="mt-0.5 h-4 w-4 text-violet-600 dark:text-violet-300" />
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{t.companyDetail.latestEvidence}</div>
                <div className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {company.latestDocument?.title || t.common.noLinkedDocument}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card md:p-8 dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">CERs Index v1.5</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{t.companyDetail.kpiProfile}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{t.companyDetail.kpiProfileDescription}</p>
            </div>
            <Link
              href={localizedPath(locale, "/about/logic")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-teal-700 dark:text-slate-200 dark:hover:text-teal-300"
            >
              {t.kpi.methodLink}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6">
            <KpiScoreGrid categories={company.categories} locale={locale} />
          </div>
        </section>

        <section className="mt-6">
          <CarbonNeutralRoadmapCard company={company} emissionsHistory={emissionsHistory} locale={locale} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.companyDetail.industryComparison}</h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  label: t.companyDetail.companyScoreLabel,
                  name: company.displayName,
                  value: company.overallScore,
                  barClass: "bg-teal-500",
                  valueClass: "text-teal-700 dark:text-teal-300",
                },
                {
                  label: t.companyDetail.sectorAverageLabel,
                  name: industry?.label || t.companyDetail.industryAverage,
                  value: industryAverage,
                  barClass: "bg-slate-400",
                  valueClass: "text-slate-700 dark:text-slate-200",
                },
              ].map((item) => {
                const width = item.value === null ? 0 : Math.max(0, Math.min(100, item.value));
                return (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{item.label}</div>
                        <div className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">{item.name}</div>
                      </div>
                      <div className={`text-2xl font-semibold tabular-nums ${item.valueClass}`}>{formatScore(item.value)}</div>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div className={`h-full rounded-full ${item.barClass}`} style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
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
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.companyDetail.evidenceOverview}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{t.companyDetail.evidenceOverviewDescription}</p>
            <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{t.companyDetail.targetDetails}</h3>
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
              <div>{t.common.assurance}: {company.disclosure.assuranceType || company.disclosure.assuranceProvider || t.common.noData}</div>
              <div>{t.common.revenue}: {formatCompactNumber(company.metrics.revenue, 1, locale)}</div>

              <div className="mt-5">
                <Button asChild className="rounded-full bg-teal-600 text-white hover:bg-teal-500">
                  <Link href={localizedPath(locale, `/companies/${company.id}/report`)}>
                    <FileText className="h-4 w-4" />
                    {t.companyDetail.viewReport}
                  </Link>
                </Button>
              </div>
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
