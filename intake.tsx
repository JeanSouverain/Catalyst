import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitIntake } from "@/lib/intake.functions";

export const Route = createFileRoute("/_authenticated/intake")({
  head: () => ({ meta: [{ title: "AI Readiness Intake — Catalyst" }] }),
  component: IntakePage,
});

function IntakePage() {
  const navigate = useNavigate();
  const submit = useServerFn(submitIntake);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await submit({
        data: {
          company: String(fd.get("company") || ""),
          industry: String(fd.get("industry") || ""),
          team_size: String(fd.get("team_size") || ""),
          current_tools: String(fd.get("current_tools") || ""),
          pain_points: String(fd.get("pain_points") || ""),
          goals: String(fd.get("goals") || ""),
        },
      });
      toast.success("Intake saved. We'll review and follow up.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">AI Readiness Intake</h1>
        <p className="mt-2 text-muted-foreground">
          A few questions so our team can prepare a tailored audit.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-5 rounded-3xl border border-border bg-card p-7 sm:p-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="company" label="Company name" required />
            <Field id="industry" label="Industry" required placeholder="Concrete, HVAC…" />
          </div>
          <Field id="team_size" label="Team size" placeholder="e.g. 25 field + 4 office" />
          <TArea id="current_tools" label="Tools you currently use" placeholder="QuickBooks, Procore, Excel…" />
          <TArea id="pain_points" label="Where do you waste the most time?" required />
          <TArea id="goals" label="What would success look like in 90 days?" required />
          <Button type="submit" size="lg" disabled={loading} className="w-full rounded-full">
            {loading ? "Saving…" : "Submit intake"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function Field({ id, label, required, placeholder }: { id: string; label: string; required?: boolean; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}{required && " *"}</Label>
      <Input id={id} name={id} required={required} placeholder={placeholder} maxLength={150} />
    </div>
  );
}

function TArea({ id, label, required, placeholder }: { id: string; label: string; required?: boolean; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}{required && " *"}</Label>
      <Textarea id={id} name={id} required={required} placeholder={placeholder} rows={4} maxLength={2000} />
    </div>
  );
}
