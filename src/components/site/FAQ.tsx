import { useState } from "react";

const faqs = [
  {
    q: "What exactly does Leads Up do?",
    a: "Leads Up is an AI revenue system that follows up with every lead instantly across SMS, email and chat — qualifying intent and booking calls directly on your calendar. It replaces your follow-up stack and operates 24/7.",
  },
  {
    q: "How is this different from a marketing agency?",
    a: "We are not an agency. Leads Up is software infrastructure. There are no media buyers, no creative reviews — just an AI revenue layer running in the background that converts leads you already paid for.",
  },
  {
    q: "How fast can we go live?",
    a: "Most teams are live in under 7 days. We connect to your CRM and calendar, train the AI on your offer and objections, then deploy across your inbound channels.",
  },
  {
    q: "What tools do you integrate with?",
    a: "Native integrations with HubSpot, Salesforce, Pipedrive, GoHighLevel, Calendly, Slack, Stripe — plus 1,000+ tools via API and webhooks.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. SOC 2, GDPR, end-to-end encryption and role-based access control. Your data stays isolated to your workspace.",
  },
  {
    q: "What if AI replies don't sound like our brand?",
    a: "Every agent is trained on your voice, tone, scripts and edge cases. You review and approve before launch, and you can fine-tune anytime.",
  },
  {
    q: "Do you offer a guarantee?",
    a: "If Leads Up doesn't increase your booked calls in the first 30 days, we keep working for free until it does.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-32 border-t border-border/60">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
            Questions, answered.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all ${
                  isOpen ? "border-primary/40 bg-gradient-card" : "border-border bg-surface/30 hover:border-border"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="text-base font-medium tracking-tight">{f.q}</span>
                  <svg
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-45 text-primary" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
