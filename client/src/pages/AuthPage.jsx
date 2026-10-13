import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Pin } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { parseError } from '../api/client.js';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { user, checking, login, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!checking && user) return <Navigate to="/" replace />;

  const change = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
    setFormError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    const local = {};
    if (isRegister && !form.name.trim()) local.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) local.email = 'Enter a valid email address.';
    if (isRegister ? form.password.length < 8 : !form.password) {
      local.password = isRegister ? 'Use at least 8 characters.' : 'Enter your password.';
    }
    if (Object.keys(local).length) return setErrors(local);

    setBusy(true);
    try {
      if (isRegister) await register(form.name.trim(), form.email, form.password);
      else await login(form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      const { message, fields } = parseError(err);
      setErrors(fields);
      setFormError(Object.keys(fields).length ? '' : message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth">
      <div className="auth-card">
        <div className="brand brand-lg">
          <Pin size={22} aria-hidden="true" />
          <span>Jobwise</span>
        </div>
        <h1>{isRegister ? 'Create your account' : 'Log in'}</h1>
        <p className="muted">
          {isRegister ? 'Keep every application, interview and offer in one list.' : 'Pick up where your search left off.'}
        </p>

        {formError && <div className="alert" role="alert">{formError}</div>}

        <form onSubmit={submit} noValidate>
          {isRegister && (
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" autoComplete="name" value={form.name} onChange={change}
                aria-invalid={Boolean(errors.name)} />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={change}
              aria-invalid={Boolean(errors.email)} />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="pw">
              <input id="password" name="password" type={showPw ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={form.password} onChange={change} aria-invalid={Boolean(errors.password)} />
              <button type="button" className="icon-btn" onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch muted">
          {isRegister ? 'Already have an account? ' : 'New here? '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</Link>
        </p>
      </div>
    </main>
  );
}
