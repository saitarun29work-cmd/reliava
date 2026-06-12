'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/reliava/shared/page-header';
import { useAppStore } from '@/lib/store';
import { Building2, Plug, BellRing, ArrowRight } from 'lucide-react';

// ---------------------------------------------------------------------------
// SettingsPage — router for sub-settings
// ---------------------------------------------------------------------------
export function SettingsPage() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Agency Profile */}
        <Card
          className="cursor-pointer transition-colors hover:bg-accent/50"
          onClick={() => navigate({ page: 'settings-agency' })}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-muted">
                <Building2 className="size-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-sm">Agency Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Manage your agency name, contact info, and plan
            </CardDescription>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card
          className="cursor-pointer transition-colors hover:bg-accent/50"
          onClick={() => navigate({ page: 'settings-integrations' })}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-muted">
                <Plug className="size-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-sm">Integrations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Configure n8n webhook endpoints and API access
            </CardDescription>
          </CardContent>
        </Card>

        {/* Alert Rules — Coming soon */}
        <Card className="cursor-default">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-muted">
                <BellRing className="size-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-sm">Alert Rules</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Configure when and how you get notified about workflow issues
            </CardDescription>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-md px-2 py-1">
                <ArrowRight className="size-3" />
                Coming soon
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
