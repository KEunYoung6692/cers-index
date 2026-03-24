import type { SupportedLocale } from "@/lib/cers/i18n";

type LogicCopy = {
  heroTitle: string;
  heroDescription: string;
  overallTitle: string;
  overallRangeNote: string;
  overallDefinitions: Array<{ key: string; label: string }>;
  defaultWeightsTitle: string;
  section1: {
    title: string;
    baseTitle: string;
    baselineLabel: string;
    currentLabel: string;
    actualRateLabel: string;
    actualRateDescription: string;
    modifierTitle: string;
    modifierLabel: string;
    modifierRules: Array<{ value: string; description: string; valueClassName: string }>;
    intensityTitle: string;
    intensityOnlyLabel: string;
    absoluteReductionLabel: string;
    intensityNote: string;
  };
  section2: {
    title: string;
    baseTitle: string;
    matrixTitle: string;
    matrixItems: Array<{ label: string; description: string; value: string; toneClassName: string; valueClassName: string }>;
    coverageTitle: string;
    coverageItems: Array<{ label: string; value: string }>;
  };
  section3: {
    title: string;
    baseTitle: string;
    roadmapTitle: string;
    roadmapItems: Array<{ label: string; value: string }>;
    investmentTitle: string;
    investmentItems: Array<{ label: string; value: string }>;
    governanceTitle: string;
    governanceItems: Array<{ label: string; value: string }>;
  };
  section4: {
    title: string;
    baseTitle: string;
    scopeTitle: string;
    scopeItems: Array<{ label: string; value: string }>;
    verificationTitle: string;
    verificationItems: Array<{ label: string; value: string }>;
    frameworkTitle: string;
    frameworkItems: Array<{ label: string; value: string }>;
  };
  section5: {
    title: string;
    description: string;
    rangeNote: string;
    rows: Array<{ title: string; subtitle: string; value: string; toneClassName: string; valueClassName: string }>;
    note: string;
  };
  section6: {
    title: string;
    missingTitle: string;
    missingItems: Array<{ title: string; description: string; toneClassName: string }>;
    increasesTitle: string;
    increasesLead: string;
    increasesDescription: string;
    firstYearTitle: string;
    firstYearDescription: string;
  };
  section7: {
    title: string;
    constraintsTitle: string;
    constraintsDescription: string;
    validationTitle: string;
    validationItems: string[];
    precisionTitle: string;
    precisionItems: Array<{ title: string; description: string }>;
  };
  footer: {
    noteLabel: string;
    noteBody: string;
    version: string;
  };
};

