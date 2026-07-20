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

export async function renderAboutPage(locale: SupportedLocale = "en") {
  const copy = ABOUT_COPY[locale];

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
