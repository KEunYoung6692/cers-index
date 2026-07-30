import type { ReactNode } from "react";
import type { SupportedLocale } from "@/lib/cers/i18n";

type VariableId = "e1" | "e2" | "t1" | "t2" | "c1" | "c2" | "c3" | "c4" | "c5" | "r1" | "r2" | "r3" | "r4";
type KpiId = "kpi1" | "kpi2" | "kpi3" | "kpi4";

type Copy = {
  eyebrow: string;
  title: string;
  intro: string;
  aggregation: string;
  aggregationBody: string;
  variables: string;
  criteria: string;
  sources: string;
  kpis: Record<KpiId, { title: string; description: string }>;
  items: Record<VariableId, { title: string; description: string; criteria: string[]; sources: string }>;
};

const KPI_VARIABLES: Record<KpiId, VariableId[]> = {
  kpi1: ["e1", "e2"],
  kpi2: ["t1", "t2"],
  kpi3: ["c1", "c2", "c3", "c4", "c5"],
  kpi4: ["r1", "r2", "r3", "r4"],
};

const FORMULAS: Record<VariableId, ReactNode[]> = {
  e1: [
    <>I<sub>t</sub> = E12<sub>t</sub> / D<sub>t</sub>, &nbsp;r = 1 − (I<sub>t</sub> / I<sub>t−3</sub>)<sup>1/3</sup></>,
    <>g = (E12<sub>t</sub> / E12<sub>t−3</sub>)<sup>1/3</sup> − 1</>,
    <>E1 = 100 × (r − g) / 0.042</>,
  ],
  e2: [
    <>r = (E3<sub>t−3</sub> − E3<sub>t</sub>) / (3 × E3<sub>t−3</sub>)</>,
    <>E2 = 100 × r / 0.025</>,
  ],
  t1: [<>T1 = 100 × (Σ element scores / 5)</>],
  t2: [
    <>A<sub>t</sub> = (E<sub>b</sub> − E<sub>t</sub>) / E<sub>b</sub></>,
    <>P<sub>t</sub> = R × (t − b) / (T − b)</>,
    <>T2 = 100 × A<sub>t</sub> / P<sub>t</sub></>,
  ],
  c1: [<>C1 = 100 × Green CAPEX<sub>t</sub> / Total CAPEX<sub>t</sub></>],
  c2: [<>C2 = 100 × Low-carbon revenue<sub>t</sub> / Revenue<sub>t</sub></>],
  c3: [<>C3 ∈ {"{"}100, 25, 0{"}"}</>],
  c4: [<>C4 ∈ {"{"}100, 0{"}"}</>],
  c5: [<>C5 = (certification + dependency + disclosure + procurement) / 4</>],
  r1: [<>R1 = 100 × (Σ element scores / 5)</>],
  r2: [<>R2 = 100 × (Σ element scores / 5)</>],
  r3: [<>R3 = 100 × (Σ element scores / 4)</>],
  r4: [<>R4 ∈ {"{"}100, 75, 50, 25, 0{"}"}, &nbsp;N ≥ N<sub>min</sub></>],
};

