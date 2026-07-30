import { getIntlLocale, getTranslations, type SupportedLocale } from "./i18n";
import type {
  CersCategoryMeta,
  CersCategoryScore,
  CersCompanyProfile,
  CersDashboardData,
  CersDisclosureSummary,
  CersIndustryFocusPoint,
  CersIndustrySummary,
  CersTargetSummary,
} from "./types";

type PublicCategorySeed = {
  code: string;
  label: string;
};

const PUBLIC_CATEGORY_LABELS: Record<SupportedLocale, PublicCategorySeed[]> = {
  en: [
    { code: "cat1", label: "Realized Decarbonization" },
    { code: "cat2", label: "Target Design & Delivery" },
    { code: "cat3", label: "Capital Allocation" },
    { code: "cat4", label: "Data Credibility" },
  ],
  ko: [
    { code: "cat1", label: "실질 탈탄소 성과" },
    { code: "cat2", label: "감축 목표 및 이행" },
    { code: "cat3", label: "자본배분" },
    { code: "cat4", label: "데이터 신뢰성" },
  ],
  ja: [
    { code: "cat1", label: "実質的な脱炭素成果" },
    { code: "cat2", label: "削減目標と履行" },
    { code: "cat3", label: "資本配分" },
    { code: "cat4", label: "データ信頼性" },
  ],
  zh: [
    { code: "cat1", label: "实际脱碳表现" },
    { code: "cat2", label: "目标设计与执行" },
    { code: "cat3", label: "资本配置" },
    { code: "cat4", label: "数据可信度" },
  ],
  vi: [
    { code: "cat1", label: "Khử carbon thực tế" },
    { code: "cat2", label: "Thiết kế và thực hiện mục tiêu" },
    { code: "cat3", label: "Phân bổ vốn" },
    { code: "cat4", label: "Độ tin cậy dữ liệu" },
  ],
  ru: [
    { code: "cat1", label: "Фактическая декарбонизация" },
    { code: "cat2", label: "Цели и их выполнение" },
    { code: "cat3", label: "Распределение капитала" },
    { code: "cat4", label: "Надёжность данных" },
  ],
  id: [
    { code: "cat1", label: "Dekarbonisasi terealisasi" },
    { code: "cat2", label: "Desain dan pelaksanaan target" },
    { code: "cat3", label: "Alokasi modal" },
    { code: "cat4", label: "Kredibilitas data" },
  ],
  th: [
    { code: "cat1", label: "การลดคาร์บอนที่เกิดขึ้นจริง" },
    { code: "cat2", label: "การออกแบบและดำเนินการตามเป้าหมาย" },
    { code: "cat3", label: "การจัดสรรเงินทุน" },
    { code: "cat4", label: "ความน่าเชื่อถือของข้อมูล" },
  ],
  bn: [
    { code: "cat1", label: "বাস্তব ডিকার্বনাইজেশন" },
    { code: "cat2", label: "লক্ষ্য নকশা ও বাস্তবায়ন" },
    { code: "cat3", label: "মূলধন বণ্টন" },
    { code: "cat4", label: "ডেটার বিশ্বাসযোগ্যতা" },
  ],
  es: [
    { code: "cat1", label: "Descarbonización realizada" },
    { code: "cat2", label: "Diseño y ejecución de objetivos" },
    { code: "cat3", label: "Asignación de capital" },
    { code: "cat4", label: "Credibilidad de los datos" },
  ],
};

function titleCase(input: string) {
  return input
    .split(" ")
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join(" ");
}

function normalizeScopeCode(value: string | null | undefined) {
  return (value || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "_");
}

function getLocalizedScopeToken(index: 1 | 2 | 3, locale: SupportedLocale) {
  if (locale === "ko") return `스코프 ${index}`;
  if (locale === "ja") return `スコープ${index}`;
  return `Scope ${index}`;
}

function getPartialScope3Label(locale: SupportedLocale) {
  if (locale === "ko") return "스코프 1 + 2 + 일부 3";
  if (locale === "ja") return "スコープ1 + 2 + 一部3";
  return "Scope 1 + 2 + Partial 3";
}

