'use client';

import { Badge } from '@/components/ui/badge';
import type {
  WorkflowStatus,
  EventSeverity,
  AlertStatus,
  ReportStatus,
  Criticality,
} from '@/lib/types';

// ---------------------------------------------------------------------------
// Shared badge style maps
// ---------------------------------------------------------------------------

const WORKFLOW_STATUS_STYLES: Record<
  WorkflowStatus,
  { bg: string; text: string; border: string }
> = {
  healthy: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
  },
  warning: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/25',
  },
  critical: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/25',
  },
  inactive: {
    bg: 'bg-zinc-500/15',
    text: 'text-zinc-400',
    border: 'border-zinc-500/25',
  },
};

const SEVERITY_STYLES: Record<
  EventSeverity,
  { bg: string; text: string; border: string }
> = {
  info: {
    bg: 'bg-sky-500/15',
    text: 'text-sky-400',
    border: 'border-sky-500/25',
  },
  warning: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/25',
  },
  error: {
    bg: 'bg-orange-500/15',
    text: 'text-orange-400',
    border: 'border-orange-500/25',
  },
  critical: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/25',
  },
};

const ALERT_STATUS_STYLES: Record<
  AlertStatus,
  { bg: string; text: string; border: string; pulsing?: boolean }
> = {
  active: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/25',
    pulsing: true,
  },
  acknowledged: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/25',
  },
  resolved: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
  },
};

const REPORT_STATUS_STYLES: Record<
  ReportStatus,
  { bg: string; text: string; border: string }
> = {
  draft: {
    bg: 'bg-zinc-500/15',
    text: 'text-zinc-400',
    border: 'border-zinc-500/25',
  },
  sent: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
  },
  viewed: {
    bg: 'bg-sky-500/15',
    text: 'text-sky-400',
    border: 'border-sky-500/25',
  },
};

const CRITICALITY_STYLES: Record<
  Criticality,
  { bg: string; text: string; border: string }
> = {
  low: {
    bg: 'bg-zinc-500/15',
    text: 'text-zinc-400',
    border: 'border-zinc-500/25',
  },
  medium: {
    bg: 'bg-sky-500/15',
    text: 'text-sky-400',
    border: 'border-sky-500/25',
  },
  high: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/25',
  },
  critical: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/25',
  },
};

// ---------------------------------------------------------------------------
// Dot indicator — small coloured circle before label text
// ---------------------------------------------------------------------------

function DotIndicator({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-full w-1.5 h-1.5 bg-current mr-1.5 ${className ?? ''}`}
    />
  );
}

// ---------------------------------------------------------------------------
// StatusBadge — workflow status
// ---------------------------------------------------------------------------

export function StatusBadge({ status }: { status: WorkflowStatus }) {
  const s = WORKFLOW_STATUS_STYLES[status];
  return (
    <Badge
      variant="outline"
      className={`${s.bg} ${s.text} ${s.border} border capitalize`}
    >
      <DotIndicator />
      {status}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// SeverityBadge — event severity
// ---------------------------------------------------------------------------

export function SeverityBadge({ severity }: { severity: EventSeverity }) {
  const s = SEVERITY_STYLES[severity];
  return (
    <Badge
      variant="outline"
      className={`${s.bg} ${s.text} ${s.border} border capitalize`}
    >
      <DotIndicator />
      {severity}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// AlertStatusBadge — alert status (active gets a pulsing dot)
// ---------------------------------------------------------------------------

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const s = ALERT_STATUS_STYLES[status];
  return (
    <Badge
      variant="outline"
      className={`${s.bg} ${s.text} ${s.border} border capitalize`}
    >
      {s.pulsing ? (
        <span className="inline-block rounded-full w-1.5 h-1.5 bg-current mr-1.5 animate-pulse" />
      ) : (
        <DotIndicator />
      )}
      {status}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// ReportStatusBadge — report status
// ---------------------------------------------------------------------------

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const s = REPORT_STATUS_STYLES[status];
  return (
    <Badge
      variant="outline"
      className={`${s.bg} ${s.text} ${s.border} border capitalize`}
    >
      <DotIndicator />
      {status}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// CriticalityBadge — workflow criticality
// ---------------------------------------------------------------------------

export function CriticalityBadge({ criticality }: { criticality: Criticality }) {
  const s = CRITICALITY_STYLES[criticality];
  return (
    <Badge
      variant="outline"
      className={`${s.bg} ${s.text} ${s.border} border capitalize`}
    >
      <DotIndicator />
      {criticality}
    </Badge>
  );
}