import "server-only";

import { cache } from "react";
import {
  buildCompanyInterpretation,
  buildCompanySummary,
  createDisplayName,
  getPublicCategoryLabel,
  humanizeCode,
  localizeDashboardData,
  mergeCategoryMeta,
  normalizePercentValue,
  normalizeScoreValue,
} from "@/lib/cers/public";
import type { SupportedLocale } from "@/lib/cers/i18n";
import { fallbackDashboardData } from "@/lib/cers/fallback-data";
import type {
  CersCategoryMeta,
  CersCategoryScore,
  CersCompanyProfile,
  CersDashboardData,
  CersEmissionHistoryPoint,
  CersTargetFact,
} from "@/lib/cers/types";
import { getExistingTableNames, getPool } from "./db";

type GenericRow = Record<string, unknown>;

type DashboardSchema = {
  periodTable: string | null;
  methodologyTable: string | null;
  methodologyVersionIdColumn: string;
  scoringRunMethodologyVersionIdColumn: string;
  metricTable: string | null;
  metricValueColumn: string;
  metricUnitColumn: string;
  targetTable: string | null;
  targetIdColumn: string;
  targetMetricTypeColumn: string;
  targetScopeCodeColumn: string;
  targetValueColumn: string;
  targetUnitColumn: string;
  targetReductionPctColumn: string;
  scenarioAlignmentCodeColumn: string;
  sbtiApprovedColumn: string;
  residualDefinedColumn: string;
  offsetUsageColumn: string;
  offsetDependencyRatioColumn: string;
  carbonRemovalPlanColumn: string;
  scope3Table: string | null;
  scope3PrimaryRatioColumn: string;
  frameworkTable: string | null;
  frameworkCodeColumn: string;
  frameworkLabelColumn: string;
  assuranceTable: string | null;
  assuranceProviderColumn: string;
  assuranceTypeColumn: string;
};

const DASHBOARD_TABLES = [
  "companies",
  "documents",
  "codebooks",
  "score_categories",
  "scoring_runs",
  "category_scores",
  "cers_score",
  "reporting_periods",
  "rpt_period",
  "company_metric_facts",
  "co_metric",
  "company_target_facts",
  "co_target",
  "company_scope3_facts",
  "co_scope3",
  "methodology_versions",
  "method_ver",
  "document_framework_adoptions",
  "doc_fw_adopt",
  "document_assurance_statements",
  "doc_assur_stmt",
] as const;

const HISTORY_TABLES = ["company_metric_facts", "co_metric", "reporting_periods", "rpt_period"] as const;

const COUNTRY_LABELS: Record<string, string> = {
  KR: "South Korea",
  JP: "Japan",
  US: "United States",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  CN: "China",
};

const SECTOR_CODES = new Set([
  "PWR",
  "ENR",
  "PRM",
  "EEM",
  "IMS",
  "MOV",
  "MFG",
  "CST",
  "AST",
  "BIO",
  "CON",
  "DNS",
  "HLC",
  "FNC",
] as const);

const RELEVANT_METRIC_CODES = [
  "scope1_emissions",
  "scope_1_emissions",
  "scope2_emissions",
  "scope_2_emissions",
  "scope12_emissions",
  "scope1_2_emissions",
  "scope_1_2_emissions",
  "revenue",
  "green_capex",
  "green_capex_total",
  "capex_total",
  "total_capex",
  "ebitda",
] as const;

const EMISSION_METRIC_CODES = [
  "scope1_emissions",
  "scope_1_emissions",
  "scope2_emissions",
  "scope_2_emissions",
  "scope12_emissions",
  "scope1_2_emissions",
  "scope_1_2_emissions",
] as const;

function toNumber(value: unknown) {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "t", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "f", "0", "no", "n"].includes(normalized)) return false;
  }
  return null;
}

function toText(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text || null;
}

function normalizeOverallScore(value: unknown) {
  return normalizeScoreValue(toNumber(value));
}

function normalizeWeightedContribution(value: unknown) {
  const parsed = toNumber(value);
  if (parsed === null) return null;
  return Math.abs(parsed) <= 1.2 ? parsed * 100 : parsed;
}

function normalizeCategoryRawScore(rawValue: unknown, weightedValue: unknown, weight: number) {
  const normalizedRaw = normalizeScoreValue(toNumber(rawValue));
  if (normalizedRaw !== null) return normalizedRaw;

  const weighted = toNumber(weightedValue);
  if (weighted === null || !Number.isFinite(weight) || weight <= 0) return null;

  const contribution = Math.abs(weighted) <= 1.2 ? weighted * 100 : weighted;
  return normalizeScoreValue(contribution / weight);
}

function buildDefaultCategoryMeta(): CersCategoryMeta[] {
  return [
    { id: "cat1", code: "cat1", label: "Actual Reduction Performance", weight: 0.4, displayOrder: 1 },
    { id: "cat2", code: "cat2", label: "Target Clarity", weight: 0.25, displayOrder: 2 },
    { id: "cat3", code: "cat3", label: "Execution Readiness", weight: 0.2, displayOrder: 3 },
    { id: "cat4", code: "cat4", label: "Disclosure Level", weight: 0.15, displayOrder: 4 },
  ];
}

function getEmptyResult() {
  return { rows: [] as GenericRow[] };
}

