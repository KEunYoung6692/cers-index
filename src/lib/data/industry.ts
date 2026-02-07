import type { Company } from "@/data/mockData";
import type { Language } from "@/lib/i18n";

export function getLocalizedIndustryName(
  company: Company | undefined,
  language: Language,
  fallback = "Unknown",
) {
  if (!company) return fallback;

  if (language === "EN") {
    return company.industryNameEn?.trim() || company.industryName || fallback;
  }

  if (language === "JP") {
    return company.industryNameJp?.trim() || company.industryName || company.industryNameEn?.trim() || fallback;
  }

  return company.industryName || fallback;
}
