import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './ScrapeReport.css';

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
            <ul>
              {result.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
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
                {log.details && (
                  <details>
                    <summary>Details</summary>
                    <pre>{log.details}</pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        <button className="scrape-done-btn" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}
