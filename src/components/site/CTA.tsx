export function CTA() {
  return (
    <section id="cta" className="relative py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-card p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-gradient-radial opacity-60 pointer-events-none" />
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-gradient leading-[1.05]">
              Stop losing leads.<br />
              <span className="text-gradient-brand">Start compounding revenue.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              See exactly how Leads Up would convert your pipeline. 30 minutes, no pitch.
            </p>
            <a
              href="#"
              className="mt-10 inline-flex h-12 items-center justify-center px-8 rounded-xl bg-gradient-brand text-primary-foreground font-medium shadow-glow hover:scale-[1.02] transition-transform"
            >
              Book your strategy call
              <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <p className="mt-4 text-xs text-muted-foreground">No credit card · No commitment · Real revenue audit</p>
          </div>
        </div>
      </div>
    </section>
  );
}
