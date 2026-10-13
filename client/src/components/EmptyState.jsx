import { Plus } from 'lucide-react';

export default function EmptyState({ filtered, onAdd, onClear }) {
  if (filtered) {
    return (
      <div className="empty">
        <h3>No matches</h3>
        <p className="muted">Nothing fits those filters. Try a different search or clear them.</p>
        <button className="btn btn-quiet" onClick={onClear}>Clear filters</button>
      </div>
    );
  }
  return (
    <div className="empty">
      <h3>Add your first application</h3>
      <p className="muted">Save the company, role and date. Move it through each stage as you hear back.</p>
      <button className="btn btn-primary" onClick={onAdd}>
        <Plus size={16} aria-hidden="true" /> Add application
      </button>
    </div>
  );
}
