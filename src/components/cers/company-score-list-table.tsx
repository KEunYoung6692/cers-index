"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { MultiSelectDropdown, type MultiSelectOption } from "@/components/cers/multi-select-dropdown";
import { localizedPath, getTranslations, type SupportedLocale } from "@/lib/cers/i18n";
import { formatScore } from "@/lib/cers/public";
import type { CersCategoryMeta, CersCompanyProfile } from "@/lib/cers/types";

const COMPANIES_PER_PAGE = 20;

type CompanyScoreListTableProps = {
  companies: CersCompanyProfile[];
  categories: CersCategoryMeta[];
  locale?: SupportedLocale;
};

export function CompanyScoreListTable({ companies, categories, locale = "en" }: CompanyScoreListTableProps) {
  const t = getTranslations(locale);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  const availableSectors: MultiSelectOption[] = Array.from(
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

  const availableCountries: MultiSelectOption[] = Array.from(
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

  const availableYears: MultiSelectOption[] = Array.from(
    new Set(companies.map((company) => company.scoreFiscalYear ?? company.fiscalYear).filter((year): year is number => year !== null)),
  )
    .sort((a, b) => b - a)
    .map((year) => ({ value: String(year), label: String(year) }));

  const filteredCompanies = companies
    .filter((company) => {
      const scoreYear = company.scoreFiscalYear ?? company.fiscalYear;

      const matchesSector =
        selectedSectors.length === 0 ||
        selectedSectors.some(
          (selectedSector) =>
            (selectedSector === "__none__" && !company.sectorCode && !company.sectorLabel) ||
            company.sectorCode === selectedSector ||
            company.sectorLabel === selectedSector,
        );
      const matchesCountry =
        selectedCountries.length === 0 ||
        selectedCountries.some(
          (selectedCountry) =>
            (selectedCountry === "__none__" && !company.countryCode && !company.countryLabel) ||
            company.countryCode === selectedCountry ||
            company.countryLabel === selectedCountry,
        );
      const matchesYear = selectedYears.length === 0 || selectedYears.includes(String(scoreYear));

      return matchesSector && matchesCountry && matchesYear;
    })
    .sort((a, b) => {
      const scoreA = a.overallScore ?? -1;
      const scoreB = b.overallScore ?? -1;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
    });

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / COMPANIES_PER_PAGE));
  const startIndex = (currentPage - 1) * COMPANIES_PER_PAGE;
  const visibleCompanies = filteredCompanies.slice(startIndex, startIndex + COMPANIES_PER_PAGE);
  const visibleStartRank = filteredCompanies.length === 0 ? 0 : startIndex + 1;
  const visibleEndRank = filteredCompanies.length === 0 ? 0 : startIndex + visibleCompanies.length;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="container py-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">{t.companies.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.companies.scoreListTitle}</h1>
        <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{t.companies.scoreListDescription}</p>
      </div>

      <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="block">
            <MultiSelectDropdown
              allLabel={t.companies.allCountries}
              options={availableCountries}
              selectedValues={selectedCountries}
              ariaLabel={t.companies.country}
              onChange={(values) => {
                setSelectedCountries(values);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="block">
            <MultiSelectDropdown
              allLabel={t.companies.allIndustries}
              options={availableSectors}
              selectedValues={selectedSectors}
              ariaLabel={t.companies.industry}
              onChange={(values) => {
                setSelectedSectors(values);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="block">
            <MultiSelectDropdown
              allLabel={t.companies.allYears}
              options={availableYears}
              selectedValues={selectedYears}
              ariaLabel={t.companies.year}
              onChange={(values) => {
                setSelectedYears(values);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-8 py-12 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-400">
          {t.companies.noResults}
        </div>
      ) : (
        <>
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
                    <th className="px-4 py-4 text-right text-xs font-semibold tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {t.companies.scoreListColumns.score}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleCompanies.map((company, index) => (
                    <tr
                      key={company.id}
                      className="border-b border-slate-200/80 transition hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-900/50"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">{visibleStartRank + index}</td>
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

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {visibleStartRank}-{visibleEndRank} / {filteredCompanies.length}
            </p>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-medium transition ${
                      page === currentPage
                        ? "border-teal-600 bg-teal-600 text-white dark:border-teal-500 dark:bg-teal-500"
                        : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
