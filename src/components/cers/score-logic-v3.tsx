import type { ReactNode } from "react";
import type { SupportedLocale } from "@/lib/cers/i18n";

const VARIABLE_ORDER = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9"] as const;
const CORE_FORMULA_ORDER = ["adjusted", "total", "index"] as const;

type VariableId = (typeof VARIABLE_ORDER)[number];
type CoreFormulaId = (typeof CORE_FORMULA_ORDER)[number];

type VariableCopy = {
  title: string;
  description: string;
  bullets: string[];
};

type LogicCopy = {
  heroTitle: string;
  heroDescription: string;
  equationsTitle: string;
  equationsDescription: string;
  equationTitles: Record<CoreFormulaId, string>;
  definitionsTitle: string;
  definitions: Array<{ key: string; label: string }>;
  flowTitle: string;
  flowSteps: Array<{ title: string; description: string }>;
  rulesTitle: string;
  rules: Array<{ title: string; bullets: string[] }>;
  variablesTitle: string;
  variablesDescription: string;
  variables: Record<VariableId, VariableCopy>;
  weightingTitle: string;
  weightingDescription: string;
  weightingBullets: string[];
  p2Title: string;
  p2Description: string;
  p2Rows: Array<{ caseLabel: string; factor: string; appliesTo: string }>;
  outputsTitle: string;
  outputsDescription: string;
  outputs: Array<{ name: string; description: string }>;
};

const CORE_FORMULAS: Record<CoreFormulaId, ReactNode[]> = {
  adjusted: [<>S<sub>adjusted,v</sub> = S<sub>v</sub> × K<sub>P2,v</sub></>],
  total: [<>S<sub>total</sub>(i, t) = Σ<sub>v</sub> W<sub>v,g(i)</sub> × S<sub>adjusted</sub>(v, i, t)</>],
  index: [<>CERs Index(i, t) = 1 + 99 × clamp(S<sub>total</sub>(i, t), 0, 1)</>],
};

const VARIABLE_FORMULAS: Record<VariableId, ReactNode[]> = {
  v1: [
    <>E<sub>12,t</sub> = E<sub>1,t</sub> + E<sub>2,t</sub></>,
    <>I<sub>t</sub> = E<sub>12,t</sub> / D<sub>t</sub></>,
    <>r<sub>I,t</sub> = 1 - (I<sub>t</sub> / I<sub>t-3</sub>)<sup>1/3</sup></>,
    <>S<sub>intensity</sub> = clamp(r<sub>I,t</sub> / 0.042, 0, 1)</>,
    <>S<sub>V1</sub> = S<sub>intensity</sub> × S<sub>absolute</sub></>,
  ],
  v2: [<>S<sub>V2</sub> = Σ<sub>k</sub> (M<sub>g,k</sub> × Q<sub>i,t,k</sub>) / Σ<sub>k</sub> M<sub>g,k</sub></>],
  v3: [
    <>S<sub>V3</sub> = geometric_mean(</>,
    <>B<sub>base_year</sub>, B<sub>target_year</sub>, B<sub>reduction_rate</sub>, B<sub>scope_coverage</sub>,</>,
    <>B<sub>target_type</sub>, B<sub>near_mid_term</sub>, B<sub>gross_net_separation</sub>, B<sub>credit_transparency</sub></>,
    <>)</>,
  ],
  v4: [
    <>E<sub>target</sub> = E<sub>base</sub> × (1 - R<sub>target</sub>)</>,
    <>E<sub>path,t</sub> = E<sub>base</sub> - (E<sub>base</sub> - E<sub>target</sub>) × ((Y<sub>t</sub> - Y<sub>base</sub>) / (Y<sub>target</sub> - Y<sub>base</sub>))</>,
    <>S<sub>progress</sub> = clamp((E<sub>base</sub> - E<sub>t</sub>) / (E<sub>base</sub> - E<sub>path,t</sub>), 0, 1)</>,
    <>S<sub>V4</sub> = S<sub>progress</sub> × B<sub>reduction_initiatives</sub></>,
  ],
  v5: [
    <>S<sub>V5</sub> = arithmetic_mean(</>,
    <>B<sub>physical_risk</sub>, B<sub>transition_risk</sub>, B<sub>opportunity</sub>, B<sub>time_horizon</sub>,</>,
    <>B<sub>financial_impact</sub>, B<sub>transition_levers</sub>, B<sub>progress</sub></>,
    <>)</>,
  ],
  v6: [
    <>S<sub>V6</sub> = geometric_mean(</>,
    <>B<sub>board_oversight</sub>, B<sub>management_responsibility</sub>, B<sub>climate_kpi</sub>,</>,
    <>B<sub>compensation_link</sub>, B<sub>board_or_compensation_committee_evidence</sub></>,
    <>)</>,
  ],
  v7: [
    <>S<sub>V7</sub> =</>,
    <>S<sub>transition_capex</sub></>,
    <>× S<sub>financial_traceability</sub></>,
    <>× S<sub>brown_capex_control</sub></>,
  ],
  v8: [
    <>S<sub>V8</sub> = geometric_mean(</>,
    <>B<sub>organizational_boundary</sub>, B<sub>operational_boundary</sub>, B<sub>financial_boundary_alignment</sub>,</>,
    <>B<sub>calculation_standard</sub>, B<sub>emission_factor</sub>, B<sub>scope2_method</sub>, B<sub>restatement_disclosure</sub></>,
    <>)</>,
  ],
  v9: [
    <>S<sub>V9</sub> =</>,
    <>S<sub>assurance_existence</sub></>,
    <>× S<sub>assurance_quality</sub></>,
    <>× S<sub>scope_coverage</sub></>,
    <>S<sub>scope_coverage</sub> = 0.4 × A<sub>scope1</sub> + 0.4 × A<sub>scope2</sub> + 0.2 × A<sub>scope3_material</sub></>,
  ],
};

