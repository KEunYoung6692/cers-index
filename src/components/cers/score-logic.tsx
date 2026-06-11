import type { ReactNode } from "react";
import type { SupportedLocale } from "@/lib/cers/i18n";

const CATEGORY_ORDER = ["cat1", "cat2", "cat3", "cat4"] as const;
const METHOD_STEP_ORDER = ["priors", "preprocessing", "ewm", "shrinkage", "imf", "ema"] as const;
const VARIABLE_GROUP_ORDER = ["cat1", "cat2", "cat3", "cat4"] as const;
const VARIABLE_ORDER = {
  cat1: ["v1", "v2"],
  cat2: ["v3", "v4", "v5", "v6"],
  cat3: ["v7", "v8"],
  cat4: ["v9", "v10"],
} as const;

type CategoryId = (typeof CATEGORY_ORDER)[number];
type MethodStepId = (typeof METHOD_STEP_ORDER)[number];
type VariableGroupId = (typeof VARIABLE_GROUP_ORDER)[number];
type VariableId = (typeof VARIABLE_ORDER)[VariableGroupId][number];

type CopyItem = {
  title: string;
  description: string;
  bullets?: string[];
};

type LogicCopy = {
  heroTitle: string;
  heroDescription: string;
  overallTitle: string;
  overallDescription: string;
  overallNote: string;
  overallDefinitions: Array<{ key: string; label: string }>;
  categoryWeightsTitle: string;
  categoryWeightsDescription: string;
  categories: Record<CategoryId, CopyItem>;
  weightingTitle: string;
  weightingDescription: string;
  methodSteps: Record<MethodStepId, CopyItem>;
  calibrationTitle: string;
  calibrationDescription: string;
  calibrations: Array<{ name: string; value: string; description: string }>;
  variableGroupsTitle: string;
  variableGroupsDescription: string;
  variableGroups: Record<VariableGroupId, CopyItem>;
  variables: Record<VariableId, CopyItem>;
  baseScoreTitle: string;
  baseScoreDescription: string;
  baseScoreBullets: string[];
  adjustmentTitle: string;
  adjustments: {
    cef: CopyItem;
    gv: CopyItem;
  };
  controlsTitle: string;
  controlsItems: string[];
  footerNoteLabel: string;
  footerNoteBody: string;
  version: string;
};

const CATEGORY_WEIGHTS: Record<CategoryId, string> = {
  cat1: "0.40",
  cat2: "0.25",
  cat3: "0.20",
  cat4: "0.15",
};

const METHOD_FORMULAS: Record<MethodStepId, string[]> = {
  priors: ["W^cat = (0.40, 0.25, 0.20, 0.15)"],
  preprocessing: [
    "y_applied,V2,i = max(0, Median_g(y_V2) x (1 - pi_t))",
    "Missing > 30% -> exclude from S_valid(c,g), Missing <= 30% -> sector median fill",
  ],
  ewm: [
    "W^EWM_jg = (1 - E_j) / sum_k(1 - E_k)",
    "W^data-hat_jg = alpha x (1 / n_valid,cg) + (1 - alpha) x W^EWM_jg",
  ],
  shrinkage: [
    "gamma_g = min(1, m_g / N_threshold)",
    "W^data-tilde_jg = gamma_g x W^data-hat_jg(local) + (1 - gamma_g) x W^data-hat_j(global)",
  ],
  imf: [
    "W^final_jg = W^cat_c x W^data-tilde_jg",
    "d_i = rho x tanh(ln R_ind(i))",
    "Cat 1 only: W^calc_1,i = clamp(W^final_1,g + d_i, 0.12, 0.28), W^calc_2,i = 0.40 - W^calc_1,i",
  ],
  ema: ["W^applied_jg,t = theta x W^calc_jg,t + (1 - theta) x W^applied_jg,t-1"],
};

const VARIABLE_FORMULAS: Record<VariableId, string[]> = {
  v1: [
    "I_t = E_t / A_t",
    "S_I = clamp((I_t-1 - I_t) / (I_t-1 x T_I), 0, 1)",
    "B_E = alpha x clamp((E_t-1 - E_t) / (E_t-1 x T_E), 0, 1)",
    "P_E = beta x clamp((E_t - E_t-1) / (E_t-1 x U_E), 0, 1)",
    "Score_V1 = clamp(S_I + B_E - P_E, 0, 1)",
  ],
  v2: [
    "Score_V2 = sum_{c in M}(w_c x ((6 - DQS_c) / 5))",
    "Undisclosed category -> DQS_c = 6",
  ],
  v3: ["Score_V3 = exp(-gamma_short x max(0, (Actual_t - Target_t) / Target_t))"],
  v4: ["Score_V4 = exp(-gamma_mid x max(0, (Actual_t - Target_t) / Target_t))"],
  v5: ["Score_V5 = exp(-gamma_long x max(0, (Actual_t - Target_t) / Target_t))"],
  v6: ["Score_V6 = Score_2050_path x Score_residual_neutralization"],
  v7: [
    "Score_V7 = min(1, (CapEx_green / CapEx_total) / Target_CapEx_ratio)",
    "            x exp(-eta x (CapEx_brown / CapEx_total))",
  ],
  v8: ["Score_V8 = min(1, W_climate-KPI / W_threshold)"],
  v9: [
    "Score_V9 = A_3rd x (0.30S_standard + 0.25S_level + 0.25S_provider + 0.20S_evidence)",
    "S_standard = 0.6S_framework + 0.4S_scope",
    "S_provider = 0.4S_accreditation + 0.3S_independence + 0.3S_expertise",
    "S_evidence = 0.35S_site + 0.35S_trace + 0.30S_controls",
  ],
  v10: [
    "Score_V10 = 0.30S_ICP + 0.20S_MAC + 0.20S_CBA + 0.30S_embed",
    "S_embed = 0.4S_capex + 0.3S_governance + 0.3S_disclosure",
  ],
};

