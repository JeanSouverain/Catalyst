import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Calendar, FileText, HardHat, LineChart, Shield } from "lucide-react";
import { SiteLayout } from "@/components/site/layout";
import { Section, SectionHeading, Eyebrow } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catalyst — We automate construction companies with AI" },
      { name: "description", content: "Catalyst is an AI operations partner for concrete, construction, HVAC, and other trades. We replace paperwork with workflows that actually work on the jobsite." },
      { property: "og:title", content: "Catalyst — AI Operations for the Trades" },
      { property: "og:description", content: "We don't sell AI tools. We embed AI into your operations — estimating, scheduling, safety, and accounting." },
    ],
  }),
  component: Home,
});

const industries = ["Concrete", "Construction", "Roofing", "HVAC", "Landscaping", "Logistics"];

const valueProps = [
  { icon: FileText, title: "Estimating AI", body: "Turn blueprints into quotes in minutes instead of hours." },
  { icon: Calendar, title: "Scheduling AI", body: "Crew, weather, and timeline aware schedules generated automatically." },
  { icon: Brain, title: "Project Assistant", body: "A ChatGPT trained on your company documents and SOPs." },
  { icon: Shield, title: "Safety Monitoring", body: "AI reviews site photos for PPE compliance and fall hazards." },
  { icon: LineChart, title: "Financial Dashboard", body: "Live job profitability, crew productivity, equipment use." },
  { icon: HardHat, title: "Crew Assistant", body: "Workers ask plain questions, get the answer from your playbook." },
];

function Home() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mesh-bg absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-32">
          <div className="space-y-7">
            <Eyebrow>AI Operations Partner</Eyebrow>
            <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              We automate{" "}
              <span className="text-gradient-brand">construction companies</span>.
            </h1>
            <p className="max-w-xl text-pretty text-lg text-muted-foreground">
              Most companies don't need AI models. They need someone to integrate AI into their
              operations. Catalyst is that partner — built for the trades, deployed on the jobsite.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/contact">
                  Book a free AI readiness audit <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/case-study">See the concrete pilot</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              60% less paperwork. 50% faster estimating. Field-tested.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-lift)]">
              <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live job — Driveway pour #284
              </div>
              <div className="space-y-3 font-mono text-sm">
                <CodeLine k="Concrete volume" v="38.4 yd³" />
                <CodeLine k="Mix" v="4000 PSI, 0.45 w/c" />
                <CodeLine k="Crew" v="5 · ETA 6:30 AM" />
                <CodeLine k="Weather risk" v="Low (12% rain)" />
                <CodeLine k="Quote" v="$12,840" highlight />
                <CodeLine k="Margin" v="31.2%" />
              </div>
              <div className="mt-5 rounded-xl bg-muted/60 p-4 text-sm">
                <p className="font-medium">AI suggestion</p>
                <p className="text-muted-foreground">
                  Move pour to 7 AM — temperature curve improves slump and saves ~$340 in
                  retarder.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries strip */}
      <div className="border-y border-border bg-muted/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Built for</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 font-display text-sm font-medium">
            {industries.map((i) => (
              <li key={i} className="text-foreground">
                {i}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Value props */}
      <Section>
        <SectionHeading
          eyebrow="What we build"
          title="An AI operating system for your company"
          description="Five practical modules that wipe out the busywork swallowing your week."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[var(--gradient-brand)] text-brand-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Stats */}
      <Section className="py-16">
        <div className="grid gap-8 rounded-3xl border border-border bg-[var(--gradient-brand)] p-10 text-brand-foreground sm:grid-cols-3">
          <Stat n="60%" l="Paperwork eliminated" />
          <Stat n="50%" l="Faster estimating" />
          <Stat n="2x" l="More jobs quoted per week" />
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-[var(--shadow-soft)] sm:p-16">
          <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Ready to see where AI fits your business?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            A 45-minute audit. We map your workflows, identify the top three automations, and send
            you a roadmap.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full">
            <Link to="/contact">
              Book your audit <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}

function CodeLine({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-border/60 pb-2 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className={highlight ? "font-bold text-brand" : "text-foreground"}>{v}</span>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-5xl font-bold">{n}</div>
      <div className="mt-1 text-sm opacity-90">{l}</div>
    </div>
  );
}
