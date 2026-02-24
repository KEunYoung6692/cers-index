"use client";

import { useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EmissionData, Target } from "@/data/mockData";
import type { I18nStrings } from "@/lib/i18n";

type RoadmapPointKind = "actual" | "target" | "netzero" | "spacer";

type RoadmapPoint = {
  key: string;
  year: number;
  label: string;
  phase: string;
  kind: RoadmapPointKind;
  s1: number;
  s2: number;
  total: number;
  synthetic?: boolean;
};

type RoadmapChartPoint = RoadmapPoint & {
  lineTotal: number;
  totalActualLine: number | null;
  totalFutureLine: number | null;
};

interface CarbonNeutralRoadmapCardProps {
  emissionsData: EmissionData[];
  target: Target | undefined;
  selectedYear?: number;
  strings: I18nStrings;
}

const ROADMAP_PRIMARY_COLOR = "hsl(var(--primary))";
const ROADMAP_SCOPE1_COLOR = "hsl(var(--primary) / 0.70)";
const ROADMAP_SCOPE2_COLOR = "hsl(var(--primary) / 0.35)";
const ROADMAP_TOTAL_LINE_COLOR = "hsl(var(--primary))";
const ROADMAP_TARGET_COLOR = "#6bb7b4";
const ROADMAP_NETZERO_STROKE = ROADMAP_TARGET_COLOR;
const ROADMAP_NETZERO_FILL = "#d9f4f1";

function toSafeNonNegative(value: number | undefined) {
  return Number.isFinite(value) ? Math.max(0, value ?? 0) : 0;
}

