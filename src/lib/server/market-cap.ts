import "server-only";

import { spawn } from "child_process";
import { readFile, stat } from "fs/promises";
import path from "path";
import type { Company } from "@/data/mockData";

const DEFAULT_CACHE_TTL_MS = 1000 * 60 * 60 * 24;
const DEFAULT_LOOKUP_LIMIT = 10_000;
const DEFAULT_COMPANY_CODE_CSV_PATH = "DB_company_code.csv";
const DEFAULT_PYTHON_BIN = "python3";
const DEFAULT_PYTHON_SCRIPT_PATH = "scripts/market_cap_yfinance.py";
const DEFAULT_PYTHON_TIMEOUT_MS = 8_000;
const DEFAULT_ERROR_COOLDOWN_MS = 1000 * 60 * 5;

type Country = "KR" | "JP";

type CsvReference = {
  companyId: string;
  companyName: string | null;
  country: Country | null;
  code: string | null;
};

type CsvReferenceLookup = {
  version: string;
  byCompanyId: Map<string, CsvReference>;
  stats: {
    rows: number;
    missingCode: number;
    invalidCode: number;
  };
};

type MarketCapEnrichmentDiagnosticsStatus = "ok" | "skipped" | "error";

export type MarketCapEnrichmentDiagnostics = {
  source: "yfinance";
  status: MarketCapEnrichmentDiagnosticsStatus;
  reason: string | null;
  cacheHit: boolean;
  lookedUpCompanies: number;
  eligibleCompanies: number;
  symbolsRequested: number;
  symbolsResolved: number;
  companiesWithMarketCap: number;
  duplicateResolvedSymbols: number;
  csvRows: number;
  csvMissingCodeRows: number;
  csvInvalidCodeRows: number;
  missingYfinance: boolean;
  pythonCommand: string;
  pythonScriptPath: string;
  generatedAt: string;
};

type CacheEntry = {
  key: string;
  expiresAt: number;
  marketCapByCompanyId: Map<string, number>;
  symbolByCompanyId: Map<string, string>;
  diagnostics: MarketCapEnrichmentDiagnostics;
};

type PythonLookupResult = {
  marketCaps: Map<string, number>;
  missingYfinance: boolean;
  error: string | null;
  pythonCommand: string;
  scriptPath: string;
};

let cacheEntry: CacheEntry | null = null;
let csvReferenceCache:
  | {
      csvPath: string;
      mtimeMs: number;
      lookup: CsvReferenceLookup;
    }
  | null = null;
let latestDiagnostics: MarketCapEnrichmentDiagnostics = {
  source: "yfinance",
  status: "skipped",
  reason: "not-run-yet",
  cacheHit: false,
  lookedUpCompanies: 0,
  eligibleCompanies: 0,
  symbolsRequested: 0,
  symbolsResolved: 0,
  companiesWithMarketCap: 0,
  duplicateResolvedSymbols: 0,
  csvRows: 0,
  csvMissingCodeRows: 0,
  csvInvalidCodeRows: 0,
  missingYfinance: false,
  pythonCommand: DEFAULT_PYTHON_BIN,
  pythonScriptPath: DEFAULT_PYTHON_SCRIPT_PATH,
  generatedAt: new Date(0).toISOString(),
};
let lastHardFailureAt = 0;
let lastHardFailureReason: string | null = null;

function nowIsoString() {
  return new Date().toISOString();
}

function buildDiagnostics(
  input: Partial<MarketCapEnrichmentDiagnostics> &
    Pick<MarketCapEnrichmentDiagnostics, "status" | "reason" | "pythonCommand" | "pythonScriptPath">,
): MarketCapEnrichmentDiagnostics {
  return {
    source: "yfinance",
    cacheHit: false,
    lookedUpCompanies: 0,
    eligibleCompanies: 0,
    symbolsRequested: 0,
    symbolsResolved: 0,
    companiesWithMarketCap: 0,
    duplicateResolvedSymbols: 0,
    csvRows: 0,
    csvMissingCodeRows: 0,
    csvInvalidCodeRows: 0,
    missingYfinance: false,
    generatedAt: nowIsoString(),
    ...input,
  };
}

