import type { ReactNode } from "react";
import type { SupportedLocale } from "@/lib/cers/i18n";

const KPI_ORDER = ["kpi1", "kpi2", "kpi3", "kpi4"] as const;
const CORE_FORMULA_ORDER = ["kpi", "index"] as const;

type KpiId = (typeof KPI_ORDER)[number];
type CoreFormulaId = (typeof CORE_FORMULA_ORDER)[number];

const KPI_VARIABLES: Record<KpiId, readonly VariableId[]> = {
  kpi1: ["v1", "v2"],
  kpi2: ["w1", "w2"],
  kpi3: ["c1", "c2", "c3", "c4"],
  kpi4: ["a1", "a2", "a3", "a4"],
};

type VariableId =
  | "v1"
  | "v2"
  | "w1"
  | "w2"
  | "c1"
  | "c2"
  | "c3"
  | "c4"
  | "a1"
  | "a2"
  | "a3"
  | "a4";

type VariableCopy = {
  title: string;
  description: string;
  bullets: string[];
};

type KpiCopy = {
  title: string;
  tagline: string;
  description: string;
};

type LogicCopy = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  principlesTitle: string;
  principlesDescription: string;
  principles: Array<{ code: string; title: string; description: string }>;
  equationsTitle: string;
  equationsDescription: string;
  equationTitles: Record<CoreFormulaId, string>;
  definitionsTitle: string;
  definitions: Array<{ key: string; label: string }>;
  kpisTitle: string;
  kpisDescription: string;
  kpis: Record<KpiId, KpiCopy>;
  variablesTitle: string;
  variablesDescription: string;
  variables: Record<VariableId, VariableCopy>;
  rulesTitle: string;
  rules: Array<{ title: string; bullets: string[] }>;
  checksTitle: string;
  checksDescription: string;
  checks: Array<{ title: string; description: string }>;
};

const CORE_FORMULAS: Record<CoreFormulaId, ReactNode[]> = {
  kpi: [
    <>
      K<sub>j</sub> = (1 / n<sub>j</sub>) × Σ<sub>i</sub> V<sub>j,i</sub>
    </>,
    <>
      (n<sub>1</sub> = 2, n<sub>2</sub> = 2, n<sub>3</sub> = 4, n<sub>4</sub> = 4)
    </>,
  ],
  index: [
    <>
      CERs = (K<sub>1</sub> + K<sub>2</sub> + K<sub>3</sub> + K<sub>4</sub>) / 4
    </>,
  ],
};

const VARIABLE_FORMULAS: Record<VariableId, ReactNode[]> = {
  v1: [
    <>
      I<sub>t</sub> = (E<sub>1,t</sub> + E<sub>2,t</sub>) / D<sub>t</sub>,&nbsp;&nbsp; r<sub>I,t</sub> = 1 − (I<sub>t</sub> / I<sub>t−3</sub>)<sup>1/3</sup>
    </>,
    <>
      g<sub>12,t</sub> = ((E<sub>1,t</sub> + E<sub>2,t</sub>) / (E<sub>1,t−3</sub> + E<sub>2,t−3</sub>))<sup>1/3</sup> − 1
    </>,
    <>
      S<sub>absolute</sub> = 1 if g<sub>12,t</sub> ≤ 0;&nbsp;&nbsp; 1 / (1 + g<sub>12,t</sub>) if g<sub>12,t</sub> &gt; 0
    </>,
    <>
      V1 = 100 × clamp(r<sub>I,t</sub> / 0.042, 0, 1) × S<sub>absolute</sub>
    </>,
  ],
  v2: [
    <>
      V2 = 100 × clamp(1 − (E3<sub>t</sub> / E3<sub>t−3</sub>)<sup>1/3</sup>, 0, 1)
    </>,
    <>
      E3<sub>t</sub>, E3<sub>t−3</sub> = Scope 3 absolute emissions in year t and t−3
    </>,
  ],
  w1: [
    <>
      W1<sub>j</sub> = 100 × Π<sub>k∈K_j</sub> W<sub>j,k</sub>,&nbsp;&nbsp; W<sub>j,k</sub> ∈ {"{"}0, 1{"}"}
    </>,
    <>
      W1 = (W1<sub>1</sub> + W1<sub>2</sub> + ... + W1<sub>J</sub>) / J
    </>,
  ],
  w2: [
    <>
      P<sub>t</sub> = [(E<sub>B</sub> − E<sub>t</sub>) / E<sub>B</sub>] ÷ [R · (t − B<sub>y</sub>) / (T<sub>y</sub> − B<sub>y</sub>)]
    </>,
    <>
      W2 = 100 × clamp(P<sub>t</sub>, 0, 1)
    </>,
  ],
  c1: [
    <>
      C1 = 100 × CapEx<sub>green</sub> / CapEx<sub>total</sub>
    </>,
  ],
  c2: [
    <>
      C2 = 100 × D<sub>green</sub> / D<sub>t</sub>
    </>,
  ],
  c3: [
    <>
      C3 ∈ {"{"}100, 25, 0{"}"}
    </>,
    <>
      100 = ICP operated &amp; price disclosed;&nbsp; 25 = operated, price not disclosed;&nbsp; 0 = none / unverifiable
    </>,
  ],
  c4: [
    <>
      C4 = 100 × m / 4,&nbsp;&nbsp; m ∈ {"{"}0, 1, 2, 3, 4{"}"}
    </>,
  ],
  a1: [
    <>
      a1 ∈ {"{"}100, 50, 0{"}"} (SBTi target status)
    </>,
    <>
      a2 = 100 × Σ<sub>s</sub> E<sub>s</sub><sup>ver</sup>·a<sub>s</sub> / Σ<sub>s</sub> E<sub>s</sub>,&nbsp;&nbsp; a<sub>s</sub> ∈ {"{"}0, 0.5, 1.0{"}"}
    </>,
    <>
      A1 = (a1 + a2) / 2
    </>,
  ],
  a2: [
    <>
      A2 = 100 × ¼ (𝟙[S1] + 𝟙[S2<sup>loc</sup>] + 𝟙[S2<sup>mkt</sup>] + n<sub>S3</sub> / 15)
    </>,
  ],
  a3: [
    <>
      A3 = 100 × m / 4
    </>,
  ],
  a4: [
    <>
      A4 = 100 × p / 4
    </>,
  ],
};