const COPY: Record<SupportedLocale, LogicCopy> = {
  en: {
    heroTitle: "Score Calculation Logic",
    heroDescription: "Technical documentation of the CERS (Carbon Emission Reduction Score) methodology",
    overallTitle: "Overall Score Formula",
    overallRangeNote: "where each component score ranges from 0 to 100",
    overallDefinitions: [
      { key: "ARP", label: "Actual Reduction Performance score (0-100)" },
      { key: "TC", label: "Target Clarity score (0-100)" },
      { key: "ER", label: "Execution Readiness score (0-100)" },
      { key: "DL", label: "Disclosure Level score (0-100)" },
      { key: "w1-4", label: "Component weights (sum = 1.0)" },
    ],
    defaultWeightsTitle: "Default Weight Distribution",
    section1: {
      title: "1. Actual Reduction Performance (ARP)",
      baseTitle: "1.1 Base Formula",
      baselineLabel: "Emissions in baseline year (tCO₂e)",
      currentLabel: "Emissions in current/latest reported year (tCO₂e)",
      actualRateLabel: "Actual reduction rate",
      actualRateDescription: "(0.15 = 15% reduction)",
      modifierTitle: "1.2 Trajectory Consistency Modifier",
      modifierLabel: "Modifier Calculation:",
      modifierRules: [
        { value: "+0.10", description: "if variance < 0.05 (consistent reduction pattern)", valueClassName: "text-teal-600" },
        { value: "−0.10", description: "if variance > 0.15 (volatile trajectory)", valueClassName: "text-red-600" },
        { value: "0.00", description: "otherwise", valueClassName: "text-slate-600" },
      ],
      intensityTitle: "1.3 Intensity vs Absolute Adjustment",
      intensityOnlyLabel: "(if intensity-only)",
      absoluteReductionLabel: "(if absolute reduction)",
      intensityNote: "Absolute reductions receive full credit. Intensity-only improvements receive a 15% penalty.",
    },
    section2: {
      title: "2. Target Clarity (TC)",
      baseTitle: "2.1 Base Formula",
      matrixTitle: "2.2 Component Scoring Matrix",
      matrixItems: [
        { label: "Specific Target", description: "Target year and % specified", value: "25 pts", toneClassName: "from-teal-50 to-white border-teal-100", valueClassName: "text-teal-600" },
        { label: "SBTi Validated", description: "SBTi approval/validation", value: "20 pts", toneClassName: "from-blue-50 to-white border-blue-100", valueClassName: "text-blue-600" },
        { label: "Scope Coverage", description: "Scope 1+2+3 included", value: "20 pts", toneClassName: "from-purple-50 to-white border-purple-100", valueClassName: "text-purple-600" },
        { label: "Interim Milestones", description: "Has interim targets (2025, 2030)", value: "15 pts", toneClassName: "from-indigo-50 to-white border-indigo-100", valueClassName: "text-indigo-600" },
        { label: "Net Zero Commitment", description: "Net zero by 2050 or earlier", value: "10 pts", toneClassName: "from-green-50 to-white border-green-100", valueClassName: "text-green-600" },
        { label: "Target Ambition", description: "Reduction ≥ 50% from baseline", value: "10 pts", toneClassName: "from-amber-50 to-white border-amber-100", valueClassName: "text-amber-600" },
        { label: "Maximum Score", description: "", value: "100", toneClassName: "bg-slate-100 border-slate-300", valueClassName: "text-slate-900" },
      ],
      coverageTitle: "2.3 Scope Coverage Calculation",
      coverageItems: [
        { label: "Scope 1 + 2 + 3 covered", value: "20 pts" },
        { label: "Scope 1 + 2 covered", value: "12 pts" },
        { label: "Scope 1 only", value: "5 pts" },
        { label: "No scope coverage", value: "0 pts" },
      ],
    },
    section3: {
      title: "3. Execution Readiness (ER)",
      baseTitle: "3.1 Base Formula",
      roadmapTitle: "3.2 Roadmap Score (40% weight)",
      roadmapItems: [
        { label: "Detailed Action Plan", value: "30 pts" },
        { label: "Technology Initiatives", value: "25 pts" },
        { label: "Renewable Energy Plan", value: "25 pts" },
        { label: "Supply Chain Engagement", value: "20 pts" },
      ],
      investmentTitle: "3.3 Investment Score (35% weight)",
      investmentItems: [
        { label: "CapEx Allocation Disclosed", value: "40 pts" },
        { label: "R&D Investment (Climate)", value: "35 pts" },
        { label: "Green Finance Commitment", value: "25 pts" },
      ],
      governanceTitle: "3.4 Governance Score (25% weight)",
      governanceItems: [
        { label: "Board Oversight (Climate)", value: "30 pts" },
        { label: "Exec Compensation Linked", value: "30 pts" },
        { label: "Dedicated Climate Team", value: "25 pts" },
        { label: "Annual Progress Reporting", value: "15 pts" },
      ],
    },
    section4: {
      title: "4. Disclosure Level (DL)",
      baseTitle: "4.1 Base Formula",
      scopeTitle: "4.2 Scope Disclosure (40% weight)",
      scopeItems: [
        { label: "Scope 1 Disclosed", value: "25 pts" },
        { label: "Scope 2 Disclosed", value: "25 pts" },
        { label: "Scope 3 Full Disclosure", value: "30 pts" },
        { label: "Scope 3 Partial Disclosure", value: "15 pts" },
        { label: "Multi-year Data", value: "20 pts" },
      ],
      verificationTitle: "4.3 Verification (30% weight)",
      verificationItems: [
        { label: "Third-party Verification", value: "50 pts" },
        { label: "Limited Assurance", value: "30 pts" },
        { label: "Internal Audit Only", value: "10 pts" },
      ],
      frameworkTitle: "4.4 Framework Adherence (30% weight)",
      frameworkItems: [
        { label: "GHG Protocol Compliant", value: "30 pts" },
        { label: "CDP Disclosure", value: "25 pts" },
        { label: "TCFD Aligned", value: "25 pts" },
        { label: "Regular Updates", value: "20 pts" },
      ],
    },
    section5: {
      title: "5. Industry Context Adjustment (Optional)",
      description:
        "While the base CERS score is industry-agnostic, an optional industry adjustment factor can be applied for sector-specific benchmarking.",
      rangeNote: "IAF ranges from −0.10 to +0.10",
      rows: [
        { title: "Hard-to-abate Sectors", subtitle: "Steel, Cement, Aviation", value: "+0.10", toneClassName: "from-red-50 to-white border-red-100", valueClassName: "text-red-600" },
        { title: "Moderate Emissions Sectors", subtitle: "Manufacturing, Retail", value: "0.00", toneClassName: "from-slate-50 to-white border-slate-100", valueClassName: "text-slate-600" },
        { title: "Low Emissions Sectors", subtitle: "Software, Finance", value: "−0.05", toneClassName: "from-blue-50 to-white border-blue-100", valueClassName: "text-blue-600" },
      ],
      note: "Industry adjustment is applied for relative comparison within industry, not for absolute scoring",
    },
    section6: {
      title: "6. Edge Cases & Data Handling",
      missingTitle: "6.1 Missing Data Handling",
      missingItems: [
        { title: "Missing Baseline Emissions", description: "If Ebaseline is missing: ARP = 0", toneClassName: "bg-red-50 border-red-500" },
        { title: "Missing Target Data", description: "If target data is missing: TC = 0", toneClassName: "bg-orange-50 border-orange-500" },
        { title: "Missing Disclosure Data", description: "If disclosure data is missing: DL = 5", toneClassName: "bg-amber-50 border-amber-500" },
        { title: "Missing ER Sub-components", description: "Default to 0 for that sub-component only", toneClassName: "bg-yellow-50 border-yellow-500" },
      ],
      increasesTitle: "6.2 Emission Increases",
      increasesLead: "If Ecurrent > Ebaseline:",
      increasesDescription: "Companies with increasing emissions receive below-50 ARP scores, scaled by increase magnitude.",
      firstYearTitle: "6.3 First-Year Companies",
      firstYearDescription:
        'Companies with only one year of data receive a provisional score based on TC, ER, and DL components only. ARP is marked as "N/A - Insufficient Historical Data" and excluded from weighted average calculation, with remaining components re-weighted proportionally.',
    },
    section7: {
      title: "7. Score Validation & Bounds",
      constraintsTitle: "Final Score Constraints",
      constraintsDescription: "All final scores are bounded between 0 and 100",
      validationTitle: "Component Score Validation",
      validationItems: [
        "Each component score (ARP, TC, ER, DL) ∈ [0, 100]",
        "Sum of weights = 1.0 (verified at calculation time)",
        "Percentage-based metrics in decimal form [0.0, 1.0]",
        "Emission values ≥ 0 (tCO₂e)",
      ],
      precisionTitle: "Precision & Rounding",
      precisionItems: [
        { title: "Intermediate Calculations", description: "Floating-point precision" },
        { title: "Final CERS Score", description: "Rounded to 1 decimal" },
        { title: "Component Scores", description: "Rounded to 1 decimal" },
        { title: "Emission Values", description: "Rounded to 0.1 MtCO₂e" },
      ],
    },
    footer: {
      noteLabel: "Note:",
      noteBody:
        "This scoring logic is subject to periodic review and refinement. The methodology prioritizes transparency and reproducibility while acknowledging the complexity of measuring corporate climate action. Weight distributions and component formulas may be adjusted based on stakeholder feedback and evolving climate science.",
      version: "Version 1.0 | Last Updated: March 2026",
    },
  },
  ko: {
    heroTitle: "점수 산정 로직",
    heroDescription: "CERS(탄소감축 점수) 방법론에 대한 기술 문서",
    overallTitle: "전체 점수 산식",
    overallRangeNote: "각 구성 점수는 0에서 100 사이로 산정됩니다",
    overallDefinitions: [
      { key: "ARP", label: "실질 감축 성과 점수 (0-100)" },
      { key: "TC", label: "목표 명확성 점수 (0-100)" },
      { key: "ER", label: "실행 준비도 점수 (0-100)" },
      { key: "DL", label: "공시 수준 점수 (0-100)" },
      { key: "w1-4", label: "구성 가중치 (합계 = 1.0)" },
    ],
    defaultWeightsTitle: "기본 가중치 분포",
    section1: {
      title: "1. 실질 감축 성과 (ARP)",
      baseTitle: "1.1 기본 산식",
      baselineLabel: "기준연도 배출량 (tCO₂e)",
      currentLabel: "현재/최신 보고연도 배출량 (tCO₂e)",
      actualRateLabel: "실제 감축률",
      actualRateDescription: "(0.15 = 15% 감축)",
      modifierTitle: "1.2 감축 궤적 일관성 보정",
      modifierLabel: "보정값 계산:",
      modifierRules: [
        { value: "+0.10", description: "분산 < 0.05 인 경우 (일관된 감축 패턴)", valueClassName: "text-teal-600" },
        { value: "−0.10", description: "분산 > 0.15 인 경우 (변동성이 큰 궤적)", valueClassName: "text-red-600" },
        { value: "0.00", description: "그 외", valueClassName: "text-slate-600" },
      ],
      intensityTitle: "1.3 집약도 기준 vs 절대량 기준 보정",
      intensityOnlyLabel: "(집약도 기준만 있을 경우)",
      absoluteReductionLabel: "(절대 감축일 경우)",
      intensityNote: "절대 감축에는 전액 점수를 부여합니다. 집약도 개선만 있는 경우 15% 감점을 적용합니다.",
    },
    section2: {
      title: "2. 목표 명확성 (TC)",
      baseTitle: "2.1 기본 산식",
      matrixTitle: "2.2 구성 항목 점수표",
      matrixItems: [
        { label: "구체적 목표", description: "목표 연도와 감축률이 명시됨", value: "25점", toneClassName: "from-teal-50 to-white border-teal-100", valueClassName: "text-teal-600" },
        { label: "SBTi 검증", description: "SBTi 승인/검증 여부", value: "20점", toneClassName: "from-blue-50 to-white border-blue-100", valueClassName: "text-blue-600" },
        { label: "스코프 커버리지", description: "Scope 1+2+3 포함", value: "20점", toneClassName: "from-purple-50 to-white border-purple-100", valueClassName: "text-purple-600" },
        { label: "중간 마일스톤", description: "중간 목표 보유 (2025, 2030)", value: "15점", toneClassName: "from-indigo-50 to-white border-indigo-100", valueClassName: "text-indigo-600" },
        { label: "넷제로 선언", description: "2050년 이전 넷제로 선언", value: "10점", toneClassName: "from-green-50 to-white border-green-100", valueClassName: "text-green-600" },
        { label: "목표 야심도", description: "기준연도 대비 50% 이상 감축", value: "10점", toneClassName: "from-amber-50 to-white border-amber-100", valueClassName: "text-amber-600" },
        { label: "최대 점수", description: "", value: "100", toneClassName: "bg-slate-100 border-slate-300", valueClassName: "text-slate-900" },
      ],
      coverageTitle: "2.3 스코프 커버리지 계산",
      coverageItems: [
        { label: "Scope 1 + 2 + 3 모두 포함", value: "20점" },
        { label: "Scope 1 + 2 포함", value: "12점" },
        { label: "Scope 1만 포함", value: "5점" },
        { label: "커버리지 없음", value: "0점" },
      ],
    },
    section3: {
      title: "3. 실행 준비도 (ER)",
      baseTitle: "3.1 기본 산식",
      roadmapTitle: "3.2 로드맵 점수 (가중치 40%)",
      roadmapItems: [
        { label: "세부 실행 계획", value: "30점" },
        { label: "기술 전환 이니셔티브", value: "25점" },
        { label: "재생에너지 계획", value: "25점" },
        { label: "공급망 참여도", value: "20점" },
      ],
      investmentTitle: "3.3 투자 점수 (가중치 35%)",
      investmentItems: [
        { label: "CAPEX 배분 공시", value: "40점" },
        { label: "기후 관련 R&D 투자", value: "35점" },
        { label: "그린 파이낸스 약정", value: "25점" },
      ],
      governanceTitle: "3.4 거버넌스 점수 (가중치 25%)",
      governanceItems: [
        { label: "이사회 기후 감독", value: "30점" },
        { label: "경영진 보상 연계", value: "30점" },
        { label: "전담 기후 조직", value: "25점" },
        { label: "연간 진척 보고", value: "15점" },
      ],
    },
    section4: {
      title: "4. 공시 수준 (DL)",
      baseTitle: "4.1 기본 산식",
      scopeTitle: "4.2 스코프 공시 (가중치 40%)",
      scopeItems: [
        { label: "Scope 1 공시", value: "25점" },
        { label: "Scope 2 공시", value: "25점" },
        { label: "Scope 3 전체 공시", value: "30점" },
        { label: "Scope 3 일부 공시", value: "15점" },
        { label: "다년 데이터 제공", value: "20점" },
      ],
      verificationTitle: "4.3 검증 (가중치 30%)",
      verificationItems: [
        { label: "제3자 검증", value: "50점" },
        { label: "제한적 보증", value: "30점" },
        { label: "내부 감사만 수행", value: "10점" },
      ],
      frameworkTitle: "4.4 프레임워크 준수 (가중치 30%)",
      frameworkItems: [
        { label: "GHG Protocol 준수", value: "30점" },
        { label: "CDP 공시", value: "25점" },
        { label: "TCFD 정렬", value: "25점" },
        { label: "정기 업데이트", value: "20점" },
      ],
    },
    section5: {
      title: "5. 산업 맥락 조정 (선택 사항)",
      description:
        "기본 CERS 점수는 산업 중립적으로 계산되지만, 섹터별 벤치마킹을 위해 선택적 산업 조정 계수(IAF)를 적용할 수 있습니다.",
      rangeNote: "IAF 범위: −0.10 ~ +0.10",
      rows: [
        { title: "감축 난이도 높은 섹터", subtitle: "철강, 시멘트, 항공", value: "+0.10", toneClassName: "from-red-50 to-white border-red-100", valueClassName: "text-red-600" },
        { title: "중간 배출 섹터", subtitle: "제조, 유통", value: "0.00", toneClassName: "from-slate-50 to-white border-slate-100", valueClassName: "text-slate-600" },
        { title: "저배출 섹터", subtitle: "소프트웨어, 금융", value: "−0.05", toneClassName: "from-blue-50 to-white border-blue-100", valueClassName: "text-blue-600" },
      ],
      note: "산업 조정은 절대 점수 산정보다 동일 산업 내 상대 비교를 위해 적용됩니다.",
    },
    section6: {
      title: "6. 예외 상황 및 데이터 처리",
      missingTitle: "6.1 결측 데이터 처리",
      missingItems: [
        { title: "기준연도 배출량 누락", description: "Ebaseline이 없으면: ARP = 0", toneClassName: "bg-red-50 border-red-500" },
        { title: "목표 데이터 누락", description: "목표 데이터가 없으면: TC = 0", toneClassName: "bg-orange-50 border-orange-500" },
        { title: "공시 데이터 누락", description: "공시 데이터가 없으면: DL = 5", toneClassName: "bg-amber-50 border-amber-500" },
        { title: "ER 하위 항목 누락", description: "해당 하위 항목만 0으로 처리", toneClassName: "bg-yellow-50 border-yellow-500" },
      ],
      increasesTitle: "6.2 배출 증가 시 처리",
      increasesLead: "Ecurrent > Ebaseline 인 경우:",
      increasesDescription: "배출이 증가한 기업은 증가 폭에 비례해 50점 미만의 ARP 점수를 받습니다.",
      firstYearTitle: "6.3 첫 해 데이터만 있는 기업",
      firstYearDescription:
        '1개 연도 데이터만 있는 기업은 TC, ER, DL만으로 잠정 점수를 계산합니다. ARP는 "N/A - 충분한 과거 데이터 부족"으로 표시하고 가중 평균에서 제외하며, 나머지 항목 가중치를 비례 재조정합니다.',
    },
    section7: {
      title: "7. 점수 검증 및 경계값",
      constraintsTitle: "최종 점수 제약 조건",
      constraintsDescription: "모든 최종 점수는 0에서 100 사이로 제한됩니다",
      validationTitle: "구성 점수 검증",
      validationItems: [
        "각 구성 점수 (ARP, TC, ER, DL) ∈ [0, 100]",
        "가중치 합계 = 1.0 (계산 시 검증)",
        "비율 기반 지표는 소수형 [0.0, 1.0] 사용",
        "배출량 값은 0 이상 (tCO₂e)",
      ],
      precisionTitle: "정밀도 및 반올림",
      precisionItems: [
        { title: "중간 계산값", description: "부동소수점 정밀도 사용" },
        { title: "최종 CERS 점수", description: "소수 첫째 자리 반올림" },
        { title: "구성 점수", description: "소수 첫째 자리 반올림" },
        { title: "배출량 값", description: "0.1 MtCO₂e 단위 반올림" },
      ],
    },
    footer: {
      noteLabel: "참고:",
      noteBody:
        "이 점수 로직은 정기적으로 검토되고 보완될 수 있습니다. 본 방법론은 기업 기후행동 측정의 복잡성을 인정하면서도 투명성과 재현가능성을 우선합니다. 가중치와 세부 산식은 이해관계자 피드백과 기후과학 변화에 따라 조정될 수 있습니다.",
      version: "버전 1.0 | 최종 업데이트: 2026년 3월",
    },
  },
  ja: {
    heroTitle: "スコア算定ロジック",
    heroDescription: "CERS（Carbon Emission Reduction Score）方法論の技術ドキュメント",
    overallTitle: "総合スコア算式",
    overallRangeNote: "各構成スコアは 0 から 100 の範囲で算定されます",
    overallDefinitions: [
      { key: "ARP", label: "実際の削減実績スコア (0-100)" },
      { key: "TC", label: "目標の明確さスコア (0-100)" },
      { key: "ER", label: "実行準備度スコア (0-100)" },
      { key: "DL", label: "開示水準スコア (0-100)" },
      { key: "w1-4", label: "構成ウェイト (合計 = 1.0)" },
    ],
    defaultWeightsTitle: "基本ウェイト配分",
    section1: {
      title: "1. 実際の削減実績 (ARP)",
      baseTitle: "1.1 基本算式",
      baselineLabel: "基準年の排出量 (tCO₂e)",
      currentLabel: "現在/最新報告年の排出量 (tCO₂e)",
      actualRateLabel: "実際の削減率",
      actualRateDescription: "(0.15 = 15%削減)",
      modifierTitle: "1.2 軌道一貫性補正",
      modifierLabel: "補正値の計算:",
      modifierRules: [
        { value: "+0.10", description: "分散 < 0.05 の場合（一貫した削減パターン）", valueClassName: "text-teal-600" },
        { value: "−0.10", description: "分散 > 0.15 の場合（変動の大きい軌道）", valueClassName: "text-red-600" },
        { value: "0.00", description: "それ以外", valueClassName: "text-slate-600" },
      ],
      intensityTitle: "1.3 原単位改善と絶対削減の補正",
      intensityOnlyLabel: "(原単位改善のみの場合)",
      absoluteReductionLabel: "(絶対削減の場合)",
      intensityNote: "絶対削減には満額評価を与えます。原単位改善のみの場合は 15% の減点を適用します。",
    },
    section2: {
      title: "2. 目標の明確さ (TC)",
      baseTitle: "2.1 基本算式",
      matrixTitle: "2.2 構成項目スコア表",
      matrixItems: [
        { label: "具体的目標", description: "目標年と削減率が明記されている", value: "25点", toneClassName: "from-teal-50 to-white border-teal-100", valueClassName: "text-teal-600" },
        { label: "SBTi 検証", description: "SBTi 承認/検証", value: "20点", toneClassName: "from-blue-50 to-white border-blue-100", valueClassName: "text-blue-600" },
        { label: "スコープカバレッジ", description: "Scope 1+2+3 を含む", value: "20点", toneClassName: "from-purple-50 to-white border-purple-100", valueClassName: "text-purple-600" },
        { label: "中間マイルストーン", description: "中間目標を保有 (2025, 2030)", value: "15点", toneClassName: "from-indigo-50 to-white border-indigo-100", valueClassName: "text-indigo-600" },
        { label: "ネットゼロ宣言", description: "2050年以前のネットゼロ", value: "10点", toneClassName: "from-green-50 to-white border-green-100", valueClassName: "text-green-600" },
        { label: "目標の野心度", description: "基準年比 50%以上削減", value: "10点", toneClassName: "from-amber-50 to-white border-amber-100", valueClassName: "text-amber-600" },
        { label: "最大スコア", description: "", value: "100", toneClassName: "bg-slate-100 border-slate-300", valueClassName: "text-slate-900" },
      ],
      coverageTitle: "2.3 スコープカバレッジ計算",
      coverageItems: [
        { label: "Scope 1 + 2 + 3 をすべて含む", value: "20点" },
        { label: "Scope 1 + 2 を含む", value: "12点" },
        { label: "Scope 1 のみ", value: "5点" },
        { label: "カバレッジなし", value: "0点" },
      ],
    },
    section3: {
      title: "3. 実行準備度 (ER)",
      baseTitle: "3.1 基本算式",
      roadmapTitle: "3.2 ロードマップスコア（ウェイト 40%）",
      roadmapItems: [
        { label: "詳細アクションプラン", value: "30点" },
        { label: "技術転換イニシアティブ", value: "25点" },
        { label: "再エネ計画", value: "25点" },
        { label: "サプライチェーン関与", value: "20点" },
      ],
      investmentTitle: "3.3 投資スコア（ウェイト 35%）",
      investmentItems: [
        { label: "CAPEX 配分の開示", value: "40点" },
        { label: "気候関連 R&D 投資", value: "35点" },
        { label: "グリーンファイナンスのコミットメント", value: "25点" },
      ],
      governanceTitle: "3.4 ガバナンススコア（ウェイト 25%）",
      governanceItems: [
        { label: "取締役会の気候監督", value: "30点" },
        { label: "経営報酬との連動", value: "30点" },
        { label: "専任気候チーム", value: "25点" },
        { label: "年次進捗報告", value: "15点" },
      ],
    },
    section4: {
      title: "4. 開示水準 (DL)",
      baseTitle: "4.1 基本算式",
      scopeTitle: "4.2 スコープ開示（ウェイト 40%）",
      scopeItems: [
        { label: "Scope 1 開示", value: "25点" },
        { label: "Scope 2 開示", value: "25点" },
        { label: "Scope 3 全面開示", value: "30点" },
        { label: "Scope 3 一部開示", value: "15点" },
        { label: "複数年データ", value: "20点" },
      ],
      verificationTitle: "4.3 検証（ウェイト 30%）",
      verificationItems: [
        { label: "第三者検証", value: "50点" },
        { label: "限定的保証", value: "30点" },
        { label: "内部監査のみ", value: "10点" },
      ],
      frameworkTitle: "4.4 フレームワーク準拠（ウェイト 30%）",
      frameworkItems: [
        { label: "GHG Protocol 準拠", value: "30点" },
        { label: "CDP 開示", value: "25点" },
        { label: "TCFD 整合", value: "25点" },
        { label: "定期更新", value: "20点" },
      ],
    },
    section5: {
      title: "5. 業種文脈調整（任意）",
      description:
        "基本 CERS スコアは業種中立ですが、セクター別ベンチマークのために任意の業種調整係数を適用できます。",
      rangeNote: "IAF の範囲: −0.10 〜 +0.10",
      rows: [
        { title: "削減困難セクター", subtitle: "鉄鋼、セメント、航空", value: "+0.10", toneClassName: "from-red-50 to-white border-red-100", valueClassName: "text-red-600" },
        { title: "中程度排出セクター", subtitle: "製造、小売", value: "0.00", toneClassName: "from-slate-50 to-white border-slate-100", valueClassName: "text-slate-600" },
        { title: "低排出セクター", subtitle: "ソフトウェア、金融", value: "−0.05", toneClassName: "from-blue-50 to-white border-blue-100", valueClassName: "text-blue-600" },
      ],
      note: "業種調整は絶対評価ではなく、同一業種内での相対比較のために適用されます。",
    },
    section6: {
      title: "6. 例外ケースとデータ処理",
      missingTitle: "6.1 欠損データの処理",
      missingItems: [
        { title: "基準年排出量の欠損", description: "Ebaseline が欠損の場合: ARP = 0", toneClassName: "bg-red-50 border-red-500" },
        { title: "目標データの欠損", description: "目標データが欠損の場合: TC = 0", toneClassName: "bg-orange-50 border-orange-500" },
        { title: "開示データの欠損", description: "開示データが欠損の場合: DL = 5", toneClassName: "bg-amber-50 border-amber-500" },
        { title: "ER 下位項目の欠損", description: "該当下位項目のみ 0 とする", toneClassName: "bg-yellow-50 border-yellow-500" },
      ],
      increasesTitle: "6.2 排出増加時の処理",
      increasesLead: "Ecurrent > Ebaseline の場合:",
      increasesDescription: "排出が増加している企業は、増加幅に応じて 50点未満の ARP スコアを受けます。",
      firstYearTitle: "6.3 初年度企業",
      firstYearDescription:
        '1年分のデータしかない企業には、TC・ER・DL のみで暫定スコアを算定します。ARP は "N/A - 十分な履歴データなし" とし、加重平均から除外したうえで残り項目のウェイトを比例再配分します。',
    },
    section7: {
      title: "7. スコア検証と境界条件",
      constraintsTitle: "最終スコア制約",
      constraintsDescription: "すべての最終スコアは 0 から 100 の範囲に制限されます",
      validationTitle: "構成スコア検証",
      validationItems: [
        "各構成スコア (ARP, TC, ER, DL) ∈ [0, 100]",
        "ウェイト合計 = 1.0（計算時に検証）",
        "割合ベース指標は小数形式 [0.0, 1.0] を使用",
        "排出量は 0 以上 (tCO₂e)",
      ],
      precisionTitle: "精度と丸め",
      precisionItems: [
        { title: "中間計算", description: "浮動小数点精度" },
        { title: "最終 CERS スコア", description: "小数第1位に丸め" },
        { title: "構成スコア", description: "小数第1位に丸め" },
        { title: "排出量", description: "0.1 MtCO₂e 単位に丸め" },
      ],
    },
    footer: {
      noteLabel: "注記:",
      noteBody:
        "このスコアロジックは定期的に見直し・改良される可能性があります。本方法論は、企業の気候行動を測る複雑さを認識しつつ、透明性と再現性を優先しています。ウェイト配分や構成式は、ステークホルダーのフィードバックや気候科学の進展に応じて調整されることがあります。",
      version: "Version 1.0 | 最終更新: 2026年3月",
    },
  },
};

