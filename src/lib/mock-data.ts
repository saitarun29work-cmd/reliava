// ============================================================
// Reliava — Realistic Mock Data
// ============================================================

import type {
  Agency, Client, Workflow, WorkflowEvent, IssueRule,
  Report, Alert, User, DashboardStats
} from './types';

// ---- Helpers ----
const d = (daysAgo: number, hoursAgo = 0, minsAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minsAgo);
  return date.toISOString();
};

const cuid = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const token = () =>
  `rlv_tk_${Math.random().toString(36).slice(2, 14)}`;

const webhook = (id: string) =>
  `https://app.reliava.com/api/ingest/${id}`;

// ---- Agency ----
export const mockAgency: Agency = {
  id: 'agency_01',
  name: 'StreamlineOps Agency',
  slug: 'streamlineops',
  primaryContact: 'Marcus Chen',
  email: 'marcus@streamlineops.com',
  plan: 'pro',
  createdAt: d(180),
};

// ---- User ----
export const mockUser: User = {
  id: 'user_01',
  email: 'marcus@streamlineops.com',
  name: 'Marcus Chen',
  agencyId: mockAgency.id,
  agencyName: mockAgency.name,
  role: 'owner',
};

// ---- Clients ----
export const mockClients: Client[] = [
  {
    id: 'client_01', agencyId: mockAgency.id, name: 'GreenLeaf Commerce',
    slug: 'greenleaf', industry: 'E-commerce',
    contactName: 'Sarah Kim', contactEmail: 'sarah@greenleaf.com',
    healthScore: 82, workflowCount: 6, activeAlertCount: 1, createdAt: d(120),
  },
  {
    id: 'client_02', agencyId: mockAgency.id, name: 'Apex Financial',
    slug: 'apex-fin', industry: 'Finance',
    contactName: 'James Wright', contactEmail: 'james@apexfinancial.com',
    healthScore: 94, workflowCount: 4, activeAlertCount: 0, createdAt: d(90),
  },
  {
    id: 'client_03', agencyId: mockAgency.id, name: 'NovaTech SaaS',
    slug: 'novatech', industry: 'SaaS',
    contactName: 'Priya Patel', contactEmail: 'priya@novatech.io',
    healthScore: 45, workflowCount: 8, activeAlertCount: 3, createdAt: d(60),
  },
  {
    id: 'client_04', agencyId: mockAgency.id, name: 'BrightPath Health',
    slug: 'brightpath', industry: 'Healthcare',
    contactName: 'Dr. Emily Ross', contactEmail: 'emily@brightpath.health',
    healthScore: 71, workflowCount: 5, activeAlertCount: 2, createdAt: d(45),
  },
  {
    id: 'client_05', agencyId: mockAgency.id, name: 'Summit Logistics',
    slug: 'summit', industry: 'Logistics',
    contactName: 'Tom Reeves', contactEmail: 'tom@summitlogistics.com',
    healthScore: 88, workflowCount: 3, activeAlertCount: 0, createdAt: d(30),
  },
];

