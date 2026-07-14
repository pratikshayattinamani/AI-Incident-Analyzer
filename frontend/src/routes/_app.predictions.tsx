import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Gauge, ShieldCheck } from "lucide-react";
import { listPredictions, useStore, type Prediction } from "@/lib/store";

export const Route = createFileRoute("/_app/predictions")({
  head: () => ({ meta: [{ title: "Predictive Maintenance — Sentinel AI" }] }),
  component: PredictionsPage,
});

function PredictionsPage() {
  const predictions = useStore(listPredictions);
  const critical = predictions.filter((p) => p.riskLevel === "Critical").length;
  const high = predictions.filter((p) => p.riskLevel === "High").length;
  const safe = predictions.filter((p) => p.riskLevel === "Low").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Predictive maintenance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Forward-looking health scores generated from telemetry and historical failure patterns.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Critical risk" value={critical} tone="critical" icon={AlertTriangle} />
        <SummaryCard label="Elevated risk" value={high} tone="warning" icon={Gauge} />
        <SummaryCard label="Nominal" value={safe} tone="success" icon={ShieldCheck} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {predictions.map((p) => (
          <PredictionCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: number;
  tone: "critical" | "warning" | "success";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const color =
    tone === "critical" ? "text-critical" : tone === "warning" ? "text-warning" : "text-success";
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <Icon className={`size-4 ${color}`} />
      </div>
      <div className={`mt-3 text-3xl font-bold tracking-tight ${color}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">machines</div>
    </div>
  );
}

function PredictionCard({ p }: { p: Prediction }) {
  const bar =
    p.healthScore >= 80 ? "bg-success" : p.healthScore >= 60 ? "bg-warning" : "bg-critical";
  const riskColor =
    p.riskLevel === "Critical"
      ? "text-critical"
      : p.riskLevel === "High"
      ? "text-warning"
      : p.riskLevel === "Medium"
      ? "text-primary"
      : "text-success";
  const riskBg =
    p.riskLevel === "Critical"
      ? "bg-critical/10 border-critical/30"
      : p.riskLevel === "High"
      ? "bg-warning/10 border-warning/30"
      : p.riskLevel === "Medium"
      ? "bg-primary/10 border-primary/30"
      : "bg-success/10 border-success/30";

  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-border p-5">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Asset
            </div>
            <h3 className="text-lg font-semibold">{p.machineName}</h3>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase ${riskBg} ${riskColor}`}
          >
            Risk · {p.riskLevel}
          </span>
        </div>
        <div className="flex items-end justify-between text-sm">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Health score
            </div>
            <div className="text-3xl font-bold tracking-tight">{p.healthScore}%</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Est. days to failure
            </div>
            <div className={`text-xl font-semibold ${riskColor}`}>{p.daysUntilFailure}d</div>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className={`h-full ${bar}`} style={{ width: `${p.healthScore}%` }} />
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-critical">
            Predicted failure
          </div>
          <p className="text-sm text-foreground/80">{p.prediction}</p>
        </div>
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            Recommended maintenance
          </div>
          <p className="text-sm text-foreground/80">{p.recommendation}</p>
        </div>
      </div>
    </div>
  );
}
