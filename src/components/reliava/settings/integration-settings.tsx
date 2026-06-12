'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Plug, Lock } from 'lucide-react';

// ---------------------------------------------------------------------------
// IntegrationSettings
// ---------------------------------------------------------------------------
export function IntegrationSettings() {
  const navigate = useAppStore((s) => s.navigate);

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
        description="Connect automation platforms to Reliava"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
        {/* n8n — Active */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-lg bg-muted">
                  <Plug className="size-4 text-foreground" />
                </div>
                <CardTitle className="text-sm">n8n</CardTitle>
              </div>
              <Badge variant="outline" className="border-emerald-500/25 bg-emerald-500/15 text-emerald-400 text-xs">
                Active in V1
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>
              Reliava receives workflow success and failure events from n8n webhooks.
            </CardDescription>
            <p className="text-xs text-muted-foreground">
              Each workflow has its own unique webhook URL. Configure webhooks from the Workflow Detail page.
            </p>
          </CardContent>
        </Card>

        {/* Make — Not in V1 */}
        <Card className="border-border opacity-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-lg bg-muted">
                  <Lock className="size-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-sm text-muted-foreground">Make</CardTitle>
              </div>
              <Badge variant="outline" className="border-zinc-500/25 bg-zinc-500/15 text-zinc-400 text-xs">
                Not in V1
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription className="text-muted-foreground">
              Make integration will be available in a future release.
            </CardDescription>
            <Button variant="outline" size="sm" disabled>
              Coming soon
            </Button>
          </CardContent>
        </Card>

        {/* Zapier — Not in V1 */}
        <Card className="border-border opacity-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-lg bg-muted">
                  <Lock className="size-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-sm text-muted-foreground">Zapier</CardTitle>
              </div>
              <Badge variant="outline" className="border-zinc-500/25 bg-zinc-500/15 text-zinc-400 text-xs">
                Not in V1
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription className="text-muted-foreground">
              Zapier integration will be available in a future release.
            </CardDescription>
            <Button variant="outline" size="sm" disabled>
              Coming soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}