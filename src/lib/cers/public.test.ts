import { describe, expect, it } from "vitest";
import {
  buildCompanyInterpretation,
  deriveCalculationStatus,
  getLocalizedSectorName,
  getPublicCategoryLabel,
} from "./public";
import type { CersCompanyProfile } from "./types";

describe("public CERs presentation contract", () => {
  it.each([
    ["en", ["Realized Decarbonization", "Target Design & Delivery", "Capital Allocation", "Data Credibility"]],
    ["ko", ["실질 탈탄소 성과", "감축 목표 및 이행", "자본배분", "데이터 신뢰성"]],
    ["zh", ["实际脱碳表现", "目标设计与执行", "资本配置", "数据可信度"]],
    ["ja", ["実質的な脱炭素成果", "削減目標と履行", "資本配分", "データ信頼性"]],
    ["vi", ["Khử carbon thực tế", "Thiết kế và thực hiện mục tiêu", "Phân bổ vốn", "Độ tin cậy dữ liệu"]],
    ["ru", ["Фактическая декарбонизация", "Цели и их выполнение", "Распределение капитала", "Надёжность данных"]],
    ["id", ["Dekarbonisasi terealisasi", "Desain dan pelaksanaan target", "Alokasi modal", "Kredibilitas data"]],
    ["th", ["การลดคาร์บอนที่เกิดขึ้นจริง", "การออกแบบและดำเนินการตามเป้าหมาย", "การจัดสรรเงินทุน", "ความน่าเชื่อถือของข้อมูล"]],
    ["bn", ["বাস্তব ডিকার্বনাইজেশন", "লক্ষ্য নকশা ও বাস্তবায়ন", "মূলধন বণ্টন", "ডেটার বিশ্বাসযোগ্যতা"]],
    ["es", ["Descarbonización realizada", "Diseño y ejecución de objetivos", "Asignación de capital", "Credibilidad de los datos"]],
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

  it.each([
    ["ko", "제조업"],
    ["en", "Manufacturing"],
    ["ja", "製造業"],
    ["zh", "Manufacturing"],
    ["vi", "Manufacturing"],
    ["ru", "Manufacturing"],
    ["id", "Manufacturing"],
    ["th", "Manufacturing"],
    ["bn", "Manufacturing"],
    ["es", "Manufacturing"],
  ] as const)("selects the database sector name for %s", (locale, expected) => {
    expect(
      getLocalizedSectorName(
        { ko: "제조업", en: "Manufacturing", ja: "製造業" },
        locale,
      ),
    ).toBe(expected);
  });

  it("falls back to English when a supported database translation is missing", () => {
    expect(getLocalizedSectorName({ en: "Manufacturing" }, "ko")).toBe("Manufacturing");
    expect(getLocalizedSectorName(null, "en")).toBeNull();
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
