import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CircuitBoard,
  Gauge,
  LineChart,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-navy text-navy-foreground">
              <CircuitBoard className="size-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Sentinel<span className="text-primary">AI</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#stack" className="hover:text-foreground">Platform</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">
                Get Started <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                Neural analysis engine online
              </div>
              <h1 className="mt-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl">
                AI-Powered Incident Detection & Predictive Maintenance
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Analyze failures, identify root causes, and prevent future breakdowns
                using artificial intelligence — purpose-built for small and medium
                industrial operations.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link to="/register">
                    Get Started <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-8 text-sm">
                <Stat value="42%" label="Downtime reduction" />
                <Stat value="1.4s" label="Avg analysis time" />
                <Stat value="6+" label="Failure patterns detected" />
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="relative">
              <div className="glass-card overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between border-b border-border bg-panel px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <div className="size-2.5 rounded-full bg-critical/50" />
                    <div className="size-2.5 rounded-full bg-warning/60" />
                    <div className="size-2.5 rounded-full bg-success/60" />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    fleet_console / live
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 p-4">
                  <PreviewStat label="Total incidents" value="124" trend="-12%" ok />
                  <PreviewStat label="Critical" value="08" trend="+2" danger />
                  <PreviewStat label="Predicted" value="05" trend="risk" warn />
                </div>
                <div className="mx-4 mb-4 rounded-lg border border-border bg-panel p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold">Incident frequency</span>
                    <span className="font-mono text-[10px] text-muted-foreground">30D</span>
                  </div>
                  <div className="flex h-24 items-end gap-1.5">
                    {[30, 45, 40, 55, 35, 70, 50, 65, 42, 80, 55, 48, 60, 38, 72].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm ${
                          h > 70 ? "bg-critical/60" : h > 50 ? "bg-warning/70" : "bg-primary/70"
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2 border-t border-border bg-panel p-4">
                  {[
                    { name: "CNC Machine 04", score: 86, risk: "Low", color: "bg-success" },
                    { name: "Hydraulic Press 01", score: 72, risk: "Medium", color: "bg-warning" },
                    { name: "Conveyor Line A", score: 38, risk: "Critical", color: "bg-critical" },
                  ].map((m) => (
                    <div key={m.name} className="flex items-center gap-3 text-xs">
                      <span className="w-32 truncate font-medium">{m.name}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full ${m.color}`} style={{ width: `${m.score}%` }} />
                      </div>
                      <span className="w-10 text-right font-mono text-muted-foreground">
                        {m.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-xl bg-primary/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-border bg-panel/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 max-w-2xl">
            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">
              Capabilities
            </div>
            <h2 className="text-4xl font-bold tracking-tight">
              Six intelligence layers, one operations console
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every incident is enriched with structured analysis so your engineers
              spend time fixing, not diagnosing.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Feature icon={Brain} title="Incident summary" body="Neural digestion of logs, tickets, and free-text descriptions into a single narrative." />
            <Feature icon={Activity} title="Root cause analysis" body="Multi-hypothesis ranking of likely mechanical, electrical, or software causes." />
            <Feature icon={AlertTriangle} title="Severity classification" body="Consistent severity scoring calibrated on your fleet's historical failures." />
            <Feature icon={Wrench} title="Recommended solution" body="Immediate and long-term corrective actions with expected effort." />
            <Feature icon={ShieldCheck} title="Preventive maintenance" body="Suggested cadence and sensors to stop the same failure repeating." />
            <Feature icon={Gauge} title="Failure prediction" body="Machine health scoring with time-to-failure estimates for every asset." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-b border-border py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 max-w-2xl">
            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">
              Workflow
            </div>
            <h2 className="text-4xl font-bold tracking-tight">From event to action in seconds</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Upload evidence", d: "Drop machine logs, CSV telemetry, or paste an operator description." },
              { n: "02", t: "AI diagnostic", d: "The engine matches signals against known failure modes and predicts risk." },
              { n: "03", t: "Actionable report", d: "Structured findings hand-off directly to a maintenance work order." },
            ].map((s) => (
              <div key={s.n} className="glass-card p-6">
                <div className="mb-6 font-mono text-xs text-primary">{s.n}</div>
                <div className="text-lg font-semibold">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="stack" className="bg-navy py-24 text-navy-foreground">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Sparkles className="mx-auto mb-6 size-8 text-primary" />
          <h2 className="text-4xl font-bold tracking-tight">
            Stop reacting to failures. Start predicting them.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-navy-foreground/70">
            Spin up a workspace in seconds and analyze your first incident right away.
            Free during preview.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/register">Create free account</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
            >
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <LineChart className="size-4" />
            <span>© 2026 Sentinel AI — Industrial Operations Intelligence</span>
          </div>
          <div className="font-mono">v1.0 · uptime 99.9%</div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="glass-card p-6 transition-all hover:shadow-glow">
      <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div className="text-base font-semibold">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function PreviewStat({
  label,
  value,
  trend,
  ok,
  warn,
  danger,
}: {
  label: string;
  value: string;
  trend: string;
  ok?: boolean;
  warn?: boolean;
  danger?: boolean;
}) {
  const color = danger ? "text-critical" : warn ? "text-warning" : ok ? "text-success" : "text-muted-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-xl font-bold tracking-tight">{value}</div>
      <div className={`mt-1 font-mono text-[10px] ${color}`}>{trend}</div>
    </div>
  );
}
