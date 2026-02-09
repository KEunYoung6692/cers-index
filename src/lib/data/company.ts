import type { Company } from "@/data/mockData";

export function getDisplayCompanyName(company: Company | undefined, fallback = "Unknown") {
  if (!company) return fallback;

  const englishName = company.name?.trim() || fallback;
  const country = company.country?.toUpperCase();
  const localName =
    country === "KR"
      ? company.nameKr?.trim()
      : country === "JP"
        ? company.nameJp?.trim()
        : undefined;

  if (localName) {
    return `${englishName}(${localName})`;
  }

  return englishName;
}

export function getCompanySearchText(company: Company | undefined) {
  if (!company) return "";

  const candidates = [company.name, company.nameKr, company.nameJp]
    .map((name) => name?.trim())
    .filter((name): name is string => Boolean(name));

  return Array.from(new Set(candidates)).join(" ");
}

function toValidMarketCap(value: number | undefined) {
  if (typeof value !== "number") return null;
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

export function compareCompaniesByMarketCapDesc(a: Company, b: Company) {
  const marketCapA = toValidMarketCap(a.marketCap);
  const marketCapB = toValidMarketCap(b.marketCap);

  if (marketCapA !== null && marketCapB !== null && marketCapA !== marketCapB) {
    return marketCapB - marketCapA;
  }
  if (marketCapA !== null && marketCapB === null) return -1;
  if (marketCapA === null && marketCapB !== null) return 1;

  const nameA = a.name?.trim() || "";
  const nameB = b.name?.trim() || "";
  return nameA.localeCompare(nameB, "en", { sensitivity: "base" });
}
