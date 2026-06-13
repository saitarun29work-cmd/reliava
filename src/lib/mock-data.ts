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
  // ──── GreenLeaf Commerce — current week ────
  {
    id: 'rpt_01', clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    periodStart: d(7), periodEnd: d(0),
    status: 'sent',
    totalRuns: 842, successfulRuns: 818, failedRuns: 24, silentIssues: 2,
    workflowsMonitored: 6, criticalBusinessRisks: 2,
    healthScore: 85,
    generatedAt: d(0, 10, 0), sentAt: d(0, 10, 30),
    executiveSummary:
      'Your automation system processed 842 workflow runs this week. Most workflows completed normally, but Reliava detected 24 failed runs and 2 silent issues where the workflow appeared successful but the business result was incomplete. The main risk this week was missed customer communication from order confirmation and CRM sync workflows.',
    healthExplanation:
      'Health is 85/100 because most workflows completed successfully and no critical errors occurred. The score reflects minor impact from SendGrid timeouts and one silent data quality issue in the CRM sync pipeline.',
    whatWorkedWell: [
      'Abandoned Cart Recovery ran flawlessly, sending 23 recovery emails that drove 4 conversions.',
      'Shopify to CRM Sync completed successfully for most runs, keeping customer data up to date in HubSpot.',
      'Inventory Reorder Alert detected stock levels correctly and triggered reorder notifications on schedule.',
    ],
    businessRiskSummary:
      'The main business risk this week was delayed or missing order confirmation emails. When SendGrid timed out, customers who just purchased may not have received their expected confirmation message, which can create uncertainty and support tickets. Additionally, the CRM sync silent issue means a batch of new customer records was skipped entirely — your sales team may be working with stale contact data until this is resolved.',
    agencyActionSummary:
      'Review SendGrid API timeout patterns and increase the timeout threshold or add retry logic for Order Confirmation Emails. Investigate the CRM dedup rule in Shopify to CRM Sync to confirm whether the 34 skipped records were legitimate duplicates or a misconfiguration. Verify silent issue rules for missing customer data in the sync pipeline.',
    closingNote:
      'Reliava helped detect the CRM sync issue before it showed up as missing contacts in your sales pipeline. The priority next week is stabilising email delivery and confirming the dedup configuration.',
    priorityFixes: [
      'Increase SendGrid timeout threshold and add retry logic for Order Confirmation Emails.',
      'Review CRM dedup rule in Shopify to CRM Sync to prevent record skipping.',
      'Add payload validation to verify customer records are actually created after sync.',
    ],
  },
  {
    id: 'rpt_02', clientId: 'client_02', clientName: 'Apex Financial',
    periodStart: d(7), periodEnd: d(0),
    status: 'viewed',
    totalRuns: 312, successfulRuns: 311, failedRuns: 1, silentIssues: 0,
    workflowsMonitored: 4, criticalBusinessRisks: 0,
    healthScore: 96,
    generatedAt: d(0, 9, 0), sentAt: d(0, 9, 15),
    executiveSummary:
      'Your automation system processed 312 workflow runs this week with near-perfect results. Only 1 failure was recorded — a transient document parsing error that self-resolved. No silent issues were detected, meaning all successful runs produced complete, accurate business results.',
    healthExplanation:
      'Health is 96/100 because all workflows operated within normal parameters. The single failure was transient and self-resolving, with no impact on data quality or compliance obligations.',
    whatWorkedWell: [
      'Daily Portfolio Report generated and delivered to all 12 advisors on schedule every day.',
      'Regulatory Filing Reminder triggered on time with no missed deadlines.',
      'KYC Document Processing handled all incoming documents without data loss.',
    ],
    businessRiskSummary:
      'No meaningful business risk was identified this week. The single KYC parsing failure was transient and did not result in any data loss, compliance gaps, or delayed client onboarding. All regulatory reminders were delivered on schedule.',
    agencyActionSummary:
      'No urgent action required. Monitor the KYC Document Processing workflow for recurring transient errors during peak hours. Consider scheduling a quarterly review of KYC document format requirements to stay ahead of any upstream changes.',
    closingNote:
      'All automations are performing reliably. No client-facing issues were detected this week.',
    priorityFixes: [],
  },
  // ──── NovaTech SaaS — current week ────
  {
    id: 'rpt_03', clientId: 'client_03', clientName: 'NovaTech SaaS',
    periodStart: d(7), periodEnd: d(0),
    status: 'draft',
    totalRuns: 1543, successfulRuns: 1298, failedRuns: 245, silentIssues: 8,
    workflowsMonitored: 8, criticalBusinessRisks: 5,
    healthScore: 52,
    generatedAt: d(0, 8, 0),
    executiveSummary:
      'Your automation system processed 1,543 workflow runs this week, but Reliava detected 245 failed runs and 8 silent issues where workflows appeared successful but produced incomplete or risky results. The main business risks were new users not being fully set up, potential duplicate invoices, and leadership relying on stale financial data in dashboards.',
    healthExplanation:
      'Health is 52/100 because three workflows are in critical or warning state with high failure counts and recurring silent data quality issues. The score reflects both the volume of failures and the business impact of undetected data problems in analytics and billing workflows.',
    whatWorkedWell: [
      'Slack Alert Router and Feature Flag Deployment operated without any failures.',
      'Support Ticket Triage handled all incoming tickets successfully.',
      'When failures occurred, most workflows recovered automatically within the retry window.',
    ],
    businessRiskSummary:
      'The main business risk this week was two-fold. First, User Onboarding Sequence failures directly impacted new user activation — an estimated 40+ users may not have been fully set up, affecting activation rates and first-week retention. Second, Stripe Billing Webhook failures created a risk of duplicate invoices or missed billing events, which could result in revenue leakage or customer complaints. Separately, Revenue Dashboard Refresh served stale cached data in a silent issue, meaning leadership may have been making decisions on outdated financial metrics for part of the week.',
    agencyActionSummary:
      'Immediately investigate the Stripe webhook signature configuration and idempotency key handling to stop duplicate invoice creation. Review the User Onboarding database connection pool settings and increase capacity to handle peak load. Audit the Revenue Dashboard Refresh cache TTL configuration and restore live query behavior. Verify silent issue detection rules for all three critical workflows. Schedule a reliability review call with the NovaTech team.',
    closingNote:
      'Reliava detected the stale dashboard data and duplicate invoice risk before either became a client complaint. The priority next week is stabilising billing workflows and restoring data freshness in analytics.',
    priorityFixes: [
      'Fix Stripe webhook signature validation and idempotency key handling to stop duplicate invoices.',
      'Increase database connection pool size for User Onboarding Sequence.',
      'Restore live query behavior in Revenue Dashboard Refresh and remove stale cache.',
    ],
  },
  // ──── BrightPath Health — current week ────
  {
    id: 'rpt_04', clientId: 'client_04', clientName: 'BrightPath Health',
    periodStart: d(7), periodEnd: d(0),
    status: 'sent',
    totalRuns: 620, successfulRuns: 568, failedRuns: 52, silentIssues: 3,
    workflowsMonitored: 5, criticalBusinessRisks: 3,
    healthScore: 71,
    generatedAt: d(0, 7, 0), sentAt: d(0, 7, 45),
    executiveSummary:
      'Your automation system processed 620 workflow runs this week. Reliava detected 52 failed runs and 3 silent issues. The biggest risk was not the failures — it was the silent issue where 12 patients did not receive appointment reminders because phone numbers were missing from the CRM, even though the reminder workflow reported success.',
    healthExplanation:
      'Health is 71/100 because two workflows — Insurance Claim Router and Patient Appointment Reminders — experienced repeated failures. The silent issue in appointment reminders is particularly concerning because it affected patient communication without triggering any error alerts.',
    whatWorkedWell: [
      'Lab Results Ingestion processed all 15 incoming lab results without errors.',
      'Telehealth Session Scheduler handled all appointment scheduling requests successfully.',
      'Insurance Claim Router recovered on its own for most failures after the upstream API came back online.',
    ],
    businessRiskSummary:
      'The main business risk this week was missed patient communication. A silent issue in Patient Appointment Reminders meant all 12 patients scheduled for appointments did not receive their notification because phone numbers were missing from the CRM — this could lead to missed appointments and wasted clinician time. Insurance Claim Router failures from the external claims API 502 errors meant some claims may not have been routed to the correct processing queue, potentially delaying patient reimbursement.',
    agencyActionSummary:
      'Investigate the CRM sync pipeline that feeds Patient Appointment Reminders to confirm why phone_number fields are being dropped. Contact the external claims API provider about the 502 errors and implement circuit-breaker logic. Review HL7 document size limits and add pre-validation before the parser step. Confirm silent issue rules are monitoring required field presence across all patient communication workflows.',
    closingNote:
      'Reliava caught the missing phone number issue that would have gone unnoticed until patients missed their appointments. The priority next week is fixing the CRM data pipeline for patient communications.',
    priorityFixes: [
      'Fix the CRM sync pipeline to stop dropping patient phone numbers.',
      'Add required-field validation before the appointment reminder step.',
      'Implement circuit-breaker logic for the external claims API to prevent cascade failures.',
    ],
  },
  // ──── Summit Logistics — current week ────
  {
    id: 'rpt_05', clientId: 'client_05', clientName: 'Summit Logistics',
    periodStart: d(7), periodEnd: d(0),
    status: 'sent',
    totalRuns: 285, successfulRuns: 285, failedRuns: 0, silentIssues: 0,
    workflowsMonitored: 3, criticalBusinessRisks: 0,
    healthScore: 96,
    generatedAt: d(0, 6, 0), sentAt: d(0, 6, 20),
    executiveSummary:
      'Your automation system processed 285 workflow runs this week with a perfect record. Every run completed successfully, no silent issues were detected, and all business outcomes were complete. This is the third consecutive week with zero incidents.',
    healthExplanation:
      'Health is 96/100 because all workflows are operating reliably with strong health scores. The score reflects consistent, trouble-free operation across shipment tracking, payroll, and customer notifications.',
    whatWorkedWell: [
      'Shipment Tracking Sync updated all 89 shipment statuses on schedule with zero errors.',
      'Driver Payroll Calculation completed all payroll runs accurately and on time.',
      'Customer Notification Pipeline sent all notifications without delivery issues.',
    ],
    businessRiskSummary:
      'No business risk was identified this week. All logistics tracking, payroll, and customer notification workflows ran flawlessly. No silent issues were detected, confirming that all payload data met expected quality standards throughout the week.',
    agencyActionSummary:
      'No action required this week. Continue monitoring as usual. Consider using Summit Logistics workflows as a reliability benchmark for other clients during quarterly business reviews.',
    closingNote:
      'All automations are performing at their best. No issues were detected this week.',
    priorityFixes: [],
  },
  // ──── GreenLeaf Commerce — previous week ────
  {
    id: 'rpt_06', clientId: 'client_01', clientName: 'GreenLeaf Commerce',
    periodStart: d(14), periodEnd: d(7),
    status: 'sent',
    totalRuns: 810, successfulRuns: 782, failedRuns: 28, silentIssues: 1,
    workflowsMonitored: 6, criticalBusinessRisks: 1,
    healthScore: 83,
    generatedAt: d(7, 10, 0), sentAt: d(7, 10, 30),
    executiveSummary:
      'Your automation system processed 810 workflow runs last week. Most completed normally. Reliava detected 28 failed runs from email timeouts and 1 silent issue where the review sync returned empty results despite reporting success.',
    healthExplanation:
      'Health is 83/100 because most workflows completed successfully and the only silent issue was low-impact. The SendGrid timeouts were the primary score detractor.',
    whatWorkedWell: [
      'Shopify to CRM Sync kept customer data current with no data quality issues.',
      'Inventory Reorder Alert triggered all stock alerts on schedule.',
      'Abandoned Cart Recovery drove 6 conversions from 31 recovery emails.',
    ],
    businessRiskSummary:
      'The 28 SendGrid timeout failures meant some customers experienced delayed order confirmation messages. The Review Aggregation silent issue did not pose direct business risk but indicated a potential upstream API change.',
    agencyActionSummary:
      'Review SendGrid delivery logs to confirm all delayed emails were eventually delivered. Check the Review Aggregation source API for rate limiting or schema changes.',
    closingNote:
      'Reliava detected the Review Aggregation anomaly before it could affect your reputation monitoring data.',
    priorityFixes: [
      'Stabilise SendGrid delivery for order confirmations.',
      'Add record-count validation to Review Aggregation success payloads.',
    ],
  },
  // ──── NovaTech SaaS — previous week ────
  {
    id: 'rpt_07', clientId: 'client_03', clientName: 'NovaTech SaaS',
    periodStart: d(14), periodEnd: d(7),
    status: 'sent',
    totalRuns: 1480, successfulRuns: 1307, failedRuns: 173, silentIssues: 5,
    workflowsMonitored: 8, criticalBusinessRisks: 4,
    healthScore: 48,
    generatedAt: d(7, 8, 0), sentAt: d(7, 8, 45),
    executiveSummary:
      'Your automation system processed 1,480 workflow runs last week. Reliava detected 173 failed runs and 5 silent issues. The biggest risks were incomplete user onboarding and unreliable churn risk scores that the team may have acted on.',
    healthExplanation:
      'Health is 48/100 because multiple workflows were in critical state with high failure volumes and recurring silent data quality issues. The score reflects both the number of failures and the business significance of undetected data problems.',
    whatWorkedWell: [
      'Slack Alert Router operated without failures all week.',
      'Feature Flag Deployment handled all deployment events successfully.',
      'Support Ticket Triage routed all incoming tickets to the correct queues.',
    ],
    businessRiskSummary:
      'The high failure count in User Onboarding Sequence directly impacted new user activation, with an estimated 40+ users affected by incomplete onboarding. Stripe Billing Webhook failures risked billing inconsistencies for SaaS subscribers. Silent issues in analytics workflows meant churn risk scores and revenue data may have been unreliable for parts of the week.',
    agencyActionSummary:
      'Prioritise database connection pool scaling for the User Onboarding Sequence. Audit all Stripe webhook event handling for idempotency and signature validation. Review analytics workflow data source configurations and refresh intervals. Schedule a reliability review call with the NovaTech team.',
    closingNote:
      'Reliava identified the data freshness issues in analytics workflows that would have led to incorrect churn risk assessments.',
    priorityFixes: [
      'Scale database connection pool for User Onboarding Sequence.',
      'Audit Stripe webhook idempotency to prevent duplicate invoices.',
      'Add data freshness validation to analytics workflow success payloads.',
    ],
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