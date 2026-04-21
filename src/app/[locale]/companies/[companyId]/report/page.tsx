import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/cers/i18n";
import { renderCompanyReportPage } from "../../../../companies/[companyId]/report/page";

type LocalizedCompanyReportPageProps = {
  params: Promise<{ locale: string; companyId: string }>;
};

export default async function LocalizedCompanyReportPage({
  params,
}: LocalizedCompanyReportPageProps) {
  const resolvedParams = await params;
  if (!isSupportedLocale(resolvedParams.locale)) notFound();

  return renderCompanyReportPage(
    { params: Promise.resolve({ companyId: resolvedParams.companyId }) },
    resolvedParams.locale,
  );
}
