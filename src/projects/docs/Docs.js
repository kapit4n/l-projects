import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './Docs.css';

function DocumentViewer({ doc }) {
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
    fetch(`http://localhost:8000/repo-details/${name}/docs`)
      .then((res) => {
        if (!res.ok) throw new Error('No documents found');
        return res.json();
      })
      .then((data) => {
        const sorted = (data.documents || []).sort((a, b) => a.path.localeCompare(b.path));
        setDocuments(sorted);
        if (sorted.length > 0) setSelected(sorted[0]);
      })
      .catch(setError)
      .finally(() => setLoading(false));
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
                  {doc.name}
                  <span className="docs-sidebar-item-path">{doc.path}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        {selected && <DocumentViewer doc={selected} />}
      </div>
    </div>
  );
}