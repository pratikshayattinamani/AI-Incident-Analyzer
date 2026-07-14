import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Brain, FileUp, Loader2, Sparkles, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createIncident } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  analyzeIncident,
  type AnalysisResult,
  type Category,
} from "@/lib/store";



export const Route = createFileRoute("/_app/analyzer")({
  head: () => ({ meta: [{ title: "AI Incident Analyzer — Sentinel AI" }] }),
  component: AnalyzerPage,
});

function AnalyzerPage() {
  const [machineName, setMachineName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Mechanical");
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function runAnalysis(e: React.FormEvent) {
    e.preventDefault();
    if (!machineName || !description) {
      toast.error("Machine name and description are required");
      return;
    }
    setAnalyzing(true);
    setResult(null);
    // Simulate AI latency
    await new Promise((r) => setTimeout(r, 1200));
    const analysis = analyzeIncident(machineName, description, category);
    setResult(analysis);
  
    

await createIncident({
    title:machineName,
    machineName,
    description,
    severity: analysis.severity.toUpperCase(),
    status: "Open",
    category,
});
    setAnalyzing(false);
    toast.success("Analysis complete — incident logged");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Incident Analyzer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload evidence or describe the incident. Our simulated engine matches signals
          against known industrial failure modes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <form onSubmit={runAnalysis} className="glass-card space-y-5 p-6 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Brain className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Incident details</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Engine v4.0 · pattern-matched
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="machine">Machine / System name</Label>
            <Input
              id="machine"
              placeholder="e.g. CNC Machine 04"
              value={machineName}
              onChange={(e) => setMachineName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Incident description</Label>
            <Textarea
              id="desc"
              rows={5}
              placeholder="Machine stopped suddenly after 5 hours of operation. Motor temperature increased and unusual vibration detected."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat">Incident category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger id="cat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Network">Network</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Attach evidence (log, CSV, report)</Label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-panel p-6 text-center transition-colors hover:border-primary/50 hover:bg-primary/5">
              <FileUp className="size-6 text-muted-foreground" />
              <div className="text-xs font-medium">
                {file ? file.name : "Click to upload · CSV, TXT, LOG"}
              </div>
              <div className="text-[10px] text-muted-foreground">
                Files stay local — parsed by mock engine
              </div>
              <input
                type="file"
                className="hidden"
                accept=".csv,.txt,.log,.json"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={analyzing}>
            {analyzing ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Analyzing…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 size-4" /> Analyze Incident
              </>
            )}
          </Button>
        </form>

        {/* Results */}
        <div className="lg:col-span-3">
          {analyzing && <AnalyzingSkeleton />}
          {!analyzing && !result && <EmptyState />}
          {!analyzing && result && <ResultView machineName={machineName} result={result} />}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card flex h-full min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Brain className="size-6" />
      </div>
      <div className="text-lg font-semibold">Awaiting incident evidence</div>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Complete the form on the left to receive a structured AI analysis with root causes,
        recommended actions, and preventive suggestions.
      </p>
      <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-3 text-left">
        {["Overheating", "Vibration", "Voltage spike", "Sensor drift", "Network loss", "Software crash"].map((p) => (
          <div key={p} className="rounded-md border border-border bg-panel p-2 text-[11px] font-medium">
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyzingSkeleton() {
  return (
    <div className="glass-card flex h-full min-h-[400px] flex-col items-center justify-center p-8">
      <Loader2 className="mb-4 size-8 animate-spin text-primary" />
      <div className="text-sm font-semibold">Neural engine processing…</div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Matching signals against 4M+ failure records
      </div>
      <div className="mt-6 w-full max-w-md space-y-2">
        <div className="h-2 animate-pulse rounded-full bg-muted" />
        <div className="h-2 w-4/5 animate-pulse rounded-full bg-muted" />
        <div className="h-2 w-3/5 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}

function ResultView({
  machineName,
  result,
}: {
  machineName: string;
  result: AnalysisResult;
}) {
  const severityStyle =
    result.severity === "Critical"
      ? "bg-critical/10 text-critical border-critical/30"
      : result.severity === "High"
      ? "bg-warning/10 text-warning border-warning/30"
      : result.severity === "Medium"
      ? "bg-primary/10 text-primary border-primary/30"
      : "bg-muted text-muted-foreground border-border";

  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-border bg-panel px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Analysis complete · report_id {Math.random().toString(36).slice(2, 8).toUpperCase()}
            </div>
            <h3 className="mt-1 text-lg font-semibold">{machineName}</h3>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${severityStyle}`}
          >
            {result.severity} · {result.category}
          </span>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <Section title="Incident summary">
          <p className="text-sm leading-relaxed text-foreground/80">{result.summary}</p>
        </Section>

        <div className="grid gap-6 md:grid-cols-2">
          <Section title="Root cause analysis" accent="text-critical">
            <ol className="space-y-3">
              {result.rootCauses.map((c, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="font-mono text-xs text-critical">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-foreground/80">{c}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Recommended actions" accent="text-primary">
            <div className="space-y-4">
              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-warning">
                  Immediate
                </div>
                <ul className="space-y-1.5">
                  {result.immediateActions.map((a, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground/80">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">
                  Long term
                </div>
                <ul className="space-y-1.5">
                  {result.longTermActions.map((a, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground/80">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </div>

        <div className="rounded-lg border border-success/30 bg-success/5 p-4">
          <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-success">
            <Sparkles className="size-3" /> Preventive strategy
          </div>
          <p className="text-sm text-foreground/80">{result.prevention}</p>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="size-3.5" />
            Incident automatically added to the log
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 size-3.5" /> Export
            </Button>
            <Button size="sm">Generate work order</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className={`mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest ${
          accent ?? "text-muted-foreground"
        }`}
      >
        <span className={`size-1.5 rounded-full ${accent ? "bg-current" : "bg-muted-foreground"}`} />
        {title}
      </div>
      {children}
    </div>
  );
}