function normalizeCountry(country: string | undefined) {
  const value = (country || "").toUpperCase();
  return value === "KR" || value === "JP" ? value : null;
}

function normalizeTicker(value: string | undefined) {
  if (!value) return null;
  const normalized = value.trim().toUpperCase().replace(/\s+/g, "");
  return normalized || null;
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

function normalizeCsvCode(rawCode: string | null, country: Country | null) {
  if (!rawCode) return null;

  let normalized = rawCode.trim().toUpperCase();
  if (!normalized) return null;

  if (/^\d+(\.0+)?$/.test(normalized)) {
    normalized = normalized.replace(/\.0+$/, "");
  }

  normalized = normalized.replace(/\s+/g, "");
  if (!normalized) return null;

  if (country === "KR") {
    const digits = normalized.replace(/\D/g, "");
    if (!digits) return null;
    if (digits.length >= 6) return digits.slice(-6);
    return digits.padStart(6, "0");
  }

  if (country === "JP") {
    let code = normalized.replace(/[^0-9A-Z]/g, "");
    if (!code) return null;
    if (code.length === 5 && code.endsWith("0")) {
      code = code.slice(0, 4);
    }
    return code;
  }

  return normalized.replace(/[^0-9A-Z]/g, "") || null;
}

function inferSymbolFromTicker(ticker: string, country: Country | null) {
  const normalizedTicker = normalizeTicker(ticker);
  if (!normalizedTicker) return null;

  if (normalizedTicker.includes(".")) {
    return normalizedTicker;
  }

  if (country === "KR") {
    const digits = normalizedTicker.replace(/\D/g, "");
    if (!digits) return null;
    return `${digits.padStart(6, "0")}.KS`;
  }

  if (country === "JP") {
    const digits = normalizedTicker.replace(/\D/g, "");
    if (digits.length === 4) return `${digits}.T`;
  }

  return normalizedTicker;
}

function getKoreaAlternativeSymbol(symbol: string) {
  if (symbol.endsWith(".KS")) return `${symbol.slice(0, -3)}.KQ`;
  if (symbol.endsWith(".KQ")) return `${symbol.slice(0, -3)}.KS`;
  return null;
}

function buildCacheKey(companies: Company[], csvLookup: CsvReferenceLookup, lookupLimit: number) {
  const scoped = companies.slice(0, Math.min(lookupLimit, companies.length));
  const companyKey = scoped
    .map((company) => {
      const csvReference = csvLookup.byCompanyId.get(company.id);
      return [
        company.id,
        company.name,
        company.nameKr || "",
        company.nameJp || "",
        company.ticker || "",
        company.country || "",
        csvReference?.country || "",
        csvReference?.code || "",
      ].join("|");
    })
    .join("::");

  return `${lookupLimit}::${csvLookup.version}::${companyKey}`;
}

function getPythonCommand() {
  const configured = (process.env.MARKET_CAP_YFINANCE_PYTHON_BIN || DEFAULT_PYTHON_BIN).trim();
  return configured || DEFAULT_PYTHON_BIN;
}

function getPythonScriptPath() {
  const configured = (process.env.MARKET_CAP_YFINANCE_SCRIPT_PATH || DEFAULT_PYTHON_SCRIPT_PATH).trim();
  const scriptPath = configured || DEFAULT_PYTHON_SCRIPT_PATH;
  return path.resolve(process.cwd(), scriptPath);
}

function getPythonTimeoutMs() {
  const parsed = Number(process.env.MARKET_CAP_YFINANCE_TIMEOUT_MS ?? DEFAULT_PYTHON_TIMEOUT_MS);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_PYTHON_TIMEOUT_MS;
  return Math.max(1_000, Math.trunc(parsed));
}

function getErrorCooldownMs() {
  const parsed = Number(process.env.MARKET_CAP_ERROR_COOLDOWN_MS ?? DEFAULT_ERROR_COOLDOWN_MS);
  if (!Number.isFinite(parsed) || parsed < 0) return DEFAULT_ERROR_COOLDOWN_MS;
  return Math.trunc(parsed);
}

function isHardFailureReason(reason: string | null) {
  if (!reason) return false;

  return (
    reason === "yfinance-not-installed" ||
    reason.includes("network_or_dns_failure") ||
    reason.includes("failed-to-spawn") ||
    reason.includes("python-timeout") ||
    reason.includes("python-process-error") ||
    reason.includes("python-empty-output") ||
    reason.includes("python-invalid-json-output")
  );
}

async function loadCsvReferenceLookup(): Promise<CsvReferenceLookup> {
  const csvPath = (process.env.COMPANY_CODE_CSV_PATH || DEFAULT_COMPANY_CODE_CSV_PATH).trim();
  const absolutePath = path.resolve(process.cwd(), csvPath);

  try {
    const stats = await stat(absolutePath);
    if (csvReferenceCache && csvReferenceCache.csvPath === absolutePath && csvReferenceCache.mtimeMs === stats.mtimeMs) {
      return csvReferenceCache.lookup;
    }

    const rawCsv = await readFile(absolutePath, "utf8");
    const lines = rawCsv.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length === 0) {
      const emptyLookup: CsvReferenceLookup = {
        version: `${absolutePath}:${stats.mtimeMs}:empty`,
        byCompanyId: new Map(),
        stats: {
          rows: 0,
          missingCode: 0,
          invalidCode: 0,
        },
      };
      csvReferenceCache = { csvPath: absolutePath, mtimeMs: stats.mtimeMs, lookup: emptyLookup };
      return emptyLookup;
    }

    const headers = parseCsvLine(lines[0]).map((header) => header.replace(/^\uFEFF/, ""));
    const companyIdIndex = headers.findIndex((header) => header === "company_id");
    const companyNameIndex = headers.findIndex((header) => header === "company_name");
    const countryIndex = headers.findIndex((header) => header === "country");
    const codeIndex = headers.findIndex((header) => header === "code");
    const code6Index = headers.findIndex((header) => header === "code6_re");
    const byCompanyId = new Map<string, CsvReference>();

    if (companyIdIndex === -1 || (codeIndex === -1 && code6Index === -1)) {
      const fallbackLookup: CsvReferenceLookup = {
        version: `${absolutePath}:${stats.mtimeMs}:invalid-header`,
        byCompanyId,
        stats: {
          rows: Math.max(0, lines.length - 1),
          missingCode: Math.max(0, lines.length - 1),
          invalidCode: 0,
        },
      };
      csvReferenceCache = { csvPath: absolutePath, mtimeMs: stats.mtimeMs, lookup: fallbackLookup };
      return fallbackLookup;
    }

    let missingCode = 0;
    let invalidCode = 0;

    for (let i = 1; i < lines.length; i += 1) {
      const fields = parseCsvLine(lines[i]);
      const companyId = fields[companyIdIndex]?.trim();
      if (!companyId) continue;
      if (byCompanyId.has(companyId)) continue;

      const rawCountry = fields[countryIndex]?.trim();
      const country = normalizeCountry(rawCountry);
      const rawCodePrimary = codeIndex >= 0 ? fields[codeIndex]?.trim() : "";
      const rawCodeFallback = code6Index >= 0 ? fields[code6Index]?.trim() : "";
      const rawCode = rawCodePrimary || rawCodeFallback || null;
      const code = normalizeCsvCode(rawCode, country);
      const companyName = fields[companyNameIndex]?.trim() || null;

      if (!rawCode) {
        missingCode += 1;
      } else if (!code) {
        invalidCode += 1;
      }

      byCompanyId.set(companyId, { companyId, companyName, country, code });
    }

    const lookup: CsvReferenceLookup = {
      version: `${absolutePath}:${stats.mtimeMs}`,
      byCompanyId,
      stats: {
        rows: Math.max(0, lines.length - 1),
        missingCode,
        invalidCode,
      },
    };
    csvReferenceCache = { csvPath: absolutePath, mtimeMs: stats.mtimeMs, lookup };
    return lookup;
  } catch {
    return {
      version: `missing:${absolutePath}`,
      byCompanyId: new Map(),
      stats: {
        rows: 0,
        missingCode: 0,
        invalidCode: 0,
      },
    };
  }
}

