import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/cers/app-shell";
import { localizedPath, type SupportedLocale } from "@/lib/cers/i18n";

const ABOUT_COPY = {
  en: {
    badge: "CERs Index Methodology",
    title: "Four perspectives on corporate carbon reduction",
    description:
      "CERs Index uses public climate, financial, governance, and assurance information to assess corporate carbon-reduction performance.",
    purposeTitle: "What we assess",
    purpose:
      "We assess actual emissions reduction, target delivery, capital allocation, and data credibility together.",
    structureTitle: "How the index is structured",
    structureDescription:
      "The four KPIs contribute equally to the final CERs Index.",
    cta: "View detailed formulas and variables",
    kpis: [
      { code: "KPI 1", title: "Actual carbon reduction", question: "Did emissions actually fall?", items: ["E1 · Scope 1 & 2 performance", "E2 · Scope 3 performance"] },
      { code: "KPI 2", title: "Targets and delivery", question: "Are targets sound and being delivered?", items: ["T1 · Target design", "T2 · Delivery progress"] },
      { code: "KPI 3", title: "Capital allocation", question: "Are resources aligned with transition?", items: ["C1 · Green CAPEX", "C2 · Low-carbon revenue", "C3 · Internal carbon price", "C4 · Climate-linked pay", "C5 · Carbon-credit use"] },
      { code: "KPI 4", title: "Data credibility", question: "Can the evidence and results be trusted?", items: ["R1 · Information completeness", "R2 · Calculation transparency", "R3 · Third-party assurance", "R4 · Real-time cross-check"] },
    ],
  },
  ko: {
    badge: "CERs Index 평가방법론",
    title: "기업의 탄소감축 성과를 네 가지 관점으로 평가합니다",
    description:
      "CERs Index는 공개된 기후·재무·거버넌스·검증 정보를 바탕으로 기업의 탄소감축 성과를 평가합니다.",
    purposeTitle: "평가 대상",
    purpose:
      "실제 감축성과, 목표 이행, 자본배분, 데이터 신뢰성을 함께 평가합니다.",
    structureTitle: "평가 구조",
    structureDescription:
      "4개 KPI는 최종 CERs Index에 동일한 비중으로 반영됩니다.",
    cta: "상세 산식과 변수 보기",
    kpis: [
      { code: "KPI 1", title: "실질 탄소감축 성과", question: "실제 배출이 감소했는가", items: ["E1 · Scope 1·2 감축성과", "E2 · Scope 3 감축성과"] },
      { code: "KPI 2", title: "목표 및 이행성과", question: "목표가 적정하고 이행되고 있는가", items: ["T1 · 감축목표 설계 수준", "T2 · 목표 이행 진척도"] },
      { code: "KPI 3", title: "자본배분", question: "자원이 저탄소 전환에 배분되는가", items: ["C1 · 녹색 CAPEX 비중", "C2 · 저탄소 매출 비중", "C3 · 내부탄소가격", "C4 · 기후성과 보상 연계", "C5 · 탄소크레딧 활용"] },
      { code: "KPI 4", title: "데이터 신뢰성", question: "자료와 결과를 신뢰할 수 있는가", items: ["R1 · 정보 완전성", "R2 · 산정기준 명확성", "R3 · 제3자검증 신뢰성", "R4 · 실시간 교차검증"] },
    ],
  },
  ja: {
    badge: "CERs Index 評価方法論",
    title: "企業の炭素削減を4つの視点で評価します",
    description:
      "CERs Indexは、公開された気候・財務・ガバナンス・保証情報に基づき、企業の炭素削減実績を評価します。",
    purposeTitle: "評価対象",
    purpose:
      "実際の削減実績、目標の履行、資本配分、データ信頼性を評価します。",
    structureTitle: "評価構造",
    structureDescription:
      "4つのKPIは、最終CERs Indexに同じ比重で反映されます。",
    cta: "詳細な算式と変数を見る",
    kpis: [
      { code: "KPI 1", title: "実質的な炭素削減", question: "実際の排出量は減少したか", items: ["E1 · Scope 1・2削減実績", "E2 · Scope 3削減実績"] },
      { code: "KPI 2", title: "目標と履行", question: "目標は適切で履行されているか", items: ["T1 · 目標設計", "T2 · 履行進捗"] },
      { code: "KPI 3", title: "資本配分", question: "資源は低炭素移行に配分されているか", items: ["C1 · グリーンCAPEX", "C2 · 低炭素売上", "C3 · 社内炭素価格", "C4 · 気候連動報酬", "C5 · カーボンクレジット活用"] },
      { code: "KPI 4", title: "データ信頼性", question: "資料と結果を信頼できるか", items: ["R1 · 情報の完全性", "R2 · 算定基準の明確性", "R3 · 第三者保証", "R4 · リアルタイム照合"] },
    ],
  },
} as const;