const OVERALL_FORMULAS = ["CERs Score = S_base x CEF x (1 - lambda x GV)"];
const BASE_SCORE_FORMULA = ["S_base = (sum_j W_j x Score_Vj) x 100"];
const CEF_FORMULAS = [
  "Cost_CBAM = sum_i((Q_i x E_embedded,i x F_CBAM) x max(0, P_EU-ETS - P_domestic))",
  "CEF = max(0, 1 - alpha x (Cost_CBAM / EBITDA))",
];
const GV_FORMULAS = [
  "AP = (S_cat2 + S_cat3) / (W_cat2 + W_cat3)",
  "RP = S_cat1 / W_cat1",
  "GV = AP - RP, if RP < tau and AP > RP; otherwise 0",
];

const COPY: Record<SupportedLocale, LogicCopy> = {
  en: {
    heroTitle: "Score Calculation Logic",
    heroDescription: "Technical reference for the revised CERs Index methodology.",
    overallTitle: "Final score framework",
    overallDescription:
      "The revised score starts from ten normalized variables, combines them through hierarchical weights, and only then applies two final risk adjustments.",
    overallNote:
      "The headline score is not the same as the weighted base score. It can move after CBAM exposure and greenwashing divergence checks.",
    overallDefinitions: [
      { key: "S_base", label: "Weighted base score formed from V1-V10 after hierarchical weighting" },
      { key: "CEF", label: "CBAM exposure factor bounded at zero" },
      { key: "GV", label: "Greenwashing divergence penalty triggered when apparent performance exceeds real performance" },
      { key: "lambda", label: "Penalty intensity applied to GV in the final score" },
    ],
    categoryWeightsTitle: "Fixed top-level category weights",
    categoryWeightsDescription:
      "The methodology fixes the upper-level philosophy first. Real decarbonization remains the anchor, and the lower-level rules only redistribute weight inside that frame.",
    categories: {
      cat1: {
        title: "Cat 1. Actual decarbonization performance",
        description: "Intensity improvement, absolute-emissions checks, and Scope 3 transparency in material categories.",
      },
      cat2: {
        title: "Cat 2. Financial credibility of future net-zero targets",
        description: "Short-, mid-, and long-term pathway alignment plus net-zero validity.",
      },
      cat3: {
        title: "Cat 3. Climate governance and capital allocation",
        description: "Green capex direction and executive compensation linkage to climate delivery.",
      },
      cat4: {
        title: "Cat 4. Data integrity and regulatory risk",
        description: "Assurance quality and embedded climate decision tools.",
      },
    },
    weightingTitle: "Hierarchical weighting engine",
    weightingDescription:
      "Lower-level weights are not static. They change with data validity, sample size, entropy, sector materiality, and time-series smoothing.",
    methodSteps: {
      priors: {
        title: "1. Policy priors at the category level",
        description: "The top four categories are fixed before any variable-level data work begins.",
        bullets: ["This locks in the score philosophy.", "Cat 1 remains the largest block by design."],
      },
      preprocessing: {
        title: "2. Pre-processing and valid variable sets",
        description:
          "Raw inputs are winsorized and normalized. Missingness determines whether a variable is filled or removed from sector-level weighting.",
        bullets: [
          "1% and 99% percentiles are used for winsorization.",
          "More than 30% missingness excludes a variable from weighting in that sector.",
          "V2 uses a score-level glide path penalty instead of a flat zero.",
        ],
      },
      ewm: {
        title: "3. Entropy weighting with equal-share protection",
        description:
          "Local and global entropy weights are combined with an equal-share floor so weights do not collapse when companies look too similar.",
        bullets: [
          "Local EWM reflects sector-level dispersion.",
          "Global EWM provides a universe-wide fallback reference.",
        ],
      },
      shrinkage: {
        title: "4. Small-sample protection via Bayesian shrinkage",
        description:
          "When a sector has too few observations, local weights are pulled back toward global weights.",
        bullets: ["N_threshold is the sample-size anchor.", "This prevents unstable sector weights."],
      },
      imf: {
        title: "5. Industry materiality adjustment inside Cat 1",
        description:
          "The sector carbon-intensity ratio only shifts weight between V1 and V2. Other variables keep their hierarchical weight.",
        bullets: [
          "Cat 1 is bounded so V1 cannot exceed 0.28 or fall below 0.12.",
          "V2 takes the remainder of the 0.40 Cat 1 block.",
        ],
      },
      ema: {
        title: "6. Time-series smoothing",
        description:
          "The final applied weight uses EMA so annual updates do not create cliff effects when underlying data changes abruptly.",
        bullets: ["theta sets how fast the model reacts.", "Longer investment cycles imply lower theta."],
      },
    },
    calibrationTitle: "Calibration rules",
    calibrationDescription: "These are the main hyperparameters called out in the current methodology note.",
    calibrations: [
      { name: "alpha", value: "0.20-0.50", description: "Hybrid balance between equal-share protection and entropy weighting." },
      { name: "N_threshold", value: "30", description: "Sample-size threshold for shrinkage toward global weights." },
      { name: "rho", value: "max 0.08", description: "Maximum bounded shift inside Cat 1." },
      { name: "theta", value: "2 / (T + 1)", description: "EMA inertia. Lower when transition investment cycles are longer." },
      { name: "pi_t", value: "0.1 -> 1.0", description: "Phase-in penalty for missing Scope 3 disclosure scores." },
    ],
    variableGroupsTitle: "Variable scoring logic",
    variableGroupsDescription:
      "Each public score area is built from named variables. The detailed rules below follow the current cers_index.md reference.",
    variableGroups: {
      cat1: {
        title: "Cat 1 variables",
        description: "Actual operational improvement plus value-chain transparency.",
      },
      cat2: {
        title: "Cat 2 variables",
        description: "Target-path discipline and net-zero validity.",
      },
      cat3: {
        title: "Cat 3 variables",
        description: "Capital allocation and management incentives.",
      },
      cat4: {
        title: "Cat 4 variables",
        description: "Assurance quality and embedded climate decision systems.",
      },
    },
    variables: {
      v1: {
        title: "V1. Carbon reduction achievement",
        description:
          "The method centers on intensity improvement, then adjusts it with an absolute-emissions bonus and penalty so growth effects and pure narrative gains do not distort the result.",
        bullets: [
          "T_I uses the required annual intensity-improvement rate.",
          "alpha is the bonus strength for absolute reduction.",
          "beta is the penalty strength for absolute emissions increase.",
        ],
      },
      v2: {
        title: "V2. Scope 3 value-chain data transparency",
        description:
          "The score borrows PCAF-style data quality logic and weights only the material Scope 3 categories for that sector.",
        bullets: [
          "Primary data scores best; spend-based estimates score worst.",
          "Undisclosed categories are treated as DQS = 6.",
          "Material categories are sector-specific.",
        ],
      },
      v3: {
        title: "V3. Short-term target pathway alignment",
        description:
          "Short-term overshoot is penalized with the strongest decay parameter because near-term delivery matters most.",
        bullets: ["Typical short-term gamma is set highest.", "No disclosed target means the score is zero."],
      },
      v4: {
        title: "V4. Mid-term target pathway alignment",
        description: "Mid-term overshoot uses the same structure but a milder penalty than short-term misses.",
      },
      v5: {
        title: "V5. Long-term target pathway alignment",
        description: "Long-term overshoot still matters, but the decay rate is softer than in the short-term path.",
        bullets: ["The note uses gamma_long = 2 as the reference example."],
      },
      v6: {
        title: "V6. Net-zero validity and ambition",
        description:
          "A long-term target only scores well when the 2050 pathway is credible and the residual-emissions treatment is not just offset-heavy window dressing.",
        bullets: [
          "Checks scope coverage and depth of reduction.",
          "Residual-neutralization quality is scored separately, then multiplied.",
        ],
      },
      v7: {
        title: "V7. Climate alignment of capital expenditure",
        description:
          "Green capex is rewarded, but brown capex receives an exponential penalty so transition claims do not outrun actual investment allocation.",
        bullets: [
          "Target_CapEx_ratio can vary by sector.",
          "eta controls sensitivity to brown-capex exposure.",
        ],
      },
      v8: {
        title: "V8. Executive compensation linkage",
        description:
          "This measures how much of management compensation is financially tied to climate KPI delivery.",
        bullets: ["A higher climate-KPI weight scores better.", "The score is capped at one."],
      },
      v9: {
        title: "V9. Third-party assurance quality",
        description:
          "Assurance only counts when an independent third party exists. The score then checks standard, assurance level, provider quality, and evidence depth.",
        bullets: [
          "No independent third party means A_3rd = 0.",
          "Reasonable assurance scores higher than limited assurance.",
          "Provider quality depends on accreditation, independence, and expertise.",
        ],
      },
      v10: {
        title: "V10. Embedded climate decision tools",
        description:
          "This measures whether tools such as internal carbon pricing, MACC, and cost-benefit analysis are actually embedded in capex and governance decisions.",
        bullets: [
          "Mention alone scores lower than active operational use.",
          "Disclosure of assumptions and real use cases matters inside S_embed.",
        ],
      },
    },
    baseScoreTitle: "Base score formation",
    baseScoreDescription:
      "After each variable is normalized to a 0-1 range and weighted through the hierarchy above, the model forms a 0-100 base score.",
    baseScoreBullets: [
      "Applied weights come after validity checks, entropy weighting, shrinkage, Cat 1 bounded shift, and EMA smoothing.",
      "S_base is the last score before external risk adjustments.",
      "Category-level narrative alone cannot bypass low V1 or V2 performance.",
    ],
    adjustmentTitle: "External adjustments after S_base",
    adjustments: {
      cef: {
        title: "CBAM exposure factor (CEF)",
        description:
          "CEF discounts the score when the implied CBAM burden becomes material relative to EBITDA.",
        bullets: [
          "Cost_CBAM uses export quantity, embedded emissions, free-allocation phase-out, and the carbon-price gap.",
          "CEF is floored at zero.",
        ],
      },
      gv: {
        title: "Greenwashing divergence penalty (GV)",
        description:
          "GV activates only when apparent performance in Cat 2 and Cat 3 exceeds real performance in Cat 1, while real performance remains below the threshold tau.",
        bullets: [
          "AP reads apparent performance from Cat 2 and Cat 3.",
          "RP reads real performance from Cat 1.",
          "If 1 - lambda x GV turns negative, the final penalty floor is zero.",
        ],
      },
    },
    controlsTitle: "Boundary and data-handling rules",
    controlsItems: [
      "Raw variables are winsorized at the 1st and 99th percentiles before normalization.",
      "Sector-level variables with more than 30% missingness can be removed from weighting.",
      "Sector median filling is allowed when missingness stays at or below 30%.",
      "Missing V2 uses a phased glide-path penalty instead of a simple zero.",
      "Cat 1 reweighting is bounded and cannot move outside the predefined range.",
      "The final score is floored at zero after CEF and GV are applied.",
    ],
    footerNoteLabel: "Note:",
    footerNoteBody:
      "This page reflects the current March 2026 methodology note in config/cers_index.md. Operational calibration can still move as the scoring backend is finalized, but the structural logic shown here matches the revised document.",
    version: "Version 2.0 | Last updated: March 2026",
  },
  ko: {
    heroTitle: "점수 산정 로직",
    heroDescription: "개정된 CERs Index 방법론을 설명하는 기술 참고 페이지입니다.",
    overallTitle: "최종 점수 구조",
    overallDescription:
      "개정된 점수는 10개 정규화 변수에서 시작해 계층 가중치로 기초점수를 만들고, 그 뒤 두 개의 외생 보정항을 적용합니다.",
    overallNote:
      "헤드라인 점수는 단순 가중 평균과 같지 않습니다. 기초점수 이후에도 CBAM 노출과 그린워싱 괴리 검사를 거칩니다.",
    overallDefinitions: [
      { key: "S_base", label: "V1-V10과 계층 가중치로 형성된 기초점수" },
      { key: "CEF", label: "0 이하로 내려가지 않도록 바운드된 CBAM 노출 계수" },
      { key: "GV", label: "외견상 성과가 실질 성과를 초과할 때 작동하는 그린워싱 괴리 패널티" },
      { key: "lambda", label: "GV가 최종 점수에 반영되는 강도 상수" },
    ],
    categoryWeightsTitle: "고정된 상위 카테고리 가중치",
    categoryWeightsDescription:
      "방법론은 먼저 상위 철학을 고정합니다. 실질 탈탄소 성과를 가장 크게 두고, 하위 규칙은 그 틀 안에서만 가중치를 재배분합니다.",
    categories: {
      cat1: {
        title: "Cat 1. 실질 탈탄소 성과",
        description: "집약도 개선, 절대배출 검증, 그리고 중대 Scope 3 투명성을 함께 봅니다.",
      },
      cat2: {
        title: "Cat 2. 미래 넷제로 목표의 재무적 신뢰도",
        description: "단기·중기·장기 목표 경로 정렬과 넷제로 타당성을 봅니다.",
      },
      cat3: {
        title: "Cat 3. 기후 거버넌스와 자본 배분",
        description: "Green CapEx 방향과 기후 KPI 기반 경영진 보상 연계를 봅니다.",
      },
      cat4: {
        title: "Cat 4. 데이터 무결성 및 규제 리스크",
        description: "제3자 검증의 질과 기후 의사결정 도구의 내재화를 봅니다.",
      },
    },
    weightingTitle: "계층형 가중치 엔진",
    weightingDescription:
      "하위 가중치는 고정값이 아닙니다. 데이터 유효성, 표본 수, 엔트로피, 산업 중대성, 시계열 평활화에 따라 달라집니다.",
    methodSteps: {
      priors: {
        title: "1. 상위 정책 가중치 고정",
        description: "변수 수준 계산에 들어가기 전에 네 개 대분류의 가중치를 먼저 고정합니다.",
        bullets: ["점수 철학을 먼저 잠급니다.", "Cat 1이 가장 큰 블록으로 유지됩니다."],
      },
      preprocessing: {
        title: "2. 전처리와 유효 변수 집합 정의",
        description:
          "원시값은 윈저라이징과 정규화를 거치고, 결측률에 따라 보간 또는 제외가 결정됩니다.",
        bullets: [
          "1%와 99% 백분위수로 극단값을 통제합니다.",
          "결측률 30% 초과 변수는 해당 섹터 가중치 산정에서 제외될 수 있습니다.",
          "V2는 단순 0점이 아니라 score-level glide path 페널티를 씁니다.",
        ],
      },
      ewm: {
        title: "3. 엔트로피 가중치와 동일배분 보호",
        description:
          "기업들이 너무 비슷할 때 가중치가 무너지는 것을 막기 위해 엔트로피 가중치에 동일배분 하한을 섞습니다.",
        bullets: ["Local EWM은 섹터 내부 분산을 반영합니다.", "Global EWM은 전체 유니버스 기준 참조치입니다."],
      },
      shrinkage: {
        title: "4. 소표본 방어를 위한 베이지안 축소",
        description:
          "섹터 표본이 부족하면 local 가중치를 global 가중치 쪽으로 끌어당겨 불안정성을 줄입니다.",
        bullets: ["N_threshold가 축소 기준점입니다.", "작은 섹터에서 과민한 가중치 변동을 막습니다."],
      },
      imf: {
        title: "5. Cat 1 내부 산업 중대성 반영",
        description:
          "산업 탄소집약도 비율은 V1과 V2 사이에서만 가중치를 이동시킵니다. 나머지 변수는 계층 가중치를 유지합니다.",
        bullets: [
          "Cat 1은 경계값이 있어 V1이 0.28을 넘거나 0.12 아래로 내려가지 않습니다.",
          "V2는 Cat 1의 나머지 비중을 가져갑니다.",
        ],
      },
      ema: {
        title: "6. 시계열 평활화",
        description:
          "연도별 절벽 효과를 막기 위해 최종 적용 가중치는 EMA로 부드럽게 갱신됩니다.",
        bullets: ["theta가 반응 속도를 결정합니다.", "투자 회수 기간이 길수록 theta는 낮아집니다."],
      },
    },
    calibrationTitle: "캘리브레이션 규칙",
    calibrationDescription: "현재 문서에서 명시한 주요 하이퍼파라미터입니다.",
    calibrations: [
      { name: "alpha", value: "0.20-0.50", description: "동일배분 보호와 엔트로피 가중치의 혼합 비중입니다." },
      { name: "N_threshold", value: "30", description: "global 가중치로 축소가 시작되는 표본 기준입니다." },
      { name: "rho", value: "max 0.08", description: "Cat 1 내부 bounded shift의 최대 이동 폭입니다." },
      { name: "theta", value: "2 / (T + 1)", description: "EMA 관성 계수입니다. 투자 주기가 길수록 낮아집니다." },
      { name: "pi_t", value: "0.1 -> 1.0", description: "Scope 3 미공시에 적용되는 단계별 페널티입니다." },
    ],
    variableGroupsTitle: "변수별 산정 로직",
    variableGroupsDescription:
      "공개 화면의 각 점수 차원은 실제로는 아래 변수들로 구성됩니다. 상세 규칙은 현재 cers_index.md 기준을 따릅니다.",
    variableGroups: {
      cat1: {
        title: "Cat 1 변수",
        description: "실제 운영 성과와 가치사슬 투명성.",
      },
      cat2: {
        title: "Cat 2 변수",
        description: "목표 경로 준수와 넷제로 타당성.",
      },
      cat3: {
        title: "Cat 3 변수",
        description: "자본 배분과 경영진 인센티브.",
      },
      cat4: {
        title: "Cat 4 변수",
        description: "검증 품질과 기후 의사결정 시스템.",
      },
    },
    variables: {
      v1: {
        title: "V1. 탄소배출 개선 달성도",
        description:
          "핵심은 집약도 개선입니다. 다만 절대배출이 크게 늘어난 기업이 높은 점수를 받지 않도록 절대감축 보너스와 절대증가 패널티를 함께 적용합니다.",
        bullets: [
          "T_I는 연간 요구 집약도 개선율입니다.",
          "alpha는 절대감축 보너스 강도입니다.",
          "beta는 절대배출 증가 패널티 강도입니다.",
        ],
      },
      v2: {
        title: "V2. Scope 3 가치사슬 데이터 투명성",
        description:
          "PCAF형 데이터 품질 로직을 활용하고, 해당 섹터에서 중요한 Scope 3 카테고리만 가중 반영합니다.",
        bullets: [
          "1차 데이터가 가장 높은 점수를 받습니다.",
          "미공시 카테고리는 DQS = 6으로 처리합니다.",
          "중대 카테고리는 섹터별로 달라집니다.",
        ],
      },
      v3: {
        title: "V3. 단기 목표 경로 준수도",
        description:
          "가까운 시점 목표를 놓치는 경우 가장 강한 붕괴 계수를 적용해 점수가 빠르게 낮아지도록 설계합니다.",
        bullets: ["단기 gamma가 가장 큽니다.", "목표 미공시 기업은 0점입니다."],
      },
      v4: {
        title: "V4. 중기 목표 경로 준수도",
        description: "중기 목표는 같은 구조를 쓰되 단기보다 완만한 페널티를 적용합니다.",
      },
      v5: {
        title: "V5. 장기 목표 경로 준수도",
        description: "장기 목표도 경로 이탈을 감점하지만, 단기보다 완만한 decay를 사용합니다.",
        bullets: ["문서 예시에서는 gamma_long = 2를 사용합니다."],
      },
      v6: {
        title: "V6. 넷제로 목표 타당성 및 야심",
        description:
          "2050 경로의 신뢰성과 잔여배출 중립화 계획이 모두 타당해야 높은 점수를 받습니다. 단순 offset 선언만으로는 부족합니다.",
        bullets: [
          "스코프 포괄성과 감축 깊이를 함께 봅니다.",
          "잔여배출 처리 계획은 별도 점수로 산정한 뒤 곱셈으로 결합합니다.",
        ],
      },
      v7: {
        title: "V7. 자본 지출의 기후 정렬도",
        description:
          "Green CapEx는 올려주고 Brown CapEx는 지수형 패널티를 줘서, 전환 서사가 실제 투자 배분보다 앞서가는 상황을 막습니다.",
        bullets: [
          "Target_CapEx_ratio는 산업별로 다를 수 있습니다.",
          "eta는 Brown CapEx에 대한 민감도입니다.",
        ],
      },
      v8: {
        title: "V8. 경영진 보상 연계율",
        description:
          "경영진 보상 중 얼마나 많은 비중이 기후 KPI 달성과 재무적으로 연결돼 있는지를 측정합니다.",
        bullets: ["기후 KPI 비중이 높을수록 점수가 높습니다.", "점수는 1을 상한으로 둡니다."],
      },
      v9: {
        title: "V9. 제3자 검증 및 보증의 질",
        description:
          "독립적인 제3자가 있을 때만 점수가 작동합니다. 그 위에 검증 기준, 보증 수준, 기관 신뢰도, 증거 깊이를 쌓습니다.",
        bullets: [
          "독립 제3자가 없으면 A_3rd = 0입니다.",
          "reasonable assurance가 limited assurance보다 높습니다.",
          "기관 점수는 인정, 독립성, 전문성으로 구성됩니다.",
        ],
      },
      v10: {
        title: "V10. 기후 의사결정 도구의 내재화 수준",
        description:
          "내부탄소가격, MACC, 경제성 평가가 실제 CapEx와 거버넌스 의사결정에 들어가 있는지를 측정합니다.",
        bullets: [
          "단순 언급보다 실제 운영 활용이 더 높은 점수를 받습니다.",
          "적용 범위와 활용 사례 공개 수준도 S_embed에 반영됩니다.",
        ],
      },
    },
    baseScoreTitle: "기초점수 형성",
    baseScoreDescription:
      "각 변수를 0~1로 정규화하고 계층 가중치를 적용한 뒤, 0~100 스케일의 기초점수를 만듭니다.",
    baseScoreBullets: [
      "적용 가중치는 유효성 검토, 엔트로피, 축소, Cat 1 재배분, EMA 이후 확정됩니다.",
      "S_base는 외생 위험 보정 전 마지막 점수입니다.",
      "상위 카테고리 서사만으로 낮은 V1 또는 V2를 우회할 수 없습니다.",
    ],
    adjustmentTitle: "S_base 이후 외생 보정",
    adjustments: {
      cef: {
        title: "CBAM 노출 계수 (CEF)",
        description:
          "추정 CBAM 부담이 EBITDA 대비 커질수록 점수를 할인합니다.",
        bullets: [
          "Cost_CBAM은 수출량, 내재배출량, 무료할당 폐지계수, 탄소가격 차이를 함께 사용합니다.",
          "CEF의 하한은 0입니다.",
        ],
      },
      gv: {
        title: "그린워싱 괴리 패널티 (GV)",
        description:
          "Cat 2와 Cat 3의 외견상 성과가 Cat 1의 실질 성과보다 크고, 동시에 실질 성과가 임계치보다 낮을 때만 작동합니다.",
        bullets: [
          "AP는 Cat 2와 Cat 3에서 읽습니다.",
          "RP는 Cat 1에서 읽습니다.",
          "1 - lambda x GV가 음수가 되면 최종 계수는 0으로 처리합니다.",
        ],
      },
    },
    controlsTitle: "경계값 및 데이터 처리 규칙",
    controlsItems: [
      "원시 변수는 정규화 전에 1%와 99% 백분위수 기준으로 윈저라이징됩니다.",
      "섹터 수준에서 결측률 30%를 넘는 변수는 가중치 산정에서 제외될 수 있습니다.",
      "결측률 30% 이하 변수는 섹터 중앙값 대체가 가능합니다.",
      "V2 결측은 단순 0점이 아니라 연착륙형 glide path 페널티를 사용합니다.",
      "Cat 1 재가중은 경계값 안에서만 움직입니다.",
      "최종 점수는 CEF와 GV 적용 후 0을 하한으로 둡니다.",
    ],
    footerNoteLabel: "참고:",
    footerNoteBody:
      "이 페이지는 2026년 3월 기준 `config/cers_index.md` 문서를 반영합니다. 스코어링 백엔드가 마무리되면서 실무 캘리브레이션은 더 조정될 수 있지만, 여기 표시된 구조적 로직은 개정 문서와 맞춰두었습니다.",
    version: "버전 2.0 | 최종 업데이트: 2026년 3월",
  },
  ja: {
    heroTitle: "スコア算定ロジック",
    heroDescription: "改訂された CERs Index 方法論を説明する技術リファレンスです。",
    overallTitle: "最終スコア構造",
    overallDescription:
      "改訂後のスコアは 10 個の正規化変数から始まり、階層ウェイトで基礎スコアを作った後に 2 つの外生補正項を適用します。",
    overallNote:
      "見出しのスコアは単純な加重平均ではありません。基礎スコアの後にも CBAM 露出とグリーンウォッシング乖離の検査が入ります。",
    overallDefinitions: [
      { key: "S_base", label: "V1-V10 と階層ウェイトで形成される基礎スコア" },
      { key: "CEF", label: "0 未満に落ちないよう下限がある CBAM 露出係数" },
      { key: "GV", label: "見かけの成果が実質成果を上回るときに働くグリーンウォッシング乖離ペナルティ" },
      { key: "lambda", label: "GV を最終スコアに反映する強度係数" },
    ],
    categoryWeightsTitle: "固定された上位カテゴリウェイト",
    categoryWeightsDescription:
      "方法論はまず上位の哲学を固定します。実質的な脱炭素成果を最も重く置き、下位ルールはその枠の中だけで重みを再配分します。",
    categories: {
      cat1: {
        title: "Cat 1. 実質的な脱炭素成果",
        description: "原単位改善、絶対排出の検証、重要 Scope 3 透明性を合わせて見ます。",
      },
      cat2: {
        title: "Cat 2. 将来のネットゼロ目標の財務的信頼性",
        description: "短期・中期・長期の経路整合性とネットゼロ妥当性を見ます。",
      },
      cat3: {
        title: "Cat 3. 気候ガバナンスと資本配分",
        description: "Green CapEx の方向性と気候 KPI 連動報酬を見ます。",
      },
      cat4: {
        title: "Cat 4. データ完全性と規制リスク",
        description: "第三者保証の質と気候意思決定ツールの内在化を見ます。",
      },
    },
    weightingTitle: "階層型ウェイトエンジン",
    weightingDescription:
      "下位ウェイトは固定値ではありません。データ有効性、標本数、エントロピー、産業重要度、時系列平滑化によって変わります。",
    methodSteps: {
      priors: {
        title: "1. 上位政策ウェイトの固定",
        description: "変数レベルの計算に入る前に、4 つの大分類ウェイトを先に固定します。",
        bullets: ["まずスコア哲学を固定します。", "Cat 1 は設計上もっとも大きいブロックです。"],
      },
      preprocessing: {
        title: "2. 前処理と有効変数集合",
        description:
          "生データはウィンザー化と正規化を経て、欠損率に応じて補完または除外が決まります。",
        bullets: [
          "1% と 99% の百分位で極端値を制御します。",
          "欠損率が 30% を超える変数は、そのセクターのウェイト計算から外れることがあります。",
          "V2 は単純な 0 点ではなく score-level glide path ペナルティを使います。",
        ],
      },
      ewm: {
        title: "3. エントロピーウェイトと均等配分保護",
        description:
          "企業間の差が小さすぎるときにウェイトが崩れないよう、エントロピーウェイトに均等配分の下支えを混ぜます。",
        bullets: ["Local EWM はセクター内分散を反映します。", "Global EWM は全体ユニバース基準の参照値です。"],
      },
      shrinkage: {
        title: "4. 小標本防御のためのベイズ縮小",
        description:
          "セクター標本が少ないときは、local ウェイトを global ウェイト側へ引き戻して不安定性を抑えます。",
        bullets: ["N_threshold が縮小の基準点です。", "小さなセクターで過敏なウェイト変動を防ぎます。"],
      },
      imf: {
        title: "5. Cat 1 内部の産業重要度反映",
        description:
          "産業炭素集約度比率は V1 と V2 の間でのみ重みを移動させます。他の変数は階層ウェイトを維持します。",
        bullets: [
          "Cat 1 には境界があり、V1 は 0.28 を超えず 0.12 を下回りません。",
          "V2 は Cat 1 の残りを受け取ります。",
        ],
      },
      ema: {
        title: "6. 時系列平滑化",
        description:
          "年次更新の崖効果を避けるため、最終適用ウェイトは EMA で滑らかに更新されます。",
        bullets: ["theta が反応速度を決めます。", "投資回収期間が長いほど theta は低くなります。"],
      },
    },
    calibrationTitle: "キャリブレーション規則",
    calibrationDescription: "現在の文書で明示されている主要ハイパーパラメータです。",
    calibrations: [
      { name: "alpha", value: "0.20-0.50", description: "均等配分保護とエントロピーウェイトの混合比です。" },
      { name: "N_threshold", value: "30", description: "global ウェイトへの縮小が始まる標本基準です。" },
      { name: "rho", value: "max 0.08", description: "Cat 1 内部 bounded shift の最大移動幅です。" },
      { name: "theta", value: "2 / (T + 1)", description: "EMA 慣性係数です。投資周期が長いほど低くなります。" },
      { name: "pi_t", value: "0.1 -> 1.0", description: "Scope 3 未開示に対する段階的ペナルティです。" },
    ],
    variableGroupsTitle: "変数別ロジック",
    variableGroupsDescription:
      "公開画面の各スコア領域は、実際には下記の変数群から構成されます。詳細ルールは現行の cers_index.md に合わせています。",
    variableGroups: {
      cat1: {
        title: "Cat 1 変数",
        description: "実際の運用成果とバリューチェーン透明性。",
      },
      cat2: {
        title: "Cat 2 変数",
        description: "目標経路順守とネットゼロ妥当性。",
      },
      cat3: {
        title: "Cat 3 変数",
        description: "資本配分と経営インセンティブ。",
      },
      cat4: {
        title: "Cat 4 変数",
        description: "保証品質と気候意思決定システム。",
      },
    },
    variables: {
      v1: {
        title: "V1. 炭素排出改善達成度",
        description:
          "中心は原単位改善です。ただし絶対排出が大きく増えている企業が高得点にならないよう、絶対削減ボーナスと絶対増加ペナルティを併用します。",
        bullets: [
          "T_I は要求される年間原単位改善率です。",
          "alpha は絶対削減ボーナスの強さです。",
          "beta は絶対排出増加ペナルティの強さです。",
        ],
      },
      v2: {
        title: "V2. Scope 3 バリューチェーンデータ透明性",
        description:
          "PCAF 型のデータ品質ロジックを使い、そのセクターで重要な Scope 3 カテゴリだけを加重評価します。",
        bullets: [
          "一次データが最も高く評価されます。",
          "未開示カテゴリは DQS = 6 として扱います。",
          "重要カテゴリはセクターごとに異なります。",
        ],
      },
      v3: {
        title: "V3. 短期目標経路順守",
        description:
          "近い時点の目標を外した場合は最も強い崩壊係数を使い、スコアが速く下がるよう設計されています。",
        bullets: ["短期 gamma が最大です。", "目標未開示企業は 0 点です。"],
      },
      v4: {
        title: "V4. 中期目標経路順守",
        description: "中期目標は同じ構造を使いますが、短期より緩やかなペナルティです。",
      },
      v5: {
        title: "V5. 長期目標経路順守",
        description: "長期目標も経路逸脱を減点しますが、短期より穏やかな decay を使います。",
        bullets: ["文書の例では gamma_long = 2 を参照値にしています。"],
      },
      v6: {
        title: "V6. ネットゼロ目標の妥当性と意欲",
        description:
          "2050 経路の信頼性と残余排出中和計画の両方が妥当でなければ高得点になりません。単なる offset 宣言では不十分です。",
        bullets: [
          "スコープの網羅性と削減深度を見ます。",
          "残余排出処理は別スコア化し、最後に乗算します。",
        ],
      },
      v7: {
        title: "V7. 資本支出の気候整合性",
        description:
          "Green CapEx を評価しつつ Brown CapEx には指数型ペナルティを与え、移行ストーリーが実投資配分を追い越さないようにします。",
        bullets: [
          "Target_CapEx_ratio は産業ごとに異なり得ます。",
          "eta は Brown CapEx への感応度です。",
        ],
      },
      v8: {
        title: "V8. 経営報酬連動率",
        description:
          "経営報酬のうち、どれだけが気候 KPI の達成と財務的に連動しているかを測ります。",
        bullets: ["気候 KPI 比率が高いほど高得点です。", "スコア上限は 1 です。"],
      },
      v9: {
        title: "V9. 第三者保証と検証の質",
        description:
          "独立した第三者がいる場合にのみスコアが動きます。その上で、検証基準、保証水準、機関信頼性、証拠の深さを見ます。",
        bullets: [
          "独立第三者がなければ A_3rd = 0 です。",
          "reasonable assurance は limited assurance より高いです。",
          "機関スコアは認定、独立性、専門性で構成されます。",
        ],
      },
      v10: {
        title: "V10. 気候意思決定ツールの内在化水準",
        description:
          "内部炭素価格、MACC、経済性評価が実際の CapEx とガバナンス意思決定に組み込まれているかを見ます。",
        bullets: [
          "単なる言及より実運用の方が高得点です。",
          "適用範囲と活用事例の開示も S_embed に反映されます。",
        ],
      },
    },
    baseScoreTitle: "基礎スコア形成",
    baseScoreDescription:
      "各変数を 0~1 に正規化し、階層ウェイトを適用した後、0~100 スケールの基礎スコアを作ります。",
    baseScoreBullets: [
      "適用ウェイトは有効性確認、エントロピー、縮小、Cat 1 再配分、EMA の後に確定します。",
      "S_base は外生リスク補正前の最後のスコアです。",
      "上位カテゴリの物語だけで低い V1 や V2 を迂回することはできません。",
    ],
    adjustmentTitle: "S_base 後の外生補正",
    adjustments: {
      cef: {
        title: "CBAM 露出係数 (CEF)",
        description:
          "推定 CBAM 負担が EBITDA に対して大きくなるほどスコアを割り引きます。",
        bullets: [
          "Cost_CBAM は輸出量、内在排出量、無料割当廃止係数、炭素価格差を使います。",
          "CEF の下限は 0 です。",
        ],
      },
      gv: {
        title: "グリーンウォッシング乖離ペナルティ (GV)",
        description:
          "Cat 2 と Cat 3 の見かけの成果が Cat 1 の実質成果を上回り、かつ実質成果が閾値より低いときにのみ作動します。",
        bullets: [
          "AP は Cat 2 と Cat 3 から読みます。",
          "RP は Cat 1 から読みます。",
          "1 - lambda x GV が負になる場合、最終係数は 0 に処理されます。",
        ],
      },
    },
    controlsTitle: "境界値とデータ処理ルール",
    controlsItems: [
      "生変数は正規化前に 1% と 99% 百分位でウィンザー化されます。",
      "セクター水準で欠損率 30% を超える変数はウェイト計算から外れることがあります。",
      "欠損率 30% 以下の変数はセクター中央値で補完できます。",
      "V2 欠損には単純 0 点ではなく glide path 型ペナルティを使います。",
      "Cat 1 再配分は境界の中だけで動きます。",
      "最終スコアは CEF と GV 適用後も 0 を下限にします。",
    ],
    footerNoteLabel: "注記:",
    footerNoteBody:
      "このページは 2026 年 3 月時点の `config/cers_index.md` を反映しています。スコアリング backend の最終化に伴って実務キャリブレーションは動く可能性がありますが、ここに示した構造ロジックは改訂文書に合わせています。",
    version: "Version 2.0 | 最終更新: 2026年3月",
  },
};

