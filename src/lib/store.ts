// ============================================================
// Reliava — Global State Store (Zustand)
// ============================================================

import { create } from 'zustand';
import type { Route, User, Agency } from './types';
import {
  mockUser, mockAgency, mockClients, mockWorkflows,
  mockEvents, mockAlerts, mockReports, mockIssueRules,
} from './mock-data';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  agency: Agency | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;

  // Router
  route: Route;
  navigate: (route: Route) => void;

  // Data
  clients: typeof mockClients;
  workflows: typeof mockWorkflows;
  events: typeof mockEvents;
  alerts: typeof mockAlerts;
  reports: typeof mockReports;
  issueRules: typeof mockIssueRules;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth — simulated for MVP preview
  isAuthenticated: false,
  user: null,
  agency: null,
  login: (email: string, _password: string) => {
    // In production, this calls Supabase Auth.
    // For MVP preview, accept any non-empty credentials.
    if (email && _password) {
      const user = { ...mockUser, email };
      set({ isAuthenticated: true, user, agency: mockAgency, route: { page: 'dashboard' } });
      return true;
    }
    return false;
  },
  signup: (name: string, email: string, _password: string) => {
    if (name && email && _password) {
      const user = { ...mockUser, name, email };
      set({ isAuthenticated: true, user, agency: mockAgency, route: { page: 'dashboard' } });
      return true;
    }
    return false;
  },
  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
      agency: null,
      route: { page: 'login' },
    });
  },

  // Router
  route: { page: 'login' },
  navigate: (route: Route) => {
    set({ route });
    // Scroll to top on navigation
    window.scrollTo(0, 0);
  },

  // Data (mock, loaded once)
  clients: mockClients,
  workflows: mockWorkflows,
  events: mockEvents,
  alerts: mockAlerts,
  reports: mockReports,
  issueRules: mockIssueRules,

  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

// Selector helpers
export const selectClientById = (id: string) => (state: AppState) =>
  state.clients.find((c) => c.id === id);

export const selectWorkflowsByClient = (clientId: string) => (state: AppState) =>
  state.workflows.filter((w) => w.clientId === clientId);

export const selectWorkflowById = (id: string) => (state: AppState) =>
  state.workflows.find((w) => w.id === id);

export const selectEventsByWorkflow = (workflowId: string) => (state: AppState) =>
  state.events
    .filter((e) => e.workflowId === workflowId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const selectAlertsByClient = (clientId: string) => (state: AppState) =>
  state.alerts.filter((a) => a.clientId === clientId);

export const selectReportsByClient = (clientId: string) => (state: AppState) =>
  state.reports
    .filter((r) => r.clientId === clientId)
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

export const selectAlertsByWorkflow = (workflowId: string) => (state: AppState) =>
  state.alerts.filter((a) => a.workflowId === workflowId);