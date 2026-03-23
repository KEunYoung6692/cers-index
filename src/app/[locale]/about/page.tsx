import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/cers/i18n";
import { renderAboutPage } from "../../about/page";

type LocalizedAboutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedAboutPage({ params }: LocalizedAboutPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  return renderAboutPage(locale);
}
