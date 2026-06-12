'use client';

import { useAppStore } from '@/lib/store';
import { AppShell } from '@/components/reliava/app-shell';
import { LoginPage } from '@/components/reliava/auth/login-page';
import { SignupPage } from '@/components/reliava/auth/signup-page';
import { DashboardPage } from '@/components/reliava/dashboard/dashboard-page';
import { ClientsPage } from '@/components/reliava/clients/clients-page';
import { WorkflowDetailPage } from '@/components/reliava/workflows/workflow-detail-page';
import { EventTimeline } from '@/components/reliava/workflows/event-timeline';
import { SettingsPage } from '@/components/reliava/settings/settings-page';
import { AgencySettings } from '@/components/reliava/settings/agency-settings';
import { IntegrationSettings } from '@/components/reliava/settings/integration-settings';
import { PageHeader } from '@/components/reliava/shared/page-header';
import { HealthScoreRing } from '@/components/reliava/shared/health-score';
import { StatusBadge } from '@/components/reliava/shared/status-badge';
import { SeverityBadge, CriticalityBadge } from '@/components/reliava/shared/status-badge';
import { TimeAgo } from '@/components/reliava/shared/time-ago';
import type { Route } from '@/lib/types';

// ---------------------------------------------------------------------------
// Route renderer — maps the store's Route union to the correct component
// ---------------------------------------------------------------------------
function RouteView() {
  const route = useAppStore((s) => s.route);

  switch (route.page) {
    case 'login':
      return <LoginPage />;
    case 'signup':
      return <SignupPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'clients':
      return <ClientsPage />;
    case 'client-detail':
      return <ClientsPage clientId={route.clientId} />;
    case 'client-workflows':
      return <ClientsPage clientId={route.clientId} />;
    case 'client-reports':
      return <ClientsPage clientId={route.clientId} />;
    case 'workflow-detail':
      return <WorkflowDetailPage workflowId={route.workflowId} />;
    case 'settings':
      return <SettingsPage />;
    case 'settings-agency':
      return <AgencySettings />;
    case 'settings-integrations':
      return <IntegrationSettings />;
    default:
      return <DashboardPage />;
  }
}

// ---------------------------------------------------------------------------
// Root page — SPA entry point
// ---------------------------------------------------------------------------
export default function Home() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <RouteView />;
  }

  return (
    <AppShell>
      <RouteView />
    </AppShell>
  );
}