// ---- Workflows ----
export const mockWorkflows: Workflow[] = [
  // GreenLeaf workflows
  {
    id: 'wf_01', clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    name: 'Shopify → CRM Sync', platform: 'n8n',
    businessProcess: 'Customer Data Sync', criticality: 'high',
    status: 'healthy', healthScore: 95,
    lastSuccessAt: d(0, 2, 15), lastFailureAt: d(5, 4, 30),
    failureCountThisWeek: 0, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 2, 15),
    ingestToken: token(), webhookUrl: webhook('wf_01'),
    createdAt: d(120), updatedAt: d(0, 2, 15),
  },
  {
    id: 'wf_02', clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    name: 'Order Confirmation Emails', platform: 'n8n',
    businessProcess: 'Customer Communication', criticality: 'critical',
    status: 'warning', healthScore: 68,
    lastSuccessAt: d(0, 8, 45), lastFailureAt: d(0, 6, 20),
    failureCountThisWeek: 3, silentIssueCount: 1,
    lastEventReceivedAt: d(0, 6, 20),
    ingestToken: token(), webhookUrl: webhook('wf_02'),
    createdAt: d(118), updatedAt: d(0, 6, 20),
  },
  {
    id: 'wf_03', clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    name: 'Inventory Reorder Alert', platform: 'n8n',
    businessProcess: 'Inventory Management', criticality: 'medium',
    status: 'healthy', healthScore: 90,
    lastSuccessAt: d(0, 1, 0), lastFailureAt: d(12, 3, 0),
    failureCountThisWeek: 0, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 1, 0),
    ingestToken: token(), webhookUrl: webhook('wf_03'),
    createdAt: d(100), updatedAt: d(0, 1, 0),
  },
  // Apex Financial workflows
  {
    id: 'wf_04', clientId: 'client_02', clientName: 'Apex Financial',
    name: 'Daily Portfolio Report', platform: 'n8n',
    businessProcess: 'Reporting', criticality: 'high',
    status: 'healthy', healthScore: 98,
    lastSuccessAt: d(0, 5, 0), lastFailureAt: d(30, 2, 0),
    failureCountThisWeek: 0, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 5, 0),
    ingestToken: token(), webhookUrl: webhook('wf_04'),
    createdAt: d(85), updatedAt: d(0, 5, 0),
  },
  {
    id: 'wf_05', clientId: 'client_02', clientName: 'Apex Financial',
    name: 'KYC Document Processing', platform: 'n8n',
    businessProcess: 'Compliance', criticality: 'critical',
    status: 'healthy', healthScore: 92,
    lastSuccessAt: d(0, 3, 20), lastFailureAt: d(7, 1, 10),
    failureCountThisWeek: 0, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 3, 20),
    ingestToken: token(), webhookUrl: webhook('wf_05'),
    createdAt: d(80), updatedAt: d(0, 3, 20),
  },
  // NovaTech workflows
  {
    id: 'wf_06', clientId: 'client_03', clientName: 'NovaTech SaaS',
    name: 'User Onboarding Sequence', platform: 'n8n',
    businessProcess: 'User Lifecycle', criticality: 'high',
    status: 'critical', healthScore: 22,
    lastSuccessAt: d(2, 14, 0), lastFailureAt: d(0, 1, 30),
    failureCountThisWeek: 12, silentIssueCount: 4,
    lastEventReceivedAt: d(0, 1, 30),
    ingestToken: token(), webhookUrl: webhook('wf_06'),
    createdAt: d(55), updatedAt: d(0, 1, 30),
  },
  {
    id: 'wf_07', clientId: 'client_03', clientName: 'NovaTech SaaS',
    name: 'Stripe Billing Webhook', platform: 'n8n',
    businessProcess: 'Billing', criticality: 'critical',
    status: 'critical', healthScore: 15,
    lastSuccessAt: d(3, 8, 0), lastFailureAt: d(0, 0, 45),
    failureCountThisWeek: 18, silentIssueCount: 6,
    lastEventReceivedAt: d(0, 0, 45),
    ingestToken: token(), webhookUrl: webhook('wf_07'),
    createdAt: d(50), updatedAt: d(0, 0, 45),
  },
  {
    id: 'wf_08', clientId: 'client_03', clientName: 'NovaTech SaaS',
    name: 'Churn Risk Analysis', platform: 'n8n',
    businessProcess: 'Analytics', criticality: 'medium',
    status: 'warning', healthScore: 55,
    lastSuccessAt: d(0, 12, 0), lastFailureAt: d(0, 10, 0),
    failureCountThisWeek: 2, silentIssueCount: 1,
    lastEventReceivedAt: d(0, 10, 0),
    ingestToken: token(), webhookUrl: webhook('wf_08'),
    createdAt: d(40), updatedAt: d(0, 10, 0),
  },
  {
    id: 'wf_09', clientId: 'client_03', clientName: 'NovaTech SaaS',
    name: 'Slack Alert Router', platform: 'n8n',
    businessProcess: 'Internal Ops', criticality: 'low',
    status: 'healthy', healthScore: 88,
    lastSuccessAt: d(0, 4, 0), lastFailureAt: d(8, 2, 0),
    failureCountThisWeek: 0, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 4, 0),
    ingestToken: token(), webhookUrl: webhook('wf_09'),
    createdAt: d(35), updatedAt: d(0, 4, 0),
  },
  // BrightPath workflows
  {
    id: 'wf_10', clientId: 'client_04', clientName: 'BrightPath Health',
    name: 'Patient Appointment Reminders', platform: 'n8n',
    businessProcess: 'Patient Communication', criticality: 'high',
    status: 'warning', healthScore: 62,
    lastSuccessAt: d(0, 6, 30), lastFailureAt: d(0, 4, 0),
    failureCountThisWeek: 2, silentIssueCount: 1,
    lastEventReceivedAt: d(0, 4, 0),
    ingestToken: token(), webhookUrl: webhook('wf_10'),
    createdAt: d(40), updatedAt: d(0, 4, 0),
  },
  {
    id: 'wf_11', clientId: 'client_04', clientName: 'BrightPath Health',
    name: 'Lab Results Ingestion', platform: 'n8n',
    businessProcess: 'Data Integration', criticality: 'critical',
    status: 'healthy', healthScore: 80,
    lastSuccessAt: d(0, 1, 45), lastFailureAt: d(4, 6, 0),
    failureCountThisWeek: 1, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 1, 45),
    ingestToken: token(), webhookUrl: webhook('wf_11'),
    createdAt: d(38), updatedAt: d(0, 1, 45),
  },
  // Summit workflows
  {
    id: 'wf_12', clientId: 'client_05', clientName: 'Summit Logistics',
    name: 'Shipment Tracking Sync', platform: 'n8n',
    businessProcess: 'Logistics Tracking', criticality: 'high',
    status: 'healthy', healthScore: 96,
    lastSuccessAt: d(0, 0, 30), lastFailureAt: d(20, 3, 0),
    failureCountThisWeek: 0, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 0, 30),
    ingestToken: token(), webhookUrl: webhook('wf_12'),
    createdAt: d(25), updatedAt: d(0, 0, 30),
  },
  {
    id: 'wf_13', clientId: 'client_05', clientName: 'Summit Logistics',
    name: 'Driver Payroll Calculation', platform: 'n8n',
    businessProcess: 'Payroll', criticality: 'critical',
    status: 'healthy', healthScore: 100,
    lastSuccessAt: d(0, 7, 0), lastFailureAt: d(60, 0, 0),
    failureCountThisWeek: 0, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 7, 0),
    ingestToken: token(), webhookUrl: webhook('wf_13'),
    createdAt: d(28), updatedAt: d(0, 7, 0),
  },
  {
    id: 'wf_14', clientId: 'client_05', clientName: 'Summit Logistics',
    name: 'Customer Notification Pipeline', platform: 'n8n',
    businessProcess: 'Customer Communication', criticality: 'medium',
    status: 'healthy', healthScore: 91,
    lastSuccessAt: d(0, 3, 10), lastFailureAt: d(15, 5, 0),
    failureCountThisWeek: 0, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 3, 10),
    ingestToken: token(), webhookUrl: webhook('wf_14'),
    createdAt: d(22), updatedAt: d(0, 3, 10),
  },
  // Additional GreenLeaf
  {
    id: 'wf_15', clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    name: 'Abandoned Cart Recovery', platform: 'n8n',
    businessProcess: 'Revenue Recovery', criticality: 'high',
    status: 'healthy', healthScore: 87,
    lastSuccessAt: d(0, 0, 50), lastFailureAt: d(9, 2, 0),
    failureCountThisWeek: 0, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 0, 50),
    ingestToken: token(), webhookUrl: webhook('wf_15'),
    createdAt: d(95), updatedAt: d(0, 0, 50),
  },
  {
    id: 'wf_16', clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    name: 'Review Aggregation', platform: 'n8n',
    businessProcess: 'Reputation Management', criticality: 'low',
    status: 'healthy', healthScore: 93,
    lastSuccessAt: d(0, 10, 0), lastFailureAt: d(18, 0, 0),
    failureCountThisWeek: 0, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 10, 0),
    ingestToken: token(), webhookUrl: webhook('wf_16'),
    createdAt: d(90), updatedAt: d(0, 10, 0),
  },
  // Additional Apex
  {
    id: 'wf_17', clientId: 'client_02', clientName: 'Apex Financial',
    name: 'Regulatory Filing Reminder', platform: 'n8n',
    businessProcess: 'Compliance', criticality: 'high',
    status: 'healthy', healthScore: 97,
    lastSuccessAt: d(0, 9, 0), lastFailureAt: d(45, 0, 0),
    failureCountThisWeek: 0, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 9, 0),
    ingestToken: token(), webhookUrl: webhook('wf_17'),
    createdAt: d(75), updatedAt: d(0, 9, 0),
  },
  // Additional BrightPath
  {
    id: 'wf_18', clientId: 'client_04', clientName: 'BrightPath Health',
    name: 'Insurance Claim Router', platform: 'n8n',
    businessProcess: 'Claims Processing', criticality: 'critical',
    status: 'warning', healthScore: 58,
    lastSuccessAt: d(0, 11, 0), lastFailureAt: d(0, 8, 30),
    failureCountThisWeek: 4, silentIssueCount: 2,
    lastEventReceivedAt: d(0, 8, 30),
    ingestToken: token(), webhookUrl: webhook('wf_18'),
    createdAt: d(36), updatedAt: d(0, 8, 30),
  },
  {
    id: 'wf_19', clientId: 'client_04', clientName: 'BrightPath Health',
    name: 'Telehealth Session Scheduler', platform: 'n8n',
    businessProcess: 'Scheduling', criticality: 'medium',
    status: 'healthy', healthScore: 85,
    lastSuccessAt: d(0, 2, 30), lastFailureAt: d(10, 4, 0),
    failureCountThisWeek: 0, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 2, 30),
    ingestToken: token(), webhookUrl: webhook('wf_19'),
    createdAt: d(33), updatedAt: d(0, 2, 30),
  },
  // Additional NovaTech
  {
    id: 'wf_20', clientId: 'client_03', clientName: 'NovaTech SaaS',
    name: 'Support Ticket Triage', platform: 'n8n',
    businessProcess: 'Support', criticality: 'medium',
    status: 'healthy', healthScore: 78,
    lastSuccessAt: d(0, 5, 30), lastFailureAt: d(3, 7, 0),
    failureCountThisWeek: 1, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 5, 30),
    ingestToken: token(), webhookUrl: webhook('wf_20'),
    createdAt: d(32), updatedAt: d(0, 5, 30),
  },
  {
    id: 'wf_21', clientId: 'client_03', clientName: 'NovaTech SaaS',
    name: 'Feature Flag Deployment', platform: 'n8n',
    businessProcess: 'DevOps', criticality: 'low',
    status: 'healthy', healthScore: 82,
    lastSuccessAt: d(0, 8, 0), lastFailureAt: d(14, 0, 0),
    failureCountThisWeek: 0, silentIssueCount: 0,
    lastEventReceivedAt: d(0, 8, 0),
    ingestToken: token(), webhookUrl: webhook('wf_21'),
    createdAt: d(28), updatedAt: d(0, 8, 0),
  },
  {
    id: 'wf_22', clientId: 'client_03', clientName: 'NovaTech SaaS',
    name: 'Revenue Dashboard Refresh', platform: 'n8n',
    businessProcess: 'Analytics', criticality: 'medium',
    status: 'critical', healthScore: 30,
    lastSuccessAt: d(1, 16, 0), lastFailureAt: d(0, 3, 0),
    failureCountThisWeek: 7, silentIssueCount: 3,
    lastEventReceivedAt: d(0, 3, 0),
    ingestToken: token(), webhookUrl: webhook('wf_22'),
    createdAt: d(26), updatedAt: d(0, 3, 0),
  },
];

