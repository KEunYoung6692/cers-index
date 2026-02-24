"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AbsoluteEmissionsCard } from "@/components/dashboard/AbsoluteEmissionsCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { HeroScoreCard } from "@/components/dashboard/HeroScoreCard";
import { IndustryAveragesCard } from "@/components/dashboard/IndustryAveragesCard";
import { IndustryDistributionChart } from "@/components/dashboard/IndustryDistributionChart";
import { IntensityTrendChart } from "@/components/dashboard/IntensityTrendChart";
import { TrustBadges } from "@/components/dashboard/TrustBadges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  calculateIndustryPercentile,
  calculateYoYChange,
  getCompanyById,
  getScoreRunsForCompany,
} from "@/lib/data/metrics";
import { compareCompaniesByMarketCapDesc, getDisplayCompanyName } from "@/lib/data/company";
import { getLocalizedIndustryName } from "@/lib/data/industry";
import { useDashboardData } from "@/lib/data/use-dashboard-data";
import { getI18nStrings, type Language, HTML_LANG_BY_LANGUAGE, isLanguage } from "@/lib/i18n";

const FIXED_HEADER_YEAR = 2024;

function DashboardLoadingSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[280px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-[170px]" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>
      <div className="container py-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="col-span-8">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-12 w-40" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            </CardContent>
          </Card>
          <div className="col-span-4 flex flex-col gap-4">
            <Card>
              <CardContent className="p-3">
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-3 p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          </div>
          <Card className="col-span-12 lg:col-span-8">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card className="col-span-12 lg:col-span-4">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Card className="col-span-12 lg:col-span-6">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-60 w-full" />
            </CardContent>
          </Card>
          <Card className="col-span-12 lg:col-span-6">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-60 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function PageContent() {
  const [selectedCountry, setSelectedCountry] = useState("KR");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const { data, loading, error, source, resolvedCompanyId } = useDashboardData({
    scope: "main",
    country: selectedCountry,
    companyId: selectedCompanyId || undefined,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const [language, setLanguage] = useState<Language>(isLanguage(langParam) ? langParam : "EN");
  const strings = getI18nStrings(language);
  const filteredCompanies = useMemo(
    () =>
      data.companies
        .filter((company) => (company.country || "KR") === selectedCountry)
        .slice()
        .sort(compareCompaniesByMarketCapDesc),
    [data.companies, selectedCountry],
  );
  const defaultCompanyId = filteredCompanies[0]?.id ?? "";
  const activeCompanyId = source === "db" ? (resolvedCompanyId || selectedCompanyId) : selectedCompanyId;
  const isInitialDbLoad = source === "db" && loading && data.companies.length === 0;
  const isRefreshing = source === "db" && loading && data.companies.length > 0;

  const selectedYear = FIXED_HEADER_YEAR;
  useEffect(() => {
    if (source === "db") return;

    if (!defaultCompanyId) {
      setSelectedCompanyId("");
      return;
    }

    setSelectedCompanyId((current) => {
      const exists = filteredCompanies.some((company) => company.id === current);
      return exists ? current : defaultCompanyId;
    });
  }, [source, filteredCompanies, defaultCompanyId]);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG_BY_LANGUAGE[language];
  }, [language]);

  useEffect(() => {
    if (isLanguage(langParam) && langParam !== language) {
      setLanguage(langParam);
    }
  }, [langParam, language]);

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLanguage);
    router.replace(`/?${params.toString()}`);
  };

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCompanyId("");
  };

  const scoreRuns = getScoreRunsForCompany(data, activeCompanyId);

  if (isInitialDbLoad) return <DashboardLoadingSkeleton />;

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container py-6 text-destructive">
          {strings.page.failedToLoad.replace("{error}", error)}
        </div>
      </main>
    );
  }
  const scoreRun = scoreRuns.find((run) => run.evalYear === selectedYear) ?? scoreRuns[0];
  const yoyChange = calculateYoYChange(data, activeCompanyId);
  const industryPercentile = calculateIndustryPercentile(data, activeCompanyId);
  const company = getCompanyById(data, activeCompanyId);
  const companyName = getDisplayCompanyName(company, strings.industryDistribution.yourCompany);
  const industry = company ? data.industryData[company.industryId] : undefined;
  const industryName = getLocalizedIndustryName(company, language, strings.page.industryFallback);
  const reportsForCompany = data.reports[activeCompanyId] ?? [];
  const targetReportYear = selectedYear + 1;
  const report =
    reportsForCompany.find((item) => item.reportYear === targetReportYear) ??
    [...reportsForCompany]
      .filter((item) => item.reportYear <= targetReportYear)
      .sort((a, b) => b.reportYear - a.reportYear)[0] ??
    reportsForCompany[0];
  const emissions = data.emissionsData[activeCompanyId] ?? [];
  const target = data.targets[activeCompanyId];

  const hasCompanies = filteredCompanies.length > 0;

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader
        companies={filteredCompanies}
        selectedCompanyId={activeCompanyId}
        selectedYear={selectedYear}
        selectedCountry={selectedCountry}
        selectedLanguage={language}
        strings={strings}
        onCompanyChange={handleCompanyChange}
        onCountryChange={handleCountryChange}
        onLanguageChange={handleLanguageChange}
      />
      <div className="container py-6">
        {isRefreshing && (
          <div className="mb-4 flex items-center justify-between rounded-lg border bg-card/60 px-4 py-3 backdrop-blur">
            <div className="text-sm text-muted-foreground">{strings.page.loading}</div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-16 rounded-full" />
              <Skeleton className="h-2 w-10 rounded-full" />
            </div>
          </div>
        )}
        {!hasCompanies ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            {strings.page.noCompanies.replace("{country}", selectedCountry)}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            <HeroScoreCard
              scoreRun={scoreRun}
              yoyChange={yoyChange}
              industryPercentile={industryPercentile}
              strings={strings}
            />
            <div className="col-span-4 flex flex-col gap-4">
              <Card>
                <CardContent className="p-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/table?lang=${language}`}>{strings.table.viewTable}</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/logic?lang=${language}`}>{strings.table.logicWidget}</Link>
                  </Button>
                </CardContent>
              </Card>
              <TrustBadges report={report} strings={strings} />
            </div>
            <IndustryDistributionChart
              industryData={industry}
              currentScore={scoreRun}
              industryName={industryName}
              companyName={companyName}
              strings={strings}
            />
            <IndustryAveragesCard industryData={industry} industryName={industryName} strings={strings} />
            <IntensityTrendChart emissionsData={emissions} target={target} selectedYear={selectedYear} strings={strings} />
            <AbsoluteEmissionsCard emissionsData={emissions} selectedYear={selectedYear} strings={strings} />
          </div>
        )}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={(
        <main className="min-h-screen bg-background">
          <div className="container py-6 text-muted-foreground">Loading...</div>
        </main>
      )}
    >
      <PageContent />
    </Suspense>
  );
}
