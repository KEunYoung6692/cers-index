import type {
  Company,
  EmissionData,
  EvidenceItem,
  IndustryData,
  Report,
  ScoreRun,
  Target,
} from "@/data/mockData";
import {
  companies,
  emissionsData,
  evidenceItems,
  industryData,
  reports,
  scoreRuns,
  targets,
} from "@/data/mockData";

export type DashboardData = {
  companies: Company[];
  scoreRuns: Record<string, ScoreRun[]>;
  reports: Record<string, Report>;
  emissionsData: Record<string, EmissionData[]>;
  targets: Record<string, Target>;
  industryData: Record<string, IndustryData>;
  evidenceItems: Record<string, EvidenceItem[]>;
};

export const mockDashboardData: DashboardData = {
  companies,
  scoreRuns,
  reports,
  emissionsData,
  targets,
  industryData,
  evidenceItems,
};
