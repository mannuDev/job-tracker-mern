import { STATUSES } from '../utils/format.js';

// The signature element: your whole search as one proportional bar.
export default function PipelineBar({ stats, activeStatus, onSelect, loading }) {
  const total = stats?.total ?? 0;
  const counts = stats?.counts ?? {};

  return (
    <section className="pipeline" aria-label="Application pipeline">
      <div className="pipeline-head">
        <h2>
          {loading ? 'Loading…' : total === 0 ? 'No applications yet' : `${total} application${total === 1 ? '' : 's'} in play`}
        </h2>
        {total > 0 && (
          <p className="muted">
            {counts.Interview || 0} interviewing, {counts.Offer || 0} with offers
          </p>
        )}
      </div>

      <div className="pipeline-bar" role="img" aria-label={STATUSES.map((s) => `${counts[s] || 0} ${s}`).join(', ')}>
        {total === 0 ? (
          <span className="seg seg-empty" style={{ flexGrow: 1 }} />
        ) : (
          STATUSES.filter((s) => counts[s] > 0).map((s) => (
            <span key={s} className={`seg seg-${s.toLowerCase()}`} style={{ flexGrow: counts[s] }} />
          ))
        )}
      </div>

      <div className="pipeline-legend">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`legend-item ${activeStatus === s ? 'is-active' : ''}`}
            onClick={() => onSelect(activeStatus === s ? '' : s)}
            aria-pressed={activeStatus === s}
          >
            <span className={`badge-dot dot-${s.toLowerCase()}`} aria-hidden="true" />
            <strong>{counts[s] || 0}</strong> {s}
          </button>
        ))}
      </div>
    </section>
  );
}
