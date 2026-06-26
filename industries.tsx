import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { Section, SectionHeading } from "@/components/site/section";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries — Catalyst" },
      { name: "description", content: "AI built for blue-collar industries: concrete, construction, roofing, HVAC, landscaping, and logistics." },
      { property: "og:title", content: "Industries we serve — Catalyst" },
      { property: "og:description", content: "We specialize in AI for the trades — industries other consultants ignore." },
    ],
  }),
  component: IndustriesPage,
});

const industries = [
  { name: "Concrete", body: "Estimating, scheduling, mix tracking, crew dispatch. Our pilot industry." },
  { name: "Construction", body: "Project documents, change orders, RFI triage, safety reporting." },
  { name: "Roofing", body: "Drone photo intake, square calculation, quote generation, lead routing." },
  { name: "HVAC", body: "Service dispatch, parts forecasting, predictive maintenance, technician copilot." },
  { name: "Landscaping", body: "Route optimization, seasonal scheduling, recurring-job billing automation." },
  { name: "Logistics", body: "Load planning, ETA prediction, driver paperwork, claims automation." },
];

function IndustriesPage() {
  return (
    <SiteLayout>
      <Section>
        <SectionHeading
          eyebrow="Industries"
          title="AI for the trades, not for tech bros"
          description="The blue-collar economy is massively underserved by AI consultancies. We made it our entire focus."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <div key={i.name} className="rounded-2xl border border-border bg-card p-7">
              <h3 className="font-display text-2xl font-bold">{i.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{i.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
