export function Testimonial() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <svg className="h-8 w-8 mx-auto text-primary mb-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2H4v2h1a4 4 0 0 0 4-4V7zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2h-1v2h1a4 4 0 0 0 4-4V7z" />
        </svg>
        <blockquote className="text-2xl md:text-3xl font-medium tracking-tight leading-snug text-gradient">
          "We replaced two SDRs and a follow-up agency with Leads Up. Booked calls went up 312% in the first 60 days — and our team finally stopped chasing cold leads."
        </blockquote>
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-brand" />
          <div className="text-left">
            <div className="text-sm font-medium">Marcus Reyes</div>
            <div className="text-xs text-muted-foreground">VP Revenue, Northwind Capital</div>
          </div>
        </div>
      </div>
    </section>
  );
}