function buildCodebookLookup(rows: GenericRow[]) {
  const lookup = new Map<string, Map<string, string>>();

  for (const row of rows) {
    const group = toText(row.code_group)?.toLowerCase();
    const value = toText(row.code_value);
    const label = toText(row.code_label);
    if (!group || !value || !label) continue;
    if (!lookup.has(group)) lookup.set(group, new Map());
    lookup.get(group)!.set(value.toLowerCase(), label);
  }

  return lookup;
}

function pickExistingTable(existingTables: Set<string>, candidates: readonly string[]) {
  return candidates.find((candidate) => existingTables.has(candidate)) ?? null;
}

function resolveDashboardSchema(existingTables: Set<string>): DashboardSchema {
  const periodTable = pickExistingTable(existingTables, ["rpt_period", "reporting_periods"]);
  const methodologyTable = pickExistingTable(existingTables, ["method_ver", "methodology_versions"]);
  const metricTable = pickExistingTable(existingTables, ["co_metric", "company_metric_facts"]);
  const targetTable = pickExistingTable(existingTables, ["co_target", "company_target_facts"]);
  const scope3Table = pickExistingTable(existingTables, ["co_scope3", "company_scope3_facts"]);
  const frameworkTable = pickExistingTable(existingTables, ["doc_fw_adopt", "document_framework_adoptions"]);
  const assuranceTable = pickExistingTable(existingTables, ["doc_assur_stmt", "document_assurance_statements"]);

  return {
    periodTable,
    methodologyTable,
    methodologyVersionIdColumn: methodologyTable === "method_ver" ? "method_ver_id" : "methodology_version_id",
    scoringRunMethodologyVersionIdColumn: methodologyTable === "method_ver" ? "method_ver_id" : "methodology_version_id",
    metricTable,
    metricValueColumn: metricTable === "co_metric" ? "metric_val" : "metric_value",
    metricUnitColumn: metricTable === "co_metric" ? "unit" : "metric_unit",
    targetTable,
    targetIdColumn: targetTable === "co_target" ? "co_target_id" : "company_target_fact_id",
    targetMetricTypeColumn: targetTable === "co_target" ? "metric_type" : "target_metric_type",
    targetScopeCodeColumn: targetTable === "co_target" ? "target_scope" : "target_scope_code",
    targetValueColumn: targetTable === "co_target" ? "target_val" : "target_value",
    targetUnitColumn: "target_unit",
    targetReductionPctColumn: targetTable === "co_target" ? "target_red_pct" : "target_reduction_pct",
    scenarioAlignmentCodeColumn: targetTable === "co_target" ? "scen_align_cd" : "scenario_alignment_code",
    sbtiApprovedColumn: targetTable === "co_target" ? "sbti_ok" : "sbti_approval_flag",
    residualDefinedColumn: targetTable === "co_target" ? "residual_def" : "residual_defined_flag",
    offsetUsageColumn: targetTable === "co_target" ? "offset_use" : "offset_usage_flag",
    offsetDependencyRatioColumn: targetTable === "co_target" ? "offset_dep_ratio" : "offset_dependency_ratio",
    carbonRemovalPlanColumn: targetTable === "co_target" ? "removal_plan" : "carbon_removal_plan_flag",
    scope3Table,
    scope3PrimaryRatioColumn: scope3Table === "co_scope3" ? "primary_ratio" : "primary_data_ratio",
    frameworkTable,
    frameworkCodeColumn: frameworkTable === "doc_fw_adopt" ? "fw_cd" : "framework_code",
    frameworkLabelColumn: frameworkTable === "doc_fw_adopt" ? "fw_label" : "framework_label",
    assuranceTable,
    assuranceProviderColumn: assuranceTable === "doc_assur_stmt" ? "assur_provider" : "assurance_provider",
    assuranceTypeColumn: assuranceTable === "doc_assur_stmt" ? "assur_type_cd" : "assurance_type_code",
  };
}

function lookupCodeLabel(
  codebooks: Map<string, Map<string, string>>,
  groupCandidates: string[],
  value: string | null,
) {
  if (!value) return null;
  const normalizedValue = value.toLowerCase();

  for (const group of groupCandidates) {
    const options = codebooks.get(group.toLowerCase());
    const hit = options?.get(normalizedValue);
    if (hit) return hit;
  }

  if (groupCandidates.includes("country_code")) {
    return COUNTRY_LABELS[value.toUpperCase()] || humanizeCode(value);
  }

  return null;
}

function metricKey(metricCode: string | null) {
  const normalized = (metricCode || "").toLowerCase();
  if (["scope1_emissions", "scope_1_emissions"].includes(normalized)) return "scope1";
  if (["scope2_emissions", "scope_2_emissions"].includes(normalized)) return "scope2";
  if (["scope12_emissions", "scope1_2_emissions", "scope_1_2_emissions"].includes(normalized)) return "total";
  if (normalized === "revenue") return "revenue";
  if (["green_capex", "green_capex_total"].includes(normalized)) return "greenCapex";
  if (["capex_total", "total_capex"].includes(normalized)) return "totalCapex";
  if (normalized === "ebitda") return "ebitda";
  return normalized;
}