const WEIGHTING_FORMULAS: ReactNode[] = [
  <>RawWeight<sub>v,g</sub> = Σ<sub>q</sub> [ mapping_strength<sub>q,v</sub> × (management_denominator<sub>q,g</sub> + leadership_denominator<sub>q,g</sub>) ]</>,
  <>W<sub>v,g</sub> = RawWeight<sub>v,g</sub> / Σ<sub>v</sub> RawWeight<sub>v,g</sub></>,
];

const ENGLISH_COPY: LogicCopy = {
  heroTitle: "Score Logic Reference",
  heroDescription:
    "CERs Index is a public-data-based climate transition reliability index aligned to CDP. This page shows how its variables, weights, and public score conversion work.",
  equationsTitle: "Core equations",
  equationsDescription:
    "Every company first receives raw variable scores on a 0-1 scale, then reliability-adjusted scores, then an industry-weighted internal total, and finally the public CERs Index.",
  equationTitles: {
    adjusted: "1. Reliability-adjusted variable score",
    total: "2. Weighted internal score",
    index: "3. Public CERs Index",
  },
  definitionsTitle: "What the symbols mean",
  definitions: [
    { key: "i", label: "Company" },
    { key: "t", label: "Fiscal year" },
    { key: "v", label: "Variable ID from V1 to V9" },
    { key: "g(i)", label: "CERs industry group assigned to company i" },
    { key: "S_v", label: "Raw variable score on a 0-1 scale" },
    { key: "S_adjusted_v", label: "Variable score after applying the P2 reliability coefficient" },
    { key: "W_v,g", label: "Industry-specific variable weight derived from CDP 2025 mapping" },
  ],
  flowTitle: "Calculation flow",
  flowSteps: [
    {
      title: "Score each variable from public evidence",
      description:
        "V1-V9 are computed directly from sustainability reports, DART, KRX ESG, GIR, and assurance statements covering emissions, targets, governance, capex traceability, accounting boundaries, and verification.",
    },
    {
      title: "Apply P2 where sources conflict",
      description:
        "If reported claims diverge from GIR, DART, or assurance evidence, the affected variable is multiplied by K_P2,v instead of being accepted at face value.",
    },
    {
      title: "Use CDP-derived industry weights",
      description:
        "Weights are not hand-picked. CERs maps CDP 2025 Climate Change questions into V1-V9 and uses Management plus Leadership denominators by industry group.",
    },
    {
      title: "Transform the internal total into the public score",
      description:
        "The weighted total stays on a 0-1 scale internally, then becomes a 1-100 public index through the current display formula.",
    },
  ],
  rulesTitle: "Common rules",
  rules: [
    {
      title: "Score ranges",
      bullets: [
        "Raw variable score: 0 to 1",
        "P2-adjusted variable score: 0 to 1",
        "Internal total: 0 to 1",
        "Displayed CERs Index: 1 to 100",
        "clamp(x, 0, 1) keeps the score inside range and prevents negative scores or oversized bonuses.",
      ],
    },
    {
      title: "Mean functions",
      bullets: [
        "Arithmetic mean is used when items are complementary, such as V5 transition-planning signals.",
        "Geometric mean is used when missing one core condition should sharply weaken the whole variable, such as V3, V6, and V8.",
        "Multiplication is used when one condition should directly cap the credibility of another, such as V1, V4, V7, and V9.",
      ],
    },
    {
      title: "Missing, not disclosed, and not applicable",
      bullets: [
        "Not disclosed is generally scored as zero.",
        "Clearly not applicable items are removed from the denominator instead of treated as zero.",
        "Collection failure is not the same as not applicable and should not be finalized as a confirmed score.",
      ],
    },
    {
      title: "What CERs is and is not",
      bullets: [
        "CERs Index is not an ESG overall rating.",
        "It is not a carbon-credit price or trading-value score.",
        "It scores public evidence of climate transition reliability rather than ESG marketing language.",
      ],
    },
    {
      title: "Framework roles and source base",
      bullets: [
        "CDP 2025 Climate Change is the primary backbone for variables and weights.",
        "MSCI is a secondary exposure-management lens for industry interpretation rather than a raw scoring engine.",
        "Public source coverage centers on sustainability reports, DART, KRX ESG, GIR, and assurance statements.",
      ],
    },
  ],
  variablesTitle: "Variable formulas",
  variablesDescription:
    "These are the current public variables used in the live method. Each card shows the governing formula and the main interpretation rule from the v0.3 note.",
  variables: {
    v1: {
      title: "V1. Scope 1 and 2 emissions performance",
      description:
        "Measures whether combined Scope 1 and 2 emissions intensity improves over time and whether absolute emissions are at least not rising.",
      bullets: [
        "Default denominator is consolidated revenue unless a better activity denominator is available as support data.",
        "If the 3-year comparison is unavailable, a fallback yearly comparison can be used with a Limited flag.",
      ],
    },
    v2: {
      title: "V2. Material Scope 3 disclosure and management",
      description:
        "Measures whether the company quantifies and manages the Scope 3 categories that are material for its CERs industry group.",
      bullets: [
        "Material categories come from the G1-G12 industry map.",
        "Categories with clear non-applicability are removed from both numerator and denominator.",
      ],
    },
    v3: {
      title: "V3. Target design quality",
      description:
        "Tests whether the reduction target is structurally traceable, not just announced, including gross-versus-net clarity and credit transparency.",
      bullets: [
        "Net-zero declarations alone do not score well.",
        "P1 is absorbed here through the credit-transparency input rather than treated as a standalone variable.",
      ],
    },
    v4: {
      title: "V4. Delivery against the target path",
      description:
        "Tests whether actual performance is tracking the disclosed reduction path and whether concrete reduction initiatives are evidenced.",
      bullets: [
        "The path is built linearly from base year to target year.",
        "If the company only has activity names without scope, timing, or results, initiative evidence remains partial.",
      ],
    },
    v5: {
      title: "V5. Climate risk and transition-plan identification",
      description:
        "Measures whether physical risk, transition risk, opportunity, time horizon, financial impact, transition levers, and progress are identified with company-specific detail.",
      bullets: ["This is an arithmetic mean because the signals are complementary rather than strictly all-or-nothing."],
    },
    v6: {
      title: "V6. Board oversight, accountability, and pay linkage",
      description:
        "Measures whether climate oversight is embedded in board governance, executive accountability, climate KPI design, and evidence of linkage to executive compensation.",
      bullets: [
        "General ESG governance is not enough by itself.",
        "For external explanation, treat this as evidence that climate KPIs link into executive pay rather than a compensation-linkage rate.",
        "The geometric mean keeps the score strict when one core governance link is missing.",
      ],
    },
    v7: {
      title: "V7. Capital allocation and traceability",
      description:
        "Measures whether the transition-investment narrative can be traced into real capex or, for financials, into transition-finance allocation.",
      bullets: [
        "V7 is not a perfect green-capex estimator. It is a credibility and traceability variable.",
        "V7 is priority-conditional: if it is genuinely not applicable, the remaining weights are renormalized.",
        "A green-investment claim without DART traceability can drive S_financial_traceability to zero.",
      ],
    },
    v8: {
      title: "V8. Emissions accounting and boundary transparency",
      description:
        "Measures whether organizational, operational, and financial-reporting boundaries are disclosed clearly enough to make emissions comparable and reproducible.",
      bullets: ["Boundary mismatches can also trigger a P2 reduction."],
    },
    v9: {
      title: "V9. Third-party assurance and data reliability",
      description:
        "Measures whether emissions and key climate data are independently assured, at what level, and across which scopes.",
      bullets: [
        "Scope 3 coverage matters more when those categories are material for the sector.",
        "No independent assurance means the variable collapses to zero.",
      ],
    },
  },
  weightingTitle: "Industry weighting logic",
  weightingDescription:
    "CERs does not assign variable weights manually. CDP 2025 Climate Change is the primary backbone: questions are mapped into V1-V9 and their denominators are converted into sector-specific weights.",
  weightingBullets: [
    "Only Management and Leadership denominators are used in the current weight engine.",
    "Disclosure denominators are excluded so the score does not over-reward disclosure volume alone.",
    "If a variable is NA, the remaining weights are renormalized rather than leaving empty mass.",
    "MSCI is not used to calculate raw weights; it remains a secondary exposure-management lens for sector interpretation.",
  ],
  p2Title: "P2 reliability adjustment",
  p2Description:
    "P2 is applied when the company narrative conflicts with GIR, DART, or assurance evidence. It is a manual-review trigger and variable-level reliability adjustment, not a direct greenwashing verdict or a separate whole-score penalty.",
  p2Rows: [
    { caseLabel: "No mismatch", factor: "1.0", appliesTo: "No reduction" },
    { caseLabel: "More than 5% difference with explanation", factor: "0.9", appliesTo: "Moderate reliability reduction" },
    { caseLabel: "More than 5% difference without explanation", factor: "0.8", appliesTo: "Stronger reliability reduction" },
    { caseLabel: "Suspected unit or boundary error before manual review", factor: "0.6", appliesTo: "Heavy reliability reduction" },
    { caseLabel: "Core figure cannot be trusted", factor: "Not scored", appliesTo: "Variable becomes unavailable" },
  ],
  outputsTitle: "Output states",
  outputsDescription:
    "The index is not always published for every entity. The current note defines the following public output states.",
  outputs: [
    { name: "Full Index", description: "V1, V3, V5, V6, V8, and V9 are available and the index is displayed normally." },
    { name: "Limited Index", description: "V1 is available, but one or more of V6, V7, or V9 are missing or limited; the score is still displayed with a Limited flag." },
    { name: "Disclosure Only", description: "Only qualitative disclosure or targets are available without usable emissions evidence, so the index itself is not displayed." },
    { name: "Universe Only", description: "Only entity identification is available; no score is published." },
    { name: "Excluded", description: "SPAC, ETF, ETN, and similar cases are outside the scoring universe." },
  ],
};

