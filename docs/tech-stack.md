# Tech Stack & Improvements

## Current Stack
- **Frontend:** React 18 (Create React App), react-router-dom v6, Chart.js, react-markdown
- **Backend:** FastAPI (Python 3.11) with Uvicorn, SQLAlchemy + SQLite
- **Services:** Gateway (8000), Projects (8001), Features (8002)
- **Data:** GitHub API scraping, static JSON fallback

## Proposed Additions

### 1. Interactive Charts (Frontend)
**Status:** ⬜ Not started
**Why:** Replace static notebook images with live, filterable charts using Chart.js (already installed).

| Feature | Lib | Description |
|---------|-----|-------------|
| Language distribution bar chart | Chart.js | Clickable bars to filter project list |
| Contributions histogram | Chart.js | Distribution of commit activity |
| Timeline scatter/line | Chart.js | Projects created over time |
| Skills word cloud | n/a | Custom component or d3-cloud |

**Implementation:** New component `src/components/StatsCharts/` with reusable chart wrappers. Add a `/stats` page or embed in dashboard.

---

### 2. Stats API Endpoint (Backend)
**Status:** ⬜ Not started
**Why:** Let the frontend fetch live computed stats instead of relying on static notebook outputs.

**Proposed endpoints:**
```
GET  /stats/overview           → { total, avg_contributions, top_language, ... }
GET  /stats/languages          → [{ language, count, total_bytes }, ...]
GET  /stats/skills             → [{ skill, count }, ...]
GET  /stats/categories         → [{ category, count }, ...]
GET  /stats/timeline           → [{ year, count }, ...]
```

**Implementation:** New service `stats/` in the backend, proxied through the gateway. The notebook can also call these endpoints for consistency.

---

### 3. Live Jupyter Server
**Status:** ⬜ Not started
**Why:** Make the notebook editable and executable in-browser instead of static.

**How:**
```bash
# In start.sh, alongside the other services:
jupyter notebook --port 8888 --no-browser --NotebookApp.token=''
```
Then embed via iframe or proxy through the gateway at `/notebooks/`.

**Packages to install:**
```
pip install jupyter notebook ipykernel
```

---

### 4. Voila Dashboards
**Status:** ⬜ Not started
**Why:** Turn the analysis notebook into a standalone, interactive web app without writing React code.

**How:** Install `voila`, create a dashboard notebook, serve alongside the gateway:
```bash
voila --port 8889 --no-browser notebooks/dashboard.ipynb
```

---

### 5. Auto-Export with nbconvert
**Status:** ⬜ Not started
**Why:** Keep the static notebook in `public/data/notebooks/` up-to-date automatically.

**How:** Cron job or post-save hook:
```bash
jupyter nbconvert --to notebook --execute notebooks/analysis.ipynb \
  --output ../l-projects/public/data/notebooks/analysis.ipynb
```
Or add a FastAPI endpoint that triggers re-execution.

---

### 6. Data Grid (Frontend)
**Status:** ⬜ Not started
**Why:** Sortable, searchable, filterable table of all projects with inline stats.

**Options:** `@tanstack/react-table` (lightweight), AG Grid (feature-rich), or react-bootstrap-table.

**Implementation:** New `TableView` view mode alongside the existing `HexView` and `StatsView`.

---

### 7. Scheduled Re-scraping
**Status:** ⬜ Not started
**Why:** Keep project data fresh without manual `Scrape` button clicks.

**Options:**
- Cron job on the server: `0 3 * * 0 cd /path && node scripts/scrape-github.js`
- Celery Beat (adds Redis dependency)
- Simple `asyncio` loop inside the FastAPI project service

---

### 8. Notebook Versioning
**Status:** ⬜ Not started
**Why:** Track how metrics change over time by committing notebook outputs.

**How:** Git hook or CI step that runs the notebook and commits the result if changed:
```bash
jupyter nbconvert --to notebook --execute analysis.ipynb --output analysis.ipynb
git add analysis.ipynb
git commit -m "chore: update analysis notebook [skip ci]"
```

---

## Priority Matrix

| Feature | Effort | Impact | Dependencies |
|---------|--------|--------|--------------|
| Stats API endpoints | Low | High | Backend Python |
| Interactive charts | Medium | High | Stats API |
| Data grid | Medium | Medium | None |
| Scheduled scraping | Low | Medium | Cron access |
| Live Jupyter server | Medium | Medium | Backend venv |
| Voila dashboard | Low | Low | Pandas + Voila |
| Auto-export nbconvert | Low | Low | Jupyter |
| Notebook versioning | Low | Low | Git |

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| — | — | — |
