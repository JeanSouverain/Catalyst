import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus, Brain, Calendar, Shield, LineChart, FileText } from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { listIntakes } from "@/lib/intake.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Catalyst" }] }),
  component: Dashboard,
});

const modules = [
  { icon: FileText, name: "Estimating AI", status: "Coming soon" },
  { icon: Calendar, name: "Scheduling AI", status: "Coming soon" },
  { icon: Brain, name: "Project Assistant", status: "Coming soon" },
  { icon: Shield, name: "Safety Monitoring", status: "Coming soon" },
  { icon: LineChart, name: "Financial Dashboard", status: "Coming soon" },
];

function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchIntakes = useServerFn(listIntakes);
  const { data: intakes = [] } = useQuery({
    queryKey: ["intakes"],
    queryFn: () => fetchIntakes(),
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight">Client portal</h1>
            <p className="mt-1 text-muted-foreground">Your AI operations workspace.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="rounded-full">
              <Link to="/intake">
                <Plus className="mr-1 h-4 w-4" /> New intake
              </Link>
            </Button>
            <Button onClick={signOut} variant="outline" className="rounded-full">
              <LogOut className="mr-1 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>

        <h2 className="mt-12 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          AI modules
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div key={m.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background">
                <m.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{m.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{m.status}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Your intakes
        </h2>
        {intakes.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">No intakes yet.</p>
            <Button asChild className="mt-4 rounded-full">
              <Link to="/intake">Start your AI readiness intake</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {intakes.map((i) => (
              <div key={i.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold">{i.company}</div>
                    <div className="text-xs text-muted-foreground">
                      {i.industry} · {new Date(i.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{i.pain_points}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
