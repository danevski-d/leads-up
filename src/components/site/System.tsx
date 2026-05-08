const steps = [
  {
    n: "01",
    title: "Capture",
    desc: "Every form, ad, DM, and inbound source is unified into one revenue stream — instantly enriched and scored.",
  },
  {
    n: "02",
    title: "Engage",
    desc: "AI agents reply in under 60 seconds across SMS, email, and chat — with brand-perfect tone and full context.",
  },
  {
    n: "03",
    title: "Qualify",
    desc: "Multi-turn conversations qualify intent, budget, and timing — then hand off only sales-ready leads.",
  },
  {
    n: "04",
    title: "Book",
    desc: "Calls land directly on your calendar. Reminders, reschedules, and no-show recovery run automatically.",
  },
];

export function System() {
  return (
    <section id="system" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">The System</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
            A single revenue layer.<br />
            Replacing your entire follow-up stack.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            LeadsUp connects to your existing tools and runs your pipeline like a top-performing SDR team — at 1/10th the cost.
          </p>
        </div>

        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group relative p-7 rounded-2xl border border-border bg-gradient-card hover:border-primary/40 transition-all duration-300"
            >
              <div className="text-xs font-mono text-primary mb-8">{s.n}</div>
              <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
