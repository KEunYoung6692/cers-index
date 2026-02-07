import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmissionData } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { I18nStrings } from '@/lib/i18n';

interface AbsoluteEmissionsCardProps {
  emissionsData: EmissionData[];
  selectedYear?: number;
  strings: I18nStrings;
}

function formatNumber(num: number): string {
  const safe = Number.isFinite(num) ? Math.max(0, num) : 0;
  if (safe >= 1000000) {
    return (safe / 1000000).toFixed(2) + 'M';
  }
  if (safe >= 1000) {
    return (safe / 1000).toFixed(1) + 'K';
  }
  return safe.toFixed(0);
}

export function AbsoluteEmissionsCard({ emissionsData, selectedYear, strings }: AbsoluteEmissionsCardProps) {
  const emissionsStrings = strings.absoluteEmissions;
  const availableYears = emissionsData.map((d) => d.year);
  const maxYear = availableYears.length > 0 ? Math.max(...availableYears) : undefined;
  const upperYear = selectedYear ?? maxYear;
  const filtered = upperYear !== undefined
    ? emissionsData.filter((d) => d.year <= upperYear)
    : emissionsData;
  const scoped = filtered.length > 0 ? filtered : emissionsData;
  const sortedData = [...scoped].sort((a, b) => b.year - a.year).slice(0, 3);
  
  if (sortedData.length === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">{emissionsStrings.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
          {emissionsStrings.noData}
        </CardContent>
      </Card>
    );
  }

  // Find max for bar scaling
  const maxEmissions = Math.max(
    0,
    ...sortedData.map((d) => {
      const s1 = Number.isFinite(d.s1Emissions) ? Math.max(0, d.s1Emissions) : 0;
      const s2 = Number.isFinite(d.s2Emissions) ? Math.max(0, d.s2Emissions) : 0;
      return s1 + s2;
    }),
  );

  return (
    <Card className="col-span-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{emissionsStrings.title}</CardTitle>
          <p className="text-xs text-muted-foreground">{emissionsStrings.unit}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedData.map((data, index) => {
          const s1 = Number.isFinite(data.s1Emissions) ? Math.max(0, data.s1Emissions) : 0;
          const s2 = Number.isFinite(data.s2Emissions) ? Math.max(0, data.s2Emissions) : 0;
          const total = s1 + s2;
          const percentage = maxEmissions > 0 ? Math.min(100, Math.max(0, (total / maxEmissions) * 100)) : 0;
          const s1Percentage = total > 0 ? (s1 / total) * 100 : 0;
          
          return (
            <div key={data.year} className={cn("space-y-2", index === 0 && "animate-fade-in")}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium">{data.year}</span>
                <span className="font-mono text-sm font-semibold">{formatNumber(total)}</span>
              </div>
              <div className="h-6 w-full overflow-hidden rounded bg-secondary">
                <div 
                  className="flex h-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                >
                <div 
                  className="h-full bg-primary/70"
                  style={{ width: `${s1Percentage}%` }}
                />
                <div 
                  className="h-full bg-primary/35"
                  style={{ width: `${100 - s1Percentage}%` }}
                />
                </div>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{emissionsStrings.s1}: {formatNumber(s1)}</span>
                <span>{emissionsStrings.s2}: {formatNumber(s2)}</span>
              </div>
            </div>
          );
        })}
        
        <div className="mt-4 flex items-center gap-4 border-t pt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-primary/70" />
            <span className="text-muted-foreground">{emissionsStrings.scope1}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-primary/35" />
            <span className="text-muted-foreground">{emissionsStrings.scope2}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
