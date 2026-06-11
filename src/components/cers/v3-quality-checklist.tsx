import { CheckCircle2, CircleDashed, XCircle } from "lucide-react";
import { deriveV3Quality, formatScore } from "@/lib/cers/public";
import type { CersCompanyProfile } from "@/lib/cers/types";
import type { SupportedLocale } from "@/lib/cers/i18n";

type V3QualityChecklistProps = {
  company: CersCompanyProfile;
  locale?: SupportedLocale;
};

function ScoreIcon({ score }: { score: 1 | 0.5 | 0 | null }) {
  if (score === 1) return <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />;
  if (score === 0.5) return <CircleDashed className="h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400" />;
  return <XCircle className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />;
}

function scoreToRowClass(score: 1 | 0.5 | 0 | null) {
  if (score === 1) return "border-teal-100 bg-teal-50/60 dark:border-teal-900/40 dark:bg-teal-950/20";
  if (score === 0.5) return "border-amber-100 bg-amber-50/60 dark:border-amber-900/30 dark:bg-amber-950/20";
  return "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60";
}

export function V3QualityChecklist({ company, locale = "en" }: V3QualityChecklistProps) {
  const items = deriveV3Quality(company);
  const scored = items.filter((i) => i.score !== null);
  const sum = scored.reduce((acc, i) => acc + (i.score ?? 0), 0);
  const geometricMean =
    scored.length > 0
      ? Math.pow(
          scored.reduce((prod, i) => prod * (i.score === 0 ? 0.001 : (i.score ?? 0)), 1),
          1 / scored.length,
        )
      : null;
  const displayScore = geometricMean !== null ? Math.min(1, geometricMean) * 100 : null;

  const title = locale === "ko" ? "V3 감축목표 품질 체크리스트" : "V3 Target Design Quality";
  const subtitle =
    locale === "ko"
      ? "8개 서브컴포넌트 기반 목표 설계 품질 (기하평균)"
      : "8-component target credibility check (geometric mean)";

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        {displayScore !== null && (
          <div className="rounded-[20px] bg-sky-50 px-5 py-3 text-right dark:bg-sky-950/30">
            <div className="text-2xl font-semibold tracking-tight text-sky-700 dark:text-sky-300">
              {formatScore(displayScore)}
            </div>
            <div className="mt-0.5 text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              {locale === "ko" ? "V3 추정 점수" : "V3 est. score"}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-2">
        {items.map((item) => (
          <div
            key={item.key}
            className={`flex items-center gap-3 rounded-2xl border px-3 py-2 ${scoreToRowClass(item.score)}`}
          >
            <ScoreIcon score={item.score} />
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {locale === "ko" ? item.labelKo : item.labelEn}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {item.note && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.note}</span>
                )}
                <span
                  className={`w-8 text-right text-xs font-mono font-semibold ${
                    item.score === 1
                      ? "text-teal-600 dark:text-teal-400"
                      : item.score === 0.5
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-slate-400 dark:text-slate-600"
                  }`}
                >
                  {item.score === null ? "—" : item.score.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        <span>
          {locale === "ko"
            ? "✓ 충족 · ◎ 부분 충족 · ✗ 미충족 (기하평균 — 핵심 요건 미충족 시 전체 점수 큰 감점)"
            : "✓ Full · ◎ Partial · ✗ Missing — geometric mean penalizes any missing core element heavily"}
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {locale === "ko" ? `합산 ${sum.toFixed(1)} / ${scored.length}` : `Sum ${sum.toFixed(1)} / ${scored.length}`}
        </span>
      </div>
    </div>
  );
}
