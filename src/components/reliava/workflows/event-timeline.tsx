'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { SeverityBadge } from '@/components/reliava/shared/status-badge';
import { PageHeader } from '@/components/reliava/shared/page-header';
import { TimeAgo } from '@/components/reliava/shared/time-ago';
import { useAppStore } from '@/lib/store';
import type { EventSeverity, WorkflowEvent } from '@/lib/types';
import {
  ChevronDown,
  Inbox,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Severity → dot colour
// ---------------------------------------------------------------------------
const SEVERITY_DOT_COLOR: Record<EventSeverity, string> = {
  critical: 'bg-red-400',
  error: 'bg-orange-400',
  warning: 'bg-amber-400',
  info: 'bg-sky-400',
};

// ---------------------------------------------------------------------------
// EventTimeline
// ---------------------------------------------------------------------------
export function EventTimeline({ workflowId }: { workflowId: string }) {
  const allEvents = useAppStore((s) => s.events);
  const events = useMemo(
    () =>
      allEvents
        .filter((e) => e.workflowId === workflowId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [allEvents, workflowId]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Timeline"
        description="Chronological log of all workflow events"
      />

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <Inbox className="size-10 opacity-40" />
          <p className="text-sm">No events recorded yet</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline list */}
          <div className="space-y-0">
            {events.map((event, idx) => {
              const isLast = idx === events.length - 1;
              return (
                <TimelineEventCard
                  key={event.id}
                  event={event}
                  isLast={isLast}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TimelineEventCard — single event entry with left dot + vertical line
// ---------------------------------------------------------------------------
function TimelineEventCard({
  event,
  isLast,
}: {
  event: WorkflowEvent;
  isLast: boolean;
}) {
  const [metaOpen, setMetaOpen] = useState(false);
  const hasMetadata = event.metadata && Object.keys(event.metadata).length > 0;

  return (
    <div className="flex gap-4">
      {/* Left column: dot + vertical line */}
      <div className="flex flex-col items-center shrink-0">
        <span
          className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${SEVERITY_DOT_COLOR[event.severity]}`}
        />
        {!isLast && <div className="w-px flex-1 bg-border min-h-8" />}
      </div>

      {/* Right column: event content */}
      <Card className="flex-1 mb-4">
        <CardContent className="pt-0">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <SeverityBadge severity={event.severity} />
            <span className="text-xs text-muted-foreground">Event</span>
            <TimeAgo date={event.timestamp} />
          </div>

          {/* Message */}
          <p className="text-sm text-foreground">{event.message}</p>

          {/* Silent badge */}
          {event.isSilent && (
            <span className="inline-block mt-2 text-amber-400 text-xs bg-amber-500/10 rounded px-1.5 py-0.5">
              Silent failure — no alert fired
            </span>
          )}

          {/* Collapsible metadata */}
          {hasMetadata && (
            <Collapsible open={metaOpen} onOpenChange={setMetaOpen} className="mt-3">
              <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ChevronDown
                  className={`size-3.5 transition-transform ${metaOpen ? 'rotate-180' : ''}`}
                />
                {metaOpen ? 'Hide' : 'Show'} metadata
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="bg-muted rounded-md p-3 font-mono text-xs text-foreground">
                  {Object.entries(event.metadata!).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
