import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import ProjectService from '../../services/ProjectsService';
import TechnologyBadge from '../../components/TechnologyBadge/TechnologyBadge';
import MomentProject from '../../components/DateFromNow';
import FeatureSlider from '../../components/FeatureSlider/FeatureSlider';

import './Details.css'

function DetailSkeleton() {
  return (
    <div className="detail-page">
      <div className="detail-skeleton">
        <div className="skeleton-line skeleton-line-sm" />
        <div className="skeleton-line skeleton-line-lg" />
        <div className="skeleton-line skeleton-line-md" />
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    </div>
  );
}

const GitHubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CommitIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 9V3M12 21V15" />
  </svg>
);

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CodeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const GitCommitIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <line x1="1.05" y1="12" x2="7" y2="12" />
    <line x1="17.01" y1="12" x2="22.96" y2="12" />
  </svg>
);

const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);

const BACKEND_LANGS = new Set(['python', 'go', 'java', 'ruby', 'php', 'rust', 'c#', 'c++', 'cpp', 'kotlin'])
const UI_LANGS = new Set(['typescript', 'javascript', 'dart', 'html', 'css'])

function isBackendProject(project) {
  const lang = (project.language || '').toLowerCase()
  const skills = (project.skills || []).map(s => s.toLowerCase())
  const cats = (project.categories || []).map(c => c.toLowerCase())
  const all = [...skills, ...cats, lang]
  if (all.some(t => ['angular', 'react', 'vue', 'mobile', 'ios', 'android', 'ui', 'frontend', 'flutter'].includes(t))) return false
  if (all.some(t => ['api', 'cli', 'backend', 'server', 'service', 'graphql'].includes(t))) return true
  if (BACKEND_LANGS.has(lang)) return true
  if (UI_LANGS.has(lang)) return false
  return true
}

const PlaceholderImage = ({ isBackend }) => (
  <div className={`detail-placeholder ${isBackend ? 'placeholder-backend' : 'placeholder-ui'}`}>
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {isBackend ? (
        <>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </>
      ) : (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </>
      )}
    </svg>
    <span className="detail-placeholder-label">{isBackend ? 'Backend Repository' : 'UI Repository'}</span>
  </div>
)

function formatCommitDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function Details() {

  const { id } = useParams()
  const [project, setProject] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [commits, setCommits] = React.useState([])
  const [commitsLoading, setCommitsLoading] = React.useState(false)
  const [readme, setReadme] = React.useState(null)
  const [readmeLoading, setReadmeLoading] = React.useState(false)
  const [architecture, setArchitecture] = React.useState(null)
  const [architectureLoading, setArchitectureLoading] = React.useState(false)
  const [scrapedImg, setScrapedImg] = React.useState(null)
  const [imgError, setImgError] = React.useState(false)
  const [scraping, setScraping] = React.useState(false)
  const [featuresData, setFeaturesData] = React.useState([])

  React.useEffect(() => {
    const service = new ProjectService()
    async function loadProject() {
      setLoading(true)
      try {
        const projects = await service.getProjects()
        const found = projects.data.find(p => String(p.id) === id || p.name === id)
        setProject(found || null)
      } catch {
        setProject(null)
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id])

  const projectName = project?.name

  React.useEffect(() => {
    if (!projectName) return
    const API = 'http://localhost:8000'

    setCommitsLoading(true)
    setReadmeLoading(true)
    setArchitectureLoading(true)

    axios.get(`${API}/repo-details/${projectName}`)
      .then(res => {
        if (res.data) {
          const d = res.data
          try { setCommits(JSON.parse(d.top_commits || '[]')) } catch { setCommits([]) }
          setReadme(d.readme || null)
          setScrapedImg(d.img || null)
          setFeaturesData(d.features_data || [])
          if (d.architecture) {
            setArchitecture({ path: 'ARCHITECTURE.md', content: d.architecture })
          }
        }
      })
      .catch(() => {
        return axios.post(`${API}/repo-details/${projectName}/fetch`)
      })
      .then(res => {
        if (res && res.data) {
          const d = res.data
          try { setCommits(JSON.parse(d.top_commits || '[]')) } catch { setCommits([]) }
          setReadme(d.readme || null)
          setScrapedImg(d.img || null)
          setFeaturesData(d.features_data || [])
          if (d.architecture) {
            setArchitecture({ path: 'ARCHITECTURE.md', content: d.architecture })
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        setCommitsLoading(false)
        setReadmeLoading(false)
        setArchitectureLoading(false)
      })
  }, [projectName])

  const handleScrape = React.useCallback(async () => {
    if (!projectName) return
    setScraping(true)
    setCommitsLoading(true)
    setReadmeLoading(true)
    setArchitectureLoading(true)
    setImgError(false)
    try {
      const res = await axios.post(`http://localhost:8000/repo-details/${projectName}/fetch`)
      if (res.data) {
        const d = res.data
        try { setCommits(JSON.parse(d.top_commits || '[]')) } catch { setCommits([]) }
        setReadme(d.readme || null)
        setScrapedImg(d.img || null)
        setFeaturesData(d.features_data || [])
        if (d.architecture) {
          setArchitecture({ path: 'ARCHITECTURE.md', content: d.architecture })
        }
      }
    } catch {
      console.error('Failed to fetch repo details')
    } finally {
      setScraping(false)
      setCommitsLoading(false)
      setReadmeLoading(false)
      setArchitectureLoading(false)
    }
  }, [projectName])

  if (loading) return <DetailSkeleton />

  if (!project) {
    return (
      <div className="detail-page">
        <Link to="/" className="detail-back-link">&larr; Dashboard</Link>
        <div className="detail-empty">
          <h2>Repository not found</h2>
          <p>The repository "{id}" could not be found.</p>
        </div>
      </div>
    );
  }

  const githubUrl = project.dir || `https://github.com/kapit4n/${project.name}`
  const hasLanguages = project.languages && Object.keys(project.languages).length > 0

  return (
    <div className="detail-page">
      <Link to="/" className="detail-back-link">&larr; Dashboard</Link>

      <header className="detail-header">
        <div className="detail-title-row">
          <h1 className="detail-title">{project.name}</h1>
          <a
            href={githubUrl}
            className="detail-github-link"
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
          >
            <GitHubIcon />
          </a>
          <Link
            to={`/projects/${project.name}/docs`}
            className="detail-docs-link"
            aria-label="View documentation"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Docs
          </Link>
          <button
            className="detail-scrape-btn"
            onClick={handleScrape}
            disabled={scraping}
            title={scraping ? 'Scraping...' : 'Scrape repo details from GitHub'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={scraping ? 'detail-scrape-spin' : ''}>
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            {scraping ? 'Scraping...' : 'Scrape'}
          </button>
        </div>
        <div className="detail-meta">
          {project.startDate && (
            <span className="detail-meta-item">
              <CalendarIcon />
              Created <MomentProject date={project.startDate} />
            </span>
          )}
          {project.updatedDate && (
            <span className="detail-meta-item">
              <CalendarIcon />
              Updated <MomentProject date={project.updatedDate} />
            </span>
          )}
        </div>
      </header>

      {(() => {
        const imgSrc = scrapedImg || project.img
        if (imgSrc && !imgError) {
          return (
            <figure className="detail-figure">
              <img src={imgSrc} alt={project.name} onError={() => setImgError(true)} />
            </figure>
          )
        }
        return (
          <figure className="detail-figure">
            <PlaceholderImage isBackend={isBackendProject(project)} />
          </figure>
        )
      })()}

      <div className="detail-stats">
        <div className="detail-stat-card">
          <div className="detail-stat-icon detail-stat-icon-commits">
            <CommitIcon />
          </div>
          <span className="detail-stat-value">{project.contributions ?? 0}</span>
          <span className="detail-stat-label">Contributions</span>
        </div>
        <div className="detail-stat-card">
          <div className="detail-stat-icon detail-stat-icon-size">
            <FolderIcon />
          </div>
          <span className="detail-stat-value">{project.size ?? 0}</span>
          <span className="detail-stat-label">Size (KB)</span>
        </div>
        <div className="detail-stat-card">
          <div className="detail-stat-icon detail-stat-icon-issues">
            <AlertIcon />
          </div>
          <span className="detail-stat-value">{project.openIssues ?? 0}</span>
          <span className="detail-stat-label">Open Issues</span>
        </div>
        {project.language && (
          <div className="detail-stat-card">
            <div className="detail-stat-icon detail-stat-icon-lang">
              <CodeIcon />
            </div>
            <span className="detail-stat-value">{project.language}</span>
            <span className="detail-stat-label">Primary Language</span>
          </div>
        )}
      </div>

      {project.description && (
        <section className="detail-section">
          <h3 className="detail-section-title">About</h3>
          <p className="detail-description">{project.description}</p>
        </section>
      )}

      {hasLanguages && (
        <section className="detail-section">
          <h3 className="detail-section-title">Languages</h3>
          <div className="detail-chips">
            {Object.entries(project.languages).map(([lang, bytes], i) => (
              <TechnologyBadge key={lang} label={`${lang} (${(bytes / 1000).toFixed(1)} KB)`} index={i} />
            ))}
          </div>
        </section>
      )}

      {project.categories && project.categories.length > 0 && (
        <section className="detail-section">
          <h3 className="detail-section-title">Categories</h3>
          <div className="detail-chips">
            {project.categories.map((cat, i) => (
              <span key={cat} className="detail-chip detail-chip-category">{cat}</span>
            ))}
          </div>
        </section>
      )}

      {project.skills && project.skills.length > 0 && (
        <section className="detail-section">
          <h3 className="detail-section-title">Skills</h3>
          <div className="detail-chips">
            {project.skills.map((skill, i) => (
              <TechnologyBadge key={skill} label={skill} index={i} />
            ))}
          </div>
        </section>
      )}

      {project.features && project.features.length > 0 && (
        <section className="detail-section">
          <h3 className="detail-section-title">Features</h3>
          <div className="detail-chips">
            {project.features.map((feat) => (
              <Link
                key={feat}
                to={`/projects/${project.id}/features/1`}
                className="detail-chip detail-chip-feature"
              >
                {feat}
              </Link>
            ))}
          </div>
        </section>
      )}

      {commitsLoading && (
        <section className="detail-section">
          <h3 className="detail-section-title">
            <GitCommitIcon />
            Recent Commits
          </h3>
          <div className="detail-loading-pulse" />
        </section>
      )}
      {!commitsLoading && commits.length > 0 && (
        <section className="detail-section">
          <h3 className="detail-section-title">
            <GitCommitIcon />
            Recent Commits
          </h3>
          <div className="detail-commits">
            {commits.map((c, i) => {
              const sha = (c.sha || '').slice(0, 7)
              const msg = c.commit?.message || ''
              const firstLine = msg.split('\n')[0]
              const author = c.commit?.author?.name || c.commit?.committer?.name || 'unknown'
              const date = c.commit?.author?.date || c.commit?.committer?.date
              return (
                <div key={c.sha || i} className="detail-commit">
                  <div className="detail-commit-avatar">
                    {c.author?.avatar_url ? (
                      <img src={c.author.avatar_url} alt={author} />
                    ) : (
                      <span className="detail-commit-avatar-fallback">{author[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="detail-commit-body">
                    <span className="detail-commit-message">{firstLine}</span>
                    <span className="detail-commit-meta">
                      <a
                        href={`${githubUrl}/commit/${c.sha}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="detail-commit-sha"
                      >
                        {sha}
                      </a>
                      <span className="detail-commit-author">{author}</span>
                      {date && <span className="detail-commit-date">{formatCommitDate(date)}</span>}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <FeatureSlider features={featuresData} />

      {readmeLoading && (
        <section className="detail-section">
          <h3 className="detail-section-title">
            <BookIcon />
            README
          </h3>
          <div className="detail-loading-pulse" />
        </section>
      )}
      {!readmeLoading && readme && (
        <section className="detail-section detail-section-readme">
          <h3 className="detail-section-title">
            <BookIcon />
            README
          </h3>
          <div className="detail-readme">
            <ReactMarkdown>
              {readme}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {architectureLoading && (
        <section className="detail-section">
          <h3 className="detail-section-title">Architecture</h3>
          <div className="detail-loading-pulse" />
        </section>
      )}
      {!architectureLoading && architecture && (
        <section className="detail-section">
          <h3 className="detail-section-title">Architecture</h3>
          <div className="detail-arch-meta">
            Source: <code>{architecture.path}</code>
            {architecture.section && <span> &middot; Section: <code>{architecture.section}</code></span>}
          </div>
          <div className="detail-readme detail-section-arch">
            <ReactMarkdown>
              {architecture.content}
            </ReactMarkdown>
          </div>
        </section>
      )}

    </div>
  );
}
