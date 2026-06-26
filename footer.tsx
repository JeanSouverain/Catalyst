import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-brand)] text-brand-foreground">
              <Zap className="h-4 w-4" />
            </span>
            Catalyst
          </div>
          <p className="text-sm text-muted-foreground">
            AI operations & automation for the trades.
          </p>
        </div>
        <FooterCol
          title="Product"
          links={[
            { to: "/services", label: "Services" },
            { to: "/pricing", label: "Pricing" },
            { to: "/case-study", label: "Case Study" },
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            { to: "/about", label: "About" },
            { to: "/industries", label: "Industries" },
            { to: "/contact", label: "Contact" },
          ]}
        />
        <FooterCol
          title="Account"
          links={[
            { to: "/auth", label: "Sign in" },
            { to: "/dashboard", label: "Client portal" },
          ]}
        />
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Catalyst AI Operations. All rights reserved.</p>
          <p>Built for blue-collar industries.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-foreground">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
