import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Gauge,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  listIncidents,
  listMaintenance,
  listPredictions,
  useStore,
  type Incident,
} from "@/lib/store";

import { getDashboard } from "@/lib/api";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Sentinel AI" }] }),
  component: DashboardPage,
});

const CATEGORY_COLORS: Record<string, string> = {
  Mechanical: "oklch(0.55 0.18 245)",
  Electrical: "oklch(0.75 0.16 75)",
  Software: "oklch(0.6 0.22 25)",
  Network: "oklch(0.65 0.16 155)",
};

function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

useEffect(() => {
  fetch("http://localhost:8080/api/incidents")
    .then((res) => res.json())
    .then((data: Incident[]) => setIncidents(data))
    .catch((err) => console.error(err));
}, []);
  const maintenance = useStore(listMaintenance);
  const predictions = useStore(listPredictions);

  const [dashboard, setDashboard] = useState<{
  totalIncidents: number;
  criticalIncidents: number;
  resolvedIncidents: number;
  openIncidents: number;
}>({
  totalIncidents: 0,
  criticalIncidents: 0,
  resolvedIncidents: 0,
  openIncidents: 0,
});

getDashboard()
  .then((data) => setDashboard(data))
  .catch(console.error);

  const stats = useMemo(() => {
    const total = incidents.length;
    const critical = incidents.filter(
  (i) => i.severity === "Critical"
).length;
    const resolved = incidents.filter((i) => i.status === "Resolved").length;
    const atRisk = predictions.filter((p) => p.riskLevel === "Critical" || p.riskLevel === "High").length;
    return { total, critical, resolved, atRisk };
  }, [incidents, predictions]);

  const frequency = useMemo(() => buildFrequency(incidents), [incidents]);
  const categoryData = useMemo(() => buildCategory(incidents), [incidents]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operations overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live status of incidents, maintenance, and asset health across the fleet.
          </p>
        </div>
        <Button asChild>
          <Link to="/analyzer">
            <Brain className="mr-2 size-4" /> New AI analysis
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total incidents"
          value={dashboard.totalIncidents}
          hint={<><TrendingDown className="size-3 text-success" /> tracking</>}
          icon={AlertTriangle}
          accent="text-foreground"
        />
        <StatCard
          label="Critical failures"
          value={dashboard.criticalIncidents}
          hint={<><TrendingUp className="size-3 text-critical" /> requires review</>}
          icon={AlertTriangle}
          accent="text-critical"
        />
        <StatCard
          label="Resolved issues"
          value={dashboard.resolvedIncidents}
          hint={<><CheckCircle2 className="size-3 text-success" /> closed</>}
          icon={CheckCircle2}
          accent="text-success"
        />
        <StatCard
          label="Predicted failures"
          value={dashboard.openIncidents}
          hint={<><Gauge className="size-3 text-warning" /> machines at risk</>}
          icon={Gauge}
          accent="text-warning"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Incident frequency</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Last 6 months · reported vs resolved
              </p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={frequency} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--color-accent)" }}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="reported" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Reported" />
                <Bar dataKey="resolved" fill="var(--color-success)" radius={[4, 4, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold">Failure categories</h3>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Distribution
          </p>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {categoryData.map((c) => (
                    <Cell key={c.name} fill={CATEGORY_COLORS[c.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: CATEGORY_COLORS[c.name] }} />
                  {c.name}
                </div>
                <span className="font-mono text-muted-foreground">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Machine health */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Machine health scores</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Live from predictive engine
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/predictions">View all</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {predictions.map((p) => (
              <div key={p.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{p.machineName}</span>
                  <span className="font-mono text-xs text-muted-foreground">{p.healthScore}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${
                      p.healthScore >= 80
                        ? "bg-success"
                        : p.healthScore >= 60
                        ? "bg-warning"
                        : "bg-critical"
                    }`}
                    style={{ width: `${p.healthScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold">Latest incidents</h3>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Top 5 reported
          </p>
          <div className="space-y-3">
            {incidents.slice(0, 5).map((i) => (
              <div key={i.id} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{i.machineName}</span>
                  <SeverityBadge severity={i.severity} />
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{i.description}</p>
              </div>
            ))}
            {incidents.length === 0 && (
              <p className="text-xs text-muted-foreground">No incidents yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Cost summary */}
      <div className="glass-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Maintenance cost trend</h3>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Spend by week · USD
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold tracking-tight">
              ${maintenance.reduce((s, r) => s + r.cost, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total tracked</div>
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart data={buildCostSeries(maintenance)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--color-primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  hint: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className={`rounded-md bg-accent p-1.5 ${accent}`}>
          <Icon className="size-3.5" />
        </div>
      </div>
      <div className={`mt-3 text-3xl font-bold tracking-tight ${accent}`}>{value}</div>
      <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: Incident["severity"] }) {
  const style =
    severity === "Critical"
      ? "bg-critical/10 text-critical border-critical/20"
      : severity === "High"
      ? "bg-warning/10 text-warning border-warning/30"
      : severity === "Medium"
      ? "bg-primary/10 text-primary border-primary/20"
      : "bg-muted text-muted-foreground border-border";
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${style}`}>
      {severity}
    </span>
  );
}

function buildFrequency(incidents: Incident[]) {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const base = months.map((m, idx) => ({
    month: m,
    reported: [12, 18, 15, 22, 19, 24][idx] + Math.min(incidents.length, 6),
    resolved: [10, 14, 13, 18, 15, 20][idx],
  }));
  return base;
}

function buildCategory(incidents: Incident[]) {
  const counts: Record<string, number> = {
    Mechanical: 0,
    Electrical: 0,
    Software: 0,
    Network: 0,
  };
  incidents.forEach((i) => {
  if (i.category) {
    counts[i.category] = (counts[i.category] || 0) + 1;
  }
});
  // Add baseline so pie renders even when empty
  return Object.entries(counts).map(([name, value]) => ({
    name,
    value: value + (value === 0 ? 1 : 0),
  }));
}

function buildCostSeries(records: Array<{ cost: number; date: string }>) {
  const weeks = ["W-5", "W-4", "W-3", "W-2", "W-1", "This"];
  return weeks.map((week, i) => ({
    week,
    cost: [800, 1200, 950, 1400, 1650, records.reduce((s, r) => s + r.cost, 0) / 6 + 400][i],
  }));
}
