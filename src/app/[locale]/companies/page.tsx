import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/cers/i18n";
import { renderCompaniesPage } from "../../companies/page";

type LocalizedCompaniesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedCompaniesPage({ params }: LocalizedCompaniesPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  return renderCompaniesPage(locale);
}
