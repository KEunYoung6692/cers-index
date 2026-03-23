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
    industries: "Industries",
    about: "About the Score",
  },
  alerts: {
    fallbackSampleData: "Showing fallback sample data.",
  },
  common: {
    score: "Score",
    averageScore: "Average score",
    avgScore: "Avg score",
    weightedContribution: "Weighted contribution",
    viewDetails: "View details",
    backToCompanies: "Back to companies",
    backToIndustries: "Back to industries",
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
      "CERs Index helps non-experts see whether a company is actually reducing emissions, how credible its targets look, and how it compares with peers in the same industry.",
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
    industryEyebrow: "Industry View",
    industryTitle: "Explore by industry",
    seeAllIndustries: "See all industries",
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
    industry: "Industry",
    allIndustries: "All industries",
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
    eyebrow: "Industries",
    title: "Explore climate performance by industry",
    description:
      "Use industry context to understand where a company stands relative to peers facing similar transition conditions.",
    searchPlaceholder: "Search industries...",
    filterAll: "All industries",
    filterHigh: "High performers",
    filterModerate: "Moderate performers",
    filterTransitioning: "Transitioning",
    noResults: "No industries match the current filters.",
  },
  industryDetail: {
    eyebrow: "Industry detail",
    scoreDistribution: "Score distribution",
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
    industryComparison: "Industry comparison",
    industryAverage: "Industry average",
    aboveAverage:
      "This company is above the current industry average. This view is designed to show relative transition quality within a comparable operating context.",
    belowAverage:
      "This company is near or below the current industry average. This view is designed to show relative transition quality within a comparable operating context.",
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
    title: "A simpler way to understand carbon reduction quality",
    description:
      "CERs Index is built to help users understand whether a company is truly reducing emissions, whether its targets are credible, and whether there is enough evidence behind the story.",
    meaningTitle: "What the score means",
    meaningDescription:
      "The score is a compact public-facing summary. It is not meant to replace a full diligence process, but it gives users a fast starting point for comparing transition quality across companies.",
    roadmapTitle: "How to read the roadmap",
    industryTitle: "Why industry comparison matters",
    industryDescription:
      "Different industries face different transition conditions. Industry comparison helps users distinguish between companies operating in similar carbon and capital environments, instead of reading every score in isolation.",
    faqTitle: "FAQ",
    dimensions: [
      {
        title: "Actual Reduction Performance",
        description: "Whether reported emissions are really moving in the right direction relative to business activity.",
        bullets: [
          "Recent emissions performance",
          "Progress against a base year or reference point",
          "Whether intensity is improving in a durable way",
        ],
      },
      {
        title: "Target Clarity",
        description: "Whether a company has clear, time-bound targets that can be linked to a credible reduction pathway.",
        bullets: [
          "Stated target year and reduction level",
          "Whether targets cover relevant scopes",
          "Visibility of interim milestones and net zero ambition",
        ],
      },
      {
        title: "Execution Readiness",
        description: "Whether plans are supported by investment decisions, governance, and real operating follow-through.",
        bullets: [
          "Green capex direction",
          "Decision tools such as internal carbon pricing",
          "How transition plans connect to execution",
        ],
      },
      {
        title: "Disclosure Level",
        description: "How much confidence users can place in the reported transition story based on evidence and assurance.",
        bullets: [
          "Quality of supporting disclosure",
          "Scope 3 visibility",
          "Third-party assurance signals",
        ],
      },
    ],
    roadmapCards: [
      {
        title: "Current emissions",
        description: "The stacked bar shows the latest reported Scope 1 and Scope 2 emissions used in the current profile.",
      },
      {
        title: "Target point",
        description: "The target bar shows the next public reduction milestone when an explicit target point is available.",
      },
      {
        title: "Net zero milestone",
        description: "The line then extends to the declared net zero year, making the stated long-term path easy to scan.",
      },
    ],
    faqs: [
      {
        question: "Why is this score public-friendly instead of methodology-heavy?",
        answer:
          "The product is designed for general users. It simplifies a deeper scoring system into a view that is faster to scan and easier to compare.",
      },
      {
        question: "Why don’t I see long score trend charts everywhere?",
        answer:
          "The current product prioritizes the latest comparable company view. Historical context appears only where it helps explain the roadmap.",
      },
      {
        question: "Does the score only reward target announcements?",
        answer:
          "No. Public targets matter, but the framework also checks execution readiness, disclosure quality, and actual emissions performance.",
      },
      {
        question: "How should I read the roadmap chart?",
        answer:
          "Read it as a compact pathway view: current reported emissions, the next public target point, and the stated net zero milestone.",
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
    industries: "산업",
    about: "점수 소개",
  },
  alerts: {
    fallbackSampleData: "샘플 데이터를 표시하고 있습니다.",
  },
  common: {
    score: "점수",
    averageScore: "평균 점수",
    avgScore: "평균 점수",
    weightedContribution: "가중 기여도",
    viewDetails: "상세 보기",
    backToCompanies: "기업 목록으로",
    backToIndustries: "산업 목록으로",
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
      "CERs Index는 비전문가도 기업이 실제로 배출을 줄이고 있는지, 목표가 얼마나 신뢰할 만한지, 같은 산업 내 경쟁사와 비교해 어떤 위치인지 빠르게 이해할 수 있도록 돕습니다.",
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
    industryEyebrow: "산업별 보기",
    industryTitle: "산업별로 살펴보기",
    seeAllIndustries: "전체 산업 보기",
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
    industry: "산업",
    allIndustries: "전체 산업",
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
    eyebrow: "산업",
    title: "산업별 기후 성과 살펴보기",
    description: "같은 전환 환경을 가진 동종 기업과 비교해 기업의 위치를 이해할 수 있습니다.",
    searchPlaceholder: "산업 검색...",
    filterAll: "전체 산업",
    filterHigh: "상위 산업",
    filterModerate: "중간 수준 산업",
    filterTransitioning: "전환 중 산업",
    noResults: "현재 필터에 맞는 산업이 없습니다.",
  },
  industryDetail: {
    eyebrow: "산업 상세",
    scoreDistribution: "점수 분포",
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
    industryComparison: "산업 비교",
    industryAverage: "산업 평균",
    aboveAverage:
      "이 기업은 현재 산업 평균보다 높습니다. 이 뷰는 비슷한 운영 환경 안에서 상대적인 전환 품질을 보여주기 위한 것입니다.",
    belowAverage:
      "이 기업은 현재 산업 평균 수준이거나 그보다 낮습니다. 이 뷰는 비슷한 운영 환경 안에서 상대적인 전환 품질을 보여주기 위한 것입니다.",
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
    title: "탄소감축 수준을 더 쉽게 이해하는 방법",
    description:
      "CERs Index는 기업이 실제로 배출을 줄이고 있는지, 목표가 신뢰할 만한지, 그리고 그 주장을 뒷받침할 근거가 충분한지 이해할 수 있도록 설계되었습니다.",
    meaningTitle: "점수의 의미",
    meaningDescription:
      "이 점수는 일반 사용자용으로 압축한 요약 지표입니다. 정밀 실사 전체를 대체하지는 않지만, 기업 간 전환 품질을 빠르게 비교하기 위한 출발점을 제공합니다.",
    roadmapTitle: "로드맵 읽는 법",
    industryTitle: "왜 산업 비교가 중요한가",
    industryDescription:
      "산업마다 전환 조건이 다릅니다. 산업 비교는 모든 점수를 개별적으로 읽는 대신, 비슷한 탄소·자본 환경에서 운영되는 기업끼리 구분할 수 있게 돕습니다.",
    faqTitle: "자주 묻는 질문",
    dimensions: [
      {
        title: "실질 감축 성과",
        description: "보고된 배출량이 실제 사업 활동 대비 올바른 방향으로 움직이고 있는지를 봅니다.",
        bullets: ["최근 배출 성과", "기준연도 대비 진전", "집약도 개선이 지속되는지 여부"],
      },
      {
        title: "목표 명확성",
        description: "회사 목표가 시한과 수치가 명확하고, 신뢰할 수 있는 감축 경로와 연결되는지를 봅니다.",
        bullets: ["목표 연도와 감축 수준", "관련 범위를 충분히 포함하는지", "중간 목표와 넷제로 비전의 가시성"],
      },
      {
        title: "실행 준비도",
        description: "계획이 투자 의사결정, 거버넌스, 실제 운영 실행으로 이어지고 있는지를 봅니다.",
        bullets: ["그린 CAPEX 방향", "내부탄소가격 등 의사결정 도구", "전환 계획과 실행의 연결성"],
      },
      {
        title: "공시 수준",
        description: "근거와 검증 수준을 바탕으로 보고된 전환 스토리를 얼마나 신뢰할 수 있는지 봅니다.",
        bullets: ["근거 공시의 품질", "스코프 3 가시성", "제3자 검증 신호"],
      },
    ],
    roadmapCards: [
      {
        title: "현재 배출량",
        description: "누적 막대는 현재 프로필에 사용된 최신 스코프 1, 스코프 2 배출량을 보여줍니다.",
      },
      {
        title: "목표 지점",
        description: "목표 막대는 명시적 목표가 있을 때 다음 공개 감축 마일스톤을 보여줍니다.",
      },
      {
        title: "넷제로 마일스톤",
        description: "이후 선은 선언된 넷제로 연도까지 이어져 장기 경로를 쉽게 파악하게 해줍니다.",
      },
    ],
    faqs: [
      {
        question: "왜 방법론 중심이 아니라 일반 사용자 친화적인 점수인가요?",
        answer: "이 제품은 일반 사용자를 대상으로 설계되었습니다. 더 깊은 점수 체계를 더 빠르게 훑고 쉽게 비교할 수 있는 형태로 단순화했습니다.",
      },
      {
        question: "왜 긴 점수 추이 차트가 여기저기 보이지 않나요?",
        answer: "현재 제품은 최신 비교 가능한 회사 뷰를 우선합니다. 과거 맥락은 로드맵 설명에 도움이 되는 경우에만 제한적으로 표시합니다.",
      },
      {
        question: "이 점수는 목표 선언만 높게 평가하나요?",
        answer: "아닙니다. 공개 목표는 중요하지만, 실행 준비도, 공시 품질, 실제 배출 성과도 함께 봅니다.",
      },
      {
        question: "로드맵 차트는 어떻게 읽으면 되나요?",
        answer: "현재 보고 배출량, 다음 공개 목표 지점, 선언된 넷제로 시점을 한 번에 보여주는 압축 경로 뷰로 읽으면 됩니다.",
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
    industries: "業種",
    about: "スコアについて",
  },
  alerts: {
    fallbackSampleData: "サンプルデータを表示しています。",
  },
  common: {
    score: "スコア",
    averageScore: "平均スコア",
    avgScore: "平均スコア",
    weightedContribution: "加重寄与度",
    viewDetails: "詳細を見る",
    backToCompanies: "企業一覧へ戻る",
    backToIndustries: "業種一覧へ戻る",
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
      "CERs Index は、企業が実際に排出量を減らしているか、目標にどの程度信頼性があるか、同業他社と比べてどこに位置するかを、非専門家でもすばやく理解できるようにします。",
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
    industryEyebrow: "業種ビュー",
    industryTitle: "業種別に見る",
    seeAllIndustries: "すべての業種を見る",
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
    industry: "業種",
    allIndustries: "すべての業種",
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
    eyebrow: "業種",
    title: "業種別の気候パフォーマンスを見る",
    description: "似た移行条件にある同業他社との比較を通じて、企業の位置づけを理解できます。",
    searchPlaceholder: "業種を検索...",
    filterAll: "すべての業種",
    filterHigh: "高パフォーマンス",
    filterModerate: "中程度",
    filterTransitioning: "移行中",
    noResults: "現在の条件に一致する業種はありません。",
  },
  industryDetail: {
    eyebrow: "業種詳細",
    scoreDistribution: "スコア分布",
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
    industryComparison: "業種比較",
    industryAverage: "業種平均",
    aboveAverage:
      "この企業は現在の業種平均を上回っています。このビューは、近い事業条件の中で相対的な移行品質を示すためのものです。",
    belowAverage:
      "この企業は現在の業種平均付近、またはそれ以下です。このビューは、近い事業条件の中で相対的な移行品質を示すためのものです。",
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
    title: "炭素削減の質をよりシンプルに理解する方法",
    description:
      "CERs Index は、企業が本当に排出量を減らしているか、目標に信頼性があるか、そのストーリーを支える根拠が十分にあるかを理解するために設計されています。",
    meaningTitle: "スコアの意味",
    meaningDescription:
      "このスコアは一般向けに圧縮した公開サマリーです。完全なデューデリジェンスの代替ではありませんが、企業間の移行品質を比較するための素早い出発点になります。",
    roadmapTitle: "ロードマップの見方",
    industryTitle: "なぜ業種比較が重要か",
    industryDescription:
      "業種ごとに移行条件は異なります。業種比較により、すべてのスコアを個別に読むのではなく、似た炭素・資本環境にある企業同士を見分けやすくなります。",
    faqTitle: "FAQ",
    dimensions: [
      {
        title: "実際の削減実績",
        description: "報告された排出量が、事業活動に対して本当に望ましい方向へ動いているかを見ます。",
        bullets: ["最近の排出実績", "基準年比の進捗", "原単位改善が持続的かどうか"],
      },
      {
        title: "目標の明確さ",
        description: "企業の目標が期限と数値を伴い、信頼できる削減経路と結び付いているかを見ます。",
        bullets: ["目標年と削減水準", "関連範囲を十分に含むか", "中間目標とネットゼロの可視性"],
      },
      {
        title: "実行準備度",
        description: "計画が投資判断、ガバナンス、実際の運用に結び付いているかを見ます。",
        bullets: ["グリーン CAPEX の方向性", "内部炭素価格などの意思決定ツール", "移行計画と実行の接続"],
      },
      {
        title: "開示水準",
        description: "根拠と保証に基づいて、報告された移行ストーリーをどこまで信頼できるかを見ます。",
        bullets: ["裏付け開示の質", "スコープ3の可視性", "第三者保証シグナル"],
      },
    ],
    roadmapCards: [
      {
        title: "現在の排出量",
        description: "積み上げ棒は現在のプロフィールに使われる最新のスコープ1・2排出量を示します。",
      },
      {
        title: "目標ポイント",
        description: "目標棒は、明示的な目標がある場合に次の公開削減マイルストーンを示します。",
      },
      {
        title: "ネットゼロの到達点",
        description: "その後、線が宣言されたネットゼロ年まで伸び、長期経路を簡単に把握できます。",
      },
    ],
    faqs: [
      {
        question: "なぜ方法論中心ではなく、一般ユーザー向けのスコアなのですか？",
        answer:
          "この製品は一般ユーザー向けに設計されています。より深い採点体系を、素早く見て比較しやすい形に簡略化しています。",
      },
      {
        question: "なぜ長いスコア推移チャートが至る所にないのですか？",
        answer:
          "現在の製品は、最新で比較可能な企業ビューを優先しています。過去の文脈は、ロードマップの説明に役立つ場合にのみ限定して表示します。",
      },
      {
        question: "このスコアは目標公表だけを評価するのですか？",
        answer:
          "いいえ。公開目標は重要ですが、実行準備度、開示品質、実際の排出実績も合わせて見ます。",
      },
      {
        question: "ロードマップチャートはどう読めばよいですか？",
        answer:
          "現在報告されている排出量、次の公開目標ポイント、宣言されたネットゼロ時点を一つのコンパクトな経路として読むと分かりやすいです。",
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
