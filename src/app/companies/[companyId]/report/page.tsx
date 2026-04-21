import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Shield } from "lucide-react";
import { AppShell } from "@/components/cers/app-shell";
import { ReportViewerFrame } from "@/components/cers/report-viewer-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import { getCersDashboardData } from "@/lib/server/cers-dashboard";
import { getCompanyReportApiPath, hasCompanyReportAsset } from "@/lib/server/report-assets";

export const dynamic = "force-dynamic";

type CompanyReportPageProps = {
  params: Promise<{ companyId: string }>;
};

export async function renderCompanyReportPage(
  { params }: CompanyReportPageProps,
  locale: SupportedLocale = "en",
) {
  const { companyId } = await params;
  const t = getTranslations(locale);
  const data = await getCersDashboardData(locale);
  const company = data.companies.find((item) => item.id === companyId);

  if (!company) notFound();
  if (!(await hasCompanyReportAsset(companyId))) notFound();

  const reportPath = getCompanyReportApiPath(companyId);
  const viewerTitle = `${company.displayName} ${t.companyDetail.reportViewerTitle}`;
  const watermarkLabel = `${company.displayName} · view only`;

  return (
    <AppShell issue={data.issue} locale={locale} source={data.source}>
      <div className="container py-8">
        <Link
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          href={localizedPath(locale, `/companies/${company.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          {t.companyDetail.backToCompany}
        </Link>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-elevated dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                <FileText className="h-4 w-4" />
                {t.common.latestDisclosure}
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
                {company.displayName}
              </h1>
              <p className="mt-3 text-base leading-8 text-slate-600 dark:text-slate-300">
                {t.companyDetail.reportViewerDescription}
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Badge className="rounded-full bg-amber-100 px-3 py-1 text-amber-900 hover:bg-amber-100 dark:bg-amber-500/20 dark:text-amber-200">
                <Shield className="mr-1 h-3.5 w-3.5" />
                {t.companyDetail.reportProtectionBadge}
              </Badge>

              <Button asChild className="rounded-full bg-teal-600 px-5 text-white hover:bg-teal-500">
                <Link href={localizedPath(locale, `/companies/${company.id}`)}>
                  {t.companyDetail.backToCompany}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <ReportViewerFrame
            documentUrl={reportPath}
            restrictionNote={t.companyDetail.reportRestrictionNote}
            title={viewerTitle}
            watermarkLabel={watermarkLabel}
          />
        </section>
      </div>
    </AppShell>
  );
}

export default async function CompanyReportPage({ params }: CompanyReportPageProps) {
  return renderCompanyReportPage({ params }, "en");
}
