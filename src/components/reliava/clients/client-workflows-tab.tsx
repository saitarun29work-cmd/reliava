'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { PageHeader } from '@/components/reliava/shared/page-header';
import { StatusBadge } from '@/components/reliava/shared/status-badge';
import { TimeAgo } from '@/components/reliava/shared/time-ago';
import {
  Card,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ClientWorkflowsTabProps {
  clientId: string;
}

export function ClientWorkflowsTab({ clientId }: ClientWorkflowsTabProps) {
  const { navigate } = useAppStore();
  const allWorkflows = useAppStore((s) => s.workflows);
  const clientWorkflows = useMemo(
    () => allWorkflows.filter((w) => w.clientId === clientId),
    [allWorkflows, clientId]
  );

  const sorted = useMemo(
    () =>
      [...clientWorkflows].sort((a, b) => {
        const order = { critical: 0, warning: 1, healthy: 2, inactive: 3 };
        return (order[a.status] ?? 4) - (order[b.status] ?? 4);
      }),
    [clientWorkflows]
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Workflows" />
      <Card className="border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border bg-muted/50">
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                  Workflow
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">
                  Business Process
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                  Health
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
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider text-right">
                  Silent
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((wf) => (
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
                  <TableCell className="text-muted-foreground text-sm hidden sm:table-cell py-3">
                    {wf.businessProcess}
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusBadge status={wf.status} />
                  </TableCell>
                  <TableCell className="py-3">
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
                  <TableCell className="text-right py-3">
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
                </TableRow>
              ))}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No workflows configured for this client.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}