import { AppShell } from "@/components/cers/app-shell";
import { IndustriesPageClient } from "@/components/cers/industries-page-client";
import type { SupportedLocale } from "@/lib/cers/i18n";
import { getIndustrySummaries } from "@/lib/cers/public";
import { getCersDashboardData } from "@/lib/server/cers-dashboard";

export const dynamic = "force-dynamic";

export async function renderIndustriesPage(locale: SupportedLocale = "en") {
  const data = await getCersDashboardData(locale);
  const industries = getIndustrySummaries(data, locale);

  return (
    <AppShell source={data.source} issue={data.issue} locale={locale}>
      <IndustriesPageClient industries={industries} locale={locale} />
    </AppShell>
  );
}

export default async function IndustriesPage() {
  return renderIndustriesPage("en");
}
