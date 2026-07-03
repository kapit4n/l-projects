import React from 'react';
import './StatsCards.css';

export default function StatsCards({ totalProjects, totalCommits }) {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon stat-icon-projects">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H13L11 5H5C3.89543 5 3 5.89543 3 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="stat-value">{totalProjects}</div>
        <div className="stat-label">Projects</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon stat-icon-commits">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 9V3M12 21V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="stat-value">{totalCommits}</div>
        <div className="stat-label">Commits</div>
      </div>
    </div>
  );
}
