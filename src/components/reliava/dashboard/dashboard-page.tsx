'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { computeDashboardStats } from '@/lib/mock-data';
import { PageHeader } from '@/components/reliava/shared/page-header';
import { StatusBadge } from '@/components/reliava/shared/status-badge';
import { TimeAgo } from '@/components/reliava/shared/time-ago';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Workflow,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowDownCircle,
  EyeOff,
  ShieldAlert,
  Activity,
} from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconColor?: string;
}

function StatCard({ icon, value, label, iconColor = 'text-foreground' }: StatCardProps) {
  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <div className={`h-4 w-4 ${iconColor}`}>{icon}</div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
              {label}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { workflows, clients, events, navigate } = useAppStore();
  const stats = useMemo(
    () => computeDashboardStats(clients, workflows, events),
    [clients, workflows, events]
  );

  const sortedWorkflows = useMemo(
    () =>
      [...workflows].sort((a, b) => {
        const order = { critical: 0, warning: 1, healthy: 2, inactive: 3 };
        return (order[a.status] ?? 4) - (order[b.status] ?? 4);
      }),
    [workflows]
  );

  const displayedWorkflows = sortedWorkflows.slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Real-time overview of all client workflows"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="h-4 w-4" />}
          value={stats.totalClients}
          label="Total Clients"
          iconColor="text-emerald-400"
        />
        <StatCard
          icon={<Workflow className="h-4 w-4" />}
          value={stats.totalWorkflows}
          label="Total Workflows"
          iconColor="text-sky-400"
        />
        <StatCard
          icon={<CheckCircle className="h-4 w-4" />}
          value={stats.healthyWorkflows}
          label="Healthy Workflows"
          iconColor="text-emerald-400"
        />
        <StatCard
          icon={<AlertTriangle className="h-4 w-4" />}
          value={stats.warningWorkflows}
          label="Warning Workflows"
          iconColor="text-amber-400"
        />
        <StatCard
          icon={<XCircle className="h-4 w-4" />}
          value={stats.criticalWorkflows}
          label="Critical Workflows"
          iconColor="text-red-400"
        />
        <StatCard
          icon={<ArrowDownCircle className="h-4 w-4" />}
          value={stats.failedRunsThisWeek}
          label="Failed Runs This Week"
          iconColor="text-red-400"
        />
        <StatCard
          icon={<EyeOff className="h-4 w-4" />}
          value={stats.silentIssuesThisWeek}
          label="Silent Issues This Week"
          iconColor="text-amber-400"
        />
        <StatCard
          icon={<ShieldAlert className="h-4 w-4" />}
          value={stats.criticalEventsLast24h}
          label="Last 24h Critical Events"
          iconColor="text-red-400"
        />
        <StatCard
          icon={<Activity className="h-4 w-4" />}
          value={`${stats.avgClientHealthScore}%`}
          label="Avg Client Health Score"
          iconColor="text-emerald-400"
        />
      </div>

      {/* Workflows Table */}
      <div className="space-y-3">
        <PageHeader title="All Workflows" />
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border bg-muted/50">
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Workflow
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Client
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Platform
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">
                    Business Process
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">
                    Last Success
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">
                    Last Failure
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider text-right">
                    Fails
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider text-right hidden sm:table-cell">
                    Silent
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider text-right">
                    Health
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedWorkflows.map((wf) => (
                  <TableRow
                    key={wf.id}
                    className="border-border cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() =>
                      navigate({ page: 'workflow-detail', workflowId: wf.id })
                    }
                  >
                    <TableCell className="font-medium text-foreground py-3">
                      {wf.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm py-3">
                      {wf.clientName}
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {wf.platform}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden lg:table-cell py-3">
                      {wf.businessProcess}
                    </TableCell>
                    <TableCell className="py-3">
                      <StatusBadge status={wf.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden md:table-cell py-3">
                      {wf.lastSuccessAt ? (
                        <TimeAgo date={wf.lastSuccessAt} />
                      ) : (
                        <span className="text-zinc-500">Never</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden md:table-cell py-3">
                      {wf.lastFailureAt ? (
                        <span className="text-red-400/80">
                          <TimeAgo date={wf.lastFailureAt} />
                        </span>
                      ) : (
                        <span className="text-emerald-400/60">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <span
                        className={
                          wf.failureCountThisWeek > 0
                            ? 'text-red-400 font-medium'
                            : 'text-muted-foreground'
                        }
                      >
                        {wf.failureCountThisWeek}
                      </span>
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell py-3">
                      <span
                        className={
                          wf.silentIssueCount > 0
                            ? 'text-amber-400 font-medium'
                            : 'text-muted-foreground'
                        }
                      >
                        {wf.silentIssueCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <span
                        className={`font-semibold text-sm ${
                          wf.healthScore >= 75
                            ? 'text-emerald-400'
                            : wf.healthScore >= 50
                              ? 'text-amber-400'
                              : 'text-red-400'
                        }`}
                      >
                        {wf.healthScore}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {workflows.length > 10 && (
            <div className="border-t border-border px-4 py-3">
              <button
                onClick={() => navigate({ page: 'clients' })}
                className="text-sm text-primary hover:underline"
              >
                View all workflows across clients →
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}