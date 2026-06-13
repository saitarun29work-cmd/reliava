'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { PageHeader } from '@/components/reliava/shared/page-header';
import { ReportStatusBadge, StatusBadge, SeverityBadge } from '@/components/reliava/shared/status-badge';
import { TimeAgo } from '@/components/reliava/shared/time-ago';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import {
  Activity,
  CheckCircle,
  XCircle,
  EyeOff,
  Heart,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  ClipboardList,
  FileWarning,
  Sparkles,
  Workflow,
} from 'lucide-react';
import type { Client, Report, Workflow, WorkflowEvent } from '@/lib/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type HealthStatus = 'Healthy' | 'Warning' | 'Critical';

function getHealthStatus(score: number): HealthStatus {
  if (score >= 75) return 'Healthy';
  if (score >= 50) return 'Warning';
  return 'Critical';
}

function healthStatusStyle(s: HealthStatus) {
  switch (s) {
    case 'Healthy':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
    case 'Warning':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/25';
    case 'Critical':
      return 'bg-red-500/15 text-red-400 border-red-500/25';
  }
}

function healthScoreColor(score: number) {
  if (score >= 75) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
}

/** Derive a client-friendly business impact string from workflow context */
function deriveBusinessImpact(
  workflow: Workflow,
  eventType: 'failure' | 'silent_issue'
): string {
  const bp = workflow.businessProcess.toLowerCase();
  const n = workflow.name.toLowerCase();

  if (eventType === 'silent_issue') {
    if (n.includes('crm') || n.includes('sync'))
      return 'Customer data may not have reached the target system.';
    if (n.includes('email') || n.includes('reminder') || n.includes('notification'))
      return 'Communication steps may have been incomplete or skipped.';
    if (n.includes('dashboard') || n.includes('analysis') || n.includes('churn'))
      return 'Reports or scores may contain stale or incomplete data.';
    if (n.includes('billing') || n.includes('stripe') || n.includes('payment'))
      return 'Billing data may be incomplete or inaccurate.';
    return 'Business outcome may be incomplete despite successful execution.';
  }

  // failure
  if (n.includes('email') || n.includes('confirmation') || bp.includes('communication'))
    return 'Messages may not have reached recipients.';
  if (n.includes('crm') || n.includes('sync') || bp.includes('data integration'))
    return 'Data may not have reached the target system.';
  if (n.includes('billing') || n.includes('stripe') || bp.includes('billing'))
    return 'Billing events may be delayed or duplicated.';
  if (n.includes('claim') || bp.includes('claims'))
    return 'Claims may not have been processed correctly.';
  if (n.includes('appointment') || n.includes('reminder') || bp.includes('patient'))
    return 'Patients may not have received their notifications.';
  if (n.includes('onboarding') || bp.includes('user lifecycle'))
    return 'New users may not have been fully set up.';
  if (n.includes('report') || n.includes('dashboard') || bp.includes('reporting'))
    return 'Reports may not have been generated or delivered.';
  if (n.includes('reorder') || bp.includes('inventory'))
    return 'Stock replenishment may have been delayed.';
  return 'Workflow did not complete as expected.';
}

/** Derive a recommended action for a workflow */
function getRecommendedAction(wf: Workflow): string {
  if (wf.healthScore < 40 && wf.failureCountThisWeek > 5)
    return 'Investigate immediately — critical workflow with high failure rate.';
  if (wf.silentIssueCount > 0 && wf.failureCountThisWeek > 0)
    return 'Review error recovery and audit payload validation rules.';
  if (wf.silentIssueCount > 0)
    return 'Audit payload quality rules and verify data completeness.';
  if (wf.failureCountThisWeek > 3)
    return 'Review error patterns and consider adding retry logic.';
  if (wf.failureCountThisWeek > 0)
    return 'Monitor and review error logs for recurring patterns.';
  return 'No action needed — performing well.';
}

