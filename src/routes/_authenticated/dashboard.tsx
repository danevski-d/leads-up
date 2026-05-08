import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Pipeline · LeadsUp" }] }),
});

type Stage = "new" | "contacted" | "qualified" | "booked" | "won";
type Lead = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  source: string | null;
  value: number | null;
  stage: Stage;
  created_at: string;
};

const STAGES: { id: Stage; label: string; tint: string }[] = [
  { id: "new", label: "New", tint: "from-slate-400/20" },
  { id: "contacted", label: "Contacted", tint: "from-blue-400/20" },
  { id: "qualified", label: "Qualified", tint: "from-violet-400/20" },
  { id: "booked", label: "Booked", tint: "from-fuchsia-400/20" },
  { id: "won", label: "Won", tint: "from-emerald-400/20" },
];

function Dashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("id,name,email,company,source,value,stage,created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setLeads((data ?? []) as Lead[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const totals = useMemo(() => {
    const byStage: Record<Stage, { count: number; value: number }> = {
      new: { count: 0, value: 0 }, contacted: { count: 0, value: 0 },
      qualified: { count: 0, value: 0 }, booked: { count: 0, value: 0 }, won: { count: 0, value: 0 },
    };
    for (const l of leads) {
      byStage[l.stage].count++;
      byStage[l.stage].value += Number(l.value ?? 0);
    }
    const pipeline = leads.reduce((s, l) => s + Number(l.value ?? 0), 0);
    return { byStage, pipeline, total: leads.length, won: byStage.won.value };
  }, [leads]);

  const moveLead = async (id: string, stage: Stage) => {
    const prev = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage } : l)));
    const { error } = await supabase.from("leads").update({ stage }).eq("id", id);
    if (error) {
      setLeads(prev);
      toast.error(error.message);
    }
  };

  const deleteLead = async (id: string) => {
    const prev = leads;
    setLeads((ls) => ls.filter((l) => l.id !== id));
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) { setLeads(prev); toast.error(error.message); }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Revenue Pipeline</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gradient">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Track every lead from first touch to closed-won.</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="h-10 px-5 rounded-xl bg-gradient-brand text-primary-foreground font-medium shadow-glow hover:scale-[1.02] transition-transform inline-flex items-center gap-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
          New lead
        </button>
      </div>

      {/* Metrics */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Total leads" value={totals.total.toString()} />
        <Stat label="Pipeline value" value={`$${totals.pipeline.toLocaleString()}`} />
        <Stat label="Booked" value={totals.byStage.booked.count.toString()} />
        <Stat label="Closed won" value={`$${totals.won.toLocaleString()}`} accent />
      </div>

      {/* Kanban */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {STAGES.map((s) => {
          const items = leads.filter((l) => l.stage === s.id);
          return (
            <div
              key={s.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragId) { moveLead(dragId, s.id); setDragId(null); } }}
              className="rounded-2xl border border-border bg-surface/30 p-3 min-h-[300px]"
            >
              <div className={`flex items-center justify-between mb-3 px-1`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium tracking-tight">{s.label}</span>
                  <span className="text-xs text-muted-foreground bg-surface px-1.5 py-0.5 rounded">{items.length}</span>
                </div>
                <span className="text-xs text-muted-foreground">${totals.byStage[s.id].value.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                {items.map((l) => (
                  <div
                    key={l.id}
                    draggable
                    onDragStart={() => setDragId(l.id)}
                    className="group rounded-xl border border-border bg-gradient-card p-3 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium tracking-tight truncate">{l.name}</div>
                        {l.company && <div className="text-xs text-muted-foreground truncate">{l.company}</div>}
                      </div>
                      <button
                        onClick={() => deleteLead(l.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        aria-label="Delete"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                      </button>
                    </div>
                    {(l.value ?? 0) > 0 && (
                      <div className="mt-2 text-xs font-mono text-primary">${Number(l.value).toLocaleString()}</div>
                    )}
                    {l.source && (
                      <div className="mt-2 inline-flex items-center text-[10px] uppercase tracking-wider text-muted-foreground bg-surface/60 border border-border rounded px-1.5 py-0.5">{l.source}</div>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {STAGES.filter((x) => x.id !== l.stage).map((x) => (
                        <button
                          key={x.id}
                          onClick={() => moveLead(l.id, x.id)}
                          className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                        >
                          → {x.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {items.length === 0 && !loading && (
                  <div className="text-xs text-muted-foreground/60 text-center py-8 border border-dashed border-border/60 rounded-xl">
                    Drop leads here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showNew && <NewLeadModal onClose={() => setShowNew(false)} onCreated={(l) => { setLeads((ls) => [l, ...ls]); setShowNew(false); }} userId={user!.id} />}
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-primary/40 bg-gradient-card shadow-glow" : "border-border bg-surface/30"}`}>
      <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</div>
      <div className={`mt-2 text-2xl font-semibold tracking-tight ${accent ? "text-gradient-brand" : ""}`}>{value}</div>
    </div>
  );
}

function NewLeadModal({ onClose, onCreated, userId }: { onClose: () => void; onCreated: (l: Lead) => void; userId: string }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", source: "", value: "", stage: "new" as Stage });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase
      .from("leads")
      .insert({
        user_id: userId,
        name: form.name,
        email: form.email || null,
        company: form.company || null,
        source: form.source || null,
        value: form.value ? Number(form.value) : 0,
        stage: form.stage,
      })
      .select("id,name,email,company,source,value,stage,created_at")
      .single();
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Lead added");
    onCreated(data as Lead);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-border bg-gradient-card p-6 shadow-elevated"
      >
        <h2 className="text-lg font-semibold tracking-tight text-gradient">New lead</h2>
        <p className="text-sm text-muted-foreground mt-1">Add a new lead to your pipeline.</p>
        <div className="mt-5 space-y-3">
          <Field label="Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source" value={form.source} onChange={(v) => setForm({ ...form, source: v })} placeholder="Website, Ads…" />
            <Field label="Value ($)" type="number" value={form.value} onChange={(v) => setForm({ ...form, value: v })} />
          </div>
          <label className="block">
            <div className="text-xs text-muted-foreground mb-1.5">Stage</div>
            <select
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value as Stage })}
              className="w-full h-10 px-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-primary/60"
            >
              {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-6 flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="h-10 px-4 rounded-xl border border-border text-sm hover:bg-surface transition-colors">Cancel</button>
          <button type="submit" disabled={busy} className="h-10 px-5 rounded-xl bg-gradient-brand text-primary-foreground text-sm font-medium shadow-glow disabled:opacity-60">
            {busy ? "Adding…" : "Add lead"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <div className="text-xs text-muted-foreground mb-1.5">{label}</div>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-primary/60"
      />
    </label>
  );
}
