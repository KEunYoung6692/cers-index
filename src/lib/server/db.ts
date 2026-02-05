import "server-only";

import { Pool } from "pg";
import type { DashboardData } from "@/lib/data/dashboard";
import type { EvidenceItem, ScoreRun } from "@/data/mockData";

let pool: Pool | null = null;

function getPool() {
  const {
    DATABASE_URL,
    PGHOST,
    PGUSER,
    PGPASSWORD,
    PGDATABASE,
    PGPORT,
    PGSSLMODE,
  } = process.env;

  const hasDiscreteConfig = PGHOST && PGUSER && PGPASSWORD && PGDATABASE;
  if (!DATABASE_URL && !hasDiscreteConfig) {
    throw new Error("DATABASE_URL or PGHOST/PGUSER/PGPASSWORD/PGDATABASE must be set");
  }

  if (!pool) {
    pool = new Pool(
      DATABASE_URL
        ? {
            connectionString: DATABASE_URL,
            ssl: PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
          }
        : {
            host: PGHOST,
            user: PGUSER,
            password: PGPASSWORD,
            database: PGDATABASE,
            port: PGPORT ? Number(PGPORT) : 5432,
            ssl: PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
          },
    );
  }

  return pool;
}

function toNumber(value: unknown, fallback = 0) {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

function mapDataLevelStatus(dataLevel: number | null) {
  switch (dataLevel) {
    case 1:
      return "verified";
    case 2:
      return "self-reported";
    case 3:
      return "proxy";
    default:
      return undefined;
  }
}

function buildEvidencePage(page: number | null) {
  if (page === null || page === undefined) return null;
  return `p.${page}`;
}

export async function getDashboardDataFromDb(): Promise<DashboardData> {
  // 참고: config/db_schema 기준으로 테이블을 조회합니다.
  const pool = getPool();

  const schemaInfoRes = await pool.query(
    `SELECT table_name, column_name
     FROM information_schema.columns
     WHERE table_schema = current_schema()
       AND table_name IN ('emission', 'denominator', 'emission_target', 'report', 'report_framework')`,
  );

  const columnsByTable = new Map<string, Set<string>>();
  for (const row of schemaInfoRes.rows) {
    const tableName = row.table_name as string;
    const columnName = row.column_name as string;
    if (!columnsByTable.has(tableName)) {
      columnsByTable.set(tableName, new Set());
    }
    columnsByTable.get(tableName)!.add(columnName);
  }

  const hasColumn = (table: string, column: string) =>
    columnsByTable.get(table)?.has(column) ?? false;

  const hasEmissionCompany = hasColumn("emission", "company_id");
  const hasDenomCompany = hasColumn("denominator", "company_id");
  const hasTargetCompany = hasColumn("emission_target", "company_id");
  const reportDateColumn = hasColumn("report", "submission_date")
    ? "submission_date"
    : hasColumn("report", "publication_date")
      ? "publication_date"
      : null;
  const reportFrameworkColumn = hasColumn("report_framework", "framework")
    ? "framework"
    : hasColumn("report_framework", "framework_code")
      ? "framework_code"
      : null;

  if (!reportDateColumn) {
    throw new Error("report table must include submission_date or publication_date");
  }

  if (!reportFrameworkColumn) {
    throw new Error("report_framework table must include framework or framework_code");
  }

  const [
    industriesRes,
    companiesRes,
    scoreRunsRes,
    reportsRes,
    reportFrameworkRes,
    emissionsRes,
    denomRes,
    targetsRes,
    alphaRes,
    mmsDefsRes,
    mmsObsRes,
  ] = await Promise.all([
    pool.query(
      `SELECT industry_id, industry_name
       FROM industry`,
    ),
    pool.query(
      `SELECT c.company_id, c.company_name, c.industry_id, c.country, i.industry_name
       FROM company c
       LEFT JOIN industry i ON i.industry_id = c.industry_id`,
    ),
    pool.query(
      `SELECT sr.score_run_id, sr.company_id, sr.eval_year, sr.ri_score, sr.tag_score, sr.mms_score, sr.pcrc_score,
              sc.ri_max, sc.tag_max, sc.mms_max
       FROM score_run sr
       LEFT JOIN scoring_config sc ON sc.config_id = sr.config_id
       ORDER BY sr.company_id, sr.eval_year DESC`,
    ),
    pool.query(
      `SELECT report_id, company_id, report_year, ${reportDateColumn} AS report_date, assurance_org
       FROM report`,
    ),
    pool.query(
      `SELECT report_id, ${reportFrameworkColumn} AS framework
       FROM report_framework`,
    ),
    pool.query(
      hasEmissionCompany
        ? `SELECT company_id, emission_year, scope, emissions_value, data_level, evidence_page, evidence_note
           FROM emission
           WHERE scope IN ('S1', 'S2', 'S1S2', 'TOTAL')`
        : `SELECT sc.company_id AS company_id, e.emission_year, e.scope, e.emissions_value, e.data_level, e.evidence_page, e.evidence_note
           FROM emission e
           LEFT JOIN sub_company sc ON sc.sub_company_id = e.sub_company_id
           WHERE e.scope IN ('S1', 'S2', 'S1S2', 'TOTAL')`,
    ),
    pool.query(
      hasDenomCompany
        ? `SELECT company_id, denom_year, denom_type, denom_value, data_level, evidence_page, evidence_note
           FROM denominator`
        : `SELECT sc.company_id AS company_id, d.denom_year, d.denom_type, d.denom_value, d.data_level, d.evidence_page, d.evidence_note
           FROM denominator d
           LEFT JOIN sub_company sc ON sc.sub_company_id = d.sub_company_id`,
    ),
    pool.query(
      hasTargetCompany
        ? `SELECT company_id, scope, baseline_year, target_year, target_reduction_pct, evidence_page, evidence_note
           FROM emission_target`
        : `SELECT sc.company_id AS company_id, t.scope, t.baseline_year, t.target_year, t.target_reduction_pct, t.evidence_page, t.evidence_note
           FROM emission_target t
           LEFT JOIN sub_company sc ON sc.sub_company_id = t.sub_company_id`,
    ),
    pool.query(
      `SELECT DISTINCT ON (industry_id) industry_id, alpha
       FROM scoring_config_alpha
       ORDER BY industry_id, config_id DESC`,
    ),
    pool.query(
      `SELECT indicator_id, indicator_name
       FROM mms_indicator_def`,
    ),
    pool.query(
      `SELECT score_run_id, indicator_id, status, points_awarded, data_level, evidence_page, evidence_note
       FROM mms_observation`,
    ),
  ]);

  const industryNameById = new Map<number, string>(
    industriesRes.rows.map((row) => [row.industry_id as number, row.industry_name as string]),
  );

  const companies = companiesRes.rows.map((row) => {
    const industryId = row.industry_id !== null ? String(row.industry_id) : "unknown";
    return {
      id: String(row.company_id),
      name: row.company_name as string,
      industryId,
      industryName: (row.industry_name as string) ?? industryNameById.get(row.industry_id as number) ?? "Unknown",
      country: ((row.country as string) ?? "KR").toUpperCase(),
    };
  });

  const scoreRuns: Record<string, ScoreRun[]> = {};
  const scoreRunIdToCompanyId = new Map<number, string>();

  for (const row of scoreRunsRes.rows) {
    const companyId = String(row.company_id);
    const run: ScoreRun = {
      evalYear: row.eval_year as number,
      pcrcScore: toNumber(row.pcrc_score),
      riScore: toNumber(row.ri_score),
      tagScore: toNumber(row.tag_score),
      mmsScore: toNumber(row.mms_score),
      riMax: toNumber(row.ri_max, 40),
      tagMax: toNumber(row.tag_max, 30),
      mmsMax: toNumber(row.mms_max, 30),
    };

    if (!scoreRuns[companyId]) scoreRuns[companyId] = [];
    scoreRuns[companyId].push(run);
    scoreRunIdToCompanyId.set(row.score_run_id as number, companyId);
  }

  const frameworksByReportId = new Map<number, string[]>();
  for (const row of reportFrameworkRes.rows) {
    const reportId = row.report_id as number;
    if (!frameworksByReportId.has(reportId)) {
      frameworksByReportId.set(reportId, []);
    }
    frameworksByReportId.get(reportId)!.push(row.framework as string);
  }

  const reports: DashboardData["reports"] = {};
  const reportByCompany = new Map<string, { year: number; reportId: number }>();

  for (const row of reportsRes.rows) {
    const companyId = String(row.company_id);
    const reportYear = row.report_year as number;
    const current = reportByCompany.get(companyId);
    if (!current || reportYear > current.year) {
      reportByCompany.set(companyId, { year: reportYear, reportId: row.report_id as number });
    }
  }

  for (const row of reportsRes.rows) {
    const companyId = String(row.company_id);
    const reportYear = row.report_year as number;
    const selected = reportByCompany.get(companyId);
    if (!selected || selected.reportId !== row.report_id) continue;

    const frameworks = frameworksByReportId.get(row.report_id as number) ?? [];
    const publicationDate = row.report_date
      ? new Date(row.report_date as string).toISOString().slice(0, 10)
      : null;

    reports[companyId] = {
      reportYear,
      publicationDate: publicationDate ?? "",
      assuranceOrg: (row.assurance_org as string) ?? null,
      frameworks,
    };
  }

  const emissionsData: DashboardData["emissionsData"] = {};
  const emissionEvidence: Record<string, EvidenceItem[]> = {};

  const emissionFlags = new Map<string, { hasS1: boolean; hasS2: boolean }>();

  const getEmissionFlags = (companyId: string, year: number) => {
    const key = `${companyId}:${year}`;
    if (!emissionFlags.has(key)) {
      emissionFlags.set(key, { hasS1: false, hasS2: false });
    }
    return emissionFlags.get(key)!;
  };

  for (const row of emissionsRes.rows) {
    if (row.company_id === null || row.company_id === undefined) {
      continue;
    }
    const companyId = String(row.company_id);
    const year = row.emission_year as number;
    const scope = row.scope as string;
    const value = toNumber(row.emissions_value);

    if (!emissionsData[companyId]) emissionsData[companyId] = [];
    let entry = emissionsData[companyId].find((item) => item.year === year);
    if (!entry) {
      entry = {
        year,
        s1Emissions: 0,
        s2Emissions: 0,
        denomValue: 0,
        denomType: "revenue",
      };
      emissionsData[companyId].push(entry);
    }

    const flags = getEmissionFlags(companyId, year);

    if (scope === "S1") {
      entry.s1Emissions = value;
      flags.hasS1 = true;
    }
    if (scope === "S2") {
      entry.s2Emissions = value;
      flags.hasS2 = true;
    }
    if (scope === "S1S2") {
      if (!flags.hasS1 && !flags.hasS2) {
        entry.s1Emissions = value;
        entry.s2Emissions = 0;
      }
    }
    if (scope === "TOTAL") {
      entry.totalEmissions = value;
    }

    const status = mapDataLevelStatus(row.data_level as number | null);
    if (row.evidence_page || row.evidence_note) {
      if (!emissionEvidence[companyId]) emissionEvidence[companyId] = [];
      emissionEvidence[companyId].push({
        category: "Emission",
        indicator: scope === "S1S2" ? "Scope 1+2" : scope === "TOTAL" ? "Total" : `Scope ${scope.replace("S", "")}`,
        year,
        evidencePage: buildEvidencePage(row.evidence_page as number | null),
        evidenceNote: (row.evidence_note as string) ?? null,
        status,
      });
    }
  }

  const denominatorEvidence: Record<string, EvidenceItem[]> = {};
  for (const row of denomRes.rows) {
    if (row.company_id === null || row.company_id === undefined) {
      continue;
    }
    const companyId = String(row.company_id);
    const year = row.denom_year as number;
    const denomValue = toNumber(row.denom_value);
    const denomType = (row.denom_type as string) ?? "revenue";

    if (!emissionsData[companyId]) emissionsData[companyId] = [];
    let entry = emissionsData[companyId].find((item) => item.year === year);
    if (!entry) {
      entry = {
        year,
        s1Emissions: 0,
        s2Emissions: 0,
        denomValue: 0,
        denomType,
      };
      emissionsData[companyId].push(entry);
    }

    entry.denomValue = denomValue;
    entry.denomType = denomType;

    if (row.evidence_page || row.evidence_note) {
      const status = mapDataLevelStatus(row.data_level as number | null);
      if (!denominatorEvidence[companyId]) denominatorEvidence[companyId] = [];
      denominatorEvidence[companyId].push({
        category: "Emission",
        indicator: `Denominator (${denomType})`,
        year,
        evidencePage: buildEvidencePage(row.evidence_page as number | null),
        evidenceNote: (row.evidence_note as string) ?? null,
        status,
      });
    }
  }

  const targets: DashboardData["targets"] = {};
  const targetEvidence: Record<string, EvidenceItem[]> = {};

  for (const row of targetsRes.rows) {
    if (row.company_id === null || row.company_id === undefined) {
      continue;
    }
    const companyId = String(row.company_id);
    const scope = row.scope as string;
    const targetYear = row.target_year as number;
    const baselineYear = (row.baseline_year as number | null) ?? targetYear;

    if (!targets[companyId] || targetYear > targets[companyId].targetYear) {
      targets[companyId] = {
        scope,
        targetReductionPct: toNumber(row.target_reduction_pct),
        baseYear: baselineYear,
        targetYear,
      };
    }

    if (row.evidence_page || row.evidence_note) {
      if (!targetEvidence[companyId]) targetEvidence[companyId] = [];
      targetEvidence[companyId].push({
        category: "Target",
        indicator: `${scope} target`,
        year: targetYear,
        evidencePage: buildEvidencePage(row.evidence_page as number | null),
        evidenceNote: (row.evidence_note as string) ?? null,
        status: row.evidence_page ? "verified" : "pending",
      });
    }
  }

  const indicatorNameById = new Map<number, string>(
    mmsDefsRes.rows.map((row) => [row.indicator_id as number, row.indicator_name as string]),
  );

  const mmsEvidence: Record<string, EvidenceItem[]> = {};
  for (const row of mmsObsRes.rows) {
    const companyId = scoreRunIdToCompanyId.get(row.score_run_id as number);
    if (!companyId) continue;

    if (!mmsEvidence[companyId]) mmsEvidence[companyId] = [];
    mmsEvidence[companyId].push({
      category: "MMS",
      indicator: indicatorNameById.get(row.indicator_id as number) ?? "MMS Indicator",
      evidencePage: buildEvidencePage(row.evidence_page as number | null),
      evidenceNote: (row.evidence_note as string) ?? null,
      status: (row.status as string) ?? mapDataLevelStatus(row.data_level as number | null),
      pointsAwarded: toNumber(row.points_awarded),
    });
  }

  const evidenceItems: DashboardData["evidenceItems"] = {};
  for (const company of companies) {
    const companyId = company.id;
    evidenceItems[companyId] = [
      ...(emissionEvidence[companyId] ?? []),
      ...(denominatorEvidence[companyId] ?? []),
      ...(targetEvidence[companyId] ?? []),
      ...(mmsEvidence[companyId] ?? []),
    ];
  }

  const alphaByIndustryId = new Map<number, number>(
    alphaRes.rows.map((row) => [row.industry_id as number, toNumber(row.alpha, 1)]),
  );

  const industryData: DashboardData["industryData"] = {};
  const latestScoreByCompany = new Map<string, ScoreRun>();

  for (const [companyId, runs] of Object.entries(scoreRuns)) {
    if (runs.length > 0) latestScoreByCompany.set(companyId, runs[0]);
  }

  for (const company of companies) {
    const industryId = company.industryId;
    if (!industryData[industryId]) {
      const numericId = Number(industryId);
      industryData[industryId] = {
        companyCount: 0,
        scores: [],
        avgIntensity: 0,
        avgPcrc: 0,
        alpha: Number.isNaN(numericId) ? 1 : alphaByIndustryId.get(numericId) ?? 1,
      };
    }
    industryData[industryId].companyCount += 1;

    const latestScore = latestScoreByCompany.get(company.id);
    if (latestScore) {
      industryData[industryId].scores.push(latestScore.pcrcScore);
    }
  }

  for (const [industryId, data] of Object.entries(industryData)) {
    if (data.scores.length > 0) {
      const total = data.scores.reduce((sum, value) => sum + value, 0);
      data.avgPcrc = Number((total / data.scores.length).toFixed(1));
    }

    const companyIds = companies.filter((company) => company.industryId === industryId).map((c) => c.id);
    const intensityValues: number[] = [];
    for (const companyId of companyIds) {
      const emissions = emissionsData[companyId] ?? [];
      if (emissions.length === 0) continue;
      const latest = [...emissions].sort((a, b) => b.year - a.year)[0];
      if (latest.denomValue > 0) {
        const intensity = ((latest.s1Emissions + latest.s2Emissions) / latest.denomValue) * 1_000_000;
        intensityValues.push(intensity);
      }
    }
    if (intensityValues.length > 0) {
      const totalIntensity = intensityValues.reduce((sum, value) => sum + value, 0);
      data.avgIntensity = Number((totalIntensity / intensityValues.length).toFixed(1));
    }
  }

  return {
    companies,
    scoreRuns,
    reports,
    emissionsData,
    targets,
    industryData,
    evidenceItems,
  };
}
