import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, Database, Layers3, Target, TrendingDown } from "lucide-react";
import { AppShell } from "@/components/cers/app-shell";
import { HomeScoreLeaderboard } from "@/components/cers/home-score-leaderboard";
import { IndustryCard } from "@/components/cers/industry-card";
import { KpiScoreGrid } from "@/components/cers/kpi-score-grid";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import {
  formatPercent,
  getClearTargetCompanies,
  getIndustrySummaries,
  getNetZeroCompanies,
} from "@/lib/cers/public";
import { getCersDashboardData } from "@/lib/server/cers-dashboard";

export const dynamic = "force-dynamic";

export async function renderHomePage(locale: SupportedLocale = "en") {
  const t = getTranslations(locale);
  const data = await getCersDashboardData(locale);
  const industries = getIndustrySummaries(data, locale);
  const clearTargets = getClearTargetCompanies(data, 3);
  const netZeroCompanies = getNetZeroCompanies(data, 3);
  const scoredCompanies = data.companies.filter((company) => company.overallScore !== null);
  const latestScoreYear =
    scoredCompanies
      .map((company) => company.scoreFiscalYear)
      .filter((year): year is number => year !== null)
      .sort((a, b) => b - a)[0] ?? null;
  const sectorCount = new Set(
    data.companies.map((company) => company.sectorCode || company.industryCode).filter(Boolean),
  ).size;
  const methodologyVersion = data.methodologyVersion || "v1.5";
  const coverageStats = [
    { label: t.home.statCompanies, value: data.companies.length, icon: Building2 },
    { label: t.home.statScored, value: scoredCompanies.length, icon: Database },
    { label: t.home.statIndustries, value: sectorCount, icon: Layers3 },
    { label: t.home.statLatestYear, value: latestScoreYear ?? "—", icon: CalendarDays },
  ];

  return (
    <AppShell source={data.source} issue={data.issue} locale={locale}>
      {/* <section className="container pt-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 text-slate-900 shadow-card md:px-7 md:py-6 lg:px-8 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">{t.home.eyebrow}</p>
              <h1 className="mt-2 max-w-3xl text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                {t.home.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base dark:text-slate-300">{t.home.description}</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Link
                  href={localizedPath(locale, "/companies")}
                  className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300"
                >
                  {t.home.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={localizedPath(locale, "/about")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-white/35 dark:hover:bg-white/10"
                >
                  {t.home.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.06]">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3 dark:border-white/10">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold">{t.home.statMethodology}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{methodologyVersion}</div>
                </div>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-slate-200">
                {[t.home.proofPublic, t.home.proofFramework, t.home.proofComparable].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 dark:bg-white/[0.05]">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500 dark:bg-teal-300" />
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">{t.home.updatedAt(refreshedDate)}</p>
            </div>
          </div>
        </div>
      </section> */}

      <section className="container py-8">
        <div className="rounded-[40px] border border-slate-200 bg-white px-5 py-8 shadow-elevated sm:px-8 md:py-10 dark:border-slate-800 dark:bg-slate-950/80">
          <HomeScoreLeaderboard
            companies={data.companies}
            categories={data.categories}
            locale={locale}
            methodologyVersion={methodologyVersion}
            scoreYear={latestScoreYear}
          />
        </div>
      </section>

      <section className="container py-5">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">{t.home.coverageEyebrow}</p>
          <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl dark:text-white">
            {t.home.coverageTitle}
          </h2>
        </div>
        <div className="grid overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-card sm:grid-cols-2 xl:grid-cols-4 dark:border-slate-800 dark:bg-slate-950/80">
          {coverageStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`p-6 ${index > 0 ? "border-t border-slate-200 sm:border-t-0 sm:border-l dark:border-slate-800" : ""} ${index === 2 ? "sm:border-l-0 xl:border-l" : ""}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</span>
                  <Icon className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                </div>
                <div className="metric-number mt-5 text-3xl font-semibold text-slate-950 dark:text-white">{stat.value}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container py-10">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">{t.home.kpiEyebrow}</p>
          <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl dark:text-white">{t.home.kpiTitle}</h2>
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{t.home.kpiDescription}</p>
        </div>
        <KpiScoreGrid locale={locale} showScores={false} showMethodLink />
      </section>

      <section className="container py-8">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">{t.home.evidenceEyebrow}</p>
          <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl dark:text-white">{t.home.evidenceTitle}</h2>
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{t.home.evidenceDescription}</p>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.home.clearTargetsTitle}</h2>
          </div>
          <div className="mt-6 space-y-4">
            {clearTargets.map((company) => (
              <Link
                key={company.id}
                href={localizedPath(locale, `/companies/${company.id}`)}
                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-blue-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-950"
              >
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{company.displayName}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {company.targetSummary.targetTypeLabel || t.home.targetFallback} · {company.targetSummary.targetYear || "—"} ·{" "}
                    {formatPercent(company.targetSummary.reductionPct)}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </Link>
            ))}
            {clearTargets.length === 0 && (
              <p className="rounded-3xl bg-slate-50 px-5 py-5 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                {t.companies.noResults}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-card dark:border-emerald-700/40 dark:from-slate-950 dark:to-slate-900 dark:bg-gradient-to-br">
          <div className="flex items-center gap-3">
            <TrendingDown className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.home.netZeroTitle}</h2>
          </div>
          <div className="mt-6 grid gap-4">
            {netZeroCompanies.map((company) => (
              <Link
                key={company.id}
                href={localizedPath(locale, `/companies/${company.id}`)}
                className="rounded-3xl border border-emerald-200 bg-white/80 px-5 py-4 transition hover:-translate-y-0.5 hover:bg-white dark:border-emerald-700/30 dark:bg-slate-900/90 dark:hover:bg-slate-900"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{company.displayName}</h3>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-300">{company.targetSummary.netZeroYear}</span>
                  <span className="pb-1 text-sm text-slate-500 dark:text-slate-400">{t.home.netZeroTarget}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{company.targetSummary.scopeLabel || t.home.scopeNotSpecified}</p>
              </Link>
            ))}
            {netZeroCompanies.length === 0 && (
              <p className="rounded-3xl bg-white/70 px-5 py-5 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                {t.companies.noResults}
              </p>
            )}
          </div>
        </div>
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">{t.home.industryEyebrow}</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.home.industryTitle}</h2>
          </div>
          <Link href={localizedPath(locale, "/industries")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-teal-700 dark:text-slate-200 dark:hover:text-teal-300">
            {t.home.seeAllIndustries}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          {industries.slice(0, 3).map((industry) => (
            <IndustryCard key={industry.industryCode} industry={industry} locale={locale} />
          ))}
        </div>
      </section>

      <section className="container py-8">
        <div className="rounded-[40px] border border-slate-200 bg-white px-8 py-10 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">{t.home.scoreMeaningEyebrow}</p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.home.scoreMeaningTitle}</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
              {t.home.scoreMeaningDescription}
            </p>
            <Link
              href={localizedPath(locale, "/about")}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              {t.home.learnMore}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

export default async function HomePage() {
  return renderHomePage("en");
}
