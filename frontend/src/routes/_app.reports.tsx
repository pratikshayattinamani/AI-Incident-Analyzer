import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Sheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  listIncidents,
  listMaintenance,
  listPredictions,
  useStore,
} from "@/lib/store";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — Sentinel AI" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const incidents = useStore(listIncidents);
  const maintenance = useStore(listMaintenance);
  const predictions = useStore(listPredictions);

  function exportCSV() {
    const rows: string[] = [];
    rows.push("Section,Machine,Detail,Severity/Status,Cost");
    incidents.forEach((i) =>
      rows.push(`Incident,${csv(i.machineName)},${csv(i.summary)},${i.severity},`)
    );
    maintenance.forEach((r) =>
      rows.push(`Maintenance,${csv(r.machineName)},${csv(r.problem)},${r.status},${r.cost}`)
    );
    predictions.forEach((p) =>
      rows.push(`Prediction,${csv(p.machineName)},${csv(p.prediction)},${p.riskLevel},`)
    );
    downloadBlob(rows.join("\n"), "sentinel-report.csv", "text/csv");
    toast.success("CSV exported");
  }

  function exportPDF() {
    // Simple HTML → print flow acts as a PDF export placeholder
    const html = `
<!doctype html><html><head><meta charset="utf-8"><title>Sentinel report</title>
<style>
body{font-family:Inter,system-ui,sans-serif;padding:32px;color:#0f172a}
h1{margin:0 0 4px;font-size:20px}
h2{margin:28px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:#3b82f6}
table{width:100%;border-collapse:collapse;font-size:12px}
th,td{border-bottom:1px solid #e2e8f0;padding:8px;text-align:left}
th{background:#f8fafc}
.muted{color:#64748b;font-size:11px}
</style></head><body>
<h1>Sentinel AI — Operations Report</h1>
<div class="muted">Generated ${new Date().toLocaleString()}</div>
<h2>Incident history</h2>
<table><thead><tr><th>Machine</th><th>Severity</th><th>Category</th><th>Summary</th><th>Status</th></tr></thead><tbody>
${incidents
  .map(
    (i) =>
      `<tr><td>${esc(i.machineName)}</td><td>${i.severity}</td><td>${i.category}</td><td>${esc(
        i.summary
      )}</td><td>${i.status}</td></tr>`
  )
  .join("")}
</tbody></table>
<h2>Maintenance actions</h2>
<table><thead><tr><th>Machine</th><th>Problem</th><th>Technician</th><th>Cost</th><th>Status</th></tr></thead><tbody>
${maintenance
  .map(
    (r) =>
      `<tr><td>${esc(r.machineName)}</td><td>${esc(r.problem)}</td><td>${esc(r.technician)}</td><td>$${r.cost}</td><td>${r.status}</td></tr>`
  )
  .join("")}
</tbody></table>
<h2>AI Recommendations</h2>
<table><thead><tr><th>Machine</th><th>Risk</th><th>Prediction</th><th>Recommendation</th></tr></thead><tbody>
${predictions
  .map(
    (p) =>
      `<tr><td>${esc(p.machineName)}</td><td>${p.riskLevel}</td><td>${esc(p.prediction)}</td><td>${esc(p.recommendation)}</td></tr>`
  )
  .join("")}
</tbody></table>
<h2>Cost analysis</h2>
<div>Total maintenance spend: <strong>$${maintenance
      .reduce((s, r) => s + r.cost, 0)
      .toLocaleString()}</strong></div>
<script>window.onload = () => setTimeout(() => window.print(), 300)</script>
</body></html>`;
    const w = window.open("", "_blank");
    if (!w) {
      toast.error("Please allow pop-ups to generate the PDF");
      return;
    }
    w.document.write(html);
    w.document.close();
    toast.success("PDF report opened — use browser Print → Save as PDF");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consolidated view of incidents, maintenance actions, costs, and AI recommendations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricTile label="Incidents logged" value={incidents.length} />
        <MetricTile label="Maintenance actions" value={maintenance.length} />
        <MetricTile
          label="Total spend"
          value={`$${maintenance.reduce((s, r) => s + r.cost, 0).toLocaleString()}`}
        />
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Generate operations report</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Includes incident history, root causes, maintenance actions, cost breakdown, and AI recommendations.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV}>
              <Sheet className="mr-2 size-4" /> Export CSV
            </Button>
            <Button onClick={exportPDF}>
              <Download className="mr-2 size-4" /> Generate PDF
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Incident history",
            "Root cause analysis",
            "Maintenance actions",
            "Cost analysis",
            "AI recommendations",
            "Predictive risk",
          ].map((s) => (
            <div key={s} className="flex items-center gap-2 rounded-md border border-border bg-panel p-3 text-sm">
              <FileText className="size-4 text-primary" />
              <span className="font-medium">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass-card p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

function csv(s: string) {
  return `"${s.replace(/"/g, '""')}"`;
}
function esc(s: string) {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));
}
function downloadBlob(text: string, filename: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
