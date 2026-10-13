import { useState } from 'react';
import { Pencil, Trash2, ExternalLink, MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { formatDate } from '../utils/format.js';

function Row({ app, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="row">
      <div className="row-main">
        <p className="row-company">{app.company}</p>
        <p className="row-role">{app.role}</p>
        {app.notes && <p className="row-notes">{app.notes}</p>}
      </div>
      <div className="row-status"><StatusBadge status={app.status} /></div>
      <div className="row-meta">
        <span>Applied {formatDate(app.appliedDate)}</span>
        {app.location && (
          <span className="with-icon"><MapPin size={13} aria-hidden="true" />{app.location}</span>
        )}
      </div>
      <div className="row-actions">
        {app.jobLink && (
          <a className="icon-btn" href={app.jobLink} target="_blank" rel="noopener noreferrer" aria-label={`Open job post for ${app.company}`}>
            <ExternalLink size={16} />
          </a>
        )}
        <button className="icon-btn" onClick={() => onEdit(app)} aria-label={`Edit ${app.company}`}>
          <Pencil size={16} />
        </button>
        {confirming ? (
          <span className="confirm">
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(app)}>Delete</button>
            <button className="btn btn-quiet btn-sm" onClick={() => setConfirming(false)}>Keep</button>
          </span>
        ) : (
          <button className="icon-btn" onClick={() => setConfirming(true)} aria-label={`Delete ${app.company}`}>
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </li>
  );
}

export default function ApplicationList({ applications, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <ul className="list" aria-busy="true" aria-label="Loading applications">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="row skeleton"><span /><span /><span /></li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="list">
      {applications.map((a) => (
        <Row key={a._id} app={a} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}
