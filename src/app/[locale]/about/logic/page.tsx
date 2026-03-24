import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/cers/i18n";
import { renderScoreLogicPage } from "../../../score-logic/page";

type LocalizedAboutLogicPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedAboutLogicPage({ params }: LocalizedAboutLogicPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  return renderScoreLogicPage(locale);
}