function toPositiveNumber(value: unknown) {
  if (typeof value !== "number") return null;
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

async function fetchMarketCapsBySymbols(symbols: string[]): Promise<PythonLookupResult> {
  const pythonCommand = getPythonCommand();
  const scriptPath = getPythonScriptPath();
  const timeoutMs = getPythonTimeoutMs();

  if (symbols.length === 0) {
    return {
      marketCaps: new Map(),
      missingYfinance: false,
      error: null,
      pythonCommand,
      scriptPath,
    };
  }

  return new Promise((resolve) => {
    const marketCaps = new Map<string, number>();

    let stdout = "";
    let stderr = "";
    let settled = false;

    const finalize = (result: PythonLookupResult) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    let child: ReturnType<typeof spawn>;

    try {
      child = spawn(pythonCommand, [scriptPath], {
        stdio: ["pipe", "pipe", "pipe"],
      });
    } catch {
      finalize({
        marketCaps,
        missingYfinance: false,
        error: `failed-to-spawn:${pythonCommand}`,
        pythonCommand,
        scriptPath,
      });
      return;
    }

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      finalize({
        marketCaps,
        missingYfinance: false,
        error: `python-timeout:${timeoutMs}ms`,
        pythonCommand,
        scriptPath,
      });
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", () => {
      clearTimeout(timer);
      finalize({
        marketCaps,
        missingYfinance: false,
        error: `python-process-error:${pythonCommand}`,
        pythonCommand,
        scriptPath,
      });
    });

    child.on("close", () => {
      clearTimeout(timer);

      const trimmed = stdout.trim();
      if (!trimmed) {
        const stderrMessage = stderr.trim();
        finalize({
          marketCaps,
          missingYfinance: false,
          error: stderrMessage ? `python-empty-output:${stderrMessage}` : "python-empty-output",
          pythonCommand,
          scriptPath,
        });
        return;
      }

      let payload: unknown;
      try {
        payload = JSON.parse(trimmed);
      } catch {
        finalize({
          marketCaps,
          missingYfinance: false,
          error: "python-invalid-json-output",
          pythonCommand,
          scriptPath,
        });
        return;
      }

      const response = payload as {
        missingYfinance?: unknown;
        error?: unknown;
        results?: Record<string, unknown>;
      };

      if (response.results && typeof response.results === "object") {
        for (const [symbol, value] of Object.entries(response.results)) {
          const normalizedSymbol = normalizeTicker(symbol);
          const normalizedCap = toPositiveNumber(value);
          if (!normalizedSymbol || normalizedCap === null) continue;
          marketCaps.set(normalizedSymbol, normalizedCap);
        }
      }

      const missingYfinance = response.missingYfinance === true;
      const error = typeof response.error === "string" && response.error.trim().length > 0 ? response.error.trim() : null;

      finalize({
        marketCaps,
        missingYfinance,
        error,
        pythonCommand,
        scriptPath,
      });
    });

    const payload = JSON.stringify({ symbols });
    child.stdin.write(payload);
    child.stdin.end();
  });
}