// ---- Events ----
// event_type values:
//   "success"      — workflow completed normally
//   "failure"      — workflow threw an error or returned a non-2xx status
//   "silent_issue" — workflow reported success but payload_summary violates a rule
//                     (e.g. synced 0 records, all recipients bounced, missing required fields)
export const mockEvents: WorkflowEvent[] = [
  // ──── Failure events ────
  {
    id: cuid('evt'), workflowId: 'wf_07', workflowName: 'Stripe Billing Webhook',
    clientId: 'client_03', clientName: 'NovaTech SaaS',
    severity: 'critical', event_type: 'failure',
    payload_summary: {
      error_message: 'Webhook signature verification failed',
      error_code: 'SIG_MISMATCH',
      status_code: 401,
    },
    timestamp: d(0, 0, 45),
  },
  {
    id: cuid('evt'), workflowId: 'wf_06', workflowName: 'User Onboarding Sequence',
    clientId: 'client_03', clientName: 'NovaTech SaaS',
    severity: 'critical', event_type: 'failure',
    payload_summary: {
      error_message: 'Database connection pool exhausted. Unable to insert user record.',
      error_code: 'DB_POOL_EXHAUSTED',
      status_code: 503,
    },
    timestamp: d(0, 1, 30),
  },
  {
    id: cuid('evt'), workflowId: 'wf_18', workflowName: 'Insurance Claim Router',
    clientId: 'client_04', clientName: 'BrightPath Health',
    severity: 'error', event_type: 'failure',
    payload_summary: {
      error_message: 'HL7 parser timeout. Claim document exceeded 10MB limit.',
      error_code: 'PAYLOAD_TOO_LARGE',
      status_code: 413,
    },
    timestamp: d(0, 2, 0),
  },
  {
    id: cuid('evt'), workflowId: 'wf_22', workflowName: 'Revenue Dashboard Refresh',
    clientId: 'client_03', clientName: 'NovaTech SaaS',
    severity: 'error', event_type: 'failure',
    payload_summary: {
      error_message: 'BigQuery API rate limit exceeded. Retry after 60s.',
      error_code: 'RATE_LIMITED',
      status_code: 429,
    },
    timestamp: d(0, 3, 0),
  },
  {
    id: cuid('evt'), workflowId: 'wf_10', workflowName: 'Patient Appointment Reminders',
    clientId: 'client_04', clientName: 'BrightPath Health',
    severity: 'warning', event_type: 'failure',
    payload_summary: {
      error_message: 'SMS gateway returned partial delivery. 3 of 12 messages undelivered.',
      error_code: 'PARTIAL_DELIVERY',
      status_code: 206,
      delivered: 9,
      undelivered: 3,
    },
    timestamp: d(0, 4, 0),
  },
  {
    id: cuid('evt'), workflowId: 'wf_02', workflowName: 'Order Confirmation Emails',
    clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    severity: 'warning', event_type: 'failure',
    payload_summary: {
      error_message: 'SendGrid API timeout. Email queue backed up (147 pending).',
      error_code: 'SMTP_TIMEOUT',
      status_code: 504,
    },
    timestamp: d(0, 6, 20),
  },
  {
    id: cuid('evt'), workflowId: 'wf_06', workflowName: 'User Onboarding Sequence',
    clientId: 'client_03', clientName: 'NovaTech SaaS',
    severity: 'error', event_type: 'failure',
    payload_summary: {
      error_message: 'Welcome email template not found in SendGrid. Workflow halted at step 3/7.',
      error_code: 'TEMPLATE_MISSING',
      step: 3,
      total_steps: 7,
    },
    timestamp: d(0, 8, 0),
  },
  {
    id: cuid('evt'), workflowId: 'wf_18', workflowName: 'Insurance Claim Router',
    clientId: 'client_04', clientName: 'BrightPath Health',
    severity: 'warning', event_type: 'failure',
    payload_summary: {
      error_message: 'External claims API returned 502. Retried 3 times, all failed.',
      error_code: 'UPSTREAM_UNAVAILABLE',
      status_code: 502,
      retries: 3,
    },
    timestamp: d(0, 8, 30),
  },
  {
    id: cuid('evt'), workflowId: 'wf_07', workflowName: 'Stripe Billing Webhook',
    clientId: 'client_03', clientName: 'NovaTech SaaS',
    severity: 'critical', event_type: 'failure',
    payload_summary: {
      error_message: 'Duplicate invoice detected. Idempotency key collision on payment_intent.succeeded.',
      error_code: 'DUPLICATE_INVOICE',
    },
    timestamp: d(0, 5, 0),
  },

  // ──── Success events ────
  {
    id: cuid('evt'), workflowId: 'wf_01', workflowName: 'Shopify → CRM Sync',
    clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    severity: 'info', event_type: 'success',
    payload_summary: {
      records_synced: 34,
      records_skipped: 2,
      duration_seconds: 2.3,
    },
    timestamp: d(0, 2, 15),
  },
  {
    id: cuid('evt'), workflowId: 'wf_12', workflowName: 'Shipment Tracking Sync',
    clientId: 'client_05', clientName: 'Summit Logistics',
    severity: 'info', event_type: 'success',
    payload_summary: {
      shipments_updated: 89,
      duration_seconds: 4.1,
    },
    timestamp: d(0, 0, 30),
  },
  {
    id: cuid('evt'), workflowId: 'wf_04', workflowName: 'Daily Portfolio Report',
    clientId: 'client_02', clientName: 'Apex Financial',
    severity: 'info', event_type: 'success',
    payload_summary: {
      report_recipients: 12,
      duration_seconds: 8.7,
    },
    timestamp: d(0, 5, 0),
  },
  {
    id: cuid('evt'), workflowId: 'wf_15', workflowName: 'Abandoned Cart Recovery',
    clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    severity: 'info', event_type: 'success',
    payload_summary: {
      emails_sent: 23,
      conversions: 4,
      duration_seconds: 3.5,
    },
    timestamp: d(0, 0, 50),
  },
  {
    id: cuid('evt'), workflowId: 'wf_11', workflowName: 'Lab Results Ingestion',
    clientId: 'client_04', clientName: 'BrightPath Health',
    severity: 'info', event_type: 'success',
    payload_summary: {
      lab_results_ingested: 15,
      duration_seconds: 1.9,
    },
    timestamp: d(0, 1, 45),
  },

  // ──── Silent issue events ────
  // These are events where n8n reported success, but the payload_summary
  // reveals a business-logic problem (e.g. 0 records synced, all emails bounced).
  {
    id: cuid('evt'), workflowId: 'wf_08', workflowName: 'Churn Risk Analysis',
    clientId: 'client_03', clientName: 'NovaTech SaaS',
    severity: 'warning', event_type: 'silent_issue',
    payload_summary: {
      rule_violated: 'records_processed_must_be_gt_zero',
      records_scored: 0,
      expected_min_records: 50,
      reason: 'Source query returned empty result set — possible API schema change',
    },
    timestamp: d(0, 10, 0),
  },
  {
    id: cuid('evt'), workflowId: 'wf_22', workflowName: 'Revenue Dashboard Refresh',
    clientId: 'client_03', clientName: 'NovaTech SaaS',
    severity: 'warning', event_type: 'silent_issue',
    payload_summary: {
      rule_violated: 'data_freshness_must_be_within_1h',
      data_freshness_minutes: 180,
      rows_returned: 890,
      reason: 'Cached data served instead of live query — cache TTL misconfigured',
    },
    timestamp: d(0, 3, 15),
  },
  {
    id: cuid('evt'), workflowId: 'wf_10', workflowName: 'Patient Appointment Reminders',
    clientId: 'client_04', clientName: 'BrightPath Health',
    severity: 'warning', event_type: 'silent_issue',
    payload_summary: {
      rule_violated: 'phone_field_required',
      reminders_sent: 0,
      patients_scheduled: 12,
      missing_phone_count: 12,
      reason: 'All 12 patients had empty phone_number field — CRM sync may be dropping this field',
    },
    timestamp: d(0, 5, 0),
  },
  {
    id: cuid('evt'), workflowId: 'wf_01', workflowName: 'Shopify → CRM Sync',
    clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    severity: 'warning', event_type: 'silent_issue',
    payload_summary: {
      rule_violated: 'new_records_must_be_gt_zero',
      records_synced: 0,
      records_skipped: 34,
      reason: 'All 34 records were skipped due to duplicate email — dedup rule may be too aggressive',
    },
    timestamp: d(0, 4, 30),
  },
];

