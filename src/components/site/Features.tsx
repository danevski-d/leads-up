const features = [
  {
    title: "AI follow-up that never sleeps",
    desc: "Conversational agents trained on your offer respond instantly across every channel — including the 80% of leads humans never reach.",
    icon: (
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
    ),
  },
  {
    title: "Booked calls, not busy work",
    desc: "Every qualified conversation auto-converts into a calendar booking with reminders, confirmations, and re-engagement built in.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
  },
  {
    title: "Revenue-grade analytics",
    desc: "Every touchpoint, reply, and booking tied back to pipeline impact. Know exactly what's working — and scale it.",
    icon: <path d="M3 3v18h18M7 14l4-4 4 4 5-5" />,
  },
  {
    title: "Plug into your stack",
    desc: "Native integrations with HubSpot, Salesforce, Pipedrive, GHL, Calendly, Slack, Stripe — and 1,000+ via API.",
    icon: <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
  },
  {
    title: "Trained on your brand",
    desc: "Voice, tone, objections, edge cases — your AI agent operates with the precision of your best closer.",
    icon: <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />,
  },
  {
    title: "Enterprise-ready",
    desc: "SOC 2, GDPR, end-to-end encryption, role-based access. Built for teams who can't afford to play.",
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Platform</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
            Built like infrastructure.<br />Used like magic.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 rounded-2xl overflow-hidden">
          {features.map((f) => (
            <div key={f.title} className="group bg-background p-8 hover:bg-surface transition-colors">
              <div className="h-10 w-10 rounded-lg bg-gradient-brand/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:shadow-glow transition-all">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-base font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
