import { AppShell } from "@/components/cers/app-shell";
import { CompaniesPageClient } from "@/components/cers/companies-page-client";
import type { SupportedLocale } from "@/lib/cers/i18n";
import { getCersDashboardData } from "@/lib/server/cers-dashboard";

export const dynamic = "force-dynamic";

export async function renderCompaniesPage(locale: SupportedLocale = "en") {
  const data = await getCersDashboardData(locale);
  const companies = data.companies.map((company) => ({
    id: company.id,
    name: company.name,
    displayName: company.displayName,
    stockCode: company.stockCode,
    countryCode: company.countryCode,
    countryLabel: company.countryLabel,
    marketLabel: company.marketLabel,
    sectorCode: company.sectorCode,
    sectorLabel: company.sectorLabel,
    industryLabel: company.industryLabel,
    fiscalYear: company.fiscalYear,
    scoreFiscalYear: company.scoreFiscalYear,
    scorePeriodId: company.scorePeriodId,
    overallScore: company.overallScore,
    categories: company.categories,
    targetSummary: company.targetSummary,
    badges: company.badges,
    summary: company.summary,
  }));

  return (
    <AppShell source={data.source} issue={data.issue} locale={locale}>
      <CompaniesPageClient companies={companies} locale={locale} />
    </AppShell>
  );
}

export default async function CompaniesPage() {
  return renderCompaniesPage("en");
}
