"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import { companyScoreSort, formatScore } from "@/lib/cers/public";
import type { CersCategoryMeta, CersCompanyProfile } from "@/lib/cers/types";

const ROWS_PER_PAGE = 7;
const ROTATION_DELAY_MS = 5200;

type HomeScoreLeaderboardProps = {
  companies: CersCompanyProfile[];
  categories: CersCategoryMeta[];
  locale?: SupportedLocale;
};

function chunkCompanies(companies: CersCompanyProfile[], size: number) {
  const pages: CersCompanyProfile[][] = [];

  for (let index = 0; index < companies.length; index += size) {
    pages.push(companies.slice(index, index + size));
  }

  return pages;
}

function getRankBadgeClass(rank: number) {
  if (rank === 1) {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200";
  }
  if (rank <= 3) {
    return "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200";
  }
  return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

export function HomeScoreLeaderboard({ companies, categories, locale = "en" }: HomeScoreLeaderboardProps) {
  const t = getTranslations(locale);
  const [pageIndex, setPageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 4);
  const rankedCompanies = [...companies].filter((company) => company.overallScore !== null).sort(companyScoreSort);
  const pages = chunkCompanies(rankedCompanies, ROWS_PER_PAGE);
  const pageCount = pages.length;
  const visibleCompanies = pages[pageIndex] ?? [];
  const visibleStartRank = pageIndex * ROWS_PER_PAGE + 1;
  const visibleEndRank = visibleStartRank + visibleCompanies.length - 1;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference);
      return () => mediaQuery.removeEventListener("change", updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  useEffect(() => {
    if (pageCount === 0) {
      setPageIndex(0);
      return;
    }

    if (pageIndex >= pageCount) {
      setPageIndex(pageCount - 1);
    }
  }, [pageCount, pageIndex]);

  useEffect(() => {
    if (pageCount <= 1 || isPaused || prefersReducedMotion) return undefined;

    const rotationTimer = window.setTimeout(() => {
      setPageIndex((currentPage) => (currentPage + 1) % pageCount);
    }, ROTATION_DELAY_MS);

    return () => window.clearTimeout(rotationTimer);
  }, [isPaused, pageCount, pageIndex, prefersReducedMotion]);

  if (rankedCompanies.length === 0) {
    return (
      <div className="w-full">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-teal-700">{t.home.eyebrow}</p>
        <h1 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
          {t.companies.scoreListTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">{t.companies.noResults}</p>
      </div>
    );
  }

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-teal-700">{t.home.eyebrow}</p>
          <h1 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
            {t.companies.scoreListTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">{t.companies.scoreListDescription}</p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {visibleStartRank}-{visibleEndRank} / {rankedCompanies.length}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-950/80">
        <div className="overflow-x-auto">
          <div>
            <table className="min-w-[980px] w-full border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900/80">
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {t.companies.scoreListColumns.rank}
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {t.companies.scoreListColumns.company}
                  </th>
                  {sortedCategories.map((category) => (
                    <th
                      key={category.code}
                      className="px-3 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400"
                    >
                      {category.label}
                    </th>
                  ))}
                  <th className="px-4 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {t.companies.scoreListColumns.score}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleCompanies.map((company, index) => {
                  const rank = visibleStartRank + index;
                  const companyMeta = company.sectorLabel || company.industryLabel || t.common.notSpecified;

                  return (
                    <tr
                      key={`${pageIndex}-${company.id}`}
                      className="border-b border-slate-200/80 transition hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-900/50"
                    >
                      <td
                        className={`px-4 py-3 ${prefersReducedMotion ? "" : "animate-in fade-in-0 slide-in-from-bottom-2"}`}
                        style={
                          prefersReducedMotion
                            ? undefined
                            : {
                                animationDelay: `${index * 70}ms`,
                                animationDuration: "420ms",
                              }
                        }
                      >
                        <span
                          className={`inline-flex min-w-11 items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${getRankBadgeClass(rank)}`}
                        >
                          {rank}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={localizedPath(locale, `/companies/${company.id}`)}
                          className={`block font-medium text-slate-900 hover:text-teal-700 dark:text-slate-100 dark:hover:text-teal-300 ${
                            prefersReducedMotion ? "" : "animate-in fade-in-0 slide-in-from-bottom-2"
                          }`}
                          style={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  animationDelay: `${index * 70}ms`,
                                  animationDuration: "420ms",
                                }
                          }
                        >
                          {company.displayName}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{companyMeta}</p>
                      </td>
                      {sortedCategories.map((category) => {
                        const score = company.categories.find((item) => item.code === category.code)?.rawScore ?? null;

                        return (
                          <td
                            key={`${company.id}-${category.code}`}
                            className={`px-3 py-3 text-right text-sm text-slate-700 dark:text-slate-200 ${
                              prefersReducedMotion ? "" : "animate-in fade-in-0 slide-in-from-bottom-2"
                            }`}
                            style={
                              prefersReducedMotion
                                ? undefined
                                : {
                                    animationDelay: `${60 + index * 70}ms`,
                                    animationDuration: "420ms",
                                  }
                            }
                          >
                            {formatScore(score)}
                          </td>
                        );
                      })}
                      <td
                        className={`px-4 py-3 text-right text-base font-semibold text-teal-700 dark:text-teal-300 ${
                          prefersReducedMotion ? "" : "animate-in fade-in-0 slide-in-from-bottom-2"
                        }`}
                        style={
                          prefersReducedMotion
                            ? undefined
                            : {
                                animationDelay: `${120 + index * 70}ms`,
                                animationDuration: "420ms",
                              }
                        }
                      >
                        {formatScore(company.overallScore)}
                      </td>
                    </tr>
                  );
                })}

                {Array.from({ length: Math.max(ROWS_PER_PAGE - visibleCompanies.length, 0) }).map((_, index) => (
                  <tr key={`placeholder-${index}`} className="border-b border-slate-200/80 dark:border-slate-800">
                    <td colSpan={sortedCategories.length + 3} className="h-[61px] px-4 py-3" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {pageCount > 1 && (
          <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.companies.scoreListCount(rankedCompanies.length)}
            </p>
            <div className="flex items-center gap-2">
              {pages.map((_, index) => {
                const pageStartRank = index * ROWS_PER_PAGE + 1;
                const pageEndRank = Math.min((index + 1) * ROWS_PER_PAGE, rankedCompanies.length);

                return (
                  <button
                    key={`page-dot-${index}`}
                    type="button"
                    onClick={() => {
                      setPageIndex(index);
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      index === pageIndex
                        ? "w-8 bg-teal-600 dark:bg-teal-400"
                        : "w-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                    }`}
                    aria-label={`${pageStartRank}-${pageEndRank}`}
                    title={`${pageStartRank}-${pageEndRank}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
