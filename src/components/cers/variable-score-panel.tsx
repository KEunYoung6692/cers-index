import { formatScore } from "@/lib/cers/public";
import type { CersCategoryScore } from "@/lib/cers/types";
import type { SupportedLocale } from "@/lib/cers/i18n";

type VariableScorePanelProps = {
  categories: CersCategoryScore[];
  locale?: SupportedLocale;
};

function getVariableTone(code: string) {
  const c = code.toLowerCase();
  if (c === "v1") return { bar: "bg-teal-500", text: "text-teal-700 dark:text-teal-300" };
  if (c === "v2") return { bar: "bg-cyan-500", text: "text-cyan-700 dark:text-cyan-300" };
  if (c === "v3") return { bar: "bg-sky-500", text: "text-sky-700 dark:text-sky-300" };
  if (c === "v4") return { bar: "bg-blue-500", text: "text-blue-700 dark:text-blue-300" };
  if (c === "v5") return { bar: "bg-violet-500", text: "text-violet-700 dark:text-violet-300" };
  if (c === "v6") return { bar: "bg-purple-500", text: "text-purple-700 dark:text-purple-300" };
  if (c === "v7") return { bar: "bg-amber-500", text: "text-amber-700 dark:text-amber-300" };
  if (c === "v8") return { bar: "bg-orange-400", text: "text-orange-700 dark:text-orange-300" };
  if (c === "v9") return { bar: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-300" };
  // fallback for cat1-cat4
  if (c === "cat1") return { bar: "bg-teal-500", text: "text-teal-700 dark:text-teal-300" };
  if (c === "cat2") return { bar: "bg-sky-500", text: "text-sky-700 dark:text-sky-300" };
  if (c === "cat3") return { bar: "bg-violet-500", text: "text-violet-700 dark:text-violet-300" };
  return { bar: "bg-slate-400", text: "text-slate-700 dark:text-slate-300" };
}

export function VariableScorePanel({ categories, locale = "en" }: VariableScorePanelProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        {locale === "ko" ? "변수별 점수 정보가 없습니다." : "No variable score data available."}
      </div>
    );
  }

  const weightLabel = locale === "ko" ? "가중 기여" : "Weighted";

  return (
    <div className="space-y-3">
      {categories.map((category) => {
        const tone = getVariableTone(category.code);
        const score = category.rawScore;
        const barWidth = score === null ? "0%" : `${Math.max(0, Math.min(100, score))}%`;
        const isNA = score === null;

        return (
          <div
            key={category.code}
            className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950/80"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-[0.14em] ${tone.text}`}>
                    {category.code.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {category.label}
                  </span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                {isNA ? (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
                    N/A
                  </span>
                ) : (
                  <span className={`text-lg font-semibold tracking-tight ${tone.text}`}>
                    {formatScore(score)}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${tone.bar}`}
                style={{ width: barWidth }}
              />
            </div>

            {!isNA && category.weightedScore !== null && (
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>{weightLabel}: {formatScore(category.weightedScore)}</span>
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  {(category.weight * 100).toFixed(0)}% weight
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