// ---------------------------------------------------------------------------
// StatPill
// ---------------------------------------------------------------------------

function StatPill({
  icon,
  label,
  value,
  valueColor = 'text-foreground',
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  valueColor?: string;
}) {
  return (
    <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <span className="size-3.5 shrink-0">{icon}</span>
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-xl font-bold tabular-nums ${valueColor}`}>{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function ReportSection({
  icon,
  iconColor,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconColor?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <h3
        className="text-sm font-medium text-foreground flex items-center gap-2"
      >
        <span className={`size-3.5 shrink-0 ${iconColor ?? 'text-muted-foreground'}`}>
          {icon}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FailureRow — one workflow's failure details
// ---------------------------------------------------------------------------

function FailureRow({
  events,
  workflow,
}: {
  events: WorkflowEvent[];
  workflow: Workflow;
}) {
  const latest = events[0];
  const errorMsg =
    latest?.payload_summary &&
    typeof latest.payload_summary.error_message === 'string'
      ? latest.payload_summary.error_message
      : 'Unknown error';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-4 gap-y-1 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {workflow.name}
        </p>
        <p className="text-xs text-red-400/80 mt-0.5">{errorMsg}</p>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:text-right shrink-0">
        <SeverityBadge severity={latest?.severity ?? 'error'} />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {latest ? <TimeAgo date={latest.timestamp} /> : '—'}
        </span>
      </div>
      <div className="sm:col-span-2">
        <p className="text-xs text-muted-foreground italic">
          Impact: {deriveBusinessImpact(workflow, 'failure')}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SilentIssueRow — one workflow's silent issue details
// ---------------------------------------------------------------------------

function SilentIssueRow({
  events,
  workflow,
}: {
  events: WorkflowEvent[];
  workflow: Workflow;
}) {
  const latest = events[0];
  const rule =
    latest?.payload_summary &&
    typeof latest.payload_summary.rule_violated === 'string'
      ? latest.payload_summary.rule_violated
      : 'Unknown rule';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-4 gap-y-1 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {workflow.name}
        </p>
        <p className="text-xs text-amber-400/80 mt-0.5 font-mono">
          Rule: {rule}
        </p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap self-center">
        {latest ? <TimeAgo date={latest.timestamp} /> : '—'}
      </span>
      <div className="sm:col-span-2">
        <p className="text-xs text-muted-foreground italic">
          Impact: {deriveBusinessImpact(workflow, 'silent_issue')}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WorkflowAttentionRow — top 3 workflow row
// ---------------------------------------------------------------------------

function WorkflowAttentionRow({ wf }: { wf: Workflow }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 gap-y-1 py-2.5 items-center">
      <p className="text-sm font-medium text-foreground truncate">{wf.name}</p>
      <StatusBadge status={wf.status} />
      <span
        className={`text-sm tabular-nums w-10 text-right ${
          wf.failureCountThisWeek > 0
            ? 'text-red-400 font-medium'
            : 'text-muted-foreground'
        }`}
      >
        {wf.failureCountThisWeek}
      </span>
      <span
        className={`text-sm tabular-nums w-10 text-right ${
          wf.silentIssueCount > 0
            ? 'text-amber-400 font-medium'
            : 'text-muted-foreground'
        }`}
      >
        {wf.silentIssueCount}
      </span>
      <span
        className={`text-sm tabular-nums w-10 text-right font-semibold ${healthScoreColor(wf.healthScore)}`}
      >
        {wf.healthScore}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FullReport — the complete client-ready report
// ---------------------------------------------------------------------------

function FullReport({
  report,
  client,
  workflows,
  events,
}: {
  report: Report;
  client: Client | undefined;
  workflows: Workflow[];
  events: WorkflowEvent[];
}) {
  const healthStatus = getHealthStatus(report.healthScore);
  const successRate =
    report.totalRuns > 0
      ? ((report.successfulRuns / report.totalRuns) * 100).toFixed(1)
      : '100.0';

  // Group failure events by workflow
  const failureByWorkflow = useMemo(() => {
    const map = new Map<string, { events: WorkflowEvent[]; workflow: Workflow }>();
    for (const e of events) {
      if (e.event_type !== 'failure') continue;
      const existing = map.get(e.workflowId);
      if (existing) {
        existing.events.push(e);
      } else {
        const wf = workflows.find((w) => w.id === e.workflowId);
        if (wf) map.set(e.workflowId, { events: [e], workflow: wf });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.events[0].timestamp).getTime() - new Date(a.events[0].timestamp).getTime()
    );
  }, [events, workflows]);

  // Group silent issue events by workflow
  const silentByWorkflow = useMemo(() => {
    const map = new Map<string, { events: WorkflowEvent[]; workflow: Workflow }>();
    for (const e of events) {
      if (e.event_type !== 'silent_issue') continue;
      const existing = map.get(e.workflowId);
      if (existing) {
        existing.events.push(e);
      } else {
        const wf = workflows.find((w) => w.id === e.workflowId);
        if (wf) map.set(e.workflowId, { events: [e], workflow: wf });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.events[0].timestamp).getTime() - new Date(a.events[0].timestamp).getTime()
    );
  }, [events, workflows]);

  // Top 3 workflows needing attention
  const topWorkflows = useMemo(
    () =>
      [...workflows]
        .sort((a, b) => {
          const scoreA = a.failureCountThisWeek + a.silentIssueCount;
          const scoreB = b.failureCountThisWeek + b.silentIssueCount;
          if (scoreB !== scoreA) return scoreB - scoreA;
          return a.healthScore - b.healthScore;
        })
        .slice(0, 3),
    [workflows]
  );

  return (
    <Card className="border-border">
      <CardContent className="pt-6 space-y-6">
        {/* ═══════════ 1. HEADER ═══════════ */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground leading-tight">
                Weekly Automation Reliability Report
              </h2>
              <p className="text-xs text-muted-foreground max-w-lg">
                A client-ready summary of automation health, failures, silent
                issues, and business risk.
              </p>
            </div>
            <ReportStatusBadge status={report.status} />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="font-medium text-foreground">
              {report.clientName}
            </span>
            {client?.industry && (
              <>
                <span className="text-border">|</span>
                <span className="text-muted-foreground">{client.industry}</span>
              </>
            )}
            <span className="text-border">|</span>
            <span className="text-muted-foreground">
              {format(new Date(report.periodStart), 'MMM d')} –{' '}
              {format(new Date(report.periodEnd), 'MMM d, yyyy')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Health score + status */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--reliava-healthy, #34d399)' }}>
                {report.healthScore}
              </span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${healthStatusStyle(healthStatus)}`}
            >
              {healthStatus}
            </span>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* ═══════════ 2. STATS GRID ═══════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatPill
            icon={<Activity className="size-3.5" />}
            label="Total Runs"
            value={report.totalRuns.toLocaleString()}
          />
          <StatPill
            icon={<CheckCircle className="size-3.5" />}
            label="Successful"
            value={report.successfulRuns.toLocaleString()}
            valueColor="text-emerald-400"
          />
          <StatPill
            icon={<XCircle className="size-3.5" />}
            label="Failed"
            value={report.failedRuns}
            valueColor={report.failedRuns > 0 ? 'text-red-400' : 'text-emerald-400'}
          />
          <StatPill
            icon={<EyeOff className="size-3.5" />}
            label="Silent Issues"
            value={report.silentIssues}
            valueColor={report.silentIssues > 0 ? 'text-amber-400' : 'text-emerald-400'}
          />
          <StatPill
            icon={<Workflow className="size-3.5" />}
            label="Workflows"
            value={report.workflowsMonitored}
          />
          <StatPill
            icon={<AlertTriangle className="size-3.5" />}
            label="Critical Events"
            value={report.criticalEvents}
            valueColor={report.criticalEvents > 0 ? 'text-red-400' : 'text-emerald-400'}
          />
        </div>

        <Separator className="bg-border" />

        {/* ═══════════ 3. EXECUTIVE SUMMARY ═══════════ */}
        <ReportSection
          icon={<ClipboardList className="size-3.5" />}
          title="Executive Summary"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            {report.executiveSummary}
          </p>
        </ReportSection>

        <Separator className="bg-border" />

        {/* ═══════════ 4. AUTOMATION HEALTH SCORE ═══════════ */}
        <ReportSection
          icon={<Heart className="size-3.5" />}
          iconColor={healthScoreColor(report.healthScore)}
          title="Automation Health Score"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-3xl font-bold tabular-nums ${healthScoreColor(report.healthScore)}`}>
              {report.healthScore}
            </span>
            <span className="text-sm text-muted-foreground">/ 100</span>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${healthStatusStyle(healthStatus)}`}
            >
              {healthStatus}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {report.healthExplanation}
          </p>
        </ReportSection>

        <Separator className="bg-border" />

        {/* ═══════════ 5. WHAT WORKED WELL ═══════════ */}
        <ReportSection
          icon={<TrendingUp className="size-3.5" />}
          iconColor="text-emerald-400"
          title="What Worked Well"
        >
          <ul className="space-y-2">
            {report.whatWorkedWell.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </ReportSection>

        {/* ═══════════ 6. FAILURES DETECTED ═══════════ */}
        {failureByWorkflow.length > 0 && (
          <>
            <Separator className="bg-border" />
            <ReportSection
              icon={<XCircle className="size-3.5" />}
              iconColor="text-red-400"
              title="Failures Detected"
            >
              <p className="text-xs text-muted-foreground mb-3">
                These workflows encountered errors during execution. Each failure
                represents a run that did not complete as expected.
              </p>
              <div className="divide-y divide-border rounded-lg border border-border bg-muted/20">
                {failureByWorkflow.map(({ events: evts, workflow: wf }) => (
                  <FailureRow
                    key={wf.id}
                    events={evts}
                    workflow={wf}
                  />
                ))}
              </div>
            </ReportSection>
          </>
        )}

        {/* ═══════════ 7. SILENT ISSUES DETECTED ═══════════ */}
        {silentByWorkflow.length > 0 && (
          <>
            <Separator className="bg-border" />
            <ReportSection
              icon={<EyeOff className="size-3.5" />}
              iconColor="text-amber-400"
              title="Silent Issues Detected"
            >
              <p className="text-xs text-muted-foreground mb-3">
                Silent issues are cases where the automation technically
                succeeded, but the business result was incomplete or risky.
                These would normally go unnoticed.
              </p>
              <div className="divide-y divide-border rounded-lg border border-amber-500/15 bg-amber-500/5">
                {silentByWorkflow.map(({ events: evts, workflow: wf }) => (
                  <SilentIssueRow
                    key={wf.id}
                    events={evts}
                    workflow={wf}
                  />
                ))}
              </div>
            </ReportSection>
          </>
        )}

        <Separator className="bg-border" />

        {/* ═══════════ 8. BUSINESS RISK SUMMARY ═══════════ */}
        <ReportSection
          icon={<FileWarning className="size-3.5" />}
          iconColor="text-amber-400"
          title="Business Risk Summary"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            {report.businessRiskSummary}
          </p>
        </ReportSection>

        <Separator className="bg-border" />

        {/* ═══════════ 9. AGENCY ACTION SUMMARY ═══════════ */}
        <ReportSection
          icon={<ShieldAlert className="size-3.5" />}
          iconColor="text-sky-400"
          title="Agency Action Summary"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            {report.agencyActionSummary}
          </p>
        </ReportSection>

        <Separator className="bg-border" />

        {/* ═══════════ 10. WORKFLOWS NEEDING ATTENTION ═══════════ */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Activity className="size-3.5 text-muted-foreground" />
            Workflows Needing Attention
          </h3>

          {/* Table header */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 py-1.5 px-1 text-xs text-muted-foreground uppercase tracking-wider">
            <span>Workflow</span>
            <span className="text-center">Status</span>
            <span className="text-right">Fails</span>
            <span className="text-right">Silent</span>
            <span className="text-right">Health</span>
          </div>

          <div className="divide-y divide-border rounded-lg border border-border bg-muted/20">
            {topWorkflows.map((wf) => (
              <div key={wf.id} className="px-3">
                <WorkflowAttentionRow wf={wf} />
                <p className="text-xs text-muted-foreground pb-2 pl-0.5">
                  <span className="text-foreground/60 font-medium">Action: </span>
                  {getRecommendedAction(wf)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border" />

        {/* ═══════════ 11. CLOSING NOTE ═══════════ */}
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/15 p-4">
          <p className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
            <Sparkles className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
            {report.closingNote}
          </p>
        </div>

        {/* ═══════════ FOOTER ═══════════ */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {successRate}% success rate &middot; Generated{' '}
            <TimeAgo date={report.generatedAt} />
          </span>
          {report.sentAt && <span>Sent <TimeAgo date={report.sentAt} /></span>}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// PastReportRow — compact row for older reports
// ---------------------------------------------------------------------------

function PastReportRow({ report }: { report: Report }) {
  const successRate =
    report.totalRuns > 0
      ? ((report.successfulRuns / report.totalRuns) * 100).toFixed(1)
      : '100.0';

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          Week of {format(new Date(report.periodStart), 'MMM d, yyyy')}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {report.totalRuns.toLocaleString()} runs &middot; {successRate}% success
          {report.failedRuns > 0 && (
            <span className="text-red-400 ml-2">{report.failedRuns} failures</span>
          )}
          {report.silentIssues > 0 && (
            <span className="text-amber-400 ml-2">{report.silentIssues} silent issues</span>
          )}
        </p>
      </div>
      <ReportStatusBadge status={report.status} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ClientReportsTab — main export
// ---------------------------------------------------------------------------

interface ClientReportsTabProps {
  clientId: string;
}

export function ClientReportsTab({ clientId }: ClientReportsTabProps) {
  const allReports = useAppStore((s) => s.reports);
  const allClients = useAppStore((s) => s.clients);
  const allWorkflows = useAppStore((s) => s.workflows);
  const allEvents = useAppStore((s) => s.events);

  const client = useMemo(
    () => allClients.find((c) => c.id === clientId),
    [allClients, clientId]
  );

  const clientWorkflows = useMemo(
    () => allWorkflows.filter((w) => w.clientId === clientId),
    [allWorkflows, clientId]
  );

  const clientEvents = useMemo(
    () => allEvents.filter((e) => e.clientId === clientId),
    [allEvents, clientId]
  );

  const { currentReport, pastReports } = useMemo(() => {
    const sorted = allReports
      .filter((r) => r.clientId === clientId)
      .sort(
        (a, b) =>
          new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
      );
    return {
      currentReport: sorted[0] ?? null,
      pastReports: sorted.slice(1),
    };
  }, [allReports, clientId]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Weekly reliability reports for this client"
      />

      {!currentReport ? (
        <Card className="border-border">
          <CardContent className="p-8 text-center text-muted-foreground">
            No reports generated yet.
          </CardContent>
        </Card>
      ) : (
        <>
          <FullReport
            report={currentReport}
            client={client}
            workflows={clientWorkflows}
            events={clientEvents}
          />

          {pastReports.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground px-1">
                Past Reports
              </h3>
              <Card className="border-border">
                <CardContent className="py-1 divide-y divide-border">
                  {pastReports.map((r) => (
                    <PastReportRow key={r.id} report={r} />
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}