import { Activity, Banknote, Cloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmissionData, IndustryData, ScoreRun } from '@/data/mockData';
import type { I18nStrings } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface IndustryDistributionChartProps {
  industryData: IndustryData | undefined;
  emissionsData: EmissionData[];
  currentScore: ScoreRun | undefined;
  industryName: string;
  companyName?: string;
  strings: I18nStrings;
}

interface IndustryMetricPoint {
  year: number;
  intensity: number;
  totalEmissions: number;
  revenue: number;
  source: "actual" | "mock";
}

const INTENSITY_BAR_FILL = "hsl(var(--primary) / 0.16)";
const INTENSITY_BAR_STROKE = "hsl(var(--primary) / 0.45)";
const EMISSIONS_LINE_COLOR = "hsl(var(--accent))";
const REVENUE_LINE_COLOR = "hsl(var(--primary))";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundTo(value: number, fractionDigits: number) {
  return Number(value.toFixed(fractionDigits));
}

function hashString(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededUnit(seed: number, offset: number) {
  const raw = Math.sin(seed * 12.9898 + offset * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

function seededRange(seed: number, offset: number, min: number, max: number) {
  return min + seededUnit(seed, offset) * (max - min);
}

function formatNumber(value: number, fractionDigits = 1) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

function formatCompactTick(value: number) {
  if (!Number.isFinite(value)) return "0";

  const abs = Math.abs(value);
  const units = [
    { threshold: 1_000_000_000, suffix: "B" },
    { threshold: 1_000_000, suffix: "M" },
    { threshold: 1_000, suffix: "K" },
  ] as const;

  for (const unit of units) {
    if (abs >= unit.threshold) {
      const scaled = value / unit.threshold;
      const fractionDigits = Math.abs(scaled) >= 100 ? 0 : Math.abs(scaled) >= 10 ? 1 : 1;
      return `${formatNumber(scaled, fractionDigits)}${unit.suffix}`;
    }
  }

  if (abs >= 100) return formatNumber(value, 0);
  if (abs >= 10) return formatNumber(value, 0);
  return formatNumber(value, 1);
}

function calculateMedian(values: number[]) {
  if (values.length === 0) return null;

  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function toActualMetricPoint(item: EmissionData): IndustryMetricPoint | null {
  const totalEmissions =
    Number.isFinite(item.totalEmissions) && item.totalEmissions !== undefined
      ? Math.max(0, item.totalEmissions)
      : Math.max(0, item.s1Emissions) + Math.max(0, item.s2Emissions);
  const revenue = Number.isFinite(item.denomValue) && item.denomValue > 0 ? item.denomValue : null;

  if (!Number.isFinite(item.year) || revenue === null || totalEmissions <= 0) {
    return null;
  }

  return {
    year: item.year,
    intensity: roundTo((totalEmissions / revenue) * 1_000_000, 1),
    totalEmissions: roundTo(totalEmissions / 1_000_000, 2),
    revenue: roundTo(revenue / 1_000_000_000, 1),
    source: "actual",
  };
}

function buildMockMetricSeries({
  industryData,
  currentScore,
  companyName,
  industryName,
}: Pick<IndustryDistributionChartProps, "industryData" | "currentScore" | "companyName" | "industryName">) {
  const seed = hashString(`${companyName ?? "company"}:${industryName}`);
  const companyCount = industryData?.companyCount ?? 24;
  const baselineIntensity = industryData?.avgIntensity && industryData.avgIntensity > 0 ? industryData.avgIntensity : 42;
  const scoreBias = currentScore?.pcrcScore ?? industryData?.avgPcrc ?? 62;
  const performanceBias = clamp((scoreBias - 50) / 40, -0.3, 0.85);
  const baseRevenue = seededRange(seed, 1, 18, 42) + companyCount * 0.45;
  const annualRevenueGrowth = clamp(seededRange(seed, 2, 0.025, 0.075) + performanceBias * 0.02, 0.015, 0.095);
  const startingIntensity = baselineIntensity * seededRange(seed, 3, 1.12, 1.42);
  const annualIntensityReduction = clamp(
    seededRange(seed, 4, 0.018, 0.055) + performanceBias * 0.015,
    0.012,
    0.08,
  );

  return [2020, 2021, 2022, 2023, 2024].map((year, index) => {
    const revenue = baseRevenue * Math.pow(1 + annualRevenueGrowth, index) * (1 + seededRange(seed, 10 + index, -0.02, 0.02));
    const intensity =
      startingIntensity *
      Math.pow(1 - annualIntensityReduction, index) *
      (1 + seededRange(seed, 20 + index, -0.025, 0.025));
    const totalEmissions = (intensity * revenue * 1000) / 1_000_000;

    return {
      year,
      intensity: roundTo(intensity, 1),
      totalEmissions: roundTo(totalEmissions, 2),
      revenue: roundTo(revenue, 1),
      source: "mock" as const,
    };
  });
}

function buildChartData(props: Pick<IndustryDistributionChartProps, "emissionsData" | "industryData" | "currentScore" | "companyName" | "industryName">) {
  const actualSeries = props.emissionsData
    .map(toActualMetricPoint)
    .filter((point): point is IndustryMetricPoint => point !== null)
    .sort((left, right) => left.year - right.year);

  if (actualSeries.length >= 2) {
    return actualSeries;
  }

  return buildMockMetricSeries(props);
}

interface SummaryMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  tone?: "default" | "positive" | "warning";
  monospaceValue?: boolean;
  valueClassName?: string;
}

function SummaryMetric({
  icon,
  label,
  value,
  unit,
  tone = "default",
  monospaceValue = true,
  valueClassName,
}: SummaryMetricProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        tone === "default" && "bg-muted/20",
        tone === "positive" && "border-accent/25 bg-accent/5",
        tone === "warning" && "border-destructive/20 bg-destructive/5",
      )}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span
          className={cn(
            "text-xl font-semibold text-foreground",
            monospaceValue && "font-mono",
            tone === "positive" && "text-accent",
            tone === "warning" && "text-destructive",
            valueClassName,
          )}
        >
          {value}
        </span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

export function IndustryDistributionChart({
  industryData,
  emissionsData,
  currentScore,
  industryName,
  companyName,
  strings,
}: IndustryDistributionChartProps) {
  const distributionStrings = strings.industryDistribution;
  const chartData = buildChartData({
    emissionsData,
    industryData,
    currentScore,
    companyName,
    industryName,
  });

  if (chartData.length === 0) {
    return (
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle className="text-sm font-medium">{distributionStrings.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[250px] items-center justify-center text-muted-foreground">
          {distributionStrings.noData}
        </CardContent>
      </Card>
    );
  }

  const latestPoint = chartData[chartData.length - 1];
  const entityLabel = [companyName, industryName].filter(Boolean).join(" · ");
  const medianPcrc = industryData ? calculateMedian(industryData.scores) : null;
  const avgIntensity = industryData?.avgIntensity ?? null;
  const intensityGapPct =
    avgIntensity && avgIntensity > 0 ? ((latestPoint.intensity - avgIntensity) / avgIntensity) * 100 : null;
  const intensityBenchmarkTone =
    intensityGapPct === null ? "default" : intensityGapPct <= -1 ? "positive" : intensityGapPct >= 1 ? "warning" : "default";
  const intensityBenchmarkValue =
    intensityGapPct === null
      ? "—"
      : Math.abs(intensityGapPct) < 1
        ? distributionStrings.atAverage
        : intensityGapPct < 0
          ? distributionStrings.belowAverage.replace("{percent}", formatNumber(Math.abs(intensityGapPct), 1))
          : distributionStrings.aboveAverage.replace("{percent}", formatNumber(Math.abs(intensityGapPct), 1));
  const yearRangeLabel =
    chartData.length > 1
      ? `${chartData[0].year}–${chartData[chartData.length - 1].year}`
      : String(chartData[0].year);

  return (
    <Card className="col-span-8">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-sm font-medium">{distributionStrings.title}</CardTitle>
              <InfoTooltip label={distributionStrings.tooltipLabel} side="bottom" align="start">
                {distributionStrings.subtitle}
              </InfoTooltip>
            </div>
            <p className="text-xs text-muted-foreground">{entityLabel}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-mono text-[11px]">
              {yearRangeLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <SummaryMetric
            icon={<Activity className="h-4 w-4" />}
            label={distributionStrings.peerCoverage}
            value={industryData ? formatNumber(industryData.companyCount, 0) : "—"}
            unit={distributionStrings.companiesUnit}
          />
          <SummaryMetric
            icon={<Cloud className="h-4 w-4" />}
            label={distributionStrings.medianPcrc}
            value={medianPcrc === null ? "—" : formatNumber(medianPcrc, 1)}
            unit={distributionStrings.scoreUnit}
          />
          <SummaryMetric
            icon={<Banknote className="h-4 w-4" />}
            label={distributionStrings.intensityBenchmark}
            value={intensityBenchmarkValue}
            tone={intensityBenchmarkTone}
            monospaceValue={false}
            valueClassName="text-base leading-tight sm:text-lg"
          />
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 24, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                axisLine={{ className: "stroke-border" }}
                tickLine={{ className: "stroke-border" }}
              />
              <YAxis
                yAxisId="intensity"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                axisLine={{ className: "stroke-border" }}
                tickLine={{ className: "stroke-border" }}
                width={60}
                tickFormatter={formatCompactTick}
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15)]}
              />
              <YAxis
                yAxisId="emissions"
                orientation="right"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                axisLine={{ className: "stroke-border" }}
                tickLine={{ className: "stroke-border" }}
                width={56}
                tickFormatter={formatCompactTick}
                domain={[0, (dataMax: number) => roundTo(dataMax * 1.2, 1)]}
              />
              <YAxis
                yAxisId="revenue"
                hide
                domain={[
                  (dataMin: number) => Math.max(0, roundTo(dataMin * 0.9, 1)),
                  (dataMax: number) => roundTo(dataMax * 1.1, 1),
                ]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-card)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number | string, name: string) => {
                  const numeric = typeof value === "number" ? value : Number(value);
                  if (!Number.isFinite(numeric)) return ["—", name];

                  if (name === distributionStrings.intensity) {
                    return [`${formatNumber(numeric, 1)} ${distributionStrings.intensityUnit}`, name];
                  }
                  if (name === distributionStrings.totalEmissions) {
                    return [`${formatNumber(numeric, 2)} ${distributionStrings.emissionsUnit}`, name];
                  }
                  return [`${formatNumber(numeric, 1)} ${distributionStrings.revenueUnit}`, name];
                }}
              />
              <Bar
                yAxisId="intensity"
                dataKey="intensity"
                name={distributionStrings.intensity}
                fill={INTENSITY_BAR_FILL}
                stroke={INTENSITY_BAR_STROKE}
                strokeWidth={1}
                radius={[8, 8, 0, 0]}
                barSize={28}
              />
              <Line
                yAxisId="emissions"
                type="monotone"
                dataKey="totalEmissions"
                name={distributionStrings.totalEmissions}
                stroke={EMISSIONS_LINE_COLOR}
                strokeWidth={2.5}
                dot={{ fill: EMISSIONS_LINE_COLOR, strokeWidth: 0, r: 3.5 }}
                activeDot={{ r: 5, fill: EMISSIONS_LINE_COLOR }}
              />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name={distributionStrings.revenue}
                stroke={REVENUE_LINE_COLOR}
                strokeWidth={2.5}
                strokeDasharray="6 4"
                dot={{ fill: REVENUE_LINE_COLOR, strokeWidth: 0, r: 3.5 }}
                activeDot={{ r: 5, fill: REVENUE_LINE_COLOR }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm border border-primary/40 bg-primary/15" />
              <span>{distributionStrings.intensity}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-5 bg-accent" />
              <span>{distributionStrings.totalEmissions}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-5 border-t-2 border-dashed border-primary" />
              <span>{distributionStrings.revenue}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
