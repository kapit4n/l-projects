# Session Context

## Project Structure

```
gi/
├── l-projects/                 # React 18 frontend (CRA)
│   ├── public/data/
│   │   └── projects-all.json   # Main project data (GitHub mock + seeded)
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardHeader/
│   │   │   ├── SearchBar/
│   │   │   ├── FilterChips/
│   │   │   ├── StatsCards/
│   │   │   ├── Toolbar/
│   │   │   ├── ProjectCard/
│   │   │   ├── TechnologyBadge/
│   │   │   ├── SkeletonCard/
│   │   │   ├── EmptyState/
│   │   │   ├── ScrapeReport/
│   │   │   ├── Chip.js (legacy)
│   │   │   ├── Control.js (legacy)
│   │   │   └── DateFromNow.js
│   │   ├── projects/
│   │   │   ├── list/List.js     # Main dashboard
│   │   │   ├── details/Details.js
│   │   │   ├── add/Add.js
│   │   │   └── viewMode/ (HexView, StatsView, legacy ProjectCard)
│   │   ├── services/
│   │   │   ├── ProjectsService.js
│   │   │   ├── GithubService.js
│   │   │   ├── SyncService.js
│   │   │   ├── CategoriesService.js
│   │   │   └── SkillsService.js
│   │   ├── styles/design-system.css
│   │   ├── App.js
│   │   └── index.js
│   ├── scripts/
│   │   ├── seed-projects.js     # Seeds missing gi dirs into JSON
│   │   └── scrape-github.js     # Node scraper (standalone)
│   ├── start.sh                 # Starts backend + frontend
│   └── tech-stack.md
├── l-projects-services/         # Python FastAPI backend
│   ├── projects/
│   │   ├── main.py              # API endpoints (CRUD, commits, scrape, logs)
│   │   ├── models.py            # Project, CommitSync, ScrapeLog
│   │   └── database.py
│   └── gateway/main.py          # Proxy for all services
├── start-l-projects.sh          # Original start script
└── (other project dirs)
```

## What Has Been Done

### 1. Dashboard Redesign
- Created design system with CSS variables (colors, typography, shadows, transitions)
- New components: DashboardHeader, SearchBar, FilterChips, StatsCards, Toolbar, TechnologyBadge, ProjectCard, SkeletonCard, EmptyState
- Refactored List.js to use new components with search, loading states, empty states
- Removed Bootstrap dependency from App.js

### 2. Commit Sync (GitHub → DB)
- Backend: CommitSync model, CRUD endpoints, batch upsert
- Frontend: SyncService, GithubService.getTotalCommits()
- Sync All button in Toolbar fetches commit counts for ALL repos, saves to DB
- On page load, commit data is loaded from DB (avoiding GitHub API calls per render)
- Synced commits persisted in `db.db` via backend

### 3. Seed Missing Projects
- Created `scripts/seed-projects.js` - scans `gi/` directory, adds missing projects to projects-all.json
- Seeded 19 projects from gi folder that weren't in the list

### 4. GitHub Scraper
- Backend: `/scrape` endpoint fetches top 20 repos from kapit4n's GitHub, gets languages + contributors, updates projects-all.json
- Backend: `ScrapeLog` model and `/scrape/logs` endpoint for history
- Frontend: Scrape button in Toolbar, ScrapeReport modal with stats and past log history
- Standalone Node.js version: `scripts/scrape-github.js`

### 5. Tech Stack Doc
- `tech-stack.md` lists all technologies used

## Ports
- Frontend (React dev server): 3000
- Gateway (FastAPI): 8000
- Projects service (FastAPI): 8001
- Features service (FastAPI): 8002

## Environment
- `.env` has `REACT_APP_IS_MOCKED=false` (truthy string = mock mode always active)
- Mock data served from `public/data/projects-all.json`
- Backend runs on port 8000-8002 via `start.sh` (uvicorn)

## Git Repos
- `l-projects` — main frontend repo (commits up to 21f590e)
- `l-projects-services` — backend repo (commits up to cb22597)