// ---- Issue Rules ----
export const mockIssueRules: IssueRule[] = [
  {
    id: 'rule_01', agencyId: mockAgency.id,
    name: 'Consecutive Failure Alert',
    description: 'Alert when a workflow fails 3 or more times consecutively within 1 hour.',
    condition: 'consecutive_failures >= 3 within 1h',
    severity: 'critical', isEnabled: true, createdAt: d(100),
  },
  {
    id: 'rule_02', agencyId: mockAgency.id,
    name: 'Silent Failure Detection',
    description: 'Detect workflows that fail but do not trigger any configured alerts.',
    condition: 'failure_count > 0 AND alert_count == 0 within 24h',
    severity: 'warning', isEnabled: true, createdAt: d(90),
  },
  {
    id: 'rule_03', agencyId: mockAgency.id,
    name: 'Health Score Degradation',
    description: 'Alert when any workflow health score drops below 40.',
    condition: 'health_score < 40',
    severity: 'error', isEnabled: true, createdAt: d(85),
  },
  {
    id: 'rule_04', agencyId: mockAgency.id,
    name: 'No Events Received',
    description: 'Alert when a workflow has not sent any events in 24 hours.',
    condition: 'no_events_for > 24h',
    severity: 'warning', isEnabled: true, createdAt: d(80),
  },
  {
    id: 'rule_05', agencyId: mockAgency.id,
    name: 'Critical Client Health',
    description: 'Alert when any client overall health score drops below 50.',
    condition: 'client_health_score < 50',
    severity: 'critical', isEnabled: true, createdAt: d(75),
  },
];

