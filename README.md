# AI Implementation Dashboard (Pilot)

This workspace contains a prototype dashboard for a construction-focused AI implementation company. It includes the following pilot modules:

- **Estimator**: upload blueprints (PDF/text/images) and see dynamic estimates based on plain-text content (parsed with `pdf-parse`).
- **Project Assistant**: upload docs and query with simple substring search across stored files.
- **Scheduler**: simple job scheduler stub that spreads jobs over days.
- **Safety Monitoring**: upload site photos and flag PPE issues (randomized stub).
- **Dashboard**: overview of estimates, documents, and case study export.
- **Integrations**: stub connectors for QuickBooks, Procore, Buildertrend.

## Database Setup

1. **Install PostgreSQL**
   - Download and install PostgreSQL from https://www.postgresql.org/
   - Or use a cloud service like Vercel Postgres, Neon, or Supabase

2. **Configure Database Connection**
   - Copy `.env.example` to `.env.local`
   - Update `POSTGRES_URL` with your PostgreSQL connection string
   - Example: `postgresql://username:password@localhost:5432/your_database_name`

3. **Create Database Tables**
   ```bash
   pnpm seed
   ```

   This will create the necessary tables and insert sample data.

## Authentication

The app includes a complete authentication system:

- **Login**: `/login` - Sign in with existing account
- **Registration**: `/register` - Create new account
- **Protected Routes**: Dashboard requires authentication
- **Default Admin Account**:
  - Email: `admin@example.com`
  - Password: `admin123`

## Features

- **Dashboard**: Overview with key metrics, revenue chart, and latest invoices
- **Invoices**: View, search, and manage invoices with pagination
- **Customers**: Customer management with invoice summaries
- **Job Scheduling**: Basic job scheduler (in development)
- **Estimator**: PDF processing and cost estimation
- **Safety Monitoring**: Image analysis for PPE compliance

## Getting Started

```bash
pnpm install
# Set up database (see Database Setup section)
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

