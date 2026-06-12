'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { PageHeader } from '@/components/reliava/shared/page-header';
import { ReportStatusBadge } from '@/components/reliava/shared/status-badge';
import { TimeAgo } from '@/components/reliava/shared/time-ago';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { format } from 'date-fns';

interface ClientReportsTabProps {
  clientId: string;
}

export function ClientReportsTab({ clientId }: ClientReportsTabProps) {
  const allReports = useAppStore((s) => s.reports);
  const clientReports = useMemo(
    () =>
      allReports
        .filter((r) => r.clientId === clientId)
        .sort(
          (a, b) =>
            new Date(b.generatedAt).getTime() -
            new Date(a.generatedAt).getTime()
        ),
    [allReports, clientId]
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Reports"
        description="Weekly reliability reports for this client"
      />
      {clientReports.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-8 text-center text-muted-foreground">
            No reports generated yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientReports.map((report) => (
            <Card key={report.id} className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-foreground">
                    Week of{' '}
                    {format(new Date(report.periodStart), 'MMM d, yyyy')}
                  </h3>
                  <ReportStatusBadge status={report.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Total Runs
                    </p>
                    <p className="text-lg font-semibold">{report.totalRuns.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Success Rate
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        report.successRate >= 95
                          ? 'text-emerald-400'
                          : report.successRate >= 85
                            ? 'text-amber-400'
                            : 'text-red-400'
                      }`}
                    >
                      {report.successRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Total Failures
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        report.totalFailures > 0
                          ? 'text-red-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {report.totalFailures}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      MTTR
                    </p>
                    <p className="text-lg font-semibold">
                      {report.meanTimeToRecovery > 0
                        ? `${report.meanTimeToRecovery}m`
                        : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                  <span>Generated <TimeAgo date={report.generatedAt} /></span>
                  {report.sentAt && (
                    <span>Sent <TimeAgo date={report.sentAt} /></span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}