// ---- Reports ----
export const mockReports: Report[] = [
  {
    id: 'rpt_01', clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    periodStart: d(7), periodEnd: d(0),
    status: 'sent', totalRuns: 842, successRate: 97.2,
    totalFailures: 24, meanTimeToRecovery: 12,
    generatedAt: d(0, 10, 0), sentAt: d(0, 10, 30),
  },
  {
    id: 'rpt_02', clientId: 'client_02', clientName: 'Apex Financial',
    periodStart: d(7), periodEnd: d(0),
    status: 'viewed', totalRuns: 312, successRate: 99.7,
    totalFailures: 1, meanTimeToRecovery: 5,
    generatedAt: d(0, 9, 0), sentAt: d(0, 9, 15),
  },
  {
    id: 'rpt_03', clientId: 'client_03', clientName: 'NovaTech SaaS',
    periodStart: d(7), periodEnd: d(0),
    status: 'draft', totalRuns: 1543, successRate: 84.1,
    totalFailures: 245, meanTimeToRecovery: 47,
    generatedAt: d(0, 8, 0),
  },
  {
    id: 'rpt_04', clientId: 'client_04', clientName: 'BrightPath Health',
    periodStart: d(7), periodEnd: d(0),
    status: 'sent', totalRuns: 620, successRate: 91.6,
    totalFailures: 52, meanTimeToRecovery: 28,
    generatedAt: d(0, 7, 0), sentAt: d(0, 7, 45),
  },
  {
    id: 'rpt_05', clientId: 'client_05', clientName: 'Summit Logistics',
    periodStart: d(7), periodEnd: d(0),
    status: 'sent', totalRuns: 285, successRate: 100.0,
    totalFailures: 0, meanTimeToRecovery: 0,
    generatedAt: d(0, 6, 0), sentAt: d(0, 6, 20),
  },
  {
    id: 'rpt_06', clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    periodStart: d(14), periodEnd: d(7),
    status: 'sent', totalRuns: 810, successRate: 96.5,
    totalFailures: 28, meanTimeToRecovery: 15,
    generatedAt: d(7, 10, 0), sentAt: d(7, 10, 30),
  },
  {
    id: 'rpt_07', clientId: 'client_03', clientName: 'NovaTech SaaS',
    periodStart: d(14), periodEnd: d(7),
    status: 'sent', totalRuns: 1480, successRate: 88.3,
    totalFailures: 173, meanTimeToRecovery: 38,
    generatedAt: d(7, 8, 0), sentAt: d(7, 8, 45),
  },
];

