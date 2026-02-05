"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDashboardData } from "@/lib/data/use-dashboard-data";
import {
  getI18nStrings,
  HTML_LANG_BY_LANGUAGE,
  LOCALE_BY_LANGUAGE,
  isLanguage,
  type Language,
} from "@/lib/i18n";

type TableRowData = {
  companyName: string;
  industryName: string;
  year: number;
  emissions: number | null;
  ri: number;
  tag: number;
  mms: number;
};

function formatNumber(value: number, locale: string, fractionDigits = 0) {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export default function TablePage() {
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
    const collected: TableRowData[] = [];

    data.companies.forEach((company) => {
      const runs = data.scoreRuns[company.id] ?? [];
      const emissions = data.emissionsData[company.id] ?? [];

      runs.forEach((run) => {
        const emission = emissions.find((entry) => entry.year === run.evalYear);
        const totalEmissions = emission
          ? emission.totalEmissions ?? emission.s1Emissions + emission.s2Emissions
          : null;

        collected.push({
          companyName: company.name,
          industryName: company.industryName,
          year: run.evalYear,
          emissions: totalEmissions,
          ri: run.riScore,
          tag: run.tagScore,
          mms: run.mmsScore,
        });
      });
    });

    return collected.sort((a, b) => {
      const nameCompare = a.companyName.localeCompare(b.companyName);
      if (nameCompare !== 0) return nameCompare;
      return b.year - a.year;
    });
  }, [data]);

  const [query, setQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    rows.forEach((row) => years.add(row.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [rows]);

  const availableIndustries = useMemo(() => {
    const industries = new Set<string>();
    rows.forEach((row) => industries.add(row.industryName));
    return Array.from(industries).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery =
        !normalized ||
        row.companyName.toLowerCase().includes(normalized) ||
        row.industryName.toLowerCase().includes(normalized);
      const matchesYear = selectedYear === "all" || row.year === Number(selectedYear);
      const matchesIndustry = selectedIndustry === "all" || row.industryName === selectedIndustry;
      return matchesQuery && matchesYear && matchesIndustry;
    });
  }, [rows, query, selectedIndustry, selectedYear]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container py-6 text-muted-foreground">{strings.page.loading}</div>
      </main>
    );
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
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={strings.table.filters.year} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{strings.table.filters.allYears}</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
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
        </div>

        {filteredRows.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            {strings.table.noData}
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{strings.table.columns.company}</TableHead>
                  <TableHead>{strings.table.columns.industry}</TableHead>
                  <TableHead className="w-[100px]">{strings.table.columns.year}</TableHead>
                  <TableHead className="w-[200px] text-right">{strings.table.columns.emissions}</TableHead>
                  <TableHead className="w-[100px] text-right">{strings.table.columns.ri}</TableHead>
                  <TableHead className="w-[100px] text-right">{strings.table.columns.tag}</TableHead>
                  <TableHead className="w-[100px] text-right">{strings.table.columns.mms}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={`${row.companyName}-${row.year}`}>
                    <TableCell className="font-medium">{row.companyName}</TableCell>
                    <TableCell className="text-muted-foreground">{row.industryName}</TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell className="text-right font-mono">
                      {row.emissions === null ? "—" : formatNumber(row.emissions, locale)}
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(row.ri, locale, 1)}</TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(row.tag, locale, 1)}</TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(row.mms, locale, 1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  );
}