const ENGLISH_COPY: LogicCopy = {
  heroEyebrow: "CERs Index Methodology v1.5",
  heroTitle: "Formulas and variables",
  heroDescription:
    "The CERs (Climate-related Emissions & Responsibility Score) Index scores corporate climate transition from public disclosure only. Twelve variables across four KPIs — and every benchmark in the method is quoted from an external standard: the index sets no numbers of its own. Reference frameworks: CDP, IFRS S1/S2, the GHG Protocol, and the SBTi Corporate Net-Zero Standard.",
  principlesTitle: "Design principles — no arbitrary numbers",
  principlesDescription:
    "Every variable, formula, and aggregation step must rest on at least one of five rules, and no figure may be a back-solved allocation. All inputs must be obtainable from public disclosure; what is not disclosed scores zero.",
  principles: [
    {
      code: "R1",
      title: "External benchmark normalization",
      description:
        "Score denominators are quoted directly from international norms and scientific pathways — e.g. the SBTi 1.5°C cross-sector pace of 4.2%/yr for Scope 1·2 absolute reduction.",
    },
    {
      code: "R2",
      title: "Raw ratios as scores",
      description:
        "Natural 0–1 ratios are scored as-is with no curvature assumptions — green capex share, low-carbon revenue share.",
    },
    {
      code: "R3",
      title: "Equal count of standard-defined items",
      description:
        "Checklists consist only of items defined by external standards, each counted equally — the 15 Scope 3 categories, the 4 TCFD/ISSB pillars, the IFRS S2 target-design elements.",
    },
    {
      code: "R4",
      title: "Binary facts",
      description:
        "Only externally verifiable facts are scored 0 or 1 — whether a target element is disclosed, whether pay linkage is disclosed.",
    },
    {
      code: "R5",
      title: "Equal-interval ordinal scales",
      description:
        "Regulator-defined hierarchies (none < limited < reasonable assurance) are min–max normalized at equal intervals — 0 / 0.5 / 1.",
    },
  ],
  equationsTitle: "Aggregation",
  equationsDescription:
    "Twelve variables, each 0–100, are averaged into four KPI scores, which are averaged into the final index. Equal weighting is the design consequence, not a convenience: with no external basis for differential weights, any chosen weight would itself be an arbitrary allocation (principle of insufficient reason; OECD/EU JRC composite-indicator handbook). Because every variable lies in 0–100 and the mean is a convex combination, the index is mathematically guaranteed to stay in 0–100.",
  equationTitles: {
    kpi: "1. Variables → KPI score (equal-weighted mean)",
    index: "2. KPI scores → CERs Index (equal-weighted mean)",
  },
  definitionsTitle: "What the symbols mean",
  definitions: [
    { key: "V_j,i", label: "Variable i of KPI j, on a 0–100 scale" },
    { key: "n_j", label: "Number of variables in KPI j (2 / 2 / 4 / 4)" },
    { key: "K_j", label: "KPI score: the equal-weighted mean of its variables" },
    { key: "CERs", label: "Final index, 0–100 — bounded by construction, no clamping needed" },
    { key: "clamp(x, 0, 1)", label: "Caps a ratio into the 0–1 range" },
    { key: "t / t−3", label: "Reporting year and three years prior (3-year measurement window)" },
  ],
  kpisTitle: "Four KPIs",
  kpisDescription:
    "The four KPIs cover mutually non-overlapping dimensions — performance, targets, capital, credibility — with no international consensus that any one matters more, hence equal weights.",
  kpis: {
    kpi1: {
      title: "KPI 1 — Realized decarbonization",
      tagline: "Measured change, not statements",
      description:
        "Did measured Scope 1·2 and Scope 3 emissions actually fall over the 3-year window? Two variables: V1–V2.",
    },
    kpi2: {
      title: "KPI 2 — Target design & delivery",
      tagline: "Is the target fully defined, and is it being met?",
      description:
        "Two questions about the target: is it specified completely enough to be evaluated, and is the company on its declared reduction path? W1–W2.",
    },
    kpi3: {
      title: "KPI 3 — Capital allocation",
      tagline: "Does money actually flow to the transition?",
      description:
        "Investment (future), revenue (present), the internal price signal, and the governance-to-pay chain. C1–C4.",
    },
    kpi4: {
      title: "KPI 4 — Data credibility",
      tagline: "Can the numbers behind KPI 1–3 be trusted?",
      description:
        "Third-party validation and assurance, inventory completeness, methodology transparency, and disclosure-framework alignment. A1–A4. Climate disclosure regulation is concentrated here.",
    },
  },
  variablesTitle: "The twelve variables",
  variablesDescription:
    "Each card shows what the variable measures, its governing formula, and what the formula means. Full marks always mean the same thing: 1.5°C-aligned, or the external standard fully met.",
  variables: {
    v1: {
      title: "V1. Scope 1·2 emissions performance",
      description:
        "Whether direct (Scope 1) and purchased-energy (Scope 2, market-based) emissions intensity fell fast enough over the last three years.",
      bullets: [
        "The annualized intensity improvement is divided by 4.2%/yr — the SBTi 1.5°C cross-sector pace. Cutting at that pace or faster scores 100; half the pace scores 50.",
        "The absolute-emissions correction S_absolute prevents a fast-growing company from scoring well on intensity while total emissions rise.",
        "Basis: SBTi Corporate Net-Zero Standard (4.2%/yr linear), GHG Protocol Scope 2 Guidance (market-based).",
      ],
    },
    v2: {
      title: "V2. Scope 3 emissions performance",
      description:
        "How much the company's Scope 3 absolute emissions — typically the bulk of the footprint — actually fell over the same three-year window on a like-for-like boundary.",
      bullets: [
        "The annualized absolute reduction rate is the score directly (clamped 0–100). No improvement or an increase scores 0.",
        "Like-for-like boundary rule: only figures recalculated and disclosed by the company are compared when the boundary or method changed.",
        "Category selection adequacy, disclosure completeness, assurance, and method reliability are not scored here — they are handled in KPI 4. Basis: GHG Protocol Scope 3 Standard (same-boundary absolute tracking).",
      ],
    },
    w1: {
      title: "W1. Target design completeness",
      description:
        "Whether each disclosed reduction target is specified clearly enough — scope, period, level — for its ambition and delivery to be evaluated from the outside.",
      bullets: [
        "Each target scores 100 only if every applicable element is disclosed: base year, target year, quantified level, boundary, target type, interim target, and carbon-credit role. Missing any one applicable element scores that target 0.",
        "Element sets adapt to the target: short-term targets skip the interim-target element; gross targets without credits skip the credit element.",
        "Multiple valid targets are averaged, so W1 is the share of a company's valid targets that are completely defined. Basis: IFRS S2 §33–36, CDP target questions.",
      ],
    },
    w2: {
      title: "W2. On-track performance",
      description: "Whether actual reductions sit on the straight line from base year to target year.",
      bullets: [
        "Numerator: reduction achieved. Denominator: reduction expected for elapsed time. 12% achieved when 15% was due = 80 points.",
        "Capped at 100 — overshoot is already rewarded in V1·V2, so the cap prevents double counting.",
        "The linear path is not a new assumption: it is the same one CDP's progress metric and SBTi's pathway definition use.",
      ],
    },
    c1: {
      title: "C1. Green capex share",
      description:
        "Share of total capital expenditure going into low-carbon and transition investment — the strongest forward signal of what the company intends to become.",
      bullets: [
        "The ratio itself is the score. Classification follows the EU Taxonomy; for non-EU companies, self-classified \"green investment\" counts only if the classification standard is disclosed — otherwise 0, closing the greenwashing route.",
        "Basis: EU Taxonomy Art. 8 CapEx KPI, IFRS S2 ¶29(c).",
      ],
    },
    c2: {
      title: "C2. Low-carbon revenue share",
      description:
        "Share of revenue from low-carbon products and services — the present-day counterpart to C1's forward view.",
      bullets: [
        "The future/present pairing mirrors the EU Taxonomy's dual CapEx/Turnover KPI structure rather than a choice of this index.",
        "Classification rules and recognition conditions are identical to C1.",
      ],
    },
    c3: {
      title: "C3. Internal carbon price operation",
      description:
        "Whether the company operates an internal carbon price and discloses the applied level so the price signal can be verified externally.",
      bullets: [
        "Three states: 100 if an ICP is operated and the applied price is disclosed in currency/tCO₂e; 25 if operation is disclosed but the price is not; 0 if there is no ICP, only a plan, or operation cannot be verified.",
        "The level of the price is not scored — only the existence of a verifiable signal — because price meaning varies by type, purpose, and scope. External carbon taxes, ETS market prices, and credit purchase prices do not count as an internal price.",
        "Basis: CDP carbon-price responses (primary source), sustainability reports (supplementary).",
      ],
    },
    c4: {
      title: "C4. Climate governance & pay alignment",
      description:
        "Whether the decision chain — board oversight → management responsibility → pay linkage → quantified linkage — is aligned with climate performance.",
      bullets: [
        "Four disclosure items counted equally (0/25/50/75/100), taken directly from IFRS S2 ¶6 and ¶29(g) and CDP module 4 — the 25-point steps fall out of the count, they are not an invented scale.",
        "The size of the pay-linkage percentage is not scored: no international benchmark defines the \"right\" rate, so only its disclosure is a fact that can be judged.",
      ],
    },
    a1: {
      title: "A1. Third-party validation & assurance",
      description:
        "Two credibility checks averaged: whether the target is independently validated (SBTi status), and how much of reported emissions is independently assured.",
      bullets: [
        "a1 — target setting: SBTi targets set (approved, valid) = 100, an official committed status within the deadline = 50, none or a non-qualified validator only = 0.",
        "a2 — emissions assurance: 0 / 0.5 / 1.0 is the ISAE 3410 ordinal scale (none < limited < reasonable), weighted by emissions so an unassured Scope 3 cannot be masked by strong Scope 1·2 assurance.",
        "A1 = (a1 + a2) / 2.",
      ],
    },
    a2: {
      title: "A2. Inventory completeness",
      description:
        "Whether the company reports everything the GHG Protocol requires: Scope 1, both Scope 2 values, and the 15 Scope 3 categories.",
      bullets: [
        "Location-based and market-based Scope 2 count as separate items because dual reporting is an explicit obligation — reporting one is half credit.",
        "A Scope 3 category counts when its emissions are reported or its exclusion is justified as not relevant; bare omissions do not count.",
        "All items, definitions, and counts come from the GHG Protocol — nothing added, nothing reweighted.",
      ],
    },
    a3: {
      title: "A3. Methodology transparency",
      description:
        "Whether a third party could reproduce the numbers: organizational boundary, operational boundary, emission factors and GWP source, base-year recalculation policy.",
      bullets: [
        "Four equally counted items from the GHG Protocol Corporate Standard's required reporting information (Ch. 3–6).",
        "A disclosed recalculation policy also unlocks the preferred path in V2's like-for-like rule — the variables interlock.",
      ],
    },
    a4: {
      title: "A4. Disclosure framework alignment",
      description:
        "Whether climate reporting is organized along the four TCFD/IFRS S2 pillars: governance, strategy (incl. scenario analysis), risk management, metrics & targets.",
      bullets: [
        "Counts the existence of each pillar's disclosure (p / 4); content quality is scored by the other eleven variables.",
        "Division of labor with C4: A4 checks that the form is complete, C4 checks how deep the governance chain actually goes.",
      ],
    },
  },
  rulesTitle: "Common rules",
  rules: [
    {
      title: "Missing and not-applicable data",
      bullets: [
        "Undisclosed = 0. Disclosure incentive is the reason this index exists; imputation is never used because every imputation method injects arbitrariness.",
        "N/A is allowed only when the activity physically does not exist (e.g. no capital expenditure to classify for C1) and that absence is confirmed by disclosure — the variable is then removed from both numerator and denominator.",
        "Operation-unconfirmed and explicitly not-operated both score 0 (e.g. C3), but the raw status is stored separately.",
      ],
    },
    {
      title: "Score range and the meaning of 100",
      bullets: [
        "Every variable lies in 0–100; KPI scores and the index are means, so the 0–100 bound is mathematical, not enforced.",
        "Full marks mean the same thing everywhere: 1.5°C-aligned, or the external standard's requirement fully met.",
        "All benchmarks — 4.2%, the 15 categories, the 4 pillars, the SBTi status ladder, the ISAE assurance levels — are quoted from external sources. The index sets no numbers of its own.",
      ],
    },
    {
      title: "Aggregation and grades",
      bullets: [
        "Equal weights at both levels: with no external basis for differential weights, any chosen weight would itself be arbitrary (principle of insufficient reason; OECD/EU JRC handbook).",
        "Equal weighting is the starting point; weights and rankings may later be re-derived with reference to CDP or the Korea Institute of Corporate Governance and Sustainability.",
        "If grades (A/B/C/…) are published, band boundaries are defined only by distribution statistics such as universe quartiles — never by hand.",
      ],
    },
  ],
  checksTitle: "Built-in checks and balances",
  checksDescription:
    "The variables are arranged in counterbalancing pairs, so inflating one score triggers a deduction in its counterpart.",
  checks: [
    {
      title: "Intensity ↔ absolute emissions",
      description:
        "Inside V1: intensity gains from growth alone are clipped by the absolute-emissions correction.",
    },
    {
      title: "Target design ↔ delivery",
      description:
        "W1 ↔ W2: a fully specified target (W1) still has to sit on its reduction path (W2), so disclosure alone does not carry the KPI.",
    },
    {
      title: "Future investment ↔ present revenue",
      description:
        "C1 ↔ C2: investment claims about the future are checked against what the business earns from today.",
    },
    {
      title: "Performance claims ↔ data credibility",
      description:
        "KPI 1–3 ↔ KPI 4: performance numbers carry less weight when validation, assurance, completeness, and transparency are weak.",
    },
  ],
};

