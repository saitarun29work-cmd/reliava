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
  Wrench,
  Sparkles,
  Workflow,
  CircleDot,
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

/** Translate a raw technical error into business language */
function translateErrorToBusiness(
  workflow: Workflow,
  event: WorkflowEvent
): string {
  const n = workflow.name.toLowerCase();
  const bp = workflow.businessProcess.toLowerCase();
  const err =
    typeof event.payload_summary.error_message === 'string'
      ? event.payload_summary.error_message
      : '';

  if (err.includes('timeout') || err.includes('504')) {
    if (n.includes('email') || n.includes('confirmation'))
      return 'Email provider took too long to respond — confirmation messages may not have been sent.';
    if (n.includes('api') || n.includes('http'))
      return 'An external service took too long to respond — the expected action was not completed.';
    return 'An external service timed out — the workflow step did not finish.';
  }
  if (err.includes('502') || err.includes('upstream') || err.includes('unavailable'))
    return 'An external service was temporarily unavailable — the expected data was not received.';
  if (err.includes('duplicate') || err.includes('idempotency'))
    return 'A duplicate record was detected — the same action may have been attempted twice.';
  if (err.includes('signature') || err.includes('sig_mismatch'))
    return 'Security validation failed — the incoming data was not trusted.';
  if (err.includes('pool exhausted') || err.includes('503'))
    return 'The target system ran out of capacity — new records could not be saved.';
  if (err.includes('template') || err.includes('not found'))
    return 'A required resource was missing — the expected message could not be sent.';
  if (err.includes('rate limit') || err.includes('429'))
    return 'Too many requests were sent — the external service asked to slow down.';
  if (err.includes('size') || err.includes('too large') || err.includes('413'))
    return 'The incoming data was too large to process — the record was rejected.';
  if (err.includes('partial') || err.includes('undelivered'))
    return 'Some messages were delivered but not all — some recipients may not have received the communication.';
  if (err.includes('schema') || err.includes('invalid response'))
    return 'The external service returned data in an unexpected format — the result could not be processed.';

  // Fallback — rephrase raw error in business terms
  if (n.includes('sync') || n.includes('crm'))
    return `Data sync did not complete — ${bp} data may not have reached the target system.`;
  if (n.includes('billing') || n.includes('stripe'))
    return `A billing event was not processed correctly — invoice or payment data may be affected.`;
  if (n.includes('onboarding') || n.includes('user'))
    return `The onboarding step did not complete — the new user setup may be incomplete.`;
  if (n.includes('claim'))
    return `The claim was not processed — patient reimbursement may be delayed.`;
  if (n.includes('appointment') || n.includes('reminder'))
    return `The notification step failed — the recipient may not have been reached.`;
  return `A workflow step did not complete as expected — the business process may be incomplete.`;
}

/** Derive a client-friendly business impact string */
function deriveBusinessImpact(
  workflow: Workflow,
  eventType: 'failure' | 'silent_issue'
): string {
  const n = workflow.name.toLowerCase();

  if (eventType === 'silent_issue') {
    if (n.includes('crm') || n.includes('sync'))
      return 'New leads or customer records may not have been saved properly.';
    if (n.includes('email') || n.includes('reminder') || n.includes('notification'))
      return 'Communication may have been sent with incomplete or missing data.';
    if (n.includes('dashboard') || n.includes('analysis') || n.includes('churn'))
      return 'Reports or scores may be based on stale or missing data.';
    if (n.includes('billing') || n.includes('stripe'))
      return 'Billing records may be incomplete or inaccurate.';
    return 'Business output may be incomplete despite the workflow reporting success.';
  }

  // failure
  if (n.includes('email') || n.includes('confirmation'))
    return 'Customers may not have received expected messages.';
  if (n.includes('crm') || n.includes('sync'))
    return 'Customer data may not have reached the target system.';
  if (n.includes('billing') || n.includes('stripe'))
    return 'Billing events may be delayed or duplicated.';
  if (n.includes('claim'))
    return 'Insurance claims may not have been processed.';
  if (n.includes('appointment') || n.includes('reminder'))
    return 'Patients may not have received their notifications.';
  if (n.includes('onboarding'))
    return 'New users may not have been fully set up.';
  if (n.includes('report') || n.includes('dashboard'))
    return 'Reports may not have been generated or delivered.';
  if (n.includes('reorder') || n.includes('inventory'))
    return 'Stock replenishment may have been delayed.';
  return 'A business process step did not complete as expected.';
}

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
// Section header
// ---------------------------------------------------------------------------

