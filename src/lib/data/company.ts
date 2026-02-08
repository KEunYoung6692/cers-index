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
