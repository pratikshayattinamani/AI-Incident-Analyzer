import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession, useStore, type User } from "@/lib/store";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Sentinel AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const session = useStore<User | null>(() => getSession());
  if (!session) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and workspace preferences.
        </p>
      </div>

      <div className="glass-card max-w-2xl p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Profile
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input defaultValue={session.name} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={session.email} disabled />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input defaultValue={session.role} disabled className="capitalize" />
          </div>
          <Button onClick={() => toast.success("Profile saved")}>Save changes</Button>
        </div>
      </div>

      <div className="glass-card max-w-2xl p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Notifications
        </h2>
        <div className="space-y-3 text-sm">
          {[
            "Alert me when a critical incident is logged",
            "Weekly predictive maintenance digest",
            "Cost threshold exceeded (per machine)",
          ].map((label) => (
            <label key={label} className="flex items-center gap-3 rounded-md border border-border bg-panel p-3">
              <input type="checkbox" defaultChecked className="size-4 accent-primary" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
