import { Activity, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { IndustryData } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { I18nStrings } from '@/lib/i18n';

interface IndustryAveragesCardProps {
  industryData: IndustryData | undefined;
  industryName: string;
  strings: I18nStrings;
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

function formatWithThousands(value: number, fractionDigits = 1) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
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

export function IndustryAveragesCard({ industryData, industryName, strings }: IndustryAveragesCardProps) {
  const averagesStrings = strings.industryAverages;
  if (!industryData) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">{averagesStrings.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
          {averagesStrings.noData}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{averagesStrings.title}</CardTitle>
          {industryData.alpha && (
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="font-mono text-xs">
                α = {industryData.alpha.toFixed(2)}
              </Badge>
              <InfoTooltip label={averagesStrings.alphaTooltipLabel}>
                {averagesStrings.alphaTooltip}
              </InfoTooltip>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{industryName}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <MetricCard
          icon={<Award className="h-4 w-4" />}
          label={averagesStrings.avgPcrcScore}
          value={industryData.avgPcrc.toFixed(2)}
          unit="/100"
          highlight
        />
        <MetricCard
          icon={<Activity className="h-4 w-4" />}
          label={(
            <span className="inline-flex items-center gap-1.5">
              {averagesStrings.avgIntensity}
              <InfoTooltip label={averagesStrings.intensityTooltipLabel}>
                {averagesStrings.intensityTooltip}
              </InfoTooltip>
            </span>
          )}
          value={formatWithThousands(industryData.avgIntensity, 1)}
          unit="tCO₂e/M$"
        />
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>{averagesStrings.basedOn.replace("{count}", industryData.companyCount.toString())}</span>
        </div>
      </CardContent>
    </Card>
  );
}
