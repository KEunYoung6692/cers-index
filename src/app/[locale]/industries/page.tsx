import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/cers/i18n";
import { renderIndustriesPage } from "../../industries/page";

type LocalizedIndustriesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedIndustriesPage({ params }: LocalizedIndustriesPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  return renderIndustriesPage(locale);
}
