Pilot Wireframes — Routes & UI sketches

Routes (pilot)
- `/estimator` — Estimator upload + results
- `/assistant` — Project Assistant chat
- `/scheduler` — Scheduler UI (jobs, crew, calendar)
- `/safety` — Safety monitoring (image uploads, flagged list)
- `/dashboard` — Business dashboard (KPIs + links)

Estimator UI (high level)
- Top: Upload area (PDF / JPG / TIFF) + sample templates
- Middle: Parsed results (materials table, volume, labor hours)
- Right: Actions: Edit quantities, regenerate quote, export PDF
- Bottom: History list (previous estimates)

Assistant UI
- Left: Project selector (choose project/docs)
- Main: Chat window with query input, answer cards with source links
- Right: Quick actions (create ticket, attach doc, escalate)

Scheduler UI
- Left: Job list + filters
- Main: Timeline/calendar with draggable assignments
- Right: Crew pool and constraints (availability, skills)

Safety Monitoring
- Upload batch images → Grid view with flagged thumbnails
- Each image opens a detail view with detected issues and confidence scores

Dashboard
- Top KPI cards: Job profitability, Admin hours saved, Avg. estimate time
- Charts: profitability over time, crew utilization
- Links to estimator/scheduler outputs and case-study export

Component breakdown (suggested)
- `EstimatorUpload`, `EstimatorResults`, `AssistantChat`, `SchedulerCalendar`, `SafetyGrid`, `DashboardKPIs`.

Design notes
- Keep UI minimal; mobile-friendly but target desktop for planners.
- Use existing Next.js app structure; add routes under `app/` matching above paths.
