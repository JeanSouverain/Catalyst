import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteLayout } from "@/components/site/layout";
import { Section, SectionHeading } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Catalyst Packages" },
      { name: "description", content: "Audit, build, dashboards, agents, and monthly ops. Clear pricing for AI implementation in the trades." },
      { property: "og:title", content: "Catalyst Pricing" },
      { property: "og:description", content: "Productized AI packages from $2k audits to $40k agent systems and monthly retainers." },
    ],
  }),
  component: PricingPage,
});

const packages = [
  {
    name: "AI Readiness Audit",
    price: "$2,000",
    cadence: "one-time",
    summary: "We map your workflows and deliver a prioritized AI opportunity report.",
    includes: ["2 workshops with your team", "Workflow audit", "ROI scorecard", "90-day roadmap"],
  },
  {
    name: "AI Automation Build",
    price: "$5k – $20k",
    cadence: "per project",
    summary: "End-to-end automation of a specific workflow — estimating, scheduling, or reporting.",
    includes: ["Discovery + design", "Build + integrate", "Training for your team", "30 days of tuning"],
    featured: true,
  },
  {
    name: "AI Data Dashboards",
    price: "$3k – $10k",
    cadence: "per project",
    summary: "KPI dashboards wired to your jobs, crews, and finances. Live, not weekly PDFs.",
    includes: ["Source integrations", "Dashboard build", "Mobile-first views", "Quarterly tune-up"],
  },
  {
    name: "AI Agent Systems",
    price: "$10k – $40k",
    cadence: "per project",
    summary: "Multi-step AI agents — your estimating, safety, or document team, on call 24/7.",
    includes: ["Custom agent design", "Knowledge base setup", "API + tool wiring", "Eval + guardrails"],
  },
  {
    name: "Monthly AI Ops",
    price: "$1k – $5k",
    cadence: "per month",
    summary: "Ongoing support — new automations, tuning, monitoring, and model updates.",
    includes: ["Priority support", "New automation credits", "Monitoring + alerts", "Quarterly review"],
  },
];

function PricingPage() {
  return (
    <SiteLayout>
      <Section>
        <SectionHeading
          eyebrow="Pricing"
          title="Productized packages, no consulting-hours mystery"
          description="Pick a starting point. Most engagements begin with the Readiness Audit and grow from there."
          align="center"
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {packages.map((p) => (
            <div
              key={p.name}
              className={cn(
                "flex flex-col rounded-2xl border bg-card p-7",
                p.featured
                  ? "border-brand bg-[linear-gradient(180deg,oklch(0.62_0.18_250_/_0.05),transparent)] shadow-[var(--shadow-lift)] lg:scale-[1.02]"
                  : "border-border shadow-[var(--shadow-soft)]",
              )}
            >
              {p.featured && (
                <span className="mb-3 inline-flex w-fit rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.cadence}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.summary}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {p.includes.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-brand" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant={p.featured ? "default" : "outline"} className="mt-6 rounded-full">
                <Link to="/contact">Get started</Link>
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Year 1 customers typically spend $8k–$12k. Year 3 customers run on the monthly retainer.
        </p>
      </Section>
    </SiteLayout>
  );
}
