import { describe, expect, it } from "vitest";
import {
  buildCompanyInterpretation,
  deriveCalculationStatus,
  getPublicCategoryLabel,
} from "./public";
import type { CersCompanyProfile } from "./types";

describe("public CERs presentation contract", () => {
  it.each([
    ["en", ["Realized Decarbonization", "Target Design & Delivery", "Capital Allocation", "Data Credibility"]],
    ["ko", ["실질 탈탄소 성과", "감축 목표 및 이행", "자본배분", "데이터 신뢰성"]],
    ["ja", ["実質的な脱炭素成果", "削減目標と履行", "資本配分", "データ信頼性"]],
  ] as const)("uses the v1.5 KPI labels in %s", (locale, labels) => {
    expect(labels.map((_, index) => getPublicCategoryLabel(`cat${index + 1}`, null, index, locale))).toEqual(labels);
  });

  it("separates scored, pending, and not-scored companies", () => {
    expect(
      deriveCalculationStatus({
        overallScore: 72,
        scorePeriodId: 1,
        scoreFiscalYear: 2025,
      } as CersCompanyProfile),
    ).toBe("scored");
    expect(
      deriveCalculationStatus({
        overallScore: null,
        scorePeriodId: 1,
        scoreFiscalYear: 2025,
      } as CersCompanyProfile),
    ).toBe("pending");
    expect(
      deriveCalculationStatus({
        overallScore: null,
        scorePeriodId: null,
        scoreFiscalYear: null,
      } as CersCompanyProfile),
    ).toBe("not_scored");
  });

  it("describes public facts without assigning an arbitrary performance band", () => {
    const copy = buildCompanyInterpretation(
      74.2,
      {
        targetSummary: { targetYear: 2030 },
        disclosure: { hasThirdPartyAssurance: true },
      } as CersCompanyProfile,
      "en",
    );

    expect(copy).toContain("74.2");
    expect(copy).toContain("2030");
    expect(copy).not.toMatch(/leading|strong performance|moderate performance|early transition/i);
  });
});
