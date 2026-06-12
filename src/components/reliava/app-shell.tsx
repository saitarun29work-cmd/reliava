'use client';

import type { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import type { Route } from '@/lib/types';
import {
  Shield,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Navigation items
// ---------------------------------------------------------------------------
interface NavItem {
  label: string;
  icon: React.ElementType;
  route: Route;
}

const NAV_ITEMS: (NavItem | 'separator')[] = [
  { label: 'Dashboard', icon: LayoutDashboard, route: { page: 'dashboard' } },
  { label: 'Clients', icon: Users, route: { page: 'clients' } },
  'separator',
  { label: 'Settings', icon: Settings, route: { page: 'settings' } },
];

// ---------------------------------------------------------------------------
// Sidebar content (shared between desktop and mobile)
// ---------------------------------------------------------------------------
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const route = useAppStore((s) => s.route);
  const user = useAppStore((s) => s.user);
  const navigate = useAppStore((s) => s.navigate);
  const logout = useAppStore((s) => s.logout);

  const handleNav = (r: Route) => {
    navigate(r);
    onNavigate?.();
  };

  const isActive = (item: Route) => {
    // Simple check: the page key matches
    return route.page === item.page;
  };

  const firstLetter = user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5">
        <Shield className="size-5 text-emerald-400" />
        <span className="text-lg font-bold tracking-tight">
          <span className="text-emerald-400">RELI</span>
          <span className="text-foreground">AVA</span>
        </span>
      </div>

      <Separator />

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item, idx) => {
          if (item === 'separator') {
            return <Separator key={`sep-${idx}`} className="my-2" />;
          }
          const Icon = item.icon;
          const active = isActive(item.route);
          return (
            <button
              key={item.label}
              onClick={() => handleNav(item.route)}
              className={cn(
                'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <Separator />

      {/* User info + logout */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
            {firstLetter}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name ?? 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email ?? ''}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AppShell — main layout wrapper
// ---------------------------------------------------------------------------
export function AppShell({ children }: { children: ReactNode }) {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const user = useAppStore((s) => s.user);

  const firstLetter = user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <>
      {/* ---- Mobile top bar ---- */}
      <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 border-b border-border bg-background lg:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <span className="text-lg font-bold tracking-tight">
          <span className="text-emerald-400">RELI</span>
          <span className="text-foreground">AVA</span>
        </span>

        <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
          {firstLetter}
        </div>
      </header>

      {/* ---- Desktop sidebar ---- */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden lg:flex lg:flex-col w-64 border-r border-border bg-card">
        <SidebarContent />
      </aside>

      {/* ---- Main content ---- */}
      <main className="min-h-screen bg-background lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </>
  );
}
