import React from 'react';
import './Toolbar.css';

export default function Toolbar({
  onExport,
  onSortAsc,
  onSortDesc,
  onSetView,
  onSync,
  onTopTen,
  onScrape,
  currentView,
  syncing,
  scraping,
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

      <button className={`toolbar-btn ${syncing ? 'toolbar-btn-syncing' : ''}`} onClick={onSync} disabled={syncing} aria-label="Sync all commits with GitHub">
        {syncing ? (
          <svg className="toolbar-spinner" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2C5.13401 2 2 5.13401 2 9M2 9H5.5M2 9L3.5 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 16C12.866 16 16 12.866 16 9M16 9H12.5M16 9L14.5 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        <span>{syncing ? 'Syncing...' : 'Sync All'}</span>
      </button>

      <div className="toolbar-divider" />

      <button className={`toolbar-btn ${scraping ? 'toolbar-btn-syncing' : ''}`} onClick={onScrape} disabled={scraping} aria-label="Scrape top 20 repos from GitHub">
        {scraping ? (
          <svg className="toolbar-spinner" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 0C4.03 0 0 4.03 0 9c0 3.98 2.58 7.35 6.16 8.54.45.08.62-.2.62-.44 0-.22-.01-.95-.01-1.73-2.26.41-2.84-.54-3.02-1.04-.1-.26-.54-1.06-.92-1.27-.31-.17-.76-.59-.01-.6.7-.01 1.2.64 1.37.9.8 1.35 2.1.97 2.62.74.08-.58.31-.97.56-1.19-1.96-.22-4.01-.98-4.01-4.36 0-.96.34-1.75.9-2.37-.09-.22-.39-1.12.09-2.33 0 0 .74-.24 2.42.9.7-.2 1.45-.3 2.2-.3.75 0 1.5.1 2.2.3 1.68-1.14 2.42-.9 2.42-.9.48 1.21.18 2.11.09 2.33.56.62.9 1.41.9 2.37 0 3.39-2.06 4.14-4.02 4.36.32.28.6.82.6 1.66 0 1.2-.01 2.16-.01 2.45 0 .24.17.53.63.44C15.44 16.33 18 12.97 18 9 18 4.03 13.97 0 9 0z" stroke="currentColor" strokeWidth="0.5" fill="currentColor"/>
          </svg>
        )}
        <span>{scraping ? 'Scraping...' : 'Scrape'}</span>
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
