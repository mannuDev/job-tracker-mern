import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api, { parseError } from '../api/client.js';
import useDebounce from '../hooks/useDebounce.js';
import Navbar from '../components/Navbar.jsx';
import PipelineBar from '../components/PipelineBar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import ApplicationList from '../components/ApplicationList.jsx';
import Board from '../components/Board.jsx';
import ApplicationModal from '../components/ApplicationModal.jsx';
import EmptyState from '../components/EmptyState.jsx';

const DEFAULT_FILTERS = { search: '', status: '', sort: 'newest' };

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [view, setView] = useState('list');
  const [modal, setModal] = useState(null); // null | { application?: object }
  const latest = useRef(0); // ignore responses from outdated requests

  const search = useDebounce(filters.search);
  const status = view === 'list' ? filters.status : '';

  const loadApplications = useCallback(async () => {
    const id = ++latest.current;
    try {
      const { data } = await api.get('/applications', {
        params: { search: search || undefined, status: status || undefined, sort: filters.sort },
      });
      if (id === latest.current) setApplications(data.applications);
    } catch (err) {
      if (id === latest.current) toast.error(parseError(err).message);
    } finally {
      if (id === latest.current) setLoading(false);
    }
  }, [search, status, filters.sort]);

  const loadStats = useCallback(async () => {
    try {
      const { data } = await api.get('/applications/stats');
      setStats(data);
    } catch {
      /* the list already reports connection errors */
    }
  }, []);

  useEffect(() => { loadApplications(); }, [loadApplications]);
  useEffect(() => { loadStats(); }, [loadStats]);

  const refresh = () => Promise.all([loadApplications(), loadStats()]);

  // Returns server field errors so the modal can show them; undefined means success.
  const save = async (form) => {
    const body = { ...form };
    delete body._id; delete body.user; delete body.createdAt; delete body.updatedAt; delete body.__v;
    try {
      if (modal?.application) {
        await api.put(`/applications/${modal.application._id}`, body);
        toast.success('Changes saved.');
      } else {
        await api.post('/applications', body);
        toast.success('Application added.');
      }
      setModal(null);
      refresh();
    } catch (err) {
      const { message, fields } = parseError(err);
      if (!Object.keys(fields).length) toast.error(message);
      return fields;
    }
  };

  const remove = async (app) => {
    try {
      await api.delete(`/applications/${app._id}`);
      toast.success('Application deleted.');
      refresh();
    } catch (err) {
      toast.error(parseError(err).message);
    }
  };

  // Drag a card between board columns: update the UI first, then confirm with the server.
  const move = async (app, newStatus) => {
    setApplications((list) => list.map((a) => (a._id === app._id ? { ...a, status: newStatus } : a)));
    try {
      await api.put(`/applications/${app._id}`, { status: newStatus });
      loadStats();
    } catch (err) {
      toast.error(parseError(err).message);
      refresh();
    }
  };

  const filtered = Boolean(search || status);
  const hasNone = !loading && applications.length === 0;

  return (
    <>
      <Navbar />
      <main className="page">
        <PipelineBar
          stats={stats}
          loading={!stats}
          activeStatus={filters.status}
          onSelect={(s) => { setView('list'); setFilters((f) => ({ ...f, status: s })); }}
        />

        <FilterBar filters={filters} setFilters={setFilters} view={view} setView={setView}
          onAdd={() => setModal({})} />

        {hasNone ? (
          <EmptyState filtered={filtered} onAdd={() => setModal({})}
            onClear={() => setFilters(DEFAULT_FILTERS)} />
        ) : view === 'list' ? (
          <ApplicationList applications={applications} loading={loading}
            onEdit={(a) => setModal({ application: a })} onDelete={remove} />
        ) : (
          <Board applications={applications} onEdit={(a) => setModal({ application: a })} onMove={move} />
        )}
      </main>

      {modal && (
        <ApplicationModal application={modal.application} onClose={() => setModal(null)} onSave={save} />
      )}
    </>
  );
}