const SECTOR_LABELS_BY_LOCALE: Record<SupportedLocale, Record<string, string>> = {
  en: {
    PWR: "Power & Heat Supply",
    ENR: "Resources & Refining Energy",
    PRM: "Process Materials",
    EEM: "Electrical & Electronics Manufacturing",
    IMS: "Industrial Machinery & Systems",
    MOV: "Transport Operations",
    MFG: "Transport Equipment",
    CST: "Construction",
    AST: "Real Estate Operations",
    BIO: "Agri-Food & Forest Bio",
    CON: "Consumer Goods & Retail",
    DNS: "Digital & Network Services",
    HLC: "Health Care",
    FNC: "Financial Capital",
  },
  ko: {
    PWR: "전원·열공급",
    ENR: "자원·정유에너지",
    PRM: "공정소재",
    EEM: "전기·전자제조",
    IMS: "산업기계·시스템",
    MOV: "운송운영",
    MFG: "운송기기",
    CST: "건설시공",
    AST: "부동산운영",
    BIO: "농식품·산림바이오",
    CON: "생활소비재·유통",
    DNS: "디지털·네트워크",
    HLC: "헬스·케어",
    FNC: "금융·자본",
  },
  ja: {
    PWR: "電力・熱供給",
    ENR: "資源・精製エネルギー",
    PRM: "工程素材",
    EEM: "電機・電子製造",
    IMS: "産業機械・システム",
    MOV: "輸送運営",
    MFG: "輸送機器",
    CST: "建設施工",
    AST: "不動産運営",
    BIO: "農食品・森林バイオ",
    CON: "生活消費財・流通",
    DNS: "デジタル・ネットワーク",
    HLC: "ヘルスケア",
    FNC: "金融・資本",
  },
  zh: {
    PWR: "电力与热力供应",
    ENR: "资源与炼化能源",
    PRM: "工艺材料",
    EEM: "电气与电子制造",
    IMS: "工业机械与系统",
    MOV: "运输运营",
    MFG: "交通设备",
    CST: "建筑施工",
    AST: "房地产运营",
    BIO: "农业食品与林业生物",
    CON: "消费品与零售",
    DNS: "数字与网络服务",
    HLC: "医疗保健",
    FNC: "金融资本",
  },
  vi: {
    PWR: "Cung cấp điện và nhiệt",
    ENR: "Tài nguyên và năng lượng lọc hóa",
    PRM: "Vật liệu quy trình",
    EEM: "Sản xuất điện và điện tử",
    IMS: "Máy móc và hệ thống công nghiệp",
    MOV: "Vận hành vận tải",
    MFG: "Thiết bị vận tải",
    CST: "Xây dựng",
    AST: "Vận hành bất động sản",
    BIO: "Nông thực phẩm và lâm nghiệp sinh học",
    CON: "Hàng tiêu dùng và bán lẻ",
    DNS: "Dịch vụ số và mạng",
    HLC: "Chăm sóc sức khỏe",
    FNC: "Tài chính và vốn",
  },
  ru: {
    PWR: "Электро- и теплоснабжение",
    ENR: "Ресурсы и нефтепереработка",
    PRM: "Промышленные материалы",
    EEM: "Электротехническое и электронное производство",
    IMS: "Промышленное оборудование и системы",
    MOV: "Транспортные операции",
    MFG: "Транспортное машиностроение",
    CST: "Строительство",
    AST: "Управление недвижимостью",
    BIO: "Агропродовольствие и лесное хозяйство",
    CON: "Потребительские товары и розница",
    DNS: "Цифровые и сетевые услуги",
    HLC: "Здравоохранение",
    FNC: "Финансы и капитал",
  },
  id: {
    PWR: "Pasokan listrik dan panas",
    ENR: "Sumber daya dan energi pemurnian",
    PRM: "Material proses",
    EEM: "Manufaktur listrik dan elektronik",
    IMS: "Mesin dan sistem industri",
    MOV: "Operasi transportasi",
    MFG: "Peralatan transportasi",
    CST: "Konstruksi",
    AST: "Operasi real estat",
    BIO: "Agropangan dan bio-kehutanan",
    CON: "Barang konsumsi dan ritel",
    DNS: "Layanan digital dan jaringan",
    HLC: "Layanan kesehatan",
    FNC: "Keuangan dan modal",
  },
  th: {
    PWR: "การจ่ายไฟฟ้าและความร้อน",
    ENR: "ทรัพยากรและพลังงานจากการกลั่น",
    PRM: "วัสดุกระบวนการ",
    EEM: "การผลิตไฟฟ้าและอิเล็กทรอนิกส์",
    IMS: "เครื่องจักรและระบบอุตสาหกรรม",
    MOV: "การดำเนินงานขนส่ง",
    MFG: "อุปกรณ์ขนส่ง",
    CST: "การก่อสร้าง",
    AST: "การดำเนินงานอสังหาริมทรัพย์",
    BIO: "เกษตรอาหารและชีวภาพป่าไม้",
    CON: "สินค้าอุปโภคบริโภคและค้าปลีก",
    DNS: "บริการดิจิทัลและเครือข่าย",
    HLC: "การดูแลสุขภาพ",
    FNC: "การเงินและเงินทุน",
  },
  bn: {
    PWR: "বিদ্যুৎ ও তাপ সরবরাহ",
    ENR: "সম্পদ ও পরিশোধন জ্বালানি",
    PRM: "প্রক্রিয়াজাত উপকরণ",
    EEM: "বৈদ্যুতিক ও ইলেকট্রনিক উৎপাদন",
    IMS: "শিল্প যন্ত্রপাতি ও ব্যবস্থা",
    MOV: "পরিবহন পরিচালনা",
    MFG: "পরিবহন সরঞ্জাম",
    CST: "নির্মাণ",
    AST: "রিয়েল এস্টেট পরিচালনা",
    BIO: "কৃষি-খাদ্য ও বনজ জীবসম্পদ",
    CON: "ভোক্তা পণ্য ও খুচরা",
    DNS: "ডিজিটাল ও নেটওয়ার্ক সেবা",
    HLC: "স্বাস্থ্যসেবা",
    FNC: "অর্থ ও মূলধন",
  },
  es: {
    PWR: "Suministro de electricidad y calor",
    ENR: "Recursos y energía de refino",
    PRM: "Materiales de proceso",
    EEM: "Fabricación eléctrica y electrónica",
    IMS: "Maquinaria y sistemas industriales",
    MOV: "Operaciones de transporte",
    MFG: "Equipos de transporte",
    CST: "Construcción",
    AST: "Operaciones inmobiliarias",
    BIO: "Agroalimentación y bioeconomía forestal",
    CON: "Bienes de consumo y comercio minorista",
    DNS: "Servicios digitales y de red",
    HLC: "Atención sanitaria",
    FNC: "Finanzas y capital",
  },
};

function translateAssuranceType(assuranceType: string | null | undefined, locale: SupportedLocale) {
  const normalized = (assuranceType || "").toLowerCase();
  if (!normalized) return null;
  if (["unknown", "n/a", "na", "none", "null", "not_disclosed", "undisclosed"].includes(normalized)) return null;

  if (normalized.includes("reasonable")) {
    if (locale === "ko") return "합리적 수준";
    if (locale === "ja") return "合理的";
    return "Reasonable";
  }
  if (normalized.includes("limited")) {
    if (locale === "ko") return "제한적 수준";
    if (locale === "ja") return "限定的";
    return "Limited";
  }
  if (normalized.includes("moderate")) {
    if (locale === "ko") return "중간 수준";
    if (locale === "ja") return "中程度";
    return "Moderate";
  }

  return humanizeCode(assuranceType);
}