const KOREAN_COPY: LogicCopy = {
  heroTitle: "점수 로직 참고",
  heroDescription:
    "CERs Index는 CDP에 정렬된 공개자료 기반 기후전환 신뢰도 인덱스입니다. 이 페이지는 변수, 가중치, 공개 점수 변환 구조를 한 번에 보여줍니다.",
  equationsTitle: "핵심 수식",
  equationsDescription:
    "모든 기업은 먼저 0~1 범위의 변수점수를 받고, 이후 P2 보정, 산업별 가중합, 공개용 1~100 변환 순서로 CERs Index가 계산됩니다.",
  equationTitles: {
    adjusted: "1. 신뢰도 보정 변수점수",
    total: "2. 가중 내부점수",
    index: "3. 공개 CERs Index",
  },
  definitionsTitle: "기호 설명",
  definitions: [
    { key: "i", label: "기업" },
    { key: "t", label: "회계연도" },
    { key: "v", label: "V1~V9 변수 ID" },
    { key: "g(i)", label: "기업 i에 부여된 CERs 산업군" },
    { key: "S_v", label: "0~1 범위의 변수 원점수" },
    { key: "S_adjusted_v", label: "P2 신뢰도 계수를 반영한 변수점수" },
    { key: "W_v,g", label: "CDP 2025 매핑으로 계산한 산업군별 변수 가중치" },
  ],
  flowTitle: "계산 흐름",
  flowSteps: [
    {
      title: "공개 근거에서 변수점수를 계산합니다",
      description:
        "V1~V9는 지속가능경영보고서, DART, KRX ESG, GIR, 검증의견서에서 확인되는 배출량, 목표, 거버넌스, CapEx 추적성, 보고경계, 검증 근거로 직접 계산됩니다.",
    },
    {
      title: "출처가 충돌하면 P2를 적용합니다",
      description:
        "보고서 주장과 GIR, DART, 검증 근거가 충돌하면 해당 변수는 그대로 쓰지 않고 K_P2,v를 곱해 신뢰도를 낮춥니다.",
    },
    {
      title: "CDP 기반 산업별 가중치를 씁니다",
      description:
        "가중치는 손으로 정하지 않습니다. CERs 산업군별로 CDP 2025 Climate Change 질문을 V1~V9에 매핑하고, Management 및 Leadership denominator를 합산해 계산합니다.",
    },
    {
      title: "내부총점을 공개 점수로 변환합니다",
      description:
        "가중 내부총점은 내부적으로 0~1을 유지하고, 마지막에 현재 공개 수식으로 1~100 CERs Index로 변환됩니다.",
    },
  ],
  rulesTitle: "공통 규칙",
  rules: [
    {
      title: "점수 범위",
      bullets: [
        "변수 원점수: 0~1",
        "P2 반영 변수점수: 0~1",
        "내부총점: 0~1",
        "표시 CERs Index: 1~100",
        "clamp(x, 0, 1)은 점수를 범위 안에 고정해 음수 점수와 과도한 보너스를 막습니다.",
      ],
    },
    {
      title: "평균 함수",
      bullets: [
        "산술평균은 V5처럼 정보항목이 보완관계일 때 사용합니다.",
        "기하평균은 V3, V6, V8처럼 핵심 요건 하나가 빠지면 전체 신뢰도가 크게 훼손되어야 할 때 사용합니다.",
        "곱셈은 V1, V4, V7, V9처럼 한 요소가 다른 요소의 신뢰도를 직접 제한해야 할 때 사용합니다.",
      ],
    },
    {
      title: "결측, 미공시, 비해당",
      bullets: [
        "미공시는 원칙적으로 0점 처리합니다.",
        "명확한 비해당은 0점이 아니라 분모 제외입니다.",
        "수집실패는 비해당이 아니며, 확정 점수로 마감하면 안 됩니다.",
      ],
    },
    {
      title: "CERs가 보는 것과 보지 않는 것",
      bullets: [
        "CERs Index는 ESG 종합등급이 아닙니다.",
        "탄소크레딧 가격이나 거래가치를 매기는 점수도 아닙니다.",
        "ESG 홍보문구가 아니라 공개 근거로 확인되는 기후전환 신뢰도를 점수화합니다.",
      ],
    },
    {
      title: "프레임워크와 출처",
      bullets: [
        "CDP 2025 Climate Change가 변수와 가중치의 주된 뼈대입니다.",
        "MSCI는 원점수 계산식이 아니라 산업별 해석을 돕는 exposure-management 보조 프레임입니다.",
        "공개 출처는 지속가능경영보고서, DART, KRX ESG, GIR, 검증의견서를 중심으로 구성됩니다.",
      ],
    },
  ],
  variablesTitle: "변수별 산식",
  variablesDescription:
    "아래는 현재 공개 방법론에 포함된 V1~V9입니다. 각 카드에는 핵심 산식과 실제 해석 규칙을 함께 넣었습니다.",
  variables: {
    v1: {
      title: "V1. Scope 1·2 배출 성과",
      description:
        "Scope 1·2 합산 배출집약도가 개선되는지와 절대배출이 최소한 늘지 않는지를 함께 평가합니다.",
      bullets: [
        "기본 분모는 연결 매출액이며, 더 적절한 활동분모는 보조지표로만 사용합니다.",
        "3년 비교가 불가능하면 1년 보조 산식과 Limited 표시를 사용합니다.",
      ],
    },
    v2: {
      title: "V2. 중대 Scope 3 공개·관리",
      description:
        "해당 산업군에서 중요한 Scope 3 카테고리를 정량 공개하고 관리하는지를 평가합니다.",
      bullets: ["중대 카테고리는 G1~G12 산업군 맵으로 정합니다.", "명확한 비해당 항목은 분자와 분모에서 모두 제외합니다."],
    },
    v3: {
      title: "V3. 감축목표 설계 품질",
      description:
        "감축목표가 선언 수준이 아니라 실제로 추적 가능한 구조인지, 총배출과 순배출이 분리되어 있는지, 크레딧 사용이 투명한지를 평가합니다.",
      bullets: ["넷제로 선언만으로는 고득점을 주지 않습니다.", "P1은 별도 변수로 두지 않고 크레딧 투명성을 통해 V3 안에 흡수합니다."],
    },
    v4: {
      title: "V4. 목표 대비 이행률·감축활동 증거",
      description:
        "실제 성과가 공개한 감축 경로를 따라가고 있는지, 그리고 감축활동에 대한 구체 근거가 있는지를 평가합니다.",
      bullets: ["기준연도부터 목표연도까지 선형 경로를 만듭니다.", "활동명만 있고 범위, 기간, 성과가 없으면 부분점수에 머뭅니다."],
    },
    v5: {
      title: "V5. 기후 리스크·전환계획 식별",
      description:
        "물리적 위험, 전환위험, 기회, 시간범위, 재무영향, 전환수단, 진행상황을 회사 맥락에 맞게 공시하는지를 평가합니다.",
      bullets: ["여러 항목이 보완관계라 산술평균을 사용합니다."],
    },
    v6: {
      title: "V6. 이사회 감독·책임·보상 연계",
      description:
        "기후 대응이 이사회 감독, 경영진 책임, 기후 KPI, 임원 보상체계와 실제로 연결되는 근거가 있는지를 평가합니다.",
      bullets: [
        "일반 ESG 감독만으로는 충분하지 않습니다.",
        "대외 설명에서는 보상연계율이 아니라 기후 KPI와 임원보상체계의 연계 증거로 설명하는 편이 정확합니다.",
        "핵심 연결고리 하나가 빠지면 전체가 약해지도록 기하평균을 사용합니다.",
      ],
    },
    v7: {
      title: "V7. 자본배분·추적성",
      description:
        "전환투자 주장이 실제 CapEx, DART, 재무제표 또는 금융업의 전환금융 배분과 연결되는지를 평가합니다.",
      bullets: [
        "V7은 녹색 CapEx를 완벽하게 추정하는 변수가 아니라, 전환투자 주장에 대한 신뢰도와 추적가능성을 보는 변수입니다.",
        "V7은 Priority Conditional 변수입니다. 실제로 비해당이면 다른 변수 가중치를 재정규화합니다.",
        "녹색투자 주장과 DART 근거가 연결되지 않으면 S_financial_traceability가 0이 될 수 있습니다.",
      ],
    },
    v8: {
      title: "V8. 배출량 산정·보고경계 투명성",
      description:
        "조직경계, 운영경계, 재무제표 경계, 산정기준, 배출계수, Scope 2 방식, 재작성 공시가 비교 가능하게 제시되는지를 평가합니다.",
      bullets: ["경계 불일치는 P2 감점 사유가 되기도 합니다."],
    },
    v9: {
      title: "V9. 제3자 검증·데이터 신뢰성",
      description:
        "배출량과 핵심 기후정보가 독립적으로 검증됐는지, 어떤 수준이며 어떤 Scope를 덮는지를 평가합니다.",
      bullets: ["중대한 Scope 3가 있는 산업일수록 Scope 3 검증의 의미가 커집니다.", "독립 검증이 없으면 이 변수는 0으로 수렴합니다."],
    },
  },
  weightingTitle: "산업별 가중치 로직",
  weightingDescription:
    "CERs는 변수 가중치를 임의로 정하지 않습니다. CDP 2025 Climate Change를 주된 기준으로 삼아 질문을 V1~V9에 매핑하고, 질문별 denominator를 산업군별 변수 가중치로 변환합니다.",
  weightingBullets: [
    "현재 가중치 엔진은 Management와 Leadership denominator만 사용합니다.",
    "단순 공시량 편향을 피하기 위해 Disclosure denominator는 쓰지 않습니다.",
    "변수가 NA인 경우 빈 가중치를 남기지 않고 나머지 변수에 재정규화합니다.",
    "MSCI는 원가중치 계산에 쓰지 않고, 산업별 노출도-관리역량 해석을 돕는 보조 프레임으로만 사용합니다.",
  ],
  p2Title: "P2 신뢰도 보정",
  p2Description:
    "P2는 보고서 서술과 GIR, DART, 검증의견서가 충돌할 때 수동 검수를 유발하고 변수 단위로 신뢰도를 낮추는 장치입니다. 그린워싱 확정 판정이 아니라, 해당 변수점수에 직접 곱해지는 신뢰도 계수입니다.",
  p2Rows: [
    { caseLabel: "불일치 없음", factor: "1.0", appliesTo: "감점 없음" },
    { caseLabel: "5% 초과 차이, 설명 있음", factor: "0.9", appliesTo: "완만한 신뢰도 감점" },
    { caseLabel: "5% 초과 차이, 설명 없음", factor: "0.8", appliesTo: "더 큰 신뢰도 감점" },
    { caseLabel: "단위·경계 오류 의심", factor: "0.6", appliesTo: "강한 신뢰도 감점" },
    { caseLabel: "핵심 수치 신뢰 불가", factor: "산출불가", appliesTo: "해당 변수 미산출" },
  ],
  outputsTitle: "산출 상태",
  outputsDescription: "모든 기업이 같은 상태로 점수를 공개받는 것은 아닙니다. 현재 노트는 아래와 같은 공개 상태를 정의합니다.",
  outputs: [
    { name: "Full Index", description: "V1, V3, V5, V6, V8, V9가 산출 가능하며 일반 Index로 표시합니다." },
    { name: "Limited Index", description: "V1은 가능하지만 V6, V7, V9 중 일부가 결측 또는 제한적이면 Limited 표시와 함께 점수를 공개합니다." },
    { name: "Disclosure Only", description: "배출 근거 없이 정성공시나 목표만 있어 Index 자체는 표시하지 않습니다." },
    { name: "Universe Only", description: "기업 식별만 가능하고 점수는 공개하지 않습니다." },
    { name: "Excluded", description: "SPAC, ETF, ETN 등은 스코어링 대상에서 제외합니다." },
  ],
};

