"use client";

import { useEffect, useMemo, useState } from "react";
import { AbsoluteEmissionsCard } from "@/components/dashboard/AbsoluteEmissionsCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { HeroScoreCard } from "@/components/dashboard/HeroScoreCard";
import { IndustryAveragesCard } from "@/components/dashboard/IndustryAveragesCard";
import { IndustryDistributionChart } from "@/components/dashboard/IndustryDistributionChart";
import { IntensityTrendChart } from "@/components/dashboard/IntensityTrendChart";
import { TrustBadges } from "@/components/dashboard/TrustBadges";
import {
  calculateIndustryPercentile,
  calculateYoYChange,
  getCompanyById,
  getDataMixRatio,
  getDefaultYear,
  getEvidenceCoverage,
  getScoreRunsForCompany,
} from "@/lib/data/metrics";
import { useDashboardData } from "@/lib/data/use-dashboard-data";

export default function Page() {
  const { data, loading, error, source } = useDashboardData();
  const [selectedCountry, setSelectedCountry] = useState("KR");
  const filteredCompanies = useMemo(
    () => data.companies.filter((company) => (company.country || "KR") === selectedCountry),
    [data.companies, selectedCountry],
  );
  const defaultCompanyId = filteredCompanies[0]?.id ?? "";

  const [selectedCompanyId, setSelectedCompanyId] = useState(defaultCompanyId);
  const [selectedYear, setSelectedYear] = useState(() => getDefaultYear(data, defaultCompanyId));
  const [includeSubCompany, setIncludeSubCompany] = useState(false);

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

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setSelectedYear((current) => {
      const runs = getScoreRunsForCompany(data, companyId);
      const hasCurrentYear = runs.some((run) => run.evalYear === current);
      return hasCurrentYear ? current : runs[0]?.evalYear ?? current;
    });
  };

  if (source === "db" && loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container py-6 text-muted-foreground">Loading dashboard data...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container py-6 text-destructive">Failed to load data: {error}</div>
      </main>
    );
  }

  const scoreRuns = getScoreRunsForCompany(data, selectedCompanyId);
  const scoreRun = scoreRuns.find((run) => run.evalYear === selectedYear) ?? scoreRuns[0];
  const yoyChange = calculateYoYChange(data, selectedCompanyId);
  const industryPercentile = calculateIndustryPercentile(data, selectedCompanyId);
  const company = getCompanyById(data, selectedCompanyId);
  const industry = company ? data.industryData[company.industryId] : undefined;
  const industryName = company?.industryName ?? "Industry";
  const report = data.reports[selectedCompanyId];
  const emissions = data.emissionsData[selectedCompanyId] ?? [];
  const target = data.targets[selectedCompanyId];
  const evidenceCoverage = selectedCompanyId ? getEvidenceCoverage(data, selectedCompanyId) : 0;
  const dataMix = selectedCompanyId ? getDataMixRatio(data, selectedCompanyId) : { verified: 0, self: 0, proxy: 0 };

  const hasCompanies = filteredCompanies.length > 0;

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader
        companies={filteredCompanies}
        selectedCompanyId={selectedCompanyId}
        selectedYear={selectedYear}
        includeSubCompany={includeSubCompany}
        selectedCountry={selectedCountry}
        report={report}
        dataMix={dataMix}
        onCompanyChange={handleCompanyChange}
        onYearChange={setSelectedYear}
        onCountryChange={setSelectedCountry}
        onSubCompanyToggle={setIncludeSubCompany}
      />
      <div className="container py-6">
        {!hasCompanies ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No companies available for {selectedCountry}.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            <HeroScoreCard
              scoreRun={scoreRun}
              yoyChange={yoyChange}
              industryPercentile={industryPercentile}
            />
            <TrustBadges report={report} evidenceCoverage={evidenceCoverage} />
            <IndustryDistributionChart
              industryData={industry}
              currentScore={scoreRun}
              industryName={industryName}
            />
            <IndustryAveragesCard industryData={industry} industryName={industryName} />
            <IntensityTrendChart emissionsData={emissions} target={target} selectedYear={selectedYear} />
            <AbsoluteEmissionsCard emissionsData={emissions} selectedYear={selectedYear} />
          </div>
        )}
      </div>
    </main>
  );
}
