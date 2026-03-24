export type CersCategoryMeta = {
  id: string;
  code: string;
  label: string;
  weight: number;
  displayOrder: number;
};

export type CersCategoryScore = CersCategoryMeta & {
  rawScore: number | null;
  weightedScore: number | null;
};

export type CersMetricSnapshot = {
  fiscalYear: number | null;
  scope1Emissions: number | null;
  scope2Emissions: number | null;
  totalEmissions: number | null;
  revenue: number | null;
  greenCapex: number | null;
  totalCapex: number | null;
  ebitda: number | null;
};

export type CersEmissionHistoryPoint = {
  fiscalYear: number;
  scope1Emissions: number | null;
  scope2Emissions: number | null;
  totalEmissions: number | null;
};

export type CersDocumentSummary = {
  id: string;
  title: string;
  documentType: string | null;
  sourceType: string | null;
  reportYear: number | null;
  publishedDate: string | null;
  frameworks: string[];
  assuranceProvider: string | null;
  assuranceType: string | null;
};

export type CersTargetFact = {
  id: string;
  targetType: string;
  metricType: string | null;
  baseYear: number | null;
  targetYear: number | null;
  scopeCode: string | null;
  targetValue: number | null;
  targetUnit: string | null;
  targetReductionPct: number | null;
  scenarioAlignmentCode: string | null;
  sbtiApproved: boolean | null;
  residualDefined: boolean | null;
  offsetUsage: boolean | null;
  offsetDependencyRatio: number | null;
  carbonRemovalPlan: boolean | null;
  disclosed: boolean | null;
};

export type CersTargetSummary = {
  currentYear: number | null;
  baseYear: number | null;
  targetYear: number | null;
  netZeroYear: number | null;
  targetType: string | null;
  targetTypeLabel: string | null;
  scopeCode: string | null;
  scopeLabel: string | null;
  reductionPct: number | null;
  targetEmissions: number | null;
  sbtiApproved: boolean | null;
  interimTargetLabel: string | null;
};

export type CersDisclosureSummary = {
  scope3DisclosedCategories: number;
  scope3TotalCategories: number;
  averagePrimaryDataRatio: number | null;
  assuranceType: string | null;
  assuranceProvider: string | null;
  frameworks: string[];
  hasThirdPartyAssurance: boolean;
};

export type CersCompanyProfile = {
  id: string;
  name: string;
  localName: string | null;
  displayName: string;
  stockCode: string | null;
  countryCode: string | null;
  countryLabel: string | null;
  marketCode: string | null;
  marketLabel: string | null;
  sectorCode: string | null;
  sectorLabel: string | null;
  industryCode: string | null;
  industryLabel: string | null;
  status: string | null;
  fiscalYear: number | null;
  scoreFiscalYear: number | null;
  methodologyVersion: string | null;
  overallScore: number | null;
  scoreGrade: string | null;
  sbase: number | null;
  cef: number | null;
  gv: number | null;
  categories: CersCategoryScore[];
  metrics: CersMetricSnapshot;
  targets: CersTargetFact[];
  targetSummary: CersTargetSummary;
  disclosure: CersDisclosureSummary;
  latestDocument: CersDocumentSummary | null;
  badges: string[];
  summary: string;
  interpretation: string;
};

export type CersDashboardData = {
  source: "db" | "fallback";
  issue: string | null;
  generatedAt: string;
  methodologyVersion: string | null;
  categories: CersCategoryMeta[];
  companies: CersCompanyProfile[];
};

export type CersIndustryFocusPoint = {
  title: string;
  description: string;
};

export type CersIndustryStatBlock = {
  value: number | null;
  count?: number | null;
  total?: number | null;
};

export type CersIndustrySummary = {
  industryCode: string;
  label: string;
  sectorCode: string | null;
  sectorLabel: string | null;
  averageScore: number | null;
  medianScore: number | null;
  scoreCoverage: number | null;
  scoredCompanyCount: number;
  latestScoreYear: number | null;
  scoreQuartileLow: number | null;
  scoreQuartileHigh: number | null;
  sampleBucket: "robust" | "limited";
  strongestCategory: string | null;
  weakestCategory: string | null;
  categoryAverages: CersCategoryScore[];
  targetStats: {
    targetCoverage: CersIndustryStatBlock;
    netZeroCoverage: CersIndustryStatBlock;
    sbtiCoverage: CersIndustryStatBlock;
    interimCoverage: CersIndustryStatBlock;
    medianTargetYear: number | null;
  };
  disclosureStats: {
    assuranceCoverage: CersIndustryStatBlock;
    scope3CoverageAverage: number | null;
    primaryDataRatioAverage: number | null;
    frameworkCoverage: CersIndustryStatBlock;
  };
  companyCount: number;
  performanceTag: string;
  companies: CersCompanyProfile[];
  scoreDistribution: Array<{ range: string; count: number }>;
  focusPoints: CersIndustryFocusPoint[];
  summary: string;
};
