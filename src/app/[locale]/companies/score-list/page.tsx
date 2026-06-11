import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/cers/i18n";
import { renderCompanyScoreListPage } from "../../../companies/score-list/page";

type LocalizedCompanyScoreListPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedCompanyScoreListPage({ params }: LocalizedCompanyScoreListPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  return renderCompanyScoreListPage(locale);
}
