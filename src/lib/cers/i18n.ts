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
    about: "About the Score",
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
  header: {
    searchPlaceholder: "Search companies...",
    languageLabel: "Language",
    themeLabel: "Theme",
    darkMode: "Dark",
    lightMode: "Light",
  },
  home: {
    eyebrow: "Public Carbon Reduction Dashboard",
    title: "Understand corporate carbon reduction at a glance",
    description:
      "CERs Index helps non-experts see whether a company is actually reducing emissions, how credible its targets look, and how it compares with peers in the same sector.",
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
    scoreMeaningTitle: "A public-friendly view of climate performance",
    scoreMeaningDescription:
      "The score combines four plain-language dimensions: actual reduction performance, target clarity, execution readiness, and disclosure level. It is designed to help users scan corporate transition quality quickly, without reading a full methodology paper.",
    learnMore: "Learn more about the score",
  },
  companies: {
    eyebrow: "Companies",
    title: "Browse corporate carbon reduction profiles",
    description:
      "Search and compare companies using the latest CERs Index, reduction targets, and disclosure signals.",
    scoreListCta: "CERs Index List 보기",
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
      "See how overall score, reduction dimensions, and roadmap indicators line up across companies.",
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
    filterHigh: "High performers",
    filterModerate: "Moderate performers",
    filterTransitioning: "Transitioning",
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
      "Averages across the four public score dimensions show where this sector is comparatively strong or uneven.",
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
    eyebrow: "About the Score",
    title: "How the score works",
    description:
      "This page summarizes the revised CERs methodology at a high level. It shows how ten variables roll into four weighted categories, how the base score is formed, and why the final score can change after risk adjustments.",
    logicCta: "View detailed logic",
    logicCtaHint: "Open the technical reference with formulas, weights, and scoring rules.",
    backToOverview: "Back to score overview",
    meaningTitle: "What this score is for",
    meaningDescription:
      "CERs Index is a public summary of transition quality. It organizes reported emissions, targets, governance, investment, and assurance evidence into one comparable view, but it should still be read with sector context.",
    meaningPoints: [
      "Builds ten variables from reported emissions, targets, capex, governance, assurance, and decision-use evidence",
      "Keeps fixed top-level category weights while adapting variable weights to data validity and sector context",
      "Applies final credibility adjustments for CBAM exposure and divergence between apparent and real performance",
    ],
    logicTitle: "How the revised score is built",
    logicDescription:
      "The revised logic starts by scoring V1-V10, then combines them through fixed category weights and dynamic within-category weighting rules before external adjustments are applied.",
    logicSteps: [
      {
        title: "Score ten variables from public evidence",
        description:
          "V1-V10 cover actual decarbonization, target pathway alignment, capital allocation, governance linkage, assurance quality, and embedded decision tools.",
      },
      {
        title: "Combine them into four fixed categories",
        description:
          "The top-level methodology keeps category weights at 0.40, 0.25, 0.20, and 0.15 so real decarbonization remains the anchor.",
      },
      {
        title: "Rebalance weights inside each category",
        description:
          "Variable weights are filtered for missingness, informed by entropy, protected with shrinkage, adjusted for sector materiality, and smoothed over time.",
      },
      {
        title: "Apply final credibility adjustments",
        description:
          "The weighted base score becomes the final score only after CBAM exposure and greenwashing divergence checks are applied.",
      },
    ],
    dimensionsTitle: "What the four weighted areas look at",
    dimensionsDescription:
      "These are the public-facing labels for four methodology buckets. Each one maps to specific variables and fixed category weights.",
    roadmapTitle: "How to read the roadmap",
    industryTitle: "Why industry comparison matters",
    industryDescription:
      "Sector context matters twice: it shapes peer comparison, and it also affects material Scope 3 categories, bounded Cat 1 reweighting, and small-sample protection in the underlying method.",
    readingTitle: "How to interpret the result",
    readingCards: [
      {
        title: "Read the base score separately",
        description:
          "A strong S_base can still move after CBAM exposure and greenwashing divergence adjustments are applied.",
      },
      {
        title: "Read target pathways, not only target presence",
        description:
          "Short-, mid-, and long-term alignment and net-zero validity matter more than a single target announcement.",
      },
      {
        title: "Compare within sector first",
        description:
          "The method still depends on sector context, especially for material Scope 3 categories and relative transition conditions.",
      },
    ],
    faqTitle: "FAQ",
    dimensions: [
      {
        title: "Actual Reduction Performance",
        description:
          "This anchor category combines intensity improvement with absolute-emissions checks, then adds Scope 3 transparency in material value-chain categories.",
        weight: "40%",
        bullets: [
          "V1 intensity improvement with absolute bonus and penalty",
          "V2 Scope 3 data quality, material categories, and primary-data use",
          "Bounded reweighting inside Cat 1 based on sector carbon intensity",
        ],
      },
      {
        title: "Target Clarity",
        description:
          "Targets are treated as a pathway. Near-, mid-, and long-term alignment and the validity of the net-zero claim are scored separately.",
        weight: "25%",
        bullets: [
          "V3-V5 short-, mid-, and long-term target alignment",
          "Penalty strength increases when near-term delivery misses the path",
          "V6 net-zero validity and residual-neutralization credibility",
        ],
      },
      {
        title: "Execution Readiness",
        description:
          "Execution looks for capital and incentive evidence. The score checks whether transition ambition is backed by funding and management linkage.",
        weight: "20%",
        bullets: [
          "V7 green capex share with brown-capex penalty",
          "V8 executive compensation linkage to climate KPI delivery",
          "Resource allocation matters more than narrative alone",
        ],
      },
      {
        title: "Disclosure Level",
        description:
          "This category is about evidence quality and decision-use integrity, not only disclosure volume.",
        weight: "15%",
        bullets: [
          "V9 assurance quality across standard, level, provider, and evidence depth",
          "V10 embedded decision tools such as ICP, MACC, and climate-linked investment review",
          "Reported climate processes need to show operational use, not only mention",
        ],
      },
    ],
    roadmapCards: [
      {
        title: "Current emissions",
        description:
          "The current point uses the latest reported emissions carried into the company profile, usually centered on Scope 1 and Scope 2.",
      },
      {
        title: "Target point",
        description:
          "The target point shows the next disclosed reduction milestone when the company provides a usable target year and target level.",
      },
      {
        title: "Net zero milestone",
        description:
          "The long-term marker shows the stated net zero year, helping users see whether near-term delivery and long-term ambition point in the same direction.",
      },
    ],
    faqs: [
      {
        question: "Why can a strong base score still end lower than expected?",
        answer:
          "Because the final score applies external adjustments after the weighted base score is formed. CBAM exposure and greenwashing divergence can both reduce the headline result.",
      },
      {
        question: "What happens when data is missing?",
        answer:
          "Variables with more than 30% missingness can be excluded from sector-level weighting. Lower missingness can be median-filled, and Scope 3 uses a glide-path penalty rather than a flat replacement.",
      },
      {
        question: "Why is Scope 3 included in performance instead of disclosure only?",
        answer:
          "Because the revised method treats material value-chain transparency as part of actual decarbonization quality. In some sectors, real transition credibility is incomplete without it.",
      },
      {
        question: "Does the score only reward narrative and commitments?",
        answer:
          "No. The score still anchors on V1 and V2, then checks whether targets, capex, governance, assurance, and decision tools are supported by evidence and actual pathway delivery.",
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
    about: "점수 소개",
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
  header: {
    searchPlaceholder: "기업 검색...",
    languageLabel: "언어",
    themeLabel: "테마",
    darkMode: "다크",
    lightMode: "라이트",
  },
  home: {
    eyebrow: "공개 탄소감축 대시보드",
    title: "기업의 탄소감축 수준을 한눈에 파악하세요",
    description:
      "CERs Index는 비전문가도 기업이 실제로 배출을 줄이고 있는지, 목표가 얼마나 신뢰할 만한지, 같은 섹터 내 경쟁사와 비교해 어떤 위치인지 빠르게 이해할 수 있도록 돕습니다.",
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
    scoreMeaningTitle: "일반 사용자도 이해하기 쉬운 기후 성과 뷰",
    scoreMeaningDescription:
      "이 점수는 실질 감축 성과, 목표 명확성, 실행 준비도, 공시 수준의 네 가지 축을 합쳐 보여줍니다. 복잡한 방법론 문서를 읽지 않아도 기업 전환의 질을 빠르게 훑어볼 수 있도록 설계했습니다.",
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
    description: "종합 점수, 감축 차원, 로드맵 지표를 기업별로 한 번에 비교할 수 있습니다.",
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
    filterHigh: "상위 섹터",
    filterModerate: "중간 수준 섹터",
    filterTransitioning: "전환 중 섹터",
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
      "4개 공개 점수 차원의 평균을 통해 이 섹터가 어디에서 상대적으로 강하고 불균형한지 보여줍니다.",
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
    eyebrow: "점수 소개",
    title: "점수는 어떻게 만들어지나",
    description:
      "이 페이지는 개정된 CERs 방법론을 요약해서 보여줍니다. 10개 변수, 4개 고정 가중 카테고리, 기초점수 형성, 그리고 최종 위험 보정까지를 수식 없이 설명합니다.",
    logicCta: "로직 상세보기",
    logicCtaHint: "수식, 가중치, 세부 산정 규칙이 담긴 기술 참고 페이지를 엽니다.",
    backToOverview: "점수 소개로 돌아가기",
    meaningTitle: "이 점수의 용도",
    meaningDescription:
      "CERs Index는 기업의 전환 품질을 공개 정보 기준으로 비교하기 위한 요약 점수입니다. 보고된 배출량, 목표, 거버넌스, 투자, 검증 근거를 하나의 화면으로 모으지만, 해석은 여전히 섹터 맥락과 함께 이뤄져야 합니다.",
    meaningPoints: [
      "보고된 배출량, 목표, CAPEX, 거버넌스, 보증, 의사결정 도구 근거로 10개 변수를 만듭니다",
      "상위 카테고리 가중치는 고정하되, 하위 변수 가중치는 데이터 유효성과 섹터 맥락에 따라 달라집니다",
      "기초점수 이후에도 CBAM 노출과 그린워싱 괴리 보정이 최종 점수에 반영됩니다",
    ],
    logicTitle: "개정된 점수는 이렇게 만들어집니다",
    logicDescription:
      "개정 로직은 먼저 V1-V10을 산정한 뒤, 고정된 대분류 가중치와 동적 하위 가중치 규칙으로 기초점수를 만들고, 마지막에 외생 조정항을 적용합니다.",
    logicSteps: [
      {
        title: "공개 근거에서 10개 변수를 산정합니다",
        description:
          "V1-V10은 실제 탈탄소 성과, 목표 경로 정렬, 자본 배분, 경영 연계, 검증 품질, 의사결정 도구 내재화를 함께 봅니다.",
      },
      {
        title: "네 개 대분류로 묶고 고정 가중치를 적용합니다",
        description:
          "상위 카테고리 가중치는 0.40, 0.25, 0.20, 0.15로 고정해 실질 탈탄소 성과를 가장 크게 둡니다.",
      },
      {
        title: "카테고리 내부 가중치를 다시 조정합니다",
        description:
          "결측률, 엔트로피, 베이지안 축소, 산업 중대성, 시계열 평활화를 반영해 실제 적용 가중치를 확정합니다.",
      },
      {
        title: "최종 신뢰도 보정을 적용합니다",
        description:
          "기초점수 이후에도 CBAM 노출 계수와 그린워싱 괴리 패널티가 작동해 최종 점수가 달라질 수 있습니다.",
      },
    ],
    dimensionsTitle: "네 개 가중 카테고리는 무엇을 보나",
    dimensionsDescription:
      "공개 화면의 라벨은 단순하지만, 실제 방법론에서는 아래 변수들과 고정 가중치에 연결됩니다.",
    roadmapTitle: "로드맵 읽는 법",
    industryTitle: "왜 산업 비교가 중요한가",
    industryDescription:
      "섹터 맥락은 단순 비교를 넘어서 실제 점수 구조에도 들어갑니다. 중대 Scope 3 카테고리, Cat1 내부 재가중, 소표본 보호 규칙이 모두 섹터 조건의 영향을 받습니다.",
    readingTitle: "결과는 이렇게 읽는 것이 좋습니다",
    readingCards: [
      {
        title: "기초점수와 최종점수를 구분해 보세요",
        description:
          "S_base가 높아도 CBAM 노출이나 그린워싱 괴리 보정 이후 최종 점수는 낮아질 수 있습니다.",
      },
      {
        title: "목표 존재보다 목표 경로를 보세요",
        description:
          "단기·중기·장기 목표 정렬과 넷제로 타당성이 함께 좋아야 Cat2가 강하게 나옵니다.",
      },
      {
        title: "섹터 내 비교를 먼저 보세요",
        description:
          "특히 Scope 3 중대성, 탄소집약도, 전환 난이도는 섹터별로 다르기 때문에 같은 섹터 안에서 보는 해석이 우선입니다.",
      },
    ],
    faqTitle: "자주 묻는 질문",
    dimensions: [
      {
        title: "실질 감축 성과",
        description: "점수의 중심 축입니다. 집약도 개선과 절대배출 검증을 함께 보고, 중대 가치사슬 영역의 Scope 3 투명성까지 포함합니다.",
        weight: "40%",
        bullets: [
          "V1 집약도 개선 + 절대배출 보너스/패널티",
          "V2 Scope 3 데이터 품질, 중대 카테고리, 1차 데이터 비율",
          "섹터 탄소집약도에 따라 Cat1 내부 가중치가 제한적으로 재배분됩니다",
        ],
      },
      {
        title: "목표 명확성",
        description: "목표는 선언이 아니라 경로로 읽습니다. 단기·중기·장기 목표 정렬과 넷제로 타당성을 따로 점수화합니다.",
        weight: "25%",
        bullets: [
          "V3-V5 단기·중기·장기 목표 경로 준수도",
          "가까운 시점 목표를 놓칠수록 더 큰 페널티가 적용됩니다",
          "V6 넷제로 타당성과 잔여배출 중립화 계획의 신뢰성",
        ],
      },
      {
        title: "실행 준비도",
        description: "실행은 실제 돈과 인센티브에서 드러납니다. 전환 자본 배분과 경영진 보상 연계를 함께 봅니다.",
        weight: "20%",
        bullets: [
          "V7 Green CapEx 비중과 Brown CapEx 패널티",
          "V8 기후 KPI와 경영진 보상 연계율",
          "서술보다 자원 배분과 경영 연결 근거를 더 중시합니다",
        ],
      },
      {
        title: "공시 수준",
        description: "이 카테고리는 단순 공시량보다 증거 신뢰도와 의사결정 내재화 수준을 봅니다.",
        weight: "15%",
        bullets: [
          "V9 검증 기준, 보증 수준, 기관 신뢰도, 증거 깊이",
          "V10 ICP, MACC, 경제성 평가, 투자 의사결정 내재화",
          "기후 관련 프로세스가 실제 운영에 쓰이는지가 중요합니다",
        ],
      },
    ],
    roadmapCards: [
      {
        title: "현재 배출량",
        description:
          "현재 지점은 회사 프로필에 반영된 최신 보고 배출량을 사용하며, 보통 스코프 1과 2를 중심으로 읽습니다.",
      },
      {
        title: "목표 지점",
        description:
          "목표 지점은 목표 연도와 수준을 읽을 수 있을 때 다음 공개 감축 마일스톤을 보여줍니다.",
      },
      {
        title: "넷제로 마일스톤",
        description:
          "장기 지점은 선언된 넷제로 연도를 보여주며, 단기 실행과 장기 야심이 같은 방향인지 보게 합니다.",
      },
    ],
    faqs: [
      {
        question: "기초점수가 높은데 최종점수가 더 낮을 수 있나요?",
        answer: "그럴 수 있습니다. 기초점수 형성 뒤에도 CBAM 노출 계수와 그린워싱 괴리 패널티가 적용되기 때문입니다.",
      },
      {
        question: "데이터가 비어 있으면 어떻게 처리되나요?",
        answer:
          "결측률이 30%를 넘는 변수는 섹터 내 가중치 산정에서 제외될 수 있습니다. 그보다 낮은 결측은 중앙값 대체가 가능하고, Scope 3는 별도 연착륙 페널티를 사용합니다.",
      },
      {
        question: "왜 Scope 3가 공시가 아니라 성과 쪽에 들어가나요?",
        answer:
          "개정 로직은 중대한 가치사슬 투명성을 실제 탈탄소 역량의 일부로 봅니다. 일부 섹터에서는 Scope 3를 빼면 전환 품질을 제대로 읽기 어렵기 때문입니다.",
      },
      {
        question: "이 점수는 서술과 선언만 잘하면 올라가나요?",
        answer:
          "아닙니다. V1과 V2가 점수의 중심을 잡고, 그 위에 목표, 자본 배분, 보증, 의사결정 도구가 실제 근거와 함께 있는지를 봅니다.",
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
    about: "スコアについて",
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
  header: {
    searchPlaceholder: "企業を検索...",
    languageLabel: "言語",
    themeLabel: "テーマ",
    darkMode: "ダーク",
    lightMode: "ライト",
  },
  home: {
    eyebrow: "公開カーボン削減ダッシュボード",
    title: "企業の炭素削減状況をひと目で把握",
    description:
      "CERs Index は、企業が実際に排出量を減らしているか、目標にどの程度信頼性があるか、同じセクターの同業他社と比べてどこに位置するかを、非専門家でもすばやく理解できるようにします。",
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
    scoreMeaningTitle: "一般ユーザー向けの気候パフォーマンス表示",
    scoreMeaningDescription:
      "このスコアは、実際の削減実績、目標の明確さ、実行準備度、開示水準の4つの軸を組み合わせて示します。複雑な方法論文書を読まなくても、企業の移行品質を素早く把握できるように設計されています。",
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
    description: "総合スコア、削減軸、ロードマップ指標を企業ごとに並べて確認できます。",
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
    filterHigh: "高パフォーマンス",
    filterModerate: "中程度",
    filterTransitioning: "移行中",
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
      "4つの公開スコア次元の平均から、このセクターの相対的な強みとばらつきを見ます。",
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
    eyebrow: "スコアについて",
    title: "スコアはどう作られるのか",
    description:
      "このページでは、改訂された CERs 方法論を高いレベルで要約します。10の変数、4つの固定ウェイト区分、基礎スコアの形成、最終的なリスク補正までを数式なしで説明します。",
    logicCta: "ロジック詳細を見る",
    logicCtaHint: "数式、重み、採点ルールをまとめた技術リファレンスを開きます。",
    backToOverview: "スコア概要へ戻る",
    meaningTitle: "このスコアの目的",
    meaningDescription:
      "CERs Index は企業の移行品質を公開情報ベースで比較するための要約スコアです。報告排出量、目標、ガバナンス、投資、保証根拠を一つの見方にまとめますが、解釈は依然としてセクター文脈と併せて行う必要があります。",
    meaningPoints: [
      "報告排出量、目標、CAPEX、ガバナンス、保証、意思決定ツールの根拠から 10 変数を構成します",
      "上位カテゴリの重みは固定しつつ、下位変数の重みはデータ有効性とセクター文脈に応じて変わります",
      "基礎スコアの後にも CBAM 露出とグリーンウォッシング乖離の補正が最終スコアに反映されます",
    ],
    logicTitle: "改訂後のスコアはこの流れで作られます",
    logicDescription:
      "改訂ロジックでは、まず V1-V10 を採点し、その後に固定カテゴリ重みと動的な下位重みルールで基礎スコアを作り、最後に外生的調整項を適用します。",
    logicSteps: [
      {
        title: "公開根拠から 10 変数を採点する",
        description:
          "V1-V10 は実質的な脱炭素実績、目標経路の整合性、資本配分、経営連動、保証品質、意思決定ツールの内在化を見ます。",
      },
      {
        title: "4つの固定カテゴリにまとめる",
        description:
          "上位カテゴリの重みは 0.40、0.25、0.20、0.15 に固定され、実質的な脱炭素実績を最も重く置きます。",
      },
      {
        title: "カテゴリ内部の重みを再調整する",
        description:
          "欠損率、エントロピー、ベイズ縮小、産業重要度、時系列平滑化を反映して最終適用ウェイトを決めます。",
      },
      {
        title: "最終的な信頼性補正を適用する",
        description:
          "基礎スコアの後にも、CBAM 露出係数とグリーンウォッシング乖離ペナルティによって最終結果が変わることがあります。",
      },
    ],
    dimensionsTitle: "4つの加重カテゴリは何を見るか",
    dimensionsDescription:
      "公開画面のラベルは簡潔ですが、実際の方法論では以下の変数群と固定重みに結び付いています。",
    roadmapTitle: "ロードマップの見方",
    industryTitle: "なぜ業種比較が重要か",
    industryDescription:
      "セクター文脈は比較だけでなく、実際のスコア構造にも入っています。重要 Scope 3 カテゴリ、Cat 1 内部の再配分、小標本保護ルールはいずれもセクター条件の影響を受けます。",
    readingTitle: "結果はこう読むのが有効です",
    readingCards: [
      {
        title: "基礎スコアと最終スコアを分けて見る",
        description:
          "S_base が強くても、CBAM 露出やグリーンウォッシング乖離補正の後で最終スコアが下がることがあります。",
      },
      {
        title: "目標の有無より目標経路を見る",
        description:
          "短期・中期・長期の整合性とネットゼロ妥当性が揃って初めて Cat2 は強くなります。",
      },
      {
        title: "まずセクター内比較を見る",
        description:
          "特に Scope 3 の重要性、炭素集約度、移行難易度はセクターごとに異なるため、同一セクター内の比較が優先されます。",
      },
    ],
    faqTitle: "FAQ",
    dimensions: [
      {
        title: "実際の削減実績",
        description: "スコアの中心軸です。原単位改善と絶対排出の検証を組み合わせ、重要なバリューチェーン領域の Scope 3 透明性まで含めます。",
        weight: "40%",
        bullets: [
          "V1 原単位改善 + 絶対排出ボーナス/ペナルティ",
          "V2 Scope 3 データ品質、重要カテゴリ、一次データ比率",
          "セクター炭素集約度に応じて Cat1 内部ウェイトが限定的に再配分されます",
        ],
      },
      {
        title: "目標の明確さ",
        description: "目標は宣言ではなく経路として読みます。短期・中期・長期の整合性とネットゼロ妥当性を別々に採点します。",
        weight: "25%",
        bullets: [
          "V3-V5 短期・中期・長期の目標経路順守",
          "近い時点の目標を外すほど強いペナルティがかかります",
          "V6 ネットゼロ妥当性と残余排出中和計画の信頼性",
        ],
      },
      {
        title: "実行準備度",
        description: "実行は実際のお金とインセンティブに表れます。移行投資と経営報酬の連動を見ます。",
        weight: "20%",
        bullets: [
          "V7 Green CapEx 比率と Brown CapEx ペナルティ",
          "V8 気候 KPI と経営報酬の連動率",
          "物語よりも資源配分と経営連動の根拠を重視します",
        ],
      },
      {
        title: "開示水準",
        description: "このカテゴリは単なる開示量ではなく、証拠の信頼性と意思決定への内在化を見ます。",
        weight: "15%",
        bullets: [
          "V9 検証基準、保証水準、機関信頼性、証拠の深さ",
          "V10 ICP、MACC、経済性評価、投資意思決定への内在化",
          "気候関連プロセスが実際の運営で使われているかが重要です",
        ],
      },
    ],
    roadmapCards: [
      {
        title: "現在の排出量",
        description:
          "現在のポイントは、企業プロフィールに取り込まれた最新報告排出量を使い、通常はスコープ1と2を中心に読みます。",
      },
      {
        title: "目標ポイント",
        description:
          "目標ポイントは、目標年と水準が読める場合に、次の公開削減マイルストーンを示します。",
      },
      {
        title: "ネットゼロの到達点",
        description:
          "長期ポイントは宣言されたネットゼロ年を示し、短期の実行と長期の意欲が同じ方向かを見やすくします。",
      },
    ],
    faqs: [
      {
        question: "基礎スコアが高くても最終スコアが下がることはありますか？",
        answer:
          "あります。基礎スコア形成後にも、CBAM 露出係数とグリーンウォッシング乖離ペナルティが適用されるためです。",
      },
      {
        question: "データが欠けている場合はどう処理されますか？",
        answer:
          "欠損率が 30% を超える変数は、セクター内ウェイト算定から除外されることがあります。より低い欠損は中央値補完の対象になり、Scope 3 には別途グライドパス型ペナルティが使われます。",
      },
      {
        question: "なぜ Scope 3 は開示だけでなく実績側に入るのですか？",
        answer:
          "改訂ロジックでは、重要なバリューチェーン透明性を実質的な脱炭素品質の一部と見なします。一部セクターでは Scope 3 を外すと移行品質を十分に読めません。",
      },
      {
        question: "このスコアは物語や宣言だけで上がるのですか？",
        answer:
          "いいえ。V1 と V2 がスコアの中心を取り、その上で目標、資本配分、保証、意思決定ツールが実証的な根拠と一緒にあるかを見ます。",
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
