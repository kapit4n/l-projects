import React from 'react';
import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar-wrapper">
      <svg className="search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="7.5" cy="7.5" r="5.75" stroke="currentColor" strokeWidth="2" />
        <path d="M12 12L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder || 'Search projects, technologies...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search projects"
      />
    </div>
  );
}
