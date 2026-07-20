import { AppShell } from "@/components/cers/app-shell";
import { HomeDashboardSummary } from "@/components/cers/home-dashboard-summary";
import { HomeScoreLeaderboard } from "@/components/cers/home-score-leaderboard";
import { type SupportedLocale } from "@/lib/cers/i18n";
import { getCersDashboardData } from "@/lib/server/cers-dashboard";

export const dynamic = "force-dynamic";

export async function renderHomePage(locale: SupportedLocale = "en") {
  const data = await getCersDashboardData(locale);
  const scoredCompanies = data.companies.filter((company) => company.overallScore !== null);
  const latestScoreYear =
    scoredCompanies
      .map((company) => company.scoreFiscalYear)
      .filter((year): year is number => year !== null)
      .sort((a, b) => b - a)[0] ?? null;
  const methodologyVersion = data.methodologyVersion || "v1.5";

  return (
    <AppShell source={data.source} issue={data.issue} locale={locale}>
      <section className="container py-6 md:py-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <HomeScoreLeaderboard
            companies={data.companies}
            categories={data.categories}
            locale={locale}
            methodologyVersion={methodologyVersion}
            scoreYear={latestScoreYear}
            generatedAt={data.generatedAt}
          />
        </div>
        <div className="mt-6">
          <HomeDashboardSummary companies={data.companies} locale={locale} />
        </div>
      </section>
    </AppShell>
  );
}

export default async function HomePage() {
  return renderHomePage("en");
}
