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
    scoreMeaningTitle: "A public view of climate transition reliability",
    scoreMeaningDescription:
      "The score turns public climate evidence into a 1-100 view of transition reliability, combining emissions performance, target quality, governance, capital-allocation traceability, reporting boundaries, and assurance.",
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
    eyebrow: "About the Score",
    title: "How the score works",
    description:
      "CERs Index is a public-data-based climate transition reliability index aligned to CDP. This page explains what it measures and how the final score is organized.",
    logicCta: "View detailed logic",
    logicCtaHint: "Open the full formula, variable, and weighting page.",
    backToOverview: "Back to score overview",
    formulaTitle: "Current CERs Index equation",
    formulaDescription:
      "The public score is built in three steps: score each variable, apply the P2 reliability coefficient when sources disagree, and transform the weighted internal score into a 1-100 index. The clamp step keeps the displayed range bounded without negative scores or oversized bonuses.",
    formulaSteps: [
      {
        id: "adjusted",
        title: "1. Reliability-adjusted variable score",
        formula: "S_{\\mathrm{adjusted},v} = S_v \\times K_{\\mathrm{P2},v}",
      },
      {
        id: "total",
        title: "2. Weighted internal score",
        formula: "S_{\\mathrm{total}}(i,t) = \\sum_v W_{v,g(i)} \\times S_{\\mathrm{adjusted}}(v,i,t)",
      },
      {
        id: "index",
        title: "3. Public CERs Index",
        formula: "\\mathrm{CERs\\ Index}(i,t) = 1 + 99 \\times \\operatorname{clamp}(S_{\\mathrm{total}}(i,t), 0, 1)",
      },
    ],
    formulaDefinitionsTitle: "What the symbols mean",
    formulaDefinitions: [
      { key: "S_v", label: "Raw variable score for V1-V9 on a 0-1 scale" },
      {
        key: "K_P2,v",
        label: "Reliability coefficient applied when reported evidence conflicts with GIR, DART, or assurance evidence",
      },
      {
        key: "W_v,g",
        label: "Industry-specific variable weight derived from CDP 2025 Climate Change question mapping",
      },
      { key: "g(i)", label: "CERs industry group assigned to company i" },
    ],
    formulaNoteLabel: "Method note",
    formulaNote:
      "CDP is the primary methodology backbone. When a variable is truly not applicable, its denominator is removed and the remaining weights are renormalized. P1 is not a standalone variable; carbon-credit dependence is absorbed into V3 credit transparency.",
    meaningTitle: "What this score is for",
    meaningDescription:
      "CERs Index is not an ESG overall rating. It is a public-data-based climate transition reliability index designed to show whether emissions reduction, target design, governance, capital allocation, reporting boundaries, and assurance stand up across public sources.",
    meaningPoints: [
      "Scores nine variables using sustainability reports, DART, KRX ESG, GIR, and assurance statements as the main public evidence base",
      "Shows climate transition reliability and carbon-risk response rather than ESG marketing language or carbon-credit value",
      "Uses industry-specific weights derived from CDP 2025 Climate Change Management and Leadership scoring denominators",
      "Uses MSCI only as a secondary exposure-management lens for industry interpretation",
      "Reduces variable scores through P2 when reported claims conflict with GIR, DART, or assurance evidence",
    ],
    logicTitle: "How the current score is built",
    logicDescription:
      "The current methodology scores V1-V9 first, applies P2 reliability coefficients to the affected variables, and then converts the weighted internal total into the public 1-100 CERs Index.",
    logicSteps: [
      {
        title: "Score V1-V9 from public evidence",
        description:
          "Each variable is normalized to 0-1 using the current v0.3 rules for emissions performance, targets, transition planning, governance, capex traceability, boundary transparency, and assurance.",
      },
      {
        title: "Apply P2 reliability adjustment where sources conflict",
        description:
          "If key figures disagree across report text, GIR, DART, or assurance statements, the affected variable is multiplied by K_P2,v instead of being accepted at face value.",
      },
      {
        title: "Calculate industry-specific weights",
        description:
          "W_v,g is not hand-set. It is derived from CDP 2025 Climate Change question mapping using Management and Leadership denominators for each CERs industry group.",
      },
      {
        title: "Convert the internal total into the public index",
        description:
          "The weighted sum is clamped to 0-1 and transformed to the displayed 1-100 CERs Index with the current public formula.",
      },
    ],
    dimensionsTitle: "What the nine variables assess",
    dimensionsDescription:
      "The current v0.3 public score is built from nine variables. Some variables can be marked NA and trigger weight renormalization, but the index is still anchored in this set.",
    roadmapTitle: "How to read the roadmap",
    industryTitle: "Why industry comparison matters",
    industryDescription:
      "Industry context is built directly into the equation. Material Scope 3 categories and W_v,g both depend on the CERs industry group, so the same disclosure can matter differently across sectors.",
    readingTitle: "How to interpret the result",
    readingCards: [
      {
        title: "Read the 1-100 score as a transformed value",
        description:
          "The displayed score is not a simple percentage. It is 1 + 99 × clamp(S_total, 0, 1), so movement reflects changes in the weighted internal total.",
      },
      {
        title: "Read P2 as a reliability check",
        description:
          "A P2 reduction is not a direct greenwashing verdict. It is a variable-level reliability adjustment triggered when public sources disagree and need manual review.",
      },
      {
        title: "Check whether the company is Full or Limited",
        description:
          "Some companies can still receive a Limited Index when core variables are available but some conditional variables remain missing or not applicable.",
      },
      {
        title: "Compare within sector first",
        description:
          "Because material Scope 3 categories and CDP-derived weights vary by industry group, within-sector comparison is usually the cleaner first read.",
      },
    ],
    faqTitle: "FAQ",
    dimensions: [
      {
        title: "V1. Scope 1 and 2 emissions performance",
        description:
          "Checks whether combined Scope 1 and 2 emissions intensity improves over time and whether absolute emissions are at least not rising.",
        bullets: [
          "Uses a 3-year annualized intensity-improvement rate where available",
          "Absolute emissions growth reduces the score even if intensity improves",
        ],
      },
      {
        title: "V2. Material Scope 3 disclosure and management",
        description:
          "Checks whether the company quantifies and manages the Scope 3 categories that are material for its CERs industry group.",
        bullets: [
          "Material categories depend on the assigned industry group g",
          "Clearly non-applicable categories are removed from the denominator",
        ],
      },
      {
        title: "V3. Target design quality",
        description:
          "Checks whether the reduction target is structurally traceable rather than a broad ambition statement.",
        bullets: [
          "Looks at base year, target year, reduction rate, scope coverage, target type, and credit transparency",
          "Net-zero claims without gross-emissions clarity score poorly",
        ],
      },
      {
        title: "V4. Delivery against the target path",
        description:
          "Checks whether actual performance is tracking the disclosed reduction path and whether concrete reduction initiatives are evidenced.",
        bullets: [
          "Compares current performance with the linear path from base year to target year",
          "Reduction initiatives need scope, timing, and evidence to score well",
        ],
      },
      {
        title: "V5. Climate risk and transition-plan identification",
        description:
          "Checks whether the company identifies physical and transition risks, opportunities, time horizons, financial impact, and transition levers.",
        bullets: [
          "Uses an arithmetic mean across seven public planning signals",
          "General narrative without company-specific detail stays partial",
        ],
      },
      {
        title: "V6. Board oversight, accountability, and pay linkage",
        description:
          "Checks whether climate oversight sits with the board, is assigned to management, and links to executive compensation with documentable evidence.",
        bullets: [
          "Uses a geometric mean so missing governance links weaken the whole variable",
          "This is evidence of linkage between climate KPIs and executive pay, not a compensation-linkage rate",
          "General ESG oversight is not enough on its own",
        ],
      },
      {
        title: "V7. Capital allocation and traceability",
        description:
          "Checks whether the transition investment story can be tied to real capex or, for financials, to transition-finance allocation.",
        bullets: [
          "This is a traceability variable, not a perfect green-capex estimator",
          "Traceability against DART or financial statements matters as much as the green investment claim",
          "If the variable is not applicable, the remaining weights are renormalized",
        ],
      },
      {
        title: "V8. Emissions accounting and boundary transparency",
        description:
          "Checks whether organizational, operational, and financial boundaries are clearly aligned with reporting methodology.",
        bullets: [
          "Covers calculation standards, emission factors, Scope 2 method, and restatement disclosure",
          "Boundary mismatches can also trigger a P2 reduction",
        ],
      },
      {
        title: "V9. Third-party assurance and data reliability",
        description:
          "Checks whether emissions and key climate data are independently assured, at what level, and across which scopes.",
        bullets: [
          "Assurance existence, quality, and scope coverage are all required",
          "Scope 3 assurance matters more when those categories are material",
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
        question: "What happens when data is missing or not disclosed?",
        answer:
          "Non-disclosed items are generally scored zero. Truly non-applicable items can be excluded from the denominator, and unresolved collection failures should not be finalized as a confirmed score.",
      },
      {
        question: "Why can a strong climate narrative still receive a modest score?",
        answer:
          "Because the model requires operational evidence across V1, V4, V7, V8, and V9. Public claims can also be reduced through P2 when source documents do not match.",
      },
      {
        question: "Why are weights not assigned manually?",
        answer:
          "The current method derives W_v,g from CDP 2025 Climate Change question mapping using Management and Leadership denominators rather than subjective fixed weights.",
      },
      {
        question: "How are carbon credits handled?",
        answer:
          "Carbon-credit dependence is not scored as a standalone bonus or penalty. It is absorbed into V3 through credit-transparency checks on gross versus net target design.",
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
    scoreMeaningTitle: "기후전환 신뢰도를 보는 공개 지표",
    scoreMeaningDescription:
      "이 점수는 공개된 기후 근거를 1~100 범위의 전환 신뢰도 지표로 바꿔 보여주며, 배출 성과, 목표 품질, 거버넌스, 자본배분 추적성, 보고경계, 검증 수준을 함께 반영합니다.",
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
    eyebrow: "점수 소개",
    title: "점수는 어떻게 만들어지나",
    description:
      "CERs Index는 CDP에 정렬된 공개자료 기반 기후전환 신뢰도 인덱스입니다. 이 페이지는 무엇을 보고, 최종 점수가 어떤 구조로 만들어지는지 설명합니다.",
    logicCta: "상세 로직 보기",
    logicCtaHint: "전체 수식, 변수, 가중치 구조를 자세히 봅니다.",
    backToOverview: "점수 개요로 돌아가기",
    formulaTitle: "현재 CERs Index 전체 수식",
    formulaDescription:
      "공개 점수는 세 단계로 만들어집니다. 먼저 변수점수를 계산하고, 출처가 충돌하면 P2 신뢰도 계수를 적용한 다음, 가중 내부점수를 1~100 CERs Index로 변환합니다. clamp 단계는 음수 점수와 과도한 보너스를 막으면서 표시 범위를 고정합니다.",
    formulaSteps: [
      {
        id: "adjusted",
        title: "1. 신뢰도 보정 변수점수",
        formula: "S_{\\mathrm{adjusted},v} = S_v \\times K_{\\mathrm{P2},v}",
      },
      {
        id: "total",
        title: "2. 가중 내부점수",
        formula: "S_{\\mathrm{total}}(i,t) = \\sum_v W_{v,g(i)} \\times S_{\\mathrm{adjusted}}(v,i,t)",
      },
      {
        id: "index",
        title: "3. 공개 CERs Index",
        formula: "\\mathrm{CERs\\ Index}(i,t) = 1 + 99 \\times \\operatorname{clamp}(S_{\\mathrm{total}}(i,t), 0, 1)",
      },
    ],
    formulaDefinitionsTitle: "기호 설명",
    formulaDefinitions: [
      { key: "S_v", label: "V1~V9의 원점수로, 0~1 범위에서 계산됩니다" },
      {
        key: "K_P2,v",
        label: "보고서 주장과 GIR, DART, 검증 근거가 충돌할 때 적용하는 신뢰도 계수입니다",
      },
      {
        key: "W_v,g",
        label: "CDP 2025 Climate Change 질문 매핑으로 계산한 산업군별 변수 가중치입니다",
      },
      { key: "g(i)", label: "기업 i에 부여된 CERs 산업군입니다" },
    ],
    formulaNoteLabel: "방법론 메모",
    formulaNote:
      "CDP가 현재 방법론의 주된 뼈대입니다. 변수가 명확히 비해당이면 해당 분모를 제외하고 남은 가중치를 재정규화합니다. P1은 별도 변수로 두지 않고, 탄소크레딧 의존도를 V3의 크레딧 투명성에 흡수합니다.",
    meaningTitle: "이 점수의 용도",
    meaningDescription:
      "CERs Index는 ESG 종합등급이 아닙니다. 공개자료를 바탕으로 실제 배출 감축, 목표 설계, 거버넌스, 자본배분, 보고경계, 검증 수준이 공적 근거와 맞아떨어지는지를 보여주는 기후전환 신뢰도 인덱스입니다.",
    meaningPoints: [
      "지속가능경영보고서, DART, KRX ESG, GIR, 검증의견서를 중심으로 한 공개 근거를 9개 변수로 점수화합니다",
      "ESG 홍보문구나 탄소크레딧 가치가 아니라 기후전환 신뢰도와 탄소리스크 대응 수준을 보여줍니다",
      "가중치는 임의로 정하지 않고, CDP 2025 Climate Change의 Management 및 Leadership denominator를 기반으로 산업별로 계산합니다",
      "MSCI는 원점수 산식이 아니라 산업별 해석을 돕는 exposure-management 보조 프레임으로만 사용합니다",
      "보고서 주장과 GIR, DART, 검증 근거가 충돌하면 P2 계수로 해당 변수점수를 낮춥니다",
    ],
    logicTitle: "현재 점수는 이렇게 만들어집니다",
    logicDescription:
      "현재 방법론은 먼저 V1~V9를 산정하고, 출처 불일치가 있는 변수에는 P2 계수를 반영한 뒤, 산업별 가중 내부총점을 공개용 1~100 CERs Index로 변환합니다.",
    logicSteps: [
      {
        title: "공개 근거에서 V1~V9를 산정합니다",
        description:
          "각 변수는 v0.3 기준에 따라 0~1로 정규화되며, 배출 성과, 목표 설계, 전환계획, 거버넌스, 투자 추적성, 경계 투명성, 검증 수준을 함께 봅니다.",
      },
      {
        title: "출처 충돌이 있으면 P2 신뢰도 보정을 적용합니다",
        description:
          "핵심 수치가 보고서, GIR, DART, 검증의견서 사이에서 맞지 않으면 해당 변수는 그대로 인정하지 않고 K_P2,v를 곱해 신뢰도를 낮춥니다.",
      },
      {
        title: "산업별 변수 가중치를 계산합니다",
        description:
          "W_v,g는 손으로 정한 값이 아니라, CERs 산업군별 CDP 2025 Climate Change 질문 매핑과 Management 및 Leadership denominator로 산출됩니다.",
      },
      {
        title: "내부총점을 공개 점수로 변환합니다",
        description:
          "가중합 내부점수는 0~1 범위로 제한한 뒤 1 + 99 × clamp(...) 공식을 적용해 화면에 보이는 CERs Index로 변환합니다.",
      },
    ],
    dimensionsTitle: "현재 9개 변수는 무엇을 보나",
    dimensionsDescription:
      "현재 v0.3 공개 점수는 아래 9개 변수로 구성됩니다. 일부 변수는 비해당 처리 후 가중치가 재정규화될 수 있지만, 전체 지수는 이 집합을 기준으로 계산됩니다.",
    roadmapTitle: "로드맵 읽는 법",
    industryTitle: "왜 산업 비교가 중요한가",
    industryDescription:
      "산업 맥락은 해석 참고 수준이 아니라 산식 안에 직접 들어갑니다. 중대 Scope 3 카테고리와 W_v,g 모두 CERs 산업군에 따라 달라지기 때문에, 같은 공시라도 섹터에 따라 의미가 달라질 수 있습니다.",
    readingTitle: "결과는 이렇게 읽는 것이 좋습니다",
    readingCards: [
      {
        title: "1~100 점수는 변환값으로 읽으세요",
        description:
          "화면 점수는 단순 백분율이 아니라 1 + 99 × clamp(S_total, 0, 1) 변환값입니다. 따라서 점수 변화는 가중 내부총점의 변화로 읽는 것이 맞습니다.",
      },
      {
        title: "P2는 신뢰도 점검으로 읽으세요",
        description:
          "P2 감점은 곧바로 그린워싱 확정 판정이 아닙니다. 공개 출처가 충돌해 수동 검수가 필요할 때 적용하는 변수 단위 신뢰도 보정입니다.",
      },
      {
        title: "Full과 Limited 상태를 함께 보세요",
        description:
          "핵심 변수는 계산되지만 조건부 변수 일부가 비어 있는 경우 Limited Index가 붙을 수 있습니다. 점수 숫자만 보지 말고 산출 상태를 함께 해석해야 합니다.",
      },
      {
        title: "섹터 내 비교를 먼저 보세요",
        description:
          "중대 Scope 3와 CDP 기반 가중치가 산업군마다 다르기 때문에, 같은 섹터 안에서 먼저 비교하는 해석이 보통 더 정확합니다.",
      },
    ],
    faqTitle: "자주 묻는 질문",
    dimensions: [
      {
        title: "V1. Scope 1·2 배출 성과",
        description: "Scope 1·2 합산 배출집약도가 개선되는지와 절대배출이 최소한 늘지 않는지를 함께 봅니다.",
        bullets: [
          "가능하면 3개년 연환산 집약도 개선률을 사용합니다",
          "집약도가 좋아져도 절대배출이 늘면 점수가 깎입니다",
        ],
      },
      {
        title: "V2. 중대 Scope 3 공개·관리",
        description: "해당 산업군에서 중요한 Scope 3 카테고리를 정량 공개하고 관리하는지를 봅니다.",
        bullets: [
          "중대 카테고리는 기업이 속한 CERs 산업군에 따라 달라집니다",
          "명확한 비해당 사유가 있으면 해당 항목은 분모에서 제외합니다",
        ],
      },
      {
        title: "V3. 감축목표 설계 품질",
        description: "감축목표가 선언 수준이 아니라 실제로 추적 가능한 구조인지 확인합니다.",
        bullets: [
          "기준연도, 목표연도, 감축률, Scope 범위, 목표유형, 크레딧 투명성을 함께 봅니다",
          "총배출보다 순배출만 강조하는 넷제로 서술은 낮게 평가됩니다",
        ],
      },
      {
        title: "V4. 목표 대비 이행률·감축활동 증거",
        description: "실제 배출 성과가 공개한 감축 경로를 따라가고 있는지, 그리고 감축활동 근거가 있는지를 확인합니다.",
        bullets: [
          "기준연도에서 목표연도까지의 선형 경로와 현재 성과를 비교합니다",
          "활동명만 있는 선언보다 범위, 기간, 성과 근거가 있는 경우가 높게 평가됩니다",
        ],
      },
      {
        title: "V5. 기후 리스크·전환계획 식별",
        description: "물리적 위험, 전환위험, 기회, 시간범위, 재무영향, 전환수단, 진행상황을 실제 경영 언어로 인식하는지를 봅니다.",
        bullets: [
          "7개 공개 신호를 산술평균으로 합산합니다",
          "회사 맥락 없이 일반론만 반복하면 부분점수에 머뭅니다",
        ],
      },
      {
        title: "V6. 이사회 감독·책임·보상 연계",
        description: "기후 대응이 이사회 감독, 경영진 책임, 임원 보상체계와의 연계 근거까지 갖추고 있는지를 봅니다.",
        bullets: [
          "핵심 연결고리 하나가 빠지면 전체 점수가 약해지도록 기하평균을 사용합니다",
          "보상연계율이 아니라 기후 KPI와 임원보상체계의 연계 증거를 보는 변수입니다",
          "일반 ESG 감독만으로는 충분하지 않습니다",
        ],
      },
      {
        title: "V7. 자본배분·추적성",
        description: "전환투자 주장이 실제 CapEx 또는 금융업의 전환금융 배분과 연결되는지를 봅니다.",
        bullets: [
          "녹색 CapEx를 완벽히 추정하는 값이 아니라 전환투자 주장의 추적가능성을 보는 변수입니다",
          "녹색투자 주장만큼 DART나 재무제표와의 추적성이 중요합니다",
          "비해당이면 나머지 변수 가중치를 재정규화합니다",
        ],
      },
      {
        title: "V8. 배출량 산정·보고경계 투명성",
        description: "조직·운영·재무 경계와 산정 방법이 명확하게 맞물려 있는지를 확인합니다.",
        bullets: [
          "산정기준, 배출계수, Scope 2 방식, 재작성 공시까지 포함합니다",
          "경계 불일치는 P2 감점 사유가 되기도 합니다",
        ],
      },
      {
        title: "V9. 제3자 검증·데이터 신뢰성",
        description: "배출량과 핵심 기후정보가 독립적으로 검증됐는지, 어떤 수준이며 어떤 Scope를 덮는지를 봅니다.",
        bullets: [
          "검증 존재, 검증 수준, 검증 범위가 모두 필요합니다",
          "중대한 Scope 3가 있는 산업일수록 Scope 3 검증의 의미가 커집니다",
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
        question: "데이터가 없거나 미공시이면 어떻게 처리되나요?",
        answer:
          "원칙적으로 미공시는 0점 처리합니다. 다만 기업이 명확한 비해당 사유를 밝히면 분모에서 제외할 수 있고, 수집실패처럼 아직 확정할 수 없는 상태는 점수 확정을 보류해야 합니다.",
      },
      {
        question: "기후 서술이 좋아 보여도 점수가 높지 않을 수 있나요?",
        answer:
          "그럴 수 있습니다. V1, V4, V7, V8, V9처럼 실제 운영 근거가 필요한 변수 비중이 크고, 공적 자료와 충돌하는 주장은 P2로 다시 감점되기 때문입니다.",
      },
      {
        question: "왜 가중치를 사람이 정하지 않나요?",
        answer:
          "현재 방법론은 주관적 고정값 대신 CDP 2025 Climate Change 질문 매핑과 Management 및 Leadership denominator를 이용해 W_v,g를 계산합니다.",
      },
      {
        question: "탄소크레딧은 별도 점수로 들어가나요?",
        answer:
          "아닙니다. 탄소크레딧 의존도는 독립 변수로 보너스나 패널티를 주지 않고, V3의 크레딧 투명성 항목 안에서 총배출 대비 순배출 목표 설계와 함께 평가합니다.",
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
    scoreMeaningTitle: "気候移行信頼性を見る公開指標",
    scoreMeaningDescription:
      "このスコアは公開された気候根拠を 1 から 100 の移行信頼性指標に変換し、排出実績、目標品質、ガバナンス、資本配分の追跡可能性、報告境界、保証水準を合わせて示します。",
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
    eyebrow: "スコアについて",
    title: "スコアはどう作られるのか",
    description:
      "CERs Index は CDP に整合した公開資料ベースの気候移行信頼性インデックスです。このページでは何を見るのか、そして最終スコアがどのような構成で作られるのかを説明します。",
    logicCta: "ロジック詳細を見る",
    logicCtaHint: "全体式、変数、重み付け構造を詳しく見ます。",
    backToOverview: "スコア概要へ戻る",
    formulaTitle: "現在の CERs Index 全体式",
    formulaDescription:
      "公開スコアは3段階で作られます。まず各変数を採点し、出所が衝突した場合は P2 信頼性係数を適用し、その後に加重内部スコアを 1 から 100 の CERs Index に変換します。clamp の段階は負の点数や過大なボーナスを防ぎながら表示範囲を固定します。",
    formulaSteps: [
      {
        id: "adjusted",
        title: "1. 信頼性補正後の変数スコア",
        formula: "S_{\\mathrm{adjusted},v} = S_v \\times K_{\\mathrm{P2},v}",
      },
      {
        id: "total",
        title: "2. 加重内部スコア",
        formula: "S_{\\mathrm{total}}(i,t) = \\sum_v W_{v,g(i)} \\times S_{\\mathrm{adjusted}}(v,i,t)",
      },
      {
        id: "index",
        title: "3. 公開 CERs Index",
        formula: "\\mathrm{CERs\\ Index}(i,t) = 1 + 99 \\times \\operatorname{clamp}(S_{\\mathrm{total}}(i,t), 0, 1)",
      },
    ],
    formulaDefinitionsTitle: "記号の意味",
    formulaDefinitions: [
      { key: "S_v", label: "V1 から V9 の生スコアで、0 から 1 の範囲で計算されます" },
      {
        key: "K_P2,v",
        label: "報告書の主張が GIR、DART、保証根拠と食い違うときに適用する信頼性係数です",
      },
      {
        key: "W_v,g",
        label: "CDP 2025 Climate Change の質問マッピングから導く業種別の変数重みです",
      },
      { key: "g(i)", label: "企業 i に割り当てられた CERs 業種グループです" },
    ],
    formulaNoteLabel: "方法論メモ",
    formulaNote:
      "CDP が現在方法論の主要な骨格です。変数が明確に非該当なら、その分母を外して残りの重みを再正規化します。P1 は独立変数ではなく、炭素クレジット依存は V3 のクレジット透明性に吸収されます。",
    meaningTitle: "このスコアの目的",
    meaningDescription:
      "CERs Index は ESG 全体格付けではありません。公開資料を基に、実際の排出削減、目標設計、ガバナンス、資本配分、報告境界、保証水準が公的根拠と整合しているかを示す気候移行信頼性インデックスです。",
    meaningPoints: [
      "サステナビリティレポート、DART、KRX ESG、GIR、保証意見書を中心とした公開根拠を 9 変数で採点します",
      "ESG の宣伝文句や炭素クレジット価値ではなく、気候移行信頼性と炭素リスク対応水準を示します",
      "重みは恣意的に決めず、CDP 2025 Climate Change の Management と Leadership denominator を基に業種別で計算します",
      "MSCI は生スコア式ではなく、業種別解釈を助ける exposure-management の補助フレームとしてのみ使います",
      "報告書の主張が GIR、DART、保証根拠と食い違う場合は、P2 係数で該当変数の点数を下げます",
    ],
    logicTitle: "現在のスコアはこの流れで作られます",
    logicDescription:
      "現在の方法論では、まず V1 から V9 を採点し、出所不一致のある変数に P2 係数を反映したうえで、業種別の加重内部合計を公開用の 1 から 100 の CERs Index に変換します。",
    logicSteps: [
      {
        title: "公開根拠から V1 から V9 を採点する",
        description:
          "各変数は v0.3 ルールに従って 0 から 1 に正規化され、排出実績、目標設計、移行計画、ガバナンス、投資追跡性、境界透明性、保証水準を見ます。",
      },
      {
        title: "出所が衝突したら P2 信頼性補正をかける",
        description:
          "主要数値が報告書、GIR、DART、保証意見書の間で食い違う場合、その変数は額面通りに採らず K_P2,v を掛けて信頼度を下げます。",
      },
      {
        title: "業種別の変数重みを計算する",
        description:
          "W_v,g は手作業で固定する値ではなく、CERs 業種グループごとの CDP 2025 Climate Change 質問マッピングと Management / Leadership denominator から算出されます。",
      },
      {
        title: "内部合計を公開スコアへ変換する",
        description:
          "加重合計の内部スコアを 0 から 1 に収め、1 + 99 × clamp(...) の式で画面に表示する CERs Index に変換します。",
      },
    ],
    dimensionsTitle: "現在の9変数は何を見るか",
    dimensionsDescription:
      "現在の v0.3 公開スコアは以下の 9 変数で構成されます。一部の変数は非該当として扱われ重みが再正規化されることがありますが、指数はこの集合を軸に計算されます。",
    roadmapTitle: "ロードマップの見方",
    industryTitle: "なぜ業種比較が重要か",
    industryDescription:
      "業種文脈は解釈の補助ではなく、式そのものに入っています。重要 Scope 3 カテゴリと W_v,g の両方が CERs 業種グループに依存するため、同じ開示でもセクターによって意味が変わります。",
    readingTitle: "結果はこう読むのが有効です",
    readingCards: [
      {
        title: "1 から 100 の値は変換後の表示値として読む",
        description:
          "画面上の値は単純な百分率ではなく、1 + 99 × clamp(S_total, 0, 1) の変換値です。したがって変動は加重内部合計の動きとして読むべきです。",
      },
      {
        title: "P2 は信頼性チェックとして読む",
        description:
          "P2 の減点は直ちにグリーンウォッシング認定を意味しません。公開出所が食い違い、手動レビューが必要なときに使う変数単位の信頼性補正です。",
      },
      {
        title: "Full と Limited の状態も確認する",
        description:
          "中核変数は計算できても、条件付き変数の一部が欠けると Limited Index になることがあります。数値だけでなく算出状態も合わせて読む必要があります。",
      },
      {
        title: "まずセクター内比較を見る",
        description:
          "重要 Scope 3 と CDP ベース重みは業種グループごとに異なるため、同一セクター内の比較から読むほうが通常は正確です。",
      },
    ],
    faqTitle: "FAQ",
    dimensions: [
      {
        title: "V1. Scope 1・2 排出実績",
        description: "Scope 1・2 合算の排出原単位が改善しているか、かつ絶対排出が少なくとも増えていないかを見ます。",
        bullets: [
          "可能なら 3 年の年率換算改善率を使います",
          "原単位が改善しても絶対排出が増えれば減点されます",
        ],
      },
      {
        title: "V2. 重要 Scope 3 の開示・管理",
        description: "その業種グループで重要な Scope 3 カテゴリを定量開示し、管理しているかを見ます。",
        bullets: [
          "重要カテゴリは企業が属する CERs 業種グループで変わります",
          "明確な非該当理由があればその項目は分母から外れます",
        ],
      },
      {
        title: "V3. 削減目標の設計品質",
        description: "削減目標が単なる宣言ではなく、実際に追跡できる構造になっているかを確認します。",
        bullets: [
          "基準年、目標年、削減率、Scope 範囲、目標タイプ、クレジット透明性を見ます",
          "総排出より純排出だけを強調するネットゼロ表現は低く評価されます",
        ],
      },
      {
        title: "V4. 目標経路に対する進捗と削減施策の証拠",
        description: "実際の排出実績が公表した削減経路をたどっているか、具体的な削減施策の証拠があるかを確認します。",
        bullets: [
          "基準年から目標年までの線形経路と現在実績を比較します",
          "施策名だけの宣言より、範囲、期間、成果根拠があるほうが高く評価されます",
        ],
      },
      {
        title: "V5. 気候リスク・移行計画の識別",
        description: "物理リスク、移行リスク、機会、時間軸、財務影響、移行手段、進捗状況を実際の経営言語で認識しているかを見ます。",
        bullets: [
          "7 つの公開シグナルを算術平均でまとめます",
          "企業文脈のない一般論だけでは部分点にとどまります",
        ],
      },
      {
        title: "V6. 取締役会監督・責任・報酬連動",
        description: "気候対応が取締役会監督、経営責任、役員報酬体系との連結根拠まで備えているかを見ます。",
        bullets: [
          "重要な連結のどれかが欠けると全体が弱くなるよう幾何平均を使います",
          "報酬連動率ではなく、気候 KPI と役員報酬体系の連結証拠を見る変数です",
          "一般的な ESG 監督だけでは不十分です",
        ],
      },
      {
        title: "V7. 資本配分と追跡可能性",
        description: "移行投資の主張が、実際の CapEx あるいは金融業なら移行金融配分に結び付いているかを見ます。",
        bullets: [
          "グリーン CapEx を完全に推計する値ではなく、移行投資主張の追跡可能性を見る変数です",
          "グリーン投資の主張と同じくらい DART や財務諸表との追跡可能性が重要です",
          "非該当なら残りの変数重みを再正規化します",
        ],
      },
      {
        title: "V8. 排出算定・報告境界の透明性",
        description: "組織、運営、財務の境界と算定方法が明確に整合しているかを確認します。",
        bullets: [
          "算定基準、排出係数、Scope 2 方式、再記載開示まで含みます",
          "境界不一致は P2 減点理由にもなります",
        ],
      },
      {
        title: "V9. 第三者保証・データ信頼性",
        description: "排出量と主要な気候情報が独立に保証されているか、どの水準で、どの Scope を覆うかを見ます。",
        bullets: [
          "保証の有無、保証水準、保証範囲がすべて必要です",
          "重要 Scope 3 を持つ業種ほど Scope 3 保証の意味が大きくなります",
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
        question: "データがない、または未開示の場合はどう処理されますか？",
        answer:
          "原則として未開示は 0 点です。ただし企業が明確な非該当理由を示せば分母から外せますし、収集失敗のように未確定な状態は確定スコアにすべきではありません。",
      },
      {
        question: "気候ストーリーが強く見えても点数が高くないことはありますか？",
        answer:
          "あります。V1、V4、V7、V8、V9 のように実運用の根拠を要する変数の比重が大きく、公的資料と衝突する主張は P2 でさらに減点されるためです。",
      },
      {
        question: "なぜ重みを人が固定しないのですか？",
        answer:
          "現在の方法論では、主観的な固定値ではなく、CDP 2025 Climate Change の質問マッピングと Management / Leadership denominator を使って W_v,g を計算するためです。",
      },
      {
        question: "炭素クレジットは独立した点数として入りますか？",
        answer:
          "いいえ。炭素クレジット依存は独立変数のボーナスやペナルティではなく、V3 のクレジット透明性項目の中で、総排出と純排出の目標設計と合わせて評価されます。",
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