function buildAssuranceBadge(assuranceType: string | null | undefined, locale: SupportedLocale) {
  const label = translateAssuranceType(assuranceType, locale);
  if (!label) return null;
  if (locale === "ko") return `${label} 검증`;
  if (locale === "ja") return `${label} 保証`;
  return `${label} Assurance`;
}

function buildBadges(
  company: Pick<CersCompanyProfile, "targetSummary" | "disclosure">,
  locale: SupportedLocale,
) {
  const badges: string[] = [];

  if (company.targetSummary.targetYear) {
    badges.push(locale === "ko" ? "목표 공표" : locale === "ja" ? "目標公表" : "Target Announced");
  }
  if (company.targetSummary.netZeroYear) {
    badges.push(
      locale === "ko"
        ? `넷제로 ${company.targetSummary.netZeroYear}`
        : locale === "ja"
          ? `ネットゼロ ${company.targetSummary.netZeroYear}`
          : `Net Zero ${company.targetSummary.netZeroYear}`,
    );
  }
  if (company.disclosure.scope3DisclosedCategories > 0) {
    const fullyDisclosed =
      company.disclosure.scope3TotalCategories > 0 &&
      company.disclosure.scope3DisclosedCategories >= company.disclosure.scope3TotalCategories;
    badges.push(
      fullyDisclosed
        ? locale === "ko"
          ? "스코프 3 공시"
          : locale === "ja"
            ? "スコープ3開示"
            : "Scope 3 Disclosed"
        : locale === "ko"
          ? "스코프 3 부분 공시"
          : locale === "ja"
            ? "スコープ3一部開示"
            : "Scope 3 Partially Disclosed",
    );
  }

  const assuranceBadge = company.disclosure.assuranceProvider
    ? buildAssuranceBadge(company.disclosure.assuranceType, locale)
    : null;
  if (assuranceBadge) {
    badges.push(assuranceBadge);
  }

  return badges.slice(0, 4);
}

export function humanizeCode(value: string | null | undefined) {
  if (!value) return "Unknown";
  const normalized = value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  if (!normalized) return "Unknown";
  if (/^[A-Z0-9 ]+$/.test(normalized)) return normalized;
  return titleCase(normalized);
}

function translateSectorLabel(
  sectorCode: string | null | undefined,
  sectorLabel: string | null | undefined,
  locale: SupportedLocale,
) {
  const normalizedCode = (sectorCode || "").trim().toUpperCase();
  if (normalizedCode && SECTOR_LABELS_BY_LOCALE[locale][normalizedCode]) {
    return SECTOR_LABELS_BY_LOCALE[locale][normalizedCode];
  }

  if (!sectorLabel) return null;
  const normalizedLabel = sectorLabel.trim().toLowerCase();
  if (!normalizedLabel || normalizedLabel === "unknown") return null;

  return sectorLabel;
}

export function normalizeScoreValue(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  const abs = Math.abs(value);
  if (abs <= 1.2) return Math.max(0, Math.min(100, value * 100));
  return Math.max(0, Math.min(100, value));
}

export function normalizePercentValue(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  const abs = Math.abs(value);
  if (abs <= 1.2) return value * 100;
  return value;
}

export function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return value.toFixed(1);
}

export function formatPercent(value: number | null | undefined, digits = 0) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

