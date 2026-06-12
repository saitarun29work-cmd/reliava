'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  const [name, setName] = useState(() => agency?.name ?? '');
  const [contact, setContact] = useState(() => agency?.primaryContact ?? '');
  const [email, setEmail] = useState(() => agency?.email ?? '');

  const hasChanges = useMemo(() => {
    if (!agency) return false;
    return name !== agency.name || contact !== agency.primaryContact || email !== agency.email;
  }, [name, contact, email, agency]);

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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your agency name"
              />
            </div>

            {/* Primary Contact */}
            <div className="space-y-2">
              <Label htmlFor="primary-contact">Primary Contact</Label>
              <Input
                id="primary-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Contact person name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="agency-email">Email</Label>
              <Input
                id="agency-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@agency.com"
              />
            </div>

            {/* Plan (read-only badge) */}
            <div className="space-y-2">
              <Label>Plan</Label>
              <div>
                <Badge variant="secondary" className="capitalize">
                  {agency.plan}
                </Badge>
              </div>
            </div>

            {/* Slug (read-only) */}
            <div className="space-y-2">
              <Label>Slug</Label>
              <div className="bg-muted rounded-md px-3 py-2 font-mono text-sm text-foreground">
                {agency.slug}
              </div>
            </div>

            {/* Save */}
            <Button disabled={!hasChanges} onClick={() => {}}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
