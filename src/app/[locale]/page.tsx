import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/cers/i18n";
import { renderHomePage } from "../page";

type LocalizedPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedHomePage({ params }: LocalizedPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  return renderHomePage(locale);
}
