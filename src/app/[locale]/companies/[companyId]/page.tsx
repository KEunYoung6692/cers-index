import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/cers/i18n";
import { renderCompanyDetailPage } from "../../../companies/[companyId]/page";

type LocalizedCompanyDetailPageProps = {
  params: Promise<{ locale: string; companyId: string }>;
};

export default async function LocalizedCompanyDetailPage({ params }: LocalizedCompanyDetailPageProps) {
  const resolvedParams = await params;
  if (!isSupportedLocale(resolvedParams.locale)) notFound();
  return renderCompanyDetailPage(
    { params: Promise.resolve({ companyId: resolvedParams.companyId }) },
    resolvedParams.locale,
  );
}
