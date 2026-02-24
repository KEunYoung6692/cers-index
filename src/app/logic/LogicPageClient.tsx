"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { getI18nStrings, HTML_LANG_BY_LANGUAGE, isLanguage, type Language } from "@/lib/i18n";
import { getLogicHtml } from "./logic-content";

export default function LogicPageClient() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const [language, setLanguage] = useState<Language>(isLanguage(langParam) ? langParam : "EN");
  const strings = getI18nStrings(language);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    document.documentElement.lang = HTML_LANG_BY_LANGUAGE[language];
  }, [language]);

  useEffect(() => {
    if (isLanguage(langParam) && langParam !== language) {
      setLanguage(langParam);
    }
  }, [langParam, language]);

  const logicTheme = (theme === "system" ? resolvedTheme : theme) === "dark" ? "dark" : "light";
  const html = getLogicHtml(language, logicTheme);

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{strings.table.logicWidget}</h1>
          <Button variant="outline" asChild>
            <Link href={`/?lang=${language}`}>{strings.table.back}</Link>
          </Button>
        </div>
        <iframe
          title={strings.table.logicWidget}
          className="h-[80vh] w-full rounded-lg border bg-card"
          srcDoc={html}
        />
      </div>
    </main>
  );
}
