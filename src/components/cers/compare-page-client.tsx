"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import {
  buildComparisonSummary,
  formatEmissions,
  formatPercent,
  formatScore,
} from "@/lib/cers/public";
import type { CersCategoryMeta, CersCompanyProfile } from "@/lib/cers/types";

type ComparePageClientProps = {
  companies: CersCompanyProfile[];
  categories: CersCategoryMeta[];
  locale?: SupportedLocale;
};

function getCategoryTone(categoryCode: string) {
  const normalized = categoryCode.toLowerCase();

  if (normalized === "cat1") {
    return {
      dotClass: "bg-teal-500",
      trackClass: "bg-slate-200 dark:bg-slate-800/90",
      fillClass: "bg-gradient-to-r from-teal-500 to-emerald-500",
    };
  }

  if (normalized === "cat2") {
    return {
      dotClass: "bg-cyan-500",
      trackClass: "bg-slate-200 dark:bg-slate-800/90",
      fillClass: "bg-gradient-to-r from-cyan-500 to-teal-500",
    };
  }

  if (normalized === "cat3") {
    return {
      dotClass: "bg-sky-600",
      trackClass: "bg-slate-200 dark:bg-slate-800/90",
      fillClass: "bg-gradient-to-r from-sky-600 to-cyan-500",
    };
  }

  if (normalized === "cat4") {
    return {
      dotClass: "bg-slate-500",
      trackClass: "bg-slate-200 dark:bg-slate-800/90",
      fillClass: "bg-gradient-to-r from-slate-500 to-slate-600",
    };
  }

  return {
    dotClass: "bg-slate-500",
    trackClass: "bg-slate-200 dark:bg-slate-800",
    fillClass: "bg-gradient-to-r from-slate-500 to-slate-600",
  };
}

export function ComparePageClient({ companies, categories, locale = "en" }: ComparePageClientProps) {
  const t = getTranslations(locale);
  const sorted = [...companies].sort((a, b) => (b.overallScore ?? -1) - (a.overallScore ?? -1));
  const [selectedIds, setSelectedIds] = useState<string[]>(sorted.slice(0, 3).map((company) => company.id));
  const selectedCompanies = selectedIds
    .map((id) => companies.find((company) => company.id === id))
    .filter((company): company is CersCompanyProfile => Boolean(company));

  return (
    <div className="container py-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-700">{t.compare.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.compare.title}</h1>
        <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
          {t.compare.description}
        </p>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.compare.selectCompanies}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <select
              key={index}
              value={selectedIds[index] || ""}
              onChange={(event) => {
                const next = [...selectedIds];
                next[index] = event.target.value;
                setSelectedIds(next);
              }}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500"
            >
              <option value="">{t.compare.selectCompany}</option>
              {sorted.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.displayName}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        {buildComparisonSummary(selectedCompanies, locale)}
      </div>

      {selectedCompanies.length > 0 && (
        <>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {selectedCompanies.map((company) => (
              <div key={company.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
                <div className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{company.sectorLabel || company.industryLabel}</div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{company.displayName}</h3>
                <div className="mt-5 text-3xl font-semibold tracking-tight text-teal-600">{formatScore(company.overallScore)}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{company.interpretation}</p>
                <Link href={localizedPath(locale, `/companies/${company.id}`)} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-teal-700 dark:text-slate-100 dark:hover:text-teal-300">
                  {t.common.viewDetails}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.compare.scoreDimensions}</h2>
            <div className="mt-6 space-y-5">
              {categories.map((category) => {
                const tone = getCategoryTone(category.code);

                return (
                <div key={category.code}>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <span className={`h-2.5 w-2.5 rounded-full ${tone.dotClass}`} />
                    <span>{category.label}</span>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    {selectedCompanies.map((company) => {
                      const score = company.categories.find((item) => item.code === category.code)?.rawScore ?? null;
                      const scoreLabel = formatScore(score);
                      const barWidth = score === null ? "0%" : `${Math.max(score, 0)}%`;
                      return (
                        <div key={`${company.id}-${category.code}`} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="text-sm text-slate-500 dark:text-slate-400">{company.name}</div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{scoreLabel}</div>
                          </div>
                          <div className={`h-12 overflow-hidden rounded-full ${tone.trackClass}`}>
                            <div
                              className={`h-full rounded-full ${tone.fillClass}`}
                              style={{ width: barWidth }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.compare.roadmapComparison}</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <th className="pb-3 pr-4 font-medium">{t.compare.metric}</th>
                    {selectedCompanies.map((company) => (
                      <th key={company.id} className="pb-3 pr-4 font-medium text-slate-900 dark:text-slate-100">
                        {company.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 dark:text-slate-300">
                  {[
                    { label: t.compare.metrics.scope1, render: (company: CersCompanyProfile) => formatEmissions(company.metrics.scope1Emissions) },
                    { label: t.compare.metrics.scope2, render: (company: CersCompanyProfile) => formatEmissions(company.metrics.scope2Emissions) },
                    { label: t.compare.metrics.totalEmissions, render: (company: CersCompanyProfile) => formatEmissions(company.metrics.totalEmissions) },
                    { label: t.compare.metrics.targetYear, render: (company: CersCompanyProfile) => company.targetSummary.targetYear || "—" },
                    { label: t.compare.metrics.targetEmissions, render: (company: CersCompanyProfile) => formatEmissions(company.targetSummary.targetEmissions) },
                    { label: t.compare.metrics.reductionVsBase, render: (company: CersCompanyProfile) => formatPercent(company.targetSummary.reductionPct) },
                    { label: t.compare.metrics.netZeroYear, render: (company: CersCompanyProfile) => company.targetSummary.netZeroYear || "—" },
                    {
                      label: t.compare.metrics.assurance,
                      render: (company: CersCompanyProfile) =>
                        company.disclosure.assuranceType || company.disclosure.assuranceProvider || t.common.noData,
                    },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="py-3 pr-4 font-medium text-slate-500 dark:text-slate-400">{row.label}</td>
                      {selectedCompanies.map((company) => (
                        <td key={`${company.id}-${row.label}`} className="py-3 pr-4">
                          {row.render(company)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
