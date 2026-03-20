import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { IndustryData } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { I18nStrings } from '@/lib/i18n';

interface IndustryAveragesCardProps {
  industryData: IndustryData | undefined;
  industryName: string;
  strings: I18nStrings;
}

type Scope3Stage = 'upstream' | 'downstream' | 'usePhase';
type Scope3CategoryId =
  | 'purchasedGoods'
  | 'useOfSoldProducts'
  | 'capitalGoods'
  | 'fuelEnergy'
  | 'upstreamTransport'
  | 'endOfLife'
  | 'processingSoldProducts';

interface Scope3Hotspot {
  categoryId: Scope3CategoryId;
  stage: Scope3Stage;
  sharePct: number;
}

interface Scope3Profile {
  hotspots: Scope3Hotspot[];
}

const TECH_PROFILE: Scope3Profile = {
  hotspots: [
    { categoryId: 'purchasedGoods', stage: 'upstream', sharePct: 34 },
    { categoryId: 'useOfSoldProducts', stage: 'downstream', sharePct: 27 },
    { categoryId: 'capitalGoods', stage: 'upstream', sharePct: 16 },
  ],
};

const BATTERY_PROFILE: Scope3Profile = {
  hotspots: [
    { categoryId: 'purchasedGoods', stage: 'upstream', sharePct: 41 },
    { categoryId: 'fuelEnergy', stage: 'upstream', sharePct: 18 },
    { categoryId: 'endOfLife', stage: 'downstream', sharePct: 14 },
  ],
};

const AUTO_PROFILE: Scope3Profile = {
  hotspots: [
    { categoryId: 'useOfSoldProducts', stage: 'usePhase', sharePct: 49 },
    { categoryId: 'purchasedGoods', stage: 'upstream', sharePct: 14 },
    { categoryId: 'processingSoldProducts', stage: 'downstream', sharePct: 11 },
  ],
};

const AVIATION_PROFILE: Scope3Profile = {
  hotspots: [
    { categoryId: 'fuelEnergy', stage: 'upstream', sharePct: 44 },
    { categoryId: 'purchasedGoods', stage: 'upstream', sharePct: 16 },
    { categoryId: 'capitalGoods', stage: 'upstream', sharePct: 12 },
  ],
};

const STEEL_PROFILE: Scope3Profile = {
  hotspots: [
    { categoryId: 'purchasedGoods', stage: 'upstream', sharePct: 38 },
    { categoryId: 'fuelEnergy', stage: 'upstream', sharePct: 24 },
    { categoryId: 'upstreamTransport', stage: 'upstream', sharePct: 12 },
  ],
};

const DEFAULT_PROFILE: Scope3Profile = {
  hotspots: [
    { categoryId: 'purchasedGoods', stage: 'upstream', sharePct: 31 },
    { categoryId: 'capitalGoods', stage: 'upstream', sharePct: 18 },
    { categoryId: 'upstreamTransport', stage: 'upstream', sharePct: 13 },
  ],
};

function getScope3Profile(industryName: string): Scope3Profile {
  const normalized = industryName.toLowerCase();

  if (normalized.includes('tech') || normalized.includes('hardware') || normalized.includes('semiconductor')) {
    return TECH_PROFILE;
  }
  if (normalized.includes('battery')) {
    return BATTERY_PROFILE;
  }
  if (normalized.includes('auto') || normalized.includes('motor')) {
    return AUTO_PROFILE;
  }
  if (normalized.includes('airline') || normalized.includes('aviation')) {
    return AVIATION_PROFILE;
  }
  if (normalized.includes('steel') || normalized.includes('metal')) {
    return STEEL_PROFILE;
  }

  return DEFAULT_PROFILE;
}

function stageClassName(stage: Scope3Stage) {
  switch (stage) {
    case 'upstream':
      return 'border-primary/15 bg-primary/8 text-primary';
    case 'downstream':
      return 'border-accent/20 bg-accent/10 text-accent';
    case 'usePhase':
      return 'border-amber-500/20 bg-amber-500/10 text-amber-700';
    default:
      return 'border-border bg-muted text-foreground';
  }
}

function formatPercent(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
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

  const scope3Profile = getScope3Profile(industryName);

  return (
    <Card className="col-span-4 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-sm font-medium">{averagesStrings.title}</CardTitle>
              <InfoTooltip label={averagesStrings.tooltipLabel} side="bottom" align="start">
                {averagesStrings.subtitle}
              </InfoTooltip>
            </div>
            <p className="text-xs text-muted-foreground">{industryName}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">
              {averagesStrings.scope3Badge}
            </Badge>
            <Badge variant="outline" className="font-mono text-[11px]">
              {averagesStrings.peersLabel.replace('{count}', industryData.companyCount.toString())}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {averagesStrings.priorityCategories}
            </p>
          </div>

          {scope3Profile.hotspots.map((hotspot, index) => (
            <div key={hotspot.categoryId} className="rounded-xl border bg-card/80 p-3 shadow-sm shadow-black/[0.02]">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                      <p className="text-sm font-medium leading-tight text-foreground">
                        {averagesStrings.categories[hotspot.categoryId]}
                      </p>
                      <Badge variant="outline" className={cn('text-[10px]', stageClassName(hotspot.stage))}>
                        {averagesStrings.stages[hotspot.stage]}
                      </Badge>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-base font-semibold text-foreground">
                        {formatPercent(hotspot.sharePct)}%
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {averagesStrings.ofEstimatedScope3}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full bg-gradient-to-r',
                        hotspot.stage === 'upstream' && 'from-primary to-primary/70',
                        hotspot.stage === 'downstream' && 'from-accent to-accent/70',
                        hotspot.stage === 'usePhase' && 'from-amber-500 to-amber-400',
                      )}
                      style={{ width: `${Math.min(100, hotspot.sharePct)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
