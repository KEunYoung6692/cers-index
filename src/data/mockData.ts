// Mock data for CERS Index Dashboard

export interface Company {
    id: string;
    name: string;
    industryId: string;
    industryName: string;
    country: string;
  }
  
  export interface ScoreRun {
    evalYear: number;
    pcrcScore: number;
    riScore: number;
    tagScore: number;
    mmsScore: number;
    riMax: number;
    tagMax: number;
    mmsMax: number;
  }
  
  export interface Report {
    reportYear: number;
    publicationDate: string;
    assuranceOrg: string | null;
    frameworks: string[];
  }
  
export interface EmissionData {
    year: number;
    s1Emissions: number;
    s2Emissions: number;
    totalEmissions?: number;
    denomValue: number;
    denomType: string;
  }
  
  export interface Target {
    scope: string;
    targetReductionPct: number;
    baseYear: number;
    targetYear: number;
  }
  
  export interface IndustryData {
    companyCount: number;
    scores: number[];
    avgIntensity: number;
    avgPcrc: number;
    alpha: number;
  }
  
  export interface EvidenceItem {
    category: string;
    indicator: string;
    year?: number;
    evidencePage: string | null;
    evidenceNote: string | null;
    status?: string;
    pointsAwarded?: number;
  }
  
  // Mock companies
  export const companies: Company[] = [
    { id: '1', name: 'Samsung Electronics', industryId: 'tech', industryName: 'Technology Hardware', country: 'KR' },
    { id: '2', name: 'SK Hynix', industryId: 'tech', industryName: 'Technology Hardware', country: 'KR' },
    { id: '3', name: 'LG Energy Solution', industryId: 'battery', industryName: 'Batteries & Storage', country: 'KR' },
    { id: '4', name: 'POSCO Holdings', industryId: 'steel', industryName: 'Steel & Metals', country: 'JP' },
    { id: '5', name: 'Hyundai Motor', industryId: 'auto', industryName: 'Automobiles', country: 'KR' },
    { id: '6', name: 'Korean Air', industryId: 'aviation', industryName: 'Airlines', country: 'JP' },
  ];
  
  // Mock score runs
  export const scoreRuns: Record<string, ScoreRun[]> = {
    '1': [
      { evalYear: 2024, pcrcScore: 78.5, riScore: 28.2, tagScore: 32.1, mmsScore: 18.2, riMax: 35, tagMax: 40, mmsMax: 25 },
      { evalYear: 2023, pcrcScore: 71.2, riScore: 25.4, tagScore: 29.8, mmsScore: 16.0, riMax: 35, tagMax: 40, mmsMax: 25 },
      { evalYear: 2022, pcrcScore: 64.8, riScore: 22.1, tagScore: 27.5, mmsScore: 15.2, riMax: 35, tagMax: 40, mmsMax: 25 },
    ],
    '2': [
      { evalYear: 2024, pcrcScore: 72.3, riScore: 26.5, tagScore: 28.8, mmsScore: 17.0, riMax: 35, tagMax: 40, mmsMax: 25 },
      { evalYear: 2023, pcrcScore: 68.1, riScore: 24.2, tagScore: 27.4, mmsScore: 16.5, riMax: 35, tagMax: 40, mmsMax: 25 },
      { evalYear: 2022, pcrcScore: 62.5, riScore: 21.8, tagScore: 25.2, mmsScore: 15.5, riMax: 35, tagMax: 40, mmsMax: 25 },
    ],
    '3': [
      { evalYear: 2024, pcrcScore: 85.2, riScore: 30.5, tagScore: 35.2, mmsScore: 19.5, riMax: 35, tagMax: 40, mmsMax: 25 },
      { evalYear: 2023, pcrcScore: 79.8, riScore: 28.1, tagScore: 33.2, mmsScore: 18.5, riMax: 35, tagMax: 40, mmsMax: 25 },
    ],
  };
  
  // Mock reports
  export const reports: Record<string, Report> = {
    '1': { reportYear: 2023, publicationDate: '2024-06-15', assuranceOrg: 'KPMG', frameworks: ['GRI', 'TCFD', 'SASB', 'CDP'] },
    '2': { reportYear: 2023, publicationDate: '2024-05-28', assuranceOrg: 'Deloitte', frameworks: ['GRI', 'TCFD'] },
    '3': { reportYear: 2023, publicationDate: '2024-07-10', assuranceOrg: null, frameworks: ['GRI', 'ISSB'] },
  };
  
  // Mock emissions data
  export const emissionsData: Record<string, EmissionData[]> = {
    '1': [
      { year: 2023, s1Emissions: 1850000, s2Emissions: 12500000, totalEmissions: 14350000, denomValue: 258940000000, denomType: 'revenue' },
      { year: 2022, s1Emissions: 1920000, s2Emissions: 13100000, totalEmissions: 15020000, denomValue: 302230000000, denomType: 'revenue' },
      { year: 2021, s1Emissions: 2050000, s2Emissions: 14200000, totalEmissions: 16250000, denomValue: 279600000000, denomType: 'revenue' },
    ],
    '2': [
      { year: 2023, s1Emissions: 580000, s2Emissions: 4200000, totalEmissions: 4780000, denomValue: 66190000000, denomType: 'revenue' },
      { year: 2022, s1Emissions: 620000, s2Emissions: 4500000, totalEmissions: 5120000, denomValue: 44650000000, denomType: 'revenue' },
      { year: 2021, s1Emissions: 680000, s2Emissions: 4800000, totalEmissions: 5480000, denomValue: 42998000000, denomType: 'revenue' },
    ],
  };
  
  // Mock targets
  export const targets: Record<string, Target> = {
    '1': { scope: 'S1S2', targetReductionPct: 39, baseYear: 2019, targetYear: 2030 },
    '2': { scope: 'S1S2', targetReductionPct: 30, baseYear: 2020, targetYear: 2030 },
  };
  
  // Mock industry data
  export const industryData: Record<string, IndustryData> = {
    'tech': { 
      companyCount: 48, 
      scores: [45, 52, 58, 61, 65, 68, 70, 72, 74, 75, 76, 78, 79, 80, 82, 84, 85, 87, 89, 91],
      avgIntensity: 48.2,
      avgPcrc: 68.4,
      alpha: 1.15,
    },
    'battery': {
      companyCount: 24,
      scores: [55, 60, 65, 70, 72, 75, 78, 80, 82, 85, 88],
      avgIntensity: 32.5,
      avgPcrc: 72.1,
      alpha: 1.08,
    },
  };
  
  // Mock evidence
  export const evidenceItems: Record<string, EvidenceItem[]> = {
    '1': [
      { category: 'Emission', indicator: 'Scope 1', year: 2023, evidencePage: 'p.45-47', evidenceNote: 'Third-party verified by KPMG', status: 'verified' },
      { category: 'Emission', indicator: 'Scope 2', year: 2023, evidencePage: 'p.48-50', evidenceNote: 'Market-based methodology applied', status: 'verified' },
      { category: 'Target', indicator: 'Net Zero 2050', evidencePage: 'p.12', evidenceNote: 'SBTi approved', status: 'verified' },
      { category: 'Target', indicator: '2030 Interim Target', evidencePage: 'p.14-15', evidenceNote: '39% reduction from 2019 base year', status: 'verified' },
      { category: 'MMS', indicator: 'Renewable Energy', evidencePage: 'p.62', evidenceNote: 'RE100 commitment', pointsAwarded: 5, status: 'full' },
      { category: 'MMS', indicator: 'Carbon Pricing', evidencePage: 'p.78', evidenceNote: 'Internal carbon price of $50/tCO2', pointsAwarded: 3, status: 'partial' },
    ],
    '2': [
      { category: 'Emission', indicator: 'Scope 1', year: 2023, evidencePage: 'p.38', evidenceNote: null, status: 'self-reported' },
      { category: 'Emission', indicator: 'Scope 2', year: 2023, evidencePage: 'p.39-40', evidenceNote: 'Location-based only', status: 'self-reported' },
      { category: 'Target', indicator: 'Net Zero 2050', evidencePage: null, evidenceNote: 'Commitment stated but no detailed pathway', status: 'pending' },
    ],
  };
  
  // Helper functions
  export function getCompanyById(id: string): Company | undefined {
    return companies.find(c => c.id === id);
  }
  
  export function getScoreRunsForCompany(companyId: string): ScoreRun[] {
    return scoreRuns[companyId] || [];
  }
  
  export function getLatestScoreRun(companyId: string): ScoreRun | undefined {
    const runs = getScoreRunsForCompany(companyId);
    return runs.length > 0 ? runs[0] : undefined;
  }
  
  export function calculateYoYChange(companyId: string): number | null {
    const runs = getScoreRunsForCompany(companyId);
    if (runs.length < 2) return null;
    return runs[0].pcrcScore - runs[1].pcrcScore;
  }
  
  export function calculateIndustryPercentile(companyId: string): number | null {
    const company = getCompanyById(companyId);
    const scoreRun = getLatestScoreRun(companyId);
    if (!company || !scoreRun) return null;
    
    const industry = industryData[company.industryId];
    if (!industry) return null;
    
    const belowCount = industry.scores.filter(s => s < scoreRun.pcrcScore).length;
    return Math.round((belowCount / industry.scores.length) * 100);
  }
  
  export function getDataMixRatio(companyId: string): { verified: number; self: number; proxy: number } {
    const evidence = evidenceItems[companyId] || [];
    const total = evidence.length || 1;
    const verified = evidence.filter(e => e.status === 'verified').length;
    const self = evidence.filter(e => e.status === 'self-reported').length;
    const proxy = total - verified - self;
    
    return {
      verified: Math.round((verified / total) * 100),
      self: Math.round((self / total) * 100),
      proxy: Math.round((proxy / total) * 100),
    };
  }
  
  export function getEvidenceCoverage(companyId: string): number {
    const evidence = evidenceItems[companyId] || [];
    const withPage = evidence.filter(e => e.evidencePage !== null).length;
    return evidence.length > 0 ? Math.round((withPage / evidence.length) * 100) : 0;
  }
  
