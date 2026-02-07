"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { EmissionData, Target } from '@/data/mockData';
import type { I18nStrings } from '@/lib/i18n';

type MetricView = 'total' | 's1s2';

interface IntensityTrendChartProps {
  emissionsData: EmissionData[];
  target: Target | undefined;
  selectedYear?: number;
  strings: I18nStrings;
}

export function IntensityTrendChart({ emissionsData, target, selectedYear, strings }: IntensityTrendChartProps) {
  const [metricView, setMetricView] = useState<MetricView>('total');

  const trendStrings = strings.intensityTrend;
  const metricLabel = metricView === 'total' ? trendStrings.total : trendStrings.s1s2;

  const availableYears = emissionsData.map((d) => d.year);
  const maxYear = availableYears.length > 0 ? Math.max(...availableYears) : undefined;
  const upperYear = selectedYear ?? maxYear;
  const filteredEmissions =
    upperYear !== undefined
      ? emissionsData.filter((d) => d.year <= upperYear)
      : emissionsData;
  const scopedEmissions = filteredEmissions.length > 0 ? filteredEmissions : emissionsData;

  // Calculate intensity for each year
  const chartData = useMemo(
    () =>
      scopedEmissions
        .map((d) => {
          const s1 = Number.isFinite(d.s1Emissions) ? Math.max(0, d.s1Emissions) : 0;
          const s2 = Number.isFinite(d.s2Emissions) ? Math.max(0, d.s2Emissions) : 0;
          const s1s2 = s1 + s2;
          const total = Number.isFinite(d.totalEmissions) ? Math.max(0, d.totalEmissions) : s1s2;
          const emissions = metricView === 'total' ? total : s1s2;
          const denom = Number.isFinite(d.denomValue) && d.denomValue > 0 ? d.denomValue : null;
          return {
            year: d.year,
            intensity: denom ? (emissions / denom) * 1000000 : null,
            emissions,
          };
        })
        .sort((a, b) => a.year - b.year),
    [scopedEmissions, metricView],
  );
  const hasIntensityData = chartData.some((point) => point.intensity !== null && Number.isFinite(point.intensity));

  // Calculate target line if available
  let targetIntensity: number | null = null;
  if (target && hasIntensityData) {
    const baseYearData = chartData.find(d => d.year === target.baseYear);
    if (baseYearData && baseYearData.intensity !== null) {
      targetIntensity = baseYearData.intensity * (1 - target.targetReductionPct / 100);
    }
  }

  if (!hasIntensityData) {
    return (
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {trendStrings.title} ({trendStrings.s1s2})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-[250px] items-center justify-center text-muted-foreground">
          {trendStrings.noData}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-8">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">{trendStrings.title} ({metricLabel})</CardTitle>
            <p className="text-xs text-muted-foreground">{trendStrings.unit}</p>
          </div>
          <Tabs
            value={metricView}
            onValueChange={(value) => {
              if (value === 'total' || value === 's1s2') {
                setMetricView(value);
              }
            }}
          >
            <TabsList className="h-8">
              <TabsTrigger value="total" className="px-2.5 text-xs">{trendStrings.total}</TabsTrigger>
              <TabsTrigger value="s1s2" className="px-2.5 text-xs">{trendStrings.s1s2}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }} 
                className="text-muted-foreground"
                axisLine={{ className: "stroke-border" }}
                tickLine={{ className: "stroke-border" }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                className="text-muted-foreground"
                axisLine={{ className: "stroke-border" }}
                tickLine={{ className: "stroke-border" }}
                tickFormatter={(value) =>
                  typeof value === "number" && Number.isFinite(value) ? value.toFixed(1) : "0.0"
                }
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-card)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number | string) => {
                  const numeric = typeof value === "number" ? value : Number(value);
                  return [Number.isFinite(numeric) ? numeric.toFixed(2) : "—", trendStrings.tooltipIntensity];
                }}
              />
              {targetIntensity !== null && (
                <ReferenceLine 
                  y={targetIntensity} 
                  stroke="hsl(var(--accent))" 
                  strokeDasharray="5 5"
                  label={{ 
                    value: trendStrings.targetLabel.replace("{year}", String(target?.targetYear)),
                    position: 'right',
                    className: "fill-accent text-xs"
                  }}
                />
              )}
              <Line 
                type="monotone" 
                dataKey="intensity" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2.5}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {target && (
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-4 bg-primary" />
              <span>{trendStrings.actualIntensity.replace("{metric}", metricLabel)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-4 border-t-2 border-dashed border-accent" />
              <span>
                {trendStrings.targetLegend
                  .replace("{pct}", target.targetReductionPct.toString())
                  .replace("{year}", target.targetYear.toString())}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
