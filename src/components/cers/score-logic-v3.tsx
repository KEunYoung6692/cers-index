import type { ReactNode } from "react";
import type { SupportedLocale } from "@/lib/cers/i18n";

const KPI_ORDER = ["kpi1", "kpi2", "kpi3", "kpi4"] as const;
const CORE_FORMULA_ORDER = ["kpi", "index"] as const;

type KpiId = (typeof KPI_ORDER)[number];
type CoreFormulaId = (typeof CORE_FORMULA_ORDER)[number];

const KPI_VARIABLES: Record<KpiId, readonly VariableId[]> = {
  kpi1: ["v1", "v2", "v3"],
  kpi2: ["w1", "w2", "w3", "w4"],
  kpi3: ["c1", "c2", "c3", "c4"],
  kpi4: ["a1", "a2", "a3", "a4", "a5"],
};

type VariableId =
  | "v1"
  | "v2"
  | "v3"
  | "w1"
  | "w2"
  | "w3"
  | "w4"
  | "c1"
  | "c2"
  | "c3"
  | "c4"
  | "a1"
  | "a2"
  | "a3"
  | "a4"
  | "a5";

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
      (n<sub>1</sub> = 3, n<sub>2</sub> = 4, n<sub>3</sub> = 4, n<sub>4</sub> = 5)
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
      I3<sub>t</sub> = E3<sub>t</sub> / D<sub>t</sub>,&nbsp;&nbsp; r<sub>3,t</sub> = 1 − (I3<sub>t</sub> / I3<sub>t−3</sub>)<sup>1/3</sup>
    </>,
    <>
      g<sub>3,t</sub> = (E3<sub>t</sub> / E3<sub>t−3</sub>)<sup>1/3</sup> − 1
    </>,
    <>
      S<sub>absolute</sub> = 1 if g<sub>3,t</sub> ≤ 0;&nbsp;&nbsp; 1 / (1 + g<sub>3,t</sub>) if g<sub>3,t</sub> &gt; 0
    </>,
    <>
      V2 = 100 × clamp(r<sub>3,t</sub> / 0.025, 0, 1) × S<sub>absolute</sub>
    </>,
  ],
  v3: [
    <>
      V3 = 100 × RE<sub>t</sub> / EL<sub>t</sub>
    </>,
  ],
  w1: [
    <>
      r<sub>amb</sub> = R / (T<sub>y</sub> − B<sub>y</sub>)
    </>,
    <>
      W1<sub>absolute</sub> = 100 × clamp(r<sub>amb</sub> / 0.042, 0, 1)
    </>,
    <>
      W1<sub>intensity</sub> = 100 × clamp(r<sub>amb</sub> / 0.07, 0, 1)
    </>,
  ],
  w2: [
    <>
      W2 = 100 × Σ<sub>s</sub> E<sub>s</sub>·c<sub>s</sub> / Σ<sub>s</sub> E<sub>s</sub>
    </>,
  ],
  w3: [
    <>
      P<sub>t</sub> = [(E<sub>B</sub> − E<sub>t</sub>) / E<sub>B</sub>] ÷ [R · (t − B<sub>y</sub>) / (T<sub>y</sub> − B<sub>y</sub>)]
    </>,
    <>
      W3 = 100 × clamp(P<sub>t</sub>, 0, 1)
    </>,
  ],
  w4: [
    <>
      W4 ∈ {"{"}0, 50, 100{"}"}
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
      C3 = 100 × clamp(P<sub>ICP</sub> / 100, 0, 1)
    </>,
  ],
  c4: [
    <>
      C4 = 100 × m / 4,&nbsp;&nbsp; m ∈ {"{"}0, 1, 2, 3, 4{"}"}
    </>,
  ],
  a1: [
    <>
      A1 = 100 × Σ<sub>s</sub> E<sub>s</sub><sup>ver</sup>·a<sub>s</sub> / Σ<sub>s</sub> E<sub>s</sub>
    </>,
    <>
      a<sub>s</sub> ∈ {"{"}0, 0.5, 1.0{"}"}
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
      A4 = 100 × min((N − 1) / 3, 1)
    </>,
  ],
  a5: [
    <>
      A5 = 100 × p / 4
    </>,
  ],
};

