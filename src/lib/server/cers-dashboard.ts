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

const REQUIRED_TABLES = [
  "companies",
  "reporting_periods",
  "documents",
  "company_metric_facts",
  "company_target_facts",
  "company_scope3_facts",
  "codebooks",
  "methodology_versions",
  "score_categories",
  "scoring_runs",
  "category_scores",
  "cers_score",
  "document_framework_adoptions",
  "document_assurance_statements",
] as const;

const HISTORY_TABLES = ["company_metric_facts", "reporting_periods"] as const;

const COUNTRY_LABELS: Record<string, string> = {
  KR: "South Korea",
  JP: "Japan",
  US: "United States",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  CN: "China",
};

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
    const existingTables = await getExistingTableNames([...REQUIRED_TABLES]);
    if (!existingTables.has("companies")) {
      return localizeDashboardData(
        { ...fallbackDashboardData, issue: makeIssueMessage("The companies table is not available.", locale) },
        locale,
      );
    }

    const pool = getPool();

    const [companiesRes, methodologyRes, latestRunsRes, categoriesRes, codebooksRes] = await Promise.all([
      pool.query<GenericRow>(
        `SELECT company_id, company_name_kr, company_name_en, stock_code, country_code, market_code, sector_code, industry_code, status
         FROM companies
         WHERE COALESCE(status, 'active') <> 'inactive'`,
      ),
      existingTables.has("methodology_versions")
        ? pool.query<GenericRow>(
            `SELECT methodology_version_id, version_name
             FROM methodology_versions
             ORDER BY is_active DESC, effective_from DESC NULLS LAST, methodology_version_id DESC
             LIMIT 1`,
          )
        : Promise.resolve(getEmptyResult()),
      existingTables.has("scoring_runs") && existingTables.has("reporting_periods") && existingTables.has("cers_score")
        ? pool.query<GenericRow>(
            `WITH ranked_runs AS (
               SELECT sr.scoring_run_id,
                      sr.company_id,
                      sr.period_id,
                      sr.methodology_version_id,
                      sr.run_status,
                      sr.finished_at,
                      rp.fiscal_year,
                      mv.version_name,
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
               LEFT JOIN reporting_periods rp ON rp.period_id = sr.period_id
               LEFT JOIN methodology_versions mv ON mv.methodology_version_id = sr.methodology_version_id
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
      companyIds.length > 0 && existingTables.has("company_target_facts")
        ? pool.query<GenericRow>(
            `SELECT company_target_fact_id,
                    company_id,
                    target_type,
                    target_metric_type,
                    base_year,
                    target_year,
                    target_scope_code,
                    target_value,
                    target_unit,
                    target_reduction_pct,
                    scenario_alignment_code,
                    sbti_approval_flag,
                    residual_defined_flag,
                    offset_usage_flag,
                    offset_dependency_ratio,
                    carbon_removal_plan_flag,
                    disclosed_flag
             FROM company_target_facts
             WHERE company_id = ANY($1::bigint[])`,
            [companyIds],
          )
        : Promise.resolve(getEmptyResult()),
      companyIds.length > 0 && existingTables.has("company_scope3_facts")
        ? pool.query<GenericRow>(
            `SELECT company_id,
                    COUNT(*) FILTER (WHERE COALESCE(disclosed_flag, FALSE)) AS disclosed_categories,
                    COUNT(*) AS total_categories,
                    AVG(primary_data_ratio) AS average_primary_data_ratio
             FROM company_scope3_facts
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

    const [metricsRes, frameworkRes, assuranceRes] = await Promise.all([
      companyIds.length > 0 && existingTables.has("company_metric_facts") && existingTables.has("reporting_periods")
        ? pool.query<GenericRow>(
            `SELECT mf.company_id,
                    rp.fiscal_year,
                    mf.metric_code,
                    SUM(mf.metric_value) AS metric_value,
                    MAX(mf.metric_unit) AS metric_unit
             FROM company_metric_facts mf
             LEFT JOIN reporting_periods rp ON rp.period_id = mf.period_id
             WHERE mf.company_id = ANY($1::bigint[])
               AND mf.metric_code = ANY($2::text[])
               ${yearsNeeded.length > 0 ? "AND rp.fiscal_year = ANY($3::int[])" : ""}
               AND COALESCE(mf.data_status, 'reported') <> 'missing'
             GROUP BY mf.company_id, rp.fiscal_year, mf.metric_code`,
            yearsNeeded.length > 0 ? [companyIds, RELEVANT_METRIC_CODES, yearsNeeded] : [companyIds, RELEVANT_METRIC_CODES],
          )
        : Promise.resolve(getEmptyResult()),
      documentIds.length > 0 && existingTables.has("document_framework_adoptions")
        ? pool.query<GenericRow>(
            `SELECT document_id, framework_code, framework_label
             FROM document_framework_adoptions
             WHERE document_id = ANY($1::bigint[])`,
            [documentIds],
          )
        : Promise.resolve(getEmptyResult()),
      documentIds.length > 0 && existingTables.has("document_assurance_statements")
        ? pool.query<GenericRow>(
            `SELECT document_id, assurance_provider, assurance_type_code
             FROM document_assurance_statements
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

    const companies: CersCompanyProfile[] = companiesRes.rows.map((row) => {
      const companyId = String(row.company_id);
      const englishName = toText(row.company_name_en);
      const koreanName = toText(row.company_name_kr);
      const name = englishName || koreanName || `Company ${companyId}`;
      const localName = englishName && koreanName && englishName !== koreanName ? koreanName : null;
      const countryCode = (toText(row.country_code) || "KR").toUpperCase();
      const marketCode = toText(row.market_code);
      const sectorCode = toText(row.sector_code);
      const industryCode = toText(row.industry_code);
      const countryLabel =
        lookupCodeLabel(codebooks, ["country_code", "country"], countryCode) || COUNTRY_LABELS[countryCode] || countryCode;
      const marketLabel = lookupCodeLabel(codebooks, ["market_code", "market"], marketCode) || humanizeCode(marketCode);
      const sectorLabel = lookupCodeLabel(codebooks, ["sector_code", "sector"], sectorCode) || humanizeCode(sectorCode);
      const industryLabel = lookupCodeLabel(codebooks, ["industry_code", "industry"], industryCode) || humanizeCode(industryCode);

      const latestRun = runsByCompanyId.get(companyId);
      const scoringRunId = toNumber(latestRun?.scoring_run_id);
      const fiscalYear = toNumber(latestRun?.fiscal_year);
      const yearMetrics = fiscalYear !== null ? metricsByCompanyYear.get(`${companyId}:${fiscalYear}`) : undefined;
      const targets = targetsByCompanyId.get(companyId) || [];
      const primaryTarget = selectPrimaryTarget(targets);
      const netZeroTarget = selectNetZeroTarget(targets);
      const baseYear = primaryTarget?.baseYear ?? netZeroTarget?.baseYear ?? fiscalYear ?? null;
      const baseYearMetrics = baseYear !== null ? metricsByCompanyYear.get(`${companyId}:${baseYear}`) : undefined;
      const currentScope1 = yearMetrics?.scope1 ?? null;
      const currentScope2 = yearMetrics?.scope2 ?? null;
      const currentTotal =
        yearMetrics?.total ?? (currentScope1 !== null || currentScope2 !== null ? (currentScope1 || 0) + (currentScope2 || 0) : null);
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
            assuranceProvider: toText(assuranceRow?.assurance_provider),
            assuranceType: toText(assuranceRow?.assurance_type_code),
          };

      const scope3Row = scope3ByCompanyId.get(companyId);
      const disclosure = {
        scope3DisclosedCategories: toNumber(scope3Row?.disclosed_categories) ?? 0,
        scope3TotalCategories: Math.max(toNumber(scope3Row?.total_categories) ?? 0, 0),
        averagePrimaryDataRatio: normalizePercentValue(toNumber(scope3Row?.average_primary_data_ratio)),
        assuranceType: toText(assuranceRow?.assurance_type_code),
        assuranceProvider: toText(assuranceRow?.assurance_provider),
        frameworks: document?.frameworks || [],
        hasThirdPartyAssurance: Boolean(toText(assuranceRow?.assurance_type_code) || toText(assuranceRow?.assurance_provider)),
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
        fiscalYear,
        methodologyVersion: toText(latestRun?.version_name) || methodologyVersion,
        overallScore: normalizeOverallScore(latestRun?.cers_score),
        scoreGrade: toText(latestRun?.score_grade),
        sbase: normalizeOverallScore(latestRun?.sbase),
        cef: toNumber(latestRun?.cef),
        gv: toNumber(latestRun?.gv),
        categories: resolvedCategories,
        metrics: {
          fiscalYear,
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
          currentYear: fiscalYear,
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
          scopeLabel: humanizeCode(primaryTarget?.scopeCode ?? netZeroTarget?.scopeCode),
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
    if (!existingTables.has("company_metric_facts") || !existingTables.has("reporting_periods")) {
      return [];
    }

    const pool = getPool();
    const result = await pool.query<GenericRow>(
      `SELECT rp.fiscal_year,
              mf.metric_code,
              SUM(mf.metric_value) AS metric_value
       FROM company_metric_facts mf
       LEFT JOIN reporting_periods rp ON rp.period_id = mf.period_id
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
