export const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

// <input type="date"> wants YYYY-MM-DD
export const toInputDate = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : '');

export const today = () => new Date().toISOString().slice(0, 10);
