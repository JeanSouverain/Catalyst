Pilot MVP Backlog — Concrete Company

Priority order (1 = highest)

1. Estimator (MVP)
   - User story: As an estimator, I upload blueprints/measurements and get a draft quote with materials, concrete volume, labor hours.
   - Acceptance: Upload PDF/image → OCR/parsing → outputs material list + volume + labor hours + downloadable quote PDF.
   - Notes: Use OCR, simple RAG for reference specs, persist results in Postgres + vector DB for docs.

2. Document Assistant (Project Assistant)
   - User story: As an employee, I can ask natural-language questions about project documents and get sourced answers.
   - Acceptance: Query returns an answer with source links (doc name + page) within 3s for common queries.
   - Notes: Implement RAG with embeddings and a lightweight chat UI.

3. Scheduler (Basic)
   - User story: As a planner, I provide jobs, crew availability and constraints and get a proposed schedule.
   - Acceptance: Create/modify job entries and generate a schedule draft; export CSV of assignments.

4. Dashboard (Pilot KPIs)
   - User story: As an owner, I can view job profitability, project progress, and admin time saved estimates.
   - Acceptance: Dashboard shows at least 3 KPIs and links to estimator/scheduler outputs.

5. Safety Monitoring (P0 minimal)
   - User story: Upload site photos to run PPE checks and return flagged images.
   - Acceptance: Run basic PPE classifier on images and show flags in UI.

6. Integrations & Data Infra (parallel)
   - Tasks: Postgres schema, vector DB setup (Pinecone/Chroma), ETL for document ingestion, small API (FastAPI/Express).

7. Pilot Deliverables
   - Internal deployment to friend’s company, measurement dashboard, time-savings report, and a case study PDF.

Estimates: target 8–12 weeks for a small team (1 FE, 1 BE, 1 ML/AI engineer) to deliver MVP plus pilot measurement.
