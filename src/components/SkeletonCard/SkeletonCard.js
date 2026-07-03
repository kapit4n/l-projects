import React from 'react';
import './SkeletonCard.css';

function SkeletonPulse({ className }) {
  return <div className={`skeleton-pulse ${className || ''}`} />;
}

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <SkeletonPulse className="skeleton-image" />
      <div className="skeleton-body">
        <SkeletonPulse className="skeleton-title" />
        <div className="skeleton-badges">
          <SkeletonPulse className="skeleton-badge" />
          <SkeletonPulse className="skeleton-badge" />
          <SkeletonPulse className="skeleton-badge" />
        </div>
        <SkeletonPulse className="skeleton-text" />
        <SkeletonPulse className="skeleton-text skeleton-text-short" />
        <div className="skeleton-footer">
          <SkeletonPulse className="skeleton-action" />
          <SkeletonPulse className="skeleton-action" />
          <SkeletonPulse className="skeleton-action" />
        </div>
      </div>
    </div>
  );
}
