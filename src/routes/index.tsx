import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Metrics } from "@/components/site/Metrics";
import { System } from "@/components/site/System";
import { Features } from "@/components/site/Features";
import { Testimonial } from "@/components/site/Testimonial";
import { Pricing } from "@/components/site/Pricing";
import { FAQ } from "@/components/site/FAQ";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "LeadsUp — AI Revenue System for Modern Sales Teams" },
      {
        name: "description",
        content:
          "LeadsUp is the AI revenue infrastructure that converts leads into booked calls and customers — automatically. Replace your follow-up stack with one intelligent system.",
      },
      { property: "og:title", content: "LeadsUp — AI Revenue System" },
      {
        property: "og:description",
        content: "Turn leads into booked revenue on autopilot. AI follow-up, qualification, and booking — built like infrastructure.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Metrics />
      <System />
      <Features />
      <Testimonial />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}