const KOREAN_COPY: LogicCopy = {
  heroEyebrow: "CERs Index 평가방법론 v1.5",
  heroTitle: "산식과 변수",
  heroDescription:
    "CERs(Climate-related Emissions & Responsibility Score) Index는 공개 자료만으로 기업의 기후전환을 채점합니다. 4개 KPI에 걸친 12개 변수로 구성되며, 방법론의 모든 기준값은 외부 표준에서 인용한 것으로 지수가 자체 설정한 수치는 존재하지 않습니다. 기준 프레임워크: CDP, IFRS S1/S2, GHG Protocol, SBTi Corporate Net-Zero Standard.",
  principlesTitle: "설계 원칙 — 임의 배점 금지",
  principlesDescription:
    "모든 변수·산식·집계는 아래 5개 규칙 중 하나 이상에 근거해야 하며, 어떤 수치도 결과를 보고 역산한 배점이어서는 안 됩니다. 모든 입력값은 공개 자료에서 확보 가능해야 하고, 공시하지 않은 것은 0점입니다.",
  principles: [
    {
      code: "R1",
      title: "외부 벤치마크 정규화",
      description:
        "점수의 분모(기준값)는 국제 규범·과학적 경로에서 직접 인용합니다 — Scope 1·2 절대감축에 적용하는 SBTi 1.5°C 횡단 경로 연 4.2% 등.",
    },
    {
      code: "R2",
      title: "비율 그 자체 사용",
      description:
        "0~1 사이의 자연 비율은 변환 없이 그대로 점수화합니다(곡률 가정 배제 = 최소 가정 원칙) — 녹색 CAPEX 비중, 저탄소 매출 비중.",
    },
    {
      code: "R3",
      title: "표준 정의 항목의 동일가중 카운트",
      description:
        "체크리스트는 외부 표준이 정의한 항목으로만 구성하고 각 항목을 동일하게 셉니다 — GHG Protocol Scope 3 15개 카테고리, TCFD/ISSB 4대 축, IFRS S2 목표 설계 요소.",
    },
    {
      code: "R4",
      title: "사실 여부 이진값",
      description: "외부에서 검증 가능한 사실(있다/없다)만 0 또는 1로 채점합니다 — 목표 요소 공시 여부, 보상 연계 공시 여부.",
    },
    {
      code: "R5",
      title: "서수 척도의 등간 정규화",
      description:
        "규제가 정의한 서열(없음 < 제한적 < 합리적 보증)을 등간 정규화합니다 — 0 / 0.5 / 1.",
    },
  ],
  equationsTitle: "집계",
  equationsDescription:
    "0~100 범위의 12개 변수를 4개 KPI 점수로 평균하고, 다시 4개 KPI를 평균해 최종 지수를 만듭니다. 동일가중은 편의가 아니라 설계의 귀결입니다: 차등 가중을 정당화할 외부 근거가 없을 때, 어떤 가중치든 그 수치 자체가 임의 배점이 됩니다(불충분 이유의 원리, OECD·EU JRC 종합지표 핸드북). 모든 변수가 0~100이고 평균은 볼록결합이므로 지수의 0~100 범위는 수학적으로 보장됩니다.",
  equationTitles: {
    kpi: "1. 변수 → KPI 점수 (동일가중 평균)",
    index: "2. KPI 점수 → CERs Index (동일가중 평균)",
  },
  definitionsTitle: "기호 설명",
  definitions: [
    { key: "V_j,i", label: "KPI j의 i번째 변수, 0~100 범위" },
    { key: "n_j", label: "KPI j의 변수 수 (2 / 2 / 4 / 4)" },
    { key: "K_j", label: "KPI 점수: 소속 변수들의 동일가중 평균" },
    { key: "CERs", label: "최종 지수, 0~100 — 구조적으로 범위가 보장되어 별도 절사가 필요 없음" },
    { key: "clamp(x, 0, 1)", label: "비율을 0~1 범위로 자르는 안전핀" },
    { key: "t / t−3", label: "보고연도와 3개년 전 (3년 측정 창)" },
  ],
  kpisTitle: "4개 KPI",
  kpisDescription:
    "4개 KPI는 성과–목표–자본–신뢰성이라는 상호 비중복 차원을 다루며, 어느 차원이 더 중요하다는 국제 규범적 합의가 없으므로 동일가중입니다.",
  kpis: {
    kpi1: {
      title: "KPI 1 — 실질 탄소감축 성과",
      tagline: "말이 아닌 실측",
      description: "Scope 1·2와 Scope 3 배출량이 3년 창에서 실제로 줄었는가. 변수 2개: V1~V2.",
    },
    kpi2: {
      title: "KPI 2 — 목표 및 이행성과",
      tagline: "목표가 완전하게 정의되었고, 지켜지고 있는가",
      description:
        "목표에 대한 2가지 질문: 외부에서 평가할 수 있을 만큼 완전하게 설계되었는가, 그리고 공표한 감축 경로 위에 있는가. W1~W2.",
    },
    kpi3: {
      title: "KPI 3 — 자본배분",
      tagline: "전환에 돈이 실제로 흐르는가",
      description: "투자(미래), 매출(현재), 내부 가격신호, 거버넌스-보상 사슬. C1~C4.",
    },
    kpi4: {
      title: "KPI 4 — 데이터 신뢰성",
      tagline: "KPI 1~3에 들어간 숫자를 믿을 수 있는가",
      description:
        "제3자 검증·보증, 인벤토리 완전성, 방법론 투명성, 공시 체계 정합성. A1~A4. 기후 공시 규제 요건이 집중 반영되는 KPI입니다.",
    },
  },
  variablesTitle: "12개 변수",
  variablesDescription:
    "각 카드는 무엇을 재는가 → 산식 → 산식의 의미 순으로 설명합니다. 만점의 의미는 전 변수에서 동일합니다: 1.5°C 정합 수준, 또는 외부 표준의 요구 완전 충족.",
  variables: {
    v1: {
      title: "V1. Scope 1·2 배출성과",
      description:
        "직접배출(Scope 1)과 구매 전력·열 배출(Scope 2, 시장기반)의 매출 대비 집약도가 지난 3년간 충분히 빨리 줄었는가.",
      bullets: [
        "연평균 집약도 개선율을 연 4.2%(SBTi 1.5°C 횡단 경로)로 나눕니다 — 1.5°C 속도 이상으로 감축 중이면 100점, 절반 속도면 50점.",
        "절대량 보정 S_absolute는 함정 방지 장치입니다: 급성장 기업이 집약도는 개선해도 총배출이 늘면 그만큼 깎입니다.",
        "근거: SBTi Corporate Net-Zero Standard(연 4.2% 선형), GHG Protocol Scope 2 Guidance(시장기반).",
      ],
    },
    v2: {
      title: "V2. Scope 3 배출성과",
      description:
        "동일한 산정경계에서 기업의 Scope 3 절대배출량(통상 총배출의 대부분)이 최근 3년간 실제로 얼마나 감소했는가.",
      bullets: [
        "연평균 절대 감축률을 그대로 점수화합니다(0~100 절사). 감소하지 않거나 증가하면 0점.",
        "경계 일관성(like-for-like) 규칙: 산정범위·방법론이 변경된 경우 기업이 재산정하여 공시한 과거 수치만 사용합니다.",
        "카테고리 선정의 적정성, 공시 완전성, 검증 여부, 산정방법 신뢰성은 V2가 아니라 KPI 4에서 별도로 평가합니다. 근거: GHG Protocol Scope 3 Standard(동일 경계 절대배출 추적).",
      ],
    },
    w1: {
      title: "W1. 감축목표 설계 수준",
      description:
        "공시한 각 감축목표가 범위·기간·수준이 명확하여 외부에서 목표 수준과 이행성과를 평가할 수 있는 구조인지.",
      bullets: [
        "각 목표는 적용 대상 항목을 모두 공시해야 100점: 기준연도, 목표연도, 정량 목표수준, 목표 경계, 목표유형, 중간목표, 탄소크레딧 정보. 하나라도 빠지면 그 목표는 0점.",
        "적용 항목은 목표별로 달라집니다: 단기목표는 중간목표 항목을 적용하지 않고, 크레딧 미사용 총량목표는 크레딧 항목을 적용하지 않습니다.",
        "유효 목표가 여러 개면 단순평균하므로, W1은 기업의 유효 목표 중 완전하게 정의된 목표의 비율입니다. 근거: IFRS S2 §33~36, CDP 감축목표 문항.",
      ],
    },
    w2: {
      title: "W2. 목표 이행 진척도",
      description: "기준연도→목표연도 직선 경로 위에 실제 감축이 있는가.",
      bullets: [
        "분자는 실제 달성 감축률, 분모는 경과기간만큼 기대되는 감축률. 15%를 줄였어야 할 때 12%를 줄였다면 80점.",
        "100에서 절사합니다 — 초과 달성분은 이미 V1·V2의 실측 성과로 보상되므로 이중 계상을 막습니다.",
        "선형 경로는 새 가정이 아니라 CDP 진척도 산식·SBTi 경로 정의와 동일한 가정입니다.",
      ],
    },
    c1: {
      title: "C1. 녹색 CAPEX 비중",
      description: "총 자본적 지출 중 저탄소·전환 투자의 비중 — 회사가 무엇이 되려는지에 대한 가장 강한 선행 신호.",
      bullets: [
        "비율 그대로가 점수입니다. 분류 준거는 EU Taxonomy이며, 비EU 기업의 자체 분류는 분류 기준이 공시된 경우에만 인정 — 기준 없는 \"녹색 투자\" 주장은 0점으로 그린워싱 통로를 차단합니다.",
        "근거: EU Taxonomy Art.8 CapEx KPI, IFRS S2 ¶29(c).",
      ],
    },
    c2: {
      title: "C2. 저탄소 매출 비중",
      description: "총매출 중 저탄소 제품·서비스 매출의 비중 — C1이 미래라면 C2는 현재.",
      bullets: [
        "미래/현재의 병존은 이 지수의 고안이 아니라 EU Taxonomy가 CapEx와 Turnover를 별도 KPI로 둔 이원 구조를 그대로 차용한 것입니다.",
        "분류 준거와 인정 조건은 C1과 동일합니다.",
      ],
    },
    c3: {
      title: "C3. 내부탄소가격 운영 수준",
      description: "기업이 내부탄소가격을 운영하며 적용가격을 공시해 외부에서 가격 신호를 확인할 수 있는지.",
      bullets: [
        "3단계 판정: 운영 + 적용가격을 통화/tCO₂e 단위로 공시하면 100점, 운영은 명시했으나 가격 미공시면 25점, 미운영·도입 예정·운영 확인 불가면 0점.",
        "가격의 높낮이는 점수화하지 않고 검증 가능한 신호의 존재만 봅니다 — 유형·목적·적용범위에 따라 가격의 의미가 다르기 때문. 외부 탄소세, 배출권 시장가격, 크레딧 구매가격은 내부탄소가격으로 인정하지 않습니다.",
        "근거: CDP 탄소가격 응답(1순위 소스), 지속가능경영보고서(보충).",
      ],
    },
    c4: {
      title: "C4. 기후 거버넌스·보상 정렬",
      description: "이사회 감독 → 경영진 책임 → 보상 연계 → 연계 비중 정량 공시로 내려가는 의사결정 사슬이 기후 성과와 정렬되어 있는가.",
      bullets: [
        "4개 공시 항목의 동일 카운트(0/25/50/75/100)이며, 항목은 IFRS S2 ¶6·¶29(g)와 CDP 모듈 4에서 그대로 가져왔습니다 — 25점 단위는 카운트의 자동 결과이지 발명한 배점이 아닙니다.",
        "보상 연계 비율(%)의 크기 자체는 점수화하지 않습니다: 적정 연계 비율의 국제 기준값이 존재하지 않아 어떤 분모도 자의적이기 때문입니다.",
      ],
    },
    a1: {
      title: "A1. 제3자 검증·보증",
      description: "두 신뢰도 점검의 평균: 목표가 독립 검증을 받았는가(SBTi 상태), 그리고 보고 배출량 중 독립 보증을 받은 비중.",
      bullets: [
        "a1 — 목표 설정: SBTi 목표 승인(유효) = 100, 공식 커밋 상태(제출기한 내) = 50, 미참여 또는 비적격 기관 검증만 보유 = 0.",
        "a2 — 배출량 보증: 0 / 0.5 / 1.0은 ISAE 3410 서열(없음 < 제한적 < 합리적)이며 배출량으로 가중 — 총배출의 대부분인 Scope 3가 미보증이면 S1·2를 잘 보증해도 가려지지 않습니다.",
        "A1 = (a1 + a2) / 2.",
      ],
    },
    a2: {
      title: "A2. 인벤토리 완전성",
      description: "GHG Protocol이 보고를 요구하는 것을 빠짐없이 보고했는가: Scope 1, Scope 2 두 값, Scope 3 15개 카테고리.",
      bullets: [
        "위치기반·시장기반 Scope 2를 별도 항목으로 세는 이유: 두 값의 병행 보고가 명시적 의무이기 때문입니다 — 하나만 보고하면 절반만 충족.",
        "Scope 3 카테고리는 배출량을 보고했거나 비관련 판단의 근거를 공시한 경우에만 인정 — 근거 없는 단순 누락은 세지 않습니다.",
        "항목 목록·정의·개수 전부 GHG Protocol이 정한 것이며, 지수가 더하거나 가중한 항목이 없습니다.",
      ],
    },
    a3: {
      title: "A3. 산정 방법론 투명성",
      description: "제3자가 이 숫자를 재현할 수 있는가: 조직경계, 운영경계, 배출계수·GWP 출처, 기준연도 재산정 정책.",
      bullets: [
        "GHG Protocol Corporate Standard의 필수 보고 정보 4항목(Ch.3~6)의 동일 카운트입니다.",
        "재산정 정책을 공시한 회사는 V2의 like-for-like 규칙에서도 1순위 경로를 탈 수 있습니다 — 변수들이 맞물려 작동합니다.",
      ],
    },
    a4: {
      title: "A4. 기후 공시 체계 정합성",
      description: "기후 공시가 TCFD/IFRS S2의 4대 축 — 거버넌스, 전략(시나리오 분석 포함), 위험관리, 지표·목표 — 을 갖추었는가.",
      bullets: [
        "각 축의 공시 존재만 사실 판정하며(p / 4), 내용의 질은 나머지 11개 변수가 평가합니다.",
        "C4와의 분업: A4는 형식의 완비(공시 체계가 서 있는가), C4는 거버넌스 축 내부의 실질적 깊이를 봅니다.",
      ],
    },
  },
  rulesTitle: "공통 규칙",
  rules: [
    {
      title: "결측·비해당 처리",
      bullets: [
        "미공시 = 0점. 공시 인센티브가 이 지수의 존재 이유이며, 결측 대체(imputation)는 어떤 방법이든 자의성이 개입되므로 쓰지 않습니다.",
        "N/A는 활동이 물리적으로 존재하지 않고(예: 분류할 자본적 지출이 없어 C1이 비해당) 그 부존재가 공시로 확인되는 경우에만 허용 — 해당 변수를 분자·분모에서 모두 제외합니다.",
        "운영 확인 불가와 명시적 미운영은 모두 0점이되(예: C3), 원자료 상태값은 구분하여 저장합니다.",
      ],
    },
    {
      title: "점수 범위와 만점의 의미",
      bullets: [
        "모든 변수가 0~100이고 KPI·지수는 평균이므로 0~100 범위는 수학적으로 보장됩니다(별도 절사 불필요).",
        "만점의 의미는 모든 변수에서 동일합니다: 1.5°C 정합 수준, 또는 외부 표준의 요구 완전 충족.",
        "모든 기준값 — 4.2%, 15개 카테고리, 4대 축, SBTi 상태 분류, ISAE 보증 수준 — 은 외부 출처에서 인용된 것이며, 지수가 자체 설정한 수치는 없습니다.",
      ],
    },
    {
      title: "집계와 등급",
      bullets: [
        "두 단계 모두 동일가중: 차등 가중을 정당화할 외부 근거가 없을 때 동일가중이 유일한 비자의적 선택입니다(불충분 이유의 원리, OECD·EU JRC 핸드북).",
        "동일가중은 출발점이며, 추후 CDP 또는 한국ESG기준원을 참조하여 가중치와 기업 랭킹을 재산정할 수 있습니다.",
        "등급(A/B/C 등)을 부여할 경우 구간 경계는 유니버스 사분위수 등 분포 기반 통계량으로만 정의합니다 — 손으로 정하지 않습니다.",
      ],
    },
  ],
  checksTitle: "내장된 상호 견제 구조",
  checksDescription:
    "변수들은 서로 견제하는 짝으로 짜여 있어, 한 변수에서 점수를 부풀리는 행동이 짝 변수에서 감점됩니다.",
  checks: [
    {
      title: "원단위 개선 ↔ 절대량 보정",
      description: "V1 내부: 성장만으로 얻은 집약도 개선은 절대량 보정으로 깎입니다.",
    },
    {
      title: "목표 설계 ↔ 이행",
      description: "W1 ↔ W2: 완전하게 설계된 목표(W1)도 감축 경로 위에 있어야(W2) 하므로 공시만으로 KPI를 끌고 가지 못합니다.",
    },
    {
      title: "미래 투자 ↔ 현재 매출",
      description: "C1 ↔ C2: 미래에 대한 투자 주장은 지금 사업이 무엇으로 버는지와 대조됩니다.",
    },
    {
      title: "성과 주장 ↔ 데이터 신뢰성",
      description:
        "KPI 1~3 ↔ KPI 4: 검증·보증·완전성·투명성이 약하면 성과 숫자의 해석 무게가 줄어듭니다.",
    },
  ],
};

