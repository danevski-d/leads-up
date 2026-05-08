const metrics = [
  { value: "3.4x", label: "More booked calls", sub: "vs. manual follow-up" },
  { value: "<60s", label: "Lead response time", sub: "24/7, every channel" },
  { value: "92%", label: "Reply rate lift", sub: "AI-personalized" },
  { value: "$1.2M+", label: "Pipeline generated", sub: "in last 90 days" },
];

export function Metrics() {
  return (
    <section id="results" className="relative py-24 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/60 rounded-2xl overflow-hidden">
          {metrics.map((m) => (
            <div key={m.label} className="bg-background p-8 md:p-10">
              <div className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient-brand">{m.value}</div>
              <div className="mt-3 text-sm font-medium">{m.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
