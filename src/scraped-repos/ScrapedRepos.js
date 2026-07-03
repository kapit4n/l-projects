import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ScrapedRepos.css';

function parseDetails(details) {
  if (!details) return { updated: [], added: [] };
  const lines = details.split('\n').filter(Boolean);
  const updated = [];
  const added = [];
  for (const line of lines) {
    if (line.startsWith('Updated: ')) updated.push(line.slice(9));
    else if (line.startsWith('Added: ')) added.push(line.slice(7));
  }
  return { updated, added };
}

function groupReposByStatus(logs) {
  const allUpdated = new Set();
  const allAdded = new Set();
  for (const log of logs) {
    const { updated, added } = parseDetails(log.details);
    updated.forEach((r) => allUpdated.add(r));
    added.forEach((r) => allAdded.add(r));
  }
  return { allUpdated: [...allUpdated], allAdded: [...allAdded] };
}

export default function ScrapedRepos() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [expandedLog, setExpandedLog] = useState(null);
  const [showAllRepos, setShowAllRepos] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/scrape/logs');
      setLogs(res.data || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleScrape = useCallback(async () => {
    setScraping(true);
    try {
      await axios.get('http://localhost:8000/scrape');
      await fetchLogs();
    } catch (err) {
      alert('Scrape failed. Make sure the backend is running on port 8000.');
    } finally {
      setScraping(false);
    }
  }, [fetchLogs]);

  const { allUpdated, allAdded } = groupReposByStatus(logs);
  const allRepos = [
    ...allAdded.map((name) => ({ name, status: 'Added' })),
    ...allUpdated.map((name) => ({ name, status: 'Updated' })),
  ];

  return (
    <div className="scraped-page">
      <header className="scraped-header">
        <div className="scraped-header-left">
          <Link to="/" className="scraped-back-link">&larr; Dashboard</Link>
          <h1 className="scraped-title">Scraped Repositories</h1>
          <p className="scraped-subtitle">
            {logs.length > 0
              ? `${logs.length} scrape session${logs.length !== 1 ? 's' : ''} · ${allRepos.length} unique repos`
              : 'View all repositories that have been scraped from GitHub'}
          </p>
        </div>
        <button
          className="scraped-scrape-btn"
          onClick={handleScrape}
          disabled={scraping}
        >
          {scraping ? 'Scraping...' : 'Scrape Now'}
        </button>
      </header>

      {loading && <div className="scraped-loading">Loading scrape history...</div>}

      {!loading && logs.length === 0 && (
        <div className="scraped-empty">
          <p>No scrape sessions yet.</p>
          <button className="scraped-scrape-btn" onClick={handleScrape}>
            Run your first scrape
          </button>
        </div>
      )}

      {!loading && logs.length > 0 && (
        <>
          <div className="scraped-tabs">
            <button
              className={`scraped-tab ${!showAllRepos ? 'scraped-tab-active' : ''}`}
              onClick={() => setShowAllRepos(false)}
            >
              Sessions
            </button>
            <button
              className={`scraped-tab ${showAllRepos ? 'scraped-tab-active' : ''}`}
              onClick={() => setShowAllRepos(true)}
            >
              All Repositories ({allRepos.length})
            </button>
          </div>

          {showAllRepos ? (
            <div className="scraped-all-repos">
              {allRepos.map((repo) => (
                <div key={repo.name} className="scraped-all-repo">
                  <Link to={`/details/${repo.name}`} className="scraped-repo-name">{repo.name}</Link>
                  <span className={`scraped-repo-status ${repo.status === 'Added' ? 'scraped-status-added' : 'scraped-status-updated'}`}>
                    {repo.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="scraped-sessions">
              {logs.map((log) => {
                const { updated, added } = parseDetails(log.details);
                const isExpanded = expandedLog === log.id;
                return (
                  <div key={log.id} className="scraped-session">
                    <div
                      className="scraped-session-header"
                      onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                    >
                      <div className="scraped-session-info">
                        <span className="scraped-session-date">
                          {new Date(log.scraped_at).toLocaleString()}
                        </span>
                        <span className="scraped-session-stats">
                          {log.total_repos} repos · {log.projects_updated} updated · {log.projects_added} added
                        </span>
                      </div>
                      <span className={`scraped-session-chevron ${isExpanded ? 'scraped-chevron-open' : ''}`}>
                        &#9654;
                      </span>
                    </div>
                    {isExpanded && (
                      <div className="scraped-session-body">
                        {added.length > 0 && (
                          <div className="scraped-session-group">
                            <h4 className="scraped-group-label scraped-group-added">Added ({added.length})</h4>
                            <div className="scraped-repo-list">
                              {added.map((name) => (
                                <Link key={name} to={`/details/${name}`} className="scraped-repo-chip scraped-chip-added">{name}</Link>
                              ))}
                            </div>
                          </div>
                        )}
                        {updated.length > 0 && (
                          <div className="scraped-session-group">
                            <h4 className="scraped-group-label scraped-group-updated">Updated ({updated.length})</h4>
                            <div className="scraped-repo-list">
                              {updated.map((name) => (
                                <Link key={name} to={`/details/${name}`} className="scraped-repo-chip scraped-chip-updated">{name}</Link>
                              ))}
                            </div>
                          </div>
                        )}
                        {added.length === 0 && updated.length === 0 && (
                          <p className="scraped-no-details">No details available</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
