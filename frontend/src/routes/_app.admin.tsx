import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ShieldAlert, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  getSession,
  listUsers,
  useStore,
  type Incident,
} from "@/lib/store";
export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin — Sentinel AI" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const session = useStore(() => getSession());
  const users = useStore(listUsers);
  const [incidents, setIncidents] = useState<Incident[]>([]);

useEffect(() => {
  fetch("http://localhost:8080/api/incidents")
    .then((res) => res.json())
    .then((data: Incident[]) => setIncidents(data))
    .catch((error) => console.error(error));
}, []);

  useEffect(() => {
    if (session && session.role !== "admin") {
      toast.error("Admin access required");
      navigate({ to: "/dashboard" });
    }
  }, [session, navigate]);

  if (!session || session.role !== "admin") return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-navy text-navy-foreground">
          <ShieldAlert className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin panel</h1>
          <p className="text-sm text-muted-foreground">
            Manage users, oversee all incidents, and audit system activity.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Users" value={users.length} icon={Users} />
        <StatTile label="Total incidents" value={incidents.length} icon={AlertTriangle} />
        <StatTile
          label="Critical incidents"
          value={incidents.filter((i) => i.severity === "Critical").length}
          icon={AlertTriangle}
          tone="critical"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="border-b border-border bg-panel px-5 py-3">
          <h3 className="text-sm font-semibold">Users</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-left font-medium">Email</th>
              <th className="px-4 py-2 text-left font-medium">Role</th>
              <th className="px-4 py-2 text-left font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/60 last:border-none">
                <td className="px-4 py-2 font-medium">{u.name}</td>
                <td className="px-4 py-2 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="border-b border-border bg-panel px-5 py-3">
          <h3 className="text-sm font-semibold">All incidents</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Machine</th>
              <th className="px-4 py-2 text-left font-medium">Severity</th>
              <th className="px-4 py-2 text-left font-medium">Category</th>
              <th className="px-4 py-2 text-left font-medium">Reported</th>
              <th className="px-4 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((i) => (
              <tr key={i.id} className="border-b border-border/60 last:border-none">
                <td className="px-4 py-2 font-medium">{i.machineName}</td>
                <td className="px-4 py-2">{i.severity}</td>
                <td className="px-4 py-2">{i.category}</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  {new Date(i.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-right">
                  <Button
                    size="icon"
                    variant="ghost"
            onClick={async () => {
  try {
    await fetch(`http://localhost:8080/api/incidents/${i.id}`, {
      method: "DELETE",
    });

    setIncidents((prev) =>
      prev.filter((item) => item.id !== i.id)
    );

    toast.success("Incident deleted");
  } catch (error) {
    toast.error("Failed to delete incident");
    console.error(error);
  }
}}
                  >
                    <Trash2 className="size-3.5 text-critical" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "critical";
}) {
  const color = tone === "critical" ? "text-critical" : "text-foreground";
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <Icon className={`size-4 ${color}`} />
      </div>
      <div className={`mt-3 text-3xl font-bold tracking-tight ${color}`}>{value}</div>
    </div>
  );
}
