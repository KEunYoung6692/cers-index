"use client";

import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIntlLocale, getTranslations, type SupportedLocale } from "@/lib/cers/i18n";
import type { CersCompanyProfile, CersEmissionHistoryPoint } from "@/lib/cers/types";

type RoadmapPointKind = "actual" | "current" | "target" | "netzero" | "spacer";

type RoadmapChartPoint = {
  key: string;
  year: number;
  label: string;
  phase: string;
  kind: RoadmapPointKind;
  s1: number;
  s2: number;
  total: number;
  lineTotal: number;
  totalActualLine: number | null;
  totalFutureLine: number | null;
};

type CarbonNeutralRoadmapCardProps = {
  company: CersCompanyProfile;
  emissionsHistory?: CersEmissionHistoryPoint[];
  locale?: SupportedLocale;
};

const ROADMAP_PRIMARY_COLOR = "#0f766e";
const ROADMAP_SCOPE1_COLOR = "#0f766e";
const ROADMAP_SCOPE2_COLOR = "#5eead4";
const ROADMAP_TOTAL_LINE_COLOR = "#0f172a";
const ROADMAP_TOTAL_LINE_DARK = "#e2e8f0";
const ROADMAP_TARGET_COLOR = "#6bb7b4";
const ROADMAP_NETZERO_STROKE = ROADMAP_TARGET_COLOR;
const ROADMAP_NETZERO_FILL = "#d9f4f1";

function toSafeNonNegative(value: number | null | undefined) {
  return Number.isFinite(value) ? Math.max(0, value ?? 0) : 0;
}

