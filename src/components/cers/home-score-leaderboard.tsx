"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MultiSelectDropdown, type MultiSelectOption } from "@/components/cers/multi-select-dropdown";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import { companyScoreSort, formatScore } from "@/lib/cers/public";
import type { CersCategoryMeta, CersCompanyProfile } from "@/lib/cers/types";

const HOME_RANK_LIMIT = 50;
const ROWS_PER_PAGE = 25;
const KPI_CODES = ["E", "T", "C", "R"] as const;

type HomeScoreLeaderboardProps = {
  companies: CersCompanyProfile[];
  categories: CersCategoryMeta[];
  locale?: SupportedLocale;
  methodologyVersion?: string | null;
  scoreYear?: number | null;
  generatedAt: string;
};

function parseList(value: string | null) {
  return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
}

function formatUpdateDate(value: string, locale: SupportedLocale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit" })
    .format(date)
    .replace(/\s/g, "");
}

export function HomeScoreLeaderboard({
  companies,
  categories,
  locale = "en",
  methodologyVersion,
  scoreYear,
  generatedAt,
}: HomeScoreLeaderboardProps) {
  const t = getTranslations(locale);
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isUrlReady, setIsUrlReady] = useState(false);

  const scoredCompanies = useMemo(
    () => companies.filter((company) => company.overallScore !== null),
    [companies],
  );
  // KPI는 코드 기준으로 유일해야 한다. 예전에는 정렬 후 앞 4개를 그냥 잘랐는데,
  // 뷰가 방법론 두 벌(legacy_v2 + cers_0730)을 같은 코드로 내보내던 시기에는
  // KPI1, KPI1, KPI2, KPI2가 렌더링됐다(2026-08-13 실측). 자르기는 문제를
  // 가릴 뿐이므로 코드로 먼저 접고, 그 다음 표시 순서대로 4개를 쓴다.
  const sortedCategories = useMemo(() => {
    const byCode = new Map<string, (typeof categories)[number]>();
    for (const category of categories) {
      if (!byCode.has(category.code)) byCode.set(category.code, category);
    }
    return [...byCode.values()].sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 4);
  }, [categories]);
  const availableCountries: MultiSelectOption[] = useMemo(
    () => Array.from(new Map(scoredCompanies.filter((company) => company.countryCode || company.countryLabel).map((company) => [
      company.countryCode || company.countryLabel || "__none__",
      { value: company.countryCode || company.countryLabel || "__none__", label: company.countryLabel || company.countryCode || t.common.notSpecified },
    ])).values()).sort((a, b) => a.label.localeCompare(b.label, locale, { sensitivity: "base" })),
    [locale, scoredCompanies, t.common.notSpecified],
  );
  const availableSectors: MultiSelectOption[] = useMemo(
    () => Array.from(new Map(scoredCompanies.filter((company) => company.sectorCode || company.sectorLabel || company.industryCode || company.industryLabel).map((company) => [
      company.sectorCode || company.industryCode || company.sectorLabel || company.industryLabel || "__none__",
      { value: company.sectorCode || company.industryCode || company.sectorLabel || company.industryLabel || "__none__", label: company.sectorLabel || company.industryLabel || t.common.notSpecified },
    ])).values()).sort((a, b) => a.label.localeCompare(b.label, locale, { sensitivity: "base" })),
    [locale, scoredCompanies, t.common.notSpecified],
  );

  const rankedCompanies = useMemo(() => scoredCompanies
    .filter((company) => selectedCountries.length === 0 || selectedCountries.some((country) => company.countryCode === country || company.countryLabel === country))
    .filter((company) => selectedSectors.length === 0 || selectedSectors.some((sector) => company.sectorCode === sector || company.industryCode === sector || company.sectorLabel === sector || company.industryLabel === sector))
    .sort(companyScoreSort)
    .slice(0, HOME_RANK_LIMIT), [scoredCompanies, selectedCountries, selectedSectors]);
  const pageCount = Math.max(1, Math.ceil(rankedCompanies.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const visibleCompanies = rankedCompanies.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);
  const startRank = visibleCompanies.length ? (safePage - 1) * ROWS_PER_PAGE + 1 : 0;
  const endRank = startRank + visibleCompanies.length - 1;
  const hasFilters = selectedCountries.length > 0 || selectedSectors.length > 0;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelectedCountries(parseList(params.get("countries")));
    setSelectedSectors(parseList(params.get("sectors")));
    setPage(Math.max(1, Number(params.get("page")) || 1));
    setIsUrlReady(true);
  }, []);

  useEffect(() => {
    if (!isUrlReady) return;
    const currentQuery = window.location.search.replace(/^\?/, "");
    const params = new URLSearchParams(currentQuery);
    if (selectedCountries.length) params.set("countries", selectedCountries.join(","));
    else params.delete("countries");
    if (selectedSectors.length) params.set("sectors", selectedSectors.join(","));
    else params.delete("sectors");
    if (safePage > 1) params.set("page", String(safePage));
    else params.delete("page");
    const nextQuery = params.toString();
    if (nextQuery === currentQuery) return;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [isUrlReady, pathname, router, safePage, selectedCountries, selectedSectors]);

  const updateCountries = (values: string[]) => { setSelectedCountries(values); setPage(1); };
  const updateSectors = (values: string[]) => { setSelectedSectors(values); setPage(1); };
  const resetFilters = () => { setSelectedCountries([]); setSelectedSectors([]); setPage(1); };
  const filterBasis = selectedCountries.length && selectedSectors.length
    ? t.home.listBasisCountrySector
    : selectedCountries.length
      ? t.home.listBasisCountry
      : selectedSectors.length
        ? t.home.listBasisSector
        : t.home.listBasisAll;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5 border-b border-slate-200 px-5 py-6 md:flex-row md:items-start md:justify-between md:px-8 dark:border-slate-800">
        <div>
          <h1 className="text-[28px] font-bold leading-9 tracking-[-0.025em] text-slate-950 dark:text-white">{t.companies.scoreListTitle}</h1>
          <p className="mt-2 text-[13px] leading-5 text-slate-500 dark:text-slate-400">
            {scoreYear ?? "—"} {t.home.listAssessment} · {filterBasis} · {t.home.listTop50} · {formatUpdateDate(generatedAt, locale)} {t.home.listUpdated}
          </p>
          <span className="sr-only">{methodologyVersion}</span>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
          <div className="min-w-0 flex-1 sm:w-44 sm:flex-none">
            <MultiSelectDropdown allLabel={t.companies.allCountries} options={availableCountries} selectedValues={selectedCountries} onChange={updateCountries} ariaLabel={t.companies.country} align="end" triggerClassName="h-10 rounded-lg bg-white px-3 dark:bg-slate-950" searchPlaceholder={t.home.countrySearch} applyLabel={t.home.filterApply} resetLabel={t.home.filterReset} multipleSelectionLabel={(count) => t.home.selectedCountries(count)} />
          </div>
          <div className="min-w-0 flex-1 sm:w-44 sm:flex-none">
            <MultiSelectDropdown allLabel={t.companies.allIndustries} options={availableSectors} selectedValues={selectedSectors} onChange={updateSectors} ariaLabel={t.companies.industry} align="end" triggerClassName="h-10 rounded-lg bg-white px-3 dark:bg-slate-950" searchPlaceholder={t.home.sectorSearch} applyLabel={t.home.filterApply} resetLabel={t.home.filterReset} multipleSelectionLabel={(count) => t.home.selectedSectors(count)} />
          </div>
          {hasFilters && (
            <button type="button" onClick={resetFilters} className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white">
              <RotateCcw className="h-4 w-4" /> {t.home.filterReset}
            </button>
          )}
        </div>
      </div>

      {scoredCompanies.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-20 text-center md:px-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t.home.noPublishedScoresTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{t.home.noPublishedScoresDescription}</p>
        </div>
      ) : rankedCompanies.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-20 text-center md:px-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t.home.noFilterResultsTitle}</h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t.home.noFilterResultsDescription}</p>
          <button type="button" onClick={resetFilters} className="mt-6 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">{t.home.filterReset}</button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead className="bg-slate-50/90 dark:bg-slate-900/70">
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th scope="col" className="w-20 px-5 py-3 text-left text-[13px] font-semibold text-slate-500 md:px-8">{t.companies.scoreListColumns.rank}</th>
                  <th scope="col" className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500">{t.companies.scoreListColumns.company}</th>
                  <th scope="col" className="w-28 px-4 py-3 text-right text-[13px] font-semibold text-slate-500">{t.companies.scoreListColumns.score}</th>
                  <th scope="col" className="w-[290px] px-4 py-3 text-left text-[13px] font-semibold text-slate-500">KPI Profile</th>
                  <th scope="col" className="w-16 px-5 py-3 text-right text-[13px] font-semibold text-slate-500 md:px-8">{t.home.details}</th>
                </tr>
              </thead>
              <tbody>
                {visibleCompanies.map((company, index) => {
                  const rank = startRank + index;
                  const companyMeta = [company.countryLabel, company.sectorLabel || company.industryLabel].filter(Boolean).join(" · ") || t.common.notSpecified;
                  return (
                    <tr key={company.id} className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-900/40">
                      <td className="px-5 py-4 text-sm font-semibold tabular-nums text-slate-500 md:px-8">{String(rank).padStart(2, "0")}</td>
                      <td className="px-4 py-4">
                        <Link href={localizedPath(locale, `/companies/${company.id}`)} className="text-[15px] font-semibold text-slate-950 hover:text-teal-700 dark:text-white dark:hover:text-teal-300">{company.displayName}</Link>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{companyMeta}</p>
                      </td>
                      <td className="px-4 py-4 text-right text-[22px] font-bold tabular-nums text-slate-950 dark:text-white">{formatScore(company.overallScore)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          {sortedCategories.map((category, categoryIndex) => {
                            const score = company.categories.find((item) => item.code === category.code)?.rawScore ?? null;
                            return <span key={category.code} title={category.label} className="text-[13px] font-semibold tabular-nums text-slate-700 dark:text-slate-200"><span className="mr-1 text-slate-400">{KPI_CODES[categoryIndex]}</span>{formatScore(score)}</span>;
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right md:px-8"><Link href={localizedPath(locale, `/companies/${company.id}`)} aria-label={`${company.displayName} ${t.common.viewDetails}`} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-teal-700 dark:hover:bg-slate-900 dark:hover:text-teal-300"><ArrowRight className="h-4 w-4" /></Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8 dark:border-slate-800 dark:bg-slate-900/40">
            <p className="text-sm tabular-nums text-slate-500">{startRank}–{endRank} / {rankedCompanies.length}</p>
            <div className="flex items-center gap-1">
              <button type="button" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-slate-600 disabled:opacity-35 dark:text-slate-300"><ChevronLeft className="h-4 w-4" />{t.companies.previousPage}</button>
              {Array.from({ length: pageCount }, (_, index) => <button key={index} type="button" onClick={() => setPage(index + 1)} aria-current={safePage === index + 1 ? "page" : undefined} className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold ${safePage === index + 1 ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-800"}`}>{index + 1}</button>)}
              <button type="button" disabled={safePage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-slate-600 disabled:opacity-35 dark:text-slate-300">{t.companies.nextPage}<ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
