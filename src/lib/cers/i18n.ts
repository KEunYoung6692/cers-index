export const SUPPORTED_LOCALES = ["en", "ko", "ja"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

const ENGLISH_COPY = {
  localeName: "English",
  languages: {
    en: "English",
    ko: "한국어",
    ja: "日本語",
  },
  nav: {
    home: "Home",
    companies: "Companies",
    compare: "Compare",
    industries: "Sectors",
    about: "Methodology",
    scoreLogic: "Score Logic",
  },
  alerts: {
    fallbackSampleData: "Showing fallback sample data.",
  },
  common: {
    score: "Score",
    averageScore: "Average score",
    avgScore: "Avg score",
    fiscalYearLabel: (year: number | string) => `FY${year} basis`,
    weightedContribution: "Weighted contribution",
    viewDetails: "View details",
    backToCompanies: "Back to companies",
    backToIndustries: "Back to sectors",
    latestDisclosure: "Latest disclosure",
    frameworks: "Frameworks",
    assurance: "Assurance",
    revenue: "Revenue",
    noLinkedDocument: "No linked document",
    notSpecified: "Not specified",
    noData: "—",
    yes: "Yes",
    no: "No",
    companiesLabel: (count: number) => `${count} companies`,
  },
  kpi: {
    title: "Four KPI profile",
    description:
      "The total score is the equal-weighted mean of four distinct decision-useful dimensions.",
    methodLink: "View all 12 variables and formulas",
    items: [
      {
        code: "KPI 1",
        title: "Realized decarbonization",
        description: "Measured change in Scope 1·2 and Scope 3 emissions.",
        variables: "V1-V2 · 2 variables",
      },
      {
        code: "KPI 2",
        title: "Target ambition & delivery",
        description: "Target design completeness and on-track delivery.",
        variables: "W1-W2 · 2 variables",
      },
      {
        code: "KPI 3",
        title: "Capital allocation",
        description: "Investment, revenue, carbon pricing, and governance alignment.",
        variables: "C1-C4 · 4 variables",
      },
      {
        code: "KPI 4",
        title: "Data credibility",
        description: "Validation, assurance, completeness, and disclosure alignment.",
        variables: "A1-A4 · 4 variables",
      },
    ],
  },
  header: {
    productLabel: "Climate transition intelligence",
    searchPlaceholder: "Search companies...",
    languageLabel: "Language",
    themeLabel: "Theme",
    darkMode: "Dark",
    lightMode: "Light",
  },
  footer: {
    productLabel: "Public climate intelligence",
    description:
      "A comparable, evidence-led view of corporate carbon reduction performance built from public disclosures.",
    disclaimer:
      "CERs Index is an analytical information service, not investment advice or an overall ESG rating.",
  },
  home: {
    eyebrow: "Public Carbon Reduction Dashboard",
    title: "Understand corporate carbon reduction at a glance",
    description:
      "CERs Index helps non-experts see whether a company is actually reducing emissions, how credible its targets look, and how it compares with peers in the same sector.",
    primaryCta: "Explore companies",
    secondaryCta: "Review methodology",
    proofPublic: "Public evidence only",
    proofFramework: "12 variables · 4 KPIs",
    proofComparable: "Comparable 0-100 index",
    coverageEyebrow: "Coverage & confidence",
    coverageTitle: "Know the evidence universe before reading the ranking",
    statScored: "Companies scored",
    statLatestYear: "Latest score year",
    statMethodology: "Methodology",
    kpiEyebrow: "Decision framework",
    kpiTitle: "Four lenses on transition quality",
    kpiDescription:
      "Performance, targets, capital decisions, and data credibility remain separate so one strength cannot hide another weakness.",
    evidenceEyebrow: "Public evidence signals",
    evidenceTitle: "What companies have put on the public record",
    evidenceDescription:
      "Targets and net-zero statements are shown as disclosed facts. They do not replace measured performance or the full CERs Index.",
    noScoredData:
      "The company universe is live, but the current scoring run has not produced publishable index results yet.",
    updatedAt: (date: string) => `Data refreshed ${date}`,
    snapshotEyebrow: "Snapshot",
    snapshotTitle: "Quick market view",
    snapshotDescription: "A compact view of the current disclosure universe used in this dashboard.",
    statCompanies: "Companies tracked",
    statIndustries: "Sectors covered",
    statTargets: "Reduction targets",
    statNetZero: "Net zero declarations",
    searchPlaceholder: "Search for a company...",
    featuredEyebrow: "Featured",
    featuredTitle: "Featured companies",
    browseAllCompanies: "Browse all companies",
    leaderboardEyebrow: "Leaderboard",
    leaderboardTitle: "Top scoring companies",
    clearTargetsTitle: "Companies with clear reduction targets",
    targetFallback: "Target",
    netZeroTitle: "Companies with net zero declarations",
    netZeroTarget: "Net zero target",
    scopeNotSpecified: "Scope not specified",
    industryEyebrow: "Sector View",
    industryTitle: "Explore by sector",
    seeAllIndustries: "See all sectors",
    scoreMeaningEyebrow: "What the score means",
    scoreMeaningTitle: "A public view of climate transition reliability",
    scoreMeaningDescription:
      "Twelve public-evidence variables form four equally weighted KPIs: realized decarbonization, target ambition and delivery, capital allocation, and data credibility.",
    learnMore: "Learn more about the score",
  },
  companies: {
    eyebrow: "Companies",
    title: "Browse corporate carbon reduction profiles",
    description:
      "Search and compare companies using the latest CERs Index, reduction targets, and disclosure signals.",
    scoreListCta: "View full index table",
    scoreListTitle: "CERs Index List",
    scoreListDescription: "A score-sorted table of all companies currently available in the CERs dashboard.",
    scoreListCount: (count: number) => `${count} companies in score order`,
    scoreListColumns: {
      rank: "Rank",
      company: "Company",
      sector: "Sector",
      country: "Country",
      basisYear: "Basis year",
      score: "CERs Index",
      band: "Band",
    },
    filters: "Filters",
    industry: "Sector",
    country: "Country",
    year: "Year",
    allIndustries: "All sectors",
    allCountries: "All countries",
    allYears: "All years",
    scoreRange: "Score range",
    allScores: "All scores",
    below60: "Below 60",
    targetAnnounced: "Target announced",
    netZeroDeclared: "Net zero declared",
    scoredOnly: "Scored companies only",
    sortBy: "Sort by",
    sortScore: "Score",
    sortName: "Name",
    sortTargetYear: "Target year",
    searchPlaceholder: "Search companies...",
    showing: (count: number) => `Showing ${count} companies.`,
    topResultScore: (score: string) => `Current top result score: ${score}`,
    noResults: "No companies match the current filters.",
  },
  compare: {
    eyebrow: "Compare",
    title: "Compare two to three companies side by side",
    description:
      "Compare the overall index, four KPI profile, emissions, targets, and assurance evidence across companies.",
    selectCompanies: "Select companies",
    selectCompany: "Select a company",
    scoreDimensions: "Score dimensions",
    roadmapComparison: "Roadmap KPI comparison",
    metric: "Metric",
    metrics: {
      scope1: "Scope 1",
      scope2: "Scope 2",
      totalEmissions: "Total emissions",
      targetYear: "Target year",
      targetEmissions: "Target emissions",
      reductionVsBase: "Reduction vs base",
      netZeroYear: "Net zero year",
      assurance: "Assurance",
    },
  },
  industries: {
    eyebrow: "Sectors",
    title: "Explore climate performance by sector",
    description:
      "Use sector context to understand where a company stands relative to peers facing similar transition conditions.",
    searchPlaceholder: "Search sectors...",
    filterAll: "All sectors",
    filterScored: "Scored sectors",
    filterRobust: "30+ companies",
    filterLimited: "Limited sample",
    medianScore: "Median score",
    scoreCoverage: "Score coverage",
    limitedSample: "Limited sample",
    robustSample: "Robust sample",
    noResults: "No sectors match the current filters.",
  },
  industryDetail: {
    eyebrow: "Sector detail",
    snapshot: "Sector snapshot",
    medianScore: "Median score",
    scoreCoverage: "Score coverage",
    interquartileRange: "Interquartile range",
    sampleRule: "Sample rule",
    latestScoreYear: "Latest scored year",
    robustSample: "30+ company sample",
    limitedSample: "Below 30 companies",
    categoryOverview: "Category profile",
    categoryOverviewDescription:
      "The four KPI profile shows where this sector is comparatively strong or uneven.",
    strongestDimension: "Strongest dimension",
    weakestDimension: "Weakest dimension",
    transitionSignals: "Target and transition signals",
    transitionSignalsDescription:
      "These indicators show how widely companies in this sector publish reduction pathways and long-term commitments.",
    disclosureSignals: "Disclosure and evidence signals",
    disclosureSignalsDescription:
      "These indicators summarize how well the sector documents climate data quality, assurance, and value-chain coverage.",
    targetCoverage: "Reduction target coverage",
    netZeroCoverage: "Net zero declarations",
    sbtiCoverage: "SBTi approved",
    interimCoverage: "Interim target coverage",
    medianTargetYear: "Median target year",
    assuranceCoverage: "Third-party assurance",
    scope3Coverage: "Scope 3 category coverage",
    primaryDataRatio: "Primary data ratio",
    frameworkCoverage: "Framework adoption",
    basedOnScoredCompanies: (count: number) => `Based on ${count} scored companies`,
    scoreDistribution: "Score distribution",
    viewSectorCompanies: "View companies in this sector",
    topCompanies: (label: string) => `Top companies in ${label}`,
    whatMatters: (label: string) => `What matters in ${label}`,
  },
  companyDetail: {
    cersScore: "CERs Index",
    kpiProfile: "Four KPI profile",
    kpiProfileDescription:
      "These scores come from the same scoring run as the overall index. The frontend does not estimate missing values.",
    methodologyBasis: "Methodology",
    scoreBasisYear: "Score basis",
    latestEvidence: "Latest evidence",
    evidenceOverview: "Evidence overview",
    evidenceOverviewDescription:
      "Read the disclosed target, emissions, assurance, and source document together with the KPI profile.",
    companyScoreLabel: "Company score",
    sectorAverageLabel: "Sector average",
    roadmapTitle: "Carbon Reduction Roadmap",
    roadmapDescription:
      "Current values use the latest reported company data. Target and net zero milestones use public targets and scenario assumptions from the latest available disclosure.",
    roadmapCards: {
      currentTotalEmissions: "Current total emissions",
      targetYear: "Target year",
      targetEmissions: "Target emissions",
      reductionVsBase: "Reduction vs base",
      netZeroYear: "Net zero year",
    },
    kpis: {
      scope1: "Scope 1",
      scope2: "Scope 2",
      total: "Scope 1 + 2 total",
      targetYear: "Target year",
      targetEmissions: "Target emissions",
      reductionPct: "Reduction %",
    },
    industryComparison: "Sector comparison",
    industryAverage: "Sector average",
    aboveAverage:
      "This company is above the current sector average. This view is designed to show relative transition quality within a comparable operating context.",
    belowAverage:
      "This company is near or below the current sector average. This view is designed to show relative transition quality within a comparable operating context.",
    peerSnapshot: "Peer snapshot",
    targetDetails: "Target details",
    backToCompany: "Back to company profile",
    viewReport: "Open report",
    reportViewerTitle: "Report Viewer",
    reportViewerDescription:
      "Review the linked report in an inline viewer without exposing a public file URL on the company page.",
    reportProtectionBadge: "View-only mode",
    reportRestrictionNote:
      "This viewer hides the direct file path and removes default download controls where the browser allows it. Copy and capture prevention remains best-effort at browser level.",
    targetRows: {
      baselineYear: "Baseline year",
      targetType: "Target type",
      coverageScope: "Coverage scope",
      netZeroTargetYear: "Net zero target year",
      interimTarget: "Interim target",
      sbtiStatus: "SBTi status",
      approved: "Approved or aligned",
      notDisclosed: "Not disclosed",
    },
  },
  roadmapWidget: {
    badge: "Roadmap",
    title: "Carbon Neutral Roadmap",
    subtitle: "Current emissions, target point, and net zero milestone in one timeline.",
    badgeCurrent: "Current",
    badgeTarget: "Target",
    badgeNetZero: "Net Zero",
    kpiCurrent: "Current emissions",
    kpiTargetYear: "Target year",
    kpiTargetEmissions: "Target emissions",
    kpiReduction: "Reduction vs current",
    timelineCaption: "Transition pathway",
    unit: "tCO2e",
    noData: "No roadmap data available.",
    targetNote: "Public target point",
    netZeroYearLabel: (year: string) => `Net zero ${year}`,
    phaseCurrent: "Current",
    phaseActual: "Actual",
    phaseTarget: "Target",
    phaseNetZero: "Net Zero",
    scope1: "Scope 1",
    scope2: "Scope 2",
    total: "Total",
  },
  about: {
    eyebrow: "CERs Index Methodology v1.5",
    title: "How the CERs Index is calculated",
    description:
      "CERs Index evaluates corporate climate transition using public disclosure only. Twelve variables are grouped into four KPIs: realized decarbonization, target ambition and delivery, capital allocation, and data credibility.",
    logicCta: "View formulas and all 12 variables",
    formulaTitle: "Aggregation at a glance",
    formulaDescription:
      "Every variable is scored from 0 to 100. Variables are averaged equally within their KPI, then the four KPI scores are averaged equally. The result is already bounded from 0 to 100, so no separate display conversion is applied.",
    formulaSteps: [
      {
        id: "kpi",
        title: "1. Variables to KPI score",
        formula: "K_j = \\frac{1}{n_j}\\sum_{i=1}^{n_j}V_{j,i}",
      },
      {
        id: "index",
        title: "2. KPI scores to CERs Index",
        formula: "\\mathrm{CERs} = \\frac{K_1+K_2+K_3+K_4}{4}",
      },
    ],
    formulaDefinitionsTitle: "What the symbols mean",
    formulaDefinitions: [
      { key: "V_j,i", label: "Variable i in KPI j, scored from 0 to 100" },
      { key: "n_j", label: "Number of applicable variables in KPI j; normally 2 / 2 / 4 / 4" },
      { key: "K_j", label: "KPI score, the equal-weighted mean of its applicable variables" },
      { key: "CERs", label: "Final 0-100 index, the equal-weighted mean of the four KPI scores" },
    ],
    formulaNoteLabel: "Method note",
    formulaNote:
      "Undisclosed information scores zero. N/A is allowed only when the activity physically does not exist and that absence is confirmed in disclosure; only then is the variable removed from the KPI numerator and denominator.",
    meaningTitle: "What this score is for",
    meaningDescription:
      "CERs Index is not an overall ESG rating. It shows whether measured emissions, targets, capital decisions, and the evidence behind them are aligned with a credible climate transition.",
    meaningPoints: [
      "Uses public financial filings, annual and sustainability reports, CDP responses, governance reports, and assurance statements",
      "Measures four distinct dimensions: performance, targets, capital allocation, and data credibility",
      "Takes benchmarks such as 4.2%/yr, the 15 Scope 3 categories, four disclosure pillars, and the SBTi status ladder from external standards",
      "Treats non-disclosure as zero rather than filling gaps with estimated values",
      "Uses no industry-specific formula weights in the final score; both aggregation stages use equal weighting",
    ],
    logicTitle: "How the score is built",
    logicDescription:
      "The method fixes the evidence, normalization rule, and aggregation order before results are observed, so the score cannot be back-solved to fit a preferred ranking.",
    logicSteps: [
      {
        title: "Collect public evidence",
        description:
          "Use disclosed emissions, revenue, energy, targets, investment, governance, methodology, and assurance data. No private questionnaire response is required.",
      },
      {
        title: "Score 12 variables",
        description:
          "Apply an external benchmark, a raw ratio, a standard-defined checklist, a verifiable fact, or an externally defined ordinal scale. Each variable ends on 0-100.",
      },
      {
        title: "Average within each KPI",
        description:
          "V1-V2, W1-W2, C1-C4, and A1-A4 are averaged separately to produce the four KPI scores.",
      },
      {
        title: "Average the four KPIs",
        description:
          "The four KPI scores receive equal weight. Their arithmetic mean is the published CERs Index.",
      },
    ],
    dimensionsTitle: "The four score dimensions",
    dimensionsDescription:
      "The 12 variables are organized by what they are intended to test. The detailed page gives every formula, interpretation rule, and external basis.",
    industryTitle: "Why both stages use equal weights",
    industryDescription:
      "There is no external consensus that one variable or one of the four dimensions deserves a larger fixed weight. A differential weight would therefore become an arbitrary score allocation. Sector percentiles may be shown as context, but they do not alter the formula.",
    readingTitle: "How to interpret the result",
    readingCards: [
      {
        title: "Read 0-100 as a direct mean",
        description:
          "The published value is the arithmetic mean produced by the two aggregation steps, not a separately transformed display score.",
      },
      {
        title: "Read the KPI profile with the total",
        description:
          "The same total can come from different combinations of performance, targets, capital allocation, and credibility. The four KPI scores explain that composition.",
      },
      {
        title: "Distinguish zero from N/A",
        description:
          "Missing disclosure scores zero. A variable is excluded only when the underlying activity is physically absent and that absence is publicly evidenced.",
      },
      {
        title: "Treat grades as distribution-based",
        description:
          "If letter grades are shown, their boundaries should come from statistics such as universe quartiles, not hand-set score bands.",
      },
    ],
    dimensions: [
      {
        title: "KPI 1. Realized decarbonization",
        description:
          "Tests whether measured emissions actually fell over the three-year measurement window.",
        bullets: [
          "V1: Scope 1 and 2 emissions performance",
          "V2: Scope 3 emissions performance",
        ],
      },
      {
        title: "KPI 2. Target ambition and delivery",
        description:
          "Tests whether the target is completely defined and whether the company is on its declared reduction path.",
        bullets: [
          "W1: target design completeness",
          "W2: on-track performance",
        ],
      },
      {
        title: "KPI 3. Capital allocation",
        description:
          "Tests whether investment, revenue, pricing, and governance decisions are aligned with transition.",
        bullets: [
          "C1: green capex; C2: low-carbon revenue",
          "C3: internal carbon price; C4: governance and pay alignment",
        ],
      },
      {
        title: "KPI 4. Data credibility",
        description:
          "Tests whether the figures behind KPI 1-3 are validated, assured, complete, reproducible, and aligned with disclosure standards.",
        bullets: [
          "A1: third-party validation & assurance; A2: inventory completeness",
          "A3: methodology transparency; A4: disclosure framework alignment",
        ],
      },
    ],
  },
  charts: {
    roadmap: {
      scope1: "Scope 1",
      scope2: "Scope 2",
      targetEmissions: "Target emissions",
      reductionPathway: "Reduction pathway",
    },
    distributionTooltip: (count: number) => `${count} companies`,
  },
  notFound: {
    title: "Page not found",
    description: "The page you tried to open does not exist in the current CERs Index navigation.",
    returnHome: "Return to home",
  },
};

type Translation = typeof ENGLISH_COPY;

const KOREAN_COPY: Translation = {
  localeName: "한국어",
  languages: {
    en: "English",
    ko: "한국어",
    ja: "日本語",
  },
  nav: {
    home: "홈",
    companies: "기업",
    compare: "비교",
    industries: "섹터",
    about: "방법론",
    scoreLogic: "점수 로직",
  },
  alerts: {
    fallbackSampleData: "샘플 데이터를 표시하고 있습니다.",
  },
  common: {
    score: "점수",
    averageScore: "평균 점수",
    avgScore: "평균 점수",
    fiscalYearLabel: (year: number | string) => `FY${year} 기준`,
    weightedContribution: "가중 기여도",
    viewDetails: "상세 보기",
    backToCompanies: "기업 목록으로",
    backToIndustries: "섹터 목록으로",
    latestDisclosure: "최신 공시",
    frameworks: "프레임워크",
    assurance: "검증",
    revenue: "매출",
    noLinkedDocument: "연결된 문서 없음",
    notSpecified: "미기재",
    noData: "—",
    yes: "예",
    no: "아니오",
    companiesLabel: (count: number) => `${count}개 기업`,
  },
  kpi: {
    title: "4개 KPI 프로필",
    description: "종합점수는 의사결정에 필요한 서로 다른 4개 차원을 동일가중 평균한 값입니다.",
    methodLink: "12개 변수와 전체 수식 보기",
    items: [
      {
        code: "KPI 1",
        title: "실질 탈탄소 성과",
        description: "Scope 1·2와 Scope 3 배출량이 실제로 얼마나 줄었는지 봅니다.",
        variables: "V1~V2 · 2개 변수",
      },
      {
        code: "KPI 2",
        title: "감축 목표 및 이행",
        description: "목표 설계의 완전성과 이행 진척도를 봅니다.",
        variables: "W1~W2 · 2개 변수",
      },
      {
        code: "KPI 3",
        title: "자본배분",
        description: "투자, 매출, 탄소가격, 거버넌스의 정렬을 봅니다.",
        variables: "C1~C4 · 4개 변수",
      },
      {
        code: "KPI 4",
        title: "데이터 신뢰성",
        description: "검증·보증, 완전성, 투명성, 공시 정합성을 봅니다.",
        variables: "A1~A4 · 4개 변수",
      },
    ],
  },
  header: {
    productLabel: "기후전환 인텔리전스",
    searchPlaceholder: "기업 검색...",
    languageLabel: "언어",
    themeLabel: "테마",
    darkMode: "다크",
    lightMode: "라이트",
  },
  footer: {
    productLabel: "공개 기후 인텔리전스",
    description: "공개 공시를 바탕으로 기업 탄소감축 성과를 비교 가능하고 근거 중심으로 보여줍니다.",
    disclaimer: "CERs Index는 분석 정보 서비스이며 투자 조언이나 ESG 종합등급이 아닙니다.",
  },
  home: {
    eyebrow: "공개 탄소감축 대시보드",
    title: "기업의 탄소감축 수준을 한눈에 파악하세요",
    description:
      "CERs Index는 비전문가도 기업이 실제로 배출을 줄이고 있는지, 목표가 얼마나 신뢰할 만한지, 같은 섹터 내 경쟁사와 비교해 어떤 위치인지 빠르게 이해할 수 있도록 돕습니다.",
    primaryCta: "기업 살펴보기",
    secondaryCta: "방법론 검토하기",
    proofPublic: "공개 근거만 사용",
    proofFramework: "12개 변수 · 4개 KPI",
    proofComparable: "비교 가능한 0~100 지수",
    coverageEyebrow: "커버리지와 신뢰 범위",
    coverageTitle: "순위를 읽기 전에 평가 유니버스를 확인하세요",
    statScored: "점수 보유 기업",
    statLatestYear: "최신 점수 연도",
    statMethodology: "방법론",
    kpiEyebrow: "의사결정 프레임",
    kpiTitle: "기후전환 품질을 보는 4개의 렌즈",
    kpiDescription:
      "성과, 목표, 자본 의사결정, 데이터 신뢰성을 분리해 한 영역의 강점이 다른 영역의 약점을 가리지 않게 합니다.",
    evidenceEyebrow: "공개 근거 신호",
    evidenceTitle: "기업이 공개 기록에 남긴 내용",
    evidenceDescription:
      "감축 목표와 넷제로 선언은 공개된 사실로 보여줍니다. 선언 자체가 실측 성과나 CERs Index를 대신하지는 않습니다.",
    noScoredData: "기업 유니버스는 공개되어 있지만 현재 scoring run의 게시 가능한 지수 결과는 아직 없습니다.",
    updatedAt: (date: string) => `데이터 갱신 ${date}`,
    snapshotEyebrow: "스냅샷",
    snapshotTitle: "빠른 현황 보기",
    snapshotDescription: "이 대시보드가 현재 추적 중인 공개 공시 범위를 압축해 보여줍니다.",
    statCompanies: "추적 기업 수",
    statIndustries: "대상 섹터 수",
    statTargets: "감축 목표 공개",
    statNetZero: "넷제로 선언",
    searchPlaceholder: "기업명을 검색하세요...",
    featuredEyebrow: "주요 기업",
    featuredTitle: "주목할 기업",
    browseAllCompanies: "전체 기업 보기",
    leaderboardEyebrow: "리더보드",
    leaderboardTitle: "상위 점수 기업",
    clearTargetsTitle: "감축 목표가 명확한 기업",
    targetFallback: "목표",
    netZeroTitle: "넷제로를 선언한 기업",
    netZeroTarget: "넷제로 목표",
    scopeNotSpecified: "범위 미기재",
    industryEyebrow: "섹터별 보기",
    industryTitle: "섹터별로 살펴보기",
    seeAllIndustries: "전체 섹터 보기",
    scoreMeaningEyebrow: "점수 해석",
    scoreMeaningTitle: "기후전환 신뢰도를 보는 공개 지표",
    scoreMeaningDescription:
      "공개 근거 기반 12개 변수를 실질 탈탄소 성과, 감축 목표 및 이행, 자본배분, 데이터 신뢰성의 4개 KPI로 동일가중 집계합니다.",
    learnMore: "점수 더 알아보기",
  },
  companies: {
    eyebrow: "기업",
    title: "기업별 탄소감축 프로필 둘러보기",
    description: "최신 CERs Index, 감축 목표, 공시 신호를 기준으로 기업을 검색하고 비교하세요.",
    scoreListCta: "CERs Index List 보기",
    scoreListTitle: "CERs Index List",
    scoreListDescription: "현재 CERs 대시보드에 포함된 전체 기업을 점수순 표로 보여줍니다.",
    scoreListCount: (count: number) => `점수순 ${count}개 기업`,
    scoreListColumns: {
      rank: "순위",
      company: "기업",
      sector: "섹터",
      country: "국가",
      basisYear: "기준연도",
      score: "CERs Index",
      band: "등급대",
    },
    filters: "필터",
    industry: "섹터",
    country: "국가",
    year: "연도",
    allIndustries: "전체 섹터",
    allCountries: "모든 국가",
    allYears: "전체 연도",
    scoreRange: "점수 구간",
    allScores: "전체 점수",
    below60: "60 미만",
    targetAnnounced: "감축 목표 공표",
    netZeroDeclared: "넷제로 선언",
    scoredOnly: "점수 보유 기업만",
    sortBy: "정렬",
    sortScore: "점수순",
    sortName: "이름순",
    sortTargetYear: "목표 연도순",
    searchPlaceholder: "기업 검색...",
    showing: (count: number) => `${count}개 기업 표시 중`,
    topResultScore: (score: string) => `현재 최상위 결과 점수: ${score}`,
    noResults: "현재 필터에 맞는 기업이 없습니다.",
  },
  compare: {
    eyebrow: "비교",
    title: "기업 2~3개를 나란히 비교하세요",
    description: "종합지수, 4개 KPI, 배출량, 목표, 검증 근거를 기업별로 한 번에 비교할 수 있습니다.",
    selectCompanies: "기업 선택",
    selectCompany: "기업을 선택하세요",
    scoreDimensions: "점수 차원 비교",
    roadmapComparison: "로드맵 KPI 비교",
    metric: "지표",
    metrics: {
      scope1: "스코프 1",
      scope2: "스코프 2",
      totalEmissions: "총배출량",
      targetYear: "목표 연도",
      targetEmissions: "목표 배출량",
      reductionVsBase: "기준연도 대비 감축",
      netZeroYear: "넷제로 연도",
      assurance: "검증",
    },
  },
  industries: {
    eyebrow: "섹터",
    title: "섹터별 기후 성과 살펴보기",
    description: "같은 전환 환경을 가진 동종 기업과 비교해 기업의 위치를 이해할 수 있습니다.",
    searchPlaceholder: "섹터 검색...",
    filterAll: "전체 섹터",
    filterScored: "점수 보유 섹터",
    filterRobust: "30개 이상 표본",
    filterLimited: "제한 표본",
    medianScore: "중앙값 점수",
    scoreCoverage: "점수 커버리지",
    limitedSample: "제한 표본",
    robustSample: "충분한 표본",
    noResults: "현재 필터에 맞는 섹터가 없습니다.",
  },
  industryDetail: {
    eyebrow: "섹터 상세",
    snapshot: "섹터 스냅샷",
    medianScore: "중앙값 점수",
    scoreCoverage: "점수 커버리지",
    interquartileRange: "사분위 범위",
    sampleRule: "표본 규칙",
    latestScoreYear: "최신 점수 연도",
    robustSample: "30개 이상 표본",
    limitedSample: "30개 미만 표본",
    categoryOverview: "카테고리 프로필",
    categoryOverviewDescription:
      "4개 KPI 프로필을 통해 이 섹터가 어디에서 상대적으로 강하고 불균형한지 보여줍니다.",
    strongestDimension: "상대 강점",
    weakestDimension: "보완 필요",
    transitionSignals: "목표 및 전환 신호",
    transitionSignalsDescription:
      "이 섹터에서 감축 경로와 장기 목표를 어느 정도로 공개하고 있는지 보여주는 지표입니다.",
    disclosureSignals: "공시 및 근거 신호",
    disclosureSignalsDescription:
      "기후 데이터 품질, 검증, 가치사슬 공시 범위를 이 섹터 수준에서 요약합니다.",
    targetCoverage: "감축 목표 보유율",
    netZeroCoverage: "넷제로 선언율",
    sbtiCoverage: "SBTi 승인 비율",
    interimCoverage: "중간 목표 보유율",
    medianTargetYear: "중앙 목표 연도",
    assuranceCoverage: "제3자 검증 비율",
    scope3Coverage: "Scope 3 카테고리 커버리지",
    primaryDataRatio: "1차 데이터 비율",
    frameworkCoverage: "프레임워크 채택률",
    basedOnScoredCompanies: (count: number) => `점수 보유 기업 ${count}개 기준`,
    scoreDistribution: "점수 분포",
    viewSectorCompanies: "이 섹터 기업 보기",
    topCompanies: (label: string) => `${label} 상위 기업`,
    whatMatters: (label: string) => `${label}에서 중요한 포인트`,
  },
  companyDetail: {
    cersScore: "CERs Index",
    kpiProfile: "4개 KPI 프로필",
    kpiProfileDescription:
      "4개 점수는 종합지수와 동일한 scoring run에서 제공됩니다. 프론트엔드는 결측값을 추정하지 않습니다.",
    methodologyBasis: "방법론",
    scoreBasisYear: "점수 기준",
    latestEvidence: "최신 근거",
    evidenceOverview: "근거 개요",
    evidenceOverviewDescription:
      "공개된 목표, 배출량, 검증, 원문 문서를 KPI 프로필과 함께 확인하세요.",
    companyScoreLabel: "기업 점수",
    sectorAverageLabel: "섹터 평균",
    roadmapTitle: "탄소감축 로드맵",
    roadmapDescription:
      "현재 값은 최신 공시 기준 회사 데이터를 사용합니다. 목표와 넷제로 시점은 최신 공시에 공개된 목표와 가정에 기반합니다.",
    roadmapCards: {
      currentTotalEmissions: "현재 총배출량",
      targetYear: "목표 연도",
      targetEmissions: "목표 배출량",
      reductionVsBase: "기준연도 대비 감축",
      netZeroYear: "넷제로 연도",
    },
    kpis: {
      scope1: "스코프 1",
      scope2: "스코프 2",
      total: "스코프 1 + 2 합계",
      targetYear: "목표 연도",
      targetEmissions: "목표 배출량",
      reductionPct: "감축률",
    },
    industryComparison: "섹터 비교",
    industryAverage: "섹터 평균",
    aboveAverage:
      "이 기업은 현재 섹터 평균보다 높습니다. 이 뷰는 비슷한 운영 환경 안에서 상대적인 전환 품질을 보여주기 위한 것입니다.",
    belowAverage:
      "이 기업은 현재 섹터 평균 수준이거나 그보다 낮습니다. 이 뷰는 비슷한 운영 환경 안에서 상대적인 전환 품질을 보여주기 위한 것입니다.",
    peerSnapshot: "동종사 스냅샷",
    targetDetails: "목표 상세",
    backToCompany: "기업 상세로 돌아가기",
    viewReport: "보고서 보러가기",
    reportViewerTitle: "보고서 뷰어",
    reportViewerDescription:
      "기업 상세 페이지에서는 원본 파일 경로를 드러내지 않고, 연결된 보고서를 인라인 뷰어로 확인할 수 있습니다.",
    reportProtectionBadge: "열람 전용 모드",
    reportRestrictionNote:
      "이 뷰어는 직접 파일 경로를 숨기고 브라우저가 허용하는 범위에서 기본 다운로드 UI를 제거합니다. 복사와 캡처 방지는 브라우저 한계상 최선 수준으로만 적용됩니다.",
    targetRows: {
      baselineYear: "기준연도",
      targetType: "목표 유형",
      coverageScope: "적용 범위",
      netZeroTargetYear: "넷제로 목표 연도",
      interimTarget: "중간 목표",
      sbtiStatus: "SBTi 상태",
      approved: "승인 또는 정렬",
      notDisclosed: "미공시",
    },
  },
  roadmapWidget: {
    badge: "로드맵",
    title: "탄소중립 로드맵",
    subtitle: "현재 배출량, 목표 시점, 넷제로 마일스톤을 하나의 타임라인으로 보여줍니다.",
    badgeCurrent: "현재",
    badgeTarget: "목표",
    badgeNetZero: "넷제로",
    kpiCurrent: "현재 배출량",
    kpiTargetYear: "목표 연도",
    kpiTargetEmissions: "목표 배출량",
    kpiReduction: "현재 대비 감축",
    timelineCaption: "전환 경로",
    unit: "tCO2e",
    noData: "표시할 로드맵 데이터가 없습니다.",
    targetNote: "공개 목표 시점",
    netZeroYearLabel: (year: string) => `넷제로 ${year}`,
    phaseCurrent: "현재",
    phaseActual: "실적",
    phaseTarget: "목표",
    phaseNetZero: "넷제로",
    scope1: "스코프 1",
    scope2: "스코프 2",
    total: "합계",
  },
  about: {
    eyebrow: "CERs Index 평가방법론 v1.5",
    title: "CERs Index는 어떻게 계산되나",
    description:
      "CERs Index는 공개 자료만으로 기업의 기후전환을 평가합니다. 12개 변수를 실질 탈탄소 성과, 감축 목표와 이행, 자본배분, 데이터 신뢰성의 4개 KPI로 구성합니다.",
    logicCta: "전체 수식과 12개 변수 보기",
    formulaTitle: "집계 구조 한눈에 보기",
    formulaDescription:
      "모든 변수는 0~100점입니다. 먼저 각 KPI 안에서 변수를 동일가중 평균하고, 다시 4개 KPI를 동일가중 평균합니다. 결과가 이미 0~100 범위이므로 별도의 표시 점수 변환은 없습니다.",
    formulaSteps: [
      {
        id: "kpi",
        title: "1. 변수에서 KPI 점수로",
        formula: "K_j = \\frac{1}{n_j}\\sum_{i=1}^{n_j}V_{j,i}",
      },
      {
        id: "index",
        title: "2. KPI 점수에서 CERs Index로",
        formula: "\\mathrm{CERs} = \\frac{K_1+K_2+K_3+K_4}{4}",
      },
    ],
    formulaDefinitionsTitle: "기호 설명",
    formulaDefinitions: [
      { key: "V_j,i", label: "KPI j에 속한 i번째 변수, 0~100점" },
      { key: "n_j", label: "KPI j에서 적용되는 변수 수, 기본 구성은 2 / 2 / 4 / 4" },
      { key: "K_j", label: "KPI 점수, 적용 변수의 동일가중 평균" },
      { key: "CERs", label: "4개 KPI 점수의 동일가중 평균인 최종 0~100 지수" },
    ],
    formulaNoteLabel: "방법론 메모",
    formulaNote:
      "미공시는 0점입니다. 활동이 물리적으로 존재하지 않고 그 부존재가 공시로 확인된 경우에만 N/A를 허용하며, 이때만 해당 변수를 KPI 평균의 분자와 분모에서 제외합니다.",
    meaningTitle: "이 점수의 용도",
    meaningDescription:
      "CERs Index는 ESG 종합등급이 아닙니다. 실측 배출량, 감축 목표, 자본 의사결정, 그리고 그 수치를 뒷받침하는 근거가 신뢰할 만한 기후전환과 정합하는지를 보여줍니다.",
    meaningPoints: [
      "재무제표·사업보고서·연차보고서·지속가능경영보고서·CDP 공개응답·거버넌스 보고서·검증성명서를 사용합니다",
      "성과, 목표, 자본배분, 데이터 신뢰성이라는 서로 다른 4개 차원을 평가합니다",
      "연 4.2%, Scope 3 15개 카테고리, 공시 4대 축, SBTi 상태 분류 등의 기준값은 외부 표준에서 인용합니다",
      "결측값을 추정해 채우지 않고, 공시하지 않은 정보는 0점 처리합니다",
      "최종 산식에 산업별 가중치는 없으며 변수→KPI와 KPI→지수 모두 동일가중입니다",
    ],
    logicTitle: "점수 산정 순서",
    logicDescription:
      "결과를 보기 전에 근거 자료, 정규화 방식, 집계 순서를 고정해 특정 순위를 만들기 위한 역산을 막습니다.",
    logicSteps: [
      {
        title: "공개 근거를 수집합니다",
        description:
          "배출량, 매출, 에너지, 목표, 투자, 거버넌스, 산정 방법론, 검증 데이터를 공개 자료에서 확보합니다. 비공개 설문 응답은 요구하지 않습니다.",
      },
      {
        title: "12개 변수를 채점합니다",
        description:
          "외부 벤치마크, 자연 비율, 표준 정의 체크리스트, 검증 가능한 사실, 외부 서수 척도 중 하나를 적용해 각 변수를 0~100점으로 만듭니다.",
      },
      {
        title: "KPI별로 평균합니다",
        description:
          "V1~V2, W1~W2, C1~C4, A1~A4를 각각 평균해 4개 KPI 점수를 산출합니다.",
      },
      {
        title: "4개 KPI를 평균합니다",
        description:
          "4개 KPI에 같은 가중치를 적용한 산술평균이 최종 CERs Index입니다.",
      },
    ],
    dimensionsTitle: "4개 평가 차원",
    dimensionsDescription:
      "12개 변수는 검증하려는 대상에 따라 4개 KPI로 묶입니다. 상세 페이지에서 각 변수의 수식, 의미, 외부 근거를 모두 확인할 수 있습니다.",
    industryTitle: "왜 두 단계 모두 동일가중인가",
    industryDescription:
      "특정 변수나 KPI가 더 중요하다는 외부 합의가 없으므로 차등 가중치 자체가 임의 배점이 됩니다. 섹터 내 백분위는 해석 정보로 제공할 수 있지만 최종 산식은 바꾸지 않습니다.",
    readingTitle: "결과는 이렇게 읽는 것이 좋습니다",
    readingCards: [
      {
        title: "0~100을 직접 평균값으로 읽으세요",
        description:
          "공개 점수는 두 단계 평균에서 바로 나온 값이며, 별도로 변환한 표시 점수가 아닙니다.",
      },
      {
        title: "총점과 KPI 구성을 함께 보세요",
        description:
          "같은 총점도 성과, 목표, 자본배분, 신뢰성의 조합은 다를 수 있습니다. 4개 KPI가 그 차이를 설명합니다.",
      },
      {
        title: "0점과 N/A를 구분하세요",
        description:
          "미공시는 0점입니다. 활동 자체가 없고 그 사실이 공개 근거로 확인된 경우에만 해당 변수를 제외합니다.",
      },
      {
        title: "등급은 분포 기반으로 읽으세요",
        description:
          "등급을 표시한다면 경계는 임의 점수 구간이 아니라 평가 유니버스의 사분위수 같은 분포 통계로 정합니다.",
      },
    ],
    dimensions: [
      {
        title: "KPI 1. 실질 탈탄소 성과",
        description: "3년 측정 창에서 배출량이 실제로 감소했는지를 평가합니다.",
        bullets: [
          "V1: Scope 1·2 배출성과",
          "V2: Scope 3 배출성과",
        ],
      },
      {
        title: "KPI 2. 감축 목표 및 이행",
        description: "목표가 완전하게 설계되었고 공표한 감축 경로 위에 있는지 평가합니다.",
        bullets: [
          "W1: 감축목표 설계 수준",
          "W2: 목표 이행 진척도",
        ],
      },
      {
        title: "KPI 3. 자본배분",
        description: "투자, 매출, 가격신호, 거버넌스 의사결정이 전환과 정렬되어 있는지 평가합니다.",
        bullets: [
          "C1: 녹색 CAPEX, C2: 저탄소 매출",
          "C3: 내부탄소가격, C4: 거버넌스·보상 정렬",
        ],
      },
      {
        title: "KPI 4. 데이터 신뢰성",
        description: "KPI 1~3의 수치가 검증·보증되고 완전하며 재현 가능하고 공시 기준과 정합하는지 평가합니다.",
        bullets: [
          "A1: 제3자 검증·보증, A2: 인벤토리 완전성",
          "A3: 산정 방법론 투명성, A4: 공시 체계 정합성",
        ],
      },
    ],
  },
  charts: {
    roadmap: {
      scope1: "스코프 1",
      scope2: "스코프 2",
      targetEmissions: "목표 배출량",
      reductionPathway: "감축 경로",
    },
    distributionTooltip: (count: number) => `${count}개 기업`,
  },
  notFound: {
    title: "페이지를 찾을 수 없습니다",
    description: "현재 CERs Index 탐색 구조에 없는 페이지입니다.",
    returnHome: "홈으로 돌아가기",
  },
};

const JAPANESE_COPY: Translation = {
  localeName: "日本語",
  languages: {
    en: "English",
    ko: "한국어",
    ja: "日本語",
  },
  nav: {
    home: "ホーム",
    companies: "企業",
    compare: "比較",
    industries: "セクター",
    about: "方法論",
    scoreLogic: "スコアロジック",
  },
  alerts: {
    fallbackSampleData: "サンプルデータを表示しています。",
  },
  common: {
    score: "スコア",
    averageScore: "平均スコア",
    avgScore: "平均スコア",
    fiscalYearLabel: (year: number | string) => `FY${year}基準`,
    weightedContribution: "加重寄与度",
    viewDetails: "詳細を見る",
    backToCompanies: "企業一覧へ戻る",
    backToIndustries: "セクター一覧へ戻る",
    latestDisclosure: "最新開示",
    frameworks: "フレームワーク",
    assurance: "保証",
    revenue: "売上高",
    noLinkedDocument: "関連文書なし",
    notSpecified: "未記載",
    noData: "—",
    yes: "はい",
    no: "いいえ",
    companiesLabel: (count: number) => `${count}社`,
  },
  kpi: {
    title: "4つの KPI プロファイル",
    description: "総合スコアは、意思決定に必要な異なる4次元を等加重平均した値です。",
    methodLink: "12変数と全算式を見る",
    items: [
      {
        code: "KPI 1",
        title: "実質的な脱炭素成果",
        description: "Scope 1・2 と Scope 3 の排出量が実際にどれだけ減ったかを見ます。",
        variables: "V1〜V2 · 2変数",
      },
      {
        code: "KPI 2",
        title: "削減目標と履行",
        description: "目標設計の完全性と履行進捗を見ます。",
        variables: "W1〜W2 · 2変数",
      },
      {
        code: "KPI 3",
        title: "資本配分",
        description: "投資、売上、炭素価格、ガバナンスの整合を見ます。",
        variables: "C1〜C4 · 4変数",
      },
      {
        code: "KPI 4",
        title: "データ信頼性",
        description: "検証・保証、完全性、透明性、開示整合性を見ます。",
        variables: "A1〜A4 · 4変数",
      },
    ],
  },
  header: {
    productLabel: "気候移行インテリジェンス",
    searchPlaceholder: "企業を検索...",
    languageLabel: "言語",
    themeLabel: "テーマ",
    darkMode: "ダーク",
    lightMode: "ライト",
  },
  footer: {
    productLabel: "公開気候インテリジェンス",
    description: "公開開示に基づき、企業の炭素削減実績を比較可能かつ根拠中心で示します。",
    disclaimer: "CERs Index は分析情報サービスであり、投資助言や ESG 総合格付けではありません。",
  },
  home: {
    eyebrow: "公開カーボン削減ダッシュボード",
    title: "企業の炭素削減状況をひと目で把握",
    description:
      "CERs Index は、企業が実際に排出量を減らしているか、目標にどの程度信頼性があるか、同じセクターの同業他社と比べてどこに位置するかを、非専門家でもすばやく理解できるようにします。",
    primaryCta: "企業を見る",
    secondaryCta: "方法論を確認",
    proofPublic: "公開根拠のみ使用",
    proofFramework: "12変数 · 4 KPI",
    proofComparable: "比較可能な0〜100指数",
    coverageEyebrow: "カバレッジと信頼範囲",
    coverageTitle: "ランキングの前に評価ユニバースを確認",
    statScored: "スコア保有企業",
    statLatestYear: "最新スコア年",
    statMethodology: "方法論",
    kpiEyebrow: "意思決定フレーム",
    kpiTitle: "気候移行の質を見る4つの視点",
    kpiDescription:
      "実績、目標、資本判断、データ信頼性を分け、一つの強みが別の弱みを隠さない構造にしています。",
    evidenceEyebrow: "公開根拠シグナル",
    evidenceTitle: "企業が公開記録に示した内容",
    evidenceDescription:
      "削減目標とネットゼロ表明は公開事実として示します。表明だけで実測実績や CERs Index を代替するものではありません。",
    noScoredData: "企業ユニバースは公開されていますが、現在の scoring run には公開可能な指数結果がまだありません。",
    updatedAt: (date: string) => `データ更新 ${date}`,
    snapshotEyebrow: "スナップショット",
    snapshotTitle: "クイックビュー",
    snapshotDescription: "このダッシュボードが現在カバーしている公開開示の範囲を簡潔に示します。",
    statCompanies: "追跡企業数",
    statIndustries: "対象セクター数",
    statTargets: "削減目標の開示",
    statNetZero: "ネットゼロ表明",
    searchPlaceholder: "企業名を検索...",
    featuredEyebrow: "注目企業",
    featuredTitle: "注目企業",
    browseAllCompanies: "すべての企業を見る",
    leaderboardEyebrow: "ランキング",
    leaderboardTitle: "高スコア企業",
    clearTargetsTitle: "削減目標が明確な企業",
    targetFallback: "目標",
    netZeroTitle: "ネットゼロを表明した企業",
    netZeroTarget: "ネットゼロ目標",
    scopeNotSpecified: "範囲未記載",
    industryEyebrow: "セクタービュー",
    industryTitle: "セクター別に見る",
    seeAllIndustries: "すべてのセクターを見る",
    scoreMeaningEyebrow: "スコアの見方",
    scoreMeaningTitle: "気候移行信頼性を見る公開指標",
    scoreMeaningDescription:
      "公開根拠に基づく12変数を、実質的な脱炭素成果、削減目標と履行、資本配分、データ信頼性の4つの KPI に等加重で集約します。",
    learnMore: "スコアの詳細を見る",
  },
  companies: {
    eyebrow: "企業",
    title: "企業の炭素削減プロフィールを閲覧",
    description: "最新の CERs Index、削減目標、開示シグナルを使って企業を検索・比較できます。",
    scoreListCta: "CERs Index Listを見る",
    scoreListTitle: "CERs Index List",
    scoreListDescription: "現在の CERs ダッシュボードに含まれる全企業をスコア順の表で表示します。",
    scoreListCount: (count: number) => `スコア順で ${count}社`,
    scoreListColumns: {
      rank: "順位",
      company: "企業",
      sector: "セクター",
      country: "国",
      basisYear: "基準年",
      score: "CERs Index",
      band: "帯域",
    },
    filters: "フィルター",
    industry: "セクター",
    country: "国",
    year: "年",
    allIndustries: "すべてのセクター",
    allCountries: "すべての国",
    allYears: "すべての年",
    scoreRange: "スコア帯",
    allScores: "すべてのスコア",
    below60: "60未満",
    targetAnnounced: "削減目標を公表",
    netZeroDeclared: "ネットゼロを表明",
    scoredOnly: "スコア保有企業のみ",
    sortBy: "並び順",
    sortScore: "スコア順",
    sortName: "名称順",
    sortTargetYear: "目標年順",
    searchPlaceholder: "企業を検索...",
    showing: (count: number) => `${count}社を表示中`,
    topResultScore: (score: string) => `現在の最上位スコア: ${score}`,
    noResults: "現在の条件に一致する企業はありません。",
  },
  compare: {
    eyebrow: "比較",
    title: "2〜3社を並べて比較",
    description: "総合指数、4つの KPI、排出量、目標、保証根拠を企業ごとに比較できます。",
    selectCompanies: "企業を選択",
    selectCompany: "企業を選択してください",
    scoreDimensions: "スコア軸比較",
    roadmapComparison: "ロードマップ KPI 比較",
    metric: "指標",
    metrics: {
      scope1: "スコープ1",
      scope2: "スコープ2",
      totalEmissions: "総排出量",
      targetYear: "目標年",
      targetEmissions: "目標排出量",
      reductionVsBase: "基準年比削減",
      netZeroYear: "ネットゼロ年",
      assurance: "保証",
    },
  },
  industries: {
    eyebrow: "セクター",
    title: "セクター別の気候パフォーマンスを見る",
    description: "似た移行条件にある同業他社との比較を通じて、企業の位置づけを理解できます。",
    searchPlaceholder: "セクターを検索...",
    filterAll: "すべてのセクター",
    filterScored: "スコア保有セクター",
    filterRobust: "30社以上",
    filterLimited: "限定サンプル",
    medianScore: "中央値スコア",
    scoreCoverage: "スコアカバレッジ",
    limitedSample: "限定サンプル",
    robustSample: "十分なサンプル",
    noResults: "現在の条件に一致するセクターはありません。",
  },
  industryDetail: {
    eyebrow: "セクター詳細",
    snapshot: "セクタースナップショット",
    medianScore: "中央値スコア",
    scoreCoverage: "スコアカバレッジ",
    interquartileRange: "四分位レンジ",
    sampleRule: "サンプル規則",
    latestScoreYear: "最新スコア年",
    robustSample: "30社以上サンプル",
    limitedSample: "30社未満サンプル",
    categoryOverview: "カテゴリープロファイル",
    categoryOverviewDescription:
      "4つの KPI プロファイルから、このセクターの相対的な強みとばらつきを見ます。",
    strongestDimension: "相対的な強み",
    weakestDimension: "補強余地",
    transitionSignals: "目標と移行シグナル",
    transitionSignalsDescription:
      "このセクターで削減経路や長期目標がどの程度開示されているかを示します。",
    disclosureSignals: "開示と根拠シグナル",
    disclosureSignalsDescription:
      "気候データ品質、保証、バリューチェーン開示範囲をセクター水準で要約します。",
    targetCoverage: "削減目標カバレッジ",
    netZeroCoverage: "ネットゼロ宣言率",
    sbtiCoverage: "SBTi 承認比率",
    interimCoverage: "中間目標カバレッジ",
    medianTargetYear: "中央値目標年",
    assuranceCoverage: "第三者保証比率",
    scope3Coverage: "Scope 3 カテゴリーカバレッジ",
    primaryDataRatio: "一次データ比率",
    frameworkCoverage: "フレームワーク採用率",
    basedOnScoredCompanies: (count: number) => `スコア保有企業 ${count} 社ベース`,
    scoreDistribution: "スコア分布",
    viewSectorCompanies: "このセクターの企業を見る",
    topCompanies: (label: string) => `${label} の上位企業`,
    whatMatters: (label: string) => `${label} で重要なポイント`,
  },
  companyDetail: {
    cersScore: "CERs Index",
    kpiProfile: "4つの KPI プロファイル",
    kpiProfileDescription:
      "4つのスコアは総合指数と同じ scoring run から提供されます。フロントエンドは欠損値を推計しません。",
    methodologyBasis: "方法論",
    scoreBasisYear: "スコア基準",
    latestEvidence: "最新根拠",
    evidenceOverview: "根拠概要",
    evidenceOverviewDescription:
      "公開目標、排出量、保証、原文資料を KPI プロファイルと合わせて確認してください。",
    companyScoreLabel: "企業スコア",
    sectorAverageLabel: "セクター平均",
    roadmapTitle: "炭素削減ロードマップ",
    roadmapDescription:
      "現在値は最新の開示に基づく会社データを使用しています。目標年とネットゼロ時点は、最新開示の公開目標と前提に基づいています。",
    roadmapCards: {
      currentTotalEmissions: "現在の総排出量",
      targetYear: "目標年",
      targetEmissions: "目標排出量",
      reductionVsBase: "基準年比削減",
      netZeroYear: "ネットゼロ年",
    },
    kpis: {
      scope1: "スコープ1",
      scope2: "スコープ2",
      total: "スコープ1 + 2 合計",
      targetYear: "目標年",
      targetEmissions: "目標排出量",
      reductionPct: "削減率",
    },
    industryComparison: "セクター比較",
    industryAverage: "セクター平均",
    aboveAverage:
      "この企業は現在のセクター平均を上回っています。このビューは、近い事業条件の中で相対的な移行品質を示すためのものです。",
    belowAverage:
      "この企業は現在のセクター平均付近、またはそれ以下です。このビューは、近い事業条件の中で相対的な移行品質を示すためのものです。",
    peerSnapshot: "同業他社スナップショット",
    targetDetails: "目標詳細",
    backToCompany: "企業詳細へ戻る",
    viewReport: "報告書を見る",
    reportViewerTitle: "報告書ビューア",
    reportViewerDescription:
      "会社詳細ページでは元ファイルの公開 URL を出さずに、関連報告書をインラインビューアで確認できます。",
    reportProtectionBadge: "閲覧専用モード",
    reportRestrictionNote:
      "このビューアは直接ファイルパスを隠し、ブラウザが許す範囲で既定のダウンロード UI を外します。コピーやキャプチャ防止はブラウザ上ではベストエフォートです。",
    targetRows: {
      baselineYear: "基準年",
      targetType: "目標タイプ",
      coverageScope: "対象範囲",
      netZeroTargetYear: "ネットゼロ目標年",
      interimTarget: "中間目標",
      sbtiStatus: "SBTi ステータス",
      approved: "承認または整合",
      notDisclosed: "未開示",
    },
  },
  roadmapWidget: {
    badge: "ロードマップ",
    title: "カーボンニュートラル・ロードマップ",
    subtitle: "現在排出量、目標時点、ネットゼロの到達点を1つのタイムラインで示します。",
    badgeCurrent: "現在",
    badgeTarget: "目標",
    badgeNetZero: "ネットゼロ",
    kpiCurrent: "現在排出量",
    kpiTargetYear: "目標年",
    kpiTargetEmissions: "目標排出量",
    kpiReduction: "現在比削減",
    timelineCaption: "移行経路",
    unit: "tCO2e",
    noData: "表示できるロードマップデータがありません。",
    targetNote: "公開された目標時点",
    netZeroYearLabel: (year: string) => `ネットゼロ ${year}`,
    phaseCurrent: "現在",
    phaseActual: "実績",
    phaseTarget: "目標",
    phaseNetZero: "ネットゼロ",
    scope1: "スコープ1",
    scope2: "スコープ2",
    total: "合計",
  },
  about: {
    eyebrow: "CERs Index 評価方法論 v1.5",
    title: "CERs Index はどう計算されるか",
    description:
      "CERs Index は公開資料のみで企業の気候移行を評価します。12 の変数を、実質的な脱炭素成果、削減目標と履行、資本配分、データ信頼性の 4 つの KPI にまとめます。",
    logicCta: "全算式と 12 変数を見る",
    formulaTitle: "集計構造の概要",
    formulaDescription:
      "すべての変数は 0〜100 点です。まず各 KPI 内の変数を等加重平均し、次に 4 つの KPI を等加重平均します。結果はすでに 0〜100 の範囲にあるため、表示用の別変換は行いません。",
    formulaSteps: [
      {
        id: "kpi",
        title: "1. 変数から KPI スコアへ",
        formula: "K_j = \\frac{1}{n_j}\\sum_{i=1}^{n_j}V_{j,i}",
      },
      {
        id: "index",
        title: "2. KPI スコアから CERs Index へ",
        formula: "\\mathrm{CERs} = \\frac{K_1+K_2+K_3+K_4}{4}",
      },
    ],
    formulaDefinitionsTitle: "記号の意味",
    formulaDefinitions: [
      { key: "V_j,i", label: "KPI j に属する i 番目の変数、0〜100 点" },
      { key: "n_j", label: "KPI j で適用される変数数、通常は 2 / 2 / 4 / 4" },
      { key: "K_j", label: "適用変数の等加重平均である KPI スコア" },
      { key: "CERs", label: "4 つの KPI スコアの等加重平均である最終 0〜100 指数" },
    ],
    formulaNoteLabel: "方法論メモ",
    formulaNote:
      "未開示は 0 点です。活動が物理的に存在せず、その不存在が開示で確認された場合のみ N/A を認め、そのときだけ当該変数を KPI 平均の分子と分母から除外します。",
    meaningTitle: "このスコアの目的",
    meaningDescription:
      "CERs Index は ESG 総合格付けではありません。実測排出量、削減目標、資本の意思決定、それらを支える根拠が、信頼できる気候移行と整合しているかを示します。",
    meaningPoints: [
      "財務諸表、法定開示、年次・サステナビリティ報告書、CDP 公開回答、ガバナンス報告、保証声明を使用します",
      "成果、目標、資本配分、データ信頼性という異なる 4 次元を評価します",
      "年 4.2%、Scope 3 の 15 カテゴリ、開示の 4 本柱、SBTi ステータス分類などの基準値は外部標準から引用します",
      "欠損値を推計で補完せず、開示されていない情報は 0 点とします",
      "最終算式に業種別重みはなく、変数→KPI と KPI→指数の両段階で等加重です",
    ],
    logicTitle: "スコア算定の順序",
    logicDescription:
      "結果を見る前に根拠資料、正規化ルール、集計順序を固定し、望ましい順位に合わせた逆算を防ぎます。",
    logicSteps: [
      {
        title: "公開根拠を収集する",
        description:
          "排出量、売上、エネルギー、目標、投資、ガバナンス、算定方法論、保証データを公開資料から取得します。非公開アンケートは必要としません。",
      },
      {
        title: "12 変数を採点する",
        description:
          "外部ベンチマーク、自然比率、標準定義チェックリスト、検証可能な事実、外部の順序尺度のいずれかを使い、各変数を 0〜100 点にします。",
      },
      {
        title: "KPI ごとに平均する",
        description:
          "V1〜V2、W1〜W2、C1〜C4、A1〜A4 をそれぞれ平均し、4 つの KPI スコアを算出します。",
      },
      {
        title: "4 つの KPI を平均する",
        description:
          "4 つの KPI に同じ重みを与えた算術平均が最終 CERs Index です。",
      },
    ],
    dimensionsTitle: "4 つの評価次元",
    dimensionsDescription:
      "12 の変数は検証対象に応じて 4 つの KPI に整理されます。詳細ページでは各変数の算式、意味、外部根拠を確認できます。",
    industryTitle: "なぜ両段階とも等加重なのか",
    industryDescription:
      "特定の変数や KPI がより重要だという外部合意がないため、差等加重そのものが恣意的配点になります。セクター内パーセンタイルは解釈情報として示せますが、最終算式は変更しません。",
    readingTitle: "結果はこう読むのが有効です",
    readingCards: [
      {
        title: "0〜100 を直接の平均値として読む",
        description:
          "公開スコアは 2 段階の平均から直接得られた値であり、別途変換された表示値ではありません。",
      },
      {
        title: "総合点と KPI 構成を合わせて見る",
        description:
          "同じ総合点でも、成果、目標、資本配分、信頼性の組み合わせは異なります。4 つの KPI がその違いを説明します。",
      },
      {
        title: "0 点と N/A を区別する",
        description:
          "未開示は 0 点です。活動自体が存在せず、その事実が公開根拠で確認された場合に限り、変数を除外します。",
      },
      {
        title: "等級は分布ベースで読む",
        description:
          "等級を表示する場合、その境界は恣意的な点数帯ではなく、評価ユニバースの四分位数などの分布統計で定めます。",
      },
    ],
    dimensions: [
      {
        title: "KPI 1. 実質的な脱炭素成果",
        description: "3 年の測定期間で排出量が実際に減少したかを評価します。",
        bullets: [
          "V1: Scope 1・2 排出実績",
          "V2: Scope 3 排出実績",
        ],
      },
      {
        title: "KPI 2. 削減目標と履行",
        description: "目標が完全に設計され、公表した削減経路の上にあるかを評価します。",
        bullets: [
          "W1: 削減目標の設計水準",
          "W2: 目標履行進捗度",
        ],
      },
      {
        title: "KPI 3. 資本配分",
        description: "投資、売上、価格シグナル、ガバナンスの意思決定が移行と整合しているかを評価します。",
        bullets: [
          "C1: グリーン CAPEX、C2: 低炭素売上",
          "C3: 内部炭素価格、C4: ガバナンス・報酬整合",
        ],
      },
      {
        title: "KPI 4. データ信頼性",
        description: "KPI 1〜3 の数値が検証・保証され、完全で、再現可能であり、開示基準と整合しているかを評価します。",
        bullets: [
          "A1: 第三者検証・保証、A2: インベントリ完全性",
          "A3: 算定方法論の透明性、A4: 開示体系の整合性",
        ],
      },
    ],
  },
  charts: {
    roadmap: {
      scope1: "スコープ1",
      scope2: "スコープ2",
      targetEmissions: "目標排出量",
      reductionPathway: "削減経路",
    },
    distributionTooltip: (count: number) => `${count}社`,
  },
  notFound: {
    title: "ページが見つかりません",
    description: "現在の CERs Index ナビゲーションには存在しないページです。",
    returnHome: "ホームへ戻る",
  },
};

const TRANSLATIONS: Record<SupportedLocale, Translation> = {
  en: ENGLISH_COPY,
  ko: KOREAN_COPY,
  ja: JAPANESE_COPY,
};

export function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  return SUPPORTED_LOCALES.some((locale) => locale === value);
}

export function normalizeLocale(value: string | null | undefined): SupportedLocale {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

export function getTranslations(locale: SupportedLocale) {
  return TRANSLATIONS[locale];
}

export function getIntlLocale(locale: SupportedLocale) {
  if (locale === "ko") return "ko-KR";
  if (locale === "ja") return "ja-JP";
  return "en-US";
}

export function localizedPath(locale: SupportedLocale, href: string) {
  if (!href.startsWith("/")) return href;
  if (locale === "en") return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

export function stripLocalePrefix(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (!isSupportedLocale(maybeLocale) || maybeLocale === "en") return pathname || "/";
  const stripped = pathname.slice(maybeLocale.length + 1);
  return stripped === "" ? "/" : stripped;
}

export function detectLocaleFromPathname(pathname: string): SupportedLocale {
  const maybeLocale = pathname.split("/")[1];
  return maybeLocale === "ko" || maybeLocale === "ja" ? maybeLocale : "en";
}
