import { FileText, Target, Settings, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EvidenceItem } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface EvidenceAccordionProps {
  evidenceItems: EvidenceItem[];
}

function getStatusIcon(status: string | undefined) {
  switch (status) {
    case 'verified':
    case 'full':
      return <CheckCircle2 className="h-4 w-4 text-score-good" />;
    case 'pending':
    case 'partial':
      return <Clock className="h-4 w-4 text-score-moderate" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
}

function getStatusBadge(status: string | undefined) {
  switch (status) {
    case 'verified':
      return <Badge variant="outline" className="border-score-good/30 bg-score-good/10 text-score-good">Verified</Badge>;
    case 'full':
      return <Badge variant="outline" className="border-score-good/30 bg-score-good/10 text-score-good">Full</Badge>;
    case 'self-reported':
      return <Badge variant="secondary">Self-reported</Badge>;
    case 'partial':
      return <Badge variant="outline" className="border-score-moderate/30 bg-score-moderate/10 text-score-moderate">Partial</Badge>;
    case 'pending':
      return <Badge variant="outline" className="border-score-moderate/30 bg-score-moderate/10 text-score-moderate">Pending</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

function EvidenceRow({ item }: { item: EvidenceItem }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-3">
      <div className="flex items-start gap-3">
        {getStatusIcon(item.status)}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">{item.indicator}</span>
            {item.year && <span className="text-xs text-muted-foreground">({item.year})</span>}
          </div>
          {item.evidenceNote && (
            <p className="mt-1 text-sm text-muted-foreground">{item.evidenceNote}</p>
          )}
          {item.evidencePage && (
            <p className="mt-1 font-mono text-xs text-primary">{item.evidencePage}</p>
          )}
          {item.pointsAwarded !== undefined && (
            <p className="mt-1 text-xs text-muted-foreground">Points: {item.pointsAwarded}</p>
          )}
        </div>
      </div>
      {getStatusBadge(item.status)}
    </div>
  );
}

export function EvidenceAccordion({ evidenceItems }: EvidenceAccordionProps) {
  const emissionItems = evidenceItems.filter(e => e.category === 'Emission');
  const targetItems = evidenceItems.filter(e => e.category === 'Target');
  const mmsItems = evidenceItems.filter(e => e.category === 'MMS');

  const hasAnyEvidence = evidenceItems.length > 0;

  return (
    <Card className="col-span-12">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4" />
          Evidence & Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasAnyEvidence ? (
          <p className="py-8 text-center text-muted-foreground">Not available</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {emissionItems.length > 0 && (
              <AccordionItem value="emissions">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span>Emission Evidence</span>
                    <Badge variant="secondary" className="ml-2">{emissionItems.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {emissionItems.map((item, idx) => (
                      <EvidenceRow key={idx} item={item} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {targetItems.length > 0 && (
              <AccordionItem value="targets">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent" />
                    <span>Target Evidence</span>
                    <Badge variant="secondary" className="ml-2">{targetItems.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {targetItems.map((item, idx) => (
                      <EvidenceRow key={idx} item={item} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {mmsItems.length > 0 && (
              <AccordionItem value="mms">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-mms" />
                    <span>MMS Observations</span>
                    <Badge variant="secondary" className="ml-2">{mmsItems.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {mmsItems.map((item, idx) => (
                      <EvidenceRow key={idx} item={item} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

// Need to import Activity for accordion
import { Activity } from 'lucide-react';
