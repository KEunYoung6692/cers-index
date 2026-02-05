import { ShieldCheck, FileText, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Report } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { I18nStrings } from '@/lib/i18n';

interface TrustBadgesProps {
  report: Report | undefined;
  evidenceCoverage: number;
  strings: I18nStrings;
}

interface TrustBadgeItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  status: 'good' | 'neutral' | 'warning';
}

function TrustBadgeItem({ icon, label, value, status }: TrustBadgeItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-shadow hover:shadow-card">
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
        <div className="truncate font-medium">{value}</div>
      </div>
    </div>
  );
}

export function TrustBadges({ report, evidenceCoverage, strings }: TrustBadgesProps) {
  const hasAssurance = report?.assuranceOrg !== null && report?.assuranceOrg !== undefined;
  const frameworks = report?.frameworks || [];
  const displayFrameworks = frameworks.slice(0, 4);
  const extraCount = frameworks.length - 4;
  const trustStrings = strings.trust;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{trustStrings.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Assurance */}
        <TrustBadgeItem
          icon={<ShieldCheck className="h-5 w-5" />}
          label={trustStrings.assurance}
          value={hasAssurance ? (
            <span className="text-score-good">{report?.assuranceOrg}</span>
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
              <div className="flex items-center gap-1.5">
                {displayFrameworks.map((fw) => (
                  <Badge key={fw} variant="secondary" className="text-xs">
                    {fw}
                  </Badge>
                ))}
                {extraCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    +{extraCount}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">{trustStrings.noneReported}</span>
            )
          }
          status={frameworks.length > 0 ? 'good' : 'neutral'}
        />

        {/* Evidence Coverage */}
        <TrustBadgeItem
          icon={<Eye className="h-5 w-5" />}
          label={trustStrings.evidenceCoverage}
          value={
            <div className="flex items-center gap-2">
              <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                <div 
                  className={cn(
                    "h-full rounded-full",
                    evidenceCoverage >= 80 ? "bg-score-good" :
                    evidenceCoverage >= 50 ? "bg-score-moderate" : "bg-score-poor"
                  )}
                  style={{ width: `${evidenceCoverage}%` }}
                />
              </div>
              <span className="font-mono text-sm">{evidenceCoverage}%</span>
            </div>
          }
          status={evidenceCoverage >= 80 ? 'good' : evidenceCoverage >= 50 ? 'neutral' : 'warning'}
        />
      </CardContent>
    </Card>
  );
}
