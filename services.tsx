import { createFileRoute } from "@tanstack/react-router";
import { Bot, Brain, Database, MessageSquare, Plug, TrendingUp, Workflow } from "lucide-react";
import { SiteLayout } from "@/components/site/layout";
import { Section, SectionHeading } from "@/components/site/section";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Catalyst AI Operations" },
      { name: "description", content: "From AI opportunity audits to custom agents and predictive analytics — seven services to automate your trades business." },
      { property: "og:title", content: "Services — Catalyst" },
      { property: "og:description", content: "AI audits, workflow automation, custom agents, dashboards, and integrations for blue-collar industries." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Brain, title: "AI Opportunity Assessment", body: "We audit your operations, find the automations with the highest ROI, and deliver a 90-day roadmap." },
  { icon: Workflow, title: "Workflow Automation", body: "Emails, scheduling, reporting, documentation, invoices — connected and running themselves." },
  { icon: Bot, title: "Custom AI Agents", body: "Estimating agent, safety agent, document agent, accounting agent — built around your playbook." },
  { icon: Database, title: "Data Infrastructure", body: "Centralized databases, dashboards, and pipelines so your decisions stop running on guesswork." },
  { icon: Plug, title: "AI Integrations", body: "Wire AI into Procore, QuickBooks, Buildertrend, your CRM, and your inbox — without breaking what works." },
  { icon: MessageSquare, title: "AI Chatbots", body: "Internal employee assistant trained on your SOPs. External lead bot that qualifies in 30 seconds." },
  { icon: TrendingUp, title: "Predictive Analytics", body: "Forecast cost overruns, schedule delays, and equipment maintenance before they hit your margin." },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <Section>
        <SectionHeading
          eyebrow="Services"
          title="Seven ways we plug AI into your operations"
          description="We don't ship generic chatbots. Each engagement starts by mapping your jobsite reality and ends with software your crew actually opens."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {services.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-foreground text-background">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
