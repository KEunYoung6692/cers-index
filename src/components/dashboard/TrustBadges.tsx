import { ShieldCheck, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Report } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { I18nStrings } from '@/lib/i18n';

interface TrustBadgesProps {
  report: Report | undefined;
  strings: I18nStrings;
}

interface TrustBadgeItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  status: 'good' | 'neutral' | 'warning';
  valueClassName?: string;
}

function TrustBadgeItem({ icon, label, value, status, valueClassName }: TrustBadgeItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-2.5 transition-shadow hover:shadow-card">
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
        status === 'good' && "bg-score-good/10 text-score-good",
        status === 'neutral' && "bg-muted text-muted-foreground",
        status === 'warning' && "bg-score-moderate/10 text-score-moderate",
      )}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className={cn("font-medium", valueClassName ?? "truncate")}>{value}</div>
      </div>
    </div>
  );
}

export function TrustBadges({ report, strings }: TrustBadgesProps) {
  const assuranceOrg = report?.assuranceOrg?.trim() ?? "";
  const hasAssurance = assuranceOrg.length > 0;
  const frameworks = (report?.frameworks ?? [])
    .map((framework) => framework.trim())
    .filter((framework) => framework.length > 0);
  const displayFrameworks = frameworks.slice(0, 4);
  const extraFrameworks = frameworks.slice(4);
  const extraCount = frameworks.length - 4;
  const trustStrings = strings.trust;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            {trustStrings.title}
            <InfoTooltip label={trustStrings.tooltipLabel} contentClassName="space-y-1">
              <p>{trustStrings.tooltipAssurance}</p>
              <p>{trustStrings.tooltipFrameworks}</p>
            </InfoTooltip>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Assurance */}
        <TrustBadgeItem
          icon={<ShieldCheck className="h-5 w-5" />}
          label={trustStrings.assurance}
          value={hasAssurance ? (
            <span className="text-score-good">{assuranceOrg}</span>
          ) : (
            <span className="text-muted-foreground">{trustStrings.notStated}</span>
          )}
          status={hasAssurance ? 'good' : 'warning'}
        />

        {/* Frameworks */}
        <TrustBadgeItem
          icon={<FileText className="h-5 w-5" />}
          label={trustStrings.frameworks}
          value={
            frameworks.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {displayFrameworks.map((fw, index) => (
                  <Badge key={`${fw}-${index}`} variant="secondary" className="text-xs">
                    {fw}
                  </Badge>
                ))}
                {extraCount > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        aria-label={`${trustStrings.frameworks} +${extraCount}`}
                      >
                        +{extraCount}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-56 p-3">
                      <div className="flex flex-wrap gap-1.5">
                        {extraFrameworks.map((fw, index) => (
                          <Badge key={`extra-${fw}-${index}`} variant="outline" className="text-xs">
                            {fw}
                          </Badge>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">{trustStrings.noneReported}</span>
            )
          }
          status={frameworks.length > 0 ? 'good' : 'neutral'}
          valueClassName="overflow-visible"
        />

        {/* Evidence Coverage removed */}
      </CardContent>
    </Card>
  );
}
