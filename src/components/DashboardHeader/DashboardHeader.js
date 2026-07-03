import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardHeader.css';

export default function DashboardHeader({ totalProjects }) {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <h1 className="dashboard-title">Projects Dashboard</h1>
        <p className="dashboard-subtitle">
          Manage and organize all your development projects.
          {totalProjects !== undefined && (
            <span className="dashboard-count">{totalProjects} total</span>
          )}
        </p>
      </div>
      <div className="dashboard-header-actions">
        <Link to="/archived-repos" className="dashboard-nav-btn" aria-label="View archived repositories">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Archived
        </Link>
        <Link to="/scraped-repos" className="dashboard-nav-btn" aria-label="View scraped repositories">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Scraped
        </Link>
        <Link to="/add" className="dashboard-add-btn" aria-label="Add new project">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Add Project
        </Link>
      </div>
    </header>
  );
}
