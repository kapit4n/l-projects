import React from 'react';
import './Toolbar.css';

export default function Toolbar({
  onExport,
  onSortAsc,
  onSortDesc,
  onSetView,
  onSync,
  onTopTen,
  currentView,
}) {
  return (
    <div className="toolbar" role="toolbar" aria-label="Project actions">
      <button className="toolbar-btn" onClick={onExport} aria-label="Export projects">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2V12M9 12L5.5 8.5M9 12L12.5 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12V15C2 15.5523 2.44772 16 3 16H15C15.5523 16 16 15.5523 16 15V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <span>Export</span>
      </button>

      <div className="toolbar-divider" />

      <button className="toolbar-btn" onClick={onSortAsc} aria-label="Sort ascending">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 13V5M9 5L5.5 8.5M9 5L12.5 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className="toolbar-btn" onClick={onSortDesc} aria-label="Sort descending">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 5V13M9 13L5.5 9.5M9 13L12.5 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="toolbar-divider" />

      <div className="toolbar-group" role="radiogroup" aria-label="View mode">
        <button
          className={`toolbar-btn ${currentView === 'card' ? 'toolbar-btn-active' : ''}`}
          onClick={() => onSetView('card')}
          aria-label="Card view"
          aria-pressed={currentView === 'card'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
        </button>
        <button
          className={`toolbar-btn ${currentView === 'hex' ? 'toolbar-btn-active' : ''}`}
          onClick={() => onSetView('hex')}
          aria-label="Hex view"
          aria-pressed={currentView === 'hex'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M5 2L13 2L17 9L13 16H5L1 9L5 2Z" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
        </button>
        <button
          className={`toolbar-btn ${currentView === 'stats' ? 'toolbar-btn-active' : ''}`}
          onClick={() => onSetView('stats')}
          aria-label="Statistics view"
          aria-pressed={currentView === 'stats'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="12" width="3" height="4" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="7.5" y="7" width="3" height="9" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="13" y="2" width="3" height="14" rx="1" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
        </button>
      </div>

      <div className="toolbar-divider" />

      <button className="toolbar-btn" onClick={onSync} aria-label="Sync with GitHub">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2C5.13401 2 2 5.13401 2 9M2 9H5.5M2 9L3.5 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 16C12.866 16 16 12.866 16 9M16 9H12.5M16 9L14.5 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Sync</span>
      </button>

      <button className="toolbar-btn" onClick={onTopTen} aria-label="Show top 10 projects">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 10L9 3L16 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 7V15H13V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Top 10</span>
      </button>
    </div>
  );
}
