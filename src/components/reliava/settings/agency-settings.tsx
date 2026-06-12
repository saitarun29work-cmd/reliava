'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
// AgencySettings
// ---------------------------------------------------------------------------
export function AgencySettings() {
  const agency = useAppStore((s) => s.agency);
  const navigate = useAppStore((s) => s.navigate);

  if (!agency) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Agency not found.</p>
      </div>
    );
  }

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
            <BreadcrumbPage>Agency Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader title="Agency Profile" />

      <Card>
        <CardContent>
          <div className="space-y-5 max-w-lg">
            {/* Agency Name */}
            <div className="space-y-2">
              <Label htmlFor="agency-name">Agency Name</Label>
              <Input
                id="agency-name"
                value={agency.name}
                disabled
                className="bg-muted/50"
              />
            </div>

            {/* Primary Contact */}
            <div className="space-y-2">
              <Label htmlFor="primary-contact">Primary Contact</Label>
              <Input
                id="primary-contact"
                value={agency.primaryContact}
                disabled
                className="bg-muted/50"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="agency-email">Email</Label>
              <Input
                id="agency-email"
                type="email"
                value={agency.email}
                disabled
                className="bg-muted/50"
              />
            </div>

            {/* Plan */}
            <div className="space-y-2">
              <Label>Plan</Label>
              <div>
                <Badge variant="secondary" className="capitalize">
                  {agency.plan}
                </Badge>
              </div>
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label>Slug</Label>
              <div className="bg-muted rounded-md px-3 py-2 font-mono text-sm text-foreground">
                {agency.slug}
              </div>
            </div>

            {/* V1 note */}
            <p className="text-sm text-muted-foreground pt-2 border-t border-border">
              Editing agency profile will be available after backend is connected.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}