function formatCompactTick(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}K`;
  return value.toFixed(0);
}

function formatFullNumber(value: number, locale: SupportedLocale, fractionDigits = 0) {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

function buildChartPoints(company: CersCompanyProfile, emissionsHistory: CersEmissionHistoryPoint[]) {
  const currentYear = company.metrics.fiscalYear || company.targetSummary.currentYear || new Date().getFullYear();
  const normalizedHistory = emissionsHistory
    .map((point) => {
      const scope1 = toSafeNonNegative(point.scope1Emissions);
      const scope2 = toSafeNonNegative(point.scope2Emissions);
      const total = toSafeNonNegative(point.totalEmissions ?? scope1 + scope2);

      return {
        fiscalYear: point.fiscalYear,
        scope1Emissions: scope1,
        scope2Emissions: scope2,
        totalEmissions: total,
      };
    })
    .filter((point) => point.totalEmissions > 0 || point.scope1Emissions > 0 || point.scope2Emissions > 0)
    .sort((a, b) => a.fiscalYear - b.fiscalYear);

  const latestHistoryPoint = normalizedHistory.at(-1);
  const currentScope1 = latestHistoryPoint?.scope1Emissions ?? toSafeNonNegative(company.metrics.scope1Emissions);
  const currentScope2 = latestHistoryPoint?.scope2Emissions ?? toSafeNonNegative(company.metrics.scope2Emissions);
  const currentTotal = latestHistoryPoint?.totalEmissions ?? toSafeNonNegative(company.metrics.totalEmissions ?? currentScope1 + currentScope2);

  const targetYear = company.targetSummary.targetYear;
  const targetTotal = toSafeNonNegative(
    company.targetSummary.targetEmissions ??
      (company.targetSummary.reductionPct !== null && currentTotal > 0
        ? currentTotal * (1 - company.targetSummary.reductionPct / 100)
        : null),
  );

  const netZeroYear = company.targetSummary.netZeroYear;

  const basePoints: RoadmapChartPoint[] = [];

  if (normalizedHistory.length > 0) {
    normalizedHistory.forEach((point, index) => {
      const isCurrent = index === normalizedHistory.length - 1;
      basePoints.push({
        key: `${isCurrent ? "current" : "actual"}-${point.fiscalYear}`,
        year: point.fiscalYear,
        label: String(point.fiscalYear),
        phase: isCurrent ? "current" : "actual",
        kind: isCurrent ? "current" : "actual",
        s1: point.scope1Emissions,
        s2: point.scope2Emissions,
        total: point.totalEmissions,
        lineTotal: point.totalEmissions,
        totalActualLine: point.totalEmissions,
        totalFutureLine: isCurrent ? point.totalEmissions : null,
      });
    });
  } else if (currentTotal > 0 || currentScope1 > 0 || currentScope2 > 0) {
    basePoints.push({
      key: `current-${currentYear}`,
      year: currentYear,
      label: String(currentYear),
      phase: "current",
      kind: "current",
      s1: currentScope1,
      s2: currentScope2,
      total: currentTotal,
      lineTotal: currentTotal,
      totalActualLine: currentTotal,
      totalFutureLine: currentTotal,
    });
  }

  if (targetYear) {
    basePoints.push({
      key: `target-${targetYear}`,
      year: targetYear,
      label: String(targetYear),
      phase: "target",
      kind: "target",
      s1: targetTotal,
      s2: 0,
      total: targetTotal,
      lineTotal: targetTotal,
      totalActualLine: null,
      totalFutureLine: targetTotal,
    });
  }

  if (targetYear && netZeroYear && netZeroYear - targetYear > 1) {
    basePoints.push({
      key: "spacer-target-netzero",
      year: Math.round((targetYear + netZeroYear) / 2),
      label: "",
      phase: "",
      kind: "spacer",
      s1: 0,
      s2: 0,
      total: targetTotal / 2,
      lineTotal: targetTotal / 2,
      totalActualLine: null,
      totalFutureLine: targetTotal / 2,
    });
  }

  if (netZeroYear) {
    basePoints.push({
      key: `netzero-${netZeroYear}`,
      year: netZeroYear,
      label: String(netZeroYear),
      phase: "netzero",
      kind: "netzero",
      s1: 0,
      s2: 0,
      total: 0,
      lineTotal: 0,
      totalActualLine: null,
      totalFutureLine: 0,
    });
  }

  const maxTotal = Math.max(...basePoints.map((point) => point.total), 0);
  const lineLift = maxTotal > 0 ? maxTotal * 0.06 : 0;

  return basePoints
    .sort((a, b) => a.year - b.year)
    .map((point) => ({
      ...point,
      lineTotal: point.kind === "netzero" ? 0 : point.total + lineLift,
      totalActualLine: point.kind === "current" || point.kind === "actual" ? point.total + lineLift : null,
      totalFutureLine: point.kind === "current" || point.kind === "target" || point.kind === "netzero" || point.kind === "spacer"
        ? (point.kind === "netzero" ? 0 : point.total + lineLift)
        : null,
    }));
}

function RoadmapDot(props: {
  cx?: number;
  cy?: number;
  payload?: RoadmapChartPoint;
  mode: "actual" | "future";
  color?: string;
}) {
  const { cx, cy, payload, mode, color = ROADMAP_TOTAL_LINE_COLOR } = props;
  if (typeof cx !== "number" || typeof cy !== "number" || !payload) return null;

  if (mode === "actual") {
    if (payload.kind !== "current") return null;
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill={color} stroke="#ffffff" strokeWidth={1.5} />
        <text x={cx} y={cy - 12} fill={color} textAnchor="middle" fontSize={11} fontWeight={700}>
          {formatCompactTick(payload.total)}
        </text>
      </g>
    );
  }

  if (payload.kind === "current" || payload.kind === "actual" || payload.kind === "spacer") return null;

  if (payload.kind === "target") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill={ROADMAP_TARGET_COLOR} stroke="#ffffff" strokeWidth={2} />
        <text x={cx} y={cy - 12} fill={color} textAnchor="middle" fontSize={11} fontWeight={700}>
          {formatCompactTick(payload.total)}
        </text>
      </g>
    );
  }

  const radius = 20;
  const outerRadius = radius + 6;
  const ringRadius = radius + 2;
  const outerSemiPath = `M ${cx - outerRadius} ${cy} A ${outerRadius} ${outerRadius} 0 0 1 ${cx + outerRadius} ${cy} L ${cx - outerRadius} ${cy} Z`;
  const innerSemiPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy} L ${cx - radius} ${cy} Z`;
  const ringArcPath = `M ${cx - ringRadius} ${cy} A ${ringRadius} ${ringRadius} 0 0 1 ${cx + ringRadius} ${cy}`;
  const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

  return (
    <g>
      <path d={outerSemiPath} fill={ROADMAP_NETZERO_STROKE} opacity={0.06} />
      <path d={ringArcPath} fill="none" stroke={ROADMAP_NETZERO_STROKE} strokeWidth={2} strokeLinecap="round" opacity={0.28} />
      <path d={innerSemiPath} fill={ROADMAP_NETZERO_FILL} opacity={0.92} />
      <circle cx={cx} cy={cy - 0.5} r={3.5} fill={ROADMAP_NETZERO_FILL} />
      <path d={arcPath} fill="none" stroke={ROADMAP_NETZERO_STROKE} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

function S1BarShape(props: Record<string, unknown>) {
  const radius: [number, number, number, number] =
    (props.payload as RoadmapChartPoint | undefined)?.kind === "target" ? [4, 4, 0, 0] : [0, 0, 0, 0];
  return <Rectangle {...props} radius={radius} />;
}

function S2BarShape(props: Record<string, unknown>) {
  const radius: [number, number, number, number] =
    (props.payload as RoadmapChartPoint | undefined)?.kind === "current" ? [4, 4, 0, 0] : [0, 0, 0, 0];
  return <Rectangle {...props} radius={radius} />;
}

export function CarbonNeutralRoadmapCard({
  company,
  emissionsHistory = [],
  locale = "en",
}: CarbonNeutralRoadmapCardProps) {
  const t = getTranslations(locale);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const chartPoints = buildChartPoints(company, emissionsHistory);

  if (chartPoints.length === 0) {
    return (
      <Card className="overflow-hidden border-slate-200 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">{t.roadmapWidget.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[240px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
          {t.roadmapWidget.noData}
        </CardContent>
      </Card>
    );
  }

  const currentPoint = chartPoints.find((point) => point.kind === "current");
  const targetPoint = chartPoints.find((point) => point.kind === "target");
  const netZeroPoint = chartPoints.find((point) => point.kind === "netzero");
  const currentTotal = currentPoint?.total ?? 0;
  const targetTotal = targetPoint?.total ?? 0;
  const reductionPct =
    company.targetSummary.reductionPct ??
    (currentTotal > 0 && targetPoint ? ((currentTotal - targetTotal) / currentTotal) * 100 : null);

  const phaseLabels = {
    actual: t.roadmapWidget.phaseActual,
    current: t.roadmapWidget.phaseCurrent,
    target: t.roadmapWidget.phaseTarget,
    netzero: t.roadmapWidget.phaseNetZero,
  };
  const totalLineColor = isDark ? ROADMAP_TOTAL_LINE_DARK : ROADMAP_TOTAL_LINE_COLOR;

  return (
    <Card className="overflow-hidden border-teal-100 shadow-elevated dark:border-teal-900/60 dark:bg-slate-950/80">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
              {t.roadmapWidget.badge}
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.roadmapWidget.title}</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-300">{t.roadmapWidget.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
              {t.roadmapWidget.badgeCurrent} {formatFullNumber(currentTotal, locale)}
            </Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200">
              {t.roadmapWidget.badgeTarget} {targetPoint?.year ?? "—"} · {formatFullNumber(targetTotal, locale)}
            </Badge>
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 dark:border-emerald-900/60 dark:text-emerald-300">
              {t.roadmapWidget.badgeNetZero} {netZeroPoint?.year ?? "—"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.roadmapWidget.kpiCurrent}</p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{formatFullNumber(currentTotal, locale)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.roadmapWidget.unit}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.roadmapWidget.kpiTargetYear}</p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{targetPoint?.year ?? "—"}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.roadmapWidget.targetNote}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.roadmapWidget.kpiTargetEmissions}</p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{formatFullNumber(targetTotal, locale)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.roadmapWidget.unit}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.roadmapWidget.kpiReduction}</p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-emerald-700">
              {reductionPct === null ? "—" : `${Math.max(0, reductionPct).toFixed(1)}%`}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.roadmapWidget.netZeroYearLabel(String(netZeroPoint?.year ?? "—"))}</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.roadmapWidget.timelineCaption}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: ROADMAP_SCOPE1_COLOR }} /> {t.roadmapWidget.scope1}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: ROADMAP_SCOPE2_COLOR }} /> {t.roadmapWidget.scope2}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: totalLineColor }} /> {t.roadmapWidget.total}
              </span>
            </div>
          </div>

          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartPoints} margin={{ top: 52, right: 16, left: 10, bottom: 12 }}>
                <defs>
                  <linearGradient id="roadmap-s1-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ROADMAP_PRIMARY_COLOR} stopOpacity={0.82} />
                    <stop offset="100%" stopColor={ROADMAP_PRIMARY_COLOR} stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="roadmap-s2-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ROADMAP_SCOPE2_COLOR} stopOpacity={0.88} />
                    <stop offset="100%" stopColor={ROADMAP_SCOPE2_COLOR} stopOpacity={0.58} />
                  </linearGradient>
                  <linearGradient id="roadmap-target-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7cc6c1" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#6bb7b4" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis
                  width={58}
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => (typeof value === "number" ? formatCompactTick(value) : "0")}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
                    borderRadius: "18px",
                    boxShadow: "0 18px 48px rgba(15, 23, 42, 0.18)",
                    padding: "8px 10px",
                  }}
                  labelStyle={{ color: isDark ? "#e2e8f0" : "#0f172a", fontSize: 12, fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: isDark ? "#e2e8f0" : "#0f172a", fontSize: 12, padding: 0 }}
                  formatter={(value: number | string, name, context) => {
                    const numeric = typeof value === "number" ? value : Number(value);
                    const payload = context?.payload as RoadmapChartPoint | undefined;
                    const labelMap: Record<string, string> = {
                      s1: t.roadmapWidget.scope1,
                      s2: t.roadmapWidget.scope2,
                      total: t.roadmapWidget.total,
                      totalActualLine: t.roadmapWidget.total,
                      totalFutureLine: t.roadmapWidget.total,
                    };
                    const label = labelMap[String(name)] ?? String(name);
                    if (!Number.isFinite(numeric)) return ["—", label];
                    if (name === "totalActualLine" || name === "totalFutureLine") {
                      return [formatFullNumber(payload?.total ?? 0, locale), label];
                    }
                    return [formatFullNumber(numeric, locale), label];
                  }}
                  labelFormatter={(_, entries) => {
                    const payload = entries?.[0]?.payload as RoadmapChartPoint | undefined;
                    if (!payload || payload.kind === "spacer") return "";
                    return `${phaseLabels[payload.phase as keyof typeof phaseLabels] || payload.phase} · ${payload.year}`;
                  }}
                />

                <Bar
                  dataKey="s1"
                  stackId="emissions"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={44}
                  stroke="none"
                  shape={<S1BarShape />}
                >
                  {chartPoints.map((point) => (
                    <Cell
                      key={`s1-${point.key}`}
                      stroke="none"
                      fill={
                        point.kind === "target"
                          ? "url(#roadmap-target-fill)"
                          : point.kind === "netzero" || point.kind === "spacer"
                            ? "transparent"
                            : "url(#roadmap-s1-fill)"
                      }
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="s2"
                  stackId="emissions"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={44}
                  stroke="none"
                  shape={<S2BarShape />}
                >
                  {chartPoints.map((point) => (
                    <Cell
                      key={`s2-${point.key}`}
                      stroke="none"
                      fill={
                        point.kind === "target" || point.kind === "netzero" || point.kind === "spacer"
                          ? "transparent"
                          : "url(#roadmap-s2-fill)"
                      }
                    />
                  ))}
                </Bar>

                <Line
                  type="linear"
                  dataKey="totalActualLine"
                  stroke={totalLineColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  connectNulls={false}
                  dot={<RoadmapDot mode="actual" color={totalLineColor} />}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                />

                <Line
                  type="linear"
                  dataKey="totalFutureLine"
                  stroke={totalLineColor}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  connectNulls={false}
                  dot={<RoadmapDot mode="future" color={totalLineColor} />}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="phase"
                    position="top"
                    offset={26}
                    style={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11, fontWeight: 600 }}
                    formatter={(value: string) => {
                      if (value === "target") return t.roadmapWidget.phaseTarget;
                      if (value === "netzero") return t.roadmapWidget.phaseNetZero;
                      return "";
                    }}
                  />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
