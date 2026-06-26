import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/layout";
import { Section, SectionHeading } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitLead } from "@/lib/leads.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Catalyst" },
      { name: "description", content: "Tell us about your business. We'll get back within one business day to schedule your free AI readiness audit." },
      { property: "og:title", content: "Contact Catalyst" },
      { property: "og:description", content: "Book a free AI readiness audit for your trades business." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const submit = useServerFn(submitLead);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await submit({
        data: {
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          company: String(fd.get("company") || ""),
          industry: String(fd.get("industry") || ""),
          message: String(fd.get("message") || ""),
        },
      });
      setDone(true);
      toast.success("Thanks — we'll be in touch within one business day.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Book your free AI readiness audit"
              description="Tell us about your business. We respond within one business day."
            />
            <div className="mt-10 space-y-6 text-sm">
              <InfoRow label="What you get">
                A 45-minute call, a workflow audit, and a prioritized AI opportunity report.
              </InfoRow>
              <InfoRow label="Who it's for">
                Concrete, construction, roofing, HVAC, landscaping, and logistics businesses with
                10+ employees.
              </InfoRow>
              <InfoRow label="Investment">
                The audit is free for businesses in our target industries.
              </InfoRow>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] sm:p-10">
            {done ? (
              <div className="py-10 text-center">
                <h3 className="font-display text-2xl font-bold">Got it.</h3>
                <p className="mt-2 text-muted-foreground">
                  We'll be in touch within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <Field id="name" label="Your name" required />
                <Field id="email" label="Work email" type="email" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="company" label="Company" />
                  <Field id="industry" label="Industry" placeholder="e.g. Concrete" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">What are you trying to fix?</Label>
                  <Textarea id="message" name="message" rows={5} required maxLength={2000} />
                </div>
                <Button type="submit" size="lg" disabled={submitting} className="w-full rounded-full">
                  {submitting ? "Sending…" : "Request my audit"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  placeholder,
}: { id: string; label: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}{required && " *"}</Label>
      <Input id={id} name={id} type={type} required={required} placeholder={placeholder} maxLength={255} />
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-brand">{label}</div>
      <p className="mt-1 text-muted-foreground">{children}</p>
    </div>
  );
}