const ENGLISH_COPY: LogicCopy = {
  heroEyebrow: "CERs Index Methodology v1.4",
  heroTitle: "Formulas and variables",
  heroDescription:
    "The CERs (Climate-related Emissions & Responsibility Score) Index scores corporate climate transition from public disclosure only. Sixteen variables across four KPIs — and every benchmark in the method is quoted from an external standard: the index sets no numbers of its own. Reference frameworks: CDP 2024, IFRS S1/S2, the GHG Protocol, and the SBTi Corporate Net-Zero Standard.",
  principlesTitle: "Design principles — no arbitrary numbers",
  principlesDescription:
    "Every variable, formula, and aggregation step must rest on at least one of five rules, and no figure may be a back-solved allocation. All inputs must be obtainable from public disclosure; what is not disclosed scores zero.",
  principles: [
    {
      code: "R1",
      title: "External benchmark normalization",
      description:
        "Score denominators are quoted directly from international norms and scientific pathways — e.g. the SBTi 1.5°C pace of 4.2%/yr, the Stern–Stiglitz carbon price of USD 100.",
    },
    {
      code: "R2",
      title: "Raw ratios as scores",
      description:
        "Natural 0–1 ratios are scored as-is with no curvature assumptions — renewable share, target coverage, green capex share.",
    },
    {
      code: "R3",
      title: "Equal count of standard-defined items",
      description:
        "Checklists consist only of items defined by external standards, each counted equally — the 15 Scope 3 categories, the 4 TCFD/ISSB pillars.",
    },
    {
      code: "R4",
      title: "Binary facts",
      description:
        "Only externally verifiable facts are scored 0 or 1 — SBTi validation status, pay linkage disclosed or not.",
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
    "Sixteen variables, each 0–100, are averaged into four KPI scores, which are averaged into the final index. Equal weighting is the design consequence, not a convenience: with no external basis for differential weights, any chosen weight would itself be an arbitrary allocation (principle of insufficient reason; OECD/EU JRC composite-indicator handbook). Because every variable lies in 0–100 and the mean is a convex combination, the index is mathematically guaranteed to stay in 0–100.",
  equationTitles: {
    kpi: "1. Variables → KPI score (equal-weighted mean)",
    index: "2. KPI scores → CERs Index (equal-weighted mean)",
  },
  definitionsTitle: "What the symbols mean",
  definitions: [
    { key: "V_j,i", label: "Variable i of KPI j, on a 0–100 scale" },
    { key: "n_j", label: "Number of variables in KPI j (3 / 4 / 4 / 5)" },
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
      title: "KPI 1 — Realized decarbonization performance",
      tagline: "Measured change, not statements",
      description:
        "Did measured emissions and the energy mix actually move over the 3-year window? Three variables: V1–V3.",
    },
    kpi2: {
      title: "KPI 2 — Target ambition & delivery",
      tagline: "Scientific, broad, on track, validated",
      description:
        "Four questions about the target: is it 1.5°C-aligned, does it cover enough, is the company on the path, has it been independently validated? W1–W4.",
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
        "Assurance, inventory completeness, methodology transparency, time-series consistency, and disclosure-framework alignment. A1–A5. Climate disclosure regulation is concentrated here.",
    },
  },
  variablesTitle: "The sixteen variables",
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
        "The identical structure applied to value-chain emissions — typically 65–95% of the footprint — with the benchmark switched to SBTi's Scope 3 minimum of 2.5%/yr.",
      bullets: [
        "Like-for-like boundary rule: recalculated time series first; otherwise only categories reported in both years are compared; a method change without recalculation scores 0.",
        "Expanding measurement is never penalized here (it is rewarded in A2), and quietly dropping categories is neutralized by the intersection rule.",
        "Basis: SBTi Near-Term Criteria (Scope 3 minimum), GHG Protocol consistency and recalculation requirements.",
      ],
    },
    v3: {
      title: "V3. Renewable electricity share",
      description:
        "Renewable share of total electricity consumption — a leading indicator of transition that complements the lagging emissions results.",
      bullets: [
        "The ratio itself is the score: 60% renewable electricity = 60 points. The 100% endpoint comes from RE100 and the IEA Net Zero roadmap.",
        "Linear mapping is the minimal assumption: each renewable MWh contributes the same marginal abatement, and there is no external basis for curvature.",
      ],
    },
    w1: {
      title: "W1. Target ambition",
      description:
        "How fast the company's headline reduction target is, converted to a linear annual rate and measured against the 1.5°C pace.",
      bullets: [
        "\"30% by 2030 from 2020\" is 3%/yr → 3 / 4.2 ≈ 71 points.",
        "Intensity-only targets face a 7%/yr denominator (SBTi GEVA) — a fairness adjustment, since intensity must improve faster than growth to deliver absolute cuts.",
        "The headline target is selected by a pre-fixed rule (largest covered base-year emissions among absolute S1+2 targets), removing evaluator discretion.",
      ],
    },
    w2: {
      title: "W2. Target coverage",
      description:
        "How much of total emissions (Scope 1+2+3) is actually bound by valid targets — the counterweight to cherry-picked ambitious targets.",
      bullets: [
        "Coverage is resolved per scope first, then combined with emissions weights — materiality, so a scope that is 80% of the footprint carries 80% of the weight.",
        "Overlapping targets within a scope take the maximum: a conservative lower bound of the union that structurally cannot overstate. Only disclosed-disjoint targets are summed.",
        "Basis: GHG Protocol conservativeness principle; SBTi coverage thresholds as reference points.",
      ],
    },
    w3: {
      title: "W3. On-track performance",
      description: "Whether actual reductions sit on the straight line from base year to target year.",
      bullets: [
        "Numerator: reduction achieved. Denominator: reduction expected for elapsed time. 12% achieved when 15% was due = 80 points.",
        "Capped at 100 — overshoot is already rewarded in V1·V2, so the cap prevents double counting.",
        "The linear path is not a new assumption: it is the same one CDP's progress metric and SBTi's pathway definition use.",
      ],
    },
    w4: {
      title: "W4. Third-party target validation",
      description:
        "Whether the target passed independent science-based validation by a qualified body, or has formally entered the process.",
      bullets: [
        "Stage 1 is a pass/fail gate for the validator: independence, publicly documented 1.5°C-aligned criteria, public registry. Currently qualified: SBTi.",
        "Stage 2 uses the body's own official status ladder — approved 100 / committed 50 / none 0. The scale is the validator's own hierarchy, not an invented allocation.",
        "Non-participation costs at most 6.25 index points (1/16) — the equal-weight structure self-limits the penalty.",
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
      title: "C3. Internal carbon price level",
      description:
        "The strength of the carbon price signal embedded in investment decisions, measured against USD 100/tCO₂e.",
      bullets: [
        "USD 100 is the upper bound of the Stern–Stiglitz 2030 corridor (USD 50–100) — the 1.5°C-consistent end, matching the index-wide definition of full marks.",
        "No ICP = 0, and claiming a program without disclosing the price = 0: an unverifiable price is indistinguishable from no signal.",
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
      title: "A1. Third-party assurance level",
      description:
        "How much of reported emissions is independently assured, and how strongly — coverage × strength in a single number.",
      bullets: [
        "0 / 0.5 / 1.0 is the ISAE 3410 ordinal scale (none < limited < reasonable), normalized at equal intervals. Weighting by emissions applies the materiality principle: if 90% of the footprint is unassured Scope 3, strong Scope 1·2 assurance cannot mask it.",
        "Statutory ETS verification (K-ETS, EU ETS — ISO 14064-3 based, reasonable level) counts as 1.0 for the covered emissions.",
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
        "Four equally counted items from the GHG Protocol Corporate Standard's required reporting information.",
        "A disclosed recalculation policy also unlocks the preferred path in V2's like-for-like rule — the variables interlock.",
      ],
    },
    a4: {
      title: "A4. Time-series consistency",
      description:
        "Whether the company provides the comparable multi-year series this index needs to measure performance at all.",
      bullets: [
        "The denominator 3 is endogenous, not arbitrary: V1·V2 measure over a 3-year window (4 data points), so A4 is simply \"did you provide the data the index requires\". Three years of comparable data = about 67 points.",
        "Boundary changes remain continuous if recalculation is disclosed — the same philosophy as V2: measurement improvement is not punished.",
      ],
    },
    a5: {
      title: "A5. Disclosure framework alignment",
      description:
        "Whether climate reporting is organized along the four TCFD/IFRS S2 pillars: governance, strategy (incl. scenario analysis), risk management, metrics & targets.",
      bullets: [
        "Counts the existence of each pillar's disclosure; content quality is scored by the other fifteen variables.",
        "Division of labor with C4: A5 checks that the form is complete, C4 checks how deep the governance chain actually goes.",
      ],
    },
  },
  rulesTitle: "Common rules",
  rules: [
    {
      title: "Missing and not-applicable data",
      bullets: [
        "Undisclosed = 0. Disclosure incentive is the reason this index exists; imputation is never used because every imputation method injects arbitrariness.",
        "N/A is allowed only when the activity physically does not exist (e.g. V3 for a company using no electricity) and that absence is confirmed by disclosure — the variable is then removed from both numerator and denominator.",
        "Pre-excluded: CDP-membership-linked questions and biomass/bioenergy questions (low general disclosure, poor universality).",
      ],
    },
    {
      title: "Score range and the meaning of 100",
      bullets: [
        "Every variable lies in 0–100; KPI scores and the index are means, so the 0–100 bound is mathematical, not enforced.",
        "Full marks mean the same thing everywhere: 1.5°C-aligned, or the external standard's requirement fully met.",
        "All benchmarks — 4.2%, 2.5%, 7%, USD 100, 15 categories, 4 pillars, the SBTi status ladder — are quoted from external sources. The index sets no numbers of its own.",
      ],
    },
    {
      title: "Aggregation and grades",
      bullets: [
        "Equal weights at both levels: with no external basis for differential weights, any chosen weight would itself be arbitrary (principle of insufficient reason; OECD/EU JRC handbook).",
        "A geometric-mean variant is computed alongside for robustness — it flags companies whose high scores in one dimension mask a zero in another. It is not used in scoring.",
        "If grades (A/B/C/…) are published, band boundaries are defined only by distribution statistics such as universe quartiles — never by hand.",
      ],
    },
  ],
  checksTitle: "Built-in checks and balances",
  checksDescription:
    "The sixteen variables are arranged in counterbalancing pairs, so inflating one score triggers a deduction in its counterpart.",
  checks: [
    {
      title: "Intensity ↔ absolute emissions",
      description:
        "Inside V1 and V2: intensity gains from growth alone are clipped by the absolute-emissions correction.",
    },
    {
      title: "Ambition ↔ coverage",
      description:
        "W1 ↔ W2: a narrow but ambitious target (cherry-picking) scores high on W1 and is cut down by W2.",
    },
    {
      title: "Future investment ↔ present revenue",
      description:
        "C1 ↔ C2: investment claims about the future are checked against what the business earns from today.",
    },
    {
      title: "Performance claims ↔ data credibility",
      description:
        "KPI 1–3 ↔ KPI 4: performance numbers carry less weight in interpretation when assurance, completeness, and transparency are weak — the geometric-mean flag makes the imbalance visible.",
    },
  ],
};

const KOREAN_COPY: LogicCopy = {
  heroEyebrow: "CERs Index 평가방법론 v1.4",
  heroTitle: "산식과 변수",
  heroDescription:
    "CERs(Climate-related Emissions & Responsibility Score) Index는 공개 자료만으로 기업의 기후전환을 채점합니다. 4개 KPI에 걸친 16개 변수로 구성되며, 방법론의 모든 기준값은 외부 표준에서 인용한 것으로 지수가 자체 설정한 수치는 존재하지 않습니다. 기준 프레임워크: CDP 2024, IFRS S1/S2, GHG Protocol, SBTi Corporate Net-Zero Standard.",
  principlesTitle: "설계 원칙 — 임의 배점 금지",
  principlesDescription:
    "모든 변수·산식·집계는 아래 5개 규칙 중 하나 이상에 근거해야 하며, 어떤 수치도 결과를 보고 역산한 배점이어서는 안 됩니다. 모든 입력값은 공개 자료에서 확보 가능해야 하고, 공시하지 않은 것은 0점입니다.",
  principles: [
    {
      code: "R1",
      title: "외부 벤치마크 정규화",
      description:
        "점수의 분모(기준값)는 국제 규범·과학적 경로에서 직접 인용합니다 — SBTi 1.5°C 연 4.2% 감축률, Stern–Stiglitz 탄소가격 USD 100 등.",
    },
    {
      code: "R2",
      title: "비율 그 자체 사용",
      description:
        "0~1 사이의 자연 비율은 변환 없이 그대로 점수화합니다(곡률 가정 배제 = 최소 가정 원칙) — 재생전력 비중, 목표 커버리지, 녹색 CAPEX 비중.",
    },
    {
      code: "R3",
      title: "표준 정의 항목의 동일가중 카운트",
      description:
        "체크리스트는 외부 표준이 정의한 항목으로만 구성하고 각 항목을 동일하게 셉니다 — GHG Protocol Scope 3 15개 카테고리, TCFD/ISSB 4대 축.",
    },
    {
      code: "R4",
      title: "사실 여부 이진값",
      description: "외부에서 검증 가능한 사실(있다/없다)만 0 또는 1로 채점합니다 — SBTi 검증 여부, 보상 연계 공시 여부.",
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
    "0~100 범위의 16개 변수를 4개 KPI 점수로 평균하고, 다시 4개 KPI를 평균해 최종 지수를 만듭니다. 동일가중은 편의가 아니라 설계의 귀결입니다: 차등 가중을 정당화할 외부 근거가 없을 때, 어떤 가중치든 그 수치 자체가 임의 배점이 됩니다(불충분 이유의 원리, OECD·EU JRC 종합지표 핸드북). 모든 변수가 0~100이고 평균은 볼록결합이므로 지수의 0~100 범위는 수학적으로 보장됩니다.",
  equationTitles: {
    kpi: "1. 변수 → KPI 점수 (동일가중 평균)",
    index: "2. KPI 점수 → CERs Index (동일가중 평균)",
  },
  definitionsTitle: "기호 설명",
  definitions: [
    { key: "V_j,i", label: "KPI j의 i번째 변수, 0~100 범위" },
    { key: "n_j", label: "KPI j의 변수 수 (3 / 4 / 4 / 5)" },
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
      title: "KPI 1 — 실질 탈탄소 성과",
      tagline: "말이 아닌 실측",
      description: "배출량과 에너지 구조가 3년 창에서 실제로 움직였는가. 변수 3개: V1~V3.",
    },
    kpi2: {
      title: "KPI 2 — 감축 목표 및 이행",
      tagline: "과학적이고, 넓고, 궤도 위에 있고, 검증받았는가",
      description:
        "목표에 대한 4가지 질문: 1.5°C에 정합하는가, 충분히 커버하는가, 경로 위에 있는가, 독립 검증을 받았는가. W1~W4.",
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
        "검증, 인벤토리 완전성, 방법론 투명성, 시계열 일관성, 공시 체계 정합성. A1~A5. 기후 공시 규제 요건이 집중 반영되는 KPI입니다.",
    },
  },
  variablesTitle: "16개 변수",
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
        "가치사슬 배출(통상 총배출의 65~95%)에 동일한 구조를 적용하되, 벤치마크만 SBTi Scope 3 최소 기준인 연 2.5%로 교체합니다.",
      bullets: [
        "경계 일관성(like-for-like) 규칙: 재산정 시계열 우선, 없으면 양 연도 공통 카테고리만 비교, 방법론 변경 후 재산정이 없으면 0점.",
        "측정을 늘린 회사는 여기서 벌받지 않고(보상은 A2 상승), 카테고리를 슬쩍 뺀 위장 감축은 교집합 규칙으로 무력화됩니다.",
        "근거: SBTi Near-Term Criteria(Scope 3 최소 야심 연 2.5%), GHG Protocol 일관성·재산정 요건.",
      ],
    },
    v3: {
      title: "V3. 재생에너지 전환율",
      description: "총 전력 소비 중 재생에너지 전력의 비중 — 후행지표인 배출량을 보완하는 전환의 선행지표.",
      bullets: [
        "비율 그대로가 점수입니다: 재생전력 60%면 60점. 종점 100%는 RE100과 IEA Net Zero 로드맵에서 옵니다.",
        "직선 매핑이 최소 가정입니다: 재생전력 1MWh의 한계 감축 기여는 동일하며, 곡률을 부여할 외부 근거가 없습니다.",
      ],
    },
    w1: {
      title: "W1. 목표 야심도",
      description: "공표한 대표 감축 목표를 연 단위 선형 감축률로 환산해 1.5°C 경로의 자로 잰 값.",
      bullets: [
        "\"2030년까지 2020년 대비 30% 감축\"은 연 3%p → 3 / 4.2 ≈ 71점.",
        "원단위 목표만 있으면 분모가 연 7%(SBTi GEVA)로 올라갑니다 — 페널티가 아니라 공정화입니다: 성장만큼 원단위는 더 빨리 개선해야 절대 감축이 나옵니다.",
        "대표 목표 선정 규칙(S1+2 포함 절대량 목표 중 커버 배출량 최대)을 사전 고정해 평가자 재량을 제거했습니다.",
      ],
    },
    w2: {
      title: "W2. 목표 커버리지",
      description: "총배출(Scope 1+2+3) 중 유효 목표가 실제로 구속하는 비중 — 체리피킹 목표에 대한 교정 장치.",
      bullets: [
        "Scope 단위로 커버리지를 먼저 확정한 뒤 배출량으로 가중 결합합니다(중요성 원칙) — 총배출의 80%인 Scope가 80%의 무게를 갖습니다.",
        "같은 Scope 안의 중복 목표는 최댓값을 씁니다: 공시만으로 계산 가능한 합집합의 최대 하한으로, 과대평가가 구조적으로 불가능합니다. 서로소가 공시로 확인된 경우에만 합산.",
        "근거: GHG Protocol 보수성 원칙, SBTi 커버리지 요건(참조점).",
      ],
    },
    w3: {
      title: "W3. 목표 이행 진척도",
      description: "기준연도→목표연도 직선 경로 위에 실제 감축이 있는가.",
      bullets: [
        "분자는 실제 달성 감축률, 분모는 경과기간만큼 기대되는 감축률. 15%를 줄였어야 할 때 12%를 줄였다면 80점.",
        "100에서 절사합니다 — 초과 달성분은 이미 V1·V2의 실측 성과로 보상되므로 이중 계상을 막습니다.",
        "선형 경로는 새 가정이 아니라 CDP 진척도 산식·SBTi 경로 정의와 동일한 가정입니다.",
      ],
    },
    w4: {
      title: "W4. 목표의 제3자 검증",
      description: "목표가 적격한 독립 기관의 과학 기반 검증을 통과했는가, 또는 공식 절차에 진입했는가.",
      bullets: [
        "1단계는 검증기관의 통과/탈락 게이트입니다: 독립성, 공개된 1.5°C 정합 판정 기준, 공개 등록부. 현행 적격 기관: SBTi.",
        "2단계는 적격 기관 자신의 공식 상태 서열을 그대로 씁니다 — 승인 100 / 커밋 50 / 미참여 0. 우리가 만든 배점이 아니라 기관의 공식 서열의 등간 정규화입니다.",
        "미참여의 불이익은 최종 지수 기준 최대 6.25점(1/16) — 동일가중 구조가 페널티를 자체 상한합니다.",
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
      title: "C3. 내부탄소가격 수준",
      description: "투자 의사결정에 내재화된 탄소가격 신호의 강도를 USD 100/tCO₂e 기준으로 잰 값.",
      bullets: [
        "기준가 USD 100은 Stern–Stiglitz 위원회의 2030년 가격 회랑(USD 50~100)의 상단 — 지수 전체의 만점 기준이 1.5°C 정합으로 통일되어 있기 때문입니다(하단 50달러는 2°C 하방).",
        "미도입 = 0, 그리고 도입 주장 + 가격 비공시 = 0: 확인 불가능한 가격은 신호 부재와 구별할 수 없습니다.",
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
      title: "A1. 제3자 검증 수준",
      description: "보고 배출량 중 독립 검증을 받은 비중과 검증 강도 — 커버리지 × 강도를 하나의 숫자로.",
      bullets: [
        "0 / 0.5 / 1.0은 ISAE 3410이 정의한 서열(없음 < 제한적 < 합리적)의 등간 정규화입니다. 배출량 가중은 중요성 원칙 — 총배출의 90%인 Scope 3가 미검증이면 S1·2를 아무리 잘 검증해도 점수가 낮습니다.",
        "배출권거래제 법정 검증(K-ETS, EU ETS — ISO 14064-3 기반, 합리적 보증 수준)은 해당 배출량에 1.0으로 인정합니다.",
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
        "GHG Protocol Corporate Standard의 필수 보고 정보 4항목의 동일 카운트입니다.",
        "재산정 정책을 공시한 회사는 V2의 like-for-like 규칙에서도 1순위 경로를 탈 수 있습니다 — 변수들이 맞물려 작동합니다.",
      ],
    },
    a4: {
      title: "A4. 시계열 일관성",
      description: "이 지수가 성과를 측정하는 데 필요한 비교 가능한 연속 시계열을 제공했는가.",
      bullets: [
        "분모 3은 임의값이 아니라 내생적입니다: V1·V2가 3년 창(4개 시점)을 요구하므로, A4는 \"지수 계산에 필요한 데이터를 제공했는가\"의 충족률입니다. 비교 가능한 데이터가 3년치면 약 67점입니다.",
        "경계가 바뀌어도 재산정 공시가 있으면 연속으로 인정합니다 — 측정 개선을 벌하지 않는 V2와 동일한 철학.",
      ],
    },
    a5: {
      title: "A5. 기후 공시 체계 정합성",
      description: "기후 공시가 TCFD/IFRS S2의 4대 축 — 거버넌스, 전략(시나리오 분석 포함), 위험관리, 지표·목표 — 을 갖추었는가.",
      bullets: [
        "각 축의 공시 존재만 사실 판정하며, 내용의 질은 나머지 15개 변수가 평가합니다.",
        "C4와의 분업: A5는 형식의 완비(공시 체계가 서 있는가), C4는 거버넌스 축 내부의 실질적 깊이를 봅니다.",
      ],
    },
  },
  rulesTitle: "공통 규칙",
  rules: [
    {
      title: "결측·비해당 처리",
      bullets: [
        "미공시 = 0점. 공시 인센티브가 이 지수의 존재 이유이며, 결측 대체(imputation)는 어떤 방법이든 자의성이 개입되므로 쓰지 않습니다.",
        "N/A는 활동이 물리적으로 존재하지 않고(예: 전력 무사용 기업의 V3) 그 부존재가 공시로 확인되는 경우에만 허용 — 해당 변수를 분자·분모에서 모두 제외합니다.",
        "사전 제외: CDP 직접 연계 문항과 바이오매스·바이오에너지 문항(낮은 공시율, 범용성 결여).",
      ],
    },
    {
      title: "점수 범위와 만점의 의미",
      bullets: [
        "모든 변수가 0~100이고 KPI·지수는 평균이므로 0~100 범위는 수학적으로 보장됩니다(별도 절사 불필요).",
        "만점의 의미는 모든 변수에서 동일합니다: 1.5°C 정합 수준, 또는 외부 표준의 요구 완전 충족.",
        "모든 기준값 — 4.2%, 2.5%, 7%, USD 100, 15개 카테고리, 4대 축, SBTi 상태 분류 — 은 외부 출처에서 인용된 것이며, 지수가 자체 설정한 수치는 없습니다.",
      ],
    },
    {
      title: "집계와 등급",
      bullets: [
        "두 단계 모두 동일가중: 차등 가중을 정당화할 외부 근거가 없을 때 동일가중이 유일한 비자의적 선택입니다(불충분 이유의 원리, OECD·EU JRC 핸드북).",
        "강건성 점검용으로 기하평균 변형을 병행 산출합니다 — 한 차원의 고득점이 다른 차원의 0점을 가리는 기업을 플래그하며, 점수 산정에는 쓰지 않습니다.",
        "등급(A/B/C 등)을 부여할 경우 구간 경계는 유니버스 사분위수 등 분포 기반 통계량으로만 정의합니다 — 손으로 정하지 않습니다.",
      ],
    },
  ],
  checksTitle: "내장된 상호 견제 구조",
  checksDescription:
    "16개 변수는 서로 견제하는 짝으로 짜여 있어, 한 변수에서 점수를 부풀리는 행동이 짝 변수에서 감점됩니다.",
  checks: [
    {
      title: "원단위 개선 ↔ 절대량 보정",
      description: "V1·V2 내부: 성장만으로 얻은 집약도 개선은 절대량 보정으로 깎입니다.",
    },
    {
      title: "야심도 ↔ 커버리지",
      description: "W1 ↔ W2: 좁은 범위의 야심찬 목표(체리피킹)는 W1이 높아도 W2가 깎습니다.",
    },
    {
      title: "미래 투자 ↔ 현재 매출",
      description: "C1 ↔ C2: 미래에 대한 투자 주장은 지금 사업이 무엇으로 버는지와 대조됩니다.",
    },
    {
      title: "성과 주장 ↔ 데이터 신뢰성",
      description:
        "KPI 1~3 ↔ KPI 4: 검증·완전성·투명성이 약하면 성과 숫자의 해석 무게가 줄어듭니다 — 기하평균 플래그가 불균형을 가시화합니다.",
    },
  ],
};

const JAPANESE_COPY: LogicCopy = {
  heroEyebrow: "CERs Index 評価方法論 v1.4",
  heroTitle: "算式と変数",
  heroDescription:
    "CERs（Climate-related Emissions & Responsibility Score）Index は、公開資料のみから企業の気候移行を採点します。4つの KPI にまたがる 16 変数で構成され、方法論のすべての基準値は外部標準から引用したもので、指数が独自に設定した数値は存在しません。参照フレームワーク: CDP 2024、IFRS S1/S2、GHG Protocol、SBTi Corporate Net-Zero Standard。",
  principlesTitle: "設計原則 — 恣意的な配点の禁止",
  principlesDescription:
    "すべての変数・算式・集計は以下 5 つのルールのいずれかに基づかなければならず、いかなる数値も結果から逆算した配点であってはなりません。すべての入力値は公開資料から取得可能でなければならず、未開示は 0 点です。",
  principles: [
    {
      code: "R1",
      title: "外部ベンチマーク正規化",
      description:
        "スコアの分母（基準値）は国際規範・科学的経路から直接引用します — SBTi 1.5°C の年 4.2% 削減率、Stern–Stiglitz 炭素価格 USD 100 など。",
    },
    {
      code: "R2",
      title: "比率そのものを使用",
      description:
        "0〜1 の自然な比率は変換せずそのまま採点します（曲率仮定の排除 = 最小仮定原則）— 再エネ電力比率、目標カバレッジ、グリーン CAPEX 比率。",
    },
    {
      code: "R3",
      title: "標準定義項目の同一カウント",
      description:
        "チェックリストは外部標準が定義した項目のみで構成し、各項目を同等に数えます — GHG Protocol Scope 3 の 15 カテゴリ、TCFD/ISSB の 4 本柱。",
    },
    {
      code: "R4",
      title: "事実の二値判定",
      description: "外部から検証可能な事実（有/無）のみを 0 または 1 で採点します — SBTi 認定の有無、報酬連動の開示有無。",
    },
    {
      code: "R5",
      title: "順序尺度の等間隔正規化",
      description: "規制が定義した序列（なし < 限定的 < 合理的保証）を等間隔に正規化します — 0 / 0.5 / 1。",
    },
  ],
  equationsTitle: "集計",
  equationsDescription:
    "0〜100 の 16 変数を 4 つの KPI スコアに平均し、さらに 4 つの KPI を平均して最終指数を作ります。等加重は便宜ではなく設計の帰結です: 差等加重を正当化する外部根拠がない場合、いかなる重みもそれ自体が恣意的配点になります（不十分理由の原理、OECD・EU JRC 総合指標ハンドブック）。すべての変数が 0〜100 で平均は凸結合のため、指数の 0〜100 範囲は数学的に保証されます。",
  equationTitles: {
    kpi: "1. 変数 → KPI スコア（等加重平均）",
    index: "2. KPI スコア → CERs Index（等加重平均）",
  },
  definitionsTitle: "記号の意味",
  definitions: [
    { key: "V_j,i", label: "KPI j の i 番目の変数、0〜100 の範囲" },
    { key: "n_j", label: "KPI j の変数数（3 / 4 / 4 / 5）" },
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
      title: "KPI 1 — 実質的な脱炭素成果",
      tagline: "言葉ではなく実測",
      description: "排出量とエネルギー構造が 3 年のウィンドウで実際に動いたか。変数 3 つ: V1〜V3。",
    },
    kpi2: {
      title: "KPI 2 — 削減目標と履行",
      tagline: "科学的か、広いか、軌道上か、検証済みか",
      description:
        "目標への 4 つの問い: 1.5°C に整合するか、十分カバーするか、経路上にあるか、独立検証を受けたか。W1〜W4。",
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
        "保証、インベントリ完全性、方法論の透明性、時系列の一貫性、開示体系の整合性。A1〜A5。気候開示規制の要件が集中的に反映される KPI です。",
    },
  },
  variablesTitle: "16の変数",
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
        "バリューチェーン排出（通常、総排出の 65〜95%）に同一構造を適用し、ベンチマークのみ SBTi の Scope 3 最低基準である年 2.5% に置き換えます。",
      bullets: [
        "境界一貫性（like-for-like）ルール: 再算定時系列を優先、なければ両年度共通のカテゴリのみで比較、方法論変更後に再算定がなければ 0 点。",
        "測定を拡大した企業はここでは罰せられず（報酬は A2 の上昇）、カテゴリをこっそり外した偽装削減は共通部分ルールで無力化されます。",
        "根拠: SBTi Near-Term Criteria（Scope 3 最低基準 年 2.5%）、GHG Protocol の一貫性・再算定要件。",
      ],
    },
    v3: {
      title: "V3. 再生可能エネルギー転換率",
      description: "総電力消費に占める再エネ電力の比率 — 遅行指標である排出量を補完する移行の先行指標。",
      bullets: [
        "比率そのものがスコアです: 再エネ電力 60% なら 60 点。終点 100% は RE100 と IEA Net Zero ロードマップに由来します。",
        "線形マッピングが最小仮定です: 再エネ 1MWh の限界削減寄与は同一で、曲率を与える外部根拠がありません。",
      ],
    },
    w1: {
      title: "W1. 目標野心度",
      description: "公表された代表削減目標を年単位の線形削減率に換算し、1.5°C 経路の物差しで測った値。",
      bullets: [
        "「2030 年までに 2020 年比 30% 削減」は年 3%p → 3 / 4.2 ≈ 71 点。",
        "原単位目標のみの場合は分母が年 7%（SBTi GEVA）に上がります — ペナルティではなく公平化です: 成長の分だけ原単位はより速く改善しないと絶対削減になりません。",
        "代表目標の選定ルール（S1+2 を含む絶対量目標のうちカバー排出量最大）を事前固定し、評価者の裁量を排除しました。",
      ],
    },
    w2: {
      title: "W2. 目標カバレッジ",
      description: "総排出（Scope 1+2+3）のうち有効な目標が実際に拘束する比率 — チェリーピッキング目標への矯正装置。",
      bullets: [
        "Scope 単位でカバレッジを先に確定し、排出量で加重結合します（重要性原則）— 総排出の 80% を占める Scope が 80% の重みを持ちます。",
        "同一 Scope 内の重複目標は最大値を使用: 開示のみで計算可能な合併集合の最大下限で、過大評価が構造的に不可能です。互いに素であることが開示で確認された場合のみ合算。",
        "根拠: GHG Protocol の保守性原則、SBTi カバレッジ要件（参照点）。",
      ],
    },
    w3: {
      title: "W3. 目標履行進捗度",
      description: "基準年→目標年の直線経路の上に実際の削減があるか。",
      bullets: [
        "分子は実際の達成削減率、分母は経過期間に応じて期待される削減率。15% 減らすべきところ 12% なら 80 点。",
        "100 で切り捨てます — 超過達成分は既に V1・V2 の実測成果で報われるため、二重計上を防ぎます。",
        "線形経路は新しい仮定ではなく、CDP の進捗算式・SBTi の経路定義と同一の仮定です。",
      ],
    },
    w4: {
      title: "W4. 目標の第三者検証",
      description: "目標が適格な独立機関の科学的検証を通過したか、または公式手続きに入ったか。",
      bullets: [
        "第 1 段階は検証機関の通過/脱落ゲートです: 独立性、公開された 1.5°C 整合の判定基準、公開登録簿。現行の適格機関: SBTi。",
        "第 2 段階は適格機関自身の公式ステータス序列をそのまま使用 — 承認 100 / コミット 50 / 不参加 0。発明した配点ではなく、機関の公式序列の等間隔正規化です。",
        "不参加の不利益は最終指数で最大 6.25 点（1/16）— 等加重構造がペナルティを自己制限します。",
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
      title: "C3. 内部炭素価格水準",
      description: "投資意思決定に内在化された炭素価格シグナルの強度を USD 100/tCO₂e 基準で測った値。",
      bullets: [
        "基準価格 USD 100 は Stern–Stiglitz 委員会の 2030 年価格回廊（USD 50〜100）の上限 — 指数全体の満点基準が 1.5°C 整合に統一されているためです（下限 50 ドルは 2°C 下方）。",
        "未導入 = 0、さらに導入主張 + 価格非開示 = 0: 確認不可能な価格はシグナル不在と区別できません。",
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
      title: "A1. 第三者保証水準",
      description: "報告排出量のうち独立保証を受けた比率と保証の強度 — カバレッジ × 強度を一つの数字に。",
      bullets: [
        "0 / 0.5 / 1.0 は ISAE 3410 が定義した序列（なし < 限定的 < 合理的）の等間隔正規化です。排出量加重は重要性原則 — 総排出の 90% である Scope 3 が未保証なら、S1・2 をどれだけ保証しても点数は低くなります。",
        "排出量取引制度の法定検証（K-ETS、EU ETS — ISO 14064-3 ベース、合理的保証水準）は該当排出量に 1.0 として認定します。",
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
        "GHG Protocol Corporate Standard の必須報告情報 4 項目の同一カウントです。",
        "再算定方針を開示した企業は V2 の like-for-like ルールでも第 1 優先経路に乗れます — 変数同士が噛み合って機能します。",
      ],
    },
    a4: {
      title: "A4. 時系列の一貫性",
      description: "この指数が成果を測定するのに必要な、比較可能な連続時系列を提供したか。",
      bullets: [
        "分母 3 は恣意値ではなく内生的です: V1・V2 が 3 年ウィンドウ（4 時点）を要求するため、A4 は「指数計算に必要なデータを提供したか」の充足率です。比較可能なデータが 3 年分なら約 67 点です。",
        "境界が変わっても再算定の開示があれば連続と認定します — 測定改善を罰しない V2 と同じ哲学です。",
      ],
    },
    a5: {
      title: "A5. 気候開示体系の整合性",
      description: "気候開示が TCFD/IFRS S2 の 4 本柱 — ガバナンス、戦略（シナリオ分析を含む）、リスク管理、指標・目標 — を備えているか。",
      bullets: [
        "各柱の開示の存在のみを事実判定し、内容の質は残りの 15 変数が評価します。",
        "C4 との分業: A5 は形式の完備（開示体系が立っているか）、C4 はガバナンス柱内部の実質的な深さを見ます。",
      ],
    },
  },
  rulesTitle: "共通ルール",
  rules: [
    {
      title: "欠損・非該当の処理",
      bullets: [
        "未開示 = 0 点。開示インセンティブがこの指数の存在理由であり、欠損補完（imputation）はいかなる方法でも恣意性が入るため使いません。",
        "N/A は活動が物理的に存在せず（例: 電力を使わない企業の V3）、その不存在が開示で確認される場合のみ許容 — 当該変数を分子・分母の両方から除外します。",
        "事前除外: CDP 直接連携の設問とバイオマス・バイオエネルギー設問（低い開示率、汎用性の欠如）。",
      ],
    },
    {
      title: "スコア範囲と満点の意味",
      bullets: [
        "すべての変数が 0〜100 で KPI・指数は平均のため、0〜100 範囲は数学的に保証されます（別途の切り捨て不要）。",
        "満点の意味はすべての変数で同一です: 1.5°C 整合水準、または外部標準の要求の完全充足。",
        "すべての基準値 — 4.2%、2.5%、7%、USD 100、15 カテゴリ、4 本柱、SBTi ステータス分類 — は外部出所からの引用であり、指数が独自に設定した数値はありません。",
      ],
    },
    {
      title: "集計と等級",
      bullets: [
        "両段階とも等加重: 差等加重を正当化する外部根拠がない場合、等加重が唯一の非恣意的選択です（不十分理由の原理、OECD・EU JRC ハンドブック）。",
        "頑健性チェック用に幾何平均バリアントを並行算出します — ある次元の高得点が別の次元の 0 点を覆い隠す企業をフラグし、スコア算定には使いません。",
        "等級（A/B/C など）を付与する場合、区間境界はユニバースの四分位数など分布ベースの統計量でのみ定義します — 手で決めません。",
      ],
    },
  ],
  checksTitle: "組み込みの相互牽制構造",
  checksDescription:
    "16 の変数は互いに牽制し合うペアで構成されており、ある変数でスコアを膨らませる行動はペア変数で減点されます。",
  checks: [
    {
      title: "原単位改善 ↔ 絶対量補正",
      description: "V1・V2 の内部: 成長だけで得た原単位改善は絶対量補正で削られます。",
    },
    {
      title: "野心度 ↔ カバレッジ",
      description: "W1 ↔ W2: 狭い範囲の野心的な目標（チェリーピッキング）は W1 が高くても W2 が削ります。",
    },
    {
      title: "未来の投資 ↔ 現在の売上",
      description: "C1 ↔ C2: 未来への投資主張は、今の事業が何で稼いでいるかと対照されます。",
    },
    {
      title: "成果の主張 ↔ データ信頼性",
      description:
        "KPI 1〜3 ↔ KPI 4: 保証・完全性・透明性が弱ければ成果数値の解釈上の重みが減ります — 幾何平均フラグが不均衡を可視化します。",
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