type ScoreLogicProps = {
  locale?: SupportedLocale;
};

function FormulaCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-8 rounded-xl mb-8 border border-teal-200">
      {children}
    </div>
  );
}

function ScoreRows({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-700">{item.label}</span>
          <span className="font-bold text-slate-900">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ScoreLogic({ locale = "en" }: ScoreLogicProps) {
  const copy = COPY[locale];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-b border-slate-200 py-16 px-8">
        <div className="max-w-[1000px] mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{copy.heroTitle}</h1>
          <p className="text-lg text-slate-600">{copy.heroDescription}</p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-8 py-12">
        <div className="border border-slate-200 rounded-2xl p-10 mb-10 bg-white">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">{copy.overallTitle}</h2>

          <FormulaCallout>
            <div className="text-center text-3xl font-serif text-slate-800 mb-6">
              CERS = <span className="italic">w</span>₁ × ARP + <span className="italic">w</span>₂ × TC + <span className="italic">w</span>₃ × ER + <span className="italic">w</span>₄ × DL
            </div>
            <div className="text-center text-sm text-slate-600 space-y-1">
              <div>{copy.overallRangeNote}</div>
            </div>
          </FormulaCallout>

          <div className="space-y-3 text-slate-700 mb-8">
            {copy.overallDefinitions.map((item) => (
              <div key={item.key} className="flex items-start gap-3">
                <span className="font-semibold min-w-[60px]">{item.key === "w1-4" ? <><span className="italic">w</span>₁₋₄</> : item.key}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
            <h3 className="font-bold text-slate-900 mb-4">{copy.defaultWeightsTitle}</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: <><span className="italic">w</span>₁ (ARP)</>, value: "0.35" },
                { label: <><span className="italic">w</span>₂ (TC)</>, value: "0.30" },
                { label: <><span className="italic">w</span>₃ (ER)</>, value: "0.20" },
                { label: <><span className="italic">w</span>₄ (DL)</>, value: "0.15" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-10 mb-10 bg-white">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">{copy.section1.title}</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section1.baseTitle}</h3>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="text-center text-2xl font-serif text-slate-800 mb-4">
                  ARP = max(0, min(100, 50 + <span className="italic">R</span><sub>actual</sub> × 100))
                </div>
                <div className="text-center text-xl font-serif text-slate-700">
                  <span className="italic">R</span><sub>actual</sub> = (<span className="italic">E</span><sub>baseline</sub> − <span className="italic">E</span><sub>current</sub>) / <span className="italic">E</span><sub>baseline</sub>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-slate-700 pl-4 border-l-4 border-blue-200">
                <div><span className="font-semibold"><span className="italic">E</span><sub>baseline</sub>:</span> {copy.section1.baselineLabel}</div>
                <div><span className="font-semibold"><span className="italic">E</span><sub>current</sub>:</span> {copy.section1.currentLabel}</div>
                <div><span className="font-semibold"><span className="italic">R</span><sub>actual</sub>:</span> {copy.section1.actualRateLabel} {copy.section1.actualRateDescription}</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section1.modifierTitle}</h3>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <div className="text-center text-2xl font-serif text-slate-800">
                  ARP<sub>adjusted</sub> = ARP × (1 + <span className="italic">m</span><sub>TC</sub>)
                </div>
              </div>

              <div className="mt-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-800 mb-3">{copy.section1.modifierLabel}</div>
                <div className="space-y-2 text-sm text-slate-700">
                  {copy.section1.modifierRules.map((rule) => (
                    <div key={rule.value} className="flex gap-3">
                      <span className={`${rule.valueClassName} font-semibold`}>{rule.value}</span>
                      <span>{rule.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section1.intensityTitle}</h3>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                <div className="text-center text-xl font-serif text-slate-800 space-y-3">
                  <div>ARP<sub>final</sub> = ARP<sub>adjusted</sub> × 0.85 <span className="text-sm text-slate-600">{copy.section1.intensityOnlyLabel}</span></div>
                  <div>ARP<sub>final</sub> = ARP<sub>adjusted</sub> <span className="text-sm text-slate-600">{copy.section1.absoluteReductionLabel}</span></div>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 pl-4 border-l-4 border-amber-200">{copy.section1.intensityNote}</p>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-10 mb-10 bg-white">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">{copy.section2.title}</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section2.baseTitle}</h3>
              <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-xl border border-teal-200">
                <div className="text-center text-2xl font-serif text-slate-800">
                  TC = (Σ component scores / max score) × 100
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section2.matrixTitle}</h3>
              <div className="space-y-3">
                {copy.section2.matrixItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-4"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">{item.label}</div>
                      {item.description ? <div className="text-sm text-slate-600">{item.description}</div> : null}
                    </div>
                    <div className="text-lg font-semibold text-slate-900">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section2.coverageTitle}</h3>
              <ScoreRows items={copy.section2.coverageItems} />
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-10 mb-10 bg-white">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">{copy.section3.title}</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section3.baseTitle}</h3>
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-xl border border-violet-200">
                <div className="text-center text-2xl font-serif text-slate-800">
                  ER = 0.40 × <span className="italic">S</span><sub>roadmap</sub> + 0.35 × <span className="italic">S</span><sub>investment</sub> + 0.25 × <span className="italic">S</span><sub>governance</sub>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section3.roadmapTitle}</h3>
              <ScoreRows items={copy.section3.roadmapItems} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section3.investmentTitle}</h3>
              <ScoreRows items={copy.section3.investmentItems} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section3.governanceTitle}</h3>
              <ScoreRows items={copy.section3.governanceItems} />
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-10 mb-10 bg-white">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">{copy.section4.title}</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section4.baseTitle}</h3>
              <div className="bg-gradient-to-br from-cyan-50 to-sky-50 p-6 rounded-xl border border-cyan-200">
                <div className="text-center text-2xl font-serif text-slate-800">
                  DL = 0.40 × <span className="italic">S</span><sub>scope</sub> + 0.30 × <span className="italic">S</span><sub>verification</sub> + 0.30 × <span className="italic">S</span><sub>framework</sub>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section4.scopeTitle}</h3>
              <ScoreRows items={copy.section4.scopeItems} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section4.verificationTitle}</h3>
              <ScoreRows items={copy.section4.verificationItems} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section4.frameworkTitle}</h3>
              <ScoreRows items={copy.section4.frameworkItems} />
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-10 mb-10 bg-white">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{copy.section5.title}</h2>
          <p className="text-slate-600 mb-6 text-lg">{copy.section5.description}</p>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200 mb-8">
            <div className="text-center text-2xl font-serif text-slate-800">
              CERS<sub>adjusted</sub> = CERS<sub>base</sub> × (1 + IAF)
            </div>
            <div className="text-center text-sm text-slate-600 mt-3">{copy.section5.rangeNote}</div>
          </div>

          <div className="space-y-3">
            {copy.section5.rows.map((row) => (
              <div key={row.title} className={`flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r ${row.toneClassName}`}>
                <div>
                  <div className="font-semibold text-slate-800">{row.title}</div>
                  <div className="text-sm text-slate-600">{row.subtitle}</div>
                </div>
                <div className={`text-xl font-bold ${row.valueClassName}`}>{row.value}</div>
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-500 mt-6 pl-4 border-l-4 border-orange-200">{copy.section5.note}</p>
        </div>

        <div className="border border-slate-200 rounded-2xl p-10 mb-10 bg-white">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">{copy.section6.title}</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section6.missingTitle}</h3>
              <div className="space-y-3">
                {copy.section6.missingItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-blue-100 border-l-4 border-l-blue-300 bg-gradient-to-r from-blue-50 to-white p-4"
                  >
                    <div className="font-semibold text-slate-800 mb-1">{item.title}</div>
                    <div className="text-sm text-slate-700">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section6.increasesTitle}</h3>
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
                <div className="text-lg font-semibold text-slate-800 mb-3">{copy.section6.increasesLead}</div>
                <div className="text-center text-xl font-serif text-slate-800 mb-3">ARP = max(0, 50 − increase% × 100)</div>
                <p className="text-sm text-slate-600">{copy.section6.increasesDescription}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section6.firstYearTitle}</h3>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <p className="text-slate-700 leading-relaxed">{copy.section6.firstYearDescription}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-10 mb-10 bg-white">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">{copy.section7.title}</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section7.constraintsTitle}</h3>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <div className="text-center text-2xl font-serif text-slate-800 mb-3">
                  CERS<sub>final</sub> = max(0, min(100, CERS<sub>calculated</sub>))
                </div>
                <p className="text-center text-sm text-slate-600">{copy.section7.constraintsDescription}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section7.validationTitle}</h3>
              <div className="space-y-2">
                {copy.section7.validationItems.map((item) => (
                  <div key={item} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-slate-700">{item}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{copy.section7.precisionTitle}</h3>
              <div className="grid grid-cols-2 gap-3">
                {copy.section7.precisionItems.map((item) => (
                  <div key={item.title} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-semibold text-slate-800 mb-1">{item.title}</div>
                    <div className="text-sm text-slate-700">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 p-8 rounded-2xl">
          <p className="text-slate-700 leading-relaxed mb-4">
            <strong className="text-slate-900">{copy.footer.noteLabel}</strong> {copy.footer.noteBody}
          </p>
          <p className="text-sm text-slate-500">{copy.footer.version}</p>
        </div>
      </div>
    </div>
  );
}
