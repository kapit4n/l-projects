import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './Docs.css';

function getDocType(path) {
  const ext = path?.split('.').pop()?.toLowerCase();
  if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  if (ext === 'pdf') return 'pdf';
  if (['md', 'mdx'].includes(ext)) return 'markdown';
  if (ext === 'rst') return 'rst';
  return 'markdown';
}

function GitHubRawUrl({ projectName, doc }) {
  if (doc.url) return doc.url;
  const path = doc.path?.startsWith('/') ? doc.path.slice(1) : doc.path;
  return `https://raw.githubusercontent.com/kapit4n/${projectName}/main/${path}`;
}

function DocumentViewer({ doc, projectName }) {
  const type = getDocType(doc.path);

  if (type === 'pdf') {
    const src = GitHubRawUrl({ projectName, doc });
    return (
      <div className="docs-content docs-pdf">
        <embed src={src} type="application/pdf" className="docs-pdf-viewer" />
        <a href={src} target="_blank" rel="noopener noreferrer" className="docs-pdf-download" download>
          Open PDF in new tab
        </a>
      </div>
    );
  }

  if (type === 'video') {
    const src = GitHubRawUrl({ projectName, doc });
    return (
      <div className="docs-content docs-video">
        <video controls className="docs-video-player">
          <source src={src} type={`video/${type === 'webm' ? 'webm' : 'mp4'}`} />
        </video>
      </div>
    );
  }

  return (
    <div className="docs-content">
      <ReactMarkdown>{doc.content}</ReactMarkdown>
    </div>
  );
}

export default function Docs() {
  const { name } = useParams();
  const [documents, setDocuments] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function loadDocs() {
      setLoading(true);
      setError(null);
      try {
        let res = await fetch(`http://localhost:8000/repo-details/${name}/docs`);
        let data = res.ok ? await res.json() : { documents: [] };
        if (!res.ok || !data.documents?.length) {
          await fetch(`http://localhost:8000/repo-details/${name}/fetch`, { method: 'POST' });
          res = await fetch(`http://localhost:8000/repo-details/${name}/docs`);
          if (!res.ok) throw new Error('No documents found');
          data = await res.json();
        }
        const sorted = (data.documents || []).sort((a, b) => a.path.localeCompare(b.path));
        setDocuments(sorted);
        if (sorted.length > 0) setSelected(sorted[0]);
      } catch {
        setError('No documents found');
      }
      setLoading(false);
    }
    loadDocs();
  }, [name]);

  if (loading) {
    return (
      <div className="docs-page">
        <div className="docs-loading">
          <div className="docs-loading-pulse" />
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error || documents.length === 0) {
    return (
      <div className="docs-page">
        <div className="docs-page-header">
          <div className="docs-page-header-left">
            <Link to={`/details/${name}`} className="docs-back-link">&larr; Back to project</Link>
          </div>
        </div>
        <div className="docs-empty">
          <h2>No documents found</h2>
          <p>This project does not have any documentation files to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div className="docs-page-header-left">
          <Link to={`/details/${name}`} className="docs-back-link">&larr; Back to project</Link>
          <h1>Documentation</h1>
          <span className="docs-project-name">/ {name}</span>
        </div>
      </div>
      <div className="docs-body">
        <aside className="docs-sidebar">
          <p className="docs-sidebar-title">Documents</p>
          <ul className="docs-sidebar-list">
            {documents.map((doc) => (
              <li key={doc.path}>
                <button
                  className={`docs-sidebar-item${selected?.path === doc.path ? ' active' : ''}`}
                  onClick={() => setSelected(doc)}
                >
                  <span className="docs-sidebar-item-icon">
                    {getDocType(doc.path) === 'pdf' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    )}
                    {getDocType(doc.path) === 'video' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                    )}
                    {getDocType(doc.path) === 'markdown' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    )}
                  </span>
                  <span className="docs-sidebar-item-label">{doc.name}</span>
                  <span className="docs-sidebar-item-path">{doc.path}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        {selected && <DocumentViewer doc={selected} projectName={name} />}
      </div>
    </div>
  );
}