function SectionHeader({
  icon,
  iconColor,
  title,
}: {
  icon: React.ReactNode;
  iconColor?: string;
  title: string;
}) {
  return (
    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
      <span className={`size-4 shrink-0 ${iconColor ?? 'text-muted-foreground'}`}>
        {icon}
      </span>
      {title}
    </h3>
  );
}

// ---------------------------------------------------------------------------
// FailureRow
// ---------------------------------------------------------------------------

function FailureRow({
  event,
  workflow,
  count,
}: {
  event: WorkflowEvent;
  workflow: Workflow;
  count: number;
}) {
  const businessError = translateErrorToBusiness(workflow, event);

  return (
    <div className="py-3">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <p className="text-sm font-medium text-foreground">{workflow.name}</p>
        <SeverityBadge severity={event.severity} />
        <span className="text-xs text-muted-foreground">
          {count} {count === 1 ? 'failure' : 'failures'}
        </span>
      </div>
      <p className="text-sm text-red-400/90">{businessError}</p>
      <p className="text-xs text-muted-foreground mt-1">
        <span className="text-foreground/60 font-medium">Business impact: </span>
        {deriveBusinessImpact(workflow, 'failure')}
      </p>
      <p className="text-xs text-muted-foreground/60 mt-0.5">
        Last occurred <TimeAgo date={event.timestamp} />
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SilentIssueRow
// ---------------------------------------------------------------------------

function SilentIssueRow({
  event,
  workflow,
  count,
}: {
  event: WorkflowEvent;
  workflow: Workflow;
  count: number;
}) {
  const rule =
    typeof event.payload_summary.rule_violated === 'string'
      ? event.payload_summary.rule_violated
      : 'Unknown rule';

  // Extract the human-readable "missing field" from payload
  const affectedField = extractAffectedField(event.payload_summary, workflow);

  return (
    <div className="py-3">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <p className="text-sm font-medium text-foreground">{workflow.name}</p>
        <span className="inline-flex items-center rounded-md border border-amber-500/25 bg-amber-500/10 text-amber-400 px-1.5 py-0.5 text-xs font-medium">
          {count} {count === 1 ? 'issue' : 'issues'}
        </span>
      </div>
      <p className="text-xs text-muted-foreground font-mono">
        Rule violated: {rule}
      </p>
      {affectedField && (
        <p className="text-xs text-amber-400/80 mt-0.5">
          Missing/bad field: {affectedField}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        <span className="text-foreground/60 font-medium">Business impact: </span>
        {deriveBusinessImpact(workflow, 'silent_issue')}
      </p>
      <p className="text-xs text-muted-foreground/60 mt-0.5">
        Detected <TimeAgo date={event.timestamp} />
      </p>
    </div>
  );
}

/** Extract the most relevant "missing field" from a silent issue payload */
function extractAffectedField(
  payload: Record<string, unknown>,
  workflow: Workflow
): string | null {
  const ps = payload as Record<string, unknown>;
  const n = workflow.name.toLowerCase();

  // Check for explicit missing-field indicators
  if (ps.missing_phone_count) return 'phone_number';
  if (ps.records_synced === 0 || ps.records_skipped) return 'records_synced';
  if (ps.records_scored === 0) return 'records_scored';
  if (ps.reminders_sent === 0) return 'phone_number (reminder step)';
  if (ps.data_freshness_minutes && typeof ps.data_freshness_minutes === 'number' && ps.data_freshness_minutes > 60)
    return 'data_freshness';

  // Derive from workflow name
  if (n.includes('crm') || n.includes('sync')) return 'crm_contact_id';
  if (n.includes('email') || n.includes('confirmation')) return 'email_delivery_status';
  if (n.includes('whatsapp')) return 'whatsapp_message_id';
  if (n.includes('reminder') || n.includes('appointment')) return 'phone_number';

  return null;
}

// ---------------------------------------------------------------------------
// WorkflowAttentionRow
// ---------------------------------------------------------------------------

function WorkflowAttentionRow({ wf }: { wf: Workflow }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 gap-y-1 py-2.5 items-center">
      <p className="text-sm font-medium text-foreground truncate">{wf.name}</p>
      <StatusBadge status={wf.status} />
      <span
        className={`text-sm tabular-nums w-10 text-right ${
          wf.failureCountThisWeek > 0 ? 'text-red-400 font-medium' : 'text-muted-foreground'
        }`}
      >
        {wf.failureCountThisWeek}
      </span>
      <span
        className={`text-sm tabular-nums w-10 text-right ${
          wf.silentIssueCount > 0 ? 'text-amber-400 font-medium' : 'text-muted-foreground'
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
// FullReport
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

  // Healthy workflows for "What Worked" section
  const healthyWorkflows = useMemo(
    () =>
      workflows
        .filter((w) => w.status === 'healthy' && w.failureCountThisWeek === 0 && w.silentIssueCount === 0)
        .sort((a, b) => b.healthScore - a.healthScore),
    [workflows]
  );

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
      (a, b) => b.events.length - a.events.length
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
    <div className="space-y-4">
      {/* ═══════════ HEADER ═══════════ */}
      <Card className="border-border">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold text-foreground leading-tight">
                Weekly Automation Reliability Report
              </h2>
              <p className="text-xs text-muted-foreground">
                Business outcome summary for client automations.
              </p>
            </div>
            <ReportStatusBadge status={report.status} />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="font-medium text-foreground">{report.clientName}</span>
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

          <div className="flex items-center gap-3">
            <span
              className={`text-3xl font-bold tabular-nums ${healthScoreColor(report.healthScore)}`}
            >
              {report.healthScore}
            </span>
            <span className="text-sm text-muted-foreground">/ 100</span>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${healthStatusStyle(healthStatus)}`}
            >
              {healthStatus}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ═══════════ PRIMARY SUMMARY CARD ═══════════ */}
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="pt-5 pb-4">
          <p className="text-sm text-foreground leading-relaxed">
            {report.executiveSummary}
          </p>
        </CardContent>
      </Card>

      {/* ═══════════ STATS GRID ═══════════ */}
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
          label="Critical Business Risks"
          value={report.criticalBusinessRisks}
          valueColor={report.criticalBusinessRisks > 0 ? 'text-red-400' : 'text-emerald-400'}
        />
      </div>

      {/* ═══════════ HEALTH SCORE EXPLANATION ═══════════ */}
      <Card className="border-border">
        <CardContent className="pt-4 pb-3 space-y-2">
          <div className="flex items-center gap-3">
            <Heart className={`size-4 ${healthScoreColor(report.healthScore)}`} />
            <span className="text-sm font-semibold text-foreground">
              Automation Health: {report.healthScore}/100 — {healthStatus}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {report.healthExplanation}
          </p>
        </CardContent>
      </Card>

      {/* ═══════════ SECTION 1: WHAT WORKED ═══════════ */}
      <Card className="border-border">
        <CardContent className="pt-4 pb-3 space-y-3">
          <SectionHeader
            icon={<TrendingUp className="size-4" />}
            iconColor="text-emerald-400"
            title="What Worked"
          />

          {healthyWorkflows.length > 0 ? (
            <div className="space-y-2">
              {healthyWorkflows.map((wf) => (
                <div key={wf.id} className="flex items-center gap-2">
                  <CheckCircle className="size-3.5 text-emerald-400 shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">{wf.name}</span>
                    {' — '}
                    {wf.businessProcess}
                  </span>
                  <span className={`ml-auto text-xs tabular-nums font-medium ${healthScoreColor(wf.healthScore)}`}>
                    {wf.healthScore}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No workflows maintained perfect health this week.
            </p>
          )}

          {report.whatWorkedWell.length > 0 && (
            <ul className="space-y-1.5 border-t border-border pt-2">
              {report.whatWorkedWell.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CircleDot className="size-3 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* ═══════════ SECTION 2: WHAT FAILED ═══════════ */}
      {failureByWorkflow.length > 0 && (
        <Card className="border-red-500/15">
          <CardContent className="pt-4 pb-3 space-y-3">
            <SectionHeader
              icon={<XCircle className="size-4" />}
              iconColor="text-red-400"
              title="What Failed"
            />
            <p className="text-xs text-muted-foreground">
              These workflows did not complete as expected. Errors are
              translated into business impact below.
            </p>
            <div className="divide-y divide-border">
              {failureByWorkflow.map(({ events: evts, workflow: wf }) => (
                <FailureRow
                  key={wf.id}
                  event={evts[0]}
                  workflow={wf}
                  count={evts.length}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══════════ SECTION 3: SILENT ISSUES DETECTED ═══════════ */}
      {silentByWorkflow.length > 0 && (
        <Card className="border-amber-500/15 bg-amber-500/[0.03]">
          <CardContent className="pt-4 pb-3 space-y-3">
            <SectionHeader
              icon={<EyeOff className="size-4" />}
              iconColor="text-amber-400"
              title="Silent Issues Detected"
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Silent issues are cases where the automation technically
              succeeded, but the business output was incomplete. These would
              normally go unnoticed until a client complains.
            </p>
            <div className="divide-y divide-border">
              {silentByWorkflow.map(({ events: evts, workflow: wf }) => (
                <SilentIssueRow
                  key={wf.id}
                  event={evts[0]}
                  workflow={wf}
                  count={evts.length}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══════════ SECTION 4: BUSINESS RISK SUMMARY ═══════════ */}
      <Card className="border-border">
        <CardContent className="pt-4 pb-3 space-y-2">
          <SectionHeader
            icon={<AlertTriangle className="size-4" />}
            iconColor="text-amber-400"
            title="Business Risk Summary"
          />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {report.businessRiskSummary}
          </p>
        </CardContent>
      </Card>

      {/* ═══════════ SECTION 5: PRIORITY FIX LIST ═══════════ */}
      {report.priorityFixes.length > 0 && (
        <Card className="border-sky-500/15 bg-sky-500/[0.03]">
          <CardContent className="pt-4 pb-3 space-y-3">
            <SectionHeader
              icon={<Wrench className="size-4" />}
              iconColor="text-sky-400"
              title="Priority Fix List"
            />
            <p className="text-xs text-muted-foreground">
              Recommended fixes, ordered by business impact.
            </p>
            <ol className="space-y-2">
              {report.priorityFixes.map((fix, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex items-center justify-center size-5 rounded-full bg-sky-500/15 text-sky-400 text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground leading-relaxed">
                    {fix}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* ═══════════ SECTION 6: AGENCY ACTION SUMMARY ═══════════ */}
      <Card className="border-border">
        <CardContent className="pt-4 pb-3 space-y-2">
          <SectionHeader
            icon={<ShieldAlert className="size-4" />}
            iconColor="text-sky-400"
            title="Agency Action Summary"
          />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {report.agencyActionSummary}
          </p>
        </CardContent>
      </Card>

      {/* ═══════════ SECTION 7: WORKFLOWS NEEDING ATTENTION ═══════════ */}
      <Card className="border-border">
        <CardContent className="pt-4 pb-3 space-y-3">
          <SectionHeader
            icon={<Activity className="size-4" />}
            title="Workflows Needing Attention"
          />

          <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 py-1 px-1 text-xs text-muted-foreground uppercase tracking-wider">
            <span>Workflow</span>
            <span className="text-center">Status</span>
            <span className="text-right">Fails</span>
            <span className="text-right">Silent</span>
            <span className="text-right">Health</span>
          </div>

          <div className="divide-y divide-border">
            {topWorkflows.map((wf) => (
              <div key={wf.id} className="px-1">
                <WorkflowAttentionRow wf={wf} />
                <p className="text-xs text-muted-foreground pb-2.5 pl-0.5">
                  <span className="text-foreground/60 font-medium">Action: </span>
                  {getRecommendedAction(wf)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ═══════════ SECTION 8: CLIENT CONFIDENCE NOTE ═══════════ */}
      <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-4">
        <p className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
          <Sparkles className="size-4 text-emerald-400 shrink-0 mt-0.5" />
          {report.closingNote}
        </p>
      </div>

      {/* ═══════════ FOOTER ═══════════ */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          {successRate}% success rate &middot; Generated{' '}
          <TimeAgo date={report.generatedAt} />
        </span>
        {report.sentAt && <span>Sent <TimeAgo date={report.sentAt} /></span>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PastReportRow
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