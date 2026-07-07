# Projects Dashboard

Project portfolio management system that tracks open-source and professional projects. Scrapes GitHub repositories, stores metadata, and presents an interactive dashboard with analysis capabilities.

![Home](https://raw.githubusercontent.com/kapit4n/l-projects/master/mockups/features/dashboard/main.png)

## Features

- **Projects List** — Search, filter, and browse all projects with cards or hex view
- **Project Details** — View README, architecture docs, screenshots, commits, and feature slider
- **Documentation Browser** — Explore project documentation files (.md) in a dedicated reader
- **Analysis Notebook** — Built-in Jupyter notebook viewer with project data analysis
- **GitHub Scraping** — Auto-fetch repo metadata, README, screenshots, and docs
- **Stats & Charts** — Language distribution, contribution metrics, and trends

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, react-router-dom, Chart.js, react-markdown |
| Backend | FastAPI (Python 3.11), SQLAlchemy, SQLite |
| Gateway | FastAPI reverse proxy (httpx) |
| Scraping | GitHub API v3 |

## Quick Start

```bash
./start.sh                    # starts backend services + frontend
# or manually:
cd ../l-projects-services && source lservices/bin/activate
(cd gateway && uvicorn main:app --reload --port 8000) &
(cd projects && uvicorn main:app --reload --port 8001) &
# then:
cd ../l-projects && npm start
```

## Documentation

- [Architecture & Tech Stack](./architecture.md) — System design, DB schema, data flow
- [Tech Stack & Roadmap](./tech-stack.md) — Proposed improvements and priority matrix