const ko: Copy = {
  eyebrow: "CERs Index 평가방법론",
  title: "CERs Index 산정 기준",
  intro: "기업의 실제 감축성과, 목표 이행, 자본배분, 데이터 신뢰성을 13개 변수로 평가합니다.",
  aggregation: "지수 산정",
  aggregationBody: "각 KPI 안에서 변수 점수를 평균한 뒤, 네 KPI를 동일한 비중으로 합산합니다.",
  variables: "변수별 산정 기준",
  criteria: "평가 기준",
  sources: "주요 기준",
  kpis: {
    kpi1: { title: "KPI 1. 배출 감축성과", description: "Scope 1·2와 Scope 3의 실제 배출 감축을 평가합니다." },
    kpi2: { title: "KPI 2. 목표와 이행", description: "감축목표의 설계 수준과 목표 경로 대비 이행 실적을 평가합니다." },
    kpi3: { title: "KPI 3. 자본배분과 전환", description: "투자·매출·내부탄소가격·보상·탄소크레딧을 통해 전환 실행력을 평가합니다." },
    kpi4: { title: "KPI 4. 데이터 신뢰성", description: "공시의 완전성, 산정 근거, 외부 검증과 교차검증 신호를 평가합니다." },
  },
  items: {
    e1: { title: "E1. Scope 1·2 실제 감축", description: "매출 대비 배출집약도 개선과 절대배출 변화율을 함께 반영합니다.", criteria: ["E12: Scope 1과 Scope 2 배출량의 합", "D: 매출액", "θ = 연 4.2% 감축 기준"], sources: "기업 공시, SBTi" },
    e2: { title: "E2. Scope 3 실제 감축", description: "최근 3년간 Scope 3 절대배출량의 연평균 감축률을 평가합니다.", criteria: ["E3: Scope 3 절대배출량", "θ = 연 2.5% 감축 기준"], sources: "기업 공시, SBTi" },
    t1: { title: "T1. 감축목표 설계", description: "목표가 실행 가능한 형태로 구체화되어 있는지 평가합니다.", criteria: ["목표 유형·기준연도·목표연도: 각 1 또는 0", "배출범위: Scope 1·2와 Scope 3 충족 1, 하나만 충족 0.5", "SBTi 승인 1, 유효한 서약 0.5, 그 외 0"], sources: "기업 공시, SBTi" },
    t2: { title: "T2. 목표 이행 진척도", description: "기준연도부터 목표연도까지의 필요 감축 경로와 실제 감축률을 비교합니다.", criteria: ["E_b: 기준연도 배출량, E_t: 평가연도 배출량", "R: 목표 감축률, b·t·T: 기준·평가·목표연도"], sources: "기업 공시" },
    c1: { title: "C1. 녹색 CAPEX", description: "전체 자본적 지출 중 녹색 투자 비중을 평가합니다.", criteria: ["녹색 CAPEX와 전체 CAPEX가 모두 확인되는 경우 산정"], sources: "기업 재무·지속가능성 공시" },
    c2: { title: "C2. 저탄소 매출", description: "전체 매출 중 저탄소 제품·서비스 매출 비중을 평가합니다.", criteria: ["저탄소 매출과 전체 매출이 모두 확인되는 경우 산정"], sources: "기업 재무·지속가능성 공시" },
    c3: { title: "C3. 내부탄소가격", description: "내부탄소가격의 운영 여부와 적용 가격 공개 수준을 평가합니다.", criteria: ["운영 및 적용 가격 공개 100", "운영 공개, 가격 미공개 25", "미운영 또는 확인 불가 0"], sources: "기업 공시" },
    c4: { title: "C4. 기후성과와 보상 연계", description: "경영진 보상에 기후성과가 명시적으로 연계되어 있는지 평가합니다.", criteria: ["명시적 연계 100", "연계가 확인되지 않음 0"], sources: "보수·지배구조·지속가능성 공시" },
    c5: { title: "C5. 탄소크레딧 사용", description: "탄소크레딧의 품질과 사용 방식을 네 가지 항목으로 평가합니다.", criteria: ["인증 수준", "상쇄 의존도", "크레딧 세부정보 공개", "조달 방식"], sources: "ICVCM CCP, VCMI Claims Code, Oxford Principles, 등록부·기업 공시" },
    r1: { title: "R1. 배출정보 완전성", description: "배출정보가 비교 가능한 범위와 기간으로 공개되는지 평가합니다.", criteria: ["Scope 1·2 공개", "Scope 3 및 범주 공개", "3개년 정보", "불리한 정보 공개", "공공·규제 데이터와의 일치"], sources: "기업 및 공공 공시" },
    r2: { title: "R2. 산정 근거 명확성", description: "배출량 산정의 경계와 방법을 재현할 수 있을 정도로 공개하는지 평가합니다.", criteria: ["조직 경계", "Scope 2 산정 방식", "산정 방법론", "배출계수 출처", "제외 항목"], sources: "GHG Protocol, 기업 공시" },
    r3: { title: "R3. 제3자 검증", description: "독립된 제3자 검증의 수준, 범위, 수행기관과 기준을 평가합니다.", criteria: ["합리적 보증 1, 제한적 보증 0.5, 없음 0", "Scope 1·2·3 검증 1, Scope 1·2 검증 0.5", "검증기관 적격성 및 검증기준 명시: 각 1 또는 0"], sources: "검증보고서, 기업 공시" },
    r4: { title: "R4. 실시간 교차검증", description: "관측·추정 데이터의 변화 방향이 기업 배출 추세와 일치하는지 확인합니다.", criteria: ["최소 유효 표본 수를 충족한 경우 평가", "추세의 일치·불일치 정도에 따라 100·75·50·25·0", "배출량 자체의 확정값이 아니라 일관성 신호로 사용"], sources: "WMO IG3IS, BEACON, Climate TRACE" },
  },
};

