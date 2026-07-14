import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CircuitBoard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Sentinel AI" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      login(email, password);
      toast.success("Signed in");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-navy p-12 text-navy-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-navy-foreground">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <CircuitBoard className="size-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Sentinel<span className="text-primary">AI</span>
          </span>
        </Link>
        <div className="space-y-4">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">
            Industrial ops intelligence
          </div>
          <h2 className="text-3xl font-bold leading-tight">
            "Sentinel spotted a bearing failure three days before it would have taken
            the line down. Paid for itself in one incident."
          </h2>
          <div className="text-sm text-navy-foreground/60">
            — Plant Manager, Precision Metals Ltd.
          </div>
        </div>
        <div className="font-mono text-xs text-navy-foreground/40">
          NODE_EU-WEST-4 // SHARD_092 // ENCRYPTED
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Sign in to Sentinel</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your credentials to access your workspace.
            </p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@plant.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Login"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
