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
import Link from "next/link";
import {
  calculateIndustryPercentile,
  calculateYoYChange,
  getCompanyById,
  getDefaultYear,
  getScoreRunsForCompany,
} from "@/lib/data/metrics";
import { getLocalizedIndustryName } from "@/lib/data/industry";
import { useDashboardData } from "@/lib/data/use-dashboard-data";
import { getI18nStrings, type Language, HTML_LANG_BY_LANGUAGE, isLanguage } from "@/lib/i18n";

function PageContent() {
  const { data, loading, error, source } = useDashboardData();
  const [selectedCountry, setSelectedCountry] = useState("KR");
  const router = useRouter();
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const [language, setLanguage] = useState<Language>(isLanguage(langParam) ? langParam : "EN");
  const strings = getI18nStrings(language);
  const filteredCompanies = useMemo(
    () => data.companies.filter((company) => (company.country || "KR") === selectedCountry),
    [data.companies, selectedCountry],
  );
  const defaultCompanyId = filteredCompanies[0]?.id ?? "";

  const [selectedCompanyId, setSelectedCompanyId] = useState(defaultCompanyId);
  const [selectedYear, setSelectedYear] = useState(() => getDefaultYear(data, defaultCompanyId));
  useEffect(() => {
    if (!defaultCompanyId) {
      setSelectedCompanyId("");
      return;
    }

    setSelectedCompanyId((current) => {
      const exists = filteredCompanies.some((company) => company.id === current);
      return exists ? current : defaultCompanyId;
    });

    setSelectedYear((current) => {
      const runs = getScoreRunsForCompany(data, defaultCompanyId);
      const hasCurrentYear = runs.some((run) => run.evalYear === current);
      return hasCurrentYear ? current : getDefaultYear(data, defaultCompanyId);
    });
  }, [data, defaultCompanyId, filteredCompanies]);

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
    setSelectedYear((current) => {
      const runs = getScoreRunsForCompany(data, companyId);
      const hasCurrentYear = runs.some((run) => run.evalYear === current);
      return hasCurrentYear ? current : getDefaultYear(data, companyId);
    });
  };

  const scoreRuns = getScoreRunsForCompany(data, selectedCompanyId);
  const availableYears = useMemo(() => {
    const companyScoreYears = scoreRuns.map((run) => run.evalYear);
    const companyEmissionYears = (data.emissionsData[selectedCompanyId] ?? []).map((entry) => entry.year);
    const companyYears = Array.from(new Set([...companyScoreYears, ...companyEmissionYears])).sort((a, b) => b - a);
    if (companyYears.length > 0) return companyYears;

    const allScoreYears = Object.values(data.scoreRuns).flat().map((run) => run.evalYear);
    const allEmissionYears = Object.values(data.emissionsData).flat().map((entry) => entry.year);
    return Array.from(new Set([...allScoreYears, ...allEmissionYears])).sort((a, b) => b - a);
  }, [scoreRuns, data.scoreRuns, data.emissionsData, selectedCompanyId]);

  useEffect(() => {
    if (availableYears.length === 0) return;
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  if (source === "db" && loading) {
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
  const scoreRun = scoreRuns.find((run) => run.evalYear === selectedYear) ?? scoreRuns[0];
  const yoyChange = calculateYoYChange(data, selectedCompanyId);
  const industryPercentile = calculateIndustryPercentile(data, selectedCompanyId);
  const company = getCompanyById(data, selectedCompanyId);
  const industry = company ? data.industryData[company.industryId] : undefined;
  const industryName = getLocalizedIndustryName(company, language, strings.page.industryFallback);
  const reportsForCompany = data.reports[selectedCompanyId] ?? [];
  const targetReportYear = selectedYear + 1;
  const report =
    reportsForCompany.find((item) => item.reportYear === targetReportYear) ??
    [...reportsForCompany]
      .filter((item) => item.reportYear <= targetReportYear)
      .sort((a, b) => b.reportYear - a.reportYear)[0] ??
    reportsForCompany[0];
  const emissions = data.emissionsData[selectedCompanyId] ?? [];
  const target = data.targets[selectedCompanyId];

  const hasCompanies = filteredCompanies.length > 0;

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader
        companies={filteredCompanies}
        selectedCompanyId={selectedCompanyId}
        selectedYear={selectedYear}
        selectedCountry={selectedCountry}
        selectedLanguage={language}
        strings={strings}
        availableYears={availableYears}
        onCompanyChange={handleCompanyChange}
        onYearChange={setSelectedYear}
        onCountryChange={setSelectedCountry}
        onLanguageChange={handleLanguageChange}
      />
      <div className="container py-6">
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
              companyName={company?.name}
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
