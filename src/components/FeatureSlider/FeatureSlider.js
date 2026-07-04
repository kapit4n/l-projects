import React from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import './FeatureSlider.css';

const ArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function Slider({ features }) {
  const [current, setCurrent] = React.useState(0);
  const [descriptions, setDescriptions] = React.useState({});

  React.useEffect(() => {
    const fetchDescs = async () => {
      const results = {};
      for (const f of features) {
        if (f.desc && !results[f.name]) {
          try {
            const res = await axios.get(f.desc);
            results[f.name] = res.data;
          } catch {
            results[f.name] = '';
          }
        }
      }
      setDescriptions(results);
    };
    if (features?.length) fetchDescs();
  }, [features]);

  if (!features?.length) return null;

  const feature = features[current];
  const total = features.length;
  const desc = descriptions[feature.name] || '';

  const goTo = (index) => setCurrent(index);
  const prev = () => setCurrent((c) => (c === 0 ? total - 1 : c - 1));
  const next = () => setCurrent((c) => (c === total - 1 ? 0 : c + 1));

  return (
    <div className="feature-slider">
      <div className="feature-slider-viewport">
        <div className="feature-slider-image-wrap">
          <img src={feature.img} alt={feature.name} />
        </div>
        {desc && (
          <div className="feature-slider-desc">
            <ReactMarkdown>{desc}</ReactMarkdown>
          </div>
        )}
      </div>

      {total > 1 && (
        <>
          <button className="feature-slider-btn feature-slider-btn-prev" onClick={prev}><ArrowLeft /></button>
          <button className="feature-slider-btn feature-slider-btn-next" onClick={next}><ArrowRight /></button>
          <div className="feature-slider-dots">
            {features.map((_, i) => (
              <button
                key={i}
                className={`feature-slider-dot${i === current ? ' active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function FeatureSlider({ features }) {
  const [activeTab, setActiveTab] = React.useState(0);
  const raw = features || [];
  const groups = raw.length && !raw[0].features
    ? [{ group: '', features: raw }]
    : raw;

  if (!groups.length) return null;

  const hasMultipleGroups = groups.length > 1;
  const currentGroup = groups[activeTab];

  return (
    <section className="detail-section feature-slider-section">
      <h3 className="detail-section-title">Feature Screenshots</h3>
      {hasMultipleGroups && (
        <div className="feature-slider-tabs">
          {groups.map((g, i) => (
            <button
              key={g.group || i}
              className={`feature-slider-tab${i === activeTab ? ' active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {g.group || 'General'}
            </button>
          ))}
        </div>
      )}
      {currentGroup && (
        <Slider features={currentGroup.features} />
      )}
    </section>
  );
}
