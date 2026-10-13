import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { STATUSES, formatDate } from '../utils/format.js';

export default function Board({ applications, onEdit, onMove }) {
  const [overCol, setOverCol] = useState(null);

  const drop = (e, status) => {
    e.preventDefault();
    setOverCol(null);
    const id = e.dataTransfer.getData('text/plain');
    const app = applications.find((a) => a._id === id);
    if (app && app.status !== status) onMove(app, status);
  };

  return (
    <div className="board">
      {STATUSES.map((status) => {
        const items = applications.filter((a) => a.status === status);
        return (
          <section
            key={status}
            className={`column ${overCol === status ? 'is-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setOverCol(status); }}
            onDragLeave={() => setOverCol(null)}
            onDrop={(e) => drop(e, status)}
            aria-label={`${status} column`}
          >
            <h3>
              <span className={`badge-dot dot-${status.toLowerCase()}`} aria-hidden="true" />
              {status} <span className="muted">{items.length}</span>
            </h3>
            {items.length === 0 && <p className="column-empty muted">Drop a card here</p>}
            {items.map((a) => (
              <article
                key={a._id}
                className="card"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', a._id)}
              >
                <p className="row-company">{a.company}</p>
                <p className="row-role">{a.role}</p>
                <p className="muted small">{formatDate(a.appliedDate)}</p>
                <button className="icon-btn card-edit" onClick={() => onEdit(a)} aria-label={`Edit ${a.company}`}>
                  <Pencil size={14} />
                </button>
              </article>
            ))}
          </section>
        );
      })}
    </div>
  );
}
