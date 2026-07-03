import React from 'react';
import './TechnologyBadge.css';

const BADGE_COLORS = [
  { bg: '#EEF2FF', text: '#4338CA' },
  { bg: '#F0FDF4', text: '#16A34A' },
  { bg: '#FFF7ED', text: '#C2410C' },
  { bg: '#FEF2F2', text: '#DC2626' },
  { bg: '#F5F3FF', text: '#7C3AED' },
  { bg: '#ECFEFF', text: '#0891B2' },
  { bg: '#FFF1F2', text: '#E11D48' },
  { bg: '#F4F4F5', text: '#52525B' },
];

function getBadgeStyle(index) {
  return BADGE_COLORS[index % BADGE_COLORS.length];
}

export default React.memo(function TechnologyBadge({ label, index = 0 }) {
  const style = getBadgeStyle(index);
  return (
    <span
      className="tech-badge"
      style={{ background: style.bg, color: style.text }}
    >
      {label}
    </span>
  );
});
