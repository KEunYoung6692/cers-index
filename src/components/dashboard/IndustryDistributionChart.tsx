import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IndustryData, ScoreRun } from '@/data/mockData';
import type { I18nStrings } from '@/lib/i18n';

interface IndustryDistributionChartProps {
  industryData: IndustryData | undefined;
  currentScore: ScoreRun | undefined;
  industryName: string;
  strings: I18nStrings;
}

export function IndustryDistributionChart({ industryData, currentScore, industryName, strings }: IndustryDistributionChartProps) {
  const distributionStrings = strings.industryDistribution;
  if (!industryData) {
    return (
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle className="text-sm font-medium">{distributionStrings.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[250px] items-center justify-center text-muted-foreground">
          {distributionStrings.noData}
        </CardContent>
      </Card>
    );
  }

  // Create histogram bins
  const bins = [
    { range: '0-20', min: 0, max: 20, count: 0 },
    { range: '20-40', min: 20, max: 40, count: 0 },
    { range: '40-60', min: 40, max: 60, count: 0 },
    { range: '60-80', min: 60, max: 80, count: 0 },
    { range: '80-100', min: 80, max: 100, count: 0 },
  ];

  industryData.scores.forEach(score => {
    const bin = bins.find(b => score >= b.min && score < b.max);
    if (bin) bin.count++;
  });

  // Find which bin the current company is in
  const currentBinIndex = currentScore 
    ? bins.findIndex(b => currentScore.pcrcScore >= b.min && currentScore.pcrcScore < b.max)
    : -1;

  const sortedScores = [...industryData.scores].sort((a, b) => a - b);
  const median = sortedScores.length > 0
    ? sortedScores[Math.floor(sortedScores.length / 2)]
    : null;

  return (
    <Card className="col-span-8">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {distributionStrings.title} · {industryName}
          </CardTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{distributionStrings.sampleSize} = {industryData.companyCount}</span>
            <span>{distributionStrings.medianLabel}: {median === null ? "—" : median.toFixed(2)}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{distributionStrings.pcrcDistribution}</p>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bins} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis 
                dataKey="range" 
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
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                formatter={(value: number) => [value, distributionStrings.companies]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {bins.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === currentBinIndex ? 'hsl(var(--accent))' : 'hsl(var(--primary) / 0.6)'}
                    stroke={index === currentBinIndex ? 'hsl(var(--accent))' : 'transparent'}
                    strokeWidth={2}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {currentScore && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-accent" />
              <span className="text-muted-foreground">{distributionStrings.yourCompany}: {currentScore.pcrcScore.toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
