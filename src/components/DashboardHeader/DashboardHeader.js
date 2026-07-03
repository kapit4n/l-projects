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
      <Link to="/add" className="dashboard-add-btn" aria-label="Add new project">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        Add Project
      </Link>
    </header>
  );
}