type AboutCopy = {
  badge: string;
  title: string;
  description: string;
  purposeTitle: string;
  purpose: string;
  structureTitle: string;
  structureDescription: string;
  cta: string;
  kpis: ReadonlyArray<{
    code: string;
    title: string;
    question: string;
    items: ReadonlyArray<string>;
  }>;
};

const ADDITIONAL_ABOUT_COPY: Record<Exclude<SupportedLocale, "en" | "ko" | "ja">, AboutCopy> = {
  zh: {
    badge: "CERs Index 方法论",
    title: "从四个维度评估企业碳减排",
    description: "CERs Index 基于公开的气候、财务、治理和鉴证信息评估企业碳减排表现。",
    purposeTitle: "评估内容",
    purpose: "我们综合评估实际减排、目标执行、资本配置和数据可信度。",
    structureTitle: "指数结构",
    structureDescription: "四项 KPI 对最终 CERs Index 采用相同权重。",
    cta: "查看详细公式和变量",
    kpis: [
      { code: "KPI 1", title: "实际碳减排", question: "排放是否实际下降？", items: ["E1 · Scope 1·2 表现", "E2 · Scope 3 表现"] },
      { code: "KPI 2", title: "目标与执行", question: "目标是否合理并得到执行？", items: ["T1 · 目标设计", "T2 · 执行进度"] },
      { code: "KPI 3", title: "资本配置", question: "资源是否支持低碳转型？", items: ["C1 · 绿色 CAPEX", "C2 · 低碳营收", "C3 · 内部碳价", "C4 · 气候绩效薪酬", "C5 · 碳信用使用"] },
      { code: "KPI 4", title: "数据可信度", question: "证据和结果是否可信？", items: ["R1 · 信息完整性", "R2 · 计算透明度", "R3 · 第三方鉴证", "R4 · 实时交叉核验"] },
    ],
  },
  vi: {
    badge: "Phương pháp CERs Index",
    title: "Đánh giá mức giảm carbon của doanh nghiệp qua bốn góc nhìn",
    description: "CERs Index sử dụng thông tin công khai về khí hậu, tài chính, quản trị và đảm bảo để đánh giá kết quả giảm carbon.",
    purposeTitle: "Nội dung đánh giá",
    purpose: "Chúng tôi đánh giá đồng thời mức giảm thực tế, thực hiện mục tiêu, phân bổ vốn và độ tin cậy dữ liệu.",
    structureTitle: "Cấu trúc chỉ số",
    structureDescription: "Bốn KPI đóng góp với trọng số bằng nhau vào CERs Index cuối cùng.",
    cta: "Xem công thức và biến chi tiết",
    kpis: [
      { code: "KPI 1", title: "Giảm carbon thực tế", question: "Phát thải có thực sự giảm?", items: ["E1 · Kết quả Scope 1·2", "E2 · Kết quả Scope 3"] },
      { code: "KPI 2", title: "Mục tiêu và thực hiện", question: "Mục tiêu có phù hợp và được thực hiện?", items: ["T1 · Thiết kế mục tiêu", "T2 · Tiến độ thực hiện"] },
      { code: "KPI 3", title: "Phân bổ vốn", question: "Nguồn lực có phù hợp với chuyển đổi?", items: ["C1 · CAPEX xanh", "C2 · Doanh thu carbon thấp", "C3 · Giá carbon nội bộ", "C4 · Lương thưởng gắn với khí hậu", "C5 · Sử dụng tín chỉ carbon"] },
      { code: "KPI 4", title: "Độ tin cậy dữ liệu", question: "Có thể tin cậy bằng chứng và kết quả?", items: ["R1 · Tính đầy đủ thông tin", "R2 · Minh bạch tính toán", "R3 · Đảm bảo bên thứ ba", "R4 · Đối chiếu thời gian thực"] },
    ],
  },
  ru: {
    badge: "Методология CERs Index",
    title: "Четыре взгляда на сокращение выбросов компаний",
    description: "CERs Index оценивает сокращение выбросов по открытым климатическим, финансовым, управленческим и заверенным данным.",
    purposeTitle: "Что оценивается",
    purpose: "Мы вместе рассматриваем фактическое сокращение, выполнение целей, распределение капитала и надёжность данных.",
    structureTitle: "Структура индекса",
    structureDescription: "Четыре KPI имеют одинаковый вес в итоговом CERs Index.",
    cta: "Подробные формулы и переменные",
    kpis: [
      { code: "KPI 1", title: "Фактическое сокращение выбросов", question: "Действительно ли выбросы снизились?", items: ["E1 · Результаты Scope 1·2", "E2 · Результаты Scope 3"] },
      { code: "KPI 2", title: "Цели и выполнение", question: "Обоснованы ли цели и выполняются ли они?", items: ["T1 · Конструкция цели", "T2 · Прогресс выполнения"] },
      { code: "KPI 3", title: "Распределение капитала", question: "Поддерживают ли ресурсы переход?", items: ["C1 · Зелёный CAPEX", "C2 · Низкоуглеродная выручка", "C3 · Внутренняя цена углерода", "C4 · Климатическая мотивация", "C5 · Углеродные кредиты"] },
      { code: "KPI 4", title: "Надёжность данных", question: "Можно ли доверять данным и результатам?", items: ["R1 · Полнота информации", "R2 · Прозрачность расчёта", "R3 · Стороннее заверение", "R4 · Оперативная сверка"] },
    ],
  },
  id: {
    badge: "Metodologi CERs Index",
    title: "Empat perspektif atas pengurangan karbon perusahaan",
    description: "CERs Index menggunakan informasi iklim, keuangan, tata kelola, dan asurans yang dipublikasikan untuk menilai kinerja pengurangan karbon.",
    purposeTitle: "Apa yang dinilai",
    purpose: "Kami menilai pengurangan aktual, pelaksanaan target, alokasi modal, dan kredibilitas data secara bersama.",
    structureTitle: "Struktur indeks",
    structureDescription: "Keempat KPI berkontribusi sama terhadap CERs Index akhir.",
    cta: "Lihat rumus dan variabel terperinci",
    kpis: [
      { code: "KPI 1", title: "Pengurangan karbon aktual", question: "Apakah emisi benar-benar turun?", items: ["E1 · Kinerja Scope 1·2", "E2 · Kinerja Scope 3"] },
      { code: "KPI 2", title: "Target dan pelaksanaan", question: "Apakah target tepat dan dijalankan?", items: ["T1 · Desain target", "T2 · Kemajuan pelaksanaan"] },
      { code: "KPI 3", title: "Alokasi modal", question: "Apakah sumber daya selaras dengan transisi?", items: ["C1 · CAPEX hijau", "C2 · Pendapatan rendah karbon", "C3 · Harga karbon internal", "C4 · Imbalan terkait iklim", "C5 · Penggunaan kredit karbon"] },
      { code: "KPI 4", title: "Kredibilitas data", question: "Dapatkah bukti dan hasil dipercaya?", items: ["R1 · Kelengkapan informasi", "R2 · Transparansi perhitungan", "R3 · Asurans pihak ketiga", "R4 · Pemeriksaan silang waktu nyata"] },
    ],
  },
  th: {
    badge: "ระเบียบวิธี CERs Index",
    title: "สี่มุมมองต่อการลดคาร์บอนของบริษัท",
    description: "CERs Index ใช้ข้อมูลสาธารณะด้านภูมิอากาศ การเงิน ธรรมาภิบาล และการรับรองเพื่อประเมินผลการลดคาร์บอน",
    purposeTitle: "สิ่งที่เราประเมิน",
    purpose: "เราประเมินการลดจริง การดำเนินการตามเป้าหมาย การจัดสรรเงินทุน และความน่าเชื่อถือของข้อมูลร่วมกัน",
    structureTitle: "โครงสร้างดัชนี",
    structureDescription: "KPI ทั้งสี่มีน้ำหนักเท่ากันใน CERs Index ขั้นสุดท้าย",
    cta: "ดูสูตรและตัวแปรโดยละเอียด",
    kpis: [
      { code: "KPI 1", title: "การลดคาร์บอนจริง", question: "การปล่อยลดลงจริงหรือไม่", items: ["E1 · ผล Scope 1·2", "E2 · ผล Scope 3"] },
      { code: "KPI 2", title: "เป้าหมายและการดำเนินการ", question: "เป้าหมายเหมาะสมและดำเนินการหรือไม่", items: ["T1 · การออกแบบเป้าหมาย", "T2 · ความคืบหน้า"] },
      { code: "KPI 3", title: "การจัดสรรเงินทุน", question: "ทรัพยากรสอดคล้องกับการเปลี่ยนผ่านหรือไม่", items: ["C1 · CAPEX สีเขียว", "C2 · รายได้คาร์บอนต่ำ", "C3 · ราคาคาร์บอนภายใน", "C4 · ค่าตอบแทนเชื่อมโยงภูมิอากาศ", "C5 · การใช้คาร์บอนเครดิต"] },
      { code: "KPI 4", title: "ความน่าเชื่อถือของข้อมูล", question: "หลักฐานและผลลัพธ์เชื่อถือได้หรือไม่", items: ["R1 · ความครบถ้วน", "R2 · ความโปร่งใสในการคำนวณ", "R3 · การรับรองภายนอก", "R4 · การตรวจสอบแบบเรียลไทม์"] },
    ],
  },
  bn: {
    badge: "CERs Index পদ্ধতি",
    title: "কোম্পানির কার্বন হ্রাসের চারটি দৃষ্টিভঙ্গি",
    description: "CERs Index প্রকাশ্য জলবায়ু, আর্থিক, পরিচালনা ও নিশ্চয়তা তথ্য দিয়ে কোম্পানির কার্বন হ্রাস মূল্যায়ন করে।",
    purposeTitle: "আমরা যা মূল্যায়ন করি",
    purpose: "বাস্তব হ্রাস, লক্ষ্য বাস্তবায়ন, মূলধন বণ্টন ও ডেটার বিশ্বাসযোগ্যতা একসঙ্গে মূল্যায়ন করা হয়।",
    structureTitle: "সূচকের কাঠামো",
    structureDescription: "চারটি KPI চূড়ান্ত CERs Index-এ সমান অবদান রাখে।",
    cta: "বিস্তারিত সূত্র ও চলক দেখুন",
    kpis: [
      { code: "KPI 1", title: "বাস্তব কার্বন হ্রাস", question: "নির্গমন কি সত্যিই কমেছে?", items: ["E1 · Scope 1·2 কর্মদক্ষতা", "E2 · Scope 3 কর্মদক্ষতা"] },
      { code: "KPI 2", title: "লক্ষ্য ও বাস্তবায়ন", question: "লক্ষ্য যথাযথ এবং বাস্তবায়িত হচ্ছে কি?", items: ["T1 · লক্ষ্য নকশা", "T2 · বাস্তবায়ন অগ্রগতি"] },
      { code: "KPI 3", title: "মূলধন বণ্টন", question: "সম্পদ কি রূপান্তরের সঙ্গে সামঞ্জস্যপূর্ণ?", items: ["C1 · সবুজ CAPEX", "C2 · নিম্ন-কার্বন রাজস্ব", "C3 · অভ্যন্তরীণ কার্বন মূল্য", "C4 · জলবায়ু-সংযুক্ত পারিশ্রমিক", "C5 · কার্বন ক্রেডিট ব্যবহার"] },
      { code: "KPI 4", title: "ডেটার বিশ্বাসযোগ্যতা", question: "প্রমাণ ও ফলাফল কি বিশ্বাসযোগ্য?", items: ["R1 · তথ্যের পূর্ণতা", "R2 · হিসাবের স্বচ্ছতা", "R3 · তৃতীয় পক্ষের নিশ্চয়তা", "R4 · তাৎক্ষণিক যাচাই"] },
    ],
  },
  es: {
    badge: "Metodología CERs Index",
    title: "Cuatro perspectivas sobre la reducción de carbono empresarial",
    description: "CERs Index usa información climática, financiera, de gobernanza y verificación pública para evaluar la reducción de carbono.",
    purposeTitle: "Qué evaluamos",
    purpose: "Evaluamos conjuntamente la reducción real, la ejecución de objetivos, la asignación de capital y la credibilidad de los datos.",
    structureTitle: "Estructura del índice",
    structureDescription: "Los cuatro KPI contribuyen por igual al CERs Index final.",
    cta: "Ver fórmulas y variables detalladas",
    kpis: [
      { code: "KPI 1", title: "Reducción real de carbono", question: "¿Se redujeron realmente las emisiones?", items: ["E1 · Desempeño de alcance 1·2", "E2 · Desempeño de alcance 3"] },
      { code: "KPI 2", title: "Objetivos y ejecución", question: "¿Los objetivos son sólidos y se cumplen?", items: ["T1 · Diseño del objetivo", "T2 · Progreso de ejecución"] },
      { code: "KPI 3", title: "Asignación de capital", question: "¿Los recursos se alinean con la transición?", items: ["C1 · CAPEX verde", "C2 · Ingresos bajos en carbono", "C3 · Precio interno del carbono", "C4 · Remuneración ligada al clima", "C5 · Uso de créditos de carbono"] },
      { code: "KPI 4", title: "Credibilidad de los datos", question: "¿Son fiables la evidencia y los resultados?", items: ["R1 · Integridad de la información", "R2 · Transparencia del cálculo", "R3 · Verificación externa", "R4 · Comprobación en tiempo real"] },
    ],
  },
};

