import { IntegrationHub } from "./IntegrationHub";

export function Hero() {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/50 text-xs text-muted-foreground mb-8 opacity-0"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "0.05s" }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          AI Revenue System · Now booking Q2 deployments
        </div>

        <h1
          className="text-5xl md:text-7xl font-semibold tracking-[-0.04em] leading-[1.05] text-gradient opacity-0"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "0.15s" }}
        >
          Turn leads into <br />
          <span className="text-gradient-brand">booked revenue</span>—on autopilot.
        </h1>

        <p
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-0"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "0.3s" }}
        >
          Leads Up is the AI revenue infrastructure that follows up, qualifies, and converts every lead into booked calls and paying customers — without human ops.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 opacity-0"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "0.45s" }}
        >
          <a
            href="#cta"
            className="group relative inline-flex h-12 items-center justify-center px-7 rounded-xl bg-gradient-brand text-primary-foreground font-medium shadow-glow hover:shadow-elevated transition-all"
          >
            Book a strategy call
            <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#system"
            className="inline-flex h-12 items-center justify-center px-6 rounded-xl border border-border bg-surface/40 hover:bg-surface transition-colors text-sm font-medium"
          >
            See how it works
          </a>
        </div>

        {/* Integration hub visual */}
        <div
          className="mt-16 opacity-0"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "0.6s" }}
        >
          <IntegrationHub />
        </div>

        <div
          className="mt-12 opacity-0"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "0.75s" }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 mb-6">Trusted by revenue teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
            {["NORTHWIND", "ACME", "LINEARLY", "QUANTUM", "PARALLAX", "VERTEX"].map((n) => (
              <span key={n} className="text-sm font-semibold tracking-[0.2em] text-muted-foreground">{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
