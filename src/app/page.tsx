import Link from "next/link";
import { ArrowRight, Search, Target, TrendingDown } from "lucide-react";
import { AppShell } from "@/components/cers/app-shell";
import { CompanyCard } from "@/components/cers/company-card";
import { IndustryCard } from "@/components/cers/industry-card";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import {
  formatPercent,
  formatScore,
  getClearTargetCompanies,
  getFeaturedCompanies,
  getIndustrySummaries,
  getNetZeroCompanies,
  getTopScoringCompanies,
} from "@/lib/cers/public";
import { getCersDashboardData } from "@/lib/server/cers-dashboard";

export const dynamic = "force-dynamic";

export async function renderHomePage(locale: SupportedLocale = "en") {
  const t = getTranslations(locale);
  const data = await getCersDashboardData(locale);
  const industries = getIndustrySummaries(data, locale);
  const featuredCompanies = getFeaturedCompanies(data, 3);
  const topScorers = getTopScoringCompanies(data, 4);
  const clearTargets = getClearTargetCompanies(data, 3);
  const netZeroCompanies = getNetZeroCompanies(data, 3);

  return (
    <AppShell source={data.source} issue={data.issue} locale={locale}>
      <section className="container pt-10">
        <div className="rounded-[40px] border border-slate-200 bg-white px-8 py-12 shadow-elevated dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-teal-700">{t.home.eyebrow}</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-6xl">
              {t.home.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {t.home.description}
            </p>

            <form action={localizedPath(locale, "/companies")} className="mx-auto mt-8 max-w-2xl">
              <div className="relative">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="search"
                  name="q"
                  placeholder={t.home.searchPlaceholder}
                  className="h-16 w-full rounded-full border border-slate-200 bg-slate-50 pl-14 pr-6 text-lg text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500 dark:focus:bg-slate-950"
                />
              </div>
            </form>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {industries.slice(0, 6).map((industry) => (
                <Link
                  key={industry.industryCode}
                  href={`${localizedPath(locale, "/companies")}?industry=${encodeURIComponent(industry.label)}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-teal-950/40 dark:hover:text-teal-200"
                >
                  {industry.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">{t.home.featuredEyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.home.featuredTitle}</h2>
          </div>
          <Link href={localizedPath(locale, "/companies")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-teal-700 dark:text-slate-200 dark:hover:text-teal-300">
            {t.home.browseAllCompanies}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          {featuredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} compact locale={locale} />
          ))}
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">{t.home.leaderboardEyebrow}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.home.leaderboardTitle}</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {topScorers.map((company) => (
            <Link
              key={company.id}
              href={localizedPath(locale, `/companies/${company.id}`)}
              className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-elevated dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-teal-500"
            >
              <div className="text-4xl font-semibold tracking-tight text-teal-600">{formatScore(company.overallScore)}</div>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{company.displayName}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{company.industryLabel}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container grid gap-6 py-8 xl:grid-cols-2">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.home.clearTargetsTitle}</h2>
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
          </div>
        </div>

        <div className="rounded-[32px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-card dark:border-emerald-900/70 dark:from-emerald-950/50 dark:to-slate-950 dark:bg-gradient-to-br">
          <div className="flex items-center gap-3">
            <TrendingDown className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.home.netZeroTitle}</h2>
          </div>
          <div className="mt-6 grid gap-4">
            {netZeroCompanies.map((company) => (
              <Link
                key={company.id}
                href={localizedPath(locale, `/companies/${company.id}`)}
                className="rounded-3xl border border-emerald-200 bg-white/80 px-5 py-4 transition hover:-translate-y-0.5 hover:bg-white dark:border-emerald-900/60 dark:bg-slate-950/80 dark:hover:bg-slate-950"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{company.displayName}</h3>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-3xl font-semibold tracking-tight text-emerald-700">{company.targetSummary.netZeroYear}</span>
                  <span className="pb-1 text-sm text-slate-500 dark:text-slate-400">{t.home.netZeroTarget}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{company.targetSummary.scopeLabel || t.home.scopeNotSpecified}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">{t.home.industryEyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.home.industryTitle}</h2>
          </div>
          <Link href={localizedPath(locale, "/industries")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-teal-700 dark:text-slate-200 dark:hover:text-teal-300">
            {t.home.seeAllIndustries}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          {industries.slice(0, 6).map((industry) => (
            <IndustryCard key={industry.industryCode} industry={industry} locale={locale} />
          ))}
        </div>
      </section>

      <section className="container py-8">
        <div className="rounded-[40px] border border-slate-200 bg-white px-8 py-10 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">{t.home.scoreMeaningEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.home.scoreMeaningTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
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