function createCategoryMetaFromRow(row: GenericRow, index: number): CersCategoryMeta {
  const id = String(row.category_id ?? row.category_code ?? `cat${index + 1}`);
  const code = toText(row.category_code) || `cat${index + 1}`;
  const weight = toNumber(row.category_weight) ?? buildDefaultCategoryMeta()[index]?.weight ?? 0;
  const displayOrder = toNumber(row.display_order) ?? index + 1;

  return {
    id,
    code,
    label: getPublicCategoryLabel(code, toText(row.category_name), index),
    weight,
    displayOrder,
  };
}

function selectPrimaryTarget(targets: CersTargetFact[]) {
  const disclosedTargets = targets.filter((target) => target.disclosed !== false);
  const scoredTargets = disclosedTargets.filter(
    (target) => target.targetType !== "netzero" && target.targetType !== "residual_neutralization",
  );

  return scoredTargets.sort((a, b) => {
    const yearA = a.targetYear ?? Number.MAX_SAFE_INTEGER;
    const yearB = b.targetYear ?? Number.MAX_SAFE_INTEGER;
    if (yearA !== yearB) return yearA - yearB;
    return a.targetType.localeCompare(b.targetType);
  })[0] ?? null;
}

function selectNetZeroTarget(targets: CersTargetFact[]) {
  return (
    targets
      .filter((target) => target.targetType === "netzero" && target.disclosed !== false)
      .sort((a, b) => (a.targetYear ?? Number.MAX_SAFE_INTEGER) - (b.targetYear ?? Number.MAX_SAFE_INTEGER))[0] ??
    null
  );
}

function buildBadges(company: Pick<CersCompanyProfile, "targetSummary" | "disclosure">) {
  const badges: string[] = [];

  if (company.targetSummary.targetYear) badges.push("Target Announced");
  if (company.targetSummary.netZeroYear) badges.push(`Net Zero ${company.targetSummary.netZeroYear}`);
  if (company.disclosure.scope3DisclosedCategories > 0) {
    badges.push(
      company.disclosure.scope3DisclosedCategories < company.disclosure.scope3TotalCategories
        ? "Scope 3 Partially Disclosed"
        : "Scope 3 Disclosed",
    );
  }
  if (company.disclosure.assuranceType) {
    badges.push(`${humanizeCode(company.disclosure.assuranceType)} Assurance`);
  }

  return badges.slice(0, 4);
}

function makeIssueMessage(message: string, locale: SupportedLocale) {
  if (locale === "ko") return `실시간 데이터를 불러오지 못해 샘플 데이터를 표시합니다. 원인: ${message}`;
  if (locale === "ja") return `実データを読み込めなかったため、サンプルデータを表示しています。原因: ${message}`;
  return `${message} Falling back to sample content.`;
}

