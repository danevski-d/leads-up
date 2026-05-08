const plans = [
  {
    name: "Growth",
    price: "$2,400",
    desc: "For teams scaling inbound to 500+ leads/mo.",
    features: ["AI follow-up across SMS + email", "Up to 1,500 leads / month", "Calendar + CRM integration", "Standard support"],
    cta: "Start with Growth",
  },
  {
    name: "Scale",
    price: "$4,900",
    desc: "Full revenue infrastructure for 7–8 figure operators.",
    features: ["Everything in Growth", "Unlimited leads", "Custom AI training on your offer", "Dedicated revenue strategist", "Priority + Slack support"],
    cta: "Book strategy call",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For multi-brand operators and high-volume sales orgs.",
    features: ["Custom integrations & SLAs", "SOC 2 + dedicated infra", "White-glove onboarding", "Quarterly business reviews"],
    cta: "Talk to sales",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
            Priced like a system.<br />Pays for itself in week one.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative p-8 rounded-2xl border transition-all ${
                p.featured
                  ? "border-primary/50 bg-gradient-card shadow-glow"
                  : "border-border bg-surface/30 hover:border-border"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-8 text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-brand text-primary-foreground">
                  Most popular
                </div>
              )}
              <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
                {p.price !== "Custom" && <span className="text-sm text-muted-foreground">/mo</span>}
              </div>
              <a
                href="#cta"
                className={`mt-6 inline-flex w-full h-11 items-center justify-center rounded-xl text-sm font-medium transition-all ${
                  p.featured
                    ? "bg-gradient-brand text-primary-foreground hover:shadow-glow"
                    : "bg-surface border border-border hover:bg-surface-elevated"
                }`}
              >
                {p.cta}
              </a>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <svg className="h-4 w-4 mt-0.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
