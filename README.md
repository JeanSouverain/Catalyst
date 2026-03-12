# AI Implementation Dashboard (Pilot)

This workspace contains a prototype dashboard for a construction-focused AI implementation company. It includes the following pilot modules:

- **Estimator**: upload blueprints (PDF/text/images) and see dynamic estimates based on plain-text content (parsed with `pdf-parse`).
- **Project Assistant**: upload docs and query with simple substring search across stored files.
- **Scheduler**: simple job scheduler stub that spreads jobs over days.
- **Safety Monitoring**: upload site photos and flag PPE issues (randomized stub).
- **Dashboard**: overview of estimates, documents, and case study export.
- **Integrations**: stub connectors for QuickBooks, Procore, Buildertrend.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` in your browser to explore pages.

## Testing

```bash
pnpm test
```

## File Structure

- `app/` contains Next.js routes for UI and API endpoints.
- `data/` stores persisted estimates and uploaded docs.
- `public/uploads` holds uploaded blueprint files.

The project is intentionally minimal; replace stubs with real OCR, AI models, and database logic for production.

