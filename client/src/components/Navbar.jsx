import { LogOut, Pin } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">
          <Pin size={20} aria-hidden="true" />
          <span>Jobwise</span>
        </div>
        <div className="nav-user">
          <span className="nav-name" title={user.email}>{user.name}</span>
          <button className="btn btn-quiet" onClick={logout}>
            <LogOut size={16} aria-hidden="true" />
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
