"use client";

import Link from "next/link";
import { useState } from "react";
import { localizedPath, getTranslations, type SupportedLocale } from "@/lib/cers/i18n";
import { formatScore } from "@/lib/cers/public";
import type { CersCategoryMeta, CersCompanyProfile } from "@/lib/cers/types";

type CompanyScoreListTableProps = {
  companies: CersCompanyProfile[];
  categories: CersCategoryMeta[];
  locale?: SupportedLocale;
};

export function CompanyScoreListTable({ companies, categories, locale = "en" }: CompanyScoreListTableProps) {
  const t = getTranslations(locale);
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  const availableSectors = Array.from(
    new Map(
      companies
        .filter((company) => company.sectorCode || company.sectorLabel)
        .map((company) => [
          company.sectorCode || company.sectorLabel || "__none__",
          {
            value: company.sectorCode || company.sectorLabel || "__none__",
            label: company.sectorLabel || t.common.notSpecified,
          },
        ]),
    ).values(),
  ).sort((a, b) => a.label.localeCompare(b.label, locale, { sensitivity: "base" }));

  const availableCountries = Array.from(
    new Map(
      companies
        .filter((company) => company.countryCode || company.countryLabel)
        .map((company) => [
          company.countryCode || company.countryLabel || "__none__",
          {
            value: company.countryCode || company.countryLabel || "__none__",
            label: company.countryLabel || company.countryCode || t.common.notSpecified,
          },
        ]),
    ).values(),
  ).sort((a, b) => a.label.localeCompare(b.label, locale, { sensitivity: "base" }));

  const availableYears = Array.from(
    new Set(companies.map((company) => company.scoreFiscalYear ?? company.fiscalYear).filter((year): year is number => year !== null)),
  ).sort((a, b) => b - a);

  const filteredCompanies = companies
    .filter((company) => {
      const scoreYear = company.scoreFiscalYear ?? company.fiscalYear;

      const matchesSector =
        selectedSector === "all" ||
        company.sectorCode === selectedSector ||
        company.sectorLabel === selectedSector;
      const matchesCountry =
        selectedCountry === "all" ||
        company.countryCode === selectedCountry ||
        company.countryLabel === selectedCountry;
      const matchesYear = selectedYear === "all" || String(scoreYear) === selectedYear;

      return matchesSector && matchesCountry && matchesYear;
    })
    .sort((a, b) => {
      const scoreA = a.overallScore ?? -1;
      const scoreB = b.overallScore ?? -1;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
    });

  return (
    <div className="container py-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-700">{t.companies.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.companies.scoreListTitle}</h1>
        <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{t.companies.scoreListDescription}</p>
      </div>

      <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{t.companies.country}</span>
            <select
              value={selectedCountry}
              onChange={(event) => setSelectedCountry(event.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500"
            >
              <option value="all">{t.companies.allCountries}</option>
              {availableCountries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{t.companies.industry}</span>
            <select
              value={selectedSector}
              onChange={(event) => setSelectedSector(event.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500"
            >
              <option value="all">{t.companies.allIndustries}</option>
              {availableSectors.map((sector) => (
                <option key={sector.value} value={sector.value}>
                  {sector.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{t.companies.year}</span>
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500"
            >
              <option value="all">{t.companies.allYears}</option>
              {availableYears.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mb-6 rounded-[28px] border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-card dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
        {t.companies.scoreListCount(filteredCompanies.length)}
      </div>

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-950/80">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/80">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {t.companies.scoreListColumns.rank}
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {t.companies.scoreListColumns.company}
                </th>
                {sortedCategories.map((category) => (
                  <th
                    key={category.code}
                    className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400"
                  >
                    {category.label}
                  </th>
                ))}
                <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {t.companies.scoreListColumns.score}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company, index) => (
                <tr
                  key={company.id}
                  className="border-b border-slate-200/80 transition hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-900/50"
                >
                  <td className="px-4 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">{index + 1}</td>
                  <td className="px-4 py-4">
                    <Link
                      href={localizedPath(locale, `/companies/${company.id}`)}
                      className="font-medium text-slate-900 hover:text-teal-700 dark:text-slate-100 dark:hover:text-teal-300"
                    >
                      {company.displayName}
                    </Link>
                  </td>
                  {sortedCategories.map((category) => {
                    const score = company.categories.find((item) => item.code === category.code)?.rawScore ?? null;
                    return (
                      <td key={`${company.id}-${category.code}`} className="px-4 py-4 text-right text-sm text-slate-700 dark:text-slate-200">
                        {formatScore(score)}
                      </td>
                    );
                  })}
                  <td className="px-4 py-4 text-right text-base font-semibold text-slate-900 dark:text-slate-100">
                    {formatScore(company.overallScore)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
