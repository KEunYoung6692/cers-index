"use client";

import { useState } from "react";
import { IndustryCard } from "./industry-card";
import { getTranslations, type SupportedLocale } from "@/lib/cers/i18n";
import type { CersIndustrySummary } from "@/lib/cers/types";

type IndustriesPageClientProps = {
  industries: CersIndustrySummary[];
  locale?: SupportedLocale;
};

export function IndustriesPageClient({ industries, locale = "en" }: IndustriesPageClientProps) {
  const t = getTranslations(locale);
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [tag, setTag] = useState("all");

  const filtered = industries.filter((industry) => {
    const matchesIndustry = selectedIndustry === "all" || industry.industryCode === selectedIndustry;

    const matchesTag =
      tag === "all" ||
      (tag === "scored" && industry.scoredCompanyCount > 0) ||
      (tag === "robust" && industry.sampleBucket === "robust") ||
      (tag === "limited" && industry.sampleBucket === "limited");
    return matchesIndustry && matchesTag;
  });

  return (
    <div className="container py-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">{t.industries.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.industries.title}</h1>
        <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
          {t.industries.description}
        </p>
      </div>

      <div className="mb-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
        <label className="block">
          <span className="sr-only">{t.industries.selectSector}</span>
          <select
            value={selectedIndustry}
            onChange={(event) => setSelectedIndustry(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500"
          >
            <option value="all">{t.industries.filterAll}</option>
            {industries.map((industry) => (
              <option key={industry.industryCode} value={industry.industryCode}>
                {industry.label}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { value: "all", label: t.industries.filterAll },
            { value: "scored", label: t.industries.filterScored },
            { value: "robust", label: t.industries.filterRobust },
            { value: "limited", label: t.industries.filterLimited },
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
