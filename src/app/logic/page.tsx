"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getI18nStrings, HTML_LANG_BY_LANGUAGE, isLanguage, type Language } from "@/lib/i18n";

function LogicPageContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const [language, setLanguage] = useState<Language>(isLanguage(langParam) ? langParam : "EN");
  const strings = getI18nStrings(language);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG_BY_LANGUAGE[language];
  }, [language]);

  useEffect(() => {
    if (isLanguage(langParam) && langParam !== language) {
      setLanguage(langParam);
    }
  }, [langParam, language]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{strings.table.logicWidget}</h1>
          <Button variant="outline" asChild>
            <Link href={`/?lang=${language}`}>{strings.table.back}</Link>
          </Button>
        </div>
        <div className="rounded-lg border border-dashed p-12" />
      </div>
    </main>
  );
}

export default function LogicPage() {
  return (
    <Suspense
      fallback={(
        <main className="min-h-screen bg-background">
          <div className="container py-6 text-muted-foreground">Loading...</div>
        </main>
      )}
    >
      <LogicPageContent />
    </Suspense>
  );
}
