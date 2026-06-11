import { AppShell } from "@/components/cers/app-shell";
import { CompaniesPageClient } from "@/components/cers/companies-page-client";
import type { SupportedLocale } from "@/lib/cers/i18n";
import { getCersDashboardData } from "@/lib/server/cers-dashboard";

export const dynamic = "force-dynamic";

export async function renderCompaniesPage(locale: SupportedLocale = "en") {
  const data = await getCersDashboardData(locale);

  return (
    <AppShell source={data.source} issue={data.issue} locale={locale}>
      <CompaniesPageClient companies={data.companies} locale={locale} />
    </AppShell>
  );
}

export default async function CompaniesPage() {
  return renderCompaniesPage("en");
}