const en: Copy = {
  ...ko,
  eyebrow: "CERs Index methodology",
  title: "How the CERs Index is calculated",
  intro: "Thirteen variables assess actual emissions reduction, target delivery, capital allocation and data reliability.",
  aggregation: "Index calculation",
  aggregationBody: "Variable scores are averaged within each KPI, then the four KPIs are combined at equal weight.",
  variables: "Variable definitions",
  criteria: "Assessment criteria",
  sources: "Primary references",
  kpis: {
    kpi1: { title: "KPI 1. Emissions reduction", description: "Actual Scope 1·2 and Scope 3 reductions." },
    kpi2: { title: "KPI 2. Targets and delivery", description: "Target design and progress against the required pathway." },
    kpi3: { title: "KPI 3. Capital allocation and transition", description: "Transition execution through investment, revenue, carbon pricing, pay and credits." },
    kpi4: { title: "KPI 4. Data reliability", description: "Completeness, calculation basis, assurance and cross-validation signals." },
  },
  items: Object.fromEntries(Object.entries(ko.items).map(([id, item]) => [id, { ...item, title: item.title.replace("실제 감축", "Actual reduction").replace("감축목표 설계", "Target design").replace("목표 이행 진척도", "Target delivery").replace("녹색 CAPEX", "Green CAPEX").replace("저탄소 매출", "Low-carbon revenue").replace("내부탄소가격", "Internal carbon price").replace("기후성과와 보상 연계", "Climate-linked pay").replace("탄소크레딧 사용", "Carbon credit use").replace("배출정보 완전성", "Disclosure completeness").replace("산정 근거 명확성", "Calculation transparency").replace("제3자 검증", "Third-party assurance").replace("실시간 교차검증", "Real-time cross-validation") }])) as Copy["items"],
};

const ja: Copy = {
  ...ko,
  eyebrow: "CERs Index 評価方法論",
  title: "CERs Index の算定基準",
  intro: "実際の排出削減、目標達成、資本配分、データ信頼性を13変数で評価します。",
  aggregation: "指数の算定",
  aggregationBody: "各KPI内で変数スコアを平均し、4つのKPIを同じ比重で統合します。",
  variables: "変数別の算定基準",
  criteria: "評価基準",
  sources: "主な基準",
};

const zh: Copy = {
  ...en,
  eyebrow: "CERs Index 方法论",
  title: "CERs Index 如何计算",
  intro: "十三个变量评估实际减排、目标执行、资本配置和数据可靠性。",
  aggregation: "指数计算",
  aggregationBody: "先在各 KPI 内对变量评分取平均，再对四个 KPI 等权汇总。",
  variables: "变量定义",
  criteria: "评估标准",
  sources: "主要参考",
};

const vi: Copy = {
  ...en,
  eyebrow: "Phương pháp CERs Index",
  title: "Cách tính CERs Index",
  intro: "Mười ba biến đánh giá mức giảm phát thải thực tế, thực hiện mục tiêu, phân bổ vốn và độ tin cậy dữ liệu.",
  aggregation: "Tính chỉ số",
  aggregationBody: "Điểm biến được lấy trung bình trong từng KPI, sau đó bốn KPI được kết hợp với trọng số bằng nhau.",
  variables: "Định nghĩa biến",
  criteria: "Tiêu chí đánh giá",
  sources: "Tài liệu tham khảo chính",
};

const ru: Copy = {
  ...en,
  eyebrow: "Методология CERs Index",
  title: "Как рассчитывается CERs Index",
  intro: "Тринадцать переменных оценивают фактическое сокращение выбросов, выполнение целей, распределение капитала и надёжность данных.",
  aggregation: "Расчёт индекса",
  aggregationBody: "Оценки переменных усредняются внутри каждого KPI, затем четыре KPI объединяются с равным весом.",
  variables: "Определения переменных",
  criteria: "Критерии оценки",
  sources: "Основные источники",
};

const id: Copy = {
  ...en,
  eyebrow: "Metodologi CERs Index",
  title: "Cara menghitung CERs Index",
  intro: "Tiga belas variabel menilai pengurangan emisi aktual, pelaksanaan target, alokasi modal, dan keandalan data.",
  aggregation: "Perhitungan indeks",
  aggregationBody: "Skor variabel dirata-ratakan dalam setiap KPI, lalu keempat KPI digabungkan dengan bobot yang sama.",
  variables: "Definisi variabel",
  criteria: "Kriteria penilaian",
  sources: "Referensi utama",
};

