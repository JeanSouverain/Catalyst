## Catalyst — AI Implementation Partner for Blue-Collar Industries

Replace the current Bloom Valley nursery project with a clean-tech marketing site plus a client portal for Catalyst, an AI implementation & workflow automation company specialized in trades (concrete, construction, HVAC, roofing, landscaping, logistics).

### What gets built

**Public marketing site (TanStack Start file routes)**
- `/` — Hero ("We automate construction companies"), value prop, industries strip, social proof slot, CTA to book an AI Readiness Audit.
- `/services` — The 7 core services from the doc: AI Opportunity Assessment, Workflow Automation, Custom AI Agents, Data Infrastructure, AI Integrations, AI Chatbots, Predictive Analytics.
- `/pricing` — 5 packages from the doc: AI Readiness Audit ($2k), AI Automation Build ($5–20k), AI Data Dashboards ($3–10k), AI Agent Systems ($10–40k), Monthly AI Ops ($1–5k/mo).
- `/industries` — Concrete, Construction, Roofing, HVAC, Landscaping, Logistics.
- `/case-study` — Concrete pilot: Estimating AI, Scheduling AI, Project Assistant, Safety Monitoring, Financial Dashboard, with the "eliminate 60% of paperwork" pitch.
- `/about` — Positioning ("AI Operations & Automation Partner"), phased model (Pilot → Productized → SaaS → Industry Platform).
- `/contact` — Lead form (name, company, industry, problem) → stored in Lovable Cloud.
- Per-route SEO `head()` with unique title/description/OG.

**Client portal (auth-gated)**
- `/auth` — Email/password + Google sign-in.
- `/_authenticated/dashboard` — Placeholder shell with cards for the future AI modules (Estimating, Scheduling, Project Assistant, Safety, Financials). Shows the signed-in user's submitted intake info.
- `/_authenticated/intake` — AI Readiness Audit intake form (multi-step: company info, current workflows, pain points, goals). Saved per user.

### Backend (Lovable Cloud)

Tables (all with RLS + grants):
- `profiles` — auto-created on signup (user_id, full_name, company, role).
- `leads` — public contact form submissions (anon insert allowed, admin read only).
- `audit_intakes` — authenticated users' intake submissions (owner-only CRUD).
- `user_roles` + `app_role` enum + `has_role()` security-definer fn — for future admin views.

Auth: email/password + Google (via Lovable broker).

### Design direction — Clean Tech

- Palette: `#FFFFFF` background, `#0F172A` ink, `#3B82F6` primary, `#E2E8F0` surfaces, plus a `#0EA5E9` accent for gradients.
- Type: Space Grotesk (display) + Inter (body) via @fontsource packages.
- Layout: generous whitespace, large editorial headlines, asymmetric hero with a subtle gradient mesh, clean card grids for services/pricing, soft shadows, rounded-2xl, framer-motion fade/slide on section enter.
- Voice: confident, plainspoken, blue-collar-respectful ("We automate construction companies"). No purple gradients, no generic AI clip-art.

### Technical notes (TanStack Start)

- One route file per page under `src/routes/` (no hash-anchor SPA).
- Reusable: `<SiteHeader/>`, `<SiteFooter/>`, `<SectionHeading/>`, `<PricingCard/>`, `<ServiceCard/>`, `<IndustryBadge/>`.
- `_authenticated/route.tsx` is integration-managed (don't author).
- Lead form `POST` → `createServerFn` with Zod validation, inserts into `leads` via server publishable client (narrow anon insert policy).
- Intake form → `createServerFn` with `requireSupabaseAuth` middleware, writes to `audit_intakes`.
- `home.html` and other static files from the previous nursery build are removed from `public/`.

### Out of scope (for this first pass)

- Real AI estimating/scheduling tools (dashboard is a placeholder shell only).
- Admin console, billing, Stripe.
- Blog/CMS.

Tell me to proceed and I'll switch to build mode and ship it.