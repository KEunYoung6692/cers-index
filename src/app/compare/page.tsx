import { AppShell } from "@/components/cers/app-shell";
import { ComparePageClient } from "@/components/cers/compare-page-client";
import type { SupportedLocale } from "@/lib/cers/i18n";
import { getCersDashboardData } from "@/lib/server/cers-dashboard";

export const dynamic = "force-dynamic";

export async function renderComparePage(locale: SupportedLocale = "en") {
  const data = await getCersDashboardData(locale);

  return (
    <AppShell source={data.source} issue={data.issue} locale={locale}>
      <ComparePageClient companies={data.companies} categories={data.categories} locale={locale} />
    </AppShell>
  );
}

export default async function ComparePage() {
  return renderComparePage("en");
}
