"use client";

import { ComposedChart, Bar, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getIntlLocale, getTranslations, type SupportedLocale } from "@/lib/cers/i18n";
import type { CersCompanyProfile } from "@/lib/cers/types";

type RoadmapChartProps = {
  company: CersCompanyProfile;
  locale?: SupportedLocale;
};

export function RoadmapChart({ company, locale = "en" }: RoadmapChartProps) {
  const t = getTranslations(locale);

  const currentYear = company.metrics.fiscalYear || company.targetSummary.currentYear || new Date().getFullYear();
  const currentTotal = company.metrics.totalEmissions ?? 0;
  const targetYear = company.targetSummary.targetYear;
  const targetTotal = company.targetSummary.targetEmissions ?? null;
  const netZeroYear = company.targetSummary.netZeroYear;

  const data = [
    {
      label: String(currentYear),
      scope1: company.metrics.scope1Emissions ?? 0,
      scope2: company.metrics.scope2Emissions ?? 0,
      total: currentTotal,
      target: null,
    },
    ...(targetYear
      ? [
          {
            label: String(targetYear),
            scope1: null,
            scope2: null,
            total: targetTotal,
            target: targetTotal,
          },
        ]
      : []),
    ...(netZeroYear
      ? [
          {
            label: String(netZeroYear),
            scope1: null,
            scope2: null,
            total: 0,
            target: 0,
          },
        ]
      : []),
  ];

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis
            stroke="#64748b"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => (value >= 1_000_000 ? `${(value / 1_000_000).toFixed(0)}M` : `${Math.round(value / 1_000)}k`)}
            fontSize={12}
          />
          <Tooltip
            formatter={(value: number | null) =>
              value === null || value === undefined ? "—" : value.toLocaleString(getIntlLocale(locale))
            }
            contentStyle={{ borderRadius: 18, borderColor: "#cbd5e1", boxShadow: "0 18px 48px rgba(15, 23, 42, 0.08)" }}
          />
          <Bar dataKey="scope1" stackId="current" fill="#0f766e" radius={[12, 12, 0, 0]} name={t.charts.roadmap.scope1} />
          <Bar dataKey="scope2" stackId="current" fill="#2dd4bf" radius={[12, 12, 0, 0]} name={t.charts.roadmap.scope2} />
          <Bar dataKey="target" fill="#f59e0b" radius={[12, 12, 0, 0]} name={t.charts.roadmap.targetEmissions} />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#0f172a"
            strokeWidth={2}
            strokeDasharray="6 6"
            dot={{ r: 4, fill: "#0f172a" }}
            activeDot={{ r: 5 }}
            name={t.charts.roadmap.reductionPathway}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