// ---- Alerts ----
export const mockAlerts: Alert[] = [
  {
    id: 'alert_01', workflowId: 'wf_07', workflowName: 'Stripe Billing Webhook',
    clientId: 'client_03', clientName: 'NovaTech SaaS',
    ruleId: 'rule_01', ruleName: 'Consecutive Failure Alert',
    severity: 'critical', status: 'active',
    message: 'Stripe Billing Webhook has failed 18 times this week.',
    triggeredAt: d(0, 0, 45),
  },
  {
    id: 'alert_02', workflowId: 'wf_06', workflowName: 'User Onboarding Sequence',
    clientId: 'client_03', clientName: 'NovaTech SaaS',
    ruleId: 'rule_03', ruleName: 'Health Score Degradation',
    severity: 'error', status: 'active',
    message: 'User Onboarding Sequence health score dropped to 22.',
    triggeredAt: d(0, 1, 30),
  },
  {
    id: 'alert_03', workflowId: 'wf_22', workflowName: 'Revenue Dashboard Refresh',
    clientId: 'client_03', clientName: 'NovaTech SaaS',
    ruleId: 'rule_03', ruleName: 'Health Score Degradation',
    severity: 'error', status: 'active',
    message: 'Revenue Dashboard Refresh health score dropped to 30.',
    triggeredAt: d(0, 3, 0),
  },
  {
    id: 'alert_04', workflowId: 'wf_02', workflowName: 'Order Confirmation Emails',
    clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    ruleId: 'rule_02', ruleName: 'Silent Failure Detection',
    severity: 'warning', status: 'active',
    message: '1 silent failure detected: Order Confirmation Emails failed without triggering an alert.',
    triggeredAt: d(0, 6, 20),
  },
  {
    id: 'alert_05', workflowId: 'wf_18', workflowName: 'Insurance Claim Router',
    clientId: 'client_04', clientName: 'BrightPath Health',
    ruleId: 'rule_01', ruleName: 'Consecutive Failure Alert',
    severity: 'error', status: 'acknowledged',
    message: 'Insurance Claim Router has failed 4 times this week.',
    triggeredAt: d(0, 8, 30), acknowledgedAt: d(0, 7, 0),
  },
  {
    id: 'alert_06', workflowId: 'wf_10', workflowName: 'Patient Appointment Reminders',
    clientId: 'client_04', clientName: 'BrightPath Health',
    ruleId: 'rule_02', ruleName: 'Silent Failure Detection',
    severity: 'warning', status: 'acknowledged',
    message: '1 silent failure detected for Patient Appointment Reminders.',
    triggeredAt: d(0, 4, 0), acknowledgedAt: d(0, 3, 0),
  },
];

// ---- Computed Dashboard Stats ----
export function computeDashboardStats(
  clients: Client[],
  workflows: Workflow[],
  events: WorkflowEvent[]
): DashboardStats {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const failedRunsThisWeek = events.filter(
    (e) => e.event_type === 'failure' && new Date(e.timestamp) >= weekAgo
  ).length;

  const silentIssuesThisWeek = events.filter(
    (e) => e.event_type === 'silent_issue' && new Date(e.timestamp) >= weekAgo
  ).length;

  const criticalEventsLast24h = events.filter(
    (e) =>
      e.severity === 'critical' &&
      new Date(e.timestamp) >= dayAgo
  ).length;

  return {
    totalClients: clients.length,
    totalWorkflows: workflows.length,
    healthyWorkflows: workflows.filter((w) => w.status === 'healthy').length,
    warningWorkflows: workflows.filter((w) => w.status === 'warning').length,
    criticalWorkflows: workflows.filter((w) => w.status === 'critical').length,
    failedRunsThisWeek,
    silentIssuesThisWeek,
    criticalEventsLast24h,
    avgClientHealthScore:
      Math.round(
        clients.reduce((sum, c) => sum + c.healthScore, 0) / clients.length
      ),
  };
}