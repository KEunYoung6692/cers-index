import { Activity, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IndustryData } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface IndustryAveragesCardProps {
  industryData: IndustryData | undefined;
  industryName: string;
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

function MetricCard({ icon, label, value, unit, highlight }: MetricCardProps) {
  return (
    <div className={cn(
      "rounded-lg border p-4 transition-colors",
      highlight ? "border-accent/30 bg-accent/5" : "bg-card"
    )}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={cn("font-mono text-2xl font-bold", highlight && "text-accent")}>
          {typeof value === 'number' ? value.toFixed(1) : value}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

export function IndustryAveragesCard({ industryData, industryName }: IndustryAveragesCardProps) {
  if (!industryData) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Industry Averages</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
          No industry data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Industry Averages</CardTitle>
          {industryData.alpha && (
            <Badge variant="outline" className="font-mono text-xs">
              α = {industryData.alpha.toFixed(2)}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{industryName}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <MetricCard
          icon={<Award className="h-4 w-4" />}
          label="Avg. PCRC Score"
          value={industryData.avgPcrc}
          unit="/100"
          highlight
        />
        <MetricCard
          icon={<Activity className="h-4 w-4" />}
          label="Avg. Intensity"
          value={industryData.avgIntensity}
          unit="tCO₂e/M$"
        />
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Based on {industryData.companyCount} companies in this sector</span>
        </div>
      </CardContent>
    </Card>
  );
}