function formatCompactTick(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}K`;
  return value.toFixed(0);
}

function formatFullNumber(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

function buildRoadmapPoints(emissionsData: EmissionData[], target: Target | undefined, selectedYear?: number): RoadmapPoint[] {
  const availableYears = emissionsData.map((d) => d.year);
  const maxYear = availableYears.length > 0 ? Math.max(...availableYears) : undefined;
  const upperYear = selectedYear ?? maxYear;
  const filtered = upperYear !== undefined ? emissionsData.filter((d) => d.year <= upperYear) : emissionsData;
  const scoped = (filtered.length > 0 ? filtered : emissionsData)
    .map((d) => {
      const s1 = toSafeNonNegative(d.s1Emissions);
      const s2 = toSafeNonNegative(d.s2Emissions);
      const total = Number.isFinite(d.totalEmissions) ? toSafeNonNegative(d.totalEmissions) : s1 + s2;
      return { year: d.year, s1, s2, total };
    })
    .sort((a, b) => a.year - b.year);

  if (scoped.length === 0) return [];

  const first = scoped[0];
  const latest = scoped[scoped.length - 1];
  const prev = scoped.length > 1 ? scoped[scoped.length - 2] : undefined;
  const base2024 = scoped.find((d) => d.year === 2024) ?? latest;
  // Temporary roadmap scenario until a dedicated DB table is added.
  // Rule: 2030 target = 50% of 2024 total, Net Zero = 2050 for all companies.
  const targetYear = 2030;
  const targetTotal = Math.max(0, base2024.total * 0.5);
  const targetPoint = {
    year: targetYear,
    s1: targetTotal,
    s2: 0,
    total: targetTotal,
  };

  // Temporary scenario until DB model is added: assumed final net-zero year and linear decline to zero.
  const netZeroYear = 2050;
  const netZeroPoint = {
    year: netZeroYear,
    s1: 0,
    s2: 0,
    total: 0,
  };

  const actualMilestones = [first, prev, latest]
    .filter((p, index, arr): p is typeof first => Boolean(p) && arr.findIndex((x) => x?.year === p.year) === index)
    .map((p, index, arr) => ({
      key: `actual-${p.year}`,
      year: p.year,
      label: String(p.year),
      phase: index === arr.length - 1 ? "Current" : "Actual",
      kind: "actual" as const,
      s1: p.s1,
      s2: p.s2,
      total: p.total,
      synthetic: false,
    }));

  const roadmapPoints: RoadmapPoint[] = [
    ...actualMilestones,
    {
      key: `target-${targetPoint.year}`,
      year: targetPoint.year,
      label: String(targetPoint.year),
      phase: "Target",
      kind: "target",
      s1: targetPoint.s1,
      s2: targetPoint.s2,
      total: targetPoint.total,
      synthetic: true,
    },
    {
      key: `netzero-${netZeroPoint.year}`,
      year: netZeroPoint.year,
      label: String(netZeroPoint.year),
      phase: "Net Zero",
      kind: "netzero",
      s1: 0,
      s2: 0,
      total: 0,
      synthetic: true,
    },
  ];

  return roadmapPoints
    .sort((a, b) => a.year - b.year || a.kind.localeCompare(b.kind))
    .filter((point, index, arr) => arr.findIndex((item) => item.key === point.key) === index);
}

function RoadmapDot(props: any) {
  const { cx, cy, payload, mode } = props;
  if (typeof cx !== "number" || typeof cy !== "number" || !payload) return null;

  if (mode === "actual") {
    if (payload.kind !== "actual") return null;
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill={ROADMAP_TOTAL_LINE_COLOR} stroke="hsl(var(--background))" strokeWidth={1.5} />
        <text
          x={cx}
          y={cy - 12}
          fill={ROADMAP_TOTAL_LINE_COLOR}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
        >
          {formatCompactTick(payload.total)}
        </text>
      </g>
    );
  }

  if (payload.kind === "actual") return null;
  if (payload.kind === "spacer") return null;

  if (payload.kind === "target") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill={ROADMAP_TARGET_COLOR} stroke="hsl(var(--background))" strokeWidth={2} />
        <text
          x={cx}
          y={cy - 12}
          fill={ROADMAP_TOTAL_LINE_COLOR}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
        >
          {formatCompactTick(payload.total)}
        </text>
      </g>
    );
  }

  if (payload.kind === "netzero") {
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

  return null;
}

function RoadmapS1BarShape(props: any) {
  const radius = props?.payload?.kind === "target" ? [4, 4, 0, 0] : [0, 0, 0, 0];
  return <Rectangle {...props} radius={radius} />;
}

function RoadmapS2BarShape(props: any) {
  const radius = props?.payload?.kind === "actual" ? [4, 4, 0, 0] : [0, 0, 0, 0];
  return <Rectangle {...props} radius={radius} />;
}

export function CarbonNeutralRoadmapCard({
  emissionsData,
  target,
  selectedYear,
  strings,
}: CarbonNeutralRoadmapCardProps) {
  const trendStrings = strings.intensityTrend;
  const roadmapStrings = strings.roadmap;

  const roadmapPoints = useMemo(
    () => buildRoadmapPoints(emissionsData, target, selectedYear),
    [emissionsData, target, selectedYear],
  );
  const chartPoints = useMemo<RoadmapChartPoint[]>(() => {
    if (roadmapPoints.length === 0) return [];
    const actualYears = roadmapPoints.filter((point) => point.kind === "actual").map((point) => point.year);
    const currentActualYear = actualYears.length > 0 ? Math.max(...actualYears) : undefined;
    const maxTotal = Math.max(...roadmapPoints.map((point) => point.total), 0);
    const lineLift = maxTotal > 0 ? maxTotal * 0.06 : 0;

    const basePoints = roadmapPoints.map((point) => {
      const lineTotal = point.kind === "netzero" ? 0 : point.total + lineLift;
      const isCurrentActual = point.kind === "actual" && point.year === currentActualYear;
      return {
        ...point,
        lineTotal,
        totalActualLine: point.kind === "actual" ? lineTotal : null,
        totalFutureLine: isCurrentActual || point.kind === "target" || point.kind === "netzero" ? lineTotal : null,
      };
    });

    const targetIndex = basePoints.findIndex((point) => point.kind === "target");
    const netZeroIndex = basePoints.findIndex((point) => point.kind === "netzero");
    if (targetIndex !== -1 && netZeroIndex === targetIndex + 1) {
      const targetPoint = basePoints[targetIndex];
      const netZeroPoint = basePoints[netZeroIndex];
      const targetFutureLine = targetPoint.totalFutureLine ?? targetPoint.lineTotal;
      const netZeroFutureLine = netZeroPoint.totalFutureLine ?? netZeroPoint.lineTotal;
      const spacerLineTotal = (targetFutureLine + netZeroFutureLine) / 2;

      basePoints.splice(netZeroIndex, 0, {
        key: "spacer-target-netzero",
        year: Math.round((targetPoint.year + netZeroPoint.year) / 2),
        label: "",
        phase: "",
        kind: "spacer",
        s1: 0,
        s2: 0,
        total: (targetPoint.total + netZeroPoint.total) / 2,
        synthetic: true,
        lineTotal: spacerLineTotal,
        totalActualLine: null,
        totalFutureLine: spacerLineTotal,
      });
    }

    return basePoints;
  }, [roadmapPoints]);

  if (chartPoints.length === 0) {
    return (
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle className="text-sm font-medium">{roadmapStrings.badge}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[280px] items-center justify-center text-muted-foreground">
          {trendStrings.noData}
        </CardContent>
      </Card>
    );
  }

  const currentPoint = [...roadmapPoints].reverse().find((point) => point.kind === "actual") ?? roadmapPoints[0];
  const targetPoint = roadmapPoints.find((point) => point.kind === "target");
  const netZeroPoint = roadmapPoints.find((point) => point.kind === "netzero");
  const currentTotal = currentPoint.total;
  const targetTotal = targetPoint?.total ?? 0;
  const reductionPct = currentTotal > 0 ? ((currentTotal - targetTotal) / currentTotal) * 100 : 0;
  const phaseLabels: Record<string, string> = {
    Actual: roadmapStrings.phaseActual,
    Current: roadmapStrings.phaseCurrent,
    Target: roadmapStrings.phaseTarget,
    "Scenario Target": roadmapStrings.phaseScenarioTarget,
    "Net Zero": roadmapStrings.phaseNetZero,
  };

  return (
    <Card className="col-span-8 overflow-hidden border-accent/20">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              {roadmapStrings.badge}
            </div>
            <CardTitle className="text-sm font-medium">
              {roadmapStrings.title}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {roadmapStrings.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">{roadmapStrings.badgeCurrent} {formatFullNumber(currentTotal)}</Badge>
            <Badge variant="outline">
              {roadmapStrings.badgeTarget} {targetPoint?.year ?? "—"} · {formatFullNumber(targetTotal)}
            </Badge>
            <Badge variant="outline">
              {roadmapStrings.badgeNetZero} {netZeroPoint?.year ?? "—"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">{roadmapStrings.kpiCurrent}</p>
            <p className="mt-1 font-mono text-xl font-semibold">{formatFullNumber(currentTotal)}</p>
            <p className="text-xs text-muted-foreground">{roadmapStrings.unit}</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">{roadmapStrings.kpiTargetYear}</p>
            <p className="mt-1 font-mono text-xl font-semibold">{targetPoint?.year ?? "—"}</p>
            <p className="text-xs text-muted-foreground">
              {roadmapStrings.scenarioTargetNote}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">{roadmapStrings.kpiTargetEmissions}</p>
            <p className="mt-1 font-mono text-xl font-semibold">{formatFullNumber(targetTotal)}</p>
            <p className="text-xs text-muted-foreground">{roadmapStrings.unit}</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">{roadmapStrings.kpiReduction}</p>
            <p className="mt-1 font-mono text-xl font-semibold text-accent">
              {Number.isFinite(reductionPct) ? `${Math.max(0, reductionPct).toFixed(1)}%` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {roadmapStrings.finalNetZeroYear.replace("{year}", String(netZeroPoint?.year ?? "—"))}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-muted/20 p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted-foreground">
              {roadmapStrings.timelineCaption}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: ROADMAP_SCOPE1_COLOR }} /> {roadmapStrings.scope1}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: ROADMAP_SCOPE2_COLOR }} /> {roadmapStrings.scope2}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: ROADMAP_TOTAL_LINE_COLOR }} /> {roadmapStrings.total}
              </span>
              <span className="rounded-full bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
                {roadmapStrings.unit}
              </span>
            </div>
          </div>

          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartPoints} margin={{ top: 52, right: 16, left: 10, bottom: 12 }}>
                <defs>
                  <linearGradient id="roadmap-s1-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ROADMAP_PRIMARY_COLOR} stopOpacity={0.82} />
                    <stop offset="100%" stopColor={ROADMAP_PRIMARY_COLOR} stopOpacity={0.70} />
                  </linearGradient>
                  <linearGradient id="roadmap-s2-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ROADMAP_PRIMARY_COLOR} stopOpacity={0.48} />
                    <stop offset="100%" stopColor={ROADMAP_PRIMARY_COLOR} stopOpacity={0.35} />
                  </linearGradient>
                  <linearGradient id="roadmap-target-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7cc6c1" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#6bb7b4" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  axisLine={{ className: "stroke-border" }}
                  tickLine={{ className: "stroke-border" }}
                />
                <YAxis
                  width={58}
                  tick={{ fontSize: 12 }}
                  axisLine={{ className: "stroke-border" }}
                  tickLine={{ className: "stroke-border" }}
                  tickFormatter={(value) => (typeof value === "number" ? formatCompactTick(value) : "0")}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    boxShadow: "var(--shadow-card)",
                    padding: "8px 10px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontSize: 12, fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: "hsl(var(--foreground))", fontSize: 12, padding: 0 }}
                  formatter={(value: number | string, name, context) => {
                    const numeric = typeof value === "number" ? value : Number(value);
                    const payload = context?.payload as RoadmapPoint | undefined;
                    const labelMap: Record<string, string> = {
                      s1: roadmapStrings.scope1,
                      s2: roadmapStrings.scope2,
                      total: roadmapStrings.total,
                      totalActualLine: roadmapStrings.total,
                      totalFutureLine: roadmapStrings.total,
                    };
                    const label = labelMap[String(name)] ?? String(name);
                    if (!Number.isFinite(numeric)) return ["—", label];
                    if (name === "totalActualLine" || name === "totalFutureLine") {
                      return [formatFullNumber(payload?.total ?? 0), label];
                    }
                    return [formatFullNumber(numeric), label];
                  }}
                  labelFormatter={(_, entries) => {
                    const payload = entries?.[0]?.payload as RoadmapPoint | undefined;
                    if (!payload) return "";
                    if (payload.kind === "spacer") return "";
                    const phaseLabel = phaseLabels[payload.phase] ?? payload.phase;
                    return `${phaseLabel} · ${payload.year}${payload.synthetic ? ` (${roadmapStrings.scenarioSuffix})` : ""}`;
                  }}
                />

                <Bar
                  dataKey="s1"
                  stackId="emissions"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={44}
                  stroke="none"
                  shape={<RoadmapS1BarShape />}
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
                  shape={<RoadmapS2BarShape />}
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
                  stroke={ROADMAP_TOTAL_LINE_COLOR}
                  strokeWidth={2}
                  strokeLinecap="round"
                  connectNulls={false}
                  dot={<RoadmapDot mode="actual" />}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                />

                <Line
                  type="linear"
                  dataKey="totalFutureLine"
                  stroke={ROADMAP_TOTAL_LINE_COLOR}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  connectNulls={false}
                  dot={<RoadmapDot mode="future" />}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="phase"
                    position="top"
                    offset={26}
                    style={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 600 }}
                    formatter={(value: string) => {
                      if (value === "Target") return roadmapStrings.phaseTarget;
                      if (value === "Net Zero") return roadmapStrings.phaseNetZero;
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
