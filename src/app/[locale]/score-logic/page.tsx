import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/cers/i18n";
import { renderScoreLogicPage } from "../../score-logic/page";

type LocalizedScoreLogicPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedScoreLogicPage({ params }: LocalizedScoreLogicPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  return renderScoreLogicPage(locale);
}