const JAPANESE_COPY: LogicCopy = {
  heroTitle: "スコアロジック参照",
  heroDescription:
    "CERs Index は CDP に整合した公開資料ベースの気候移行信頼性インデックスです。このページでは変数、重み、公開スコア変換の構造をまとめて見られます。",
  equationsTitle: "中核式",
  equationsDescription:
    "各企業はまず 0 から 1 の変数スコアを受け、その後に P2 補正、業種別加重合計、公開用 1 から 100 変換の順に CERs Index が作られます。",
  equationTitles: {
    adjusted: "1. 信頼性補正後の変数スコア",
    total: "2. 加重内部スコア",
    index: "3. 公開 CERs Index",
  },
  definitionsTitle: "記号の意味",
  definitions: [
    { key: "i", label: "企業" },
    { key: "t", label: "会計年度" },
    { key: "v", label: "V1 から V9 の変数 ID" },
    { key: "g(i)", label: "企業 i に割り当てた CERs 業種グループ" },
    { key: "S_v", label: "0 から 1 の変数生スコア" },
    { key: "S_adjusted_v", label: "P2 信頼性係数を反映した変数スコア" },
    { key: "W_v,g", label: "CDP 2025 マッピングから計算した業種別変数重み" },
  ],
  flowTitle: "計算フロー",
  flowSteps: [
    {
      title: "公開根拠から変数スコアを計算する",
      description:
        "V1 から V9 は、サステナビリティレポート、DART、KRX ESG、GIR、保証意見書で確認できる排出量、目標、ガバナンス、CapEx 追跡性、報告境界、保証根拠から直接計算されます。",
    },
    {
      title: "出所が衝突したら P2 を適用する",
      description:
        "報告書の主張が GIR、DART、保証根拠と食い違う場合、その変数は額面通りに使わず K_P2,v を掛けて信頼度を下げます。",
    },
    {
      title: "CDP ベースの業種別重みを使う",
      description:
        "重みは手作業で決めません。CERs 業種グループごとに CDP 2025 Climate Change の質問を V1 から V9 に対応付け、Management と Leadership denominator を合算して計算します。",
    },
    {
      title: "内部合計を公開スコアへ変換する",
      description:
        "加重内部合計は内部では 0 から 1 を保ち、最後に現在の公開式で 1 から 100 の CERs Index に変換されます。",
    },
  ],
  rulesTitle: "共通ルール",
  rules: [
    {
      title: "スコア範囲",
      bullets: [
        "変数生スコア: 0 から 1",
        "P2 反映後の変数スコア: 0 から 1",
        "内部合計: 0 から 1",
        "表示 CERs Index: 1 から 100",
        "clamp(x, 0, 1) はスコアを範囲内に固定し、負の点数や過大なボーナスを防ぎます。",
      ],
    },
    {
      title: "平均関数",
      bullets: [
        "算術平均は V5 のように情報項目が補完関係にある場合に使います。",
        "幾何平均は V3、V6、V8 のように一つ欠けると全体信頼性が大きく落ちる場合に使います。",
        "乗算は V1、V4、V7、V9 のように、一つの条件が別の条件の信頼性を直接制限すべき場合に使います。",
      ],
    },
    {
      title: "欠損、未開示、非該当",
      bullets: [
        "未開示は原則 0 点です。",
        "明確な非該当は 0 点ではなく分母除外です。",
        "収集失敗は非該当ではなく、確定スコアとして閉じるべきではありません。",
      ],
    },
    {
      title: "CERs が見るものと見ないもの",
      bullets: [
        "CERs Index は ESG 全体格付けではありません。",
        "炭素クレジットの価格や取引価値を示すスコアでもありません。",
        "ESG の宣伝文句ではなく、公開根拠で確認できる気候移行信頼性を採点します。",
      ],
    },
    {
      title: "フレームワークと出所",
      bullets: [
        "CDP 2025 Climate Change が変数と重みの主要な骨格です。",
        "MSCI は生スコア計算式ではなく、業種別解釈を助ける exposure-management の補助フレームです。",
        "公開出所はサステナビリティレポート、DART、KRX ESG、GIR、保証意見書が中心です。",
      ],
    },
  ],
  variablesTitle: "変数別の式",
  variablesDescription:
    "以下が現在の公開方法論に含まれる V1 から V9 です。各カードには中核式と実務上の解釈ルールをまとめています。",
  variables: {
    v1: {
      title: "V1. Scope 1・2 排出実績",
      description:
        "Scope 1・2 合算の排出原単位が改善しているか、かつ絶対排出が少なくとも増えていないかを評価します。",
      bullets: [
        "基本分母は連結売上高で、より適切な活動分母は補助指標として扱います。",
        "3 年比較ができない場合は 1 年の補助式と Limited 表示を使います。",
      ],
    },
    v2: {
      title: "V2. 重要 Scope 3 の開示・管理",
      description:
        "その業種グループで重要な Scope 3 カテゴリを定量開示し、管理しているかを評価します。",
      bullets: ["重要カテゴリは G1 から G12 の業種マップで決まります。", "明確な非該当項目は分子と分母の両方から外します。"],
    },
    v3: {
      title: "V3. 削減目標の設計品質",
      description:
        "削減目標が宣言レベルではなく追跡可能な構造か、総排出と純排出が分離されているか、クレジット利用が透明かを評価します。",
      bullets: ["ネットゼロ宣言だけでは高得点になりません。", "P1 は独立変数ではなく、クレジット透明性を通じて V3 に吸収されます。"],
    },
    v4: {
      title: "V4. 目標に対する進捗と削減施策の証拠",
      description:
        "実績が公表した削減経路をたどっているか、具体的な削減施策の証拠があるかを評価します。",
      bullets: ["基準年から目標年までの線形経路を使います。", "施策名だけで範囲、期間、成果がなければ部分点にとどまります。"],
    },
    v5: {
      title: "V5. 気候リスク・移行計画の識別",
      description:
        "物理リスク、移行リスク、機会、時間軸、財務影響、移行手段、進捗状況を企業文脈に沿って開示しているかを評価します。",
      bullets: ["複数項目が補完関係なので算術平均を使います。"],
    },
    v6: {
      title: "V6. 取締役会監督・責任・報酬連動",
      description:
        "気候対応が取締役会監督、経営責任、気候 KPI、役員報酬体系に実際に結び付いている証拠があるかを評価します。",
      bullets: [
        "一般的な ESG 監督だけでは不十分です。",
        "対外説明では『報酬連動率』ではなく、気候 KPI と役員報酬体系の連結証拠として説明するのが正確です。",
        "重要な連結の一つが欠けると全体が弱くなるよう幾何平均を使います。",
      ],
    },
    v7: {
      title: "V7. 資本配分と追跡可能性",
      description:
        "移行投資の主張が実際の CapEx、DART、財務諸表、または金融業なら移行金融配分と結び付くかを評価します。",
      bullets: [
        "V7 はグリーン CapEx を完全に推計する変数ではなく、移行投資主張の信頼性と追跡可能性を見る変数です。",
        "V7 は Priority Conditional です。本当に非該当なら他の変数重みを再正規化します。",
        "グリーン投資の主張と DART 根拠がつながらなければ S_financial_traceability は 0 になり得ます。",
      ],
    },
    v8: {
      title: "V8. 排出算定・報告境界の透明性",
      description:
        "組織境界、運営境界、財務報告境界、算定基準、排出係数、Scope 2 方式、再記載開示が比較可能な形で示されているかを評価します。",
      bullets: ["境界不一致は P2 減点理由にもなります。"],
    },
    v9: {
      title: "V9. 第三者保証・データ信頼性",
      description:
        "排出量と主要な気候情報が独立に保証されているか、どの水準で、どの Scope を覆うかを評価します。",
      bullets: ["重要 Scope 3 を持つ業種ほど Scope 3 保証の意味が大きくなります。", "独立保証がなければこの変数は 0 に近づきます。"],
    },
  },
  weightingTitle: "業種別重みロジック",
  weightingDescription:
    "CERs は変数重みを恣意的に決めません。CDP 2025 Climate Change を主基準として質問を V1 から V9 に対応付け、質問 denominator を業種別変数重みに変換します。",
  weightingBullets: [
    "現在の重みエンジンは Management と Leadership denominator のみを使います。",
    "単純な開示量バイアスを避けるため Disclosure denominator は使いません。",
    "変数が NA の場合は空いた重みを残さず、残りの変数へ再正規化します。",
    "MSCI は生の重み計算には使わず、業種別の露出度と管理力の解釈を助ける補助フレームとしてだけ使います。",
  ],
  p2Title: "P2 信頼性補正",
  p2Description:
    "P2 は報告書記述と GIR、DART、保証意見書が衝突する際に手動レビューを促し、変数単位で信頼度を下げる仕組みです。グリーンウォッシングの確定判定ではなく、その変数スコアに直接掛かる信頼性係数です。",
  p2Rows: [
    { caseLabel: "不一致なし", factor: "1.0", appliesTo: "減点なし" },
    { caseLabel: "5% 超差異、説明あり", factor: "0.9", appliesTo: "緩やかな信頼度減点" },
    { caseLabel: "5% 超差異、説明なし", factor: "0.8", appliesTo: "より大きい信頼度減点" },
    { caseLabel: "単位・境界エラー疑い", factor: "0.6", appliesTo: "強い信頼度減点" },
    { caseLabel: "中核数値を信頼できない", factor: "算出不可", appliesTo: "当該変数は未算出" },
  ],
  outputsTitle: "出力状態",
  outputsDescription: "すべての企業が同じ状態でスコア公開されるわけではありません。現在のノートは以下の公開状態を定義しています。",
  outputs: [
    { name: "Full Index", description: "V1、V3、V5、V6、V8、V9 が算出可能で、通常の Index として表示します。" },
    { name: "Limited Index", description: "V1 は可能だが V6、V7、V9 の一部が欠損または制限的な場合、Limited 表示付きでスコアを公開します。" },
    { name: "Disclosure Only", description: "排出根拠がなく、定性開示や目標のみの場合は Index 自体を表示しません。" },
    { name: "Universe Only", description: "企業識別のみ可能で、スコアは公開しません。" },
    { name: "Excluded", description: "SPAC、ETF、ETN などはスコアリング対象から除外します。" },
  ],
};

