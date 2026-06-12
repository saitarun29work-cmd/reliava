'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { PageHeader } from '@/components/reliava/shared/page-header';
import { HealthScoreRing } from '@/components/reliava/shared/health-score';
import { TimeAgo } from '@/components/reliava/shared/time-ago';
import { AlertStatusBadge, SeverityBadge } from '@/components/reliava/shared/status-badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Workflow, Bell, ChevronRight } from 'lucide-react';
import { ClientWorkflowsTab } from './client-workflows-tab';
import { ClientReportsTab } from './client-reports-tab';
import type { Client } from '@/lib/types';

interface ClientsPageProps {
  clientId?: string;
}

function ClientCard({ client, onClick }: { client: Client; onClick: () => void }) {
  const allAlerts = useAppStore((s) => s.alerts);
  const alerts = useMemo(
    () => allAlerts.filter((a) => a.clientId === client.id),
    [allAlerts, client.id]
  );
  const latestAlert = alerts.length > 0 ? alerts[0] : null;

  return (
    <Card
      className="border-border cursor-pointer hover:bg-accent/30 hover:border-border/80 transition-all"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">{client.name}</h3>
            {client.industry && (
              <Badge variant="secondary" className="text-xs">
                {client.industry}
              </Badge>
            )}
          </div>
          <HealthScoreRing score={client.healthScore} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        <p className="text-sm text-muted-foreground">
          {client.contactName} · {client.contactEmail}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Workflow className="h-3.5 w-3.5" />
            {client.workflowCount} workflows
          </span>
          <span
            className={`inline-flex items-center gap-1.5 ${
              client.activeAlertCount > 0 ? 'text-red-400' : ''
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            {client.activeAlertCount} active alerts
          </span>
        </div>
        {latestAlert && (
          <div className="rounded-md bg-muted/50 px-3 py-2 space-y-1">
            <div className="flex items-center gap-2">
              <SeverityBadge severity={latestAlert.severity} />
              <AlertStatusBadge status={latestAlert.status} />
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {latestAlert.message}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <span className="text-sm text-primary hover:underline inline-flex items-center gap-1">
          View details <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </CardFooter>
    </Card>
  );
}

export function ClientsPage({ clientId }: ClientsPageProps) {
  const { clients, navigate } = useAppStore();

  // If clientId is provided, show the detail page
  if (clientId) {
    const client = clients.find((c) => c.id === clientId);
    if (!client) {
      return (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-muted-foreground">Client not found.</p>
        </div>
      );
    }
    return <ClientDetailPage client={client} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Manage your agency clients and their workflow health"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onClick={() =>
              navigate({ page: 'client-detail', clientId: client.id })
            }
          />
        ))}
      </div>
    </div>
  );
}

function ClientDetailPage({ client }: { client: Client }) {
  const { navigate, alerts, reports } = useAppStore();

  const clientAlerts = useMemo(
    () =>
      alerts
        .filter((a) => a.clientId === client.id)
        .sort(
          (a, b) =>
            new Date(b.triggeredAt).getTime() -
            new Date(a.triggeredAt).getTime()
        ),
    [alerts, client.id]
  );

  const clientReports = useMemo(
    () =>
      reports
        .filter((r) => r.clientId === client.id)
        .sort(
          (a, b) =>
            new Date(b.generatedAt).getTime() -
            new Date(a.generatedAt).getTime()
        ),
    [reports, client.id]
  );

  const reportCount = clientReports.filter((r) => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(r.generatedAt) >= weekAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <button
          onClick={() => navigate({ page: 'dashboard' })}
          className="hover:text-foreground transition-colors"
        >
          Dashboard
        </button>
        <span>/</span>
        <button
          onClick={() => navigate({ page: 'clients' })}
          className="hover:text-foreground transition-colors"
        >
          Clients
        </button>
        <span>/</span>
        <span className="text-foreground">{client.name}</span>
      </nav>

      <PageHeader
        title={client.name}
        description={client.industry || 'Agency client'}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardContent className="p-4 flex flex-col items-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Health Score
                </p>
                <HealthScoreRing score={client.healthScore} size="md" />
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Total Workflows
                </p>
                <span className="text-3xl font-bold">{client.workflowCount}</span>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Active Alerts
                </p>
                <span
                  className={`text-3xl font-bold ${
                    client.activeAlertCount > 0 ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {client.activeAlertCount}
                </span>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Reports This Week
                </p>
                <span className="text-3xl font-bold">{reportCount}</span>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Recent Alerts
            </h2>
            {clientAlerts.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-6 text-center text-muted-foreground text-sm">
                  No alerts for this client.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {clientAlerts.slice(0, 5).map((alert) => (
                  <Card
                    key={alert.id}
                    className="border-border"
                  >
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-2 shrink-0">
                        <SeverityBadge severity={alert.severity} />
                        <AlertStatusBadge status={alert.status} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {alert.workflowName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {alert.message}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        <TimeAgo date={alert.triggeredAt} />
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="workflows">
          <ClientWorkflowsTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="reports">
          <ClientReportsTab clientId={client.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}