import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { getTranslations, type SupportedLocale } from "@/lib/cers/i18n";
import ScoreLogicV3 from "./score-logic-v3";

const LOCALES: SupportedLocale[] = ["en", "ko", "ja"];

const VARIABLE_TITLES: Record<SupportedLocale, string[]> = {
  en: [
    "V1. Scope 1·2 emissions performance",
    "V2. Scope 3 emissions performance",
    "V3. Renewable electricity share",
    "W1. Target ambition",
    "W2. Target coverage",
    "W3. On-track performance",
    "W4. Third-party target validation",
    "C1. Green capex share",
    "C2. Low-carbon revenue share",
    "C3. Internal carbon price level",
    "C4. Climate governance & pay alignment",
    "A1. Third-party assurance level",
    "A2. Inventory completeness",
    "A3. Methodology transparency",
    "A4. Time-series consistency",
    "A5. Disclosure framework alignment",
  ],
  ko: [
    "V1. Scope 1·2 배출성과",
    "V2. Scope 3 배출성과",
    "V3. 재생에너지 전환율",
    "W1. 목표 야심도",
    "W2. 목표 커버리지",
    "W3. 목표 이행 진척도",
    "W4. 목표의 제3자 검증",
    "C1. 녹색 CAPEX 비중",
    "C2. 저탄소 매출 비중",
    "C3. 내부탄소가격 수준",
    "C4. 기후 거버넌스·보상 정렬",
    "A1. 제3자 검증 수준",
    "A2. 인벤토리 완전성",
    "A3. 산정 방법론 투명성",
    "A4. 시계열 일관성",
    "A5. 기후 공시 체계 정합성",
  ],
  ja: [
    "V1. Scope 1・2 排出実績",
    "V2. Scope 3 排出実績",
    "V3. 再生可能エネルギー転換率",
    "W1. 目標野心度",
    "W2. 目標カバレッジ",
    "W3. 目標履行進捗度",
    "W4. 目標の第三者検証",
    "C1. グリーン CAPEX 比率",
    "C2. 低炭素売上比率",
    "C3. 内部炭素価格水準",
    "C4. 気候ガバナンス・報酬整合",
    "A1. 第三者保証水準",
    "A2. インベントリ完全性",
    "A3. 算定方法論の透明性",
    "A4. 時系列の一貫性",
    "A5. 気候開示体系の整合性",
  ],
};

afterEach(cleanup);

describe("CERs methodology pages", () => {
  it.each(LOCALES)("keeps the %s overview on the v1.4 aggregation contract", (locale) => {
    const about = getTranslations(locale).about;

    expect(about.formulaSteps.map((step) => step.id)).toEqual(["kpi", "index"]);
    expect(about.dimensions).toHaveLength(4);
    expect(JSON.stringify(about)).not.toMatch(/V1-V9|V1~V9|V1 から V9|v0\.3|K_P2|W_v,g|1 \+ 99/);
  });

  it.each(LOCALES)("renders all 16 methodology variables in %s", (locale) => {
    const { container } = render(<ScoreLogicV3 locale={locale} />);
    const text = container.textContent ?? "";

    for (const title of VARIABLE_TITLES[locale]) {
      expect(text).toContain(title);
    }
  });
});
