'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { PageHeader } from '@/components/reliava/shared/page-header';
import { ReportStatusBadge, StatusBadge } from '@/components/reliava/shared/status-badge';
import { TimeAgo } from '@/components/reliava/shared/time-ago';
import {
  Card,
  CardContent,
  CardHeader,
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
  ClipboardList,
} from 'lucide-react';
import type { Report, Workflow } from '@/lib/types';

interface ClientReportsTabProps {
  clientId: string;
}

// ---------------------------------------------------------------------------
// Stat pill used in the 5-column stats grid
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
    <div className="bg-muted/60 rounded-lg p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <span className="size-3.5">{icon}</span>
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-xl font-bold tabular-nums ${valueColor}`}>{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Workflow attention row inside the report
// ---------------------------------------------------------------------------
function WorkflowAttentionRow({ wf }: { wf: Workflow }) {
  return (
    <div className="flex items-center gap-4 py-2.5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{wf.name}</p>
      </div>
      <StatusBadge status={wf.status} />
      <span
        className={`text-sm tabular-nums w-12 text-right shrink-0 ${
          wf.failureCountThisWeek > 0 ? 'text-red-400 font-medium' : 'text-muted-foreground'
        }`}
      >
        {wf.failureCountThisWeek}
      </span>
      <span
        className={`text-sm tabular-nums w-12 text-right shrink-0 ${
          wf.silentIssueCount > 0 ? 'text-amber-400 font-medium' : 'text-muted-foreground'
        }`}
      >
        {wf.silentIssueCount}
      </span>
      <span
        className={`text-sm tabular-nums w-12 text-right font-semibold shrink-0 ${
          wf.healthScore >= 75
            ? 'text-emerald-400'
            : wf.healthScore >= 50
              ? 'text-amber-400'
              : 'text-red-400'
        }`}
      >
        {wf.healthScore}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FullReport — the expanded report card
// ---------------------------------------------------------------------------
function FullReport({ report, workflows }: { report: Report; workflows: Workflow[] }) {
  const successRate =
    report.totalRuns > 0
      ? ((report.successfulRuns / report.totalRuns) * 100).toFixed(1)
      : '100.0';

  // Top 3 workflows needing attention: sort by (failures + silentIssues) desc, then health asc
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
        {/* ── Header: title + status + client + period ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Weekly Automation Reliability Report
            </h2>
            <ReportStatusBadge status={report.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{report.clientName}</span>
            {' — '}
            {format(new Date(report.periodStart), 'MMM d, yyyy')}
            {' to '}
            {format(new Date(report.periodEnd), 'MMM d, yyyy')}
          </p>
        </div>

        <Separator className="bg-border" />

        {/* ── Stats grid (5 columns) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatPill
            icon={<Activity className="size-3.5" />}
            label="Total Runs"
            value={report.totalRuns.toLocaleString()}
          />
          <StatPill
            icon={<CheckCircle className="size-3.5" />}
            label="Successful Runs"
            value={report.successfulRuns.toLocaleString()}
            valueColor="text-emerald-400"
          />
          <StatPill
            icon={<XCircle className="size-3.5" />}
            label="Failed Runs"
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
            icon={<Heart className="size-3.5" />}
            label="Health Score"
            value={`${report.healthScore}%`}
            valueColor={
              report.healthScore >= 75
                ? 'text-emerald-400'
                : report.healthScore >= 50
                  ? 'text-amber-400'
                  : 'text-red-400'
            }
          />
        </div>

        <Separator className="bg-border" />

        {/* ── Executive Summary ── */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <ClipboardList className="size-3.5 text-muted-foreground" />
            Executive Summary
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {report.executiveSummary}
          </p>
        </div>

        <Separator className="bg-border" />

        {/* ── Business Risk Summary ── */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <AlertTriangle className="size-3.5 text-amber-400" />
            Business Risk Summary
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {report.businessRiskSummary}
          </p>
        </div>

        <Separator className="bg-border" />

        {/* ── Agency Action Summary ── */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <ShieldAlert className="size-3.5 text-sky-400" />
            Agency Action Summary
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {report.agencyActionSummary}
          </p>
        </div>

        <Separator className="bg-border" />

        {/* ── Workflows Needing Attention (top 3) ── */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Activity className="size-3.5 text-muted-foreground" />
            Workflows Needing Attention
          </h3>

          {/* Table header */}
          <div className="flex items-center gap-4 py-1.5 px-1 text-xs text-muted-foreground uppercase tracking-wider">
            <div className="flex-1">Workflow</div>
            <div className="w-20 text-center shrink-0">Status</div>
            <div className="w-12 text-right shrink-0">Fails</div>
            <div className="w-12 text-right shrink-0">Silent</div>
            <div className="w-12 text-right shrink-0">Health</div>
          </div>

          <div className="divide-y divide-border">
            {topWorkflows.map((wf) => (
              <WorkflowAttentionRow key={wf.id} wf={wf} />
            ))}
          </div>
        </div>

        <Separator className="bg-border" />

        {/* ── Footer ── */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Success rate: {successRate}% &middot; Generated{' '}
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
export function ClientReportsTab({ clientId }: ClientReportsTabProps) {
  const allReports = useAppStore((s) => s.reports);
  const allWorkflows = useAppStore((s) => s.workflows);

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

  const clientWorkflows = useMemo(
    () => allWorkflows.filter((w) => w.clientId === clientId),
    [allWorkflows, clientId]
  );

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
          {/* Latest (full) report */}
          <FullReport report={currentReport} workflows={clientWorkflows} />

          {/* Past reports list */}
          {pastReports.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground px-1 mb-2">
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