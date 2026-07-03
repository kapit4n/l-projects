import React from 'react';
import { Link } from 'react-router-dom';
import './EmptyState.css';

export default function EmptyState({ title, description, actionLabel, actionLink }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="16" width="48" height="36" rx="6" stroke="#D1D5DB" strokeWidth="2.5" fill="#F9FAFB"/>
          <path d="M24 28H40M24 36H36M24 44H32" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M20 8L24 16M44 8L40 16" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="empty-state-title">{title || 'No projects found'}</h3>
      <p className="empty-state-description">
        {description || 'Create your first project to get started.'}
      </p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="empty-state-action">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
