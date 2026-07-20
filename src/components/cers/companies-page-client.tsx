"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { CompanyCard } from "./company-card";
import { MultiSelectDropdown, type MultiSelectOption } from "./multi-select-dropdown";
import { deriveCalculationStatus, formatScore } from "@/lib/cers/public";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import type { CersCompanyListItem } from "@/lib/cers/types";

type CompaniesPageClientProps = {
  companies: CersCompanyListItem[];
  locale?: SupportedLocale;
};

type SortOption = "score" | "name" | "target";

const PAGE_SIZE = 24;

function getInitialSelectedValues(value: string | null) {
  if (!value || value === "all") {
    return [];
  }

  return [value];
}

export function CompaniesPageClient({ companies, locale = "en" }: CompaniesPageClientProps) {
  const searchParams = useSearchParams();
  const t = getTranslations(locale);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedSectors, setSelectedSectors] = useState<string[]>(getInitialSelectedValues(searchParams.get("sector") || searchParams.get("industry")));
  const [selectedCountries, setSelectedCountries] = useState<string[]>(getInitialSelectedValues(searchParams.get("country")));
  const [selectedScoreRanges, setSelectedScoreRanges] = useState<string[]>([]);
  const [targetAnnounced, setTargetAnnounced] = useState(false);
  const [netZeroDeclared, setNetZeroDeclared] = useState(false);
  const [scoredOnly, setScoredOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("score");
  const [currentPage, setCurrentPage] = useState(1);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setSelectedSectors(getInitialSelectedValues(searchParams.get("sector") || searchParams.get("industry")));
    setSelectedCountries(getInitialSelectedValues(searchParams.get("country")));
  }, [searchParams]);

  const availableSectors: MultiSelectOption[] = Array.from(
    new Map(
      companies.map((company) => [
        company.sectorCode || "__none__",
        {
          value: company.sectorCode || "__none__",
          label: company.sectorLabel || t.common.notSpecified,
        },
      ]),
    ).values(),
  ).sort((a, b) => a.label.localeCompare(b.label, locale, { sensitivity: "base" }));

  const availableCountries: MultiSelectOption[] = Array.from(
    new Map(
      companies.map((company) => [
        company.countryCode || "__none__",
        {
          value: company.countryCode || "__none__",
          label: company.countryLabel || company.countryCode || t.common.notSpecified,
        },
      ]),
    ).values(),
  ).sort((a, b) => a.label.localeCompare(b.label, locale, { sensitivity: "base" }));

  const scoreRangeOptions: MultiSelectOption[] = [
    { value: "80-100", label: "80 - 100" },
    { value: "70-79", label: "70 - 79" },
    { value: "60-69", label: "60 - 69" },
    { value: "0-59", label: t.companies.below60 },
  ];

  const filtered = companies
    .filter((company) => {
      const matchesQuery =
        deferredQuery.trim() === "" ||
        company.displayName.toLowerCase().includes(deferredQuery.trim().toLowerCase()) ||
        (company.stockCode || "").toLowerCase().includes(deferredQuery.trim().toLowerCase()) ||
        (company.industryLabel || "").toLowerCase().includes(deferredQuery.trim().toLowerCase()) ||
        (company.sectorLabel || "").toLowerCase().includes(deferredQuery.trim().toLowerCase());

      const matchesSector =
        selectedSectors.length === 0 ||
        selectedSectors.some(
          (selectedSector) =>
            (selectedSector === "__none__" && !company.sectorCode) ||
            company.sectorCode === selectedSector ||
            company.sectorLabel === selectedSector,
        );
      const matchesCountry =
        selectedCountries.length === 0 ||
        selectedCountries.some(
          (selectedCountry) =>
            (selectedCountry === "__none__" && !company.countryCode) ||
            company.countryCode === selectedCountry ||
            company.countryLabel === selectedCountry,
        );
      const matchesTarget = !targetAnnounced || Boolean(company.targetSummary.targetYear);
      const matchesNetZero = !netZeroDeclared || Boolean(company.targetSummary.netZeroYear);
      const matchesScored = !scoredOnly || deriveCalculationStatus(company) === "scored";

      const score = company.overallScore ?? -1;
      const matchesScoreRange =
        selectedScoreRanges.length === 0 ||
        selectedScoreRanges.some(
          (selectedScoreRange) =>
            (selectedScoreRange === "80-100" && score >= 80) ||
            (selectedScoreRange === "70-79" && score >= 70 && score < 80) ||
            (selectedScoreRange === "60-69" && score >= 60 && score < 70) ||
            (selectedScoreRange === "0-59" && score < 60),
        );

      return matchesQuery && matchesSector && matchesCountry && matchesTarget && matchesNetZero && matchesScoreRange && matchesScored;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
      }
      if (sortBy === "target") {
        const yearA = a.targetSummary.targetYear ?? Number.MAX_SAFE_INTEGER;
        const yearB = b.targetSummary.targetYear ?? Number.MAX_SAFE_INTEGER;
        if (yearA !== yearB) return yearA - yearB;
      }
      const scoreA = a.overallScore ?? -1;
      const scoreB = b.overallScore ?? -1;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
    });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const visibleCompanies = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredQuery, selectedSectors, selectedCountries, selectedScoreRanges, targetAnnounced, netZeroDeclared, scoredOnly, sortBy]);

  return (
    <div className="container py-8">
      <div className="mb-8 rounded-[36px] border border-slate-200 bg-white p-7 shadow-card md:p-9 dark:border-slate-800 dark:bg-slate-950/80">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">{t.companies.eyebrow}</p>
            <h1 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.035em] text-slate-950 md:text-4xl dark:text-white">{t.companies.title}</h1>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
              {t.companies.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 px-5 py-4 dark:bg-slate-900">
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{t.home.statCompanies}</div>
              <div className="metric-number mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{companies.length}</div>
            </div>
            <div className="rounded-2xl bg-teal-50 px-5 py-4 dark:bg-teal-950/25">
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-teal-600 dark:text-teal-300">{t.home.statScored}</div>
              <div className="metric-number mt-2 text-2xl font-semibold text-teal-700 dark:text-teal-300">
                {companies.filter((company) => company.overallScore !== null).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Link
            href={localizedPath(locale, "/companies/score-list")}
            className="flex min-h-12 w-full items-center justify-center rounded-[24px] border border-teal-200 bg-teal-50 px-5 py-3 text-sm font-semibold text-teal-700 transition hover:border-teal-300 hover:bg-teal-100 dark:border-teal-500/35 dark:bg-slate-900 dark:text-teal-300 dark:hover:border-teal-400 dark:hover:bg-slate-800"
          >
            {t.companies.scoreListCta}
          </Link>

          <aside className="h-fit rounded-[28px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mb-6 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{t.companies.filters}</h2>
            </div>

            <div className="space-y-5">
              <div className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{t.companies.industry}</span>
                <MultiSelectDropdown
                  allLabel={t.companies.allIndustries}
                  options={availableSectors}
                  selectedValues={selectedSectors}
                  onChange={setSelectedSectors}
                />
              </div>

              <div className="block">
                <MultiSelectDropdown
                  allLabel={t.companies.allCountries}
                  options={availableCountries}
                  selectedValues={selectedCountries}
                  ariaLabel={t.companies.country}
                  onChange={setSelectedCountries}
                />
              </div>

              <div className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{t.companies.scoreRange}</span>
                <MultiSelectDropdown
                  allLabel={t.companies.allScores}
                  options={scoreRangeOptions}
                  selectedValues={selectedScoreRanges}
                  onChange={setSelectedScoreRanges}
                />
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={targetAnnounced}
                  onChange={(event) => setTargetAnnounced(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600"
                />
                {t.companies.targetAnnounced}
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={netZeroDeclared}
                  onChange={(event) => setNetZeroDeclared(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600"
                />
                {t.companies.netZeroDeclared}
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50/50 px-4 py-3 text-sm text-slate-700 dark:border-teal-800/50 dark:bg-teal-950/20 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={scoredOnly}
                  onChange={(event) => setScoredOnly(event.target.checked)}
                  className="h-4 w-4 rounded border-teal-300 text-teal-600"
                />
                {t.companies.scoredOnly}
              </label>
            </div>
          </aside>
        </div>

        <div>
          <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-card md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-950/80">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.companies.searchPlaceholder}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500"
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span>{t.companies.sortBy}</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500"
              >
                <option value="score">{t.companies.sortScore}</option>
                <option value="name">{t.companies.sortName}</option>
                <option value="target">{t.companies.sortTargetYear}</option>
              </select>
            </div>
          </div>

          <div className="mb-6 rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {t.companies.showing(filtered.length)}
            {filtered[0]?.overallScore !== null && filtered[0]?.overallScore !== undefined && (
              <>
                {" "}
                {t.companies.topResultScore(formatScore(filtered[0]?.overallScore))}
              </>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-8 py-12 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-400">
              {t.companies.noResults}
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {visibleCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} locale={locale} showSectorMeta />
              ))}
            </div>
          )}

          {filtered.length > PAGE_SIZE && (
            <nav className="mt-8 flex items-center justify-center gap-3" aria-label={t.companies.paginationLabel}>
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                {t.companies.previousPage}
              </button>
              <span className="text-sm tabular-nums text-slate-500 dark:text-slate-400">
                {t.companies.pageStatus(safePage, pageCount)}
              </span>
              <button
                type="button"
                disabled={safePage === pageCount}
                onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                {t.companies.nextPage}
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