type ScoreLogicProps = {
  locale?: SupportedLocale;
};

function FormulaCallout({
  children,
  toneClassName = "from-teal-50 to-blue-50 border-teal-200",
}: {
  children: ReactNode;
  toneClassName?: string;
}) {
  return <div className={`mb-8 rounded-xl border bg-gradient-to-br p-8 ${toneClassName}`}>{children}</div>;
}

function FormulaBlock({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-3">
      {lines.map((line) => (
        <div key={line} className="whitespace-pre-wrap text-center font-serif text-xl text-slate-800 md:text-2xl">
          {line}
        </div>
      ))}
    </div>
  );
}

function BulletList({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-4 space-y-2">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm leading-6 text-slate-700"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function SectionCard({ children }: { children: ReactNode }) {
  return <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-10">{children}</div>;
}

export default function ScoreLogic({ locale = "en" }: ScoreLogicProps) {
  const copy = COPY[locale];

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200 bg-gradient-to-br from-teal-50 to-blue-50 px-8 py-16">
        <div className="mx-auto max-w-[1000px]">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">{copy.heroTitle}</h1>
          <p className="text-lg text-slate-600">{copy.heroDescription}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px] px-8 py-12">
        <SectionCard>
          <h2 className="mb-4 text-3xl font-bold text-slate-900">{copy.overallTitle}</h2>
          <p className="mb-8 text-lg leading-8 text-slate-600">{copy.overallDescription}</p>

          <FormulaCallout>
            <FormulaBlock lines={OVERALL_FORMULAS} />
            <div className="mt-6 text-center text-sm text-slate-600">{copy.overallNote}</div>
          </FormulaCallout>

          <div className="space-y-3 text-slate-700">
            {copy.overallDefinitions.map((item) => (
              <div key={item.key} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="min-w-[90px] font-semibold text-slate-900">{item.key}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <h2 className="mb-4 text-3xl font-bold text-slate-900">{copy.categoryWeightsTitle}</h2>
          <p className="mb-8 text-lg leading-8 text-slate-600">{copy.categoryWeightsDescription}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {CATEGORY_ORDER.map((categoryId) => (
              <div key={categoryId} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-slate-900">{copy.categories[categoryId].title}</h3>
                  <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800">
                    {CATEGORY_WEIGHTS[categoryId]}
                  </span>
                </div>
                <p className="text-sm leading-7 text-slate-600">{copy.categories[categoryId].description}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <h2 className="mb-4 text-3xl font-bold text-slate-900">{copy.weightingTitle}</h2>
          <p className="mb-8 text-lg leading-8 text-slate-600">{copy.weightingDescription}</p>

          <div className="space-y-5">
            {METHOD_STEP_ORDER.map((stepId) => (
              <div key={stepId} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-xl font-semibold text-slate-900">{copy.methodSteps[stepId].title}</h3>
                <p className="mt-3 text-base leading-8 text-slate-600">{copy.methodSteps[stepId].description}</p>
                <div className="mt-5 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5">
                  <div className="space-y-3">
                    {METHOD_FORMULAS[stepId].map((line) => (
                      <div key={line} className="whitespace-pre-wrap text-center font-serif text-lg text-slate-800">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
                <BulletList items={copy.methodSteps[stepId].bullets} />
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-semibold text-slate-900">{copy.calibrationTitle}</h3>
            <p className="mt-3 text-base leading-8 text-slate-600">{copy.calibrationDescription}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {copy.calibrations.map((item) => (
                <div key={item.name} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">{item.name}</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">{item.value}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <h2 className="mb-4 text-3xl font-bold text-slate-900">{copy.variableGroupsTitle}</h2>
          <p className="mb-8 text-lg leading-8 text-slate-600">{copy.variableGroupsDescription}</p>

          <div className="space-y-8">
            {VARIABLE_GROUP_ORDER.map((groupId) => (
              <div key={groupId} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="mb-5">
                  <h3 className="text-2xl font-semibold text-slate-900">{copy.variableGroups[groupId].title}</h3>
                  <p className="mt-3 text-base leading-8 text-slate-600">{copy.variableGroups[groupId].description}</p>
                </div>

                <div className="space-y-4">
                  {VARIABLE_ORDER[groupId].map((variableId) => (
                    <div key={variableId} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="flex items-start gap-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                          {variableId.toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-slate-900">{copy.variables[variableId].title}</h4>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{copy.variables[variableId].description}</p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5">
                        <div className="space-y-3">
                          {VARIABLE_FORMULAS[variableId].map((line) => (
                            <div key={line} className="whitespace-pre-wrap text-center font-serif text-lg text-slate-800">
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>

                      <BulletList items={copy.variables[variableId].bullets} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <h2 className="mb-4 text-3xl font-bold text-slate-900">{copy.baseScoreTitle}</h2>
          <p className="mb-8 text-lg leading-8 text-slate-600">{copy.baseScoreDescription}</p>

          <FormulaCallout toneClassName="from-sky-50 to-white border-sky-200">
            <FormulaBlock lines={BASE_SCORE_FORMULA} />
          </FormulaCallout>

          <BulletList items={copy.baseScoreBullets} />
        </SectionCard>

        <SectionCard>
          <h2 className="mb-4 text-3xl font-bold text-slate-900">{copy.adjustmentTitle}</h2>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-slate-900">{copy.adjustments.cef.title}</h3>
              <p className="mt-3 text-base leading-8 text-slate-600">{copy.adjustments.cef.description}</p>
              <div className="mt-5 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
                <div className="space-y-3">
                  {CEF_FORMULAS.map((line) => (
                    <div key={line} className="whitespace-pre-wrap text-center font-serif text-lg text-slate-800">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
              <BulletList items={copy.adjustments.cef.bullets} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-slate-900">{copy.adjustments.gv.title}</h3>
              <p className="mt-3 text-base leading-8 text-slate-600">{copy.adjustments.gv.description}</p>
              <div className="mt-5 rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-5">
                <div className="space-y-3">
                  {GV_FORMULAS.map((line) => (
                    <div key={line} className="whitespace-pre-wrap text-center font-serif text-lg text-slate-800">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
              <BulletList items={copy.adjustments.gv.bullets} />
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <h2 className="mb-6 text-3xl font-bold text-slate-900">{copy.controlsTitle}</h2>
          <div className="space-y-3">
            {copy.controlsItems.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 p-8">
          <p className="mb-4 leading-relaxed text-slate-700">
            <strong className="text-slate-900">{copy.footerNoteLabel}</strong> {copy.footerNoteBody}
          </p>
          <p className="text-sm text-slate-500">{copy.version}</p>
        </div>
      </div>
    </div>
  );
}
