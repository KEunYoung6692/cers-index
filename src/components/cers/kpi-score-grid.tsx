import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatScore } from "@/lib/cers/public";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";
import type { CersCategoryScore } from "@/lib/cers/types";

type KpiScoreGridProps = {
  categories?: CersCategoryScore[];
  locale?: SupportedLocale;
  showMethodLink?: boolean;
  showScores?: boolean;
};

const KPI_TONE = {
  accent: "bg-teal-500",
  border: "border-slate-200 dark:border-slate-800",
  surface: "bg-white dark:bg-slate-950/80",
  text: "text-teal-700 dark:text-teal-300",
} as const;

export function KpiScoreGrid({
  categories = [],
  locale = "en",
  showMethodLink = false,
  showScores = true,
}: KpiScoreGridProps) {
  const t = getTranslations(locale);
  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 4);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {t.kpi.items.map((item, index) => {
          const category = sortedCategories[index];
          const score = category?.rawScore ?? null;
          const tone = KPI_TONE;
          const width = score === null ? 0 : Math.max(0, Math.min(100, score));

          return (
            <article
              key={item.code}
              className={`relative overflow-hidden rounded-[26px] border p-5 ${tone.border} ${tone.surface}`}
            >
              <div className={`absolute inset-x-0 top-0 h-1 ${tone.accent}`} />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] ${tone.text}`}>{item.code}</p>
                  <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-950 dark:text-white">
                    {item.title}
                  </h3>
                </div>
                {showScores && (
                  <div className={`text-2xl font-semibold tabular-nums tracking-tight ${tone.text}`}>
                    {formatScore(score)}
                  </div>
                )}
              </div>

              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>

              {showScores && (
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900/80">
                  <div className={`h-full rounded-full ${tone.accent}`} style={{ width: `${width}%` }} />
                </div>
              )}
              <p className={`${showScores ? "mt-3" : "mt-5"} text-xs font-medium text-slate-500 dark:text-slate-400`}>
                {item.variables}
              </p>
            </article>
          );
        })}
      </div>

      {showMethodLink && (
        <div className="mt-5 flex justify-end">
          <Link
            href={localizedPath(locale, "/about/logic")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-teal-700 dark:text-slate-200 dark:hover:text-teal-300"
          >
            {t.kpi.methodLink}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
