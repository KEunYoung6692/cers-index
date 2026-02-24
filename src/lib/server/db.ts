import "server-only";

import { readFile, stat } from "fs/promises";
import path from "path";
import { Pool } from "pg";
import type { DashboardData } from "@/lib/data/dashboard";
import type { EvidenceItem, ScoreRun, EmissionData } from "@/data/mockData";

let pool: Pool | null = null;

const DEFAULT_MARKET_CAP_CSV_PATH = "DB_company_code_market_cap_yfinance.csv";
const DEFAULT_MARKET_CAP_FALLBACK = 1;

type MarketCapCsvLookup = {
  byCompanyId: Map<string, number>;
  fallbackMarketCap: number;
};

let marketCapCsvCache:
  | {
      csvPath: string;
      mtimeMs: number;
      lookup: MarketCapCsvLookup;
    }
  | null = null;

function getPool() {
  const {
    DATABASE_URL,
    PGHOST,
    PGUSER,
    PGPASSWORD,
    PGDATABASE,
    PGPORT,
    PGSSLMODE,
    PGPOOL_MAX,
    PGPOOL_IDLE_TIMEOUT_MS,
    PGPOOL_CONNECTION_TIMEOUT_MS,
  } = process.env;

  const hasDiscreteConfig = PGHOST && PGUSER && PGPASSWORD && PGDATABASE;
  if (!DATABASE_URL && !hasDiscreteConfig) {
    throw new Error("DATABASE_URL or PGHOST/PGUSER/PGPASSWORD/PGDATABASE must be set");
  }

  if (!pool) {
    const poolMax = Math.max(1, Number(PGPOOL_MAX ?? 1) || 1);
    const idleTimeoutMillis = Math.max(1_000, Number(PGPOOL_IDLE_TIMEOUT_MS ?? 10_000) || 10_000);
    const connectionTimeoutMillis = Math.max(
      1_000,
      Number(PGPOOL_CONNECTION_TIMEOUT_MS ?? 10_000) || 10_000,
    );

    pool = new Pool(
      DATABASE_URL
        ? {
            connectionString: DATABASE_URL,
            ssl: PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
            max: poolMax,
            idleTimeoutMillis,
            connectionTimeoutMillis,
          }
        : {
            host: PGHOST,
            user: PGUSER,
            password: PGPASSWORD,
            database: PGDATABASE,
            port: PGPORT ? Number(PGPORT) : 5432,
            ssl: PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
            max: poolMax,
            idleTimeoutMillis,
            connectionTimeoutMillis,
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

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
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

function normalizeEmissionValue(value: number, unit: unknown) {
  if (!Number.isFinite(value)) return null;
  if (typeof unit !== "string") return value;

  const unitToken = unit
    .trim()
    .replace(/[\u2082\u00B2]/g, "2")
    .split("/")[0]
    .replace(/[^A-Za-z0-9]/g, "");
  if (!unitToken) return value;

  const normalizedUnit = unitToken.toLowerCase();
  const startsWithAny = (prefixes: string[]) => prefixes.some((prefix) => normalizedUnit.startsWith(prefix));

  // Normalize common CO2e mass units to tCO2e.
  if (startsWithAny(["gco2", "gramco2"])) return value / 1_000_000;
  if (startsWithAny(["kgco2", "kilogramco2"])) return value / 1_000;
  if (startsWithAny(["ktco2", "ktonco2", "kilotonco2", "kilotonneco2"])) return value * 1_000;
  if (
    normalizedUnit.startsWith("mmtco2") ||
    normalizedUnit.startsWith("megatonco2") ||
    normalizedUnit.startsWith("megatonneco2") ||
    normalizedUnit.startsWith("millionmetrictonco2") ||
    normalizedUnit.startsWith("milliontonco2") ||
    /^M[tT]CO2/.test(unitToken)
  ) {
    return value * 1_000_000;
  }
  if (startsWithAny(["gtco2", "gigatonco2", "gigatonneco2"])) return value * 1_000_000_000;

  return value;
}

function normalizeDenomType(denomType: unknown) {
  if (typeof denomType !== "string") return "other";
  const normalized = denomType.trim().toLowerCase();
  return normalized.length > 0 ? normalized : "other";
}

function getDenomTypePriority(denomType: string) {
  if (denomType === "revenue") return 3;
  if (denomType === "production") return 2;
  if (denomType === "other") return 1;
  return 0;
}

function mapLanguageCode(
  languageCode: unknown,
): "EN" | "JP" | "KR" | null {
  if (typeof languageCode !== "string") return null;
  const normalized = languageCode.trim().toLowerCase();
  if (normalized === "en" || normalized === "eng") return "EN";
  if (normalized === "jp" || normalized === "ja" || normalized === "jpn") return "JP";
  if (normalized === "kr" || normalized === "ko" || normalized === "kor") return "KR";
  return null;
}

function parseCsvLine(line: string) {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === "\"") {
      const next = line[i + 1];
      if (inQuotes && next === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  fields.push(current);
  return fields.map((field) => field.trim());
}

function parseMarketCap(value: string | undefined) {
  if (!value) return null;
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function getMarketCapCsvPath() {
  const configured = process.env.MARKET_CAP_CSV_PATH?.trim();
  return path.resolve(process.cwd(), configured || DEFAULT_MARKET_CAP_CSV_PATH);
}

async function loadMarketCapCsvLookup(): Promise<MarketCapCsvLookup | null> {
  const csvPath = getMarketCapCsvPath();

  try {
    const stats = await stat(csvPath);
    if (marketCapCsvCache && marketCapCsvCache.csvPath === csvPath && marketCapCsvCache.mtimeMs === stats.mtimeMs) {
      return marketCapCsvCache.lookup;
    }

    const rawCsv = await readFile(csvPath, "utf8");
    const lines = rawCsv.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length <= 1) {
      const lookup: MarketCapCsvLookup = {
        byCompanyId: new Map(),
        fallbackMarketCap: DEFAULT_MARKET_CAP_FALLBACK,
      };
      marketCapCsvCache = {
        csvPath,
        mtimeMs: stats.mtimeMs,
        lookup,
      };
      return lookup;
    }

    const headers = parseCsvLine(lines[0]).map((header) => header.replace(/^\uFEFF/, ""));
    const companyIdIndex = headers.findIndex((header) => header === "company_id");
    const marketCapIndex = headers.findIndex((header) => header === "market_cap");
    const byCompanyId = new Map<string, number>();
    let minKnownMarketCap: number | null = null;

    if (companyIdIndex === -1 || marketCapIndex === -1) {
      const lookup: MarketCapCsvLookup = {
        byCompanyId,
        fallbackMarketCap: DEFAULT_MARKET_CAP_FALLBACK,
      };
      marketCapCsvCache = {
        csvPath,
        mtimeMs: stats.mtimeMs,
        lookup,
      };
      return lookup;
    }

    for (let i = 1; i < lines.length; i += 1) {
      const fields = parseCsvLine(lines[i]);
      const companyId = fields[companyIdIndex]?.trim();
      if (!companyId || byCompanyId.has(companyId)) continue;

      const marketCap = parseMarketCap(fields[marketCapIndex]);
      if (!marketCap) continue;

      byCompanyId.set(companyId, marketCap);
      if (minKnownMarketCap === null || marketCap < minKnownMarketCap) {
        minKnownMarketCap = marketCap;
      }
    }

    const fallbackMarketCap =
      minKnownMarketCap === null
        ? DEFAULT_MARKET_CAP_FALLBACK
        : minKnownMarketCap > 1
          ? minKnownMarketCap - 1
          : minKnownMarketCap * 0.5;

    const lookup: MarketCapCsvLookup = {
      byCompanyId,
      fallbackMarketCap,
    };

    marketCapCsvCache = {
      csvPath,
      mtimeMs: stats.mtimeMs,
      lookup,
    };

    return lookup;
  } catch {
    return null;
  }
}

type DashboardDbQueryScope = "full" | "main";

type DashboardDbQueryOptions = {
  scope?: DashboardDbQueryScope;
  country?: string;
  companyId?: string;
};

type DashboardDbQueryResult = {
  data: DashboardData;
  meta?: {
    selectedCompanyId?: string;
  };
};

export async function getDashboardDataFromDb(
  options: DashboardDbQueryOptions = {},
): Promise<DashboardDbQueryResult> {
  // 참고: config/db_schema 기준으로 테이블을 조회합니다.
  const pool = getPool();
  const scope = options.scope ?? "full";
  const isMainScope = scope === "main";
  const requestedCountry = options.country?.trim().toUpperCase() || null;
  const requestedCompanyId = options.companyId?.trim() || null;

  const schemaInfoRes = await pool.query(
    `SELECT table_name, column_name
     FROM information_schema.columns
     WHERE table_schema = current_schema()
       AND table_name IN ('company', 'emission', 'denominator', 'emission_target', 'report', 'report_framework', 'mms_observation', 'industry_i18n', 'company_i18n')`,
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
  const hasCompanyTicker = hasColumn("company", "ticker");
  const hasCompanySymbol = hasColumn("company", "symbol");
  const hasCompanyStockCode = hasColumn("company", "stock_code");
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
  const hasMmsObservationScoreRunId = hasColumn("mms_observation", "score_run_id");
  const hasMmsObservationCompanyId = hasColumn("mms_observation", "company_id");
  const hasIndustryI18nIndustryId = hasColumn("industry_i18n", "industry_id");
  const hasIndustryI18nLanguageCode = hasColumn("industry_i18n", "language_code");
  const hasIndustryI18nName = hasColumn("industry_i18n", "industry_name_i18n");
  const hasIndustryI18n =
    hasIndustryI18nIndustryId &&
    hasIndustryI18nLanguageCode &&
    hasIndustryI18nName;
  const hasCompanyI18nCompanyId = hasColumn("company_i18n", "company_id");
  const hasCompanyI18nLanguageCode = hasColumn("company_i18n", "language_code");
  const hasCompanyI18nName = hasColumn("company_i18n", "company_name_i18n");
  const hasCompanyI18n =
    hasCompanyI18nCompanyId &&
    hasCompanyI18nLanguageCode &&
    hasCompanyI18nName;
  const companyTickerColumn = hasCompanyTicker
    ? "c.ticker"
    : hasCompanySymbol
      ? "c.symbol"
      : hasCompanyStockCode
        ? "c.stock_code"
        : "NULL::VARCHAR";

  if (!hasMmsObservationScoreRunId && !hasMmsObservationCompanyId) {
    throw new Error("mms_observation table must include score_run_id or company_id");
  }

  const companiesRes = await pool.query(
    `SELECT c.company_id, c.company_name, c.industry_id, c.country, ${companyTickerColumn} AS ticker, i.industry_name
     FROM company c
     LEFT JOIN industry i ON i.industry_id = c.industry_id
     ${requestedCountry ? "WHERE UPPER(COALESCE(c.country, 'KR')) = $1" : ""}`,
    requestedCountry ? [requestedCountry] : [],
  );

  const marketCapLookup = await loadMarketCapCsvLookup();
  const companySelectionRows = companiesRes.rows.map((row) => {
    const companyId = String(row.company_id);
    return {
      id: companyId,
      name: ((row.company_name as string | null) ?? "").trim() || "Unknown",
      marketCap: marketCapLookup
        ? (marketCapLookup.byCompanyId.get(companyId) ?? marketCapLookup.fallbackMarketCap)
        : undefined,
    };
  });
  const sortedCompanySelectionRows = companySelectionRows.slice().sort((a, b) => {
    const capA = typeof a.marketCap === "number" && Number.isFinite(a.marketCap) && a.marketCap > 0 ? a.marketCap : null;
    const capB = typeof b.marketCap === "number" && Number.isFinite(b.marketCap) && b.marketCap > 0 ? b.marketCap : null;
    if (capA !== null && capB !== null && capA !== capB) return capB - capA;
    if (capA !== null && capB === null) return -1;
    if (capA === null && capB !== null) return 1;
    return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  });

  const companyIdsInScope = new Set(companySelectionRows.map((company) => company.id));
  const effectiveSelectedCompanyId =
    isMainScope && companyIdsInScope.size > 0
      ? requestedCompanyId && companyIdsInScope.has(requestedCompanyId)
        ? requestedCompanyId
        : (sortedCompanySelectionRows[0]?.id ?? undefined)
      : undefined;

  if (isMainScope && companySelectionRows.length === 0) {
    return {
      data: {
        companies: [],
        scoreRuns: {},
        reports: {},
        emissionsData: {},
        targets: {},
        industryData: {},
        evidenceItems: {},
      },
      meta: {},
    };
  }

  const scopedCompanyIdNumbers = Array.from(
    new Set(
      companiesRes.rows
        .map((row) => toNullableNumber(row.company_id))
        .filter((value): value is number => value !== null)
        .map((value) => Math.trunc(value)),
    ),
  );
  const detailCompanyIdNumbers =
    isMainScope && effectiveSelectedCompanyId
      ? [Math.trunc(Number(effectiveSelectedCompanyId))].filter((value) => Number.isFinite(value))
      : scopedCompanyIdNumbers;
  const scopedIndustryIdNumbers = Array.from(
    new Set(
      companiesRes.rows
        .map((row) => toNullableNumber(row.industry_id))
        .filter((value): value is number => value !== null)
        .map((value) => Math.trunc(value)),
    ),
  );
  const applyCompanyScopeFilter = Boolean(requestedCountry) && scopedCompanyIdNumbers.length > 0;
  const applyDetailCompanyFilter = isMainScope && detailCompanyIdNumbers.length > 0;
  const applyIndustryScopeFilter = (Boolean(requestedCountry) || isMainScope) && scopedIndustryIdNumbers.length > 0;
  const emptyQueryResult = { rows: [] as Array<Record<string, unknown>> };

  const [
    industriesRes,
    scoreRunsRes,
    reportsRes,
    reportFrameworkRes,
    emissionsRes,
    denomRes,
    targetsRes,
    alphaRes,
    industryI18nRes,
    companyI18nRes,
    mmsDefsRes,
    mmsObsRes,
  ] = await Promise.all([
    pool.query(
      `SELECT industry_id, industry_name
       FROM industry`,
    ),
    pool.query(
      `SELECT sr.score_run_id, sr.company_id, sr.eval_year, sr.ri_score, sr.tag_score, sr.mms_score, sr.pcrc_score,
              sc.ri_max, sc.tag_max, sc.mms_max
       FROM score_run sr
       LEFT JOIN scoring_config sc ON sc.config_id = sr.config_id
       ${applyCompanyScopeFilter ? "WHERE sr.company_id = ANY($1::int[])" : ""}
       ORDER BY sr.company_id, sr.eval_year DESC`,
      applyCompanyScopeFilter ? [scopedCompanyIdNumbers] : [],
    ),
    pool.query(
      reportDateColumn
        ? `SELECT report_id, company_id, report_year, ${reportDateColumn} AS report_date, assurance_org
           FROM report
           ${applyDetailCompanyFilter ? "WHERE company_id = ANY($1::int[])" : ""}`
        : `SELECT NULL::INTEGER AS report_id, NULL::INTEGER AS company_id, NULL::INTEGER AS report_year, NULL::DATE AS report_date, NULL::VARCHAR AS assurance_org
           WHERE FALSE`,
      applyDetailCompanyFilter ? [detailCompanyIdNumbers] : [],
    ),
    pool.query(
      reportFrameworkColumn
        ? applyDetailCompanyFilter
          ? `SELECT rf.report_id, rf.${reportFrameworkColumn} AS framework
             FROM report_framework rf
             JOIN report r ON r.report_id = rf.report_id
             WHERE r.company_id = ANY($1::int[])`
          : `SELECT report_id, ${reportFrameworkColumn} AS framework
             FROM report_framework`
        : `SELECT NULL::INTEGER AS report_id, NULL::VARCHAR AS framework
           WHERE FALSE`,
      applyDetailCompanyFilter ? [detailCompanyIdNumbers] : [],
    ),
    pool.query(
      hasEmissionCompany
        ? `SELECT company_id, emission_year, scope, emissions_value, unit, data_level, evidence_page, evidence_note
           FROM emission
           WHERE scope IN ('S1', 'S2', 'S1S2', 'TOTAL')`
              + (applyCompanyScopeFilter ? `
             AND company_id = ANY($1::int[])` : "")
        : `SELECT sc.company_id AS company_id, e.emission_year, e.scope, e.emissions_value, e.unit, e.data_level, e.evidence_page, e.evidence_note
           FROM emission e
           JOIN sub_company sc ON sc.sub_company_id = e.sub_company_id
           WHERE sc.is_self IS TRUE
             AND e.scope IN ('S1', 'S2', 'S1S2', 'TOTAL')`
              + (applyCompanyScopeFilter ? `
             AND sc.company_id = ANY($1::int[])` : ""),
      applyCompanyScopeFilter ? [scopedCompanyIdNumbers] : [],
    ),
    pool.query(
      hasDenomCompany
        ? `SELECT company_id, denom_year, denom_type, denom_value, data_level, evidence_page, evidence_note
           FROM denominator
           ${applyCompanyScopeFilter ? "WHERE company_id = ANY($1::int[])" : ""}`
        : `SELECT sc.company_id AS company_id, d.denom_year, d.denom_type, d.denom_value, d.data_level, d.evidence_page, d.evidence_note
           FROM denominator d
           LEFT JOIN sub_company sc ON sc.sub_company_id = d.sub_company_id
           ${applyCompanyScopeFilter ? "WHERE sc.company_id = ANY($1::int[])" : ""}`,
      applyCompanyScopeFilter ? [scopedCompanyIdNumbers] : [],
    ),
    pool.query(
      hasTargetCompany
        ? `SELECT company_id, scope, baseline_year, target_year, target_reduction_pct, evidence_page, evidence_note
           FROM emission_target
           ${applyDetailCompanyFilter ? "WHERE company_id = ANY($1::int[])" : ""}`
        : `SELECT sc.company_id AS company_id, t.scope, t.baseline_year, t.target_year, t.target_reduction_pct, t.evidence_page, t.evidence_note
           FROM emission_target t
           LEFT JOIN sub_company sc ON sc.sub_company_id = t.sub_company_id
           ${applyDetailCompanyFilter ? "WHERE sc.company_id = ANY($1::int[])" : ""}`,
      applyDetailCompanyFilter ? [detailCompanyIdNumbers] : [],
    ),
    pool.query(
      `SELECT DISTINCT ON (industry_id) industry_id, alpha
       FROM scoring_config_alpha
       ${applyIndustryScopeFilter ? "WHERE industry_id = ANY($1::int[])" : ""}
       ORDER BY industry_id, config_id DESC`,
      applyIndustryScopeFilter ? [scopedIndustryIdNumbers] : [],
    ),
    pool.query(
      hasIndustryI18n
        ? `SELECT industry_id, language_code, industry_name_i18n
           FROM industry_i18n
           ${applyIndustryScopeFilter ? "WHERE industry_id = ANY($1::int[])" : ""}`
        : `SELECT NULL::INTEGER AS industry_id, NULL::VARCHAR AS language_code, NULL::VARCHAR AS industry_name_i18n
           WHERE FALSE`,
      applyIndustryScopeFilter ? [scopedIndustryIdNumbers] : [],
    ),
    pool.query(
      hasCompanyI18n
        ? `SELECT company_id, language_code, company_name_i18n
           FROM company_i18n
           ${applyCompanyScopeFilter ? "WHERE company_id = ANY($1::int[])" : ""}`
        : `SELECT NULL::INTEGER AS company_id, NULL::VARCHAR AS language_code, NULL::VARCHAR AS company_name_i18n
           WHERE FALSE`,
      applyCompanyScopeFilter ? [scopedCompanyIdNumbers] : [],
    ),
    isMainScope
      ? Promise.resolve(emptyQueryResult)
      : pool.query(
          `SELECT indicator_id, indicator_name
           FROM mms_indicator_def`,
        ),
    isMainScope
      ? Promise.resolve(emptyQueryResult)
      : pool.query(
          `SELECT ${hasMmsObservationScoreRunId ? "score_run_id" : "NULL::INTEGER AS score_run_id"},
                  ${hasMmsObservationCompanyId ? "company_id" : "NULL::INTEGER AS company_id"},
                  indicator_id, status, points_awarded, data_level, evidence_page, evidence_note
           FROM mms_observation
           ${hasMmsObservationCompanyId && applyDetailCompanyFilter ? "WHERE company_id = ANY($1::int[])" : ""}`,
          hasMmsObservationCompanyId && applyDetailCompanyFilter ? [detailCompanyIdNumbers] : [],
        ),
  ]);

  const industryNameById = new Map<number, string>(
    industriesRes.rows.map((row) => [row.industry_id as number, row.industry_name as string]),
  );
  const industryI18nById = new Map<number, { EN?: string; JP?: string; KR?: string }>();

  for (const row of industryI18nRes.rows) {
    const industryId = toNullableNumber(row.industry_id);
    if (industryId === null) continue;
    const languageKey = mapLanguageCode(row.language_code);
    if (!languageKey) continue;
    const localizedName = (row.industry_name_i18n as string | null)?.trim();
    if (!localizedName) continue;

    const key = Math.trunc(industryId);
    if (!industryI18nById.has(key)) {
      industryI18nById.set(key, {});
    }
    industryI18nById.get(key)![languageKey] = localizedName;
  }

  const companyI18nById = new Map<number, { EN?: string; JP?: string; KR?: string }>();

  for (const row of companyI18nRes.rows) {
    const companyId = toNullableNumber(row.company_id);
    if (companyId === null) continue;
    const languageKey = mapLanguageCode(row.language_code);
    if (!languageKey) continue;
    const localizedName = (row.company_name_i18n as string | null)?.trim();
    if (!localizedName) continue;

    const key = Math.trunc(companyId);
    if (!companyI18nById.has(key)) {
      companyI18nById.set(key, {});
    }
    companyI18nById.get(key)![languageKey] = localizedName;
  }

  const baseCompanies = companiesRes.rows.map((row) => {
    const numericCompanyId = toNullableNumber(row.company_id);
    const country = ((row.country as string) ?? "KR").toUpperCase();
    const baseCompanyName = ((row.company_name as string | null) ?? "").trim() || "Unknown";
    const ticker = ((row.ticker as string | null) ?? "").trim() || undefined;
    const industryId = row.industry_id !== null ? String(row.industry_id) : "unknown";
    const numericIndustryId = toNullableNumber(row.industry_id);
    const localizedNames = numericIndustryId === null ? undefined : industryI18nById.get(Math.trunc(numericIndustryId));
    const localizedCompanyNames =
      numericCompanyId === null ? undefined : companyI18nById.get(Math.trunc(numericCompanyId));
    const englishCompanyName = localizedCompanyNames?.EN?.trim() || baseCompanyName;
    const koreanCompanyName =
      localizedCompanyNames?.KR?.trim() ||
      (country === "KR" ? localizedCompanyNames?.JP?.trim() || baseCompanyName : undefined);
    const japaneseCompanyName =
      localizedCompanyNames?.JP?.trim() ||
      (country === "JP" ? localizedCompanyNames?.KR?.trim() || baseCompanyName : undefined);
    return {
      id: String(row.company_id),
      name: englishCompanyName,
      nameKr: koreanCompanyName,
      nameJp: japaneseCompanyName,
      ticker,
      industryId,
      industryName: (row.industry_name as string) ?? industryNameById.get(row.industry_id as number) ?? "Unknown",
      industryNameEn: localizedNames?.EN,
      industryNameJp: localizedNames?.JP,
      country,
    };
  });

  const companies = marketCapLookup
    ? baseCompanies.map((company) => ({
        ...company,
        marketCap: marketCapLookup.byCompanyId.get(company.id) ?? marketCapLookup.fallbackMarketCap,
      }))
    : baseCompanies;

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

  for (const row of reportsRes.rows) {
    const companyId = String(row.company_id);
    const reportYear = row.report_year as number;
    const frameworks = frameworksByReportId.get(row.report_id as number) ?? [];
    const publicationDate = row.report_date
      ? new Date(row.report_date as string).toISOString().slice(0, 10)
      : null;

    if (!reports[companyId]) {
      reports[companyId] = [];
    }

    reports[companyId].push({
      reportYear,
      publicationDate: publicationDate ?? "",
      assuranceOrg: (row.assurance_org as string) ?? null,
      frameworks,
    });
  }

  for (const companyId of Object.keys(reports)) {
    reports[companyId].sort((a, b) => b.reportYear - a.reportYear);
  }

  const emissionsData: DashboardData["emissionsData"] = {};
  const emissionEvidence: Record<string, EvidenceItem[]> = {};
  const emissionAggregates = new Map<
    string,
    { companyId: string; year: number; s1: number; s2: number; s1s2: number; total: number }
  >();

  for (const row of emissionsRes.rows) {
    if (row.company_id === null || row.company_id === undefined) {
      continue;
    }
    const companyId = String(row.company_id);
    const yearValue = toNullableNumber(row.emission_year);
    if (yearValue === null) continue;
    const year = Math.trunc(yearValue);
    const scope = typeof row.scope === "string" ? row.scope.toUpperCase() : "";
    if (!["S1", "S2", "S1S2", "TOTAL"].includes(scope)) continue;
    const rawValue = toNullableNumber(row.emissions_value);
    if (rawValue === null) continue;
    const value = normalizeEmissionValue(rawValue, row.unit);
    if (value === null) continue;
    const key = `${companyId}:${year}`;
    if (!emissionAggregates.has(key)) {
      emissionAggregates.set(key, { companyId, year, s1: 0, s2: 0, s1s2: 0, total: 0 });
    }
    const aggregate = emissionAggregates.get(key)!;

    if (scope === "S1") aggregate.s1 += value;
    if (scope === "S2") aggregate.s2 += value;
    if (scope === "S1S2") aggregate.s1s2 += value;
    if (scope === "TOTAL") aggregate.total += value;

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

  for (const aggregate of emissionAggregates.values()) {
    const { companyId, year } = aggregate;
    let s1Emissions = aggregate.s1;
    let s2Emissions = aggregate.s2;
    let totalEmissions = aggregate.total > 0 ? aggregate.total : undefined;

    if (aggregate.s1s2 > 0) {
      if (s1Emissions === 0 && s2Emissions === 0) {
        s1Emissions = aggregate.s1s2;
        s2Emissions = 0;
      } else if (s1Emissions > 0 && s2Emissions === 0) {
        s2Emissions = Math.max(0, aggregate.s1s2 - s1Emissions);
      } else if (s2Emissions > 0 && s1Emissions === 0) {
        s1Emissions = Math.max(0, aggregate.s1s2 - s2Emissions);
      }
      if (totalEmissions === undefined) totalEmissions = aggregate.s1s2;
    }

    if (!emissionsData[companyId]) emissionsData[companyId] = [];
    const entry = {
      year,
      s1Emissions,
      s2Emissions,
      denomValue: 0,
      denomType: "revenue",
    } as EmissionData;
    if (totalEmissions !== undefined) {
      entry.totalEmissions = totalEmissions;
    }
    emissionsData[companyId].push(entry);
  }

  const denominatorEvidence: Record<string, EvidenceItem[]> = {};
  const selectedDenominatorByYear = new Map<
    string,
    { companyId: string; year: number; denomValue: number; denomType: string; priority: number; dataLevel: number }
  >();

  for (const row of denomRes.rows) {
    if (row.company_id === null || row.company_id === undefined) {
      continue;
    }
    const companyId = String(row.company_id);
    const yearValue = toNullableNumber(row.denom_year);
    if (yearValue === null) continue;
    const year = Math.trunc(yearValue);
    const denomValue = toNullableNumber(row.denom_value);
    const denomType = normalizeDenomType(row.denom_type);
    const priority = getDenomTypePriority(denomType);
    const dataLevel = toNullableNumber(row.data_level) ?? Number.POSITIVE_INFINITY;

    if (denomValue !== null && denomValue > 0) {
      const key = `${companyId}:${year}`;
      const existing = selectedDenominatorByYear.get(key);
      const shouldReplace =
        !existing ||
        priority > existing.priority ||
        (priority === existing.priority && dataLevel < existing.dataLevel);
      if (shouldReplace) {
        selectedDenominatorByYear.set(key, {
          companyId,
          year,
          denomValue,
          denomType,
          priority,
          dataLevel,
        });
      }
    }

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

  for (const selected of selectedDenominatorByYear.values()) {
    if (!emissionsData[selected.companyId]) emissionsData[selected.companyId] = [];
    let entry = emissionsData[selected.companyId].find((item) => item.year === selected.year);
    if (!entry) {
      entry = {
        year: selected.year,
        s1Emissions: 0,
        s2Emissions: 0,
        denomValue: 0,
        denomType: selected.denomType,
      };
      emissionsData[selected.companyId].push(entry);
    }

    entry.denomValue = selected.denomValue;
    entry.denomType = selected.denomType;
  }

  for (const companyId of Object.keys(emissionsData)) {
    emissionsData[companyId].sort((a, b) => b.year - a.year);
  }

  const targets: DashboardData["targets"] = {};
  const targetEvidence: Record<string, EvidenceItem[]> = {};

  for (const row of targetsRes.rows) {
    if (row.company_id === null || row.company_id === undefined) {
      continue;
    }
    const companyId = String(row.company_id);
    const scope = (row.scope as string) ?? "S1S2";
    const targetYearValue = toNullableNumber(row.target_year);
    if (targetYearValue === null) continue;
    const targetYear = Math.trunc(targetYearValue);
    const baselineYearValue = toNullableNumber(row.baseline_year);
    const baselineYear = baselineYearValue === null ? targetYear : Math.trunc(baselineYearValue);
    const targetReductionPct = toNullableNumber(row.target_reduction_pct);

    if (targetReductionPct !== null && (!targets[companyId] || targetYear > targets[companyId].targetYear)) {
      targets[companyId] = {
        scope,
        targetReductionPct,
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
    const companyIdFromObservation =
      row.company_id !== null && row.company_id !== undefined ? String(row.company_id) : null;
    const companyId =
      companyIdFromObservation ??
      (row.score_run_id !== null && row.score_run_id !== undefined
        ? scoreRunIdToCompanyId.get(row.score_run_id as number) ?? null
        : null);
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
      if (latest.denomValue > 0 && latest.denomType === "revenue") {
        const intensity = ((latest.s1Emissions + latest.s2Emissions) / latest.denomValue) * 1_000_000;
        if (Number.isFinite(intensity)) {
          intensityValues.push(intensity);
        }
      }
    }
    if (intensityValues.length > 0) {
      const totalIntensity = intensityValues.reduce((sum, value) => sum + value, 0);
      data.avgIntensity = Number((totalIntensity / intensityValues.length).toFixed(1));
    }
  }

  let responseData: DashboardData = {
    companies,
    scoreRuns,
    reports,
    emissionsData,
    targets,
    industryData,
    evidenceItems,
  };

  if (isMainScope) {
    const selectedCompanyId = effectiveSelectedCompanyId;
    const selectedCompany = selectedCompanyId ? companies.find((company) => company.id === selectedCompanyId) : undefined;
    const selectedIndustryId = selectedCompany?.industryId;

    responseData = {
      companies,
      scoreRuns: selectedCompanyId && scoreRuns[selectedCompanyId] ? { [selectedCompanyId]: scoreRuns[selectedCompanyId] } : {},
      reports: selectedCompanyId && reports[selectedCompanyId] ? { [selectedCompanyId]: reports[selectedCompanyId] } : {},
      emissionsData:
        selectedCompanyId && emissionsData[selectedCompanyId] ? { [selectedCompanyId]: emissionsData[selectedCompanyId] } : {},
      targets: selectedCompanyId && targets[selectedCompanyId] ? { [selectedCompanyId]: targets[selectedCompanyId] } : {},
      industryData:
        selectedIndustryId && industryData[selectedIndustryId] ? { [selectedIndustryId]: industryData[selectedIndustryId] } : {},
      evidenceItems: {},
    };
  }

  return {
    data: responseData,
    meta: isMainScope ? { selectedCompanyId: effectiveSelectedCompanyId } : undefined,
  };
}