function buildCompanyWithMarketCap(
  companies: Company[],
  marketCapByCompanyId: Map<string, number>,
  symbolByCompanyId: Map<string, string>,
) {
  return companies.map((company) => {
    const marketCap = marketCapByCompanyId.get(company.id);
    if (!marketCap) return company;

    const resolvedSymbol = symbolByCompanyId.get(company.id);
    return {
      ...company,
      marketCap,
      ticker: company.ticker || resolvedSymbol,
    };
  });
}

export function getMarketCapEnrichmentDiagnostics() {
  return latestDiagnostics;
}

export async function enrichCompaniesWithMarketCap(companies: Company[]) {
  const pythonCommand = getPythonCommand();
  const pythonScriptPath = getPythonScriptPath();
  const errorCooldownMs = getErrorCooldownMs();

  if (companies.length === 0) {
    latestDiagnostics = buildDiagnostics({
      status: "skipped",
      reason: "no-companies",
      pythonCommand,
      pythonScriptPath,
    });
    return companies;
  }

  if (process.env.MARKET_CAP_ENRICHMENT === "false") {
    latestDiagnostics = buildDiagnostics({
      status: "skipped",
      reason: "disabled-by-MARKET_CAP_ENRICHMENT=false",
      pythonCommand,
      pythonScriptPath,
    });
    return companies;
  }

  if (lastHardFailureAt > 0 && Date.now() - lastHardFailureAt < errorCooldownMs) {
    latestDiagnostics = buildDiagnostics({
      status: "skipped",
      reason: `cooldown-after-error:${lastHardFailureReason || "unknown"}`,
      pythonCommand,
      pythonScriptPath,
    });
    return companies;
  }

  try {
    const csvLookup = await loadCsvReferenceLookup();
    const cacheTtlMs = Math.max(0, Number(process.env.MARKET_CAP_CACHE_TTL_MS ?? DEFAULT_CACHE_TTL_MS) || DEFAULT_CACHE_TTL_MS);
    const lookupLimit = Math.max(1, Number(process.env.MARKET_CAP_LOOKUP_LIMIT ?? DEFAULT_LOOKUP_LIMIT) || DEFAULT_LOOKUP_LIMIT);
    const cacheKey = buildCacheKey(companies, csvLookup, lookupLimit);

    if (cacheEntry && cacheEntry.key === cacheKey && cacheEntry.expiresAt > Date.now()) {
      latestDiagnostics = {
        ...cacheEntry.diagnostics,
        cacheHit: true,
        generatedAt: nowIsoString(),
      };
      return buildCompanyWithMarketCap(companies, cacheEntry.marketCapByCompanyId, cacheEntry.symbolByCompanyId);
    }

    const lookupCandidates = companies.slice(0, Math.min(lookupLimit, companies.length));
    const symbolByCompanyId = new Map<string, string>();
    const countryByCompanyId = new Map<string, Country | null>();
    let eligibleCompanies = 0;

    for (const company of lookupCandidates) {
      const csvReference = csvLookup.byCompanyId.get(company.id);
      const country = csvReference?.country ?? normalizeCountry(company.country);
      countryByCompanyId.set(company.id, country);
      if (!country) continue;

      eligibleCompanies += 1;

      const candidateTickers = [csvReference?.code, normalizeTicker(company.ticker)].filter(
        (value): value is string => Boolean(value),
      );

      for (const candidateTicker of candidateTickers) {
        const inferredSymbol = inferSymbolFromTicker(candidateTicker, country);
        if (!inferredSymbol) continue;
        symbolByCompanyId.set(company.id, inferredSymbol);
        break;
      }
    }

    const primarySymbols = Array.from(new Set(symbolByCompanyId.values()));
    const symbolUsage = new Map<string, number>();
    for (const symbol of symbolByCompanyId.values()) {
      symbolUsage.set(symbol, (symbolUsage.get(symbol) || 0) + 1);
    }
    const duplicateResolvedSymbols = Array.from(symbolUsage.values()).filter((count) => count > 1).length;
    const primaryLookup = await fetchMarketCapsBySymbols(primarySymbols);

    const marketCapByCompanyId = new Map<string, number>();
    for (const [companyId, symbol] of symbolByCompanyId.entries()) {
      const marketCap = primaryLookup.marketCaps.get(symbol);
      if (!marketCap) continue;
      marketCapByCompanyId.set(companyId, marketCap);
    }

    const fallbackSymbolByCompanyId = new Map<string, string>();
    let fallbackSymbols: string[] = [];
    let fallbackLookup: PythonLookupResult = {
      marketCaps: new Map(),
      missingYfinance: false,
      error: null,
      pythonCommand: primaryLookup.pythonCommand,
      scriptPath: primaryLookup.scriptPath,
    };

    // Skip fallback lookup when the primary batch already failed hard.
    if (!primaryLookup.error && !primaryLookup.missingYfinance) {
      for (const company of lookupCandidates) {
        if (marketCapByCompanyId.has(company.id)) continue;
        if (countryByCompanyId.get(company.id) !== "KR") continue;

        const symbol = symbolByCompanyId.get(company.id);
        if (!symbol) continue;

        const fallbackSymbol = getKoreaAlternativeSymbol(symbol);
        if (!fallbackSymbol) continue;
        fallbackSymbolByCompanyId.set(company.id, fallbackSymbol);
      }

      fallbackSymbols = Array.from(new Set(fallbackSymbolByCompanyId.values()));
      fallbackLookup = await fetchMarketCapsBySymbols(fallbackSymbols);

      for (const [companyId, fallbackSymbol] of fallbackSymbolByCompanyId.entries()) {
        const marketCap = fallbackLookup.marketCaps.get(fallbackSymbol);
        if (!marketCap) continue;
        marketCapByCompanyId.set(companyId, marketCap);
        symbolByCompanyId.set(companyId, fallbackSymbol);
      }
    }

    const missingYfinance = primaryLookup.missingYfinance || fallbackLookup.missingYfinance;
    const errorMessages = [primaryLookup.error, fallbackLookup.error].filter(
      (value): value is string => Boolean(value && value.trim().length > 0),
    );

    let status: MarketCapEnrichmentDiagnosticsStatus = "ok";
    let reason: string | null = null;

    if (missingYfinance) {
      status = "error";
      reason = "yfinance-not-installed";
    } else if (errorMessages.length > 0) {
      status = "error";
      reason = errorMessages.join("; ");
    } else if (primarySymbols.length === 0) {
      status = "skipped";
      reason = "no-eligible-symbols";
    }

    const diagnostics: MarketCapEnrichmentDiagnostics = {
      source: "yfinance",
      status,
      reason,
      cacheHit: false,
      lookedUpCompanies: lookupCandidates.length,
      eligibleCompanies,
      symbolsRequested: primarySymbols.length + fallbackSymbols.length,
      symbolsResolved: primaryLookup.marketCaps.size + fallbackLookup.marketCaps.size,
      companiesWithMarketCap: marketCapByCompanyId.size,
      duplicateResolvedSymbols,
      csvRows: csvLookup.stats.rows,
      csvMissingCodeRows: csvLookup.stats.missingCode,
      csvInvalidCodeRows: csvLookup.stats.invalidCode,
      missingYfinance,
      pythonCommand: primaryLookup.pythonCommand,
      pythonScriptPath: primaryLookup.scriptPath,
      generatedAt: nowIsoString(),
    };

    if (status !== "error") {
      cacheEntry = {
        key: cacheKey,
        expiresAt: Date.now() + cacheTtlMs,
        marketCapByCompanyId,
        symbolByCompanyId,
        diagnostics,
      };
      lastHardFailureAt = 0;
      lastHardFailureReason = null;
    } else {
      cacheEntry = null;
      if (isHardFailureReason(reason)) {
        lastHardFailureAt = Date.now();
        lastHardFailureReason = reason;
      }
    }

    latestDiagnostics = diagnostics;
    return buildCompanyWithMarketCap(companies, marketCapByCompanyId, symbolByCompanyId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown-enrichment-error";
    latestDiagnostics = buildDiagnostics({
      status: "error",
      reason: message,
      pythonCommand,
      pythonScriptPath,
    });
    return companies;
  }
}

export const __testing__ = {
  normalizeCsvCode,
  inferSymbolFromTicker,
  parseCsvLine,
};
