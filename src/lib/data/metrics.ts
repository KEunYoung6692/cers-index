import type { DashboardData } from "./dashboard";
import type { EvidenceItem, ScoreRun } from "@/data/mockData";

export function getCompanyById(data: DashboardData, id: string) {
  return data.companies.find((company) => company.id === id);
}

export function getScoreRunsForCompany(data: DashboardData, companyId: string): ScoreRun[] {
  return data.scoreRuns[companyId] ?? [];
}

export function getLatestScoreRun(data: DashboardData, companyId: string): ScoreRun | undefined {
  const runs = getScoreRunsForCompany(data, companyId);
  return runs.length > 0 ? runs[0] : undefined;
}

export function getDefaultYear(data: DashboardData, companyId: string) {
  const runs = getScoreRunsForCompany(data, companyId);
  if (runs.length === 0) return new Date().getFullYear();
  return Math.max(...runs.map((run) => run.evalYear));
}

export function calculateYoYChange(data: DashboardData, companyId: string): number | null {
  const runs = getScoreRunsForCompany(data, companyId);
  if (runs.length < 2) return null;
  return runs[0].pcrcScore - runs[1].pcrcScore;
}

export function calculateIndustryPercentile(data: DashboardData, companyId: string): number | null {
  const company = getCompanyById(data, companyId);
  const scoreRun = getLatestScoreRun(data, companyId);
  if (!company || !scoreRun) return null;

  const industry = data.industryData[company.industryId];
  if (!industry || industry.scores.length === 0) return null;

  const belowCount = industry.scores.filter((score) => score < scoreRun.pcrcScore).length;
  return Math.round((belowCount / industry.scores.length) * 100);
}

export function getDataMixRatio(data: DashboardData, companyId: string) {
  const evidence = data.evidenceItems[companyId] ?? [];
  const total = evidence.length || 1;
  const verified = evidence.filter((item) => item.status === "verified").length;
  const self = evidence.filter((item) => item.status === "self-reported").length;
  const proxy = total - verified - self;

  return {
    verified: Math.round((verified / total) * 100),
    self: Math.round((self / total) * 100),
    proxy: Math.round((proxy / total) * 100),
  };
}

export function getEvidenceCoverage(data: DashboardData, companyId: string): number {
  const evidence: EvidenceItem[] = data.evidenceItems[companyId] ?? [];
  const withPage = evidence.filter((item) => item.evidencePage !== null && item.evidencePage !== undefined).length;
  return evidence.length > 0 ? Math.round((withPage / evidence.length) * 100) : 0;
}
