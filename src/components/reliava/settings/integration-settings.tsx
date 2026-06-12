'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { PageHeader } from '@/components/reliava/shared/page-header';
import { useAppStore } from '@/lib/store';

// ---------------------------------------------------------------------------
// IntegrationSettings
// ---------------------------------------------------------------------------
export function IntegrationSettings() {
  const navigate = useAppStore((s) => s.navigate);

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://app.reliava.com';
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured';

  return (
    <div className="space-y-6">
      {/* ---- Breadcrumb ---- */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="cursor-pointer"
              onClick={() => navigate({ page: 'dashboard' })}
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              className="cursor-pointer"
              onClick={() => navigate({ page: 'settings' })}
            >
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Integrations</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Integrations"
        description="Configure webhook endpoints for n8n"
      />

      <div className="space-y-4 max-w-2xl">
        {/* n8n Webhook Base URL */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">n8n Webhook Base URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-md p-3 font-mono text-sm text-foreground break-all">
              {apiBaseUrl}/api/ingest
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Each workflow has its own unique endpoint. Configure webhooks from the
              Workflow Detail page.
            </p>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">API Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ConfigRow label="Webhook Timeout" value="30 seconds" />
              <ConfigRow label="Max Payload Size" value="10 MB" />
              <ConfigRow label="Retry Policy" value="None (MVP)" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Advanced configuration options will be available in future updates.
            </p>
          </CardContent>
        </Card>

        {/* Environment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ConfigRow label="API Base URL" value={apiBaseUrl} />
              <ConfigRow label="Supabase Project" value={supabaseUrl} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ConfigRow — label + mono value row
// ---------------------------------------------------------------------------
function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm text-foreground">{value}</span>
    </div>
  );
}
