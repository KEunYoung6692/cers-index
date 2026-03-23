"use client";

import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";
import { IndustryCard } from "./industry-card";
import { getTranslations, type SupportedLocale } from "@/lib/cers/i18n";
import type { CersIndustrySummary } from "@/lib/cers/types";

type IndustriesPageClientProps = {
  industries: CersIndustrySummary[];
  locale?: SupportedLocale;
};

export function IndustriesPageClient({ industries, locale = "en" }: IndustriesPageClientProps) {
  const t = getTranslations(locale);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const deferredQuery = useDeferredValue(query);

  const filtered = industries.filter((industry) => {
    const matchesQuery =
      deferredQuery.trim() === "" ||
      industry.label.toLowerCase().includes(deferredQuery.trim().toLowerCase()) ||
      industry.summary.toLowerCase().includes(deferredQuery.trim().toLowerCase());

    const matchesTag = tag === "all" || industry.performanceTag.toLowerCase() === tag;
    return matchesQuery && matchesTag;
  });

  return (
    <div className="container py-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-700">{t.industries.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.industries.title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
          {t.industries.description}
        </p>
      </div>

      <div className="mb-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.industries.searchPlaceholder}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { value: "all", label: t.industries.filterAll },
            { value: locale === "ko" ? "상위 산업" : locale === "ja" ? "高パフォーマンス" : "high performer", label: t.industries.filterHigh },
            { value: locale === "ko" ? "중간 수준 산업" : locale === "ja" ? "中程度" : "moderate performer", label: t.industries.filterModerate },
            { value: locale === "ko" ? "전환 중" : locale === "ja" ? "移行中" : "transitioning", label: t.industries.filterTransitioning },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTag(option.value)}
              className={
                tag === option.value
                  ? "rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white"
                  : "rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-8 py-12 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-400">
          {t.industries.noResults}
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          {filtered.map((industry) => (
            <IndustryCard key={industry.industryCode} industry={industry} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
