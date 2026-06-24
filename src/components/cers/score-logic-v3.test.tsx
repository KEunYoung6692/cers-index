import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { getTranslations, type SupportedLocale } from "@/lib/cers/i18n";
import ScoreLogicV3 from "./score-logic-v3";

const LOCALES: SupportedLocale[] = ["en", "ko", "ja"];

const VARIABLE_TITLES: Record<SupportedLocale, string[]> = {
  en: [
    "V1. Scope 1·2 emissions performance",
    "V2. Scope 3 emissions performance",
    "W1. Target design completeness",
    "W2. On-track performance",
    "C1. Green capex share",
    "C2. Low-carbon revenue share",
    "C3. Internal carbon price operation",
    "C4. Climate governance & pay alignment",
    "A1. Third-party validation & assurance",
    "A2. Inventory completeness",
    "A3. Methodology transparency",
    "A4. Disclosure framework alignment",
  ],
  ko: [
    "V1. Scope 1·2 배출성과",
    "V2. Scope 3 배출성과",
    "W1. 감축목표 설계 수준",
    "W2. 목표 이행 진척도",
    "C1. 녹색 CAPEX 비중",
    "C2. 저탄소 매출 비중",
    "C3. 내부탄소가격 운영 수준",
    "C4. 기후 거버넌스·보상 정렬",
    "A1. 제3자 검증·보증",
    "A2. 인벤토리 완전성",
    "A3. 산정 방법론 투명성",
    "A4. 기후 공시 체계 정합성",
  ],
  ja: [
    "V1. Scope 1・2 排出実績",
    "V2. Scope 3 排出実績",
    "W1. 削減目標の設計水準",
    "W2. 目標履行進捗度",
    "C1. グリーン CAPEX 比率",
    "C2. 低炭素売上比率",
    "C3. 内部炭素価格の運営水準",
    "C4. 気候ガバナンス・報酬整合",
    "A1. 第三者検証・保証",
    "A2. インベントリ完全性",
    "A3. 算定方法論の透明性",
    "A4. 気候開示体系の整合性",
  ],
};

afterEach(cleanup);

describe("CERs methodology pages", () => {
  it.each(LOCALES)("keeps the %s overview on the v1.5 aggregation contract", (locale) => {
    const about = getTranslations(locale).about;

    expect(about.formulaSteps.map((step) => step.id)).toEqual(["kpi", "index"]);
    expect(about.dimensions).toHaveLength(4);
    expect(JSON.stringify(about)).not.toMatch(/V1-V9|V1~V9|V1 から V9|v0\.3|K_P2|W_v,g|1 \+ 99/);
  });

  it.each(LOCALES)("renders all 12 methodology variables in %s", (locale) => {
    const { container } = render(<ScoreLogicV3 locale={locale} />);
    const text = container.textContent ?? "";

    for (const title of VARIABLE_TITLES[locale]) {
      expect(text).toContain(title);
    }
  });
});
