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
      "Search and compare companies using the latest CERs score, reduction targets, and disclosure signals.",
    filters: "Filters",
    industry: "Sector",
    country: "Country",
    allIndustries: "All sectors",
    allCountries: "All countries",
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
    cersScore: "CERs score",
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
      "This page explains what goes into the public score, what each score area looks for, and how to read the result without opening the full technical methodology.",
    logicCta: "View detailed logic",
    logicCtaHint: "Open the technical reference with formulas, weights, and scoring rules.",
    backToOverview: "Back to score overview",
    meaningTitle: "What this score is for",
    meaningDescription:
      "CERs Index is a public-facing summary of transition quality. It does not replace full diligence, but it helps users see whether emissions performance, target quality, execution, and evidence are moving in the same direction.",
    meaningPoints: [
      "Uses reported emissions, targets, and supporting disclosure",
      "Designed to compare companies on a common public view",
      "Best read within industry before broad cross-sector ranking",
    ],
    logicTitle: "How the score is built",
    logicDescription:
      "The public score follows a simple logic flow. It starts with reported company data, groups that information into four decision-useful areas, then checks whether the overall story remains credible when industry context and final adjustments are considered.",
    logicSteps: [
      {
        title: "Start with reported company data",
        description:
          "Use the latest comparable emissions, target facts, and linked disclosure evidence available in the current company profile.",
      },
      {
        title: "Read four score areas separately",
        description:
          "Look at actual reduction performance, target clarity, execution readiness, and disclosure quality as distinct parts of the story.",
      },
      {
        title: "Keep industry context in view",
        description:
          "Compare companies against peers facing similar transition conditions, carbon intensity, and capital requirements.",
      },
      {
        title: "Apply final credibility checks",
        description:
          "A strong public narrative alone does not guarantee a high result. Scores can be held back when delivery lags ambition or when transition exposure still matters.",
      },
    ],
    dimensionsTitle: "What the four score areas look at",
    dimensionsDescription:
      "The public labels are simplified, but each area still reflects a specific set of questions drawn from the underlying logic.",
    roadmapTitle: "How to read the roadmap",
    industryTitle: "Why industry comparison matters",
    industryDescription:
      "Transition conditions differ across sectors. Industry comparison is the fairest first read because carbon intensity, capital requirements, and disclosure patterns are not uniform.",
    readingTitle: "How to interpret the result",
    readingCards: [
      {
        title: "Read the roadmap with the score",
        description:
          "The score is stronger when current emissions, the next target point, and the long-term milestone tell a coherent story together.",
      },
      {
        title: "Compare within industry first",
        description:
          "A raw rank across all sectors is less informative than a peer comparison within similar operating and carbon conditions.",
      },
      {
        title: "Treat it as a starting point",
        description:
          "The score summarizes public evidence. It helps users narrow attention, but it should not replace full diligence or company-specific review.",
      },
    ],
    faqTitle: "FAQ",
    dimensions: [
      {
        title: "Actual Reduction Performance",
        description:
          "This is the anchor of the score. It asks whether emissions are improving in real operating terms rather than only in narrative terms.",
        bullets: [
          "Recent Scope 1 and Scope 2 performance",
          "Change relative to business activity or intensity",
          "Scope 3 transparency in material areas where relevant",
        ],
      },
      {
        title: "Target Clarity",
        description:
          "Targets are read as a pathway, not just as an announcement. Clear time horizons and usable milestones matter.",
        bullets: [
          "Near-, mid-, and long-term target structure",
          "Coverage across relevant scopes",
          "How well reported progress lines up with the stated path",
        ],
      },
      {
        title: "Execution Readiness",
        description:
          "Plans matter more when they appear connected to real resource allocation and operating decisions.",
        bullets: [
          "Green capex direction",
          "Governance or management follow-through",
          "Decision tools such as internal carbon pricing or transition planning",
        ],
      },
      {
        title: "Disclosure Level",
        description:
          "Disclosure is not only about volume. It reflects how much confidence users can place in the reported story.",
        bullets: [
          "Third-party assurance and verification depth",
          "Traceability and scope of supporting evidence",
          "Breadth and clarity of disclosed climate data",
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
        question: "Does the score only reward target announcements?",
        answer:
          "No. Public targets matter, but the score also looks for real emissions progress, delivery signals, and evidence quality behind the story.",
      },
      {
        question: "Why can a company with strong messaging still score lower than expected?",
        answer:
          "Because the final view is not driven by narrative alone. If observed delivery is weak relative to stated ambition, or if risk exposure remains material, the public score can stay constrained.",
      },
      {
        question: "Why does industry context matter so much?",
        answer:
          "Transition conditions are not the same across sectors. Industry context helps avoid reading every score as if capital needs, carbon intensity, and disclosure challenges were identical.",
      },
      {
        question: "What should I use the roadmap for?",
        answer:
          "Use it to see whether current emissions, the next disclosed target point, and the long-term net zero milestone form a coherent pathway.",
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
    description: "최신 CERs 점수, 감축 목표, 공시 신호를 기준으로 기업을 검색하고 비교하세요.",
    filters: "필터",
    industry: "섹터",
    country: "국가",
    allIndustries: "전체 섹터",
    allCountries: "모든 국가",
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
    cersScore: "CERs 점수",
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
      "이 페이지는 공개 점수에 어떤 정보가 들어가고, 각 점수 차원이 무엇을 보는지, 결과를 어떻게 읽어야 하는지를 수식 없이 설명합니다.",
    logicCta: "로직 상세보기",
    logicCtaHint: "수식, 가중치, 세부 산정 규칙이 담긴 기술 참고 페이지를 엽니다.",
    backToOverview: "점수 소개로 돌아가기",
    meaningTitle: "이 점수의 용도",
    meaningDescription:
      "CERs Index는 전환 품질을 빠르게 읽기 위한 공개 요약 점수입니다. 정밀 실사를 대체하지는 않지만, 배출 성과, 목표의 질, 실행 근거, 공시 신뢰가 같은 방향을 가리키는지 확인하는 출발점이 됩니다.",
    meaningPoints: [
      "보고된 배출량, 목표, 근거 공시를 함께 사용",
      "여러 기업을 같은 공개 기준에서 비교하도록 설계",
      "업종 내 비교를 먼저 보고, 업종 간 비교는 그다음에 해석",
    ],
    logicTitle: "점수는 이렇게 만들어집니다",
    logicDescription:
      "공개 점수는 단순한 흐름으로 읽을 수 있습니다. 먼저 최신 공시 데이터를 가져오고, 이를 네 개의 판단 축으로 나눈 뒤, 산업 맥락과 최종 보정까지 고려해 결과를 보여줍니다.",
    logicSteps: [
      {
        title: "보고된 회사 데이터를 먼저 봅니다",
        description:
          "현재 회사 프로필에 연결된 최신 비교 가능 배출량, 목표 정보, 공시 근거를 사용합니다.",
      },
      {
        title: "네 개의 점수 축을 따로 읽습니다",
        description:
          "실질 감축 성과, 목표 명확성, 실행 준비도, 공시 수준을 각각 분리해 봅니다.",
      },
      {
        title: "산업 맥락을 함께 봅니다",
        description:
          "비슷한 전환 조건, 탄소집약도, 자본지출 구조를 가진 동종사와 비교합니다.",
      },
      {
        title: "마지막으로 신뢰도 보정을 거칩니다",
        description:
          "좋은 서술만으로 높은 점수가 나오지 않습니다. 실제 이행이 목표보다 약하거나 전환 노출이 크면 최종 점수는 제한될 수 있습니다.",
      },
    ],
    dimensionsTitle: "네 개의 점수 차원은 무엇을 보나",
    dimensionsDescription:
      "공개 화면의 이름은 단순하지만, 각 차원은 실제로는 아래와 같은 질문을 담고 있습니다.",
    roadmapTitle: "로드맵 읽는 법",
    industryTitle: "왜 산업 비교가 중요한가",
    industryDescription:
      "전환 조건은 업종마다 다릅니다. 탄소집약도, 필요한 자본, 공시 관행이 같지 않기 때문에 업종 내 비교가 가장 공정한 첫 해석입니다.",
    readingTitle: "결과는 이렇게 읽는 것이 좋습니다",
    readingCards: [
      {
        title: "점수와 로드맵을 함께 보세요",
        description:
          "현재 배출량, 다음 목표 지점, 장기 마일스톤이 함께 일관된 스토리를 만드는지 확인하는 것이 좋습니다.",
      },
      {
        title: "업종 내 비교를 먼저 보세요",
        description:
          "모든 업종을 한 줄로 세운 순위보다, 비슷한 운영 조건의 동종사 비교가 더 의미 있습니다.",
      },
      {
        title: "출발점으로 사용하세요",
        description:
          "이 점수는 공개 근거를 요약한 것입니다. 관심 대상을 좁히는 데는 유용하지만, 개별 기업 실사를 대신하지는 않습니다.",
      },
    ],
    faqTitle: "자주 묻는 질문",
    dimensions: [
      {
        title: "실질 감축 성과",
        description: "이 축이 점수의 중심입니다. 선언보다 실제 운영 기준에서 배출이 개선되는지를 봅니다.",
        bullets: ["최근 스코프 1·2 배출 성과", "사업 활동 대비 변화나 집약도 개선", "필요한 경우 중대 영역의 스코프 3 투명성"],
      },
      {
        title: "목표 명확성",
        description: "목표는 문구가 아니라 경로로 읽습니다. 시점과 마일스톤이 분명해야 합니다.",
        bullets: ["단기·중기·장기 목표 구조", "관련 스코프를 충분히 포함하는지", "공개된 진척이 목표 경로와 얼마나 맞는지"],
      },
      {
        title: "실행 준비도",
        description: "계획은 실제 자원 배분과 운영 의사결정으로 이어질 때 의미가 커집니다.",
        bullets: ["그린 CAPEX 방향", "거버넌스와 경영진의 이행 흔적", "내부탄소가격이나 전환계획 같은 의사결정 도구"],
      },
      {
        title: "공시 수준",
        description: "공시는 양보다 신뢰가 중요합니다. 보고된 스토리를 어느 정도 믿을 수 있는지를 봅니다.",
        bullets: ["제3자 검증과 보증의 깊이", "근거 자료의 추적 가능성과 범위", "기후 데이터 공개의 폭과 명확성"],
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
        question: "이 점수는 목표 선언만 높게 평가하나요?",
        answer: "아닙니다. 공개 목표는 중요하지만, 실제 배출 성과, 실행 신호, 근거의 질도 함께 봅니다.",
      },
      {
        question: "왜 메시지가 강한데도 기대보다 점수가 낮을 수 있나요?",
        answer:
          "최종 평가는 서술만으로 결정되지 않기 때문입니다. 관측된 이행이 목표보다 약하거나 위험 노출이 크면 공개 점수는 제한될 수 있습니다.",
      },
      {
        question: "왜 산업 맥락이 그렇게 중요한가요?",
        answer:
          "전환 조건은 업종마다 다릅니다. 자본 구조, 탄소집약도, 공시 난이도가 같지 않기 때문에 모든 점수를 같은 기준으로 읽으면 왜곡될 수 있습니다.",
      },
      {
        question: "로드맵은 무엇을 보려고 쓰나요?",
        answer:
          "현재 배출량, 다음 공개 목표 지점, 장기 넷제로 시점이 서로 이어지는 경로인지 확인하는 데 쓰면 됩니다.",
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
    description: "最新の CERs スコア、削減目標、開示シグナルを使って企業を検索・比較できます。",
    filters: "フィルター",
    industry: "セクター",
    country: "国",
    allIndustries: "すべてのセクター",
    allCountries: "すべての国",
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
    cersScore: "CERs スコア",
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
      "このページでは、公開スコアに何が入っているのか、各スコア軸が何を見るのか、結果をどう読めばよいのかを数式なしで説明します。",
    logicCta: "ロジック詳細を見る",
    logicCtaHint: "数式、重み、採点ルールをまとめた技術リファレンスを開きます。",
    backToOverview: "スコア概要へ戻る",
    meaningTitle: "このスコアの目的",
    meaningDescription:
      "CERs Index は移行品質を素早く読むための公開サマリーです。完全なデューデリジェンスの代替ではありませんが、排出実績、目標の質、実行の裏付け、開示の信頼性が同じ方向を向いているかを見る出発点になります。",
    meaningPoints: [
      "報告された排出量、目標、裏付け開示をまとめて使用",
      "企業を同じ公開基準で比較するために設計",
      "まず業種内比較を見て、その後に業種横断比較を読む",
    ],
    logicTitle: "スコアはこの流れで作られます",
    logicDescription:
      "公開スコアはシンプルな流れで読めます。まず最新の開示データを集め、それを4つの判断軸に分け、最後に業種文脈と信頼性の補正を踏まえて結果を示します。",
    logicSteps: [
      {
        title: "まず報告された企業データを見る",
        description:
          "現在の企業プロフィールに結び付く、最新で比較可能な排出量、目標情報、開示根拠を使います。",
      },
      {
        title: "4つのスコア軸を分けて読む",
        description:
          "実際の削減実績、目標の明確さ、実行準備度、開示水準を別々の観点として見ます。",
      },
      {
        title: "業種文脈を一緒に見る",
        description:
          "似た移行条件、炭素集約度、資本支出構造を持つ同業他社との比較で解釈します。",
      },
      {
        title: "最後に信頼性の確認をかける",
        description:
          "強いメッセージだけで高い結果にはなりません。実行が目標に届かない場合や、移行リスクがなお大きい場合は、最終スコアが抑えられることがあります。",
      },
    ],
    dimensionsTitle: "4つのスコア軸は何を見るか",
    dimensionsDescription:
      "公開画面のラベルは簡潔ですが、各軸は実際には次のような問いを含んでいます。",
    roadmapTitle: "ロードマップの見方",
    industryTitle: "なぜ業種比較が重要か",
    industryDescription:
      "移行条件は業種ごとに異なります。炭素集約度、必要資本、開示慣行が同じではないため、業種内比較が最も公平な第一の読み方です。",
    readingTitle: "結果はこう読むのが有効です",
    readingCards: [
      {
        title: "スコアとロードマップを一緒に見る",
        description:
          "現在の排出量、次の目標ポイント、長期マイルストーンが一貫したストーリーを作っているかを確認すると読みやすくなります。",
      },
      {
        title: "まず業種内比較を見る",
        description:
          "すべての業種を一列に並べた順位より、似た運営条件の同業比較のほうが意味があります。",
      },
      {
        title: "出発点として使う",
        description:
          "このスコアは公開根拠の要約です。注目先を絞るには有用ですが、個社の詳細なデューデリジェンスの代わりにはなりません。",
      },
    ],
    faqTitle: "FAQ",
    dimensions: [
      {
        title: "実際の削減実績",
        description: "この軸がスコアの中心です。宣言よりも、実際の運営基準で排出が改善しているかを見ます。",
        bullets: ["最近のスコープ1・2排出実績", "事業活動に対する変化や原単位改善", "必要に応じた重要領域でのスコープ3透明性"],
      },
      {
        title: "目標の明確さ",
        description: "目標は文言ではなく経路として読みます。時点とマイルストーンの明確さが重要です。",
        bullets: ["短期・中期・長期の目標構造", "関連スコープを十分に含むか", "公表された進捗が目標経路にどこまで沿うか"],
      },
      {
        title: "実行準備度",
        description: "計画は、実際の資源配分や運営意思決定につながっているときに意味が強まります。",
        bullets: ["グリーン CAPEX の方向性", "ガバナンスや経営の実行痕跡", "内部炭素価格や移行計画などの意思決定ツール"],
      },
      {
        title: "開示水準",
        description: "開示は量だけではありません。報告されたストーリーをどこまで信頼できるかを見ます。",
        bullets: ["第三者保証と検証の深さ", "裏付け証拠の追跡可能性と範囲", "気候データ開示の広さと明確さ"],
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
        question: "このスコアは目標公表だけを評価するのですか？",
        answer:
          "いいえ。公開目標は重要ですが、実際の排出実績、実行シグナル、裏付けの質も合わせて見ます。",
      },
      {
        question: "メッセージが強いのに、なぜ期待より低く見えることがあるのですか？",
        answer:
          "最終評価は物語だけで決まりません。観測された実行が目標に弱かったり、リスク露出が依然大きい場合、公開スコアは抑えられることがあります。",
      },
      {
        question: "なぜ業種文脈がそんなに重要なのですか？",
        answer:
          "移行条件は業種ごとに異なります。資本構造、炭素集約度、開示の難しさが同じではないため、すべてのスコアを同一基準で読むと歪みが生じます。",
      },
      {
        question: "ロードマップは何のために使えばよいですか？",
        answer:
          "現在の排出量、次の公開目標ポイント、長期ネットゼロ時点がつながる経路になっているかを見るために使うのが有効です。",
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
