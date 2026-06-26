import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { Section, SectionHeading } from "@/components/site/section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Catalyst" },
      { name: "description", content: "Our positioning, our phased model, and why we picked the blue-collar economy as our entire focus." },
      { property: "og:title", content: "About Catalyst" },
      { property: "og:description", content: "AI operations & automation partner — built for the trades." },
    ],
  }),
  component: AboutPage,
});

const phases = [
  { n: "Phase 1", title: "Pilot", body: "Build a working AI operating system for a friendly concrete company. Free / discounted in exchange for the case study." },
  { n: "Phase 2", title: "Productized Services", body: "Audit, build, dashboards, agent systems, and monthly ops — clear packages, repeatable delivery." },
  { n: "Phase 3", title: "SaaS Layer", body: "Turn our most-used workflows into subscription software — estimating AI, contractor dashboards." },
  { n: "Phase 4", title: "Industry Platform", body: "An AI OS for Construction Companies. Subscription model, vertical-deep." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <Section>
        <SectionHeading
          eyebrow="About"
          title="We're not selling AI. We're selling outcomes for the trades."
          description="Most AI consultants say 'we build AI.' We say 'we automate construction companies.' The difference is everything."
        />
      </Section>
      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          {phases.map((p) => (
            <div key={p.n} className="rounded-2xl border border-border bg-card p-7">
              <div className="text-xs uppercase tracking-widest text-brand">{p.n}</div>
              <h3 className="mt-2 text-2xl font-semibold">{p.title}</h3>
              <p className="mt-3 text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <div className="rounded-3xl border border-border bg-foreground p-10 text-background sm:p-14">
          <h2 className="max-w-2xl text-balance font-display text-4xl font-bold sm:text-5xl">
            "We automate construction companies."
          </h2>
          <p className="mt-4 max-w-2xl text-lg opacity-80">
            That sentence is our entire positioning. It works because it's true, specific, and
            spoken in the language of the customer.
          </p>
        </div>
      </Section>
    </SiteLayout>
  );
}