export function formatCompactNumber(value: number | null | undefined, digits = 1, locale: SupportedLocale = "en") {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(getIntlLocale(locale), {
    notation: "compact",
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatEmissions(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M tCO2e`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}k tCO2e`;
  return `${value.toFixed(0)} tCO2e`;
}

export function createDisplayName(name: string, localName: string | null, locale: SupportedLocale = "en") {
  if (!localName || localName.trim() === "" || localName.trim() === name.trim()) return name;
  if (locale === "ko") return `${localName} (${name})`;
  return `${name} (${localName})`;
}

export function getPublicCategoryLabel(
  code: string | null | undefined,
  name: string | null | undefined,
  index: number,
  locale: SupportedLocale = "en",
) {
  const normalizedCode = (code || "").toLowerCase().trim();
  const normalizedName = (name || "").toLowerCase();
  const labels = PUBLIC_CATEGORY_LABELS[locale];

  if (
    normalizedCode === "kpi1" ||
    normalizedCode === "k1" ||
    normalizedCode.includes("cat1") ||
    normalizedName.includes("탈탄소") ||
    normalizedName.includes("decarbon") ||
    normalizedName.includes("脱炭素")
  ) {
    return labels[0].label;
  }
  if (
    normalizedCode === "kpi2" ||
    normalizedCode === "k2" ||
    normalizedCode.includes("cat2") ||
    normalizedName.includes("목표") ||
    normalizedName.includes("target") ||
    normalizedName.includes("目標")
  ) {
    return labels[1].label;
  }
  if (
    normalizedCode === "kpi3" ||
    normalizedCode === "k3" ||
    normalizedCode.includes("cat3") ||
    normalizedName.includes("capital") ||
    normalizedName.includes("자본") ||
    normalizedName.includes("資本")
  ) {
    return labels[2].label;
  }
  if (
    normalizedCode === "kpi4" ||
    normalizedCode === "k4" ||
    normalizedCode.includes("cat4") ||
    normalizedName.includes("신뢰") ||
    normalizedName.includes("credib") ||
    normalizedName.includes("信頼")
  ) {
    return labels[3].label;
  }

  return labels[index]?.label || humanizeCode(name || code);
}

export type CalculationStatus = "scored" | "pending" | "not_scored";

export function deriveCalculationStatus(
  company: Pick<CersCompanyProfile, "overallScore" | "scorePeriodId" | "scoreFiscalYear">,
): CalculationStatus {
  if (company.overallScore !== null) return "scored";
  if (company.scorePeriodId !== null || company.scoreFiscalYear !== null) return "pending";
  return "not_scored";
}

function translateTargetTypeLabel(
  targetType: string | null | undefined,
  targetTypeLabel: string | null | undefined,
  locale: SupportedLocale,
) {
  const normalized = (targetType || targetTypeLabel || "").toLowerCase();

  if (normalized.includes("absolute")) {
    if (locale === "ko") return "절대량 감축";
    if (locale === "ja") return "絶対量削減";
    return "Absolute Reduction";
  }
  if (normalized.includes("intensity")) {
    if (locale === "ko") return "집약도 감축";
    if (locale === "ja") return "原単位削減";
    return "Intensity Reduction";
  }
  if (normalized.includes("netzero") || normalized.includes("net zero")) {
    if (locale === "ko") return "넷제로";
    if (locale === "ja") return "ネットゼロ";
    return "Net Zero";
  }
  if (normalized.includes("qualitative")) {
    if (locale === "ko") return "정성 목표";
    if (locale === "ja") return "定性的目標";
    return "Qualitative";
  }

  return targetTypeLabel || humanizeCode(targetType);
}

function translateScopeLabel(
  scopeCode: string | null | undefined,
  scopeLabel: string | null | undefined,
  locale: SupportedLocale,
) {
  const rawScopeLabel = scopeLabel?.trim();
  if (rawScopeLabel && rawScopeLabel.toLowerCase() === "unknown") return null;
  const normalized = normalizeScopeCode(scopeCode || scopeLabel);

  if (normalized.includes("partial3")) return getPartialScope3Label(locale);
  if (["scope1", "scope_1"].includes(normalized)) return getLocalizedScopeToken(1, locale);
  if (["scope2", "scope_2"].includes(normalized)) return getLocalizedScopeToken(2, locale);
  if (["scope3", "scope_3"].includes(normalized)) return getLocalizedScopeToken(3, locale);
  if (["scope12", "scope1_2", "scope_1_2"].includes(normalized)) {
    return `${getLocalizedScopeToken(1, locale)} + ${getLocalizedScopeToken(2, locale)}`;
  }
  if (["scope123", "scope1_2_3", "scope_1_2_3"].includes(normalized)) {
    return `${getLocalizedScopeToken(1, locale)} + ${getLocalizedScopeToken(2, locale)} + ${getLocalizedScopeToken(3, locale)}`;
  }
  if ((scopeLabel || "").toLowerCase().includes("partial 3")) {
    return getPartialScope3Label(locale);
  }

  if (rawScopeLabel) return rawScopeLabel;
  return scopeCode ? humanizeCode(scopeCode) : null;
}

export function buildCompanyInterpretation(
  score: number | null | undefined,
  company: Pick<CersCompanyProfile, "targetSummary" | "disclosure">,
  locale: SupportedLocale = "en",
) {
  const scoreLabel = score === null || score === undefined ? null : score.toFixed(1);
  const hasAssurance = company.disclosure.hasThirdPartyAssurance;

  if (locale === "ko") {
    if (scoreLabel && company.targetSummary.targetYear) {
      return `CERs Index ${scoreLabel}점이며 ${company.targetSummary.targetYear}년 감축 목표${hasAssurance ? "와 제3자 검증 근거" : ""}가 공개되어 있습니다.`;
    }
    if (scoreLabel) return `CERs Index ${scoreLabel}점입니다. 총점과 4개 KPI 구성을 함께 확인해야 합니다.`;
    if (company.targetSummary.targetYear) return `${company.targetSummary.targetYear}년 감축 목표는 공개되어 있으나 CERs Index 산정 결과는 아직 없습니다.`;
    return "공개 자료는 추적 중이며 CERs Index 산정 결과는 아직 없습니다.";
  }

  if (locale === "ja") {
    if (scoreLabel && company.targetSummary.targetYear) {
      return `CERs Index は ${scoreLabel} 点で、${company.targetSummary.targetYear}年の削減目標${hasAssurance ? "と第三者保証の根拠" : ""}が開示されています。`;
    }
    if (scoreLabel) return `CERs Index は ${scoreLabel} 点です。総合点と 4 つの KPI 構成を合わせて確認してください。`;
    if (company.targetSummary.targetYear) return `${company.targetSummary.targetYear}年の削減目標は開示されていますが、CERs Index の算定結果はまだありません。`;
    return "公開資料を追跡中で、CERs Index の算定結果はまだありません。";
  }

  if (scoreLabel && company.targetSummary.targetYear) {
    return `CERs Index score of ${scoreLabel}, with a ${company.targetSummary.targetYear} reduction target${hasAssurance ? " and third-party assurance evidence" : ""} in the public record.`;
  }
  if (scoreLabel) return `CERs Index score of ${scoreLabel}. Read the total together with the four-KPI profile.`;
  if (company.targetSummary.targetYear) return `A ${company.targetSummary.targetYear} reduction target is public, but no CERs Index result is available yet.`;
  return "Public evidence is being tracked, but no CERs Index result is available yet.";
}

export function buildCompanySummary(
  company: Pick<CersCompanyProfile, "overallScore" | "targetSummary" | "disclosure">,
  locale: SupportedLocale = "en",
) {
  if (locale === "ko") {
    if (company.overallScore !== null) return "공개 근거를 바탕으로 종합점수와 4개 KPI가 산정된 기업입니다.";
    if (company.targetSummary.targetYear) return "감축 목표와 공개 근거를 추적 중이며 점수 산정 결과는 아직 없습니다.";
    return "공개 기후 자료를 추적 중인 기업입니다.";
  }

  if (locale === "ja") {
    if (company.overallScore !== null) return "公開根拠に基づき、総合点と 4 つの KPI が算定された企業です。";
    if (company.targetSummary.targetYear) return "削減目標と公開根拠を追跡中で、スコア結果はまだありません。";
    return "公開されている気候資料を追跡中の企業です。";
  }

  if (company.overallScore !== null) return "Overall and four-KPI scores are available from the public evidence set.";
  if (company.targetSummary.targetYear) return "A reduction target and public evidence are tracked, but no score result is available yet.";
  return "Public climate evidence is currently being tracked for this company.";
}

export function getFeaturedCompanies(data: CersDashboardData, limit = 3) {
  return [...data.companies].sort(companyScoreSort).slice(0, limit);
}

export function getTopScoringCompanies(data: CersDashboardData, limit = 4) {
  return [...data.companies]
    .filter((company) => company.overallScore !== null)
    .sort(companyScoreSort)
    .slice(0, limit);
}

export function getClearTargetCompanies(data: CersDashboardData, limit = 3) {
  return [...data.companies]
    .filter((company) => company.targetSummary.targetYear && company.targetSummary.reductionPct !== null)
    .sort((a, b) => {
      const yearA = a.targetSummary.targetYear ?? Number.MAX_SAFE_INTEGER;
      const yearB = b.targetSummary.targetYear ?? Number.MAX_SAFE_INTEGER;
      if (yearA !== yearB) return yearA - yearB;
      return companyScoreSort(a, b);
    })
    .slice(0, limit);
}

export function getNetZeroCompanies(data: CersDashboardData, limit = 3) {
  return [...data.companies]
    .filter((company) => company.targetSummary.netZeroYear)
    .sort((a, b) => {
      const yearA = a.targetSummary.netZeroYear ?? Number.MAX_SAFE_INTEGER;
      const yearB = b.targetSummary.netZeroYear ?? Number.MAX_SAFE_INTEGER;
      if (yearA !== yearB) return yearA - yearB;
      return companyScoreSort(a, b);
    })
    .slice(0, limit);
}

export function buildScoreDistribution(companies: CersCompanyProfile[]) {
  const ranges = [
    { range: "80-100", min: 80, max: 100 },
    { range: "70-79", min: 70, max: 79.9999 },
    { range: "60-69", min: 60, max: 69.9999 },
    { range: "50-59", min: 50, max: 59.9999 },
    { range: "0-49", min: 0, max: 49.9999 },
  ];

  return ranges.map((bucket) => ({
    range: bucket.range,
    count: companies.filter((company) => {
      const score = company.overallScore;
      return score !== null && score >= bucket.min && score <= bucket.max;
    }).length,
  }));
}

function roundStat(value: number | null) {
  if (value === null || !Number.isFinite(value)) return null;
  return Number(value.toFixed(1));
}

function getAverage(values: number[]) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getQuantile(values: number[], quantile: number) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * quantile;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const lower = sorted[lowerIndex];
  const upper = sorted[upperIndex] ?? lower;
  if (lower === undefined) return null;
  if (lowerIndex === upperIndex) return lower;
  return lower + (upper - lower) * (position - lowerIndex);
}

function getPercentage(count: number, total: number) {
  if (total <= 0) return null;
  return (count / total) * 100;
}

function buildIndustrySummaryText(
  label: string,
  medianScore: number | null,
  scoreCoverage: number | null,
  strongestCategory: string | null,
  weakestCategory: string | null,
  locale: SupportedLocale,
) {
  if (medianScore === null) {
    if (locale === "ko") return `${label} 섹터는 현재 평가 가능한 점수 데이터가 제한적입니다.`;
    if (locale === "ja") return `${label} セクターは現在、評価可能なスコアデータが限定的です。`;
    return `${label} currently has limited scored coverage in the dataset.`;
  }

  const coverageText = scoreCoverage === null ? "—" : `${scoreCoverage.toFixed(0)}%`;

  if (strongestCategory && weakestCategory) {
    if (locale === "ko") {
      return `${label} 섹터는 점수 보유율 ${coverageText}, 중앙값 ${medianScore.toFixed(1)}점이며 ${strongestCategory}가 상대적으로 강하고 ${weakestCategory}는 보완 여지가 큽니다.`;
    }
    if (locale === "ja") {
      return `${label} セクターはスコア保有率 ${coverageText}、中央値 ${medianScore.toFixed(1)} で、${strongestCategory} が相対的に強く、${weakestCategory} は補強余地があります。`;
    }
    return `${label} shows ${coverageText} score coverage with a median score of ${medianScore.toFixed(1)}. ${strongestCategory} is relatively stronger, while ${weakestCategory} has more room to improve.`;
  }

  if (locale === "ko") return `${label} 섹터는 점수 보유율 ${coverageText}, 중앙값 ${medianScore.toFixed(1)}점을 기록하고 있습니다.`;
  if (locale === "ja") return `${label} セクターはスコア保有率 ${coverageText}、中央値 ${medianScore.toFixed(1)} を記録しています。`;
  return `${label} shows ${coverageText} score coverage with a median score of ${medianScore.toFixed(1)}.`;
}

function getIndustryFocusPoints(
  industryCode: string,
  industryLabel: string,
  locale: SupportedLocale,
): CersIndustryFocusPoint[] {
  const normalized = industryCode.trim().toUpperCase();

  if (["DNS", "EEM", "IMS"].includes(normalized)) {
    if (locale === "ko") {
      return [
        {
          title: "데이터센터 효율",
          description: "전력 수요, 재생전력 조달, 냉각 효율이 단기 성과를 가장 직접적으로 좌우합니다.",
        },
        {
          title: "공급망 가시성",
          description: "하드웨어와 부품 조달이 스코프 3 영향을 크게 좌우하므로 공급업체 데이터 품질이 중요합니다.",
        },
        {
          title: "자본 배분 규율",
          description: "저탄소 투자가 실제 CAPEX 결정에 반영되는지가 높은 점수를 가르는 요소입니다.",
        },
      ];
    }
    if (locale === "ja") {
      return [
        {
          title: "データセンター効率",
          description: "電力需要、再エネ調達、冷却効率が短期的な進捗を最も左右します。",
        },
        {
          title: "サプライチェーン可視性",
          description: "ハードウェアや部品調達がスコープ3影響の大部分を占めるため、サプライヤーデータ品質が重要です。",
        },
        {
          title: "資本配分規律",
          description: "低炭素投資が実際の CAPEX 判断に反映されているかが高評価の分かれ目です。",
        },
      ];
    }
    return [
      {
        title: "Data Center Efficiency",
        description:
          "Operational power demand, renewable electricity sourcing, and cooling efficiency are the clearest drivers of near-term progress.",
      },
      {
        title: "Supply Chain Visibility",
        description:
          "Hardware and component sourcing shifts a large share of climate impact into Scope 3, so supplier data quality matters.",
      },
      {
        title: "Capital Discipline",
        description:
          "High scores depend on whether low-carbon investments are reflected in actual capex decisions rather than ambition statements alone.",
      },
    ];
  }

  if (["PWR", "ENR", "PRM"].includes(normalized)) {
    if (locale === "ko") {
      return [
        {
          title: "공정 배출",
          description: "감축이 어려운 섹터는 실제 생산 조건에서 배출 집약도가 개선되는지를 중심으로 평가됩니다.",
        },
        {
          title: "전환 CAPEX",
          description: "그린 CAPEX와 탄소 고착형 투자 비중의 차이가 전환 계획의 재무 신뢰도를 가릅니다.",
        },
        {
          title: "검증 품질",
          description: "규제와 탄소비용이 기업가치에 크게 영향을 주는 섹터일수록 검증과 공시 품질이 더 중요합니다.",
        },
      ];
    }
    if (locale === "ja") {
      return [
        {
          title: "工程排出",
          description: "削減が難しいセクターでは、実際の生産条件のもとで排出原単位が改善しているかが重要です。",
        },
        {
          title: "移行 CAPEX",
          description: "グリーン CAPEX と炭素固定化投資のバランスが、移行計画の財務的信頼性を左右します。",
        },
        {
          title: "保証品質",
          description: "規制や炭素コストが企業価値を左右しやすいセクターほど、保証と開示の品質が重要になります。",
        },
      ];
    }
    return [
      {
        title: "Process Emissions",
        description:
          "Hard-to-abate sectors are judged on whether operational emissions intensity is improving under real production conditions.",
      },
      {
        title: "Transition Capex",
        description:
          "The pace of green capex versus carbon lock-in spend is critical when evaluating whether transition plans are financially credible.",
      },
      {
        title: "Assurance Quality",
        description:
          "Stronger verification and decision-useful disclosures matter more where regulation and carbon costs can change enterprise value quickly.",
      },
    ];
  }

  if (["MOV", "MFG"].includes(normalized)) {
    if (locale === "ko") {
      return [
        {
          title: "제품 전환",
          description: "현재 배출 성과가 개선되는지와 미래 전환 목표의 신뢰도가 함께 평가됩니다.",
        },
        {
          title: "공급망 준비도",
          description: "스코프 3 품질은 공급업체 입력, 배터리 조달, 운영 데이터 범위에 크게 좌우됩니다.",
        },
        {
          title: "의사결정 도구",
          description: "내부탄소가격과 MACC 같은 도구가 계획과 마케팅 문구를 구분하는 핵심 신호가 됩니다.",
        },
      ];
    }
    if (locale === "ja") {
      return [
        {
          title: "製品移行",
          description: "現在の排出実績の改善と、将来目標の信頼性の両方が評価対象になります。",
        },
        {
          title: "サプライヤー準備度",
          description: "スコープ3の質は、サプライヤー入力、電池調達、運用データ範囲に大きく左右されます。",
        },
        {
          title: "意思決定ツール",
          description: "内部炭素価格や MACC の活用は、計画の質と単なる広報文言を分ける重要なシグナルです。",
        },
      ];
    }
    return [
      {
        title: "Fleet or Product Transition",
        description:
          "Evaluation centers on whether current emissions performance is improving while future transition targets remain credible.",
      },
      {
        title: "Supplier Readiness",
        description:
          "Scope 3 quality depends on the quality of supplier inputs, battery sourcing, and operational data coverage.",
      },
      {
        title: "Decision Tools",
        description:
          "Internal carbon pricing, MACC use, and embedded investment rules help separate plan quality from marketing language.",
      },
    ];
  }

  if (locale === "ko") {
    return [
      {
        title: "감축 성과",
        description: `${industryLabel} 기업은 활동 수준 대비 배출 성과가 실제로 개선되고 있는지를 우선 평가합니다.`,
      },
      {
        title: "목표 신뢰도",
        description: "공개 목표는 장기 선언만이 아니라 측정 가능한 경로와 연결될 때 더 의미가 있습니다.",
      },
      {
        title: "공시 품질",
        description: "명확한 근거, 제3자 검증, 스코프 3 커버리지는 보고된 전환 스토리에 대한 신뢰를 높입니다.",
      },
    ];
  }

  if (locale === "ja") {
    return [
      {
        title: "削減実績",
        description: `${industryLabel} 企業は、活動量に対して排出実績が実際に改善しているかをまず見られます。`,
      },
      {
        title: "目標の信頼性",
        description: "公開目標は、長期の表明だけでなく、測定可能な経路と結び付くときに意味を持ちます。",
      },
      {
        title: "開示品質",
        description: "明確な根拠、第三者保証、より広いスコープ3カバレッジが、報告された移行ストーリーへの信頼を高めます。",
      },
    ];
  }

  return [
    {
      title: "Reduction Performance",
      description: `${industryLabel} companies are assessed first on whether emissions performance is visibly improving relative to activity levels.`,
    },
    {
      title: "Target Credibility",
      description: "Public targets matter most when they are linked to a measurable pathway, not just long-dated ambition statements.",
    },
    {
      title: "Disclosure Quality",
      description: "Clear evidence, third-party assurance, and better Scope 3 coverage improve confidence in the reported transition story.",
    },
  ];
}

export function getIndustrySummaries(data: CersDashboardData, locale: SupportedLocale = "en"): CersIndustrySummary[] {
  const grouped = new Map<string, CersCompanyProfile[]>();

  for (const company of data.companies) {
    const key = company.sectorCode || company.industryCode || "unknown";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(company);
  }

  return Array.from(grouped.entries())
    .map(([industryCode, companies]) => {
      const scoredCompanies = companies.filter((company) => company.overallScore !== null);
      const scoredValues = scoredCompanies
        .map((company) => company.overallScore)
        .filter((value): value is number => value !== null && Number.isFinite(value));
      const averageScore = getAverage(scoredValues);
      const medianScore = getQuantile(scoredValues, 0.5);
      const scoreQuartileLow = getQuantile(scoredValues, 0.25);
      const scoreQuartileHigh = getQuantile(scoredValues, 0.75);
      const scoreCoverage = getPercentage(scoredCompanies.length, companies.length);
      const latestScoreYear = companies.reduce<number | null>((latest, company) => {
        const year = company.scoreFiscalYear ?? company.fiscalYear;
        if (year === null || year === undefined) return latest;
        if (latest === null) return year;
        return year > latest ? year : latest;
      }, null);
      const lead = companies[0];
      const label = lead?.sectorLabel || lead?.industryLabel || humanizeCode(industryCode);
      const categoryAverages = data.categories.map((category) => {
        const rawValues = companies
          .map((company) => company.categories.find((item) => item.code === category.code)?.rawScore ?? null)
          .filter((value): value is number => value !== null && Number.isFinite(value));
        const weightedValues = companies
          .map((company) => company.categories.find((item) => item.code === category.code)?.weightedScore ?? null)
          .filter((value): value is number => value !== null && Number.isFinite(value));

        return {
          ...category,
          rawScore: roundStat(getAverage(rawValues)),
          weightedScore: roundStat(getAverage(weightedValues)),
        };
      });
      const rankedCategories = categoryAverages
        .filter((category) => category.rawScore !== null)
        .sort((a, b) => (b.rawScore || 0) - (a.rawScore || 0));
      const strongestCategory = rankedCategories[0]?.label ?? null;
      const weakestCategory = rankedCategories[rankedCategories.length - 1]?.label ?? null;
      const targetCompanies = companies.filter((company) => company.targetSummary.targetYear !== null);
      const netZeroCompanies = companies.filter((company) => company.targetSummary.netZeroYear !== null);
      const sbtiCompanies = companies.filter((company) => company.targetSummary.sbtiApproved === true);
      const interimCompanies = companies.filter((company) => {
        const milestoneTargets = company.targets.filter(
          (target) =>
            target.disclosed !== false &&
            target.targetType !== "netzero" &&
            target.targetType !== "residual_neutralization" &&
            target.targetYear !== null,
        );
        return milestoneTargets.length > 1;
      });
      const targetYears = targetCompanies
        .map((company) => company.targetSummary.targetYear)
        .filter((value): value is number => value !== null && Number.isFinite(value));

      const assuredCompanies = companies.filter((company) => company.disclosure.hasThirdPartyAssurance);
      const frameworkCompanies = companies.filter((company) => company.disclosure.frameworks.length > 0);
      const primaryDataRatios = companies
        .map((company) => company.disclosure.averagePrimaryDataRatio)
        .filter((value): value is number => value !== null && Number.isFinite(value));
      const scope3DisclosedTotal = companies.reduce((sum, company) => sum + company.disclosure.scope3DisclosedCategories, 0);
      const scope3CategoryTotal = companies.reduce((sum, company) => sum + company.disclosure.scope3TotalCategories, 0);

      const summary = buildIndustrySummaryText(
        label,
        roundStat(medianScore),
        roundStat(scoreCoverage),
        strongestCategory,
        weakestCategory,
        locale,
      );

      return {
        industryCode,
        label,
        sectorCode: lead?.sectorCode || null,
        sectorLabel: lead?.sectorLabel || null,
        averageScore: roundStat(averageScore),
        medianScore: roundStat(medianScore),
        scoreCoverage: roundStat(scoreCoverage),
        scoredCompanyCount: scoredCompanies.length,
        latestScoreYear,
        scoreQuartileLow: roundStat(scoreQuartileLow),
        scoreQuartileHigh: roundStat(scoreQuartileHigh),
        sampleBucket: companies.length >= 30 ? ("robust" as const) : ("limited" as const),
        strongestCategory,
        weakestCategory,
        categoryAverages,
        targetStats: {
          targetCoverage: {
            value: roundStat(getPercentage(targetCompanies.length, companies.length)),
            count: targetCompanies.length,
            total: companies.length,
          },
          netZeroCoverage: {
            value: roundStat(getPercentage(netZeroCompanies.length, companies.length)),
            count: netZeroCompanies.length,
            total: companies.length,
          },
          sbtiCoverage: {
            value: roundStat(getPercentage(sbtiCompanies.length, companies.length)),
            count: sbtiCompanies.length,
            total: companies.length,
          },
          interimCoverage: {
            value: roundStat(getPercentage(interimCompanies.length, companies.length)),
            count: interimCompanies.length,
            total: companies.length,
          },
          medianTargetYear: targetYears.length > 0 ? Math.round(getQuantile(targetYears, 0.5) || 0) : null,
        },
        disclosureStats: {
          assuranceCoverage: {
            value: roundStat(getPercentage(assuredCompanies.length, companies.length)),
            count: assuredCompanies.length,
            total: companies.length,
          },
          scope3CoverageAverage: roundStat(getPercentage(scope3DisclosedTotal, scope3CategoryTotal)),
          primaryDataRatioAverage: roundStat(getAverage(primaryDataRatios)),
          frameworkCoverage: {
            value: roundStat(getPercentage(frameworkCompanies.length, companies.length)),
            count: frameworkCompanies.length,
            total: companies.length,
          },
        },
        companyCount: companies.length,
        companies: [...companies].sort(companyScoreSort),
        scoreDistribution: buildScoreDistribution(companies),
        focusPoints: getIndustryFocusPoints(industryCode, label, locale),
        summary,
      };
    })
    .sort((a, b) => {
      const scoreA = a.averageScore ?? -1;
      const scoreB = b.averageScore ?? -1;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return a.label.localeCompare(b.label, locale, { sensitivity: "base" });
    });
}

export function getCategoryScore(company: CersCompanyProfile, label: string) {
  return (
    company.categories.find((category) => category.label === label)?.rawScore ??
    company.categories.find((category) => category.code.toLowerCase() === label.toLowerCase())?.rawScore ??
    null
  );
}

export function buildComparisonSummary(companies: CersCompanyProfile[], locale: SupportedLocale = "en") {
  if (companies.length === 0) {
    if (locale === "ko") return "비교할 기업을 선택하면 최신 CERs 프로필을 나란히 볼 수 있습니다.";
    if (locale === "ja") return "企業を選択すると、最新の CERs プロファイルを並べて比較できます。";
    return "Select companies to compare their latest CERs profiles.";
  }

  const sorted = [...companies].sort(companyScoreSort);
  const leader = sorted[0];
  const clearestTarget = [...companies]
    .filter((company) => company.targetSummary.targetYear)
    .sort((a, b) => (a.targetSummary.targetYear || 0) - (b.targetSummary.targetYear || 0))[0];

  if (!leader) {
    if (locale === "ko") return "비교할 기업을 선택하면 최신 CERs 프로필을 나란히 볼 수 있습니다.";
    if (locale === "ja") return "企業を選択すると、最新の CERs プロファイルを並べて比較できます。";
    return "Select companies to compare their latest CERs profiles.";
  }

  if (clearestTarget && clearestTarget.id !== leader.id) {
    if (locale === "ko") {
      return `${leader.displayName}가 종합 점수에서 앞서고 있으며, ${clearestTarget.displayName}는 이번 비교에서 가장 이른 공개 목표 연도를 제시하고 있습니다.`;
    }
    if (locale === "ja") {
      return `${leader.displayName} が総合スコアで先行し、${clearestTarget.displayName} は今回の比較で最も早い公開目標年を示しています。`;
    }
    return `${leader.displayName} leads on overall score, while ${clearestTarget.displayName} currently shows the earliest disclosed target year in this comparison.`;
  }

  if (locale === "ko") {
    return `${leader.displayName}가 현재 종합 점수와 전환 준비도에서 가장 앞서 있습니다.`;
  }
  if (locale === "ja") {
    return `${leader.displayName} が現在、総合スコアと移行準備度で先行しています。`;
  }
  return `${leader.displayName} currently leads this comparison on overall score and transition readiness.`;
}

export function companyScoreSort(a: CersCompanyProfile, b: CersCompanyProfile) {
  const scoreA = a.overallScore ?? -1;
  const scoreB = b.overallScore ?? -1;
  if (scoreA !== scoreB) return scoreB - scoreA;
  return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
}

function localizeTargetSummary(
  targetSummary: CersTargetSummary,
  targets: CersCompanyProfile["targets"],
  locale: SupportedLocale,
) {
  const t = getTranslations(locale);
  const hasInterimTarget =
    targets.filter((target) => target.targetType !== "netzero" && target.targetYear).length > 1 ||
    Boolean(targetSummary.targetYear);

  return {
    ...targetSummary,
    targetTypeLabel: translateTargetTypeLabel(targetSummary.targetType, targetSummary.targetTypeLabel, locale),
    scopeLabel: translateScopeLabel(targetSummary.scopeCode, targetSummary.scopeLabel, locale),
    interimTargetLabel: hasInterimTarget ? t.common.yes : t.common.no,
  };
}

function localizeDisclosure(disclosure: CersDisclosureSummary, locale: SupportedLocale) {
  return {
    ...disclosure,
    assuranceType: translateAssuranceType(disclosure.assuranceType, locale),
  };
}

export function localizeDashboardData(data: CersDashboardData, locale: SupportedLocale): CersDashboardData {
  const categories = data.categories.map((category, index) => ({
    ...category,
    label: getPublicCategoryLabel(category.code, category.label, index, locale),
  }));

  const companies = data.companies.map((company) => {
    const localizedCategories = company.categories.map((category, index) => ({
      ...category,
      label: getPublicCategoryLabel(category.code, category.label, index, locale),
    }));
    const localizedTargetSummary = localizeTargetSummary(company.targetSummary, company.targets, locale);
    const localizedDisclosure = localizeDisclosure(company.disclosure, locale);

    const localizedCompany: CersCompanyProfile = {
      ...company,
      displayName: createDisplayName(company.name, company.localName, locale),
      sectorLabel: translateSectorLabel(company.sectorCode, company.sectorLabel, locale),
      categories: localizedCategories,
      targetSummary: localizedTargetSummary,
      disclosure: localizedDisclosure,
      latestDocument: company.latestDocument
        ? {
            ...company.latestDocument,
            assuranceType: translateAssuranceType(company.latestDocument.assuranceType, locale),
          }
        : null,
      badges: [],
      summary: "",
      interpretation: "",
    };

    localizedCompany.badges = buildBadges(localizedCompany, locale);
    localizedCompany.summary = buildCompanySummary(localizedCompany, locale);
    localizedCompany.interpretation = buildCompanyInterpretation(localizedCompany.overallScore, localizedCompany, locale);

    return localizedCompany;
  });

  return {
    ...data,
    categories,
    companies,
  };
}

export function mergeCategoryMeta(meta: CersCategoryMeta[], companyCategories: CersCategoryScore[]) {
  const byCode = new Map<string, CersCategoryMeta>();
  for (const item of meta) byCode.set(item.code, item);
  for (const item of companyCategories) {
    if (!byCode.has(item.code)) {
      byCode.set(item.code, {
        id: item.id,
        code: item.code,
        label: item.label,
        weight: item.weight,
        displayOrder: item.displayOrder,
      });
    }
  }
  return [...byCode.values()].sort((a, b) => a.displayOrder - b.displayOrder);
}
