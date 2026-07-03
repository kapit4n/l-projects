import React from 'react';
import { Link } from 'react-router-dom';
import DateFromNow from '../DateFromNow';
import TechnologyBadge from '../TechnologyBadge/TechnologyBadge';
import './ProjectCard.css';

function ProjectActions({ project, onMoveUp }) {
  return (
    <div className="project-actions">
      <button
        className="action-btn action-btn-primary"
        onClick={() => onMoveUp(project)}
        aria-label={`Move ${project.name} to top`}
        title="Move up"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3V13M8 3L4 7M8 3L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <Link to={`/details/${project.id}`} className="action-btn" aria-label={`View ${project.name} details`} title="View">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3C4.5 3 2 8 2 8C2 8 4.5 13 8 13C11.5 13 14 8 14 8C14 8 11.5 3 8 3Z" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </Link>
      <a href={project.dir} className="action-btn" target="_blank" rel="noopener noreferrer" aria-label={`${project.name} on GitHub`} title="GitHub">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      </a>
    </div>
  );
}

const ProjectCardInner = React.memo(function ProjectCardInner({ project, onMoveUp }) {
  const languageKeys = project.languageKeys || [];
  const skills = project.skills || [];
  const features = project.features || [];

  return (
    <article className="project-card">
      <Link to={`/details/${project.id}`} className="project-card-image-link" aria-label={`View ${project.name} details`}>
        <div className="project-card-image">
          <img src={project.img} alt={project.name} loading="lazy" />
        </div>
      </Link>

      <div className="project-card-content">
        <div className="project-card-header">
          <h3 className="project-card-name">
            <Link to={`/details/${project.id}`}>
              {project.name}
            </Link>
          </h3>
          <span className="project-card-commits">{project.totalCommits || project.contributions || 0} commits</span>
        </div>

        <div className="project-card-badges">
          {languageKeys.map((lang, i) => (
            <TechnologyBadge key={lang} label={lang} index={i} />
          ))}
          {skills.map((skill, i) => (
            <TechnologyBadge key={skill} label={skill} index={languageKeys.length + i} />
          ))}
        </div>

        <div className="project-card-meta">
          {project.startDate && (
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1.5" y="2.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M1.5 5.5H12.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M4.5 1V3.5M9.5 1V3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Created <DateFromNow date={project.startDate} />
            </span>
          )}
          {project.updatedDate && (
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M7 4V7.5L9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Updated <DateFromNow date={project.updatedDate} />
            </span>
          )}
        </div>

        {project.description && (
          <p className="project-card-description">{project.description}</p>
        )}

        {features.length > 0 && (
          <div className="project-card-features">
            {features.slice(0, 3).map((feat) => (
              <Link
                key={feat}
                to={`/projects/${project.id}/features/1`}
                className="feature-link"
              >
                {feat}
              </Link>
            ))}
          </div>
        )}

        {project.billing || project.website ? (
          <div className="project-card-links">
            {project.dir && (
              <a href={project.dir} target="_blank" rel="noopener noreferrer" className="card-link">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5.5 3.5H3.5C2.94772 3.5 2.5 3.94772 2.5 4.5V10.5C2.5 11.0523 2.94772 11.5 3.5 11.5H9.5C10.0523 11.5 10.5 11.0523 10.5 10.5V8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M8 2.5H11.5M11.5 2.5V6M11.5 2.5L6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                GitHub
              </a>
            )}
          </div>
        ) : null}
      </div>

      <div className="project-card-footer">
        <ProjectActions project={project} onMoveUp={onMoveUp} />
      </div>
    </article>
  );
});

export default function ProjectCard({ projects, onMoveUp }) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="project-grid">
      {projects.map((project) => (
        <ProjectCardInner
          key={project.id || project.projectName}
          project={project}
          onMoveUp={onMoveUp}
        />
      ))}
    </div>
  );
}
