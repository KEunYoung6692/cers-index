import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/cers/i18n";
import { renderComparePage } from "../../compare/page";

type LocalizedComparePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedComparePage({ params }: LocalizedComparePageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  return renderComparePage(locale);
}
