import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ScoreRun } from '@/data/mockData';

interface HeroScoreCardProps {
  scoreRun: ScoreRun | undefined;
  yoyChange: number | null;
  industryPercentile: number | null;
}

interface ScoreBarProps {
  label: string;
  score: number;
  max: number;
  colorClass: string;
}

function ScoreBar({ label, score, max, colorClass }: ScoreBarProps) {
  const percentage = (score / max) * 100;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-mono">{score.toFixed(1)}<span className="text-muted-foreground">/{max}</span></span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function HeroScoreCard({ scoreRun, yoyChange, industryPercentile }: HeroScoreCardProps) {
  if (!scoreRun) {
    return (
      <Card className="col-span-8 flex items-center justify-center">
        <CardContent className="py-12 text-center text-muted-foreground">
          No score data available for selected period
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-score-excellent';
    if (score >= 60) return 'text-score-good';
    if (score >= 40) return 'text-score-moderate';
    return 'text-score-poor';
  };

  const getTrendIcon = () => {
    if (yoyChange === null) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (yoyChange > 0) return <TrendingUp className="h-4 w-4 text-score-good" />;
    if (yoyChange < 0) return <TrendingDown className="h-4 w-4 text-score-poor" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="col-span-8 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          {/* Main Score */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">PCRC Score</p>
            <div className="flex items-baseline gap-2">
              <span className={cn("font-mono text-6xl font-bold tracking-tighter animate-fade-in", getScoreColor(scoreRun.pcrcScore))}>
                {scoreRun.pcrcScore.toFixed(1)}
              </span>
              <span className="text-2xl text-muted-foreground">/100</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="flex flex-col items-end gap-2 text-right">
            {industryPercentile !== null && (
              <div className="rounded-lg bg-accent/10 px-3 py-1.5">
                <p className="text-xs text-muted-foreground">Industry Rank</p>
                <p className="font-mono text-lg font-semibold text-accent">Top {100 - industryPercentile}%</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className={cn(
                "font-mono text-sm font-medium",
                yoyChange === null ? "text-muted-foreground" :
                yoyChange > 0 ? "text-score-good" :
                yoyChange < 0 ? "text-score-poor" : "text-muted-foreground"
              )}>
                {yoyChange === null ? "—" : 
                 yoyChange > 0 ? `+${yoyChange.toFixed(1)}` : yoyChange.toFixed(1)} YoY
              </span>
            </div>
          </div>
        </div>

        {/* Score Breakdown Bars */}
        <div className="mt-8 grid gap-4">
          <ScoreBar 
            label="RI (Reduction Intensity)" 
            score={scoreRun.riScore} 
            max={scoreRun.riMax}
            colorClass="bg-ri"
          />
          <ScoreBar 
            label="TAG (Target & Governance)" 
            score={scoreRun.tagScore} 
            max={scoreRun.tagMax}
            colorClass="bg-tag"
          />
          <ScoreBar 
            label="MMS (Mitigation Measures)" 
            score={scoreRun.mmsScore} 
            max={scoreRun.mmsMax}
            colorClass="bg-mms"
          />
        </div>
      </CardContent>
    </Card>
  );
}
