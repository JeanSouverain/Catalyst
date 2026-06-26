import { Link } from "@tanstack/react-router";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/industries", label: "Industries" },
  { to: "/case-study", label: "Case Study" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-lift)]">
            <Zap className="h-4 w-4" />
          </span>
          Catalyst
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/contact">Book audit</Link>
          </Button>
        </div>
        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="space-y-1 px-4 py-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 pt-2">
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-md border border-border px-3 py-2 text-center text-sm font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-md bg-foreground px-3 py-2 text-center text-sm font-medium text-background"
              >
                Book audit
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
