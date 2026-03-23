"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "next-themes";
import { getTranslations, type SupportedLocale } from "@/lib/cers/i18n";

type DistributionPoint = {
  range: string;
  count: number;
};

type ScoreDistributionChartProps = {
  data: DistributionPoint[];
  locale?: SupportedLocale;
};

export function ScoreDistributionChart({ data, locale = "en" }: ScoreDistributionChartProps) {
  const t = getTranslations(locale);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
          <XAxis dataKey="range" stroke={isDark ? "#94a3b8" : "#64748b"} tickLine={false} axisLine={false} fontSize={12} />
          <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip
            formatter={(value: number) => t.charts.distributionTooltip(value)}
            contentStyle={{
              borderRadius: 18,
              borderColor: isDark ? "#334155" : "#cbd5e1",
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              color: isDark ? "#e2e8f0" : "#0f172a",
              boxShadow: "0 18px 48px rgba(15, 23, 42, 0.18)",
            }}
            labelStyle={{ color: isDark ? "#e2e8f0" : "#0f172a" }}
            itemStyle={{ color: isDark ? "#e2e8f0" : "#0f172a" }}
          />
          <Bar dataKey="count" fill="#0d9488" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