const th: Copy = {
  ...en,
  eyebrow: "ระเบียบวิธี CERs Index",
  title: "วิธีคำนวณ CERs Index",
  intro: "ตัวแปรสิบสามรายการประเมินการลดการปล่อยจริง การดำเนินการตามเป้าหมาย การจัดสรรเงินทุน และความน่าเชื่อถือของข้อมูล",
  aggregation: "การคำนวณดัชนี",
  aggregationBody: "หาค่าเฉลี่ยคะแนนตัวแปรภายในแต่ละ KPI แล้วรวม KPI ทั้งสี่ด้วยน้ำหนักเท่ากัน",
  variables: "คำจำกัดความของตัวแปร",
  criteria: "เกณฑ์การประเมิน",
  sources: "แหล่งอ้างอิงหลัก",
};

const bn: Copy = {
  ...en,
  eyebrow: "CERs Index পদ্ধতি",
  title: "CERs Index যেভাবে গণনা করা হয়",
  intro: "তেরোটি চলক বাস্তব নির্গমন হ্রাস, লক্ষ্য বাস্তবায়ন, মূলধন বণ্টন ও ডেটার নির্ভরযোগ্যতা মূল্যায়ন করে।",
  aggregation: "সূচক গণনা",
  aggregationBody: "প্রতিটি KPI-এর মধ্যে চলকের স্কোর গড় করা হয়, তারপর চারটি KPI সমান ওজনে একত্র করা হয়।",
  variables: "চলকের সংজ্ঞা",
  criteria: "মূল্যায়ন মানদণ্ড",
  sources: "প্রধান সূত্র",
};

const es: Copy = {
  ...en,
  eyebrow: "Metodología CERs Index",
  title: "Cómo se calcula CERs Index",
  intro: "Trece variables evalúan la reducción real de emisiones, la ejecución de objetivos, la asignación de capital y la fiabilidad de los datos.",
  aggregation: "Cálculo del índice",
  aggregationBody: "Las puntuaciones se promedian dentro de cada KPI y los cuatro KPI se combinan con la misma ponderación.",
  variables: "Definición de variables",
  criteria: "Criterios de evaluación",
  sources: "Referencias principales",
};

const COPY: Record<SupportedLocale, Copy> = { ko, en, zh, ja, vi, ru, id, th, bn, es };

function Formula({ children }: { children: ReactNode }) {
  return <div className="font-mono text-[13px] leading-6 text-slate-800 dark:text-slate-100">{children}</div>;
}

export default function ScoreLogicV3({ locale = "en" }: { locale?: SupportedLocale }) {
  const copy = COPY[locale];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">{copy.eyebrow}</p>
        <h1 className="mt-3 text-[32px] font-bold leading-10 tracking-tight text-slate-950 dark:text-white">{copy.title}</h1>
        <p className="mt-4 text-[15px] leading-6 text-slate-600 dark:text-slate-300">{copy.intro}</p>
      </header>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <h2 className="text-[22px] font-bold leading-[30px] text-slate-950 dark:text-white">{copy.aggregation}</h2>
        <p className="mt-2 text-[15px] leading-6 text-slate-600 dark:text-slate-300">{copy.aggregationBody}</p>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><Formula>K<sub>j</sub> = (1 / n<sub>j</sub>) × Σ V<sub>j,i</sub> &nbsp; (n<sub>1</sub>=2, n<sub>2</sub>=2, n<sub>3</sub>=5, n<sub>4</sub>=4)</Formula></div>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><Formula>CERs Index = (K<sub>1</sub> + K<sub>2</sub> + K<sub>3</sub> + K<sub>4</sub>) / 4</Formula></div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[22px] font-bold leading-[30px] text-slate-950 dark:text-white">{copy.variables}</h2>
        <div className="mt-6 space-y-10">
          {(Object.keys(KPI_VARIABLES) as KpiId[]).map((kpiId) => (
            <section key={kpiId}>
              <div className="border-l-4 border-teal-600 pl-4">
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">{copy.kpis[kpiId].title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy.kpis[kpiId].description}</p>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {KPI_VARIABLES[kpiId].map((id) => {
                  const item = copy.items[id];
                  return (
                    <article key={id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                      <h4 className="text-base font-bold text-slate-950 dark:text-white">{item.title}</h4>
                      <p className="mt-2 text-[15px] leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                      <div className="mt-4 space-y-1 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-900">{FORMULAS[id].map((line, index) => <Formula key={index}>{line}</Formula>)}</div>
                      <h5 className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">{copy.criteria}</h5>
                      <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.criteria.map((criterion) => <li key={criterion} className="flex gap-2"><span aria-hidden className="text-teal-600">•</span><span>{criterion}</span></li>)}</ul>
                      <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400"><span className="font-semibold">{copy.sources}:</span> {item.sources}</p>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
