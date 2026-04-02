import { AppShell } from "@/components/cers/app-shell";
import { CompanyScoreListTable } from "@/components/cers/company-score-list-table";
import type { SupportedLocale } from "@/lib/cers/i18n";
import { getCersDashboardData } from "@/lib/server/cers-dashboard";

export const dynamic = "force-dynamic";

export async function renderCompanyScoreListPage(locale: SupportedLocale = "en") {
  const data = await getCersDashboardData(locale);

  return (
    <AppShell source={data.source} issue={data.issue} locale={locale}>
      <CompanyScoreListTable companies={data.companies} categories={data.categories} locale={locale} />
    </AppShell>
  );
}

export default async function CompanyScoreListPage() {
  return renderCompanyScoreListPage("en");
}
