import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/cers/i18n";
import { renderIndustryDetailPage } from "../../../industries/[industryCode]/page";

type LocalizedIndustryDetailPageProps = {
  params: Promise<{ locale: string; industryCode: string }>;
};

export default async function LocalizedIndustryDetailPage({ params }: LocalizedIndustryDetailPageProps) {
  const resolvedParams = await params;
  if (!isSupportedLocale(resolvedParams.locale)) notFound();
  return renderIndustryDetailPage(
    { params: Promise.resolve({ industryCode: resolvedParams.industryCode }) },
    resolvedParams.locale,
  );
}