const ABOUT_COPY_BY_LOCALE: Record<SupportedLocale, AboutCopy> = {
  ...ABOUT_COPY,
  ...ADDITIONAL_ABOUT_COPY,
};

export async function renderAboutPage(locale: SupportedLocale = "en") {
  const copy = ABOUT_COPY_BY_LOCALE[locale];

  return (
    <AppShell locale={locale}>
      <div className="container py-8 md:py-10">
        <section className="border-b border-slate-200 pb-8 dark:border-slate-800">
          <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:border-teal-500/30 dark:bg-teal-950/40 dark:text-teal-300">
            {copy.badge}
          </span>
          <h1 className="mt-5 max-w-4xl text-[32px] font-bold leading-10 tracking-[-0.03em] text-slate-950 dark:text-white">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-6 text-slate-600 dark:text-slate-300">{copy.description}</p>
        </section>

        <section className="grid gap-8 py-8 lg:grid-cols-2">
          <div>
            <h2 className="text-[22px] font-bold leading-[30px] text-slate-950 dark:text-white">{copy.purposeTitle}</h2>
            <p className="mt-3 text-[15px] leading-6 text-slate-600 dark:text-slate-300">{copy.purpose}</p>
          </div>
          <div>
            <h2 className="text-[22px] font-bold leading-[30px] text-slate-950 dark:text-white">{copy.structureTitle}</h2>
            <p className="mt-3 text-[15px] leading-6 text-slate-600 dark:text-slate-300">{copy.structureDescription}</p>
          </div>
        </section>

        <section className="grid gap-4 border-t border-slate-200 pt-8 md:grid-cols-2 dark:border-slate-800">
          {copy.kpis.map((kpi) => (
            <article key={kpi.code} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <div className="text-[13px] font-semibold text-teal-700 dark:text-teal-300">{kpi.code}</div>
                <h2 className="mt-2 text-[22px] font-bold leading-[30px] text-slate-950 dark:text-white">{kpi.title}</h2>
              </div>
              <p className="mt-3 text-[15px] leading-6 text-slate-500 dark:text-slate-400">{kpi.question}</p>
              <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                {kpi.items.map((item) => (
                  <li key={item} className="text-sm leading-5 text-slate-700 dark:text-slate-200">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-6 flex justify-end">
          <Link href={localizedPath(locale, "/about/logic")} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
            {copy.cta}<ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </AppShell>
  );
}

export default async function AboutPage() {
  return renderAboutPage("en");
}
