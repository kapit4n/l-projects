# Architecture & Technology Stack

## Overview

This project is a **project portfolio management system** that tracks open-source and professional projects. It scrapes GitHub repositories, stores metadata in a database, and presents it through a React dashboard with analysis capabilities.

---

## System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Frontend (React)                        │
│                    localhost:3000                          │
│                                                           │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌───────────────┐   │
│  │ Projects │ │ Details  │ │ Docs   │ │ Notebooks     │   │
│  │ List     │ │ Page     │ │ Page   │ │ Page          │   │
│  └─────────┘ └──────────┘ └────────┘ └───────────────┘   │
│       │            │            │              │          │
│       └────────────┴────────────┴──────────────┘          │
│                        │                                  │
│                   axios calls                             │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│              Gateway (FastAPI, port 8000)                  │
│              Reverse proxy / CORS layer                    │
└──────────┬──────────────────────────────────┬──────────────┘
           │                                  │
           ▼                                  ▼
┌─────────────────────┐          ┌──────────────────────────┐
│  Projects Service   │          │   Features Service       │
│  (FastAPI, port 8001)│         │   (FastAPI, port 8002)   │
│                     │          │                          │
│  - Project CRUD     │          │  - Feature CRUD          │
│  - GitHub scraping  │          │                          │
│  - Commit sync      │          └──────────────────────────┘
│  - Repo details     │
│  - Document fetch   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   SQLite Database   │
│   ../db/db.db       │
│                     │
│  Tables:            │
│  - projects         │
│  - repo_details     │
│  - commit_sync      │
│  - scrape_logs      │
└─────────────────────┘
```

### Component Details

#### Gateway (`gateway/main.py`)
- Single entry point for all API calls
- CORS configured for `localhost:3000` and `localhost:3001`
- Proxies requests to internal microservices using `httpx.AsyncClient`
- No business logic — pure routing layer

#### Projects Service (`projects/main.py`)
- Core service handling all project-related operations
- **Endpoints:**
  - `GET/POST /projects/` — list/create projects
  - `POST /projects/batch` — batch upsert (used by scraper scripts)
  - `GET /projects/{id}` — single project lookup
  - `PUT /projects/{name}/archive|unarchive` — archive toggle
  - `GET/POST /commits/` — commit data CRUD
  - `GET /scrape` — trigger GitHub scraping for all repos
  - `GET/POST /repo-details/{name}` — detailed repo info (README, architecture, features, documents)
  - `GET /repo-details/{name}/docs` — documentation files

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.2.0 | UI framework |
| react-router-dom | 6.10.0 | Client-side routing |
| react-markdown | 10.1.0 | Render markdown content (README, docs, features) |
| Chart.js / react-chartjs-2 | 4.x / 5.x | Data visualization |
| axios | 1.6.0 | HTTP client |
| react-bootstrap / reactstrap | 2.7.4 / 9.1.9 | UI components |
| react-hook-form | 7.43.9 | Form handling |
| react-tiny-virtual-list | 2.2.0 | Virtualized list |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11.6 | Runtime |
| FastAPI | 0.115.8 | Web framework |
| Uvicorn | 0.34.0 | ASGI server |
| SQLAlchemy | 2.0.38 | ORM |
| SQLite | — | Database |
| httpx | 0.28.1 | Async HTTP client (GitHub API calls, inter-service proxying) |
| pydantic | 2.10.6 | Data validation |

### Database Schema

#### `projects`
| Column | Type | Description |
|---|---|---|
| id | Integer (PK) | Auto-increment ID |
| name | String | Project name (unique) |
| archived | Boolean | Soft delete flag |
| startDate | String | ISO date created |
| updatedDate | String | ISO date last pushed |
| dir | String | GitHub URL |
| img | String | Screenshot/homepage URL |
| features | Text (JSON) | Feature list |
| categories | Text (JSON) | Category list |
| skills | Text (JSON) | Skill/topic list |
| contributions | Integer | Total commits from top contributor |
| description | Text | Project description |
| languageKeys | Text (JSON) | Available languages |
| language | String | Primary language |
| size | Integer | Repo size in KB |
| openIssues | Integer | Open issue count |
| languages | Text (JSON) | Language → bytes mapping |

#### `repo_details`
| Column | Type | Description |
|---|---|---|
| id | Integer (PK) | Auto-increment ID |
| project_name | String (unique) | Foreign key to projects |
| top_commits | Text (JSON) | Last 5 commits from GitHub |
| readme | Text | README.md content |
| architecture | Text | Architecture documentation |
| img | String | Discovered screenshot URL |
| is_backend | Boolean | Backend vs UI classification |
| features_data | Text (JSON) | Feature screenshots/descriptions |
| documents | Text (JSON) | Documentation files (.md, .mdx, .rst) |
| fetched_at | DateTime | Last fetch timestamp |

#### `commit_sync`
| Column | Type | Description |
|---|---|---|
| id | Integer (PK) | Auto-increment ID |
| project_name | String (unique) | Project name |
| total_commits | Integer | Total commit count |
| synced_at | DateTime | Last sync timestamp |

#### `scrape_logs`
| Column | Type | Description |
|---|---|---|
| id | Integer (PK) | Auto-increment ID |
| scraped_at | DateTime | When the scrape ran |
| total_repos | Integer | Repos processed |
| projects_updated | Integer | Existing repos updated |
| projects_added | Integer | New repos added |
| details | Text | Per-repo change log |

---

## GitHub Scraping Pipeline

### Full Scrape (`GET /scrape`)
1. Fetch repos from GitHub API for user `kapit4n` (up to 100, sorted by updated)
2. For each repo: fetch languages, top contributor commit count
3. Upsert all into `projects` table
4. Log results in `scrape_logs`

### Repo Details Scrape (`POST /repo-details/{name}/fetch`)
1. **Commits** — last 5 commits
2. **Repo metadata** — topics, language, backend/UI classification
3. **README** — base64-decoded content from GitHub API
4. **Architecture** — looks for ARCHITECTURE.md in known paths
5. **Image** — scans git tree for screenshot images in standard directories
6. **Features** — discovers `mockups/features/` for paired screenshots + markdown descriptions
7. **Documents** — discovers `.md`, `.mdx`, `.rst` files across the repo (excluding README, ARCHITECTURE, LICENSE, etc.)

### Backend Classification Logic
A project is classified as **backend** if:
- Topics include API, CLI, backend, server, service, GraphQL, REST, microservice
- Primary language is a backend language (Python, Go, Java, Ruby, PHP, Rust, C#, C++)
- Not explicitly a frontend/mobile project (Angular, React, Vue, Flutter, etc.)

---

## Frontend Routes

| Path | Component | Description |
|---|---|---|
| `/` | List | Project dashboard with search, filters, cards |
| `/details/:id` | Details | Single project detail page |
| `/projects/:name/docs` | Docs | Project documentation browser |
| `/add` | Add | Add new project form |
| `/projects/:projectId/features/:id` | FeatureShow | Feature commentary |
| `/scraped-repos` | ScrapedRepos | View scraped repositories |
| `/archived-repos` | ArchivedRepos | View archived repositories |
| `/notebooks` | Notebooks | Jupyter notebook analysis viewer |

---

## Data Flow

```
GitHub API  ──►  Scraper (Python/FastAPI)  ──►  SQLite DB
                                                    │
User  ──►  React Frontend  ──►  Gateway  ──►  Projects Service  ──►  DB
                                              (via httpx proxy)

Static JSON fallback: public/data/projects-all.json
                      public/data/categories.json
                      public/data/skills.json
```

The frontend's `env.js` controls the data source:
- `pullData: true` — fetch from backend API (`localhost:8000`)
- `pullData: false` — load from static JSON files

---

## Running the Project

```bash
# Start all backend services + frontend
./start.sh

# Or manually:
# Terminal 1: Backend services
cd ../l-projects-services
source lservices/bin/activate
(cd projects && uvicorn main:app --reload --port 8001) &
(cd features && uvicorn main:app --reload --port 8002) &
(cd gateway && uvicorn main:app --reload --port 8000) &

# Terminal 2: Frontend
cd l-projects
npm start

# Scrape GitHub data (optional)
curl http://localhost:8000/scrape
```

---

## See Also

- [README.md](./README.md) — Project overview and features
- [tech-stack.md](./tech-stack.md) — Proposed improvements and roadmap
