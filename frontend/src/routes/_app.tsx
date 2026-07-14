import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Brain,
  CircuitBoard,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  Settings as SettingsIcon,
  Shield,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession, logout, seedIfEmpty, useStore, type User } from "@/lib/store";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyzer", label: "Incident Analyzer", icon: Brain },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/predictions", label: "Predictions", icon: Gauge },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function AppLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const session = useStore<User | null>(() => getSession());
  const pathname = useRouterStatePath();

  useEffect(() => {
    seedIfEmpty();
    if (!getSession()) {
      navigate({ to: "/login", replace: true });
    } else {
      setReady(true);
    }
  }, [navigate]);

  if (!ready || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading workspace…</div>
      </div>
    );
  }

  const isAdmin = session.role === "admin";

  return (
    <div className="flex min-h-screen bg-panel/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CircuitBoard className="size-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Sentinel<span className="text-primary">AI</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <div className="mb-2 px-3 font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground/40">
            Workspace
          </div>
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-l-2 border-primary bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          {isAdmin && (
            <>
              <div className="mt-6 mb-2 px-3 font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground/40">
                Admin
              </div>
              <Link
                to="/admin"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/admin"
                    ? "border-l-2 border-primary bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Shield className="size-4" />
                Admin Panel
              </Link>
            </>
          )}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg border border-sidebar-border/60 bg-sidebar-accent/40 p-3">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground/50">
              Fleet Health
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sidebar-border">
                <div className="h-full w-[92%] bg-success" />
              </div>
              <span className="font-mono text-xs text-success">92%</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/85 px-6 backdrop-blur-md">
          <div>
            <div className="text-sm font-semibold">
              {NAV.find((n) => n.to === pathname)?.label ??
                (pathname === "/admin" ? "Admin Panel" : "Sentinel")}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {new Date().toUTCString().slice(5, 22)} · monitoring live
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <Bell className="size-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 pr-3 text-sm shadow-sm hover:bg-accent">
                  <span className="flex size-7 items-center justify-center rounded-full bg-navy text-xs font-semibold text-navy-foreground">
                    {initials(session.name)}
                  </span>
                  <div className="hidden text-left sm:block">
                    <div className="text-xs font-semibold leading-tight">{session.name}</div>
                    <div className="text-[10px] capitalize text-muted-foreground">
                      {session.role}
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{session.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <SettingsIcon className="mr-2 size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    toast.success("Signed out");
                    navigate({ to: "/login", replace: true });
                  }}
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function useRouterStatePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Silence unused import warning for the icon used above
void BarChart3;
