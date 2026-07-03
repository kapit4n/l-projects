import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ArchivedRepos.css';

const API_BASE = 'http://localhost:8000';

export default function ArchivedRepos() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadArchived = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/projects`);
      const data = (res.data || []).filter((p) => p.archived);
      setProjects(data);
    } catch {
      const res = await axios.get(`${API_BASE}/projects`);
      const data = (res.data || []).filter((p) => p.archived);
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArchived();
  }, [loadArchived]);

  const handleUnarchive = useCallback(async (project) => {
    try {
      await axios.put(`${API_BASE}/projects/${encodeURIComponent(project.name)}/unarchive`);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (err) {
      console.error('Unarchive failed:', err);
    }
  }, []);

  return (
    <div className="archived-page">
      <header className="archived-header">
        <div className="archived-header-left">
          <Link to="/" className="archived-back-link">&larr; Dashboard</Link>
          <h1 className="archived-title">Archived Repositories</h1>
          <p className="archived-subtitle">
            {projects.length} archived project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      {loading && <div className="archived-loading">Loading archived projects...</div>}

      {!loading && projects.length === 0 && (
        <div className="archived-empty">
          <p>No archived projects.</p>
          <Link to="/" className="archived-back-link">Back to Dashboard</Link>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="archived-list">
          {projects.map((project) => (
            <div key={project.id} className="archived-item">
              <Link to={`/details/${project.id}`} className="archived-item-name">
                {project.name}
              </Link>
              <span className="archived-item-desc">
                {project.description || project.language || 'No description'}
              </span>
              <button
                className="archived-unarchive-btn"
                onClick={() => handleUnarchive(project)}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 4.5H14.5" />
                  <path d="M3 4.5V13C3 13.8284 3.67157 14.5 4.5 14.5H11.5C12.3284 14.5 13 13.8284 13 13V4.5" />
                  <path d="M8 7V11" />
                  <path d="M6 9H10" />
                </svg>
                Unarchive
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