const COPY: Record<SupportedLocale, LogicCopy> = {
  en: ENGLISH_COPY,
  ko: KOREAN_COPY,
  ja: JAPANESE_COPY,
};

function FormulaBlock({ lines }: { lines: ReactNode[] }) {
  return (
    <div className="overflow-x-auto py-1">
      <div className="min-w-max font-serif text-[1.02rem] leading-8 text-slate-700 dark:text-slate-200">
        {lines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export default function ScoreLogicV3({ locale = "en" }: { locale?: SupportedLocale }) {
  const copy = COPY[locale];

  return (
    <div className="container py-8">
      <section className="rounded-[40px] border border-slate-200 bg-white px-8 py-10 shadow-elevated dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">CERs Index v0.3</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">{copy.heroTitle}</h1>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">{copy.heroDescription}</p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{copy.equationsTitle}</h2>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{copy.equationsDescription}</p>
          <div className="mt-5 space-y-4">
            {CORE_FORMULA_ORDER.map((formulaId) => (
              <div key={formulaId} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="text-xs font-medium uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">
                  {copy.equationTitles[formulaId]}
                </div>
                <div className="mt-3">
                  <FormulaBlock lines={CORE_FORMULAS[formulaId]} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{copy.definitionsTitle}</h2>
          <div className="mt-5 space-y-3">
            {copy.definitions.map((item) => (
              <div key={item.key} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">{item.key}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{copy.flowTitle}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {copy.flowSteps.map((step, index) => (
            <div key={step.title} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">{index + 1}</div>
              <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 rounded-[32px] border border-slate-200 bg-white px-6 py-5 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{copy.rulesTitle}</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {copy.rules.map((rule) => (
            <div key={rule.title} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{rule.title}</h3>
              <div className="mt-4 space-y-2">
                {rule.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 rounded-[32px] border border-slate-200 bg-white px-6 py-5 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{copy.variablesTitle}</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">{copy.variablesDescription}</p>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          {VARIABLE_ORDER.map((variableId) => {
            const variable = copy.variables[variableId];
            return (
              <div key={variableId} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{variable.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{variable.description}</p>
                <div className="mt-4">
                  <FormulaBlock lines={VARIABLE_FORMULAS[variableId]} />
                </div>
                <div className="mt-4 space-y-2">
                  {variable.bullets.map((bullet) => (
                    <div key={bullet} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{copy.weightingTitle}</h2>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{copy.weightingDescription}</p>
          <div className="mt-4">
            <FormulaBlock lines={WEIGHTING_FORMULAS} />
          </div>
          <div className="mt-4 space-y-2">
            {copy.weightingBullets.map((bullet) => (
              <div key={bullet} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {bullet}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{copy.p2Title}</h2>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{copy.p2Description}</p>
          <div className="mt-5 space-y-3">
            {copy.p2Rows.map((row) => (
              <div key={row.caseLabel} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">{row.caseLabel}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{row.appliesTo}</p>
                  </div>
                  <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:border dark:border-teal-500/35 dark:bg-slate-900 dark:text-teal-300">
                    {row.factor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{copy.outputsTitle}</h2>
        <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{copy.outputsDescription}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {copy.outputs.map((item) => (
            <div key={item.name} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
