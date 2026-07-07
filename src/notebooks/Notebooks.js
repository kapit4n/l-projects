import React from 'react';
import ReactMarkdown from 'react-markdown';
import './Notebooks.css';

function CodeCell({ source, outputs }) {
  return (
    <div className="nb-cell nb-code-cell">
      <div className="nb-code-input">
        <div className="nb-prompt">In</div>
        <pre className="nb-code"><code>{source.join('')}</code></pre>
      </div>
      {outputs?.length > 0 && (
        <div className="nb-outputs">
          {outputs.map((output, i) => (
            <Output key={i} output={output} />
          ))}
        </div>
      )}
    </div>
  );
}

function Output({ output }) {
  switch (output.output_type) {
    case 'stream':
      return (
        <pre className="nb-output nb-output-stream">
          {output.text?.join('')}
        </pre>
      );
    case 'execute_result':
    case 'display_data':
      if (output.data?.['image/png']) {
        return (
          <div className="nb-output nb-output-image">
            <img src={`data:image/png;base64,${output.data['image/png']}`} alt="" />
          </div>
        );
      }
      if (output.data?.['text/html']) {
        return (
          <div className="nb-output nb-output-html"
            dangerouslySetInnerHTML={{ __html: output.data['text/html'].join('') }}
          />
        );
      }
      if (output.data?.['text/plain']) {
        return (
          <pre className="nb-output nb-output-text">
            {output.data['text/plain'].join('')}
          </pre>
        );
      }
      return null;
    case 'error':
      return (
        <pre className="nb-output nb-output-error">
          {output.traceback?.join('\n') || `${output.ename}: ${output.evalue}`}
        </pre>
      );
    default:
      return null;
  }
}

function MarkdownCell({ source }) {
  return (
    <div className="nb-cell nb-markdown-cell">
      <ReactMarkdown>{source.join('')}</ReactMarkdown>
    </div>
  );
}

function NotebookViewer({ notebook }) {
  return (
    <div className="nb-notebook">
      {notebook.cells.map((cell, i) => {
        const key = cell.id || `cell-${i}`;
        if (cell.cell_type === 'markdown') {
          return <MarkdownCell key={key} source={cell.source} />;
        }
        if (cell.cell_type === 'code') {
          return <CodeCell key={key} source={cell.source} outputs={cell.outputs} />;
        }
        return null;
      })}
    </div>
  );
}

export default function Notebooks() {
  const [notebook, setNotebook] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch('/data/notebooks/analysis.ipynb')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load notebook (${res.status})`);
        return res.json();
      })
      .then(setNotebook)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="nb-page">
        <div className="nb-loading">
          <div className="nb-loading-pulse" />
          <p>Loading notebook...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nb-page">
        <div className="nb-error">
          <h2>Notebook not available</h2>
          <p>{error.message}</p>
          <p className="nb-error-hint">
            Make sure the notebook file exists at <code>public/data/notebooks/analysis.ipynb</code>
            and the dev server is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="nb-page">
      <div className="nb-page-header">
        <h1>Projects Analysis</h1>
        <p className="nb-page-subtitle">
          Jupyter notebook with data analysis of all registered projects
        </p>
      </div>
      <NotebookViewer notebook={notebook} />
    </div>
  );
}