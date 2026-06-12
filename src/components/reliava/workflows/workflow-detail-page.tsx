'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { EventTimeline } from '@/components/reliava/workflows/event-timeline';
import { StatusBadge, CriticalityBadge } from '@/components/reliava/shared/status-badge';
import { HealthScoreRing } from '@/components/reliava/shared/health-score';
import { PageHeader } from '@/components/reliava/shared/page-header';
import { TimeAgo } from '@/components/reliava/shared/time-ago';
import { useAppStore } from '@/lib/store';
import {
  Copy,
  Eye,
  EyeOff as EyeOffIcon,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// CopyButton — copies text and shows brief "Copied!" feedback
// ---------------------------------------------------------------------------
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        <Copy className="size-3.5" />
        {copied ? 'Copied!' : 'Copy'}
      </Button>
      {copied && <span className="text-emerald-400 text-xs">Copied!</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// WorkflowDetailPage
// ---------------------------------------------------------------------------

export function WorkflowDetailPage({ workflowId }: { workflowId: string }) {
  const workflow = useAppStore((s) => s.workflows.find((w) => w.id === workflowId));
  const navigate = useAppStore((s) => s.navigate);

  if (!workflow) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Workflow not found.</p>
      </div>
    );
  }

  const isRecentSuccess =
    workflow.lastSuccessAt &&
    Date.now() - new Date(workflow.lastSuccessAt).getTime() < 24 * 60 * 60 * 1000;
  const isRecentFailure =
    workflow.lastFailureAt &&
    Date.now() - new Date(workflow.lastFailureAt).getTime() < 24 * 60 * 60 * 1000;

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
              onClick={() =>
                navigate({ page: 'client-workflows', clientId: workflow.clientId })
              }
            >
              {workflow.clientName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{workflow.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ---- Page header ---- */}
      <PageHeader
        title={workflow.name}
        description={workflow.businessProcess}
      />

      {/* ---- Top info cards ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status */}
        <Card>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Status
            </p>
            <StatusBadge status={workflow.status} />
          </CardContent>
        </Card>

        {/* Health Score */}
        <Card>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Health Score
            </p>
            <HealthScoreRing score={workflow.healthScore} size="md" />
          </CardContent>
        </Card>

        {/* Criticality */}
        <Card>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Criticality
            </p>
            <CriticalityBadge criticality={workflow.criticality} />
          </CardContent>
        </Card>

        {/* Platform */}
        <Card>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Platform
            </p>
            <Badge variant="secondary" className="font-mono">
              n8n
            </Badge>
          </CardContent>
        </Card>

        {/* Last Successful Run */}
        <Card>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Last Successful Run
            </p>
            {workflow.lastSuccessAt ? (
              <TimeAgo
                date={workflow.lastSuccessAt}
                className={isRecentSuccess ? 'text-emerald-400' : ''}
              />
            ) : (
              <span className="text-muted-foreground text-sm">Never</span>
            )}
          </CardContent>
        </Card>

        {/* Last Failed Run */}
        <Card>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Last Failed Run
            </p>
            {workflow.lastFailureAt ? (
              <TimeAgo
                date={workflow.lastFailureAt}
                className={isRecentFailure ? 'text-red-400' : ''}
              />
            ) : (
              <span className="text-muted-foreground text-sm">Never</span>
            )}
          </CardContent>
        </Card>

        {/* Failure Count This Week */}
        <Card>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Failure Count This Week
            </p>
            <span
              className={`text-lg font-semibold tabular-nums ${
                workflow.failureCountThisWeek > 0 ? 'text-red-400' : 'text-foreground'
              }`}
            >
              {workflow.failureCountThisWeek}
            </span>
          </CardContent>
        </Card>

        {/* Silent Issues */}
        <Card>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Silent Issues
            </p>
            <div className="flex items-center gap-2">
              <EyeOffIcon className="size-4 text-muted-foreground" />
              <span
                className={`text-lg font-semibold tabular-nums ${
                  workflow.silentIssueCount > 0 ? 'text-amber-400' : 'text-foreground'
                }`}
              >
                {workflow.silentIssueCount}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Last Event Received */}
        <Card>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Last Event Received
            </p>
            {workflow.lastEventReceivedAt ? (
              <TimeAgo date={workflow.lastEventReceivedAt} />
            ) : (
              <span className="text-muted-foreground text-sm">Never</span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ---- Middle section: Webhook URL + Ingest Token ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Webhook URL */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Unique Webhook URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-md p-3 font-mono text-sm text-foreground break-all mb-3">
              {workflow.webhookUrl}
            </div>
            <CopyButton text={workflow.webhookUrl} />
          </CardContent>
        </Card>

        {/* Ingest Token */}
        <IngestTokenCard token={workflow.ingestToken} />
      </div>

      {/* ---- Event Timeline ---- */}
      <EventTimeline workflowId={workflow.id} />

      {/* ---- Bottom: n8n Setup Instructions ---- */}
      <div className="space-y-4">
        {/* A) Success event setup */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Send success event from n8n</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Add an <strong className="text-foreground">HTTP Request</strong> node at the end of the successful path.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Method:</span>{' '}
                <span className="font-medium text-foreground">POST</span>
              </div>
              <div>
                <span className="text-muted-foreground">URL:</span>{' '}
                <span className="font-mono text-xs text-primary break-all">{workflow.webhookUrl}</span>
              </div>
            </div>
            <div className="bg-muted rounded-md p-3 font-mono text-xs text-foreground overflow-x-auto">
              <pre className="whitespace-pre-wrap">{JSON.stringify({
  platform: "n8n",
  event_type: "success",
  severity: "low",
  workflow_name: "Facebook Lead to CRM",
  business_impact: "Lead automation completed successfully",
  payload_summary: {
    lead_email_present: true,
    lead_phone_present: false,
    crm_contact_id: "crm_123",
    whatsapp_sent: false
  }
}, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>

        {/* B) Failure event setup */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Send failure event from n8n</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Use an <strong className="text-foreground">n8n Error Trigger</strong> workflow, then send the error to Reliava using an HTTP Request node.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Method:</span>{' '}
                <span className="font-medium text-foreground">POST</span>
              </div>
              <div>
                <span className="text-muted-foreground">URL:</span>{' '}
                <span className="font-mono text-xs text-primary break-all">{workflow.webhookUrl}</span>
              </div>
            </div>
            <div className="bg-muted rounded-md p-3 font-mono text-xs text-foreground overflow-x-auto">
              <pre className="whitespace-pre-wrap">{JSON.stringify({
  platform: "n8n",
  event_type: "failure",
  severity: "high",
  workflow_name: "Facebook Lead to CRM",
  external_execution_id: "exec_456",
  external_execution_url: "https://n8n.example.com/execution/456",
  node_name: "CRM Sync",
  error_message: "Invalid phone number format",
  business_impact: "Lead was not synced to CRM",
  payload_summary: {
    source: "facebook_leads",
    lead_email_present: true,
    lead_phone_present: false
  }
}, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Shared note */}
        <p className="text-xs text-muted-foreground px-1">
          Each workflow has its own unique webhook URL and ingest token — do not share between workflows.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// IngestTokenCard — extracted for readability
// ---------------------------------------------------------------------------
function IngestTokenCard({ token }: { token: string }) {
  const [visible, setVisible] = useState(false);

  const masked = token.length > 12 ? token.slice(0, 12) + '••••••••••••' : '••••••••••••';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Ingest Token</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted rounded-md p-3 font-mono text-sm text-foreground break-all mb-3">
          {visible ? token : masked}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setVisible((v) => !v)}>
            {visible ? <EyeOffIcon className="size-3.5" /> : <Eye className="size-3.5" />}
            {visible ? 'Hide' : 'Show'}
          </Button>
          {visible && <CopyButton text={token} />}
        </div>
      </CardContent>
    </Card>
  );
}