const JAPANESE_COPY: LogicCopy = {
  heroEyebrow: "CERs Index 評価方法論 v1.5",
  heroTitle: "算式と変数",
  heroDescription:
    "CERs（Climate-related Emissions & Responsibility Score）Index は、公開資料のみから企業の気候移行を採点します。4つの KPI にまたがる 12 変数で構成され、方法論のすべての基準値は外部標準から引用したもので、指数が独自に設定した数値は存在しません。参照フレームワーク: CDP、IFRS S1/S2、GHG Protocol、SBTi Corporate Net-Zero Standard。",
  principlesTitle: "設計原則 — 恣意的な配点の禁止",
  principlesDescription:
    "すべての変数・算式・集計は以下 5 つのルールのいずれかに基づかなければならず、いかなる数値も結果から逆算した配点であってはなりません。すべての入力値は公開資料から取得可能でなければならず、未開示は 0 点です。",
  principles: [
    {
      code: "R1",
      title: "外部ベンチマーク正規化",
      description:
        "スコアの分母（基準値）は国際規範・科学的経路から直接引用します — Scope 1・2 の絶対削減に適用する SBTi 1.5°C クロスセクター経路の年 4.2% など。",
    },
    {
      code: "R2",
      title: "比率そのものを使用",
      description:
        "0〜1 の自然な比率は変換せずそのまま採点します（曲率仮定の排除 = 最小仮定原則）— グリーン CAPEX 比率、低炭素売上比率。",
    },
    {
      code: "R3",
      title: "標準定義項目の同一カウント",
      description:
        "チェックリストは外部標準が定義した項目のみで構成し、各項目を同等に数えます — GHG Protocol Scope 3 の 15 カテゴリ、TCFD/ISSB の 4 本柱、IFRS S2 の目標設計要素。",
    },
    {
      code: "R4",
      title: "事実の二値判定",
      description: "外部から検証可能な事実（有/無）のみを 0 または 1 で採点します — 目標要素の開示有無、報酬連動の開示有無。",
    },
    {
      code: "R5",
      title: "順序尺度の等間隔正規化",
      description: "規制が定義した序列（なし < 限定的 < 合理的保証）を等間隔に正規化します — 0 / 0.5 / 1。",
    },
  ],
  equationsTitle: "集計",
  equationsDescription:
    "0〜100 の 12 変数を 4 つの KPI スコアに平均し、さらに 4 つの KPI を平均して最終指数を作ります。等加重は便宜ではなく設計の帰結です: 差等加重を正当化する外部根拠がない場合、いかなる重みもそれ自体が恣意的配点になります（不十分理由の原理、OECD・EU JRC 総合指標ハンドブック）。すべての変数が 0〜100 で平均は凸結合のため、指数の 0〜100 範囲は数学的に保証されます。",
  equationTitles: {
    kpi: "1. 変数 → KPI スコア（等加重平均）",
    index: "2. KPI スコア → CERs Index（等加重平均）",
  },
  definitionsTitle: "記号の意味",
  definitions: [
    { key: "V_j,i", label: "KPI j の i 番目の変数、0〜100 の範囲" },
    { key: "n_j", label: "KPI j の変数数（2 / 2 / 4 / 4）" },
    { key: "K_j", label: "KPI スコア: 所属変数の等加重平均" },
    { key: "CERs", label: "最終指数、0〜100 — 構造的に範囲が保証され、別途のクランプは不要" },
    { key: "clamp(x, 0, 1)", label: "比率を 0〜1 の範囲に収める安全装置" },
    { key: "t / t−3", label: "報告年度と 3 年前（3 年の測定ウィンドウ）" },
  ],
  kpisTitle: "4つの KPI",
  kpisDescription:
    "4 つの KPI は成果–目標–資本–信頼性という相互に重複しない次元を扱い、どの次元がより重要かという国際的合意がないため等加重です。",
  kpis: {
    kpi1: {
      title: "KPI 1 — 実質的な炭素削減成果",
      tagline: "言葉ではなく実測",
      description: "Scope 1・2 と Scope 3 の排出量が 3 年のウィンドウで実際に減ったか。変数 2 つ: V1〜V2。",
    },
    kpi2: {
      title: "KPI 2 — 目標と履行成果",
      tagline: "目標が完全に定義され、守られているか",
      description:
        "目標への 2 つの問い: 外部から評価できるほど完全に設計されているか、そして公表した削減経路の上にあるか。W1〜W2。",
    },
    kpi3: {
      title: "KPI 3 — 資本配分",
      tagline: "移行に資金が実際に流れているか",
      description: "投資（未来）、売上（現在）、内部価格シグナル、ガバナンス-報酬の連鎖。C1〜C4。",
    },
    kpi4: {
      title: "KPI 4 — データ信頼性",
      tagline: "KPI 1〜3 の数値を信頼できるか",
      description:
        "第三者検証・保証、インベントリ完全性、方法論の透明性、開示体系の整合性。A1〜A4。気候開示規制の要件が集中的に反映される KPI です。",
    },
  },
  variablesTitle: "12の変数",
  variablesDescription:
    "各カードは「何を測るか → 算式 → 算式の意味」の順で説明します。満点の意味はすべての変数で同一です: 1.5°C 整合水準、または外部標準の要求の完全充足。",
  variables: {
    v1: {
      title: "V1. Scope 1・2 排出実績",
      description:
        "直接排出（Scope 1）と購入電力・熱の排出（Scope 2、マーケット基準）の売上高原単位が、過去 3 年間に十分速く低下したか。",
      bullets: [
        "年平均の原単位改善率を年 4.2%（SBTi 1.5°C クロスセクター経路)で割ります — 1.5°C ペース以上で削減していれば 100 点、半分のペースなら 50 点。",
        "絶対量補正 S_absolute は罠の防止装置です: 急成長企業が原単位を改善しても総排出が増えればその分減点されます。",
        "根拠: SBTi Corporate Net-Zero Standard（年 4.2% 線形）、GHG Protocol Scope 2 Guidance（マーケット基準）。",
      ],
    },
    v2: {
      title: "V2. Scope 3 排出実績",
      description:
        "同一の算定境界で、企業の Scope 3 絶対排出量（通常、総排出の大部分）が過去 3 年間に実際にどれだけ減少したか。",
      bullets: [
        "年平均の絶対削減率をそのままスコア化します（0〜100 で切り捨て）。減少しないか増加すれば 0 点。",
        "境界一貫性（like-for-like）ルール: 算定範囲・方法論が変更された場合、企業が再算定して開示した過去数値のみを使用します。",
        "カテゴリ選定の適切性、開示の完全性、検証の有無、算定方法の信頼性は V2 ではなく KPI 4 で別途評価します。根拠: GHG Protocol Scope 3 Standard（同一境界の絶対排出追跡）。",
      ],
    },
    w1: {
      title: "W1. 削減目標の設計水準",
      description:
        "開示された各削減目標が、範囲・期間・水準が明確で、外部から目標水準と履行成果を評価できる構造か。",
      bullets: [
        "各目標は適用対象項目をすべて開示して初めて 100 点: 基準年、目標年、定量目標水準、目標境界、目標タイプ、中間目標、炭素クレジット情報。一つでも欠ければその目標は 0 点。",
        "適用項目は目標ごとに変わります: 短期目標は中間目標項目を適用せず、クレジット不使用の総量目標はクレジット項目を適用しません。",
        "有効な目標が複数あれば単純平均するため、W1 は企業の有効目標のうち完全に定義された目標の比率です。根拠: IFRS S2 §33〜36、CDP 削減目標設問。",
      ],
    },
    w2: {
      title: "W2. 目標履行進捗度",
      description: "基準年→目標年の直線経路の上に実際の削減があるか。",
      bullets: [
        "分子は実際の達成削減率、分母は経過期間に応じて期待される削減率。15% 減らすべきところ 12% なら 80 点。",
        "100 で切り捨てます — 超過達成分は既に V1・V2 の実測成果で報われるため、二重計上を防ぎます。",
        "線形経路は新しい仮定ではなく、CDP の進捗算式・SBTi の経路定義と同一の仮定です。",
      ],
    },
    c1: {
      title: "C1. グリーン CAPEX 比率",
      description: "総設備投資に占める低炭素・移行投資の比率 — 企業が何になろうとしているかの最も強い先行シグナル。",
      bullets: [
        "比率そのものがスコアです。分類基準は EU Taxonomy に拠り、非 EU 企業の自社分類は分類基準が開示されている場合のみ認定 — 基準なしの「グリーン投資」主張は 0 点とし、グリーンウォッシングの経路を遮断します。",
        "根拠: EU Taxonomy Art.8 CapEx KPI、IFRS S2 ¶29(c)。",
      ],
    },
    c2: {
      title: "C2. 低炭素売上比率",
      description: "総売上に占める低炭素製品・サービス売上の比率 — C1 が未来なら C2 は現在。",
      bullets: [
        "未来/現在の併存はこの指数の考案ではなく、EU Taxonomy が CapEx と Turnover を別 KPI とした二元構造をそのまま借用したものです。",
        "分類基準と認定条件は C1 と同一です。",
      ],
    },
    c3: {
      title: "C3. 内部炭素価格の運営水準",
      description: "企業が内部炭素価格を運営し、適用価格を開示して外部から価格シグナルを確認できるか。",
      bullets: [
        "3 段階判定: 運営 + 適用価格を通貨/tCO₂e 単位で開示すれば 100 点、運営は明示したが価格未開示なら 25 点、未導入・導入予定・運営確認不可なら 0 点。",
        "価格の高低は採点せず、検証可能なシグナルの存在のみを見ます — 種類・目的・適用範囲により価格の意味が異なるため。外部炭素税、排出枠の市場価格、クレジット購入価格は内部炭素価格として認定しません。",
        "根拠: CDP 炭素価格回答（第 1 ソース）、サステナビリティ報告書（補足）。",
      ],
    },
    c4: {
      title: "C4. 気候ガバナンス・報酬整合",
      description:
        "取締役会監督 → 経営陣の責任 → 報酬連動 → 連動比率の定量開示と降りていく意思決定の連鎖が、気候パフォーマンスと整合しているか。",
      bullets: [
        "4 つの開示項目の同一カウント（0/25/50/75/100）で、項目は IFRS S2 ¶6・¶29(g) と CDP モジュール 4 からそのまま取得 — 25 点刻みはカウントの自動的な結果であり、発明した配点ではありません。",
        "報酬連動比率（%）の大きさ自体は採点しません: 適正連動比率の国際基準値が存在せず、いかなる分母も恣意的になるためです。",
      ],
    },
    a1: {
      title: "A1. 第三者検証・保証",
      description: "2 つの信頼性チェックの平均: 目標が独立検証を受けたか（SBTi ステータス）、そして報告排出量のうち独立保証を受けた比率。",
      bullets: [
        "a1 — 目標設定: SBTi 目標承認（有効）= 100、公式コミット状態（提出期限内）= 50、不参加または非適格機関の検証のみ = 0。",
        "a2 — 排出量保証: 0 / 0.5 / 1.0 は ISAE 3410 の序列（なし < 限定的 < 合理的）で排出量加重 — 総排出の大部分である Scope 3 が未保証なら、S1・2 を保証しても覆い隠せません。",
        "A1 = (a1 + a2) / 2。",
      ],
    },
    a2: {
      title: "A2. インベントリ完全性",
      description: "GHG Protocol が報告を要求するものを漏れなく報告したか: Scope 1、Scope 2 の両値、Scope 3 の 15 カテゴリ。",
      bullets: [
        "ロケーション基準・マーケット基準の Scope 2 を別項目として数える理由: 両値の並行報告が明示的義務だからです — 一方のみの報告は半分の充足。",
        "Scope 3 カテゴリは排出量を報告したか、非関連判断の根拠を開示した場合のみ認定 — 根拠のない単純な省略は数えません。",
        "項目リスト・定義・数はすべて GHG Protocol が定めたもので、指数が追加・加重した項目はありません。",
      ],
    },
    a3: {
      title: "A3. 算定方法論の透明性",
      description: "第三者がこの数値を再現できるか: 組織境界、運営境界、排出係数・GWP の出所、基準年の再算定方針。",
      bullets: [
        "GHG Protocol Corporate Standard の必須報告情報 4 項目（Ch.3〜6）の同一カウントです。",
        "再算定方針を開示した企業は V2 の like-for-like ルールでも第 1 優先経路に乗れます — 変数同士が噛み合って機能します。",
      ],
    },
    a4: {
      title: "A4. 気候開示体系の整合性",
      description: "気候開示が TCFD/IFRS S2 の 4 本柱 — ガバナンス、戦略（シナリオ分析を含む）、リスク管理、指標・目標 — を備えているか。",
      bullets: [
        "各柱の開示の存在のみを事実判定し（p / 4）、内容の質は残りの 11 変数が評価します。",
        "C4 との分業: A4 は形式の完備（開示体系が立っているか）、C4 はガバナンス柱内部の実質的な深さを見ます。",
      ],
    },
  },
  rulesTitle: "共通ルール",
  rules: [
    {
      title: "欠損・非該当の処理",
      bullets: [
        "未開示 = 0 点。開示インセンティブがこの指数の存在理由であり、欠損補完（imputation）はいかなる方法でも恣意性が入るため使いません。",
        "N/A は活動が物理的に存在せず（例: 分類する設備投資がなく C1 が非該当）、その不存在が開示で確認される場合のみ許容 — 当該変数を分子・分母の両方から除外します。",
        "運営確認不可と明示的な未運営はいずれも 0 点ですが（例: C3）、原データの状態値は区別して保存します。",
      ],
    },
    {
      title: "スコア範囲と満点の意味",
      bullets: [
        "すべての変数が 0〜100 で KPI・指数は平均のため、0〜100 範囲は数学的に保証されます（別途の切り捨て不要）。",
        "満点の意味はすべての変数で同一です: 1.5°C 整合水準、または外部標準の要求の完全充足。",
        "すべての基準値 — 4.2%、15 カテゴリ、4 本柱、SBTi ステータス分類、ISAE 保証水準 — は外部出所からの引用であり、指数が独自に設定した数値はありません。",
      ],
    },
    {
      title: "集計と等級",
      bullets: [
        "両段階とも等加重: 差等加重を正当化する外部根拠がない場合、等加重が唯一の非恣意的選択です（不十分理由の原理、OECD・EU JRC ハンドブック）。",
        "等加重は出発点であり、今後 CDP または韓国 ESG 基準院を参照して重みと企業ランキングを再算定し得ます。",
        "等級（A/B/C など）を付与する場合、区間境界はユニバースの四分位数など分布ベースの統計量でのみ定義します — 手で決めません。",
      ],
    },
  ],
  checksTitle: "組み込みの相互牽制構造",
  checksDescription:
    "変数は互いに牽制し合うペアで構成されており、ある変数でスコアを膨らませる行動はペア変数で減点されます。",
  checks: [
    {
      title: "原単位改善 ↔ 絶対量補正",
      description: "V1 の内部: 成長だけで得た原単位改善は絶対量補正で削られます。",
    },
    {
      title: "目標設計 ↔ 履行",
      description: "W1 ↔ W2: 完全に設計された目標（W1）も削減経路の上になければならず（W2）、開示だけで KPI を牽引できません。",
    },
    {
      title: "未来の投資 ↔ 現在の売上",
      description: "C1 ↔ C2: 未来への投資主張は、今の事業が何で稼いでいるかと対照されます。",
    },
    {
      title: "成果の主張 ↔ データ信頼性",
      description:
        "KPI 1〜3 ↔ KPI 4: 検証・保証・完全性・透明性が弱ければ成果数値の解釈上の重みが減ります。",
    },
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
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">{copy.heroEyebrow}</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">{copy.heroTitle}</h1>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">{copy.heroDescription}</p>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 rounded-[32px] border border-slate-200 bg-white px-6 py-5 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{copy.principlesTitle}</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">{copy.principlesDescription}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {copy.principles.map((principle) => (
            <div key={principle.code} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
              <div className="inline-flex rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">{principle.code}</div>
              <h3 className="mt-3 text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">{principle.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{principle.description}</p>
            </div>
          ))}
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

      <section className="mt-6">
        <div className="mb-4 rounded-[32px] border border-slate-200 bg-white px-6 py-5 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{copy.kpisTitle}</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">{copy.kpisDescription}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {KPI_ORDER.map((kpiId, index) => {
            const kpi = copy.kpis[kpiId];
            return (
              <div key={kpiId} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">{index + 1}</div>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">{kpi.title}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">{kpi.tagline}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{kpi.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 rounded-[32px] border border-slate-200 bg-white px-6 py-5 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{copy.variablesTitle}</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">{copy.variablesDescription}</p>
        </div>
        {KPI_ORDER.map((kpiId) => (
          <div key={kpiId} className="mb-6">
            <div className="mb-4 rounded-3xl border border-teal-200 bg-teal-50 px-5 py-3 dark:border-teal-500/30 dark:bg-teal-500/10">
              <span className="text-sm font-semibold tracking-tight text-teal-800 dark:text-teal-200">{copy.kpis[kpiId].title}</span>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              {KPI_VARIABLES[kpiId].map((variableId) => {
                const variable = copy.variables[variableId];
                return (
                  <div key={variableId} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{variable.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{variable.description}</p>
                    <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-900">
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
          </div>
        ))}
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

      <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{copy.checksTitle}</h2>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600 dark:text-slate-300">{copy.checksDescription}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {copy.checks.map((check) => (
            <div key={check.title} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">{check.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{check.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
