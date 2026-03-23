import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/cers/app-shell";
import { CompanyCard } from "@/components/cers/company-card";
import { ScoreDistributionChart } from "@/components/cers/score-distribution-chart";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import { formatScore, getIndustrySummaries } from "@/lib/cers/public";
import { getCersDashboardData } from "@/lib/server/cers-dashboard";

export const dynamic = "force-dynamic";

type IndustryDetailPageProps = {
  params: Promise<{ industryCode: string }>;
};

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

  return (
    <AppShell source={data.source} issue={data.issue} locale={locale}>
      <div className="container py-8">
        <Link href={localizedPath(locale, "/industries")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
          <ArrowLeft className="h-4 w-4" />
          {t.common.backToIndustries}
        </Link>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-elevated dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-700">{t.industryDetail.eyebrow}</p>
              <h1 className="mt-3 text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{industry.label}</h1>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">{industry.summary}</p>
            </div>
            <div className="rounded-[28px] bg-slate-50 p-6 text-right dark:bg-slate-900">
              <div className="text-6xl font-semibold tracking-tight text-teal-600">{formatScore(industry.averageScore)}</div>
              <div className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.common.averageScore}</div>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{t.common.companiesLabel(industry.companyCount)}</div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.industryDetail.scoreDistribution}</h2>
          <div className="mt-6">
            <ScoreDistributionChart data={industry.scoreDistribution} locale={locale} />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {industry.scoreDistribution.map((bucket) => (
              <div key={bucket.range} className="rounded-3xl bg-slate-50 px-4 py-3 text-center dark:bg-slate-900">
                <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{bucket.count}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{bucket.range}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.industryDetail.topCompanies(industry.label)}</h2>
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {industry.companies.slice(0, 4).map((company) => (
              <CompanyCard key={company.id} company={company} compact locale={locale} />
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.industryDetail.whatMatters(industry.label)}</h2>
          <div className="mt-6 grid gap-5 xl:grid-cols-3">
            {industry.focusPoints.map((focus) => (
              <div key={focus.title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{focus.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{focus.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default async function IndustryDetailPage({ params }: IndustryDetailPageProps) {
  return renderIndustryDetailPage({ params }, "en");
}
