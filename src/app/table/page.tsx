"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDashboardData } from "@/lib/data/use-dashboard-data";
import { getDisplayCompanyName } from "@/lib/data/company";
import { getLocalizedIndustryName } from "@/lib/data/industry";
import TablePageSkeleton from "./TablePageSkeleton";
import {
  getI18nStrings,
  HTML_LANG_BY_LANGUAGE,
  LOCALE_BY_LANGUAGE,
  isLanguage,
  type Language,
} from "@/lib/i18n";

type TableRowData = {
  companyId: string;
  companyName: string;
  industryName: string;
  country: string;
  year: number;
  emissions: number | null;
  pcrcScore: number | null;
  rank: number | null;
  ri: number | null;
  tag: number | null;
  mms: number | null;
};

type SortOption = "rank_asc" | "rank_desc" | "name_asc" | "name_desc";
const FIXED_TABLE_YEAR = 2024;
const COUNTRY_ORDER = ["KR", "JP"] as const;
const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;

function formatNumber(value: number, locale: string, fractionDigits = 0) {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

function TablePageContent() {
  const { data, loading, error } = useDashboardData();
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const [language, setLanguage] = useState<Language>(isLanguage(langParam) ? langParam : "EN");
  const strings = getI18nStrings(language);
  const locale = LOCALE_BY_LANGUAGE[language];

  useEffect(() => {
    document.documentElement.lang = HTML_LANG_BY_LANGUAGE[language];
  }, [language]);

  useEffect(() => {
    if (isLanguage(langParam) && langParam !== language) {
      setLanguage(langParam);
    }
  }, [langParam, language]);

  const rows = useMemo<TableRowData[]>(() => {
    const rowMap = new Map<string, TableRowData>();

    data.companies.forEach((company) => {
      const localizedIndustryName = getLocalizedIndustryName(company, language, "Unknown");
      const displayCompanyName = getDisplayCompanyName(company, company.name);
      const country = (company.country || "KR").toUpperCase();
      const runs = data.scoreRuns[company.id] ?? [];
      const emissions = data.emissionsData[company.id] ?? [];

      runs.forEach((run) => {
        const emission = emissions.find((entry) => entry.year === run.evalYear);
        const totalEmissions = emission
          ? emission.totalEmissions ?? emission.s1Emissions + emission.s2Emissions
          : null;
        const key = `${company.id}-${run.evalYear}`;
        rowMap.set(key, {
          companyId: company.id,
          companyName: displayCompanyName,
          industryName: localizedIndustryName,
          country,
          year: run.evalYear,
          emissions: totalEmissions,
          pcrcScore: run.pcrcScore,
          rank: 0,
          ri: run.riScore,
          tag: run.tagScore,
          mms: run.mmsScore,
        });
      });

      emissions.forEach((entry) => {
        const key = `${company.id}-${entry.year}`;
        const existing = rowMap.get(key);
        const totalEmissions = entry.totalEmissions ?? entry.s1Emissions + entry.s2Emissions;
        if (existing) {
          existing.emissions = totalEmissions;
        } else {
          rowMap.set(key, {
            companyId: company.id,
            companyName: displayCompanyName,
            industryName: localizedIndustryName,
            country,
            year: entry.year,
            emissions: totalEmissions,
            pcrcScore: null,
            rank: null,
            ri: null,
            tag: null,
            mms: null,
          });
        }
      });
    });

    const fixedYearRows = Array.from(rowMap.values()).filter((row) => row.year === FIXED_TABLE_YEAR);

    return fixedYearRows.sort((a, b) => {
      const nameCompare = a.companyName.localeCompare(b.companyName);
      if (nameCompare !== 0) return nameCompare;
      return b.year - a.year;
    });
  }, [data, language]);

  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedSort, setSelectedSort] = useState<SortOption>("rank_asc");
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState(1);
  const scoreFractionDigits = 2;
  const formatScore = (value: number | null) =>
    value === null ? "—" : formatNumber(value, locale, scoreFractionDigits);

  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    rows.forEach((row) => countries.add(row.country));
    return Array.from(countries).sort((a, b) => {
      const aOrder = COUNTRY_ORDER.indexOf(a as (typeof COUNTRY_ORDER)[number]);
      const bOrder = COUNTRY_ORDER.indexOf(b as (typeof COUNTRY_ORDER)[number]);
      const aPriority = aOrder === -1 ? COUNTRY_ORDER.length : aOrder;
      const bPriority = bOrder === -1 ? COUNTRY_ORDER.length : bOrder;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.localeCompare(b);
    });
  }, [rows]);

  const availableIndustries = useMemo(() => {
    const industries = new Set<string>();
    rows.forEach((row) => {
      if (selectedCountry !== "all" && row.country !== selectedCountry) return;
      industries.add(row.industryName);
    });
    return Array.from(industries).sort((a, b) => a.localeCompare(b));
  }, [rows, selectedCountry]);

  useEffect(() => {
    if (selectedIndustry === "all") return;
    if (availableIndustries.includes(selectedIndustry)) return;
    setSelectedIndustry("all");
  }, [availableIndustries, selectedIndustry]);

  const rankedRows = useMemo(() => {
    const rankBaseRows =
      selectedCountry === "all"
        ? rows
        : rows.filter((row) => row.country === selectedCountry);

    const rankByKey = new Map<string, number>();
    const scoredRows = rankBaseRows
      .filter((row) => row.pcrcScore !== null)
      .sort((a, b) => {
        const scoreDiff = (b.pcrcScore ?? 0) - (a.pcrcScore ?? 0);
        if (scoreDiff !== 0) return scoreDiff;
        return a.companyName.localeCompare(b.companyName, locale);
      });

    scoredRows.forEach((row, index) => {
      rankByKey.set(`${row.companyId}-${row.year}`, index + 1);
    });

    return rows.map((row) => ({
      ...row,
      rank: rankByKey.get(`${row.companyId}-${row.year}`) ?? null,
    }));
  }, [rows, selectedCountry, locale]);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rankedRows.filter((row) => {
      const matchesQuery =
        !normalized ||
        row.companyName.toLowerCase().includes(normalized) ||
        row.industryName.toLowerCase().includes(normalized);
      const matchesCountry = selectedCountry === "all" || row.country === selectedCountry;
      const matchesIndustry = selectedIndustry === "all" || row.industryName === selectedIndustry;
      return matchesQuery && matchesCountry && matchesIndustry;
    });
  }, [rankedRows, query, selectedCountry, selectedIndustry]);

  const sortedRows = useMemo(() => {
    const next = [...filteredRows];
    switch (selectedSort) {
      case "rank_asc":
        next.sort((a, b) => {
          if (a.rank === null && b.rank === null) return 0;
          if (a.rank === null) return 1;
          if (b.rank === null) return -1;
          return a.rank - b.rank;
        });
        break;
      case "rank_desc":
        next.sort((a, b) => {
          if (a.rank === null && b.rank === null) return 0;
          if (a.rank === null) return 1;
          if (b.rank === null) return -1;
          return b.rank - a.rank;
        });
        break;
      case "name_desc":
        next.sort((a, b) => b.companyName.localeCompare(a.companyName, locale));
        break;
      case "name_asc":
      default:
        next.sort((a, b) => a.companyName.localeCompare(b.companyName, locale));
        break;
    }
    return next;
  }, [filteredRows, selectedSort, locale]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCountry, selectedIndustry, selectedSort, pageSize]);

  const totalRows = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  useEffect(() => {
    if (currentPage <= totalPages) return;
    setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const pagedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedRows.slice(startIndex, startIndex + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const pageStart = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const pageEnd = totalRows === 0 ? 0 : Math.min(currentPage * pageSize, totalRows);

  const paginationLabels =
    language === "KR"
      ? {
          rowsPerPage: "페이지당 행",
          previous: "이전",
          next: "다음",
          page: "페이지",
          of: "/",
          showing: "표시",
        }
      : language === "JP"
        ? {
            rowsPerPage: "1ページあたり",
            previous: "前へ",
            next: "次へ",
            page: "ページ",
            of: "/",
            showing: "表示",
          }
        : {
            rowsPerPage: "Rows per page",
            previous: "Previous",
            next: "Next",
            page: "Page",
            of: "/",
            showing: "Showing",
          };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "";
    if (score >= 80) return "text-score-excellent";
    if (score >= 60) return "text-score-good";
    if (score >= 40) return "text-score-moderate";
    return "text-score-poor";
  };

  if (loading) {
    return <TablePageSkeleton />;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container py-6 text-destructive">
          {strings.page.failedToLoad.replace("{error}", error)}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{strings.table.title}</h1>
            <p className="text-sm text-muted-foreground">{strings.table.caption}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/?lang=${language}`}>{strings.table.back}</Link>
            </Button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={strings.table.filters.country} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{strings.table.filters.allCountries}</SelectItem>
              {availableCountries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder={strings.table.filters.industry} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{strings.table.filters.allIndustries}</SelectItem>
              {availableIndustries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={strings.table.searchPlaceholder}
            className="h-9 w-56 rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <div className="ml-auto">
            <Select value={selectedSort} onValueChange={(value) => setSelectedSort(value as SortOption)}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder={strings.table.filters.sort} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rank_asc">{strings.table.filters.sortOptions.rankAsc}</SelectItem>
                <SelectItem value="rank_desc">{strings.table.filters.sortOptions.rankDesc}</SelectItem>
                <SelectItem value="name_asc">{strings.table.filters.sortOptions.nameAsc}</SelectItem>
                <SelectItem value="name_desc">{strings.table.filters.sortOptions.nameDesc}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {sortedRows.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            {strings.table.noData}
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
              <div className="text-sm text-muted-foreground">
                {paginationLabels.showing} {formatNumber(pageStart, locale)}-{formatNumber(pageEnd, locale)} /{" "}
                {formatNumber(totalRows, locale)}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm text-muted-foreground">{paginationLabels.rowsPerPage}</div>
                <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                  <SelectTrigger className="h-8 w-[90px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="px-1 text-sm text-muted-foreground">
                  {paginationLabels.page} {formatNumber(currentPage, locale)} {paginationLabels.of}{" "}
                  {formatNumber(totalPages, locale)}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage <= 1}
                >
                  {paginationLabels.previous}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage >= totalPages}
                >
                  {paginationLabels.next}
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{strings.table.columns.company}</TableHead>
                  <TableHead>{strings.table.columns.industry}</TableHead>
                  <TableHead className="w-[100px]">{strings.table.columns.year}</TableHead>
                  <TableHead className="w-[100px] text-right">{strings.table.columns.ri}</TableHead>
                  <TableHead className="w-[100px] text-right">{strings.table.columns.tag}</TableHead>
                  <TableHead className="w-[100px] text-right">{strings.table.columns.mms}</TableHead>
                  <TableHead className="w-[110px] text-right bg-accent/5">{strings.table.columns.pcrc}</TableHead>
                  <TableHead className="w-[90px] text-right bg-accent/10">{strings.table.columns.rank}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedRows.map((row) => (
                  <TableRow key={`${row.companyId}-${row.year}`}>
                    <TableCell className="font-medium">{row.companyName}</TableCell>
                    <TableCell className="text-muted-foreground">{row.industryName}</TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell className="text-right font-mono">{formatScore(row.ri)}</TableCell>
                    <TableCell className="text-right font-mono">{formatScore(row.tag)}</TableCell>
                    <TableCell className="text-right font-mono">{formatScore(row.mms)}</TableCell>
                    <TableCell className={`text-right font-mono bg-accent/5 ${getScoreColor(row.pcrcScore)}`}>
                      {formatScore(row.pcrcScore)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-accent bg-accent/10">
                      {row.rank ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage <= 1}
              >
                {paginationLabels.previous}
              </Button>
              <div className="min-w-24 text-center text-sm text-muted-foreground">
                {formatNumber(currentPage, locale)} / {formatNumber(totalPages, locale)}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage >= totalPages}
              >
                {paginationLabels.next}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TablePage() {
  return (
    <Suspense
      fallback={<TablePageSkeleton />}
    >
      <TablePageContent />
    </Suspense>
  );
}
