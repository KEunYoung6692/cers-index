import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmissionData } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface AbsoluteEmissionsCardProps {
  emissionsData: EmissionData[];
  selectedYear?: number;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(0);
}

export function AbsoluteEmissionsCard({ emissionsData, selectedYear }: AbsoluteEmissionsCardProps) {
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
          <CardTitle className="text-sm font-medium">Absolute Emissions</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    );
  }

  // Find max for bar scaling
  const maxEmissions = Math.max(...sortedData.map(d => d.s1Emissions + d.s2Emissions));

  return (
    <Card className="col-span-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Absolute Emissions</CardTitle>
          <p className="text-xs text-muted-foreground">tCO₂e</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedData.map((data, index) => {
          const total = data.s1Emissions + data.s2Emissions;
          const percentage = (total / maxEmissions) * 100;
          const s1Percentage = (data.s1Emissions / total) * 100;
          
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
                <span>S1: {formatNumber(data.s1Emissions)}</span>
                <span>S2: {formatNumber(data.s2Emissions)}</span>
              </div>
            </div>
          );
        })}
        
        <div className="mt-4 flex items-center gap-4 border-t pt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-primary/70" />
            <span className="text-muted-foreground">Scope 1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-primary/35" />
            <span className="text-muted-foreground">Scope 2</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