export const getCersDashboardData = cache(async (locale: SupportedLocale = "en"): Promise<CersDashboardData> => {
  try {
    const existingTables = await getExistingTableNames([...DASHBOARD_TABLES]);
    const schema = resolveDashboardSchema(existingTables);
    if (!existingTables.has("companies")) {
      return localizeDashboardData(
        { ...fallbackDashboardData, issue: makeIssueMessage("The companies table is not available.", locale) },
        locale,
      );
    }

    const pool = getPool();
    const methodologySelect =
      schema.methodologyTable !== null ? "mv.version_name" : "NULL::text AS version_name";
    const methodologyJoin =
      schema.methodologyTable !== null
        ? `LEFT JOIN ${schema.methodologyTable} mv
               ON mv.${schema.methodologyVersionIdColumn} = sr.${schema.scoringRunMethodologyVersionIdColumn}`
        : "";

    const [companiesRes, methodologyRes, latestRunsRes, categoriesRes, codebooksRes] = await Promise.all([
      pool.query<GenericRow>(
        `SELECT company_id, company_name_kr, company_name_en, stock_code, country_code, market_code, sector_code, industry_code, status
         FROM companies
         WHERE COALESCE(status, 'active') <> 'inactive'`,
      ),
      schema.methodologyTable
        ? pool.query<GenericRow>(
            `SELECT ${schema.methodologyVersionIdColumn} AS methodology_version_id, version_name
             FROM ${schema.methodologyTable}
             ORDER BY is_active DESC, effective_from DESC NULLS LAST, methodology_version_id DESC
             LIMIT 1`,
          )
        : Promise.resolve(getEmptyResult()),
      existingTables.has("scoring_runs") && schema.periodTable && existingTables.has("cers_score")
        ? pool.query<GenericRow>(
            `WITH ranked_runs AS (
               SELECT sr.scoring_run_id,
                      sr.company_id,
                      sr.period_id,
                      sr.run_status,
                      sr.finished_at,
                      rp.fiscal_year,
                      ${methodologySelect},
                      cs.sbase,
                      cs.cef,
                      cs.gv,
                      cs.cers_score,
                      cs.score_grade,
                      ROW_NUMBER() OVER (
                        PARTITION BY sr.company_id
                        ORDER BY
                          CASE
                            WHEN LOWER(COALESCE(sr.run_status, '')) IN ('completed', 'complete', 'success', 'succeeded', 'finished') THEN 0
                            ELSE 1
                          END,
                          COALESCE(rp.assessment_date, rp.period_end, rp.period_start) DESC NULLS LAST,
                          sr.finished_at DESC NULLS LAST,
                          sr.scoring_run_id DESC
                      ) AS rn
               FROM scoring_runs sr
               LEFT JOIN ${schema.periodTable} rp ON rp.period_id = sr.period_id
               ${methodologyJoin}
               LEFT JOIN cers_score cs ON cs.scoring_run_id = sr.scoring_run_id
             )
             SELECT *
             FROM ranked_runs
             WHERE rn = 1`,
          )
        : Promise.resolve(getEmptyResult()),
      existingTables.has("score_categories")
        ? pool.query<GenericRow>(
            `SELECT category_id, category_code, category_name, category_weight, display_order
             FROM score_categories
             ORDER BY COALESCE(display_order, 999), category_id`,
          )
        : Promise.resolve(getEmptyResult()),
      existingTables.has("codebooks")
        ? pool.query<GenericRow>(
            `SELECT code_group, code_value, code_label
             FROM codebooks`,
          )
        : Promise.resolve(getEmptyResult()),
    ]);

    if (companiesRes.rows.length === 0) {
      return localizeDashboardData(
        { ...fallbackDashboardData, issue: makeIssueMessage("No companies are currently available in the live schema.", locale) },
        locale,
      );
    }

    const codebooks = buildCodebookLookup(codebooksRes.rows);
    const companyIds = companiesRes.rows
      .map((row) => toNumber(row.company_id))
      .filter((value): value is number => value !== null);
    const latestRunIds = latestRunsRes.rows
      .map((row) => toNumber(row.scoring_run_id))
      .filter((value): value is number => value !== null);
    const latestPeriodIds = latestRunsRes.rows
      .map((row) => toNumber(row.period_id))
      .filter((value): value is number => value !== null);

    const [categoryScoresRes, targetsRes, scope3Res, documentsRes] = await Promise.all([
      latestRunIds.length > 0 && existingTables.has("category_scores") && existingTables.has("score_categories")
        ? pool.query<GenericRow>(
            `SELECT sc.scoring_run_id,
                    meta.category_id,
                    meta.category_code,
                    meta.category_name,
                    meta.category_weight,
                    COALESCE(meta.display_order, meta.category_id) AS display_order,
                    sc.category_raw_score,
                    sc.category_weighted_score
             FROM category_scores sc
             JOIN score_categories meta ON meta.category_id = sc.category_id
             WHERE sc.scoring_run_id = ANY($1::bigint[])`,
            [latestRunIds],
          )
        : Promise.resolve(getEmptyResult()),
      companyIds.length > 0 && schema.targetTable
        ? pool.query<GenericRow>(
            `SELECT ${schema.targetIdColumn} AS company_target_fact_id,
                    company_id,
                    target_type,
                    ${schema.targetMetricTypeColumn} AS target_metric_type,
                    base_year,
                    target_year,
                    ${schema.targetScopeCodeColumn} AS target_scope_code,
                    ${schema.targetValueColumn} AS target_value,
                    ${schema.targetUnitColumn} AS target_unit,
                    ${schema.targetReductionPctColumn} AS target_reduction_pct,
                    ${schema.scenarioAlignmentCodeColumn} AS scenario_alignment_code,
                    ${schema.sbtiApprovedColumn} AS sbti_approval_flag,
                    ${schema.residualDefinedColumn} AS residual_defined_flag,
                    ${schema.offsetUsageColumn} AS offset_usage_flag,
                    ${schema.offsetDependencyRatioColumn} AS offset_dependency_ratio,
                    ${schema.carbonRemovalPlanColumn} AS carbon_removal_plan_flag,
                    disclosed_flag
             FROM ${schema.targetTable}
             WHERE company_id = ANY($1::bigint[])`,
            [companyIds],
          )
        : Promise.resolve(getEmptyResult()),
      companyIds.length > 0 && schema.scope3Table
        ? pool.query<GenericRow>(
            `SELECT company_id,
                    COUNT(*) FILTER (WHERE COALESCE(disclosed_flag, FALSE)) AS disclosed_categories,
                    COUNT(*) AS total_categories,
                    AVG(${schema.scope3PrimaryRatioColumn}) AS average_primary_data_ratio
             FROM ${schema.scope3Table}
             WHERE company_id = ANY($1::bigint[])
             ${latestPeriodIds.length > 0 ? "AND period_id = ANY($2::bigint[])" : ""}
             GROUP BY company_id`,
            latestPeriodIds.length > 0 ? [companyIds, latestPeriodIds] : [companyIds],
          )
        : Promise.resolve(getEmptyResult()),
      companyIds.length > 0 && existingTables.has("documents")
        ? pool.query<GenericRow>(
            `WITH ranked_documents AS (
               SELECT document_id,
                      company_id,
                      title,
                      document_type,
                      source_type,
                      report_year,
                      published_date,
                      ROW_NUMBER() OVER (
                        PARTITION BY company_id
                        ORDER BY published_date DESC NULLS LAST, report_year DESC NULLS LAST, document_id DESC
                      ) AS rn
               FROM documents
               WHERE company_id = ANY($1::bigint[])
             )
             SELECT *
             FROM ranked_documents
             WHERE rn = 1`,
            [companyIds],
          )
        : Promise.resolve(getEmptyResult()),
    ]);

    const yearsNeeded = Array.from(
      new Set(
        [
          ...latestRunsRes.rows.map((row) => toNumber(row.fiscal_year)),
          ...targetsRes.rows.map((row) => toNumber(row.base_year)),
        ].filter((value): value is number => value !== null),
      ),
    );

    const documentIds = documentsRes.rows
      .map((row) => toNumber(row.document_id))
      .filter((value): value is number => value !== null);

    const [metricsRes, latestEmissionMetricsRes, frameworkRes, assuranceRes] = await Promise.all([
      companyIds.length > 0 && schema.metricTable && schema.periodTable
        ? pool.query<GenericRow>(
            `SELECT mf.company_id,
                    rp.fiscal_year,
                    mf.metric_code,
                    SUM(mf.${schema.metricValueColumn}) AS metric_value,
                    MAX(mf.${schema.metricUnitColumn}) AS metric_unit
             FROM ${schema.metricTable} mf
             LEFT JOIN ${schema.periodTable} rp ON rp.period_id = mf.period_id
             WHERE mf.company_id = ANY($1::bigint[])
               AND mf.metric_code = ANY($2::text[])
               ${yearsNeeded.length > 0 ? "AND rp.fiscal_year = ANY($3::int[])" : ""}
               AND COALESCE(mf.data_status, 'reported') <> 'missing'
             GROUP BY mf.company_id, rp.fiscal_year, mf.metric_code`,
            yearsNeeded.length > 0 ? [companyIds, RELEVANT_METRIC_CODES, yearsNeeded] : [companyIds, RELEVANT_METRIC_CODES],
          )
        : Promise.resolve(getEmptyResult()),
      companyIds.length > 0 && schema.metricTable && schema.periodTable
        ? pool.query<GenericRow>(
            `WITH emission_years AS (
               SELECT mf.company_id,
                      rp.fiscal_year,
                      mf.metric_code,
                      SUM(mf.${schema.metricValueColumn}) AS metric_value
               FROM ${schema.metricTable} mf
               LEFT JOIN ${schema.periodTable} rp ON rp.period_id = mf.period_id
               WHERE mf.company_id = ANY($1::bigint[])
                 AND mf.metric_code = ANY($2::text[])
                 AND COALESCE(mf.data_status, 'reported') <> 'missing'
                 AND rp.fiscal_year IS NOT NULL
               GROUP BY mf.company_id, rp.fiscal_year, mf.metric_code
             ),
             latest_years AS (
               SELECT company_id, MAX(fiscal_year) AS fiscal_year
               FROM emission_years
               GROUP BY company_id
             )
             SELECT ey.company_id,
                    ey.fiscal_year,
                    ey.metric_code,
                    ey.metric_value
             FROM emission_years ey
             JOIN latest_years ly
               ON ly.company_id = ey.company_id
              AND ly.fiscal_year = ey.fiscal_year`,
            [companyIds, EMISSION_METRIC_CODES],
          )
        : Promise.resolve(getEmptyResult()),
      documentIds.length > 0 && schema.frameworkTable
        ? pool.query<GenericRow>(
            `SELECT document_id,
                    ${schema.frameworkCodeColumn} AS framework_code,
                    ${schema.frameworkLabelColumn} AS framework_label
             FROM ${schema.frameworkTable}
             WHERE document_id = ANY($1::bigint[])`,
            [documentIds],
          )
        : Promise.resolve(getEmptyResult()),
      documentIds.length > 0 && schema.assuranceTable
        ? pool.query<GenericRow>(
            `SELECT document_id,
                    ${schema.assuranceProviderColumn} AS assurance_provider,
                    ${schema.assuranceTypeColumn} AS assurance_type_code
             FROM ${schema.assuranceTable}
             WHERE document_id = ANY($1::bigint[])`,
            [documentIds],
          )
        : Promise.resolve(getEmptyResult()),
    ]);

    const methodologyVersion = toText(methodologyRes.rows[0]?.version_name) || toText(latestRunsRes.rows[0]?.version_name);

    const categoryMeta = categoriesRes.rows.length
      ? categoriesRes.rows.map((row, index) => createCategoryMetaFromRow(row, index))
      : buildDefaultCategoryMeta();

    const runsByCompanyId = new Map<string, GenericRow>();
    for (const row of latestRunsRes.rows) {
      const companyId = toNumber(row.company_id);
      if (companyId === null) continue;
      runsByCompanyId.set(String(companyId), row);
    }

    const categoriesByRunId = new Map<string, CersCategoryScore[]>();
    for (const row of categoryScoresRes.rows) {
      const runId = toNumber(row.scoring_run_id);
      if (runId === null) continue;

      const matchingMeta = categoryMeta.find((meta) => meta.id === String(row.category_id) || meta.code === toText(row.category_code));
      const displayOrder = toNumber(row.display_order) ?? matchingMeta?.displayOrder ?? 99;
      const weight = toNumber(row.category_weight) ?? matchingMeta?.weight ?? 0;
      const code = toText(row.category_code) || matchingMeta?.code || `cat${displayOrder}`;
      const category: CersCategoryScore = {
        id: String(row.category_id ?? code),
        code,
        label: matchingMeta?.label || getPublicCategoryLabel(code, toText(row.category_name), displayOrder - 1),
        weight,
        displayOrder,
        rawScore: normalizeCategoryRawScore(row.category_raw_score, row.category_weighted_score, weight),
        weightedScore: normalizeWeightedContribution(row.category_weighted_score),
      };

      if (!categoriesByRunId.has(String(runId))) categoriesByRunId.set(String(runId), []);
      categoriesByRunId.get(String(runId))!.push(category);
    }

    const targetsByCompanyId = new Map<string, CersTargetFact[]>();
    for (const row of targetsRes.rows) {
      const companyId = toNumber(row.company_id);
      const targetId = toNumber(row.company_target_fact_id);
      if (companyId === null || targetId === null) continue;

      const target: CersTargetFact = {
        id: String(targetId),
        targetType: toText(row.target_type) || "target",
        metricType: toText(row.target_metric_type),
        baseYear: toNumber(row.base_year),
        targetYear: toNumber(row.target_year),
        scopeCode: toText(row.target_scope_code),
        targetValue: toNumber(row.target_value),
        targetUnit: toText(row.target_unit),
        targetReductionPct: normalizePercentValue(toNumber(row.target_reduction_pct)),
        scenarioAlignmentCode: toText(row.scenario_alignment_code),
        sbtiApproved: toBoolean(row.sbti_approval_flag),
        residualDefined: toBoolean(row.residual_defined_flag),
        offsetUsage: toBoolean(row.offset_usage_flag),
        offsetDependencyRatio: normalizePercentValue(toNumber(row.offset_dependency_ratio)),
        carbonRemovalPlan: toBoolean(row.carbon_removal_plan_flag),
        disclosed: toBoolean(row.disclosed_flag),
      };

      const key = String(companyId);
      if (!targetsByCompanyId.has(key)) targetsByCompanyId.set(key, []);
      targetsByCompanyId.get(key)!.push(target);
    }

    const scope3ByCompanyId = new Map<string, GenericRow>();
    for (const row of scope3Res.rows) {
      const companyId = toNumber(row.company_id);
      if (companyId === null) continue;
      scope3ByCompanyId.set(String(companyId), row);
    }

    const documentsByCompanyId = new Map<string, GenericRow>();
    for (const row of documentsRes.rows) {
      const companyId = toNumber(row.company_id);
      if (companyId === null) continue;
      documentsByCompanyId.set(String(companyId), row);
    }

    const frameworksByDocumentId = new Map<string, string[]>();
    for (const row of frameworkRes.rows) {
      const documentId = toNumber(row.document_id);
      if (documentId === null) continue;
      const key = String(documentId);
      if (!frameworksByDocumentId.has(key)) frameworksByDocumentId.set(key, []);
      const label = toText(row.framework_label) || toText(row.framework_code);
      if (label && !frameworksByDocumentId.get(key)!.includes(label)) {
        frameworksByDocumentId.get(key)!.push(label);
      }
    }

    const assuranceByDocumentId = new Map<string, GenericRow>();
    for (const row of assuranceRes.rows) {
      const documentId = toNumber(row.document_id);
      if (documentId === null || assuranceByDocumentId.has(String(documentId))) continue;
      assuranceByDocumentId.set(String(documentId), row);
    }

    const metricsByCompanyYear = new Map<string, Record<string, number | null>>();
    for (const row of metricsRes.rows) {
      const companyId = toNumber(row.company_id);
      const fiscalYear = toNumber(row.fiscal_year);
      const metricCode = metricKey(toText(row.metric_code));
      const metricValue = toNumber(row.metric_value);
      if (companyId === null || fiscalYear === null || !metricCode) continue;

      const key = `${companyId}:${fiscalYear}`;
      if (!metricsByCompanyYear.has(key)) metricsByCompanyYear.set(key, {});
      metricsByCompanyYear.get(key)![metricCode] = metricValue;
    }

    const latestEmissionMetricsByCompanyId = new Map<
      string,
      {
        fiscalYear: number;
        scope1: number | null;
        scope2: number | null;
        total: number | null;
      }
    >();

    for (const row of latestEmissionMetricsRes.rows) {
      const companyId = toNumber(row.company_id);
      const fiscalYear = toNumber(row.fiscal_year);
      const metricCode = metricKey(toText(row.metric_code));
      const metricValue = toNumber(row.metric_value);
      if (companyId === null || fiscalYear === null || !metricCode) continue;

      const key = String(companyId);
      if (!latestEmissionMetricsByCompanyId.has(key)) {
        latestEmissionMetricsByCompanyId.set(key, {
          fiscalYear,
          scope1: null,
          scope2: null,
          total: null,
        });
      }

      const target = latestEmissionMetricsByCompanyId.get(key)!;
      target.fiscalYear = fiscalYear;
      if (metricCode === "scope1") target.scope1 = metricValue;
      if (metricCode === "scope2") target.scope2 = metricValue;
      if (metricCode === "total") target.total = metricValue;
    }

    const companies: CersCompanyProfile[] = companiesRes.rows.map((row) => {
      const companyId = String(row.company_id);
      const englishName = toText(row.company_name_en);
      const koreanName = toText(row.company_name_kr);
      const name = englishName || koreanName || `Company ${companyId}`;
      const localName = englishName && koreanName && englishName !== koreanName ? koreanName : null;
      const countryCode = (toText(row.country_code) || "KR").toUpperCase();
      const marketCode = toText(row.market_code);
      const sectorCode = toText(row.sector_code)?.toUpperCase() ?? null;
      const industryCode = toText(row.industry_code);
      const countryLabel =
        lookupCodeLabel(codebooks, ["country_code", "country"], countryCode) || COUNTRY_LABELS[countryCode] || countryCode;
      const marketLabel = lookupCodeLabel(codebooks, ["market_code", "market"], marketCode) || humanizeCode(marketCode);
      const sectorLabel =
        lookupCodeLabel(codebooks, ["sector_code", "sector"], sectorCode) ||
        (sectorCode && !SECTOR_CODES.has(sectorCode as (typeof SECTOR_CODES extends Set<infer T> ? T : never)) ? sectorCode : null);
      const industryLabel =
        lookupCodeLabel(codebooks, ["industry_code", "industry"], industryCode) ||
        (industryCode ? humanizeCode(industryCode) : null);

      const latestRun = runsByCompanyId.get(companyId);
      const scoringRunId = toNumber(latestRun?.scoring_run_id);
      const fiscalYear = toNumber(latestRun?.fiscal_year);
      const yearMetrics = fiscalYear !== null ? metricsByCompanyYear.get(`${companyId}:${fiscalYear}`) : undefined;
      const latestEmissionMetrics = latestEmissionMetricsByCompanyId.get(companyId);
      const targets = targetsByCompanyId.get(companyId) || [];
      const primaryTarget = selectPrimaryTarget(targets);
      const netZeroTarget = selectNetZeroTarget(targets);
      const baseYear = primaryTarget?.baseYear ?? netZeroTarget?.baseYear ?? fiscalYear ?? null;
      const baseYearMetrics = baseYear !== null ? metricsByCompanyYear.get(`${companyId}:${baseYear}`) : undefined;
      const currentMetricYear = latestEmissionMetrics?.fiscalYear ?? fiscalYear;
      const currentScope1 = latestEmissionMetrics?.scope1 ?? yearMetrics?.scope1 ?? null;
      const currentScope2 = latestEmissionMetrics?.scope2 ?? yearMetrics?.scope2 ?? null;
      const currentTotal =
        latestEmissionMetrics?.total ??
        yearMetrics?.total ??
        (currentScope1 !== null || currentScope2 !== null ? (currentScope1 || 0) + (currentScope2 || 0) : null);
      const reductionPct = primaryTarget?.targetReductionPct ?? null;
      const targetEmissions =
        (primaryTarget?.metricType === "absolute" || primaryTarget?.metricType === null
          ? primaryTarget?.targetValue
          : null) ??
        (reductionPct !== null && baseYearMetrics
          ? ((baseYearMetrics.total ?? ((baseYearMetrics.scope1 || 0) + (baseYearMetrics.scope2 || 0))) || 0) *
            (1 - reductionPct / 100)
          : null);
      const categoryScoresForCompany = scoringRunId !== null ? categoriesByRunId.get(String(scoringRunId)) || [] : [];
      const resolvedCategories = mergeCategoryMeta(categoryMeta, categoryScoresForCompany).map((meta) => {
        const match = categoryScoresForCompany.find((category) => category.code === meta.code || category.id === meta.id);
        return (
          match || {
            ...meta,
            rawScore: null,
            weightedScore: null,
          }
        );
      });

      const documentRow = documentsByCompanyId.get(companyId);
      const documentId = toNumber(documentRow?.document_id);
      const assuranceRow = documentId !== null ? assuranceByDocumentId.get(String(documentId)) : undefined;
      const assuranceProvider = toText(assuranceRow?.assurance_provider);
      const assuranceTypeCode = toText(assuranceRow?.assurance_type_code);
      const assuranceTypeLabel =
        lookupCodeLabel(codebooks, ["assurance_type_code", "assurance_type", "assurance"], assuranceTypeCode) ||
        assuranceTypeCode;
      const assuranceDisplay = assuranceProvider || assuranceTypeLabel;
      const document = documentId === null
        ? null
        : {
            id: String(documentId),
            title: toText(documentRow?.title) || `${name} Sustainability Report`,
            documentType: toText(documentRow?.document_type),
            sourceType: toText(documentRow?.source_type),
            reportYear: toNumber(documentRow?.report_year),
            publishedDate: toText(documentRow?.published_date),
            frameworks: frameworksByDocumentId.get(String(documentId)) || [],
            assuranceProvider,
            assuranceType: assuranceDisplay,
          };

      const scope3Row = scope3ByCompanyId.get(companyId);
      const disclosure = {
        scope3DisclosedCategories: toNumber(scope3Row?.disclosed_categories) ?? 0,
        scope3TotalCategories: Math.max(toNumber(scope3Row?.total_categories) ?? 0, 0),
        averagePrimaryDataRatio: normalizePercentValue(toNumber(scope3Row?.average_primary_data_ratio)),
        assuranceType: assuranceDisplay,
        assuranceProvider,
        frameworks: document?.frameworks || [],
        hasThirdPartyAssurance: Boolean(assuranceProvider || assuranceTypeCode),
      };

      const company: CersCompanyProfile = {
        id: companyId,
        name,
        localName,
        displayName: createDisplayName(name, localName),
        stockCode: toText(row.stock_code),
        countryCode,
        countryLabel,
        marketCode,
        marketLabel,
        sectorCode,
        sectorLabel,
        industryCode,
        industryLabel,
        status: toText(row.status),
        fiscalYear: currentMetricYear,
        scoreFiscalYear: fiscalYear,
        scorePeriodId: toNumber(latestRun?.period_id),
        methodologyVersion: toText(latestRun?.version_name) || methodologyVersion,
        overallScore: normalizeOverallScore(latestRun?.cers_score),
        scoreGrade: toText(latestRun?.score_grade),
        sbase: normalizeOverallScore(latestRun?.sbase),
        cef: toNumber(latestRun?.cef),
        gv: toNumber(latestRun?.gv),
        categories: resolvedCategories,
        metrics: {
          fiscalYear: currentMetricYear,
          scope1Emissions: currentScope1,
          scope2Emissions: currentScope2,
          totalEmissions: currentTotal,
          revenue: yearMetrics?.revenue ?? null,
          greenCapex: yearMetrics?.greenCapex ?? null,
          totalCapex: yearMetrics?.totalCapex ?? null,
          ebitda: yearMetrics?.ebitda ?? null,
        },
        targets,
        targetSummary: {
          currentYear: currentMetricYear,
          baseYear,
          targetYear: primaryTarget?.targetYear ?? null,
          netZeroYear: netZeroTarget?.targetYear ?? null,
          targetType: primaryTarget?.metricType ?? primaryTarget?.targetType ?? null,
          targetTypeLabel:
            primaryTarget?.metricType === "absolute"
              ? "Absolute Reduction"
              : primaryTarget?.metricType === "intensity"
                ? "Intensity Reduction"
                : humanizeCode(primaryTarget?.targetType),
          scopeCode: primaryTarget?.scopeCode ?? netZeroTarget?.scopeCode ?? null,
          scopeLabel:
            primaryTarget?.scopeCode || netZeroTarget?.scopeCode
              ? humanizeCode(primaryTarget?.scopeCode ?? netZeroTarget?.scopeCode)
              : null,
          reductionPct,
          targetEmissions: targetEmissions !== null && Number.isFinite(targetEmissions) ? Number(targetEmissions.toFixed(0)) : null,
          sbtiApproved:
            primaryTarget?.sbtiApproved ??
            netZeroTarget?.sbtiApproved ??
            targets.some((target) => target.sbtiApproved === true),
          interimTargetLabel:
            targets.filter((target) => target.targetType !== "netzero" && target.targetYear).length > 1
              ? "Yes"
              : primaryTarget?.targetYear
                ? "Yes"
                : "No",
        },
        disclosure,
        latestDocument: document,
        badges: [],
        summary: "",
        interpretation: "",
      };

      company.badges = buildBadges(company);
      company.summary = buildCompanySummary(company);
      company.interpretation = buildCompanyInterpretation(company.overallScore, company);

      return company;
    });

    companies.sort((a, b) => {
      const scoreA = a.overallScore ?? -1;
      const scoreB = b.overallScore ?? -1;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
    });

    return localizeDashboardData(
      {
        source: "db",
        issue: null,
        generatedAt: new Date().toISOString(),
        methodologyVersion,
        categories: categoryMeta,
        companies,
      },
      locale,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    return localizeDashboardData({ ...fallbackDashboardData, issue: makeIssueMessage(message, locale) }, locale);
  }
});

export const getCompanyEmissionHistory = cache(async (companyId: string): Promise<CersEmissionHistoryPoint[]> => {
  const numericCompanyId = Number(companyId);
  if (!Number.isFinite(numericCompanyId)) return [];

  try {
    const existingTables = await getExistingTableNames([...HISTORY_TABLES]);
    const schema = resolveDashboardSchema(existingTables);
    if (!schema.metricTable || !schema.periodTable) {
      return [];
    }

    const pool = getPool();
    const result = await pool.query<GenericRow>(
      `SELECT rp.fiscal_year,
              mf.metric_code,
              SUM(mf.${schema.metricValueColumn}) AS metric_value
       FROM ${schema.metricTable} mf
       LEFT JOIN ${schema.periodTable} rp ON rp.period_id = mf.period_id
       WHERE mf.company_id = $1
         AND mf.metric_code = ANY($2::text[])
         AND COALESCE(mf.data_status, 'reported') <> 'missing'
         AND rp.fiscal_year IS NOT NULL
       GROUP BY rp.fiscal_year, mf.metric_code
       ORDER BY rp.fiscal_year ASC`,
      [numericCompanyId, ["scope1_emissions", "scope_1_emissions", "scope2_emissions", "scope_2_emissions", "scope12_emissions", "scope1_2_emissions", "scope_1_2_emissions"]],
    );

    const byYear = new Map<number, Record<string, number | null>>();
    for (const row of result.rows) {
      const fiscalYear = toNumber(row.fiscal_year);
      const metricCode = metricKey(toText(row.metric_code));
      const metricValue = toNumber(row.metric_value);
      if (fiscalYear === null || !metricCode) continue;
      if (!byYear.has(fiscalYear)) byYear.set(fiscalYear, {});
      byYear.get(fiscalYear)![metricCode] = metricValue;
    }

    return Array.from(byYear.entries())
      .map(([fiscalYear, metrics]) => {
        const scope1 = metrics.scope1 ?? null;
        const scope2 = metrics.scope2 ?? null;
        const total =
          metrics.total ?? (scope1 !== null || scope2 !== null ? (scope1 || 0) + (scope2 || 0) : null);

        return {
          fiscalYear,
          scope1Emissions: scope1,
          scope2Emissions: scope2,
          totalEmissions: total,
        };
      })
      .sort((a, b) => a.fiscalYear - b.fiscalYear);
  } catch {
    return [];
  }
});
