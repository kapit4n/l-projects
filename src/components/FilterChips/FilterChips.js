import React from 'react';
import './FilterChips.css';

export default function FilterChips({ categories, selectedCats, onAdd, onDrop }) {
  return (
    <div className="filter-chips" role="group" aria-label="Category filters">
      {categories.map((category) => {
        const isSelected = selectedCats.some((cat) => cat === category);
        return (
          <button
            key={category}
            className={`filter-chip ${isSelected ? 'filter-chip-selected' : ''}`}
            onClick={() => (isSelected ? onDrop(category) : onAdd(category))}
            aria-pressed={isSelected}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
