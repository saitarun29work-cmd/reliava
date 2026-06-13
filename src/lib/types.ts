// ============================================================
// Reliava — Core Domain Types
// ============================================================

export type Platform = 'n8n';
export type WorkflowStatus = 'healthy' | 'warning' | 'critical' | 'inactive';
export type EventSeverity = 'info' | 'warning' | 'error' | 'critical';
export type EventType = 'success' | 'failure' | 'silent_issue';
export type Criticality = 'low' | 'medium' | 'high' | 'critical';
export type ReportStatus = 'draft' | 'sent' | 'viewed';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

// ---- Core Objects ----

export interface Agency {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryContact: string;
  email: string;
  plan: 'starter' | 'pro' | 'enterprise';
  createdAt: string;
}

export interface Client {
  id: string;
  agencyId: string;
  name: string;
  slug: string;
  industry?: string;
  contactName: string;
  contactEmail: string;
  healthScore: number; // 0-100
  workflowCount: number;
  activeAlertCount: number;
  createdAt: string;
}

export interface Workflow {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  platform: Platform;
  businessProcess: string;
  criticality: Criticality;
  status: WorkflowStatus;
  healthScore: number; // 0-100
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  failureCountThisWeek: number;
  silentIssueCount: number;
  lastEventReceivedAt: string | null;
  ingestToken: string;
  webhookUrl: string;
  n8nWebhookId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowEvent {
  id: string;
  workflowId: string;
  workflowName: string;
  clientId: string;
  clientName: string;
  severity: EventSeverity;
  event_type: EventType;
  payload_summary: Record<string, unknown>;
  timestamp: string;
}

export interface IssueRule {
  id: string;
  agencyId: string;
  name: string;
  description: string;
  condition: string; // e.g. "failure_count > 3 in 1h"
  severity: EventSeverity;
  isEnabled: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  clientId: string;
  clientName: string;
  periodStart: string;
  periodEnd: string;
  status: ReportStatus;
  totalRuns: number;
  successRate: number;
  totalFailures: number;
  meanTimeToRecovery: number; // minutes
  generatedAt: string;
  sentAt?: string;
}

export interface Alert {
  id: string;
  workflowId: string;
  workflowName: string;
  clientId: string;
  clientName: string;
  ruleId: string;
  ruleName: string;
  severity: EventSeverity;
  status: AlertStatus;
  message: string;
  triggeredAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

// ---- Dashboard Aggregates ----

export interface DashboardStats {
  totalClients: number;
  totalWorkflows: number;
  healthyWorkflows: number;
  warningWorkflows: number;
  criticalWorkflows: number;
  failedRunsThisWeek: number;
  silentIssuesThisWeek: number;
  criticalEventsLast24h: number;
  avgClientHealthScore: number;
}

// ---- Auth ----

export interface User {
  id: string;
  email: string;
  name: string;
  agencyId: string;
  agencyName: string;
  role: 'owner' | 'admin' | 'member';
}

// ---- Router ----

export type Route =
  | { page: 'login' }
  | { page: 'signup' }
  | { page: 'dashboard' }
  | { page: 'clients' }
  | { page: 'client-detail'; clientId: string }
  | { page: 'client-workflows'; clientId: string }
  | { page: 'client-reports'; clientId: string }
  | { page: 'workflow-detail'; workflowId: string }
  | { page: 'settings' }
  | { page: 'settings-agency' }
  | { page: 'settings-integrations' };