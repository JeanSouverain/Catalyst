import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { Section, SectionHeading, Eyebrow } from "@/components/site/section";

export const Route = createFileRoute("/case-study")({
  head: () => ({
    meta: [
      { title: "Concrete Pilot — Catalyst Case Study" },
      { name: "description", content: "How we built an AI operating system for a concrete contractor — estimating, scheduling, safety, and financials." },
      { property: "og:title", content: "Concrete Pilot — Catalyst" },
      { property: "og:description", content: "60% less paperwork. 50% faster estimating. A working AI operating system for a concrete contractor." },
    ],
  }),
  component: CaseStudyPage,
});

const modules = [
  {
    n: "01",
    title: "AI Estimating",
    body: "Customers send blueprints and measurements. AI returns a material list, concrete volume, labor hours, and a quote draft. Estimating time cut by ~50%.",
  },
  {
    n: "02",
    title: "AI Scheduling",
    body: "Crew availability, weather, and project timelines feed a model that produces a daily schedule. Subcontractors and deliveries auto-aligned.",
  },
  {
    n: "03",
    title: "AI Project Assistant",
    body: "A ChatGPT trained on the company's plans, mixes, and SOPs. Workers ask 'What mix for job #284?' and get the answer.",
  },
  {
    n: "04",
    title: "AI Safety Monitoring",
    body: "Site photos are scanned for missing PPE and fall hazards. Comparable deployments cut safety incidents by 50%+.",
  },
  {
    n: "05",
    title: "AI Business Dashboard",
    body: "Live job profitability, crew productivity, project progress, and equipment usage — one screen, mobile-first.",
  },
];

function CaseStudyPage() {
  return (
    <SiteLayout>
      <Section>
        <Eyebrow>Pilot · Concrete contractor</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-balance font-display text-5xl font-bold tracking-tight sm:text-6xl">
          A working AI operating system for a concrete company.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Phase 1 of Catalyst: a free pilot with a friend's concrete business. We built five
          modules around the three things contractors waste the most time on — estimating,
          scheduling, and paperwork.
        </p>

        <div className="mt-12 grid gap-6 rounded-3xl border border-border bg-card p-8 sm:grid-cols-3 sm:p-10">
          <Metric label="Hours/week reclaimed" value="40+" />
          <Metric label="Paperwork eliminated" value="60%" />
          <Metric label="Estimating time" value="−50%" />
        </div>
      </Section>

      <Section className="py-10">
        <SectionHeading eyebrow="The system" title="Five modules. One AI operating system." />
        <div className="mt-12 space-y-4">
          {modules.map((m) => (
            <div
              key={m.n}
              className="grid gap-6 rounded-2xl border border-border bg-card p-7 md:grid-cols-[120px_1fr]"
            >
              <div className="font-display text-5xl font-bold text-brand">{m.n}</div>
              <div>
                <h3 className="text-2xl font-semibold">{m.title}</h3>
                <p className="mt-2 text-muted-foreground">{m.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-5xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
