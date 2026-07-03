import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ScrapeReport.css';

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

export default function ScrapeReport({ result, onClose }) {
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/scrape/logs');
      setLogs(res.data || []);
    } catch {
      setLogs([]);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if (!result) return null;

  return (
    <div className="scrape-overlay" onClick={onClose}>
      <div className="scrape-modal" onClick={(e) => e.stopPropagation()}>
        <button className="scrape-close" onClick={onClose} aria-label="Close">&times;</button>

        <h2 className="scrape-title">Scrape Report</h2>
        <p className="scrape-message">{result.message}</p>

        <div className="scrape-stats">
          <div className="scrape-stat">
            <span className="scrape-stat-value">{result.count}</span>
            <span className="scrape-stat-label">Repos scraped</span>
          </div>
          <div className="scrape-stat scrape-stat-updated">
            <span className="scrape-stat-value">{result.updated}</span>
            <span className="scrape-stat-label">Updated</span>
          </div>
          <div className="scrape-stat scrape-stat-added">
            <span className="scrape-stat-value">{result.added}</span>
            <span className="scrape-stat-label">Added</span>
          </div>
        </div>

        {result.details && result.details.length > 0 && (
          <div className="scrape-details">
            <h4>Details</h4>
            {(() => {
              const lines = result.details.filter(Boolean);
              const added = lines.filter(l => l.startsWith('Added: ')).map(l => l.slice(7));
              const updated = lines.filter(l => l.startsWith('Updated: ')).map(l => l.slice(9));
              return (
                <>
                  {added.length > 0 && (
                    <div className="scrape-detail-group">
                      <span className="scrape-detail-label scrape-label-added">Added ({added.length})</span>
                      <div className="scrape-detail-chips">
                        {added.map(name => (
                          <Link key={name} to={`/details/${name}`} className="scrape-detail-chip scrape-chip-added">{name}</Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {updated.length > 0 && (
                    <div className="scrape-detail-group">
                      <span className="scrape-detail-label scrape-label-updated">Updated ({updated.length})</span>
                      <div className="scrape-detail-chips">
                        {updated.map(name => (
                          <Link key={name} to={`/details/${name}`} className="scrape-detail-chip scrape-chip-updated">{name}</Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        <button className="scrape-toggle-logs" onClick={() => setShowLogs(!showLogs)}>
          {showLogs ? 'Hide' : 'View'} past scrape logs ({logs.length})
        </button>

        {showLogs && logs.length > 0 && (
          <div className="scrape-logs">
            {logs.map((log) => (
              <div key={log.id} className="scrape-log-entry">
                <span className="scrape-log-date">
                  {new Date(log.scraped_at).toLocaleString()}
                </span>
                <span className="scrape-log-summary">
                  {log.total_repos} repos · {log.projects_updated} updated · {log.projects_added} added
                </span>
                {log.details && (() => {
                  const { updated, added } = parseDetails(log.details);
                  if (added.length === 0 && updated.length === 0) return null;
                  return (
                    <details>
                      <summary>Details</summary>
                      <div className="scrape-log-details">
                        {added.length > 0 && (
                          <div className="scrape-detail-group">
                            <span className="scrape-detail-label scrape-label-added">Added ({added.length})</span>
                            <div className="scrape-detail-chips">
                              {added.map(name => (
                                <Link key={name} to={`/details/${name}`} className="scrape-detail-chip scrape-chip-added">{name}</Link>
                              ))}
                            </div>
                          </div>
                        )}
                        {updated.length > 0 && (
                          <div className="scrape-detail-group">
                            <span className="scrape-detail-label scrape-label-updated">Updated ({updated.length})</span>
                            <div className="scrape-detail-chips">
                              {updated.map(name => (
                                <Link key={name} to={`/details/${name}`} className="scrape-detail-chip scrape-chip-updated">{name}</Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </details>
                  );
                })()}
              </div>
            ))}
          </div>
        )}

        <button className="scrape-done-btn" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}
