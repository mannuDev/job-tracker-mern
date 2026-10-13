import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { STATUSES, toInputDate, today } from '../utils/format.js';

const blank = () => ({
  company: '', role: '', status: 'Applied', appliedDate: today(), location: '', jobLink: '', notes: '',
});

export default function ApplicationModal({ application, onClose, onSave }) {
  const editing = Boolean(application);
  const [form, setForm] = useState(
    editing ? { ...blank(), ...application, appliedDate: toInputDate(application.appliedDate) } : blank()
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const firstField = useRef(null);

  useEffect(() => {
    firstField.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const change = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const local = {};
    if (!form.company.trim()) local.company = 'Enter the company name.';
    if (!form.role.trim()) local.role = 'Enter the job role.';
    if (form.jobLink && !/^https?:\/\//i.test(form.jobLink)) {
      local.jobLink = 'Enter a full link starting with http:// or https://.';
    }
    if (Object.keys(local).length) return setErrors(local);

    setSaving(true);
    const fieldErrors = await onSave(form); // returns server field errors, or nothing on success
    setSaving(false);
    if (fieldErrors) setErrors(fieldErrors);
  };

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={form[name]}
        onChange={change}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-err` : undefined}
        {...props}
      />
      {errors[name] && <p className="field-error" id={`${name}-err`}>{errors[name]}</p>}
    </div>
  );

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <h2 id="modal-title">{editing ? 'Edit application' : 'Add application'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="grid-2">
            {field('company', 'Company', { ref: firstField, maxLength: 100, autoComplete: 'off' })}
            {field('role', 'Role', { maxLength: 100, autoComplete: 'off' })}
          </div>

          <div className="grid-2">
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={change}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            {field('appliedDate', 'Date applied', { type: 'date' })}
          </div>

          {field('location', 'Location', { maxLength: 100, placeholder: 'City or Remote' })}
          {field('jobLink', 'Job post link', { type: 'url', placeholder: 'https://' })}

          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" rows="4" maxLength={2000} value={form.notes} onChange={change}
              placeholder="Recruiter name, interview dates, salary range…" />
            {errors.notes && <p className="field-error">{errors.notes}</p>}
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-quiet" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
