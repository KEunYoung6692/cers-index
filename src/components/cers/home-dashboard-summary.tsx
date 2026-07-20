import type { CersCompanyProfile } from "@/lib/cers/types";
import type { SupportedLocale } from "@/lib/cers/i18n";

type Props = {
  companies: CersCompanyProfile[];
  locale: SupportedLocale;
};

const COPY = {
  ko: { title: "전체 현황 요약", completed: "평가 완료 기업", unit: "개", year: "최신 평가연도", distribution: "점수 분포", noData: "공개된 평가 결과가 없습니다." },
  en: { title: "Overall snapshot", completed: "Companies assessed", unit: "", year: "Latest assessment year", distribution: "Score distribution", noData: "No assessment results have been published." },
  ja: { title: "全体状況の概要", completed: "評価完了企業", unit: "社", year: "最新評価年度", distribution: "スコア分布", noData: "公開済みの評価結果はありません。" },
} as const;

const BANDS = [
  { min: 0, max: 20, label: "0–19" },
  { min: 20, max: 40, label: "20–39" },
  { min: 40, max: 60, label: "40–59" },
  { min: 60, max: 80, label: "60–79" },
  { min: 80, max: Number.POSITIVE_INFINITY, label: "80+" },
] as const;

export function HomeDashboardSummary({ companies, locale }: Props) {
  const copy = COPY[locale];
  const assessed = companies.filter((company) => company.overallScore !== null && Number.isFinite(company.overallScore));
  const scores = assessed.map((company) => company.overallScore as number);
  const latestYear = assessed.reduce<number | null>((latest, company) => {
    const year = company.scoreFiscalYear;
    return year !== null && (latest === null || year > latest) ? year : latest;
  }, null);
  const distribution = BANDS.map((band) => ({ ...band, count: scores.filter((score) => score >= band.min && score < band.max).length }));
  const largestBand = Math.max(1, ...distribution.map((band) => band.count));

  return (
    <section aria-labelledby="dashboard-summary-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="border-b border-slate-200 px-5 py-5 md:px-8 dark:border-slate-800">
        <h1 id="dashboard-summary-title" className="text-[22px] font-bold leading-[30px] tracking-[-0.02em] text-slate-950 dark:text-white">{copy.title}</h1>
      </div>

      <div className="grid border-b border-slate-200 sm:grid-cols-2 dark:border-slate-800">
        {[
          { label: copy.completed, value: `${assessed.length}${copy.unit}` },
          { label: copy.year, value: latestYear === null ? "—" : String(latestYear) },
        ].map((item) => (
          <div key={item.label} className="border-b border-slate-100 px-5 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 md:px-8 dark:border-slate-800">
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-2 text-[28px] font-bold leading-9 tabular-nums tracking-[-0.025em] text-slate-950 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>

      {assessed.length === 0 ? (
        <p className="px-5 py-8 text-sm text-slate-500 md:px-8 dark:text-slate-400">{copy.noData}</p>
      ) : (
        <div className="px-5 py-6 md:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{copy.distribution}</h2>
            <div className="mt-5 flex h-36 items-end gap-3" role="img" aria-label={copy.distribution}>
              {distribution.map((band) => (
                <div key={band.label} className="flex h-full min-w-0 flex-1 flex-col justify-end text-center">
                  <span className="mb-2 text-xs font-semibold tabular-nums text-slate-500">{band.count}</span>
                  <div className="mx-auto w-full max-w-14 rounded-t-md bg-teal-600/90" style={{ height: `${Math.max(4, (band.count / largestBand) * 88)}px` }} />
                  <span className="mt-2 text-[11px] tabular-nums text-slate-400">{band.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
