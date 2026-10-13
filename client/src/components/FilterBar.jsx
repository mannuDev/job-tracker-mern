import { Search, LayoutList, Columns3, Plus } from 'lucide-react';
import { STATUSES } from '../utils/format.js';

export default function FilterBar({ filters, setFilters, view, setView, onAdd }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <div className="filters">
      <label className="search">
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search company or role"
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          aria-label="Search company or role"
        />
      </label>

      <select
        value={filters.status}
        onChange={(e) => set({ status: e.target.value })}
        disabled={view === 'board'}
        aria-label="Filter by status"
        title={view === 'board' ? 'The board already groups by status' : undefined}
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select value={filters.sort} onChange={(e) => set({ sort: e.target.value })} aria-label="Sort applications">
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="company">Company A to Z</option>
      </select>

      <div className="seg-toggle" role="group" aria-label="View">
        <button className={view === 'list' ? 'is-on' : ''} onClick={() => setView('list')} aria-pressed={view === 'list'}>
          <LayoutList size={16} aria-hidden="true" /> List
        </button>
        <button className={view === 'board' ? 'is-on' : ''} onClick={() => setView('board')} aria-pressed={view === 'board'}>
          <Columns3 size={16} aria-hidden="true" /> Board
        </button>
      </div>

      <button className="btn btn-primary add-btn" onClick={onAdd}>
        <Plus size={16} aria-hidden="true" />
        Add application
      </button>
    </div>
  );
}
