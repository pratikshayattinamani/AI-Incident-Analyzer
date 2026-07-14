import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Pencil, Plus, Trash2, Wrench } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  addMaintenance,
  deleteMaintenance,
  gen,
  listMaintenance,
  updateMaintenance,
  useStore,
  type MaintenanceRecord,
  type MaintenanceStatus,
} from "@/lib/store";

export const Route = createFileRoute("/_app/maintenance")({
  head: () => ({ meta: [{ title: "Maintenance — Sentinel AI" }] }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const records = useStore(listMaintenance);
  const [editing, setEditing] = useState<MaintenanceRecord | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance records</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track every repair, technician assignment, and cost across the fleet.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-2 size-4" /> Add record
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-panel text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Machine</th>
                <th className="px-4 py-3 text-left font-medium">Problem</th>
                <th className="px-4 py-3 text-left font-medium">Technician</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Cost</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-none hover:bg-accent/40">
                  <td className="px-4 py-3 font-medium">{r.machineName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.problem}</td>
                  <td className="px-4 py-3">{r.technician}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono">${r.cost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditing(r);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          deleteMaintenance(r.id);
                          toast.success("Record deleted");
                        }}
                      >
                        <Trash2 className="size-3.5 text-critical" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    <Wrench className="mx-auto mb-2 size-6 opacity-40" />
                    No maintenance records yet. Click "Add record" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MaintenanceDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        onSave={(rec) => {
          if (editing) {
            updateMaintenance(editing.id, rec);
            toast.success("Record updated");
          } else {
            addMaintenance({ ...rec, id: gen.uid() });
            toast.success("Record added");
          }
          setOpen(false);
        }}
      />
    </div>
  );
}

function StatusPill({ status }: { status: MaintenanceStatus }) {
  const style =
    status === "Completed"
      ? "bg-success/10 text-success border-success/30"
      : status === "In Progress"
      ? "bg-warning/10 text-warning border-warning/30"
      : "bg-muted text-muted-foreground border-border";
  return (
    <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase ${style}`}>
      {status}
    </span>
  );
}

function MaintenanceDialog({
  open,
  onOpenChange,
  editing,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: MaintenanceRecord | null;
  onSave: (r: MaintenanceRecord) => void;
}) {
  const empty: MaintenanceRecord = {
    id: "",
    machineName: "",
    problem: "",
    technician: "",
    repairDetails: "",
    cost: 0,
    date: new Date().toISOString().slice(0, 10),
    status: "Open",
  };
  const [form, setForm] = useState<MaintenanceRecord>(empty);

  useEffect(() => {
    if (open) setForm(editing ?? empty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) setForm(editing ?? empty);
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit maintenance record" : "New maintenance record"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Machine name">
              <Input
                value={form.machineName}
                onChange={(e) => setForm({ ...form, machineName: e.target.value })}
              />
            </Field>
            <Field label="Technician">
              <Input
                value={form.technician}
                onChange={(e) => setForm({ ...form, technician: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Problem">
            <Input
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
            />
          </Field>
          <Field label="Repair details">
            <Textarea
              rows={3}
              value={form.repairDetails}
              onChange={(e) => setForm({ ...form, repairDetails: e.target.value })}
            />
          </Field>
          <div className="grid gap-2 sm:grid-cols-3">
            <Field label="Date">
              <Input
                type="date"
                value={form.date.slice(0, 10)}
                onChange={(e) => setForm({ ...form, date: new Date(e.target.value).toISOString() })}
              />
            </Field>
            <Field label="Cost (USD)">
              <Input
                type="number"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
              />
            </Field>
            <Field label="Status">
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as MaintenanceStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!form.machineName || !form.problem) {
                toast.error("Machine and problem are required");
                return;
              }
              onSave(form);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
